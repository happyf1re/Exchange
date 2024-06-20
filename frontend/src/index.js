import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import store from './store/store';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                <App />
            </Router>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);

