import AppRouter from './router';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { NotificationSnackbar } from './components/NotificationSnackbar/NotificationSnackbar';

const theme = createTheme({
    palette: {
        primary: {
            main: '#00E0A1', // Main primary color (e.g., green in this case)
            dark: '#00E0A1',
            light: '#fff',
        },
        secondary: {
            main: '#112138', // Main secondary color (same green as primary)
            light: '#1a3357',
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
    console.log('VITE_PORT:', import.meta.env.VITE_PORT);
    console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
    
    return (
        <ThemeProvider theme={theme}>
            <NotificationSnackbar />
            <CssBaseline /> {/* This will apply Material-UI's baseline styles */}
            <AppRouter></AppRouter>
        </ThemeProvider>
    );
}

export default App;
