import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const PageLoader = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}>
            <CircularProgress size={50} color="warning" />
        </Box>
    );
};

export default PageLoader;
