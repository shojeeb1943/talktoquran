import React from "react";
import { useChat } from "../../Contexts/chatContext";
const Suggestion = () => {
  const questions = [
    {
      title: "Understanding Islam",
      description: "Explain the importance of patience from the Quran",
    },
    {
      title: "Daily Reflections",
      description: "Provide a daily verse for reflection and guidance",
    },
    {
      title: "Spiritual Guidance",
      description: "How does the Quran guide us in times of hardship?",
    },
    {
      title: "Prophetic Examples",
      description: "Share stories of prophets' perseverance from the Quran",
    },
  ];
  const { setInput } = useChat();
  const handleClick = (question) => {
    setInput(question);
  };

  return (
    <div className="max-w-[327px] md:max-w-[875px] mx-auto mt-[30px] md:mt-[72px] relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {questions.map((question, index) => (
          <div
            key={index}
            className="flex flex-col px-4 md:px-6 py-5 bg-[#1E1F2082] rounded-lg border-[1px] border-solid border-[#FFFFFF1F] hover:bg-[#1B1D20] hover:border-[#ffffff84] cursor-pointer transition-colors delay-[100ms]"
            onClick={() => handleClick(question.description)}
          >
            <p className="text-sm text-white font-Inter font-extrabold text-left cursor-pointer">
              {question.title}
            </p>
            <p className=" text-xs md:text-[13px] text-white font-normal mt-2 cursor-pointer">
              {question.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestion;
