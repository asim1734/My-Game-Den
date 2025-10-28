// src/components/RootLayout.jsx
import React, { useState, useEffect } from "react"; // Import useState, useEffect
import {
    Outlet,
    Link as RouterLink,
    useLocation,
    useNavigate,
} from "react-router-dom"; // Import useNavigate
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
    Input, // Import Input component
} from "@chakra-ui/react";
import { FaGamepad } from "react-icons/fa";

// Helper component for navigation links
const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Button
            as={RouterLink}
            to={to}
            variant="ghost"
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
    const location = useLocation(); // Keep location for NavLink

    const isAuthenticated = localStorage.getItem("x-auth-token");
    const username = localStorage.getItem("username");

    // --- State for search input ---
    const [searchTerm, setSearchTerm] = useState("");

    // --- Debounce effect for search ---
    useEffect(() => {
        // Don't navigate if search term is short or empty
        if (!searchTerm || searchTerm.trim().length < 2) {
            return;
        }

        const debounceTimer = setTimeout(() => {
            // Navigate to search results page
            navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
        }, 500); // 500ms delay

        // Cleanup: clear timer if user types again
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, navigate]);

    // --- Clear search term when navigating away from search results ---
    useEffect(() => {
        if (!location.pathname.startsWith("/search/")) {
            setSearchTerm("");
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("x-auth-token");
        localStorage.removeItem("username");
        toast({
            title: "Logged out.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
        navigate("/login");
    };

    return (
        <Flex direction="column" minHeight="100vh">
            {/* --- Sticky Navbar --- */}
            <Flex
                as="nav"
                p="4"
                bg="brand.800"
                align="center"
                position="sticky"
                top="0"
                zIndex="sticky"
                boxShadow="md"
            >
                {/* Logo/Brand */}
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

                {/* Spacer pushes center content */}
                <Spacer />

                {/* --- Centered Search Bar & Links --- */}
                <HStack
                    flex={{ base: 1, md: "none" }}
                    justify="center"
                    spacing="4"
                    mx={4}
                >
                    {/* Search Input */}
                    <Input
                        placeholder="Search games..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="filled"
                        size="sm"
                        w={{ base: "150px", sm: "200px", md: "300px" }} // Responsive width
                        bg="brand.900"
                        color="brand.300"
                        _hover={{ bg: "brand.700" }}
                        _focus={{ bg: "brand.700", borderColor: "brand.500" }}
                    />
                    {/* Navigation Links (Hidden on small screens if search takes up space) */}
                    <HStack display={{ base: "none", lg: "flex" }}>
                        {" "}
                        {/* Hide links earlier */}
                        <NavLink to="/">Home</NavLink>
                        {isAuthenticated && (
                            <>
                                <NavLink to="/lists/collection">
                                    Collection
                                </NavLink>
                                <NavLink to="/lists/wishlist">Wishlist</NavLink>
                            </>
                        )}
                    </HStack>
                </HStack>

                {/* Spacer pushes auth buttons right */}
                <Spacer />

                {/* --- Authentication Buttons --- */}
                <HStack>
                    {isAuthenticated ? (
                        <>
                            <Text
                                display={{ base: "none", md: "block" }}
                                color="gray.400"
                                fontSize="sm"
                                whiteSpace="nowrap"
                            >
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
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </HStack>
            </Flex>

            {/* --- Main Content Area --- */}
            <Box p="4" flex="1">
                <Outlet />
            </Box>

            {/* --- Footer --- */}
            <Box
                as="footer"
                p="4"
                bg="brand.800"
                color="gray.400"
                textAlign="center"
            >
                © {new Date().getFullYear()} My Game Den. All rights reserved.
            </Box>
        </Flex>
    );
}
