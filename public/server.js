 const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const main = require("./ChatBot");


app.use(bodyParser.json());

// Configure cors to allow requests from http://localhost:3000
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  exposedHeaders: ["Access-Control-Allow-Origin"],
}));


app.use(express.static(__dirname));

const PORT = 8080;

app.post("/api/ask", async (req, res) => {
  const { message } = req.body;

  try {
    const botResponse = await main(message);
    console.log(botResponse, "server side ");
    res.json(botResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = function (cb) {
  app.listen(PORT, () => {
    console.log("Express Server Started on Port " + PORT);
    cb();
  });
};