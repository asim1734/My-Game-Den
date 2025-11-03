import { extendTheme } from "@chakra-ui/react";
import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(inputAnatomy.keys);

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
        "::-webkit-scrollbar": {
            width: "10px",
            height: "10px",
        },
        "::-webkit-scrollbar-track": {
            background: "brand.900",
        },
        "::-webkit-scrollbar-thumb": {
            background: "brand.700",
            borderRadius: "5px",
        },
        "::-webkit-scrollbar-thumb:hover": {
            background: "brand.600",
        },
    }),
};

const inputOutline = definePartsStyle({
    field: {
        _focusVisible: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
        },
    },
});

const inputTheme = defineMultiStyleConfig({
    variants: { outline: inputOutline },
});

const components = {
    Card: {
        baseStyle: {
            bg: "brand.800",
            transition: "background 0.2s ease-in-out",
            _hover: {
                bg: "brand.700",
            },
        },
    },
    Link: {
        baseStyle: {
            _hover: {
                textDecoration: "underline",
                color: "brand.300",
            },
        },
    },
    Input: inputTheme,
    Button: {
        variants: {
            solid: (props) => ({
                bg: "brand.500",
                color: "white",
                _hover: {
                    bg: "brand.600",
                },
            }),

            ghost: (props) => ({
                _hover: {
                    bg: "rgba(128, 90, 213, 0.1)",
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
