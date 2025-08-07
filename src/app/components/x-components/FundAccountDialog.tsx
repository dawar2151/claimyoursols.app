import React from "react";
import { Dialog, DialogHeader, DialogBody, Button } from "@material-tailwind/react";

interface FundAccountDialogProps {
    open: boolean;
    onClose: () => void;
    userSolBalance: number | null;
    requiredSol: number | null;
}

const FundAccountDialog: React.FC<FundAccountDialogProps> = ({ open, onClose, userSolBalance, requiredSol }) => (
    <Dialog
        open={open}
        handler={onClose}
        className="bg-gradient-to-r from-purple-500 via-purple-400 to-cyan-400 rounded-lg shadow-lg backdrop-blur-lg"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
    >
        <DialogHeader
            className="text-white font-bold text-lg"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
        >
            Insufficient SOL Balance
        </DialogHeader>
        <DialogBody
            className="p-6 backdrop-blur-lg"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
        >
            <div className="space-y-4">
                <p className="text-white text-base">
                    You need to fund your wallet to continue.<br />
                    <span className="block mt-2">
                        <b>Your balance:</b> {userSolBalance !== null ? userSolBalance.toFixed(4) : "-"} SOL<br />
                        <b>Required:</b> {requiredSol !== null ? requiredSol.toFixed(4) : "-"} SOL
                    </span>
                    <span className="block mt-2">
                        Please deposit at least the required amount of SOL and try again.
                    </span>
                </p>
                <Button
                    color="blue"
                    onClick={onClose}
                    className="mt-4"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    Close
                </Button>
            </div>
        </DialogBody>
    </Dialog>
);

export default FundAccountDialog; 