import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import {
    Box,
    Flex,
    Button,
    Heading,
    Spacer,
    useToast,
    Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function RootLayout() {
    const navigate = useNavigate();
    const toast = useToast();
    const location = useLocation();

    const isAuthenticated = localStorage.getItem("x-auth-token");
    const username = localStorage.getItem("username");

    const handleLogout = () => {
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
        <Box>
            <Flex as="nav" p="4" bg="gray.700" color="white" align="center">
                <Heading size="md" as={RouterLink} to="/">
                    My Game Den
                </Heading>
                <Spacer />

                <Flex mx="auto">
                    <Button
                        as={RouterLink}
                        to="/"
                        variant="ghost"
                        color="white"
                        mx="2"
                    >
                        Home
                    </Button>
                    {isAuthenticated && (
                        <>
                            <Button
                                as={RouterLink}
                                to="/collection"
                                variant="ghost"
                                color="white"
                                mx="2"
                            >
                                My Collection
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/wishlist"
                                variant="ghost"
                                color="white"
                                mx="2"
                            >
                                My Wishlist
                            </Button>
                        </>
                    )}
                </Flex>

                <Spacer />

                {isAuthenticated ? (
                    <Flex align="center">
                        <Button colorScheme="red" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Flex>
                ) : (
                    <Flex>
                        <Button
                            as={RouterLink}
                            to="/login"
                            variant="ghost"
                            mr="4"
                            color="white"
                        >
                            Login
                        </Button>
                        <Button
                            as={RouterLink}
                            to="/register"
                            colorScheme="teal"
                        >
                            Register
                        </Button>
                    </Flex>
                )}
            </Flex>

            <Box p="4">
                <Outlet />
            </Box>

            <Box
                as="footer"
                p="4"
                mt="8"
                bg="gray.800"
                color="gray.400"
                textAlign="center"
            >
                © 2025 My Game Den
            </Box>
        </Box>
    );
}
