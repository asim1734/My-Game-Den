import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchGameById, getAllUserLists } from "../api";
import {
    Box,
    Heading,
    Text,
    Spinner,
    Center,
    Image,
    Grid,
    GridItem,
    Tag,
    HStack,
    VStack,
    Divider,
    Icon,
    Flex,
    AspectRatio,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";
import { FaChevronDown, FaStar, FaLock } from "react-icons/fa"; 
import { useGameActions } from "../hooks/useGameActions";
import { StoreLink } from "../components/StoreLink";
import { ReviewSection } from "../components/ReviewSection";
import { CommunityReviews } from "../components/CommunityReviews";

export const GameDetailsPage = () => {
    const { id: gameId } = useParams();
    const isLoggedIn = !!localStorage.getItem("x-auth-token");

    const {
        data: game,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["game", gameId],
        queryFn: () => fetchGameById(gameId),
        enabled: !!gameId,
    });

    const { data: allLists } = useQuery({
        queryKey: ["userLists"],
        queryFn: getAllUserLists,
        enabled: isLoggedIn, 
    });

    const { handleAddGame, isAdding } = useGameActions(game);

    if (isLoading)
        return (
            <Center minH="calc(100vh - 150px)">
                <Spinner size="xl" color="teal.500" thickness="4px" />
            </Center>
        );

    if (isError || !game)
        return (
            <Center minH="calc(100vh - 150px)">
                <VStack spacing={4}>
                    <Text color="red.400" fontSize="lg">
                        {isError ? `Error: ${error.message}` : "Game not found."}
                    </Text>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </VStack>
            </Center>
        );

    const releaseYear = game.releaseDate ? new Date(game.releaseDate).getFullYear() : "N/A";
    const heroScreenshot = game.screenshots?.length > 0 ? game.screenshots[0] : game.coverUrl;

    return (
        <Box bg="brand.900" minH="100vh" overflowX="hidden">
            {/* --- Hero Section --- */}
            <Box
                h={{ base: "300px", md: "450px" }}
                bgImage={`url(${heroScreenshot})`}
                bgSize="cover"
                bgPosition="center 25%"
                position="relative"
            >
                <Flex
                    h="100%"
                    w="100%"
                    direction="column"
                    justify="flex-end"
                    p={{ base: 4, md: 8 }}
                    bgGradient="linear(to-t, brand.900 10%, transparent 70%)"
                >
                    <Heading
                        as="h1"
                        size={{ base: "xl", md: "3xl" }}
                        color="white"
                        textShadow="2px 2px 8px black"
                    >
                        {game.title}
                        <Text as="span" color="gray.400" ml={4} fontWeight="normal" fontSize={{ base: "lg", md: "2xl" }}>
                            ({releaseYear})
                        </Text>
                    </Heading>
                </Flex>
            </Box>

            {/* --- Main Content Section --- */}
            <Grid
                templateColumns={{ base: "1fr", lg: "320px 1fr" }}
                gap={{ base: 8, md: 12 }}
                p={{ base: 4, md: 8 }}
                maxW="1400px"
                mx="auto"
                w="100%"
            >
                {/* Left Column (Sidebar) */}
                <GridItem w="100%">
                    <VStack spacing={6} align="stretch">
                        <Image
                            src={game.coverUrl}
                            alt={game.title}
                            borderRadius="xl"
                            boxShadow="2xl"
                            border="4px solid"
                            borderColor="whiteAlpha.200"
                            fallbackSrc="https://via.placeholder.com/320x450?text=No+Cover"
                        />

                        {isLoggedIn ? (
                            allLists && (
                                <Menu isLazy>
                                    <MenuButton
                                        as={Button}
                                        rightIcon={<FaChevronDown />}
                                        isLoading={isAdding}
                                        colorScheme="teal"
                                        width="100%"
                                        size="lg"
                                    >
                                        Add to List
                                    </MenuButton>
                                    <MenuList bg="gray.800" borderColor="gray.700">
                                        {allLists.map((list) => {
                                            const isAlreadyInList = list.games?.includes(parseInt(gameId || "0"));
                                            return (
                                                <MenuItem
                                                    key={list.name}
                                                    bg="gray.800"
                                                    _hover={{ bg: "gray.700" }}
                                                    onClick={(e) => handleAddGame(e, list.name)}
                                                    isDisabled={isAlreadyInList}
                                                >
                                                    {isAlreadyInList ? `In ${list.name}` : `Add to ${list.name}`}
                                                </MenuItem>
                                            );
                                        })}
                                    </MenuList>
                                </Menu>
                            )
                        ) : (
                            <Button as={RouterLink} to="/login" leftIcon={<FaLock />} colorScheme="gray" variant="outline" w="100%">
                                Login to add to lists
                            </Button>
                        )}

                        <Divider borderColor="whiteAlpha.200" />

                        {/* Your Review & Community Sections */}
                        {isLoggedIn ? (
                            <VStack align="stretch" spacing={6}>
                                <ReviewSection game={game} />
                                <CommunityReviews gameId={game.igdbId || gameId} />
                            </VStack>
                        ) : (
                            <Alert status="info" variant="subtle" flexDirection="column" alignItems="center" py={6} bg="whiteAlpha.50" borderRadius="xl" border="1px dashed" borderColor="whiteAlpha.300">
                                <Icon as={FaLock} mb={3} w={6} h={6} color="teal.300" />
                                <AlertTitle color="white">Reviews Locked</AlertTitle>
                                <AlertDescription fontSize="sm" color="gray.400" textAlign="center">
                                    <Text as={RouterLink} to="/login" color="teal.300" fontWeight="bold">Log in</Text> to see reviews.
                                </AlertDescription>
                            </Alert>
                        )}
                    </VStack>
                    <Box pt={4}>
                            {" "}
                            {/* Added some padding top */}
                            <Heading size="sm" mb={2}>
                                Related Links
                            </Heading>{" "}
                            {/* Changed Heading */}
                            <Flex gap={2} wrap="wrap">
                                {game.websites?.length > 0 ? (
                                    game.websites.map((site) => (
                                        <StoreLink
                                            key={site.id}
                                            website={site}
                                        />
                                    ))
                                ) : (
                                    <Text fontSize="sm" color="gray.500">
                                        No related links available.
                                    </Text>
                                )}
                            </Flex>
                        </Box>

                </GridItem>

                {/* Right Column (Main Details) */}
                <GridItem w="100%" minW={0}> {/* minW={0} is critical for preventing Grid overflow */}
                    <VStack spacing={10} align="stretch" color="white" w="100%">
                        {/* Rating */}
                        {game.rating && (
                            <HStack fontSize="3xl">
                                <Icon as={FaStar} color="yellow.400" />
                                <Text fontWeight="extrabold">
                                    {Math.round(game.rating)}
                                    <Text as="span" fontSize="lg" color="gray.400" ml={1}>/ 100</Text>
                                </Text>
                            </HStack>
                        )}
                        
                        {/* Summary */}
                        <Box>
                            <Heading size="lg" mb={4} borderLeft="4px solid" borderColor="teal.500" pl={4}>
                                Summary
                            </Heading>
                            <Text lineHeight="tall" fontSize="lg" color="gray.300">
                                {game.summary || "No summary available for this title."}
                            </Text>
                        </Box>

                        <Divider borderColor="whiteAlpha.200" />

                        {/* Corrected Trailer Section */}
                        {game.videos?.length > 0 && (
                            <Box w="100%">
                                <Heading size="lg" mb={4}>Official Trailer</Heading>
                                <Box maxW="800px" w="100%">
                                    <AspectRatio ratio={16 / 9} borderRadius="xl" overflow="hidden" boxShadow="dark-lg" bg="black">
                                        <iframe
                                            title={`${game.title} Trailer`}
                                            src={`https://www.youtube.com/embed/${game.videos[0]}`}
                                            allowFullScreen
                                        />
                                    </AspectRatio>
                                </Box>
                            </Box>
                        )}

                        {/* Gallery */}
                        {game.screenshots?.length > 1 && (
                            <Box w="100%">
                                <Heading size="lg" mb={4}>Gallery</Heading>
                                <HStack overflowX="auto" spacing={4} pb={4} sx={{
                                    "&::-webkit-scrollbar": { height: "8px" },
                                    "&::-webkit-scrollbar-track": { bg: "brand.900" },
                                    "&::-webkit-scrollbar-thumb": { bg: "brand.700", borderRadius: "24px" },
                                }}>
                                    {game.screenshots.slice(1).map((ss, index) => (
                                        <Image
                                            key={index}
                                            src={ss}
                                            alt="Screenshot"
                                            h="200px"
                                            minW="350px"
                                            objectFit="cover"
                                            borderRadius="lg"
                                        />
                                    ))}
                                </HStack>
                            </Box>
                        )}

                        {/* Info Grid */}
                       <HStack spacing={8} wrap="wrap">
                            <Box>
                                <Heading size="md" mb={2}>
                                    Genres
                                </Heading>
                                <HStack wrap="wrap">
                                    {game.genres?.map((g) => (
                                        <Tag key={g}>{g}</Tag>
                                    ))}
                                </HStack>
                            </Box>
                            <Box>
                                <Heading size="md" mb={2}>
                                    Platforms
                                </Heading>
                                <HStack wrap="wrap">
                                    {game.platforms?.map((p) => (
                                        <Tag key={p}>{p}</Tag>
                                    ))}
                                </HStack>
                            </Box>
                        </HStack>

                    </VStack>
                </GridItem>
            </Grid>
        </Box>
    );
};