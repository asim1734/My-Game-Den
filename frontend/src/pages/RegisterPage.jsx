import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Heading,
    Text,
    useToast,
    useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Updated: Import the centralized api instance instead of raw axios
import api from "../api"; 

export const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const handleShowClick = () => setShowPassword(!showPassword);

    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Passwords Do not match",
                description: "Enter the same password again",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        const result = await registerUser();

        if (result.success) {
            toast({
                title: "Registration successful!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setEmail("");
            navigate("/login");
        } else {
            // Improved error handling for production
            const errorMessage =
                result.error.response?.data?.message ||
                "Could not connect to the server. Please try again later.";
            
            toast({
                title: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const registerUser = async () => {
        try {
            // Updated: Using the api instance with a relative path
            const response = await api.post("/auth/register", {
                username,
                password,
                email,
            });
            return { success: true, data: response.data };
        } catch (e) {
            return { success: false, error: e };
        }
    };

    const formBgColor = useColorModeValue("white", "gray.800");
    const pageBgColor = useColorModeValue("gray.50", "gray.900");

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={pageBgColor}
        >
            <Box
                p={8}
                maxWidth="500px"
                borderWidth={1}
                borderRadius={8}
                boxShadow="lg"
                bg={formBgColor}
                width="100%"
            >
                <VStack spacing={4} align="stretch">
                    <Heading
                        as="h1"
                        size="xl"
                        textAlign="center"
                        mb={4}
                    >
                        Register
                    </Heading>
                    <Text
                        textAlign="center"
                        fontSize="sm"
                    >
                        Please enter your details to sign up.
                    </Text>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    minLength={4}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel htmlFor="email">Email address</FormLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <InputGroup size="md">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        minLength={8}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                                            {showPassword ? "Hide" : "Show"}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
                                <InputGroup size="md">
                                    <Input
                                        id="confirm-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                                            {showPassword ? "Hide" : "Show"}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>

                            <Button
                                type="submit"
                                colorScheme="brand" // Using your brand colors
                                size="lg"
                                mt={4}
                            >
                                Register
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Box>
    );
};