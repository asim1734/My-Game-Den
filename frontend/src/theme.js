// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const colors = {
    brand: {
        900: "#171923", // Darkest background
        800: "#2d3748", // Component background (cards, footer)
        700: "#4a5568", // Borders and dividers
        500: "#805AD5", // Primary purple accent
        600: "#6B46C1", // Darker purple for hover
        300: "#e2e8f0", // Primary text color
    },
};

const styles = {
    global: (props) => ({
        body: {
            bg: "brand.900",
            color: "brand.300",
        },
    }),
};

const components = {
    Card: {
        baseStyle: {
            bg: "brand.800",
        },
    },
    Button: {
        variants: {
            solid: (props) => ({
                bg: "brand.500",
                color: "white",
                _hover: {
                    bg: "brand.600", // Use our brand's darker purple
                },
            }),
            // NEW: Refined ghost variant for a subtle hover effect
            ghost: (props) => ({
                _hover: {
                    bg: "rgba(128, 90, 213, 0.1)", // Faint purple background on hover
                },
            }),
        },
    },
};

const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

const theme = extendTheme({
    colors,
    styles,
    components,
    config,
});

export default theme;
