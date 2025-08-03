import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import { NavBar } from "./NavBar";
import { ThemeToggleButton } from "./ThemeToggleButton";

export const RootLayout = () => {
    return (
        <Box>
            <header>
                <NavBar />
            </header>
            <main>
                <Outlet />
            </main>
        </Box>
    );
};
