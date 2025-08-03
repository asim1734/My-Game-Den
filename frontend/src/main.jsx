import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import "./axiosConfig";

import router from "./router";
import customTheme from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ColorModeScript
            initialColorMode={customTheme.config.initialColorMode}
        />
        <ChakraProvider theme={customTheme}>
            <RouterProvider router={router} />
        </ChakraProvider>
    </React.StrictMode>
);
