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
import axios from "axios";
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
            setJWT(result.data.data.token);
            setUsername("");
            setPassword("");
            navigate("/");
        } else {
            const errorMessage =
                result.error.response.data.message ||
                "An unexpected Error occured";
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
            const res = await axios.post(
                "http://localhost:3000/api/auth/login",
                {
                    username,
                    password,
                }
            );
            return { success: true, data: res };
        } catch (e) {
            console.log(e);
            return { success: false, error: e };
        }
    };

    const setJWT = async (token) => {
        localStorage.setItem("x-auth-token", token);
    };

    const formBgColor = useColorModeValue("white", "dark.800");
    const pageBgColor = useColorModeValue("gray.50", "dark.900");

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
                        color={useColorModeValue("gray.700", "dark.100")}
                    >
                        Login
                    </Heading>
                    <Text
                        textAlign="center"
                        fontSize="sm"
                        color={useColorModeValue("gray.600", "dark.100")}
                    >
                        Please enter your details to sign in.
                    </Text>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="stretch">
                            {/* Username Input */}
                            <FormControl isRequired>
                                <FormLabel
                                    htmlFor="username"
                                    color={useColorModeValue(
                                        "gray.700",
                                        "dark.100"
                                    )}
                                >
                                    Username
                                </FormLabel>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </FormControl>

                            {/* Password Input */}
                            <FormControl isRequired>
                                <FormLabel
                                    htmlFor="password"
                                    color={useColorModeValue(
                                        "gray.700",
                                        "dark.100"
                                    )}
                                >
                                    Password
                                </FormLabel>
                                <InputGroup size="md">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button
                                            h="1.75rem"
                                            size="sm"
                                            onClick={handleShowClick}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                colorScheme="blue"
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
