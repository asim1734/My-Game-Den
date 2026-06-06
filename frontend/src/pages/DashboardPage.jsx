import React from "react";
import {
    Box,
    Flex,
    Heading,
    Text,
    Center,
    Button,
    HStack,
    Tag,
    SimpleGrid,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FaArrowRight, FaLayerGroup, FaPlus, FaListUl } from "react-icons/fa";
import GameCard from "../components/GameCard";
import GameCardSkeleton from "../components/GameCardSkeleton";
import {
    fetchTopGames,
    fetchNewReleases,
    fetchUpcomingGames,
    getTierLists,
    getAllUserLists,
} from "../api";

const GENRES = [
    { label: "Action", color: "red" },
    { label: "RPG", color: "purple" },
    { label: "Strategy", color: "blue" },
    { label: "Shooter", color: "orange" },
    { label: "Puzzle", color: "yellow" },
    { label: "Adventure", color: "teal" },
    { label: "Simulation", color: "cyan" },
    { label: "Sports", color: "green" },
    { label: "Racing", color: "orange" },
    { label: "Horror", color: "red" },
    { label: "Platform", color: "pink" },
    { label: "Fighting", color: "red" },
];

// --- GENRE STRIP ---
const GenreStrip = () => {
    return (
        <Box mb={{ base: 6, md: 8 }}>
            <Heading
                size="xs"
                color="gray.500"
                mb={3}
                textTransform="uppercase"
                letterSpacing="wider"
            >
                Browse by Genre
            </Heading>
            <Wrap spacing={2}>
                {GENRES.map(({ label, color }) => (
                    <WrapItem key={label}>
                        <Tag
                            as={RouterLink}
                            to={`/browse?genre=${encodeURIComponent(label)}`}
                            size="sm"
                            variant="subtle"
                            colorScheme={color}
                            cursor="pointer"
                            transition="all 0.15s"
                            px={{ base: 3, md: 4 }}
                            py={{ base: 1.5, md: 2 }}
                            borderRadius="full"
                            _hover={{ opacity: 0.85, transform: "translateY(-1px)" }}
                        >
                            {label}
                        </Tag>
                    </WrapItem>
                ))}
            </Wrap>
        </Box>
    );
};

// --- GAME ROW ---
const GameRow = ({ title, subtitle, queryKey, fetcher, viewAllHref }) => {
    const {
        data: games,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey,
        queryFn: fetcher,
        staleTime: 1000 * 60 * 10,
    });

    const skeletons = Array(10).fill(0);

    return (
        <Box my={{ base: 4, md: 8 }}>
            <Flex
                justify="space-between"
                align="flex-end"
                direction="row"
                gap={{ base: 2, sm: 3 }}
                mb={{ base: 2.5, md: 4 }}
            >
                <Box minW={0}>
                    <Heading size={{ base: "sm", sm: "md" }} color="white" noOfLines={1}>
                        {title}
                    </Heading>
                    {subtitle && (
                        <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500" mt={0.5} noOfLines={1}>
                            {subtitle}
                        </Text>
                    )}
                </Box>
                {viewAllHref && (
                    <Button
                        as={RouterLink}
                        to={viewAllHref}
                        size="xs"
                        variant="ghost"
                        colorScheme="purple"
                        rightIcon={<FaArrowRight />}
                        flexShrink={0}
                    >
                        View All
                    </Button>
                )}
            </Flex>

            {isLoading && (
                <Box
                    overflowX="auto"
                    mx={{ base: "-4", sm: "-8", md: "-12" }}
                    px={{ base: "4", sm: "8", md: "12" }}
                    pb={{ base: 2, md: 4 }}
                    sx={{
                        "&::-webkit-scrollbar": { height: "6px" },
                        "&::-webkit-scrollbar-track": {
                            background: "transparent",
                            borderLeftWidth: {
                                base: "16px",
                                sm: "32px",
                                md: "48px",
                            },
                            borderLeftStyle: "solid",
                            borderLeftColor: "transparent",
                            borderRightWidth: {
                                base: "16px",
                                sm: "32px",
                                md: "48px",
                            },
                            borderRightStyle: "solid",
                            borderRightColor: "transparent",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "var(--chakra-colors-brand-700)",
                            backgroundClip: "padding-box",
                            borderRadius: "24px",
                            borderLeftWidth: {
                                base: "16px",
                                sm: "32px",
                                md: "48px",
                            },
                            borderLeftStyle: "solid",
                            borderLeftColor: "transparent",
                            borderRightWidth: {
                                base: "16px",
                                sm: "32px",
                                md: "48px",
                            },
                            borderRightStyle: "solid",
                            borderRightColor: "transparent",
                        },
                    }}
                >
                    <Flex gap={{ base: 2, md: 4 }} flexWrap="nowrap" pr={{ base: 4, sm: 8, md: 12 }}>
                        {skeletons.map((_, index) => (
                            <GameCardSkeleton key={index} variant="dashboard" />
                        ))}
                    </Flex>
                </Box>
            )}

            {isError && (
                <Center p={10}>
                    <Text color="red.400">
                        Could not load games: {error.message}
                    </Text>
                </Center>
            )}

            {games && (
                <Box
                    overflowX="auto"
                    mx={{ base: "-4", sm: "-8", md: "-12" }}
                    px={{ base: "4", sm: "8", md: "12" }}
                    pb={{ base: 2, md: 4 }}
                    sx={{
                        "&::-webkit-scrollbar": { height: "6px" },
                        "&::-webkit-scrollbar-track": {
                            background: "transparent",
                            borderLeftWidth: {
                                base: "16px",
                                sm: "32px",
                                md: "48px",
                            },
                            borderLeftStyle: "solid",
                            borderLeftColor: "transparent",
                            borderRightWidth: {
                                base: "16px",
                                sm: "32px",
                                md: "48px",
                            },
                            borderRightStyle: "solid",
                            borderRightColor: "transparent",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "var(--chakra-colors-brand-700)",
                            backgroundClip: "padding-box",
                            borderRadius: "24px",
                            borderLeftWidth: {
                                base: "16px",
                                sm: "32px",
                                md: "48px",
                            },
                            borderLeftStyle: "solid",
                            borderLeftColor: "transparent",
                            borderRightWidth: {
                                base: "16px",
                                sm: "32px",
                                md: "48px",
                            },
                            borderRightStyle: "solid",
                            borderRightColor: "transparent",
                        },
                    }}
                >
                    <Flex gap={{ base: 2, md: 4 }} flexWrap="nowrap" pr={{ base: 4, sm: 8, md: 12 }}>
                        {games.map((game) => (
                            <GameCard
                                key={game.igdbId}
                                game={game}
                                variant="dashboard"
                            />
                        ))}
                    </Flex>
                </Box>
            )}
        </Box>
    );
};

