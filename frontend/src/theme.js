import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2', // Основной цвет для primary
        },
        secondary: {
            main: '#dc004e', // Основной цвет для secondary
        },
    },
});

export default theme;

