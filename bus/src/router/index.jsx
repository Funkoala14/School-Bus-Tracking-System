// Import necessary modules and components from react-router-dom, React, and MUI (Material UI)
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import AppRoutes from "./routes";  // Importing the defined routes from the routes file
import { Suspense } from "react";  // Suspense for lazy loading components
import { createTheme, ThemeProvider } from "@mui/material";  // MUI theme utilities
import CircularProgress from "@mui/material/CircularProgress";  // Loading spinner component from MUI
import Box from "@mui/material/Box";  // Box component from MUI for layout

// Create a custom theme using MUI's createTheme function
const theme = createTheme({
    palette: {
        primary: {
            main: '#00E0A1',  // Main primary color (e.g., green in this case)
        },
        secondary: {
            main: '#00E0A1',  // Main secondary color (same green as primary)
        },
        // Define other colors as needed
        error: {
            main: '#f44336',  // Red for errors
        },
        warning: {
            main: '#ffa726',  // Orange for warnings
        },
        info: {
            main: '#2196f3',  // Blue for informational messages
        },
        success: {
            main: '#4caf50',  // Green for success messages
        },
    },
});

// Define a loading component that renders a spinner during lazy-loaded component loading
const Loading = () => {
    return (
        <div className="h-screen w-screen absolute flex justify-center items-center">
            <CircularProgress size={60} />  {/* Circular progress spinner with size 60 */}
        </div>
    );
};

// Define the main RouterView component that wraps the app with routing and theming
const RouterView = () => {
    return (
        <Router>
            {/* Suspense component shows the fallback loader while components load */}
            <Suspense fallback={<Loading />}>
                {/* Apply the MUI theme using ThemeProvider */}
                <ThemeProvider theme={theme}>
                    <AppRoutes />  {/* Render the defined routes */}
                </ThemeProvider>
            </Suspense>
        </Router>
    );
};

// Export the RouterView component as the default export
export default RouterView;
