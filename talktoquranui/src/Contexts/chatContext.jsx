import React, { createContext, useContext, useState } from "react";

// Context
const ChatContext = createContext(null);

// Context Provider
export const ChatProvider = ({ children }) => {
  const [input, setInput] = useState("");

  return (
    <ChatContext.Provider value={{ input, setInput }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the context
export const useChat = () => useContext(ChatContext);
