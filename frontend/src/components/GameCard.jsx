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
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useGameActions } from "../hooks/useGameActions";
import { useQuery } from "@tanstack/react-query";
import { getAllUserLists } from "../api";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const GameCard = ({ game, variant = "dashboard" }) => {
    const { handleAddGame, isAdding, handleRemoveGame, isRemoving } =
        useGameActions(game);

    const { data: allLists, isLoading: isListsLoading } = useQuery({
        queryKey: ["userLists"],
        queryFn: getAllUserLists,
        staleTime: 1000 * 60 * 5,
    });

    const gameInLists = useMemo(() => {
        const listSet = new Set();
        if (!allLists) return listSet;
        for (const list of allLists) {
            if (list.games.includes(game.igdbId)) {
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
            _hover={{
                transform: "scale(1.02)",
                boxShadow: "lg",
                position: "relative",
                zIndex: 10,
            }}
            transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
        >
            <AspectRatio
                ratio={3 / 4}
                width="100%"
                borderTopRadius="lg"
                overflow="hidden"
            >
                <Image src={game.coverUrl} alt={game.title} objectFit="cover" />
            </AspectRatio>

            <CardBody p={3} flex="1" display="flex" flexDirection="column">
                {/* ... (Top part of CardBody is unchanged) ... */}
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
                    <Heading size="sm" noOfLines={2} title={game.title} mb={2}>
                        {game.title}
                    </Heading>
                </LinkOverlay>

                <VStack align="start" spacing={1} color="gray.400">
                    {game.genres?.length > 0 && (
                        <HStack spacing={1}>
                            <Icon as={FaTags} boxSize={3} />
                            <Text fontSize="xs" noOfLines={1}>
                                {game.genres.join(", ")}
                            </Text>
                        </HStack>
                    )}
                    {game.platforms?.length > 0 && (
                        <HStack spacing={1}>
                            <Icon as={FaDesktop} boxSize={3} />
                            {/* --- 1. FIX: Changed 'noOfFiles' back to 'noOfLines' --- */}
                            <Text fontSize="xs" noOfLines={1}>
                                {game.platforms.join(", ")}
                            </Text>
                        </HStack>
                    )}
                </VStack>

                <Spacer />

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
                    <MenuList bg="brand.800" minWidth="180px" zIndex={10}>
                        {isListsLoading && (
                            <Center p={2}>
                                <Spinner size="sm" />
                            </Center>
                        )}
                        {allLists &&
                            allLists.map((list) => {
                                {
                                    /* --- 2. FIX: Changed 'list.static' to 'list.name' --- */
                                }
                                const isInThisList = gameInLists.has(list.name);

                                return (
                                    <MenuItem
                                        key={list.name}
                                        icon={
                                            isInThisList ? (
                                                <Icon
                                                    as={FaTrash}
                                                    color="red.400"
                                                />
                                            ) : (
                                                <Icon
                                                    as={FaPlus}
                                                    color="green.400"
                                                />
                                            )
                                        }
                                        onClick={(e) => {
                                            if (isInThisList) {
                                                handleRemoveGame(e, list.name);
                                            } else {
                                                handleAddGame(e, list.name);
                                            }
                                        }}
                                    >
                                        {isInThisList
                                            ? "Remove from"
                                            : "Add to"}{" "}
                                        {list.name}
                                    </MenuItem>
                                );
                            })}
                    </MenuList>
                </Menu>
            </CardBody>
        </LinkBox>
    );
};

export default GameCard;
