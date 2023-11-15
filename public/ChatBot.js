// import the required dependencies
require("dotenv").config();
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a OpenAI connection
const secretKey = "";
const openai = new OpenAI({
  apiKey: secretKey,
});

async function askQuestion(question) {
  return new Promise((resolve, reject) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  });
}

let lastMessageForRun

const filePath = path.join(__dirname, 'data.txt');


async function main(message) {
  try {
    const file = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "assistants",
    });
    const assistant = await openai.beta.assistants.create({
      name: "Hotel Assitant",
      description:
        "You are great at communicating with guests. You analyze data present in .txt files, understand trends, and help guests with there Queries",
      model: "gpt-4-1106-preview",
      tools: [{ type: "code_interpreter" }],
      file_ids: [file.id],
    });

    // Log the first greeting
    console.log("\nWelcome to STAYS!\n");

    // Create a thread
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content:
            "Help Guests with their Queries based on the data from the file ",
          file_ids: [file.id],
        },
      ],
    });

    // Use keepAsking as state for keep asking questions
    let keepAsking = true;
    while (keepAsking) {
      // const userQuestion = await askQuestion("how may i help?");

      // Pass in the user question into the existing thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message,
      });

      // Use runs to wait for the assistant response and then retrieve it
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        model: "gpt-4-1106-preview",
        instructions: "additional instructions",
        tools: [{ type: "code_interpreter" }, { type: "retrieval" }],
      });

      let runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );

      // Polling mechanism to see if runStatus is completed
      while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      // Get the last assistant message from the messages array
      const messages = await openai.beta.threads.messages.list(thread.id);

      // Find the last message for the current run
       lastMessageForRun = messages.data
        .filter(
          (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop();

      if (lastMessageForRun) {
        return lastMessageForRun.content[0].text.value
        // console.log(`${lastMessageForRun.content[0].text.value} \n`);
      }
    }
    // close the readline
    readline.close();
  } catch (error) {
    console.error(error);
  }
}


module.exports = main;
