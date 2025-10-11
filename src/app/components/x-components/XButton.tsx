import React from "react";
import { Button } from "@material-tailwind/react";
import { FaSpinner } from "react-icons/fa"; // For loading spinner icon

interface XButtonProps {
  color?: "blue" | "green" | "red" | "yellow" | "purple"; // You can extend this with other button colors
  onClick: () => void;
  onMouseEnter?: (_: any) => void; // Optional mouse enter handler
  onMouseLeave?: (_: any) => void; // Optional mouse leave handler
  disabled?: boolean;
  style?: React.CSSProperties; // For inline styles
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string; // For any additional custom styles
}

const XButton: React.FC<XButtonProps> = ({
  color = "blue", // Default to blue if no color is provided
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
  disabled = false,
  isLoading = false,
  children,
  className = "", // Default to empty string if no className is provided
}) => {
  return (
    <Button
      color={color}
      onClick={onClick}
      onMouseEnter={onMouseEnter} // Optional mouse enter handler
      onMouseLeave={onMouseLeave} // Optional mouse leave handler
      style={style} // Apply inline styles if provided
      disabled={disabled || isLoading} // Disable if either disabled or isLoading
      className={`w-full md:col-span-2 flex items-center justify-center ${className}`}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin w-5 h-5 text-white" /> // Loading spinner
      ) : (
        children // Render the button's text/content
      )}
    </Button>
  );
};

export default XButton;
