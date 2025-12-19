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
// Updated: Import the centralized api instance instead of raw axios
import api from "../api"; 
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const handleShowClick = () => setShowPassword(!showPassword);

    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await userLogin();
        
        if (result.success) {
            toast({
                title: "Login successful!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            
            // Updated: Access token directly from response data
            localStorage.setItem("x-auth-token", result.data.token);
            localStorage.setItem("username", username);
            
            setUsername("");
            setPassword("");
            navigate("/");
        } else {
            // Updated: Improved error handling for production environments
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

    const userLogin = async () => {
        try {
            // Updated: Using the api instance with a relative path to avoid localhost hardcoding
            const res = await api.post("/auth/login", {
                username,
                password,
            });
            console.log("User logged in");
            return { success: true, data: res.data };
        } catch (e) {
            console.log(e);
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
                        Login
                    </Heading>
                    <Text
                        textAlign="center"
                        fontSize="sm"
                    >
                        Please enter your details to sign in.
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
                                    onChange={(e) => setUsername(e.target.value)}
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
                                        onChange={(e) => setPassword(e.target.value)}
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
                                colorScheme="brand" // Using brand colors for consistency
                                size="lg"
                                mt={4}
                            >
                                Log In
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Box>
    );
}