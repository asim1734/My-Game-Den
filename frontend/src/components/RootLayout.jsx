import React, { useState, useEffect } from "react";
import {
    Outlet,
    Link as RouterLink,
    useLocation,
    useNavigate,
} from "react-router-dom";
import {
    Box,
    Flex,
    Button,
    Heading,
    Spacer,
    useToast,
    Text,
    HStack,
    Image,
    Input,
    InputGroup, // NEW: Import InputGroup
    InputLeftElement, // NEW: Import InputLeftElement
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa"; // NEW: Import the search icon

// --- CHANGED: NavLink Helper ---
// We'll change the active style from a 'bg' to a 'borderBottom'
const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Button
            as={RouterLink}
            to={to}
            variant="ghost" // This will use our theme's ghost variant hover
            color="brand.300"
            // NEW: Clean underline style for active link
            borderBottom="2px solid"
            borderColor={isActive ? "brand.500" : "transparent"}
            borderRadius="0" // Makes the underline look sharp
            mx="2"
        >
            {children}
        </Button>
    );
};

export function RootLayout() {
    const navigate = useNavigate();
    const toast = useToast();
    const location = useLocation();

    const isAuthenticated = localStorage.getItem("x-auth-token");
    const username = localStorage.getItem("username");

    const [searchTerm, setSearchTerm] = useState("");

    // ... (Your useEffect hooks for search and logout logic are unchanged) ...
    // --- Debounce effect for search ---
    useEffect(() => {
        if (!searchTerm || searchTerm.trim().length < 2) {
            return;
        }
        const debounceTimer = setTimeout(() => {
            navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, navigate]);

    // --- Clear search term when navigating away ---
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
                // NEW: Replaced boxShadow with a subtle borderBottom
                borderBottom="1px solid"
                borderColor="brand.700"
            >
                {/* Logo/Brand */}
                <Image
                    src="/MyGameDenLogo.png" // Make sure this is your transparent logo
                    alt="My Game Den Logo"
                    h="55px"
                    mr={2}
                />

                <Spacer />

                {/* --- Centered Search Bar & Links --- */}
                <HStack
                    flex={{ base: 1, md: "none" }}
                    justify="center"
                    spacing="4"
                    mx={4}
                >
                    {/* NEW: Updated Search Input with Icon */}
                    <InputGroup
                        size="sm"
                        w={{ base: "150px", sm: "200px", md: "300px" }}
                    >
                        <InputLeftElement
                            pointerEvents="none"
                            children={<FaSearch color="gray.500" />}
                        />
                        <Input
                            placeholder="Search games..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="filled"
                            bg="brand.900"
                            color="brand.300"
                            _hover={{ bg: "brand.700" }}
                            _focus={{
                                bg: "brand.700",
                                borderColor: "brand.500",
                            }}
                            pl="2.5rem" // Add padding for the icon
                        />
                    </InputGroup>

                    {/* These NavLinks will now use the new style */}
                    <NavLink to="/browse">Browse</NavLink>
                    <HStack display={{ base: "none", lg: "flex" }}>
                        <NavLink to="/">Home</NavLink>
                        {isAuthenticated && (
                            <>
                                {/* --- UPDATED: Only "My Lists" is here --- */}
                                <NavLink to="/my-lists">My Lists</NavLink>
                            </>
                        )}
                    </HStack>
                </HStack>

                <Spacer />

                {/* --- Authentication Buttons --- */}
                {/* ... (This whole HStack is unchanged) ... */}
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
                                colorScheme="purple" // This should use brand colors
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
                                colorScheme="purple" // This will use brand.500
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
