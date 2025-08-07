import { Card, CardBody } from "@material-tailwind/react";
import { ClaimYourSolsStateContext } from "../providers";
import { useContext } from "react";
import { XTypography } from "../components/x-components/XTypography";

export const XCard = (props: { caption: string; description: string; icon?: React.ReactNode }) => {
    const { caption, description, icon } = props;
    const { isDarkMode } = useContext(ClaimYourSolsStateContext);

    return (
        <Card
            className={`w-auto rounded-lg shadow-md border backdrop-blur ${isDarkMode
                ? "bg-gradient-to-b from-gray-800 to-gray-700 text-gray-100 border-gray-700"
                : "bg-gradient-to-b from-gray-100 to-white text-gray-900 border-gray-300"}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
            <CardBody className="flex items-start gap-4 p-6" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {icon && (
                    <div className="flex-shrink-0 p-3 rounded-lg bg-gray-700/20 dark:bg-gray-300/20">
                        {icon}
                    </div>
                )}
                <div>
                    <XTypography
                        variant="h5"
                        color={isDarkMode ? "amber" : "blue-gray"}
                        className="mb-2 font-semibold"
                    >
                        {caption}
                    </XTypography>
                    <XTypography
                        color={isDarkMode ? "gray-300" : "gray-700"}
                        className="text-sm leading-relaxed"
                    >
                        {description}
                    </XTypography>
                </div>
            </CardBody>
        </Card>
    );
};
