/* import React, { useState } from "react";

const SimpleBot = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    try {
      if (newMessage) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: newMessage, isUser: true },
          { text: "Loading...", isUser: false, isOptimistic: true },
        ]);

        // Send user message to Electron main process
        await window.sendMessage.sendMessage("send-message-to-server", newMessage);

        // Receive the bot's reply using a callback
        window.receiveMessage.receiveMessage("bot-reply", (response) => {
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { text: response, isUser: false },
          ]);
        });

        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending user message to server:", error);
    }
  };


  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
      // Clear the input field
      setNewMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="header">Please Ask Your Queries</div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.isUser ? "user" : "bot"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          className="input"
          type="text"
          placeholder="Enter Your Query.."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default SimpleBot;
 */

import React, { useState, useEffect } from "react";

const SimpleBot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [inputHeight, setInputHeight] = useState("auto");
  const [messages, setMessages] = useState([]);

  const handleChat = () => {
    if (!userMessage.trim()) return;

    setUserMessage("");
    setInputHeight("auto");
  };

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
    setInputHeight("auto");
    setInputHeight(`${e.target.scrollHeight}px`);
  };

  useEffect(() => {
    const chatbox = document.querySelector(".chatbox");
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }, [userMessage]);

  const handleSendMessage = async () => {
    try {
      if (userMessage) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: userMessage, isUser: true },
          { text: "Loading...", isUser: false, isOptimistic: true },
        ]);

        // Send user message to Electron main process
        await window.sendMessage.sendMessage(
          "send-message-to-server",
          userMessage
        );

        // Receive the bot's reply using a callback
        window.receiveMessage.receiveMessage("bot-reply", (response) => {
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { text: response, isUser: false },
          ]);
        });

        setUserMessage("");
      }
    } catch (error) {
      console.error("Error sending user message to server:", error);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
      // Clear the input field
      setUserMessage("");
    }
  };

  return (
    <div className="show-chatbot">
      <div className="chatbot show-chatbot">
        <header>
          <h2>Chatbot</h2>
        </header>
        <ul className="chatbox">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`chat ${message.isUser ? "outgoing" : "incoming"}`}
            >
              {message.text}
            </li>
          ))}
        </ul>
        <div className="chat-input">
          <textarea
            value={userMessage}
            onChange={handleInputChange}
            style={{ height: inputHeight }}
            placeholder="Please Ask Your Queries."
            spellCheck="false"
            required
            onKeyDown={handleKeyPress}
          ></textarea>
          <span
            id="send-btn"
            className="material-symbols-rounded"
            onClick={handleChat}
          >
            send
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimpleBot;
