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
    AlertTitle,
    AlertDescription,
    SimpleGrid,
    Wrap,
    WrapItem,
    useBreakpointValue,
} from "@chakra-ui/react";
import { FaChevronDown, FaLock } from "react-icons/fa";
import { useGameActions } from "../hooks/useGameActions";
import { StoreLink } from "../components/StoreLink";
import { ReviewSection } from "../components/ReviewSection";
import { CommunityReviews } from "../components/CommunityReviews";

const formatDateLabel = (dateValue) => {
    if (!dateValue) return "Unknown";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return "Unknown";
    return parsed.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatScore = (value) =>
    typeof value === "number" ? Math.round(value) : "N/A";

const formatCount = (value) =>
    typeof value === "number" ? value.toLocaleString() : "N/A";

const formatReleaseYear = (dateValue) => {
    if (!dateValue) return "TBA";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return "TBA";
    return String(parsed.getFullYear());
};

const InfoTagSection = ({ title, items, emptyText = "No data available." }) => {
    const validItems = Array.isArray(items)
        ? [...new Set(items.filter(Boolean))]
        : [];

    return (
        <Box>
            <Heading size="md" mb={2}>
                {title}
            </Heading>
            {validItems.length > 0 ? (
                <HStack wrap="wrap">
                    {validItems.map((item) => (
                        <Tag key={`${title}-${item}`}>{item}</Tag>
                    ))}
                </HStack>
            ) : (
                <Text fontSize="sm" color="gray.500">
                    {emptyText}
                </Text>
            )}
        </Box>
    );
};

const SidebarGameList = ({
    title,
    games,
    emptyText = "No related games available.",
}) => {
    const hasItems = Array.isArray(games) && games.length > 0;

    return (
        <Box pt={2}>
            <Heading size="sm" mb={3}>
                {title}
            </Heading>

            {hasItems ? (
                <VStack spacing={2} align="stretch">
                    {games.map((relatedGame) => (
                        <Box
                            as={RouterLink}
                            to={`/game/${relatedGame.igdbId}`}
                            key={`${title}-${relatedGame.igdbId}`}
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            bg="whiteAlpha.50"
                            borderRadius="md"
                            p={{ base: 2, md: 2.5 }}
                            _hover={{
                                bg: "whiteAlpha.100",
                                borderColor: "teal.400",
                            }}
                        >
                            <HStack align="flex-start" spacing={{ base: 2, md: 3 }}>
                                <Image
                                    src={
                                        relatedGame.coverUrl ||
                                        "https://via.placeholder.com/60x80?text=No+Cover"
                                    }
                                    alt={relatedGame.title}
                                    w={{ base: "46px", sm: "54px" }}
                                    h={{ base: "64px", sm: "72px" }}
                                    objectFit="cover"
                                    borderRadius="sm"
                                    flexShrink={0}
                                />

                                <VStack align="start" spacing={1} minW={0}>
                                    <Text
                                        fontSize="sm"
                                        color="white"
                                        fontWeight="semibold"
                                        noOfLines={2}
                                    >
                                        {relatedGame.title}
                                    </Text>

                                    <Wrap spacing={2}>
                                        {relatedGame.relation && (
                                            <Tag
                                                size="sm"
                                                bg="whiteAlpha.300"
                                                color="white"
                                            >
                                                {relatedGame.relation}
                                            </Tag>
                                        )}

                                        <Text fontSize="xs" color="gray.400">
                                            {formatReleaseYear(
                                                relatedGame.releaseDate,
                                            )}
                                        </Text>

                                        {typeof relatedGame.rating ===
                                            "number" && (
                                            <Text
                                                fontSize="xs"
                                                color="yellow.300"
                                            >
                                                {Math.round(
                                                    relatedGame.rating,
                                                )}
                                                /100
                                            </Text>
                                        )}
                                    </Wrap>
                                </VStack>
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            ) : (
                <Text fontSize="sm" color="gray.500">
                    {emptyText}
                </Text>
            )}
        </Box>
    );
};

export const GameDetailsPage = () => {
    const { id: gameId } = useParams();
    const isLoggedIn = !!localStorage.getItem("x-auth-token");
    const isMobile = useBreakpointValue({ base: true, lg: false }) || false;

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

    const releaseYear = game.releaseDate
        ? new Date(game.releaseDate).getFullYear()
        : "N/A";
    const releaseDateLabel = formatDateLabel(game.releaseDate);
    const heroScreenshot =
        game.screenshots?.length > 0
            ? game.screenshots[0]
            : game.coverUrl || "https://via.placeholder.com/1600x900?text=No+Image";
    const seriesItems = [game.collection, ...(game.franchises || [])].filter(
        Boolean,
    );
    const keywordPreview = (game.keywords || []).slice(0, 16);

    return (
        <Box bg="brand.900" minH="100vh" overflowX="hidden">
            {/* --- Hero Section --- */}
            <Box
                h={{ base: "240px", sm: "320px", md: "450px" }}
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
                    p={{ base: 3, sm: 4, md: 8 }}
                    bgGradient="linear(to-t, brand.900 10%, transparent 70%)"
                >
                    <VStack align="flex-start" spacing={3}>
                        <Heading
                            as="h1"
                            size={{ base: "lg", sm: "xl", md: "3xl" }}
                            color="white"
                            textShadow="2px 2px 8px black"
                            maxW={{ base: "100%", md: "85%" }}
                        >
                            {game.title}
                        </Heading>

                        <Text color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                            {releaseYear === "N/A" ? "Release year unknown" : `Released ${releaseYear}`}
                        </Text>

                        <HStack spacing={2} wrap="wrap">
                            {game.status && (
                                <Tag bg="teal.600" color="white">
                                    {game.status}
                                </Tag>
                            )}
                            <Tag bg="whiteAlpha.300" color="white">
                                IGDB #{game.igdbId || gameId}
                            </Tag>
                        </HStack>
                    </VStack>
                </Flex>
            </Box>

            {/* --- Main Content Section --- */}
            {isMobile ? (
                // --- Mobile Layout (Single Column Flow) ---
                <VStack
                    spacing={6}
                    align="stretch"
                    p={{ base: 3, sm: 4 }}
                    maxW="800px"
                    mx="auto"
                    w="100%"
                >
                    {/* 1. Cover Image (Centered, 200px) */}
                    <Box mx="auto" w="200px" py={2}>
                        <Image
                            src={game.coverUrl}
                            alt={game.title}
                            borderRadius="xl"
                            boxShadow="2xl"
                            border="4px solid"
                            borderColor="whiteAlpha.200"
                            w="100%"
                            fallbackSrc="https://via.placeholder.com/320x450?text=No+Cover"
                        />
                    </Box>

                    {/* 2. Primary Actions */}
                    {isLoggedIn ? (
                        allLists && (
                            <Menu isLazy>
                                <MenuButton
                                    as={Button}
                                    rightIcon={<FaChevronDown />}
                                    isLoading={isAdding}
                                    colorScheme="teal"
                                    width="100%"
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

                    {/* 3. Quick Stats */}
                    <Box>
                        <Heading size="md" mb={4} borderLeft="4px solid" borderColor="teal.500" pl={3}>
                            Quick Stats
                        </Heading>
                        <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={3}>
                            <Box p={3} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                <Text fontSize="2xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                    User Score
                                </Text>
                                <Text fontSize="xl" fontWeight="bold">
                                    {formatScore(game.rating)}
                                    <Text as="span" fontSize="xs" color="gray.400" ml={0.5}>
                                        /100
                                    </Text>
                                </Text>
                            </Box>

                            <Box p={3} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                <Text fontSize="2xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                    Critic Score
                                </Text>
                                <Text fontSize="xl" fontWeight="bold">
                                    {formatScore(game.aggregatedRating)}
                                    <Text as="span" fontSize="xs" color="gray.400" ml={0.5}>
                                        /100
                                    </Text>
                                </Text>
                            </Box>

                            <Box p={3} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                <Text fontSize="2xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                    Ratings
                                </Text>
                                <Text fontSize="xl" fontWeight="bold">
                                    {formatCount(game.totalRatingCount)}
                                </Text>
                            </Box>

                            <Box p={3} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                <Text fontSize="2xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                    Critic Reviews
                                </Text>
                                <Text fontSize="xl" fontWeight="bold">
                                    {formatCount(game.aggregatedRatingCount)}
                                </Text>
                            </Box>

                            <Box p={3} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                <Text fontSize="2xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                    Follows/Hype
                                </Text>
                                <Text fontSize="xl" fontWeight="bold">
                                    {formatCount(game.follows)}/{formatCount(game.hypes)}
                                </Text>
                            </Box>

                            <Box p={3} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                <Text fontSize="2xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                    Release Date
                                </Text>
                                <Text fontSize="sm" fontWeight="bold" noOfLines={1} pt={1}>
                                    {releaseDateLabel}
                                </Text>
                            </Box>
                        </SimpleGrid>
                    </Box>

                    {/* 4. Summary */}
                    <Box>
                        <Heading size="md" mb={3} borderLeft="4px solid" borderColor="teal.500" pl={3}>
                            Summary
                        </Heading>
                        <Text lineHeight="tall" fontSize="md" color="gray.300">
                            {game.summary || "No summary available for this title."}
                        </Text>
                        {game.storyline && (
                            <Box mt={4}>
                                <Heading size="sm" mb={2}>
                                    Storyline
                                </Heading>
                                <Text lineHeight="tall" fontSize="sm" color="gray.300">
                                    {game.storyline}
                                </Text>
                            </Box>
                        )}
                    </Box>

                    <Divider borderColor="whiteAlpha.200" />

                    {/* 5. Trailer */}
                    {game.videos?.length > 0 && (
                        <Box w="100%">
                            <Heading size="md" mb={3}>
                                Official Trailer
                            </Heading>
                            <AspectRatio ratio={16 / 9} borderRadius="xl" overflow="hidden" boxShadow="dark-lg" bg="black">
                                <iframe
                                    title={`${game.title} Trailer`}
                                    src={`https://www.youtube.com/embed/${game.videos[0]}`}
                                    allowFullScreen
                                />
                            </AspectRatio>
                        </Box>
                    )}

                    {/* 6. Gallery */}
                    {game.screenshots?.length > 1 && (
                        <Box w="100%">
                            <Heading size="md" mb={3}>
                                Gallery
                            </Heading>
                            <HStack
                                overflowX="auto"
                                spacing={3}
                                pb={3}
                                sx={{
                                    "&::-webkit-scrollbar": { height: "6px" },
                                    "&::-webkit-scrollbar-track": { bg: "brand.900" },
                                    "&::-webkit-scrollbar-thumb": { bg: "brand.700", borderRadius: "12px" },
                                }}
                            >
                                {game.screenshots.slice(1).map((ss, index) => (
                                    <Image
                                        key={index}
                                        src={ss}
                                        alt="Screenshot"
                                        h="120px"
                                        minW="210px"
                                        objectFit="cover"
                                        borderRadius="md"
                                    />
                                ))}
                            </HStack>
                        </Box>
                    )}

                    <Divider borderColor="whiteAlpha.200" />

                    {/* 7. Reviews */}
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

                    <Divider borderColor="whiteAlpha.200" />

                    {/* 8. Similar Games & DLCs */}
                    <SidebarGameList
                        title="Similar Games"
                        games={game.similarGames}
                        emptyText="No similar games returned by IGDB."
                    />

                    <SidebarGameList
                        title="DLCs & Expansions"
                        games={game.dlcAndExpansions}
                        emptyText="No DLC or expansion entries found."
                    />

                    <Divider borderColor="whiteAlpha.200" />

                    {/* 9. Metadata (Stacked / 1 col on mobile) */}
                    <Box>
                        <Heading size="md" mb={4} borderLeft="4px solid" borderColor="teal.500" pl={3}>
                            Game Metadata
                        </Heading>
                        <VStack spacing={4} align="stretch">
                            <InfoTagSection title="Genres" items={game.genres} />
                            <InfoTagSection title="Platforms" items={game.platforms} />
                            <InfoTagSection title="Developers" items={game.developers} />
                            <InfoTagSection title="Publishers" items={game.publishers} />
                            <InfoTagSection title="Game Modes" items={game.gameModes} />
                            <InfoTagSection title="Perspectives" items={game.perspectives} />
                            <InfoTagSection title="Themes" items={game.themes} />
                            <InfoTagSection title="Engines" items={game.engines} />
                            <InfoTagSection title="Series" items={seriesItems} />
                            <InfoTagSection title="Age Ratings" items={game.ageRatings} />
                            <InfoTagSection
                                title="Keywords"
                                items={keywordPreview}
                                emptyText="No keyword metadata from IGDB."
                            />
                        </VStack>
                    </Box>

                    {/* 10. Related Links */}
                    <Box pt={2}>
                        <Heading size="sm" mb={2}>
                            Related Links
                        </Heading>
                        <Wrap spacing={2}>
                            {game.websites?.length > 0 ? (
                                game.websites.map((site) => (
                                    <WrapItem key={site.id}>
                                        <StoreLink website={site} />
                                    </WrapItem>
                                ))
                            ) : (
                                <Text fontSize="sm" color="gray.500">
                                    No related links available.
                                </Text>
                            )}
                        </Wrap>
                    </Box>
                </VStack>
            ) : (
                // --- Desktop Layout (Original Two-Column Grid) ---
                <Grid
                    templateColumns="320px 1fr"
                    gap={{ base: 6, md: 10, lg: 12 }}
                    p={{ base: 3, sm: 4, md: 8 }}
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
                                w="100%"
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

                            <Box pt={2}>
                                <Heading size="sm" mb={2}>
                                    Related Links
                                </Heading>
                                <Wrap spacing={2}>
                                    {game.websites?.length > 0 ? (
                                        game.websites.map((site) => (
                                            <WrapItem key={site.id}>
                                                <StoreLink website={site} />
                                            </WrapItem>
                                        ))
                                    ) : (
                                        <Text fontSize="sm" color="gray.500">
                                            No related links available.
                                        </Text>
                                    )}
                                </Wrap>
                            </Box>

                            <SidebarGameList
                                title="Similar Games"
                                games={game.similarGames}
                                emptyText="No similar games returned by IGDB."
                            />

                            <SidebarGameList
                                title="DLCs & Expansions"
                                games={game.dlcAndExpansions}
                                emptyText="No DLC or expansion entries found."
                            />
                        </VStack>
                    </GridItem>

                    {/* Right Column (Main Details) */}
                    <GridItem w="100%" minW={0}>
                        <VStack spacing={10} align="stretch" color="white" w="100%">
                            <Box>
                                <Heading size="lg" mb={4} borderLeft="4px solid" borderColor="teal.500" pl={4}>
                                    Quick Stats
                                </Heading>

                                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
                                    <Box p={4} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                        <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                            User Score
                                        </Text>
                                        <Text fontSize="2xl" fontWeight="bold">
                                            {formatScore(game.rating)}
                                            <Text as="span" fontSize="md" color="gray.400" ml={1}>
                                                /100
                                            </Text>
                                        </Text>
                                    </Box>

                                    <Box p={4} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                        <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                            Critic Score
                                        </Text>
                                        <Text fontSize="2xl" fontWeight="bold">
                                            {formatScore(game.aggregatedRating)}
                                            <Text as="span" fontSize="md" color="gray.400" ml={1}>
                                                /100
                                            </Text>
                                        </Text>
                                    </Box>

                                    <Box p={4} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                        <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                            Ratings
                                        </Text>
                                        <Text fontSize="2xl" fontWeight="bold">
                                            {formatCount(game.totalRatingCount)}
                                        </Text>
                                    </Box>

                                    <Box p={4} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                        <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                            Critic Reviews
                                        </Text>
                                        <Text fontSize="2xl" fontWeight="bold">
                                            {formatCount(game.aggregatedRatingCount)}
                                        </Text>
                                    </Box>

                                    <Box p={4} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                        <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                            Follows / Hype
                                        </Text>
                                        <Text fontSize="2xl" fontWeight="bold">
                                            {formatCount(game.follows)}
                                            <Text as="span" fontSize="md" color="gray.400" mx={1}>
                                                /
                                            </Text>
                                            {formatCount(game.hypes)}
                                        </Text>
                                    </Box>

                                    <Box p={4} borderRadius="lg" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200">
                                        <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                                            Release Date
                                        </Text>
                                        <Text fontSize="xl" fontWeight="bold">
                                            {releaseDateLabel}
                                        </Text>
                                    </Box>
                                </SimpleGrid>
                            </Box>

                            <Box>
                                <Heading size="lg" mb={4} borderLeft="4px solid" borderColor="teal.500" pl={4}>
                                    Summary
                                </Heading>
                                <Text lineHeight="tall" fontSize="lg" color="gray.300">
                                    {game.summary || "No summary available for this title."}
                                </Text>
                                {game.storyline && (
                                    <Box mt={6}>
                                        <Heading size="md" mb={3}>
                                            Storyline
                                        </Heading>
                                        <Text lineHeight="tall" color="gray.300">
                                            {game.storyline}
                                        </Text>
                                    </Box>
                                )}
                            </Box>

                            <Divider borderColor="whiteAlpha.200" />

                            {game.videos?.length > 0 && (
                                <Box w="100%">
                                    <Heading size="lg" mb={4}>
                                        Official Trailer
                                    </Heading>
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

                            {game.screenshots?.length > 1 && (
                                <Box w="100%">
                                    <Heading size="lg" mb={4}>
                                        Gallery
                                    </Heading>
                                    <HStack
                                        overflowX="auto"
                                        spacing={4}
                                        pb={4}
                                        sx={{
                                            "&::-webkit-scrollbar": { height: "8px" },
                                            "&::-webkit-scrollbar-track": {
                                                bg: "brand.900",
                                            },
                                            "&::-webkit-scrollbar-thumb": {
                                                bg: "brand.700",
                                                borderRadius: "24px",
                                            },
                                        }}
                                    >
                                        {game.screenshots.slice(1).map((ss, index) => (
                                            <Image
                                                key={index}
                                                src={ss}
                                                alt="Screenshot"
                                                h={{ base: "150px", sm: "180px", md: "200px" }}
                                                minW={{ base: "260px", sm: "320px", md: "350px" }}
                                                objectFit="cover"
                                                borderRadius="lg"
                                            />
                                        ))}
                                    </HStack>
                                </Box>
                            )}

                            <Box>
                                <Heading size="lg" mb={4} borderLeft="4px solid" borderColor="teal.500" pl={4}>
                                    Game Metadata
                                </Heading>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                                    <InfoTagSection title="Genres" items={game.genres} />
                                    <InfoTagSection title="Platforms" items={game.platforms} />
                                    <InfoTagSection title="Developers" items={game.developers} />
                                    <InfoTagSection title="Publishers" items={game.publishers} />
                                    <InfoTagSection title="Game Modes" items={game.gameModes} />
                                    <InfoTagSection title="Perspectives" items={game.perspectives} />
                                    <InfoTagSection title="Themes" items={game.themes} />
                                    <InfoTagSection title="Engines" items={game.engines} />
                                    <InfoTagSection title="Series" items={seriesItems} />
                                    <InfoTagSection title="Age Ratings" items={game.ageRatings} />
                                    <InfoTagSection
                                        title="Keywords"
                                        items={keywordPreview}
                                        emptyText="No keyword metadata from IGDB."
                                    />
                                </SimpleGrid>
                            </Box>
                        </VStack>
                    </GridItem>
                </Grid>
            )}
        </Box>
    );
};