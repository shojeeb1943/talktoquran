import React from "react";
import icon from "../../Assets/favicon.svg";
import ConversationBox from "../ConversationBox/conversationBox";
import Navbar from "../Navbar/navbar";
import Suggestion from "./Suggestion.component";

export default function Home({ showFullPage, onRequest }) {
  return (
    <>
      <Navbar showFullPage={showFullPage} />
      <div>
        <div
          className={`transition-opacity duration-500 ${
            showFullPage
              ? "block md:opacity-100"
              : "hidden md:opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center mx-auto gap-10 md:gap-[50px] mt-[100px]">
            <div className="w-[301.24px] md:w-[410px] text-[14.82px] md:text-[20.588px] font-Inter-Tight text-[#fff] ">
              <section className="mb-4 text-center">
                <p className="font-light">
                  <i>This is the Book!</i>
                </p>
              </section>
              <section className="mb-4 text-center">
                <p className="font-bold">
                  <i>
                    There is no doubt about it. A guide for
                    <br /> those mindful ˹of Allah˺.
                  </i>
                </p>
              </section>
            </div>
            <div className="flex items-center justify-center">
              <div className="mr-2">
                <img
                  src={icon}
                  alt="icon"
                  className="h-[30.84px] w-[30.63px] md:h-[53.97px] md:w-[53.6px]"
                />
              </div>
              <div>
                <p className="font-[Quantify] text-[38px] md:text-[66.5px] tracking-tight text-[#FFF4EA]">
                  Talk to Quran
                </p>
              </div>
            </div>
            <div>
              <Suggestion />
            </div>
          </div>
        </div>
        <div
          className={`transform transition-transform duration-500 ${
            showFullPage
              ? "md:scale-90"
              : "scale-100 md:absolute md:bottom-[30px] md:right-0 md:left-0 mx-auto"
          }`}
        >
          <ConversationBox showFullPage={showFullPage} onRequest={onRequest} />
        </div>
      </div>
    </>
  );
}
