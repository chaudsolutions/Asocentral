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
import type { NewsCategoryType, NewsDataType } from "~/types/news";

// Step Components (defined below)
import NewsBasicInfoForm from "./NewsBasicInfoForm";
import NewsContentForm from "./NewsContentForm";
import { useConfirmDialog } from "~/context/ConfirmDialogContext";
import { postNewsData, updateNewsData } from "~/hooks/useNewsDataApi";
import { isAxiosError } from "axios";
import { useToast } from "~/context/ToastContext";
import NewsMetadataForm from "./NewsMetadataForm";
import type { UserType } from "~/types/user";
import { useFetchAllUsers, useNewsCategories } from "~/hooks/useCaching";
import { countriesStatesArray } from "~/utils/countries-states";

const steps = ["Basic Information", "News Content", "Metadata"];

export interface NewsFormData {
    title: string;
    description: string;
    category: NewsCategoryType[] | [];
    image_url: File | null;
    video_url: string | null;
    link: string;
    pubDate: Date | null;
    content: {
        title: string;
        description: string;
        image_url: File | null;
    }[];
    country: string[] | [];
    creator: UserType[] | [];
    keywords: string[] | [];
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
    const isEdit = !!initialData;
    const [activeStep, setActiveStep] = useState(0);

    const { showToast } = useToast();

    const { confirm } = useConfirmDialog();

    const { newsCategories = [], isNewsCategoriesLoading } =
        useNewsCategories();

    const countries = countriesStatesArray.map((country) => country.name);

    const { allUsers = [], isAllUsersLoading } = useFetchAllUsers();

    const {
        control,
        handleSubmit,
        reset,
        trigger,
        formState: { isSubmitting },
    } = useForm<NewsFormData>({
        defaultValues: {
            title: "",
            description: "",
            category: [],
            image_url: null,
            video_url: null,
            link: "",
            pubDate: null,
            content: [{ title: "", description: "", image_url: null }],
            country: [],
            creator: [],
            keywords: [],
        },
    });

    useEffect(() => {
        if (initialData && !isNewsCategoriesLoading) {
            const categories = initialData.category.map((cat) =>
                newsCategories.find((cat2) => cat2.name === cat),
            );

            const creators = initialData.creator.map((creator) =>
                allUsers.find((user) => user._id === creator),
            );

            const countries = initialData.country.map(
                (country) =>
                    countriesStatesArray.find(
                        (country2) => country2.name === country,
                    )?.name,
            );

            reset({
                title: initialData.title,
                description: initialData.description,
                category: categories || [],
                image_url: null,
                video_url: initialData.video_url,
                link: initialData.link,
                pubDate: initialData.pubDate
                    ? new Date(initialData.pubDate)
                    : null,
                content: initialData.content.map((content) => ({
                    title: content.title,
                    description: content.description,
                    image_url: null,
                })),
                country: countries || [],
                creator: creators || [],
                keywords: initialData.keywords,
            });
        }
    }, [initialData, reset, isNewsCategoriesLoading]);

    const handleNext = async () => {
        // This will check only the fields on the current step
        const isStepValid = await trigger([
            "title",
            "category",
            "image_url",
            "description",
            "pubDate",
        ]);
        if (isStepValid) {
            setActiveStep((prev) => prev + 1);
        }
    };
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const onSubmit: SubmitHandler<NewsFormData> = async (data) => {
        // process images and videos
        const payload = {
            title: data.title,
            description: data.description,
            category: data.category.map((cat) => cat.name),
            image_url:
                "https://cpmr-islands.org/wp-content/uploads/sites/4/2019/07/Test-Logo-Small-Black-transparent-1-300x300.png",
            video_url: "",
            link: data.link,
            pubDate: data.pubDate?.toISOString() || new Date().toISOString(),
            content: data.content.map((content) => ({
                title: content.title,
                description: content.description,
                image_url: "",
            })),
            country: data.country,
            creator: data.creator?.map((c) => c._id) || [],
            keywords: data.keywords,
        };

        try {
            if (isEdit) {
                await updateNewsData(initialData?._id || "", payload);
            } else {
                await postNewsData(payload);
            }

            onSuccess();
            onClose();
            showToast(
                `News ${isEdit ? "updated" : "created"} successfully`,
                "success",
            );
        } catch (error) {
            if (isAxiosError(error)) {
                showToast(
                    error.response?.data?.message || "Something went wrong",
                    "error",
                );
            } else {
                showToast("Something went wrong", "error");
            }
        }
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
                            bgcolor: "grey.200",
                        }}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontSize: ".8rem",
                            fontWeight: 600,
                        }}>
                        Go Back
                    </Typography>
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
                {activeStep === 0 && (
                    <NewsBasicInfoForm
                        control={control}
                        categories={newsCategories}
                        isNewsCategoriesLoading={isNewsCategoriesLoading}
                    />
                )}
                {activeStep === 1 && <NewsContentForm control={control} />}
                {activeStep === 2 && (
                    <NewsMetadataForm
                        control={control}
                        countries={countries}
                        creators={allUsers}
                        isCreatorsLoading={isAllUsersLoading}
                    />
                )}

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
                                loading={isSubmitting}
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
