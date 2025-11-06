import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none";

  const styles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    outline:
      "border border-gray-500 text-gray-200 hover:bg-gray-800 hover:text-white",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
