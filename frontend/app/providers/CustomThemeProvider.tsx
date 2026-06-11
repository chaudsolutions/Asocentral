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
            fontFamily: "Open Sans, sans-serif",
            h1: { ...headingFont, "@media (max-width:600px)": { fontSize: "1.6rem" } },
            h2: { ...headingFont, "@media (max-width:600px)": { fontSize: "1.4rem" } },
            h3: { ...headingFont, "@media (max-width:600px)": { fontSize: "1.15rem" } },
            h4: { ...headingFont, "@media (max-width:600px)": { fontSize: "1.1rem" } },
            h5: { ...headingFont, "@media (max-width:600px)": { fontSize: "0.95rem" } },
            h6: { ...headingFont, "@media (max-width:600px)": { fontSize: "0.85rem" } },
            body1: { "@media (max-width:600px)": { fontSize: "0.875rem" } },
            body2: { "@media (max-width:600px)": { fontSize: "0.78rem" } },
            subtitle1: { "@media (max-width:600px)": { fontSize: "0.875rem" } },
            subtitle2: { "@media (max-width:600px)": { fontSize: "0.78rem" } },
            caption: { "@media (max-width:600px)": { fontSize: "0.68rem" } },
            overline: { "@media (max-width:600px)": { fontSize: "0.68rem" } },
            button: { "@media (max-width:600px)": { fontSize: "0.78rem" } },
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
