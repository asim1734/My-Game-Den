import React, { useMemo } from "react";
import {
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

const GameCard = ({ game, variant = "dashboard" }) => {
    // 1. Check Auth Status
    const isLoggedIn = !!localStorage.getItem("x-auth-token");

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
            minWidth="180px"
            borderRadius="lg"
            boxShadow="md"
            display="flex"
            flexDirection="column"
            overflow="visible"
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

            <CardBody p={3} flex="1" display="flex" flexDirection="column">
                <HStack justify="space-between" mb={2}>
                    {game.rating && (
                        <Badge
                            colorScheme={getRatingColor(game.rating)}
                            px="1.5"
                            borderRadius="md"
                        >
                            <Flex align="center">
                                <Icon as={FaStar} mr="1" boxSize={3} />
                                <Text as="b" fontSize="xs">
                                    {Math.round(game.rating)}
                                </Text>
                            </Flex>
                        </Badge>
                    )}
                    <Flex align="center" color="gray.400">
                        <Icon as={FaCalendarAlt} mr="1.5" boxSize={3} />
                        <Text fontSize="xs">{releaseYear}</Text>
                    </Flex>
                </HStack>

                <LinkOverlay as={RouterLink} to={`/game/${game.igdbId}`}>
                    <Heading size="sm" noOfLines={2} title={game.title} mb={2} color="white">
                        {game.title}
                    </Heading>
                </LinkOverlay>

                <VStack align="start" spacing={1} color="gray.400">
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
                            size="sm"
                            width="100%"
                            mt={3}
                            colorScheme="teal"
                            variant="solid"
                            isLoading={isAdding || isRemoving}
                        >
                            Manage Lists...
                        </MenuButton>
                        <MenuList bg="gray.800" minWidth="180px" zIndex={20} borderColor="gray.700">
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
                    </Menu>
                ) : (
                    <Button
                        as={RouterLink}
                        to="/login"
                        size="sm"
                        width="100%"
                        mt={3}
                        variant="outline"
                        colorScheme="whiteAlpha"
                        leftIcon={<Icon as={FaLock} boxSize={3} />}
                        _hover={{ bg: "whiteAlpha.200" }}
                    >
                        Login to Add
                    </Button>
                )}
            </CardBody>
        </LinkBox>
    );
};

export default GameCard;