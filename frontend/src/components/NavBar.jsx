// src/components/NavBar.jsx
import {
    Box,
    Flex,
    Spacer,
    Heading,
    useColorModeValue,
} from "@chakra-ui/react";

export function NavBar() {
    const navBg = useColorModeValue("gray.100", "dark.900");

    const navTextColor = useColorModeValue("gray.800", "dark.100");

    return (
        <Box bg={navBg} px={4} py={3} boxShadow="md">
            <Flex alignItems="center">
                {/* Your logo or brand name */}
                <Heading size="md" color={navTextColor}>
                    Your App
                </Heading>

                <Spacer />
            </Flex>
        </Box>
    );
}
