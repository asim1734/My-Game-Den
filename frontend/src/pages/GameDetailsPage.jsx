import { useParams } from "react-router-dom";
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
} from "@chakra-ui/react";
import { FaChevronDown, FaStar } from "react-icons/fa"; // <-- ADD FaLink HERE
import { useGameActions } from "../hooks/useGameActions";
import { StoreLink } from "../components/StoreLink";

export const GameDetailsPage = () => {
    const { id: gameId } = useParams();

    // --- Data Fetching ---
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

    // Fetches the user's lists to populate the "Add to List" menu
    const { data: allLists } = useQuery({
        queryKey: ["userLists"],
        queryFn: getAllUserLists,
    });

    // Gets the mutation functions (add, remove) from our custom hook
    const { handleAddGame, isAdding } = useGameActions(game);

    if (isLoading)
        return (
            <Center minH="calc(100vh - 150px)">
                <Spinner size="xl" />
            </Center>
        );
    if (isError)
        return (
            <Center minH="calc(100vh - 150px)">
                <Text color="red.400">{error.message}</Text>
            </Center>
        );
    if (!game)
        return (
            <Center minH="calc(100vh-150px)">
                <Text>Game not found.</Text>
            </Center>
        );

    const releaseYear = game.releaseDate
        ? new Date(game.releaseDate).getFullYear()
        : "N/A";
    const heroScreenshot =
        game.screenshots?.length > 0 ? game.screenshots[0] : game.coverUrl;
    console.log("Websites for this game:", game.websites);
    return (
        <Box>
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
                        size={{ base: "2xl", md: "3xl" }}
                        color="white"
                        textShadow="2px 2px 8px black"
                    >
                        {game.title}
                        <Text
                            as="span"
                            color="gray.300"
                            ml={4}
                            fontWeight="normal"
                        >
                            ({releaseYear})
                        </Text>
                    </Heading>
                </Flex>
            </Box>

            {/* --- Main Content Section --- */}
            <Grid
                templateColumns={{ base: "1fr", lg: "320px 1fr" }}
                gap={{ base: 6, md: 10 }}
                p={{ base: 4, md: 8 }}
            >
                {/* Left Column */}
                <GridItem>
                    {/* VStack now includes the Image first */}
                    <VStack spacing={4} align="stretch">
                        {/* --- ADDED COVER IMAGE BACK --- */}
                        <Image
                            src={game.coverUrl}
                            alt={game.title}
                            borderRadius="xl"
                            boxShadow="xl"
                        />
                        {/* --- Add to List Menu --- */}
                        {allLists && handleAddGame && (
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rightIcon={<FaChevronDown />}
                                    isLoading={isAdding}
                                    colorScheme="teal"
                                    width="100%"
                                >
                                    Add to List
                                </MenuButton>
                                <MenuList>
                                    {allLists.map((list) => {
                                        const isAlreadyInList =
                                            list.games.includes(
                                                parseInt(gameId || "0")
                                            );
                                        return (
                                            <MenuItem
                                                key={list.name}
                                                onClick={(e) =>
                                                    handleAddGame(e, list.name)
                                                }
                                                isDisabled={isAlreadyInList}
                                            >
                                                {isAlreadyInList
                                                    ? `In ${list.name}`
                                                    : `Add to ${list.name}`}
                                            </MenuItem>
                                        );
                                    })}
                                </MenuList>
                            </Menu>
                        )}
                        {/* --- Website Links --- */}
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
                    </VStack>
                </GridItem>

                {/* Right Column */}
                <GridItem>
                    <VStack spacing={8} align="stretch" color="brand.300">
                        {game.rating && (
                            <HStack fontSize="2xl">
                                <Icon as={FaStar} color="yellow.400" />
                                <Text fontWeight="bold">
                                    {Math.round(game.rating)} / 100
                                </Text>
                            </HStack>
                        )}
                        <Box>
                            <Heading size="lg" mb={3}>
                                Summary
                            </Heading>
                            <Text lineHeight="tall">
                                {game.summary || "No summary available."}
                            </Text>
                        </Box>
                        <Divider />
                        {/* Trailer */}
                        {game.videos?.length > 0 && (
                            <Box>
                                <Heading size="lg" mb={3}>
                                    Trailer
                                </Heading>
                                <AspectRatio
                                    ratio={16 / 9}
                                    borderRadius="lg"
                                    overflow="hidden"
                                >
                                    <iframe
                                        title={`${game.title} Trailer`}
                                        src={`https://www.youtube.com/embed/${game.videos[0]}`}
                                        allowFullScreen
                                    />
                                </AspectRatio>
                            </Box>
                        )}
                        {/* Screenshots */}
                        {game.screenshots?.length > 1 && (
                            <Box>
                                <Heading size="lg" mb={3}>
                                    Screenshots
                                </Heading>
                                <HStack overflowX="auto" spacing={4} pb={4}>
                                    {game.screenshots
                                        ?.slice(1)
                                        .map((ss, index) => (
                                            <Image
                                                key={index}
                                                src={ss}
                                                alt={`Screenshot ${index + 1}`}
                                                h="200px"
                                                borderRadius="md"
                                            />
                                        ))}
                                </HStack>
                            </Box>
                        )}
                        {/* Genres & Platforms */}
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
