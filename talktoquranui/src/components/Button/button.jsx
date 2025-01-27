import React from "react";

const Button = ({ children, onClick, className, type = "button" }) => {
  const buttonClass = `transition duration-500 ease-in-out transform ${className}`;

  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
