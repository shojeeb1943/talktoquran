import gsap from "gsap";
import React, { useEffect, useRef } from "react";

const GodRays = () => {
  const rayRefs = useRef([]); // Array to hold ray refs

  useEffect(() => {
    const rayElements = rayRefs.current;

    rayElements.forEach((ray, index) => {
      gsap.from(ray, {
        duration: 2 + index * 0.2, // Offset animation durations
        opacity: 0,
        width: `${Math.random() * 10 + 5}px`, // Random width between 5px - 15px
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        transform: "translateY(100%)", // Start rays below viewport
      });
    });
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {" "}
      {/* Prevent overflow */}
      {Array(10)
        .fill(null)
        .map(
          (
            _,
            index // Create 10 rays
          ) => (
            <div
              key={index}
              ref={(el) => (rayRefs.current[index] = el)}
              className={`absolute top-0 left-${
                index * 10
              }% w-auto h-full bg-gradient-to-b from-white/20 to-transparent rotate-${
                Math.random() * 5
              }`} // Random rotation
            />
          )
        )}
    </div>
  );
};

export default GodRays;
