// src/components/GameCard.jsx
import React from "react";
import {
    Card,
    CardBody,
    Heading,
    Image,
    Text,
    Flex,
    Button,
    ButtonGroup,
    VStack,
    Spacer,
    HStack,
    Badge,
    Icon,
    AspectRatio,
    LinkBox,
    LinkOverlay,
} from "@chakra-ui/react";
import { FaStar, FaCalendarAlt, FaTags, FaDesktop } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useGameActions } from "../hooks/useGameActions";

const GameCard = ({ game, variant = "dashboard" }) => {
    const { handleAddGame, isAdding, handleRemoveGame, isRemoving } =
        useGameActions(game);

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
            overflow="hidden"
            boxShadow="md"
            display="flex"
            flexDirection="column"
            _hover={{ transform: "scale(1.02)", boxShadow: "lg" }}
            transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
        >
            <AspectRatio ratio={3 / 4} width="100%">
                <Image src={game.coverUrl} alt={game.title} objectFit="cover" />
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
                            <Text fontSize="xs" noOfLines={1}>
                                {game.platforms.join(", ")}
                            </Text>
                        </HStack>
                    )}
                </VStack>

                <Spacer />

                {variant === "dashboard" && (
                    <ButtonGroup size="sm" spacing="2" width="100%" mt={3}>
                        <Button
                            variant="outline"
                            colorScheme="teal"
                            flex="1"
                            onClick={(e) => {
                                handleAddGame(e, "wishlist");
                            }}
                            isLoading={isAdding}
                        >
                            Wishlist
                        </Button>
                        <Button
                            variant="solid"
                            colorScheme="teal"
                            flex="1"
                            onClick={(e) => {
                                handleAddGame(e, "collection");
                            }}
                            isLoading={isAdding}
                        >
                            Collection
                        </Button>
                    </ButtonGroup>
                )}

                {variant === "collection" && (
                    <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        width="100%"
                        mt={3}
                        onClick={(e) => {
                            handleRemoveGame(e, variant);
                        }}
                        isLoading={isRemoving}
                    >
                        Remove from Collection
                    </Button>
                )}

                {variant === "wishlist" && (
                    <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        width="100%"
                        mt={3}
                        onClick={(e) => {
                            handleRemoveGame(e, variant);
                        }}
                        isLoading={isRemoving}
                    >
                        Remove from Collection
                    </Button>
                )}
            </CardBody>
        </LinkBox>
    );
};

export default GameCard;
