import { useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import type { INewsFormInput, NewsDataType } from "~/types/news";

// Step Components (defined below)
import NewsBasicInfoForm from "./NewsBasicInfoForm";
import NewsContentForm from "./NewsContentForm";

const steps = ["Basic Information", "News Content"];

export default function NewsEditorStepper({
    initialData,
    onSuccess,
}: {
    initialData: NewsDataType | null;
    onSuccess: () => void;
}) {
    const [activeStep, setActiveStep] = useState(0);

    const { control, handleSubmit } = useForm<INewsFormInput>({
        defaultValues: initialData || {
            title: "",
            description: "",
            category: [],
            content: [{ title: "", description: "", image_url: "" }],
            active: true,
        },
    });

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const onSubmit = async (data: INewsFormInput) => {
        console.log("Final Payload:", data);
        // await apiCall(data);
        onSuccess();
    };

    return (
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box component="form">
                {activeStep === 0 && <NewsBasicInfoForm control={control} />}
                {activeStep === 1 && <NewsContentForm control={control} />}

                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    <Box>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit(onSubmit)}
                                sx={{ bgcolor: "#003366" }}>
                                Submit News
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ bgcolor: "#003366" }}>
                                Next Step
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
