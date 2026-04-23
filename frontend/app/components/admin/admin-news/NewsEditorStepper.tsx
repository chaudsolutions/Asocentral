import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import type { NewsDataType } from "~/types/news";

// Step Components (defined below)
import NewsBasicInfoForm from "./NewsBasicInfoForm";
import NewsContentForm from "./NewsContentForm";
import { useConfirmDialog } from "~/context/ConfirmDialogContext";

const steps = ["Basic Information", "News Content"];

export interface NewsFormData {
    title: string;
    description: string;
    category: string[];
    image_url: string;
    video_url: string | null;
    link: string;
    pubDate: Date | null;
    content: {
        title: string;
        description: string;
        image_url: string;
    }[];
}

export default function NewsEditorStepper({
    initialData,
    onSuccess,
    onClose,
}: {
    initialData: NewsDataType | null;
    onSuccess: () => void;
    onClose: () => void;
}) {
    const [activeStep, setActiveStep] = useState(0);

    const { confirm } = useConfirmDialog();

    const { control, handleSubmit, reset } = useForm<NewsFormData>({
        defaultValues: {
            title: "",
            description: "",
            category: [],
            content: [{ title: "", description: "", image_url: "" }],
        },
    });

    useEffect(() => {
        reset({
            ...initialData,
            pubDate: new Date(initialData?.pubDate || ""),
        });
    }, [initialData, reset]);

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const onSubmit: SubmitHandler<NewsFormData> = async (data) => {
        console.log("Final Payload:", data);
        // await apiCall(data);
        onSuccess();
    };

    const handleGooBack = async () => {
        await confirm({
            title: "Go Back",
            message: "Are you sure you want to go back?",
            confirmText: "Yes",
            cancelText: "No",
            confirmColor: "warning",
            onConfirm: () => {
                onClose();
            },
        });
    };

    return (
        <Container maxWidth="md">
            <Stack
                direction="row"
                sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 4,
                }}>
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        alignItems: "center",
                    }}>
                    <IconButton
                        onClick={handleGooBack}
                        size="small"
                        color="error"
                        sx={{
                            bgcolor: "grey.400",
                        }}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="subtitle1">Go Back</Typography>
                </Stack>
            </Stack>
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
        </Container>
    );
}
