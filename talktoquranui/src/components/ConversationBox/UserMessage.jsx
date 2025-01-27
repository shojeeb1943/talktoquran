// UserMessage.js
import React from "react";

const UserMessage = ({ text }) => {
  return (
    <div className="flex justify-end fade-in my-[20px]">
      <div className="max-w-xs md:max-w-md lg:max-w-lg relative">
        {/* Pseudo-element for rounded gradient border */}
        <div className="rounded-lg relative p-[1px] message-wrapper overflow-hidden">
          {/* Message content with padding and background */}
          <div
            className="px-[24px] py-[16px] text-white font-Inter-Tight font-normal text-base message-wrapper"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
