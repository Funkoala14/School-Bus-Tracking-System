import AppRouter from './router';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        primary: {
            main: '#00E0A1', // Main primary color (e.g., green in this case)
            dark: '#112138',
            light: '#fff',
        },
        secondary: {
            main: '#1a3357', // Main secondary color (same green as primary)
        },
        // Define other colors as needed
        error: {
            main: '#f44336', // Red for errors
        },
        warning: {
            main: '#ffa726', // Orange for warnings
        },
        info: {
            main: '#2196f3', // Blue for informational messages
        },
        success: {
            main: '#4caf50', // Green for success messages
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            {/* <NotificationSnackbar /> */}
            <CssBaseline /> {/* This will apply Material-UI's baseline styles */}
            <AppRouter></AppRouter>
        </ThemeProvider>
    );
}

export default App;
