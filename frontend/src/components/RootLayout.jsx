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
    Spacer,
    useToast,
    Text,
    HStack,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    IconButton,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    VStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    Kbd,
} from "@chakra-ui/react";
import {
    FaSearch,
    FaBars,
    FaHome,
    FaCompass,
    FaBookmark,
    FaUser,
    FaStar,
    FaLayerGroup,
    FaSignOutAlt,
} from "react-icons/fa";

const NavLink = ({ to, children, icon, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Button
            as={RouterLink}
            to={to}
            variant="ghost"
            size="sm"
            leftIcon={icon}
            color={isActive ? "white" : "gray.400"}
            bg={isActive ? "whiteAlpha.100" : "transparent"}
            _hover={{ bg: "whiteAlpha.200", color: "white" }}
            borderRadius="md"
            onClick={onClick}
        >
            {children}
        </Button>
    );
};

export function RootLayout() {
    const navigate = useNavigate();
    const toast = useToast();
    const location = useLocation();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const isAuthenticated = localStorage.getItem("x-auth-token");
    const username = localStorage.getItem("username");

    const [searchTerm, setSearchTerm] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);

    // Debounced search
    useEffect(() => {
        if (!searchTerm || searchTerm.trim().length < 2) {
            return;
        }
        const debounceTimer = setTimeout(() => {
            navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, navigate]);

    // Clear search when leaving search page
    useEffect(() => {
        if (!location.pathname.startsWith("/search/")) {
            setSearchTerm("");
        }
    }, [location.pathname]);

    // Ctrl+K keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                document.getElementById("global-search")?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

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
                px={{ base: 4, md: 6 }}
                py={3}
                bg="brand.800"
                align="center"
                position="sticky"
                top="0"
                zIndex="sticky"
                borderBottom="1px solid"
                borderColor="brand.700"
                gap={4}
            >
                {/* Mobile hamburger */}
                <IconButton
                    icon={<FaBars />}
                    variant="ghost"
                    size="sm"
                    display={{ base: "flex", md: "none" }}
                    onClick={onOpen}
                    aria-label="Open menu"
                />

                {/* Logo */}
                <Box
                    as={RouterLink}
                    to="/"
                    transition="opacity 0.2s"
                    _hover={{ opacity: 0.8 }}
                    flexShrink={0}
                >
                    <Image
                        src="/MyGameDenLogo.png"
                        alt="My Game Den"
                        h={{ base: "40px", md: "50px" }}
                        cursor="pointer"
                    />
                </Box>

                {/* Desktop nav links */}
                <HStack spacing={1} display={{ base: "none", md: "flex" }}>
                    <NavLink to="/" icon={<FaHome size="14px" />}>
                        Home
                    </NavLink>
                    <NavLink to="/browse" icon={<FaCompass size="14px" />}>
                        Browse
                    </NavLink>
                    {isAuthenticated && (
                        <NavLink
                            to="/library"
                            icon={<FaBookmark size="14px" />}
                        >
                            Library
                        </NavLink>
                    )}
                </HStack>

                <Spacer />

                {/* Search bar */}
                <InputGroup
                    size="sm"
                    w={{
                        base: searchFocused ? "200px" : "120px",
                        sm: searchFocused ? "300px" : "200px",
                        md: searchFocused ? "400px" : "300px",
                    }}
                    transition="width 0.2s"
                >
                    <InputLeftElement pointerEvents="none">
                        <FaSearch color="gray.500" size="12px" />
                    </InputLeftElement>
                    <Input
                        id="global-search"
                        placeholder="Search games..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        variant="filled"
                        bg="brand.900"
                        color="white"
                        _hover={{ bg: "brand.700" }}
                        _focus={{
                            bg: "brand.700",
                            borderColor: "purple.500",
                        }}
                        borderRadius="md"
                    />
                    <HStack
                        position="absolute"
                        right={2}
                        top="50%"
                        transform="translateY(-50%)"
                        pointerEvents="none"
                        display={{ base: "none", md: "flex" }}
                        opacity={searchFocused ? 0 : 0.5}
                        transition="opacity 0.2s"
                    >
                        <Kbd fontSize="xs" bg="whiteAlpha.200" color="gray.500">
                            Ctrl
                        </Kbd>
                        <Kbd fontSize="xs" bg="whiteAlpha.200" color="gray.500">
                            K
                        </Kbd>
                    </HStack>
                </InputGroup>

                <Spacer />

                {/* Right side actions */}
                <HStack spacing={2}>
                    {isAuthenticated ? (
                        <>
                            {/* User menu */}
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    variant="ghost"
                                    size="sm"
                                    borderRadius="full"
                                    p={1}
                                >
                                    <HStack spacing={2}>
                                        <Avatar
                                            size="sm"
                                            name={username}
                                            bg="purple.600"
                                        />
                                        <Text
                                            display={{ base: "none", md: "block" }}
                                            fontSize="sm"
                                            color="gray.300"
                                        >
                                            {username}
                                        </Text>
                                    </HStack>
                                </MenuButton>
                                <MenuList bg="gray.800" borderColor="gray.700">
                                    <MenuItem
                                        as={RouterLink}
                                        to="/library"
                                        icon={<FaBookmark />}
                                        bg="gray.800"
                                        _hover={{ bg: "gray.700" }}
                                    >
                                        My Library
                                    </MenuItem>
                                    <MenuItem
                                        as={RouterLink}
                                        to="/my-reviews"
                                        icon={<FaStar />}
                                        bg="gray.800"
                                        _hover={{ bg: "gray.700" }}
                                    >
                                        My Reviews
                                    </MenuItem>
                                    <MenuItem
                                        as={RouterLink}
                                        to="/library?tab=tierlists"
                                        icon={<FaLayerGroup />}
                                        bg="gray.800"
                                        _hover={{ bg: "gray.700" }}
                                    >
                                        Tier Lists
                                    </MenuItem>
                                    <MenuDivider />
                                    <MenuItem
                                        icon={<FaSignOutAlt />}
                                        onClick={handleLogout}
                                        bg="gray.800"
                                        _hover={{ bg: "gray.700" }}
                                        color="red.400"
                                    >
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                as={RouterLink}
                                to="/login"
                                variant="ghost"
                                size="sm"
                                display={{ base: "none", sm: "flex" }}
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

            {/* Mobile drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent bg="gray.900">
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
                        Menu
                    </DrawerHeader>

                    <DrawerBody p={4}>
                        <VStack spacing={2} align="stretch">
                            <NavLink
                                to="/"
                                icon={<FaHome size="14px" />}
                                onClick={onClose}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/browse"
                                icon={<FaCompass size="14px" />}
                                onClick={onClose}
                            >
                                Browse
                            </NavLink>
                            {isAuthenticated && (
                                <>
                                    <NavLink
                                        to="/library"
                                        icon={<FaBookmark size="14px" />}
                                        onClick={onClose}
                                    >
                                        Library
                                    </NavLink>
                                    <NavLink
                                        to="/my-reviews"
                                        icon={<FaStar size="14px" />}
                                        onClick={onClose}
                                    >
                                        My Reviews
                                    </NavLink>
                                    <NavLink
                                        to="/library?tab=tierlists"
                                        icon={<FaLayerGroup size="14px" />}
                                        onClick={onClose}
                                    >
                                        Tier Lists
                                    </NavLink>
                                </>
                            )}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* --- Main Content Area --- */}
            <Box p="4" flex="1">
                <Outlet />
            </Box>
        </Flex>
    );
}
