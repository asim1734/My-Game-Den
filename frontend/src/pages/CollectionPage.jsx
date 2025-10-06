// src/pages/CollectionPage.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserLists, fetchGamesByIds } from "../api";
import {
    Box,
    Heading,
    SimpleGrid,
    Center,
    Spinner,
    Text,
} from "@chakra-ui/react";
import GameCard from "../components/GameCard";

export const CollectionPage = () => {
    // We destructure 'status' to get more precise loading information
    const { data: allLists, status: listsStatus } = useQuery({
        queryKey: ["userLists"],
        queryFn: getAllUserLists,
    });

    const collectionIds = allLists?.find(
        (list) => list.name === "collection"
    )?.games;

    const {
        data: collectionGames,
        status: gamesStatus,
        isError,
        error,
    } = useQuery({
        queryKey: ["collectionGames", collectionIds],
        queryFn: () => fetchGamesByIds(collectionIds),
        enabled: !!collectionIds,
    });

    // This logic correctly shows a spinner ONLY on the initial page load
    const isInitialLoading =
        listsStatus === "pending" || gamesStatus === "pending";

    if (isInitialLoading) {
        return (
            <Center minH="calc(100vh - 150px)">
                <Spinner size="xl" color="brand.500" />
            </Center>
        );
    }

    if (isError) {
        return (
            <Center minH="calc(100vh - 150px)">
                <Text color="red.400">
                    Error fetching your collection: {error.message}
                </Text>
            </Center>
        );
    }

    return (
        <Box p={8}>
            <Heading mb={6}>My Collection</Heading>
            {collectionGames && collectionGames.length > 0 ? (
                <SimpleGrid
                    columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
                    spacing={6}
                >
                    {collectionGames.map((game) => (
                        <GameCard
                            key={game.igdbId}
                            game={game}
                            variant="collection"
                        />
                    ))}
                </SimpleGrid>
            ) : (
                <Center
                    minH="200px"
                    borderWidth="1px"
                    borderColor="gray.700"
                    borderRadius="md"
                >
                    <Text>Your collection is empty. Start adding games!</Text>
                </Center>
            )}
        </Box>
    );
};
