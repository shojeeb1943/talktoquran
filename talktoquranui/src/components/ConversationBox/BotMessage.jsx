// BotMessage.js
import React from "react";
import rewriteIcon from "../../Assets/Rewrite.svg";
import shareIcon from "../../Assets/Share.svg";
import botProfileImage from "../../Assets/bot.svg";
import copyIcon from "../../Assets/copy.svg";
const BotMessage = ({ text }) => {
  const handleRewrite = () => {
    console.log("Rewrite:", text);
    // Implement the rewrite functionality
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    console.log("Copied to clipboard:", text);
    // Provide user feedback as needed
  };

  const handleShare = () => {
    console.log("Share:", text);
    // Implement the share functionality, e.g., using the Web Share API
    if (navigator.share) {
      navigator.share({
        text: text,
        // You can also add URL or title as needed
      });
    }
  };

  return (
    <div className="flex items-end fade-in">
      {/* Adjusted to items-start to align the image and message at their top */}
      {/* Bot profile image */}
      <img
        src={botProfileImage}
        alt="Bot"
        className="mr-2 h-10 w-10 rounded-full"
      />
      {/* Adjust size and spacing as needed */}
      {/* Message bubble */}
      <div className="flex flex-col max-w-xs md:max-w-md lg:max-w-[785px] my-1 rounded-lg bg-[#ffffff] overflow-hidden relative">
        {/* Message text */}
        <div
          className="px-[24px] pb-[16px] pt-[24px] text-black text-base"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {text}

          {/* Action buttons container */}
          <div className="flex justify-end gap-[14px] pr-2 pb-2 pt-[16px]">
            {/* Rewrite action */}
            <div className="flex items-center relative" onClick={handleRewrite}>
              <img src={rewriteIcon} alt="Rewrite" className="h-4 w-4" />
              <button className="text-xs font-Inter-Tight font-normal text-[#979797] hover:text-[#909090] ml-1">
                Rewrite
              </button>
              {/* Vertical border */}
              <div className="absolute right-[-10px] top-1/2 transform -translate-y-1/2 h-3 w-0 border-r border-[#888888]"></div>
            </div>
            {/* Copy action */}
            <div
              className="flex items-center relative ml-2"
              onClick={handleCopy}
            >
              <img src={copyIcon} alt="Copy" className="h-4 w-4" />
              <button className="text-xs font-Inter-Tight font-normal text-[#979797] hover:text-[#909090] ml-1">
                Copy
              </button>
              {/* Vertical border */}
              <div className="absolute right-[-10px] top-1/2 transform -translate-y-1/2 h-3 w-0 border-r border-[#888888]"></div>
            </div>
            {/* Share action (last one, no border needed) */}
            <div className="flex items-center ml-2" onClick={handleShare}>
              <img src={shareIcon} alt="Share" className="h-4 w-4" />
              <button className="text-xs font-Inter-Tight font-normal text-[#979797] hover:text-[#909090] ml-1">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotMessage;
