// src/theme.js
import { extendTheme } from "@chakra-ui/react";

// You can customize these values
const customTheme = extendTheme({
    // Use a dark color palette with warm tones
    colors: {
        dark: {
            900: "#1A202C", // Deep charcoal-gray
            800: "#2D3748", // Slightly lighter charcoal
            700: "#4A5568", // Medium gray
            100: "#E2E8F0", // Light gray for text
        },
        brand: {
            // Warm accent colors
            500: "#FF7F50", // Coral
            400: "#FFC0CB", // Pink
        },
    },
    // Customize fonts for a cozy feel
    fonts: {
        heading: `'Poppins', sans-serif`,
        body: `'Roboto', sans-serif`,
    },
    // Global styles for the body
    styles: {
        global: {
            body: {
                bg: "dark.900", // Set the body background to the darkest color
                color: "dark.100", // Set the default text color
            },
        },
    },
    // Component-specific customizations
    components: {
        Button: {
            baseStyle: {
                _focus: {
                    boxShadow: "none",
                },
                borderRadius: "lg", // Rounded button corners
            },
            variants: {
                solid: {
                    bg: "brand.500",
                    color: "white",
                    _hover: {
                        bg: "brand.400",
                    },
                },
            },
        },
        Input: {
            defaultProps: {
                variant: "filled",
            },
            baseStyle: {
                field: {
                    bg: "dark.800",
                    _focus: {
                        borderColor: "brand.500",
                    },
                },
            },
        },
    },
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
});

export default customTheme;