// --- PERSONALIZED SECTION (logged-in only) ---
const PersonalizedSection = () => {
    const navigate = useNavigate();

    const { data: tierLists, isLoading: tierLoading } = useQuery({
        queryKey: ["tierLists"],
        queryFn: getTierLists,
        staleTime: 1000 * 60 * 5,
    });

    const { data: collections, isLoading: collectionsLoading } = useQuery({
        queryKey: ["userLists"],
        queryFn: getAllUserLists,
        staleTime: 1000 * 60 * 5,
    });

    if (tierLoading || collectionsLoading) return null;

    const hasTierLists = tierLists && tierLists.length > 0;
    const hasCollections = collections && collections.length > 0;

    return (
        <Box my={{ base: 4, md: 8 }}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }}>
                {/* --- Collections Column --- */}
                <Box>
                    <Flex
                        justify="space-between"
                        align="flex-end"
                        direction="row"
                        gap={{ base: 2, sm: 3 }}
                        mb={3}
                    >
                        <Box minW={0}>
                            <Heading size="sm" color="white" noOfLines={1}>
                                Your Collections
                            </Heading>
                            <Text fontSize="xs" color="gray.500" mt={0.5} noOfLines={1}>
                                Jump back in
                            </Text>
                        </Box>
                        <Button
                            as={RouterLink}
                            to="/library?tab=collections"
                            size="xs"
                            variant="ghost"
                            colorScheme="purple"
                            rightIcon={<FaArrowRight />}
                            flexShrink={0}
                        >
                            View All
                        </Button>
                    </Flex>

                    {!hasCollections ? (
                        <Flex
                            align="center"
                            justify="center"
                            border="2px dashed"
                            borderColor="brand.700"
                            borderRadius="xl"
                            p={{ base: 4, md: 6 }}
                            direction="column"
                            gap={2}
                        >
                            <Text color="gray.500" fontSize="sm">
                                No collections yet.
                            </Text>
                            <Button
                                size="xs"
                                colorScheme="purple"
                                leftIcon={<FaPlus />}
                                onClick={() =>
                                    navigate("/library?tab=collections")
                                }
                            >
                                Create Collection
                            </Button>
                        </Flex>
                    ) : (
                        <Flex direction="column" gap={2}>
                            {collections.slice(0, 3).map((col) => (
                                <Flex
                                    key={col.name}
                                    as={RouterLink}
                                    to={`/collections/${encodeURIComponent(col.name)}`}
                                    bg="brand.800"
                                    borderRadius="lg"
                                    p={{ base: 2.5, sm: 3 }}
                                    align="center"
                                    justify="space-between"
                                    border="1px solid"
                                    borderColor="brand.700"
                                    _hover={{ borderColor: "teal.500", textDecoration: "none" }}
                                    transition="border-color 0.2s"
                                >
                                    <HStack spacing={3} minW={0}>
                                        <Box
                                            w="32px"
                                            h="32px"
                                            bg="teal.900"
                                            borderRadius="md"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            flexShrink={0}
                                        >
                                            <FaListUl color="#4fd1c5" size="12px" />
                                        </Box>
                                        <Box minW={0}>
                                            <Text
                                                color="white"
                                                fontWeight="600"
                                                fontSize="sm"
                                                noOfLines={1}
                                            >
                                                {col.name}
                                            </Text>
                                            <Text color="gray.500" fontSize="xs">
                                                {col.games?.length || 0} game
                                                {col.games?.length !== 1
                                                    ? "s"
                                                    : ""}
                                            </Text>
                                        </Box>
                                    </HStack>
                                </Flex>
                            ))}
                        </Flex>
                    )}
                </Box>

                {/* --- Tier Lists Column --- */}
                <Box>
                    <Flex
                        justify="space-between"
                        align="flex-end"
                        direction="row"
                        gap={{ base: 2, sm: 3 }}
                        mb={3}
                    >
                        <Box minW={0}>
                            <Heading size="sm" color="white" noOfLines={1}>
                                Your Tier Lists
                            </Heading>
                            <Text fontSize="xs" color="gray.500" mt={0.5} noOfLines={1}>
                                Pick up where you left off
                            </Text>
                        </Box>
                        <Button
                            as={RouterLink}
                            to="/library?tab=tierlists"
                            size="xs"
                            variant="ghost"
                            colorScheme="purple"
                            rightIcon={<FaArrowRight />}
                            flexShrink={0}
                        >
                            View All
                        </Button>
                    </Flex>

                    {!hasTierLists ? (
                        <Flex
                            align="center"
                            justify="center"
                            border="2px dashed"
                            borderColor="brand.700"
                            borderRadius="xl"
                            p={{ base: 4, md: 6 }}
                            direction="column"
                            gap={2}
                        >
                            <Text color="gray.500" fontSize="sm">
                                No tier lists yet.
                            </Text>
                            <Button
                                size="xs"
                                colorScheme="purple"
                                leftIcon={<FaPlus />}
                                onClick={() =>
                                    navigate("/library?tab=tierlists")
                                }
                            >
                                Create Tier List
                            </Button>
                        </Flex>
                    ) : (
                        <Flex direction="column" gap={2}>
                            {tierLists.slice(0, 3).map((list) => (
                                <Flex
                                    key={list._id}
                                    bg="brand.800"
                                    borderRadius="lg"
                                    p={{ base: 2.5, sm: 3 }}
                                    align="center"
                                    justify="space-between"
                                    direction="row"
                                    gap={2}
                                    border="1px solid"
                                    borderColor="brand.700"
                                    _hover={{ borderColor: "purple.600" }}
                                    transition="border-color 0.2s"
                                >
                                    <HStack spacing={3} minW={0}>
                                        <Box
                                            w="32px"
                                            h="32px"
                                            bg="purple.900"
                                            borderRadius="md"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            flexShrink={0}
                                        >
                                            <FaLayerGroup
                                                color="#9f7aea"
                                                size="12px"
                                            />
                                        </Box>
                                        <Box minW={0}>
                                            <Text
                                                color="white"
                                                fontWeight="600"
                                                fontSize="sm"
                                                noOfLines={1}
                                            >
                                                {list.title ||
                                                    list.name ||
                                                    "Untitled"}
                                            </Text>
                                            <Text
                                                color="gray.500"
                                                fontSize="xs"
                                            >
                                                {list.tiers?.length || 0} tiers
                                            </Text>
                                        </Box>
                                    </HStack>
                                    <Button
                                        as={RouterLink}
                                        to={`/tierlist-editor/${list._id}`}
                                        size="xs"
                                        colorScheme="purple"
                                        variant="ghost"
                                        flexShrink={0}
                                        ml={2}
                                    >
                                        Continue
                                    </Button>
                                </Flex>
                            ))}
                        </Flex>
                    )}
                </Box>
            </SimpleGrid>
        </Box>
    );
};

// --- DASHBOARD ---
export const DashboardPage = () => {
    const isLoggedIn = !!localStorage.getItem("x-auth-token");

    return (
        <Box p={{ base: 2, sm: 4, md: 8 }} maxW="1600px" mx="auto">
            <GenreStrip />

            <GameRow
                title="Top Games"
                subtitle="Highest rated of all time"
                queryKey={["topGames"]}
                fetcher={fetchTopGames}
                viewAllHref="/browse?sortBy=total_rating&sortOrder=desc"
            />

            {isLoggedIn && <PersonalizedSection />}

            <GameRow
                title="New Releases"
                subtitle="Recently dropped"
                queryKey={["newReleases"]}
                fetcher={fetchNewReleases}
                viewAllHref="/browse?sortBy=first_release_date&sortOrder=desc"
            />

            <GameRow
                title="Upcoming Games"
                subtitle="Coming soon"
                queryKey={["upcomingGames"]}
                fetcher={fetchUpcomingGames}
                viewAllHref="/browse"
            />
        </Box>
    );
};
