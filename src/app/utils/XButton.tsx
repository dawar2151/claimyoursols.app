import { useContext } from "react";
import { ClaimYourSolsStateContext } from "../providers";
import { Button } from "@material-tailwind/react";

export const XButton = (props: { action: () => void; caption: string, disabled?: boolean, variant?: string }) => {
    const { isDarkMode } = useContext(ClaimYourSolsStateContext);

    return (
        <Button
            size="lg"
            variant={props.variant as any ?? 'gradient'}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            {...props}
            disabled={props.disabled ?? false}
            onClick={props.action}
            className={`font-bold py-2 px-4 rounded text-white transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-600 hover:to-purple-600'
                }`}
        >
            {props.caption}
        </Button>
    );
};
