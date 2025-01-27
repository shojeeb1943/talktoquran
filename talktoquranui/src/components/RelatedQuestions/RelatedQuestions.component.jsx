import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import leftArrowSVG from "../../Assets/left.svg";
import rightArrowSVG from "../../Assets/right.svg";
import { useChat } from "../../Contexts/chatContext";
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const SuggestionBox = ({ latestBotResponse }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { setInput } = useChat();
  const handleOnclick = (question) => {
    setInput(question);
  };
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!latestBotResponse) return;

      setLoading(true);
      try {
        const response = await axios.post(
          "https://www.talktoquran.ai/api/api/chatbot/suggest",
          { context: latestBotResponse }
        );
        const processedSuggestions = response.data.suggestedQuestions.map(
          (question) => question.replace(/^-\s*/, "")
        );
        setSuggestions(processedSuggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [latestBotResponse]);

  const checkScroll = debounce(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setHasScrolled(container.scrollLeft > 0);
    }
  }, 100); // Adjust debounce time as needed

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 400; // Adjust as needed
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const startDrag = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollStart(scrollContainerRef.current.scrollLeft);
    e.preventDefault();
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    const x = e.pageX - startX;
    const scrollNew = scrollStart - x;
    scrollContainerRef.current.scrollLeft = scrollNew;
  };

  const stopDrag = () => {
    setIsDragging(false);
    checkScroll();
  };

  useEffect(() => {
    // Function to debounce the scroll check
    const debounceCheckScroll = debounce(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        setHasScrolled(container.scrollLeft > 0);
      }
    }, 100);

    // Get the current container from the ref
    const container = scrollContainerRef.current;

    // Check if the container exists before adding event listeners
    if (container) {
      container.addEventListener("scroll", debounceCheckScroll);

      // Return a cleanup function to remove the event listener when the component unmounts or ref changes
      return () => {
        container.removeEventListener("scroll", debounceCheckScroll);
      };
    }
  }, [scrollContainerRef]); // Include scrollContainerRef in the dependency array

  if (loading) {
    return <div>Loading suggestions...</div>;
  }

  return (
    <div className="relative max-w-[327px] md:max-w-[950px] mx-auto py-[6px] md:pt-[10px] overflow-hidden flex items-center">
      {hasScrolled && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 bg-gr-left py-[15px] pt-[12px] pr-[69px]"
        >
          <img src={leftArrowSVG} alt="Left" className="w-6 h-6" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex items-center overflow-x-auto suggestions-container scroll-smooth space-x-4 pl-4 pr-20 cursor-grab"
        onMouseDown={startDrag}
        onMouseMove={onDrag}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
        style={{ userSelect: "none" }}
      >
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex min-w-max text-center gap-10 px-5 py-2 font-Inter-Tight text-sm bg-[#524941] border border-solid border-[#C7B5A6] rounded-full text-white"
            onClick={() => handleOnclick(suggestion)}
          >
            {suggestion}
          </div>
        ))}
      </div>

      {suggestions.length > 1 && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-[0px] bg-gr-right py-[15px] pt-[12px] pl-[69px]"
        >
          <img src={rightArrowSVG} alt="Right" className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

SuggestionBox.propTypes = {
  latestBotResponse: PropTypes.string,
};

export default SuggestionBox;
