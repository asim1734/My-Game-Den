import React from "react";
import { useQuery } from "@tanstack/react-query";
import { browseGames } from "../api";
import {
    Box,
    Heading,
    SimpleGrid,
    Center,
    Spinner, // Spinner is no longer used for loading, but might be for other features
    Text,
    Flex,
    Select,
    Spacer,
} from "@chakra-ui/react";
import GameCard from "../components/GameCard";
// 1. IMPORT THE SKELETON
import GameCardSkeleton from "../components/GameCardSkeleton";

const sortOptions = {
    Popularity: "total_rating_count",
    Rating: "total_rating",
    "Release Date": "first_release_date",
    Name: "name",
};

export const ResultsGrid = ({ filters, onSortChange }) => {
    const {
        data: games,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["browseGames", filters],
        queryFn: () => browseGames(filters),
    });

    // 2. DEFINE A SKELETONS ARRAY
    const skeletons = Array(12).fill(0); // 12 is a good default for a grid

    return (
        <Box>
            <Flex
                direction={{ base: "column", md: "row" }}
                gap={4}
                mb={6}
                align="center"
            >
                {/* ... (Your Flex header with Heading and Selects is unchanged) ... */}
                <Heading size="lg">Browse</Heading>
                <Spacer />
                <Select
                    w={{ base: "100%", md: "200px" }}
                    value={filters.sortBy}
                    onChange={(e) => onSortChange("sortBy", e.target.value)}
                >
                    {Object.entries(sortOptions).map(([name, value]) => (
                        <option key={value} value={value}>
                            Sort by {name}
                        </option>
                    ))}
                </Select>
                <Select
                    w={{ base: "100%", md: "150px" }}
                    value={filters.sortOrder}
                    onChange={(e) => onSortChange("sortOrder", e.target.value)}
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </Select>
            </Flex>

            {/* 3. REPLACED THE SPINNER WITH THE SKELETON GRID */}
            {isLoading && (
                <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, xl: 4 }}
                    spacing={6}
                >
                    {skeletons.map((_, index) => (
                        <GameCardSkeleton key={index} />
                    ))}
                </SimpleGrid>
            )}

            {isError && (
                <Center minH="400px">
                    <Text color="red.400">Error: {error.message}</Text>
                </Center>
            )}

            {!isLoading &&
                !isError &&
                (games?.length > 0 ? (
                    <SimpleGrid
                        columns={{ base: 1, sm: 2, md: 3, xl: 4 }}
                        spacing={6}
                    >
                        {games.map((game) => (
                            <GameCard key={game.igdbId} game={game} />
                        ))}
                    </SimpleGrid>
                ) : (
                    // This is your empty state, which looks great!
                    <Center
                        minH="400px"
                        borderWidth="1px"
                        borderColor="gray.700"
                        borderRadius="md"
                    >
                        <Text>
                            No games found. Try adjusting your filters and
                            clicking "Apply".
                        </Text>
                    </Center>
                ))}
        </Box>
    );
};
