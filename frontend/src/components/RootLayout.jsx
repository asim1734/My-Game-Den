// src/layouts/RootLayout.jsx
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import {
    Box,
    Flex,
    Button,
    Heading,
    Spacer,
    useToast,
    Text,
    HStack,
    Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaGamepad } from "react-icons/fa"; // Gamepad icon for branding

// Helper component for navigation links to handle active styling
const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Button
            as={RouterLink}
            to={to}
            variant="ghost"
            // Apply active styles
            bg={isActive ? "brand.500" : "transparent"}
            color={isActive ? "white" : "brand.300"}
            _hover={{
                bg: isActive ? "brand.600" : "rgba(128, 90, 213, 0.1)",
            }}
            mx="2"
        >
            {children}
        </Button>
    );
};

export function RootLayout() {
    const navigate = useNavigate();
    const toast = useToast();

    const isAuthenticated = localStorage.getItem("x-auth-token");
    const username = localStorage.getItem("username");

    const handleLogout = () => {
        // ... (logout logic remains the same)
        localStorage.removeItem("x-auth-token");
        localStorage.removeItem("username");
        toast({
            title: "Logged out.",
            description: "You have been successfully logged out.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
        navigate("/login");
    };

    return (
        // This structure ensures the footer sticks to the bottom
        <Flex direction="column" minHeight="100vh">
            {/* --- Sticky Navbar --- */}
            <Flex
                as="nav"
                p="4"
                bg="brand.800" // Use brand color
                align="center"
                position="sticky"
                top="0"
                zIndex="sticky"
                boxShadow="md"
            >
                <HStack
                    as={RouterLink}
                    to="/"
                    spacing="3"
                    _hover={{ textDecoration: "none" }}
                >
                    <Icon as={FaGamepad} boxSize="6" color="brand.500" />
                    <Heading size="md" color="white">
                        My Game Den
                    </Heading>
                </HStack>

                <Spacer />

                {/* --- Centered Navigation Links --- */}
                <HStack display={{ base: "none", md: "flex" }}>
                    <NavLink to="/">Home</NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink to="/lists/collection">
                                My Collection
                            </NavLink>
                            <NavLink to="/lists/wishlist">My Wishlist</NavLink>
                        </>
                    )}
                </HStack>

                <Spacer />

                {/* --- Authentication Buttons --- */}
                {isAuthenticated ? (
                    <HStack>
                        <Text color="gray.400" fontSize="sm">
                            Welcome, {username}
                        </Text>
                        <Button
                            colorScheme="purple"
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </HStack>
                ) : (
                    <HStack>
                        <Button
                            as={RouterLink}
                            to="/login"
                            variant="ghost"
                            size="sm"
                        >
                            Login
                        </Button>
                        <Button
                            as={RouterLink}
                            to="/register"
                            colorScheme="purple"
                            size="sm"
                        >
                            Register
                        </Button>
                    </HStack>
                )}
            </Flex>

            {/* --- Main Content Area --- */}
            <Box p="4" flex="1">
                <Outlet />
            </Box>

            {/* --- Footer --- */}
            <Box
                as="footer"
                p="4"
                bg="brand.800" // Use brand color
                color="gray.400"
                textAlign="center"
            >
                © {new Date().getFullYear()} My Game Den. All rights reserved.
            </Box>
        </Flex>
    );
}
