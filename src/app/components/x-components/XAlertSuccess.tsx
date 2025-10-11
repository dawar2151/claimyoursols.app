import React, { useContext } from "react";
import { Alert, Button } from "@material-tailwind/react";
import { ClaimYourSolsStateContext } from "@/app/providers";
import { getSolscanURL } from "@/app/utils";

// Define the props type
interface XAlertProps {
  hash?: string;
  type?: "account" | "tx";
}

const XAlert: React.FC<XAlertProps> = ({ hash, type = "tx" }) => {
  let color: any = "green"; // Using green for success, change as needed
  var message =
    "Success! Your transaction has been processed. View the details.";
  const { claimYourSolsState } = useContext(ClaimYourSolsStateContext);
  return (
    <Alert
      color={color}
      className="w-full md:col-span-2 bg-[#181818] text-white p-4 rounded-lg shadow-lg"
    >
      <div className="flex flex-col space-y-2">
        <p className="font-semibold text-lg">{message}</p>
        <div className="flex items-center space-x-2">
          <Button
            color="gray"
            ripple={true}
            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            placeholder={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            <a
              href={getSolscanURL(claimYourSolsState.network, hash || "", type)}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Solscan
            </a>
          </Button>
        </div>
      </div>
    </Alert>
  );
};

export default XAlert;
