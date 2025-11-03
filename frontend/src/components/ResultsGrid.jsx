// src/components/ResultsGrid.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { browseGames } from "../api";
import {
    Box,
    Heading,
    SimpleGrid,
    Center,
    Spinner,
    Text,
    Flex,
    Select,
    Spacer,
} from "@chakra-ui/react";
import GameCard from "../components/GameCard";

const sortOptions = {
    Popularity: "total_rating_count",
    Rating: "total_rating",
    "Release Date": "first_release_date",
    Name: "name",
};

export const ResultsGrid = ({ filters, onSortChange }) => {
    // This query fetches the data based on the filters passed as props
    const {
        data: games,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["browseGames", filters],
        queryFn: () => browseGames(filters),
    });

    return (
        <Box>
            <Flex
                direction={{ base: "column", md: "row" }}
                gap={4}
                mb={6}
                align="center"
            >
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

            {isLoading && (
                <Center minH="400px">
                    <Spinner size="xl" color="brand.500" />
                </Center>
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
            {/* Pagination controls would go here */}
        </Box>
    );
};
