import { Typography, Tooltip } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline"; // Or another icon library

interface XTypologyProps {
  variant?: any;
  className?: string;
  children: React.ReactNode;
  title?: string;
  style?: any;
  color?: any;
  showIconTooltip?: boolean; // Optional: show tooltip on icon instead of text
}

export const XTypography: React.FC<XTypologyProps> = ({
  title,
  variant,
  className,
  style,
  color,
  children,
  showIconTooltip = true,
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Typography
        variant={variant}
        color={color}
        style={style}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        {children}
      </Typography>

      {title && showIconTooltip && (
        <Tooltip content={title}>
          <InformationCircleIcon className="w-4 h-4 text-blue-500 cursor-pointer" />
        </Tooltip>
      )}
    </div>
  );
};
