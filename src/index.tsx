import $ from "jquery";
import React from "react";
import { createRoot } from "react-dom/client";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import App from "./components/App";

const container = document.getElementById("root");
const root = createRoot(container!);

$(() => root.render(
    <React.StrictMode>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
            <App />
        </LocalizationProvider>
    </React.StrictMode>
));