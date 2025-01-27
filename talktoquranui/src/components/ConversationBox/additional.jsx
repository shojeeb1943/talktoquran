import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import btn from "../../Assets/btn-icon.svg";

const ConversationBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  let sessionId = localStorage.getItem("sessionId") || uuidv4();
  localStorage.setItem("sessionId", sessionId);

  const sendChatMessage = async (message) => {
    try {
      const response = await axios.post(
        "https://www.talktoquran.ai/api/api/chatbot/talk",
        { sessionId, prompt: message },
        { withCredentials: true }
      );
      return response.data.response;
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      return "Error: Unable to get response from chatbot.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, newUserMessage]);
    setInput("");

    const botResponse = await sendChatMessage(input);
    const newBotMessage = { sender: "bot", text: botResponse };
    setMessages((msgs) => [...msgs, newBotMessage]);
  };

  return (
    <div className="flex flex-col justify-between mt-[31px]">
      <div
        className="overflow-auto p-4"
        style={{ maxHeight: "calc(100vh - 76px)" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`inline-block max-w-xs md:max-w-md lg:max-w-lg p-2 my-1 rounded-lg ${
                msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center py-[11px] pr-[16px] pl-[40px] w-[1000px] bg-white border-t border-gray-200 mx-auto my-0 rounded-lg"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 resize-none p-2 m-1 rounded outline-none"
          rows="1"
          placeholder="How can I help?"
          style={{ maxHeight: "400px" }} // Set a max-height to control the expandable limit
        ></textarea>
        <button
          type="submit"
          className="flex items-center justify-center px-[40px] py-3 font-semibold text-white bg-[#1F2123] rounded-lg hover:bg-blue-600 shadow-[4px_4px_13px_0px_rgba(0,0,0,0.27)]"
        >
          <p className="text-[16px]">Get Answer</p>

          <img src={btn} alt="Icon" className="ml-2 w-[22px] h-[22px]" />
        </button>
      </form>
    </div>
  );
};

export default ConversationBox;
