import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ec407a', // Pink 400
            contrastText: '#fff',
        },
        secondary: {
            main: '#f48fb1', // Pink 200
        },
        background: {
            default: '#1a000d', // Very dark pink/black
            paper: '#2d0016', // Dark pink
        },
        text: {
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            letterSpacing: '0.02em',
        },
        h6: {
            fontWeight: 500,
        },
        button: {
            textTransform: 'none', // No uppercase buttons
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backgroundImage: 'none', // Remove default gradient
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                },
            },
        },
    },
});

export default theme;
