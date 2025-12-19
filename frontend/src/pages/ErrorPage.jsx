import React from "react";
import {
    Box,
    Heading,
    Text,
    Button,
    VStack,
    Icon,
    useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaGamepad } from "react-icons/fa";

export const ErrorPage = () => {
    const error = useRouteError();
    
    // Determine the error message
    let errorMessage = "An unexpected error occurred.";
    let errorStatus = "500";

    if (isRouteErrorResponse(error)) {
        errorStatus = error.status;
        errorMessage = error.statusText || error.data?.message || errorMessage;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    return (
        <Box 
            textAlign="center" 
            py={20} 
            px={6} 
            bg="brand.900" 
            minH="100vh" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
        >
            <VStack spacing={6}>
                {/* Visual Icon with a "Gamer" look */}
                <Box position="relative" display="inline-block">
                    <Icon as={FaGamepad} w={20} h={20} color="brand.700" opacity={0.3} />
                    <Icon 
                        as={FaExclamationTriangle} 
                        w={10} 
                        h={10} 
                        color="purple.500" 
                        position="absolute" 
                        bottom="-5px" 
                        right="-5px" 
                    />
                </Box>

                <VStack spacing={2}>
                    <Heading
                        display="inline-block"
                        as="h2"
                        size="4xl"
                        bgGradient="linear(to-r, purple.400, brand.500)"
                        backgroundClip="text"
                        fontWeight="extrabold"
                    >
                        {errorStatus}
                    </Heading>
                    <Text fontSize="2xl" color="white" fontWeight="bold">
                        {errorStatus === 404 ? "Game Over: Page Not Found" : "Software Crash!"}
                    </Text>
                    <Text color="gray.400" maxW="md">
                        {errorStatus === 404 
                            ? "The level you are looking for doesn't exist or has been moved to another dungeon." 
                            : errorMessage}
                    </Text>
                </VStack>

                <Button
                    as={RouterLink}
                    to="/"
                    leftIcon={<FaHome />}
                    colorScheme="purple"
                    bgGradient="linear(to-r, purple.500, purple.600)"
                    color="white"
                    variant="solid"
                    size="lg"
                    px={8}
                    _hover={{
                        bgGradient: "linear(to-r, purple.600, purple.700)",
                        transform: "scale(1.05)",
                    }}
                    transition="all 0.2s"
                >
                    Respawn at Home
                </Button>
            </VStack>
        </Box>
    );
};