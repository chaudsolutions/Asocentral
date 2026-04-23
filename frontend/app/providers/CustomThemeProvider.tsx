import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // Define a common style for all headings
    const headingFont = {
        fontFamily: "Roboto, sans-serif",
    };

    const muiTheme = createTheme({
        typography: {
            fontFamily: "Open Sans, sans-serif", // Default font for all non-heading elements
            h1: headingFont,
            h2: headingFont,
            h3: headingFont,
            h4: headingFont,
            h5: headingFont,
            h6: headingFont,
        },
        palette: {
            primary: {
                main: "#1F1A62",
                light: "#3f51b524",
                dark: "#201a62",
            },
            secondary: {
                main: "#dc004e",
                light: "#ff4081",
                dark: "#9a0036",
            },
        },
    });

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline enableColorScheme />
            {children}
        </MuiThemeProvider>
    );
};

export default CustomThemeProvider;
