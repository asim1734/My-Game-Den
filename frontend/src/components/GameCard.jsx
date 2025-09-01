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
    // NEW: Import LinkBox and LinkOverlay
    LinkBox,
    LinkOverlay,
} from "@chakra-ui/react";
import { FaStar, FaCalendarAlt, FaTags, FaDesktop } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const GameCard = ({ game }) => {
    const getRatingColor = (rating) => {
        if (rating > 85) return "green";
        if (rating > 70) return "yellow";
        return "red";
    };

    const releaseYear = game.releaseDate
        ? new Date(game.releaseDate).getFullYear()
        : "N/A";

    return (
        // THE FIX: Use LinkBox as the main container, rendered as a Card.
        // This is now the direct child of the Flex container and will stretch properly.
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
                <Image
                    src={game.coverUrl}
                    alt={game.title}
                    objectFit="cover"
                    fallback={
                        <Flex
                            bg="gray.800"
                            align="center"
                            justify="center"
                            height="100%"
                        >
                            <Text color="gray.400" fontSize="sm">
                                No Cover
                            </Text>
                        </Flex>
                    }
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

                {/* THE FIX: The LinkOverlay wraps the heading but makes the whole box linkable. */}
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

                {/* REMOVED: The onClick handler is no longer needed, LinkBox handles it. */}
                <ButtonGroup size="sm" spacing="2" width="100%" mt={3}>
                    <Button variant="outline" colorScheme="teal" flex="1">
                        Wishlist
                    </Button>
                    <Button variant="solid" colorScheme="teal" flex="1">
                        Collection
                    </Button>
                </ButtonGroup>
            </CardBody>
        </LinkBox>
    );
};

export default GameCard;
