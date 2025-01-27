import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import { v4 as uuidv4 } from "uuid";
import loaderAnimation from "../../Assets/Loader_Animation.json";
import btn from "../../Assets/btn-icon.svg";
import { useChat } from "../../Contexts/chatContext";
import Footer from "../Home/footer.component";
import SuggestionBox from "../RelatedQuestions/RelatedQuestions.component";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";

const ConversationBox = ({ onRequest, showFullPage }) => {
  const [latestmessage, setlatestmessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [, setTextareaHeight] = useState("auto");
  const [formHeight, setFormHeight] = useState("auto");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [showLoader, setShowLoader] = useState(false);
  const { input, setInput } = useChat();
  //Loader
  const [isLoading, setIsLoading] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    speed: 2,
  };
  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
    } else {
      // Hide the loader with a delay for a smoother transition
      const timer = setTimeout(() => setShowLoader(false), 300); // match the transition duration
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  //scroll to bottom

  useEffect(() => {
    setTextareaHeight(`${textareaRef.current.scrollHeight}px`);
    setFormHeight(`${Math.min(textareaRef.current.scrollHeight + 22, 202)}px`);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, input]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      // Delay scrolling to bottom until the new message is rendered and animated
      setTimeout(() => {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }, 100); // Adjust delay if necessary
    }
  };

  //session handling
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = uuidv4();
    let store = sessionId;
    let count = 0;
    if (store !== sessionId) {
      count++;
    }
    console.log("session number", count, "sessionId", sessionId);
    localStorage.setItem("sessionId", sessionId);
  }
  const sendChatMessage = async (message) => {
    try {
      const response = await axios.post(
        "https://www.talktoquran.ai/api/api/chatbot/talk",
        { sessionId, prompt: message },
        { withCredentials: true }
      );
      setlatestmessage(response.data.response);
      console.log(response.data.response);
      return response.data.response;
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      return "Error: Unable to get response from chatbot.";
    }
  };

  //Form submit
  const handleKeyDown = (e) => {
    // Enter key without Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior (adding a new line)
      handleSubmit(e); // Submit form
    }

    // Example for handling the Escape key
    if (e.key === "Escape") {
      // Your logic for the Escape key
      console.log("Escape key pressed");
    }

    // Add more keys as needed with additional if statements or a switch-case block
  };
  const handleChange = (e) => {
    setInput(e.target.value);
    const target = e.target;

    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (trimmedInput) {
      const newUserMessage = { sender: "user", text: trimmedInput };
      setMessages((msgs) => [...msgs, newUserMessage]);

      // Reset input state
      setInput("");

      // Reset textarea height to its normal state
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // Or set this to your default height if "auto" isn't appropriate
      }
      onRequest();
      setIsLoading(true); // Start loading

      try {
        const botResponse = await sendChatMessage(trimmedInput);
        const newBotMessage = { sender: "bot", text: botResponse };
        setMessages((msgs) => [...msgs, newBotMessage]);
      } catch (error) {
        console.error("Failed to send message or receive response:", error);
      } finally {
        setIsLoading(false); // Ensure loading state is reset
      }
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center md:mt-[31px]  ">
        <div
          ref={messageContainerRef}
          className="overflow-auto p-4 w-full message-container md:max-h-screen-230"
        >
          <div className=" md:w-[980px] mx-auto">
            {messages.map((msg, index) =>
              msg.sender === "user" ? (
                <UserMessage key={index} text={msg.text} />
              ) : (
                <BotMessage key={index} text={msg.text} />
              )
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
        {showLoader && (
          <div
            className="flex items-center justify-center transition-opacity duration-300 ease-in-out"
            style={{ opacity: isLoading ? 1 : 0 }}
          >
            <div className="flex items-center justify-center gap-4 bg-[rgba(255,255,255,0.11)] px-4 py-[10px] border-solid rounded-lg border-[1px] border-[#606060]">
              <Lottie
                options={defaultOptions}
                height={32}
                width={32}
                className="filter brightness-0 invert"
              />
              <p className="custom-pulse font-Inter text-lg font-normal text-[#fff]">
                Generating response
              </p>
            </div>
          </div>
        )}

        <SuggestionBox latestBotResponse={latestmessage} />
        <div
          className={
            showFullPage
              ? "flex items-center justify-center pt-0 md:pt-10"
              : "flex items-center justify-center pt-0 md:pt-[85px]"
          }
        >
          <div
            className="md:absolute md:w-[1000px] max-h-[200px] bottom-[5px] mx-auto"
            style={{ height: formHeight }}
          >
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-center pl-[16px] w-[327px] md:w-[1000px] bg-white border-t border-gray-200 mx-auto my-0 rounded-lg overflow-hidden"
              style={{ height: formHeight }}
            >
              <textarea
                value={input}
                ref={textareaRef}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="flex-1 resize-none py-2 md:py-[11px] pl-2 pr-4 md:pr-20 rounded outline-none transition-all duration-300 ease-in-out"
                rows="1"
                placeholder="How can I help?"
                style={{ maxHeight: "200px", minheight: "36px" }}
              ></textarea>
              <div className="flex items-center justify-center md:absolute md:right-0 md:bottom-0 md:mb-[9.5px] mr-4 md:mr-[16px]">
                <button
                  type="submit"
                  className="flex items-center justify-center px-[10px] md:px-[40px] py-3 font-semibold text-white bg-[#1F2123] rounded-lg shadow-[4px_4px_13px_0px_rgba(0,0,0,0.27)]"
                >
                  <img
                    src={btn}
                    alt="Icon"
                    className="w-[19.13px] h-[19.13px] md:w-[22px] md:h-[22px]"
                  />
                  <p className="text-[16px] ml-2 hidden md:block">Get Answer</p>
                </button>
              </div>
            </form>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationBox;
