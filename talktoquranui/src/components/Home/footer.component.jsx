import React from "react";

export default function Footer() {
  return (
    <div>
      <footer className="flex flex-col md:flex-row font-Inter text-xs items-center justify-center md:space-y-0 mt-2 md:mt-3">
        <p className="text-center md:text-left text-white">
          <i>Talk to Quran is in beta. Check for mistakes.</i>
        </p>
        <ul className="flex justify-center md:justify-start mt-2 md:mt-0 md:ml-4 space-x-1 md:space-x-2 lg:space-x-3">
          {["About Us", "Privacy", "FAQ’s", "Team", "Donate Us"].map(
            (item, index) => (
              <li
                key={index}
                className="hover:text-white text-[#888888] cursor-pointer"
              >
                {item}
                {index < 4 && ( // Add separator except for the last item
                  <span className="hidden md:inline text-gray-500 mx-2">|</span>
                )}
              </li>
            )
          )}
        </ul>
      </footer>
    </div>
  );
}
