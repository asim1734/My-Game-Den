// src/pages/WishlistPage.jsx
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

export const WishlistPage = () => {
    const { data: allLists, isLoading: isLoadingLists } = useQuery({
        queryKey: ["userLists"],
        queryFn: getAllUserLists,
    });

    const wishlistIds = allLists?.find(
        (list) => list.name === "wishlist"
    )?.games;

    const {
        data: wishlistGames,
        isLoading: isLoadingGames,
        isError,
        error,
    } = useQuery({
        queryKey: ["wishlistGames", wishlistIds],
        queryFn: () => fetchGamesByIds(wishlistIds),
        enabled: !!wishlistIds,
    });

    if (isLoadingLists || isLoadingGames) {
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
                    Error fetching your wishlist: {error.message}
                </Text>
            </Center>
        );
    }

    return (
        <Box p={8}>
            <Heading mb={6}>My Wishlist</Heading>
            {wishlistGames && wishlistGames.length > 0 ? (
                <SimpleGrid
                    columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
                    spacing={6}
                >
                    {wishlistGames.map((game) => (
                        <GameCard
                            key={game.igdbId}
                            game={game}
                            variant="wishlist"
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
                    <Text>Your wishlist is empty. Start adding games!</Text>
                </Center>
            )}
        </Box>
    );
};
