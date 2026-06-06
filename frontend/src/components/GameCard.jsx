import React, { useMemo } from "react";
import {
    Box,
    Card,
    CardBody,
    Heading,
    Image,
    Text,
    Flex,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Spinner,
    Center,
    VStack,
    Spacer,
    HStack,
    Badge,
    Icon,
    AspectRatio,
    LinkBox,
    LinkOverlay,
    IconButton,
    Portal,
} from "@chakra-ui/react";
import {
    FaStar,
    FaCalendarAlt,
    FaTags,
    FaDesktop,
    FaPlus,
    FaTrash,
    FaLock,
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useGameActions } from "../hooks/useGameActions";
import { useQuery } from "@tanstack/react-query";
import { getAllUserLists } from "../api";

const GameCard = ({ game, variant = "grid" }) => {
    // 1. Check Auth Status
    const isLoggedIn = !!localStorage.getItem("x-auth-token");
    const isDashboardCard = variant === "dashboard";

    const { handleAddGame, isAdding, handleRemoveGame, isRemoving } =
        useGameActions(game);

    // 2. Only fetch lists if logged in
    const { data: allLists, isLoading: isListsLoading } = useQuery({
        queryKey: ["userLists"],
        queryFn: getAllUserLists,
        staleTime: 1000 * 60 * 5,
        enabled: isLoggedIn, 
    });

    const gameInLists = useMemo(() => {
        const listSet = new Set();
        if (!allLists) return listSet;
        for (const list of allLists) {
            if (list.games?.includes(game.igdbId)) {
                listSet.add(list.name);
            }
        }
        return listSet;
    }, [allLists, game.igdbId]);

    const getRatingColor = (rating) => {
        if (rating > 85) return "green";
        if (rating > 70) return "yellow";
        return "red";
    };

    const releaseYear = game.releaseDate
        ? new Date(game.releaseDate).getFullYear()
        : "N/A";

    return (
        <LinkBox
            as={Card}
            minW={
                isDashboardCard
                    ? { base: "110px", sm: "164px", md: "180px" }
                    : 0
            }
            w={
                isDashboardCard
                    ? { base: "110px", sm: "164px", md: "180px" }
                    : "100%"
            }
            h={
                isDashboardCard
                    ? { base: "220px", sm: "392px", md: "430px" }
                    : "100%"
            }
            flexShrink={isDashboardCard ? 0 : 1}
            scrollSnapAlign={isDashboardCard ? "start" : undefined}
            borderRadius="lg"
            boxShadow="md"
            display="flex"
            flexDirection="column"
            overflow="hidden"
            bg="brand.800"
            border="1px solid"
            borderColor="whiteAlpha.100"
            _hover={{
                transform: "scale(1.02)",
                boxShadow: "xl",
                position: "relative",
                zIndex: 10,
                borderColor: "teal.500",
            }}
            transition="all 0.2s ease-in-out"
        >
            <Box position="relative" width="100%">
                <AspectRatio
                    ratio={3 / 4}
                    width="100%"
                    borderTopRadius="lg"
                    overflow="hidden"
                >
                    <Image 
                        src={game.coverUrl} 
                        alt={game.title} 
                        objectFit="cover" 
                        fallbackSrc="https://via.placeholder.com/300x400?text=No+Cover"
                    />
                </AspectRatio>
                
                {/* Floating List Management on Mobile */}
                {isLoggedIn && (
                    <Box
                        position="absolute"
                        top="4px"
                        right="4px"
                        zIndex="12"
                        display={{ base: "block", sm: "none" }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <Menu closeOnSelect={false}>
                            <MenuButton
                                as={IconButton}
                                icon={<Icon as={FaPlus} boxSize="8px" />}
                                size="xs"
                                h="18px"
                                minW="18px"
                                w="18px"
                                borderRadius="full"
                                colorScheme="teal"
                                variant="solid"
                                aria-label="Manage lists"
                            />
                            <Portal>
                                <MenuList
                                    bg="gray.800"
                                    minWidth="150px"
                                    zIndex={1000}
                                    borderColor="gray.700"
                                >
                                    {isListsLoading && (
                                        <Center p={2}>
                                            <Spinner size="xs" color="teal.500" />
                                        </Center>
                                    )}
                                    {allLists &&
                                        allLists.map((list) => {
                                            const isInThisList = gameInLists.has(list.name);
                                            return (
                                                <MenuItem
                                                    key={list.name}
                                                    bg="gray.800"
                                                    _hover={{ bg: "gray.700" }}
                                                    icon={
                                                        isInThisList ? (
                                                            <Icon as={FaTrash} color="red.400" />
                                                        ) : (
                                                            <Icon as={FaPlus} color="green.400" />
                                                        )
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (isInThisList) {
                                                            handleRemoveGame(e, list.name);
                                                        } else {
                                                            handleAddGame(e, list.name);
                                                        }
                                                    }}
                                                >
                                                    <Text fontSize="xs">
                                                        {isInThisList ? "Remove from" : "Add to"} {list.name}
                                                    </Text>
                                                </MenuItem>
                                            );
                                        })}
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                )}
            </Box>

            <CardBody
                p={{ base: 1.5, sm: 2.5, md: 3 }}
                flex="1"
                display="flex"
                flexDirection="column"
            >
                <HStack 
                    justify="space-between" 
                    mb={{ base: 1, sm: 2 }} 
                    minH={{ base: "14px", sm: "20px" }}
                >
                    {game.rating && (
                        <Badge
                            colorScheme={getRatingColor(game.rating)}
                            px={{ base: "0.5", sm: "1.5" }}
                            borderRadius="md"
                        >
                            <Flex align="center">
                                <Icon as={FaStar} mr={{ base: "0.5", sm: "1" }} boxSize={{ base: 2.5, sm: 3 }} />
                                <Text as="b" fontSize={{ base: "9px", sm: "xs" }}>
                                    {Math.round(game.rating)}
                                </Text>
                            </Flex>
                        </Badge>
                    )}
                    {!game.rating && <Box minW={{ base: "30px", sm: "45px" }} h={{ base: "14px", sm: "20px" }} />}
                    <Flex align="center" color="gray.400">
                        <Icon as={FaCalendarAlt} mr={{ base: "0.5", sm: "1.5" }} boxSize={{ base: 2.5, sm: 3 }} />
                        <Text fontSize={{ base: "9px", sm: "xs" }}>{releaseYear}</Text>
                    </Flex>
                </HStack>

                <LinkOverlay as={RouterLink} to={`/game/${game.igdbId}`}>
                    <Heading
                        size={{ base: "2xs", sm: "xs", lg: "sm" }}
                        noOfLines={2}
                        title={game.title}
                        mb={{ base: 1, sm: 2 }}
                        minH={{ base: "2.4em", sm: "2.6em" }}
                        lineHeight={{ base: "1.15", sm: "1.3" }}
                        color="white"
                        fontSize={{ base: "10px", sm: "sm" }}
                    >
                        {game.title}
                    </Heading>
                </LinkOverlay>

                <VStack 
                    align="start" 
                    spacing={1} 
                    color="gray.400" 
                    minH="38px"
                    display={{ base: "none", sm: "flex" }}
                >
                    {game.genres?.length > 0 && (
                        <HStack spacing={1}>
                            <Icon as={FaTags} boxSize={3} color="teal.500" />
                            <Text fontSize="xs" noOfLines={1}>
                                {game.genres.join(", ")}
                            </Text>
                        </HStack>
                    )}
                    {game.platforms?.length > 0 && (
                        <HStack spacing={1}>
                            <Icon as={FaDesktop} boxSize={3} color="teal.500" />
                            <Text fontSize="xs" noOfLines={1}>
                                {game.platforms.join(", ")}
                            </Text>
                        </HStack>
                    )}
                </VStack>

                <Spacer />

                {/* --- Conditional List Management --- */}
                {isLoggedIn ? (
                    <Menu closeOnSelect={false}>
                        <MenuButton
                            as={Button}
                            size={
                                isDashboardCard
                                    ? "xs"
                                    : { base: "xs", md: "sm" }
                            }
                            width="100%"
                            mt={3}
                            colorScheme="teal"
                            variant="solid"
                            isLoading={isAdding || isRemoving}
                            display={{ base: "none", sm: "inline-flex" }}
                        >
                            Manage Lists...
                        </MenuButton>
                        <Portal>
                            <MenuList
                                bg="gray.800"
                                minWidth={isDashboardCard ? "160px" : "180px"}
                                zIndex={1000}
                                borderColor="gray.700"
                            >
                                {isListsLoading && (
                                    <Center p={2}>
                                        <Spinner size="sm" color="teal.500" />
                                    </Center>
                                )}
                                {allLists &&
                                    allLists.map((list) => {
                                        const isInThisList = gameInLists.has(list.name);
                                        return (
                                            <MenuItem
                                                key={list.name}
                                                bg="gray.800"
                                                _hover={{ bg: "gray.700" }}
                                                icon={
                                                    isInThisList ? (
                                                        <Icon as={FaTrash} color="red.400" />
                                                    ) : (
                                                        <Icon as={FaPlus} color="green.400" />
                                                    )
                                                }
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent LinkBox trigger
                                                    if (isInThisList) {
                                                        handleRemoveGame(e, list.name);
                                                    } else {
                                                        handleAddGame(e, list.name);
                                                    }
                                                }}
                                            >
                                                <Text fontSize="sm">
                                                    {isInThisList ? "Remove from" : "Add to"} {list.name}
                                                </Text>
                                            </MenuItem>
                                        );
                                    })}
                            </MenuList>
                        </Portal>
                    </Menu>
                ) : (
                    <Button
                        as={RouterLink}
                        to="/login"
                        size={
                            isDashboardCard
                                ? "xs"
                                : { base: "xs", md: "sm" }
                        }
                        width="100%"
                        mt={3}
                        variant="outline"
                        colorScheme="whiteAlpha"
                        leftIcon={<Icon as={FaLock} boxSize={3} />}
                        _hover={{ bg: "whiteAlpha.200" }}
                        display={{ base: "none", sm: "inline-flex" }}
                    >
                        Login to Add
                    </Button>
                )}
            </CardBody>
        </LinkBox>
    );
};

export default GameCard;