// src/pages/SearchResultsPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchGames } from "../api";
import {
    Box,
    Heading,
    SimpleGrid,
    Center,
    Spinner,
    Text,
} from "@chakra-ui/react";
import GameCard from "../components/GameCard";

export const SearchResultsPage = () => {
    // 1. Get the search term from the URL parameter
    const { searchTerm } = useParams();
    const decodedSearchTerm = decodeURIComponent(searchTerm || "");

    // 2. Fetch the search results using useQuery
    const {
        data: searchResults,
        isLoading,
        isError,
        error,
    } = useQuery({
        // The query key includes the search term so different searches are cached
        queryKey: ["searchResults", decodedSearchTerm],
        queryFn: () => searchGames(decodedSearchTerm),
        // Only run the query if there's a search term
        enabled: !!decodedSearchTerm,
    });

    if (isLoading) {
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
                    Error searching games: {error.message}
                </Text>
            </Center>
        );
    }

    return (
        <Box p={8}>
            <Heading mb={6}>Search Results for "{decodedSearchTerm}"</Heading>
            {searchResults && searchResults.length > 0 ? (
                <SimpleGrid
                    columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
                    spacing={6}
                >
                    {searchResults.map((game) => (
                        <GameCard key={game.igdbId} game={game} />
                        // Using default 'dashboard' variant for cards here
                    ))}
                </SimpleGrid>
            ) : (
                <Center minH="200px">
                    <Text>No games found matching "{decodedSearchTerm}".</Text>
                </Center>
            )}
        </Box>
    );
};
