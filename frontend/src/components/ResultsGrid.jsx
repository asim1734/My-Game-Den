import React from "react";
import { useQuery } from "@tanstack/react-query";
import { browseGames } from "../api";
import {
    Box,
    Heading,
    SimpleGrid,
    Center,
    Text,
    Flex,
    Spacer,
    Button,
    HStack,
    Tag,
    TagCloseButton,
    TagLabel,
    VStack,
    Icon,
} from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown, FaSearch } from "react-icons/fa";
import GameCard from "../components/GameCard";
import GameCardSkeleton from "../components/GameCardSkeleton";

const SORT_OPTIONS = [
    { label: "Popularity", value: "total_rating_count" },
    { label: "Rating", value: "total_rating" },
    { label: "Release Date", value: "first_release_date" },
    { label: "Name", value: "name" },
];

export const ResultsGrid = ({
    filters,
    onSortChange,
    onClearOneFilter,
    onClearAllFilters,
}) => {
    const {
        data: games,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["browseGames", filters],
        queryFn: () => browseGames(filters),
    });

    const skeletons = Array(12).fill(0);

    // Build active filter chips — one per category
    const chips = [];
    if (filters.genre.length > 0)
        chips.push({ label: filters.genre.join(", "), key: "genre" });
    if (filters.platform.length > 0)
        chips.push({ label: filters.platform.join(", "), key: "platform" });
    if (filters.minRating)
        chips.push({
            label: `Rating ≥ ${filters.minRating}`,
            key: "minRating",
        });
    if (filters.releaseYearStart || filters.releaseYearEnd) {
        const from = filters.releaseYearStart || "...";
        const to = filters.releaseYearEnd || "...";
        chips.push({ label: `${from}–${to}`, key: "year" });
    }

    const handleSortClick = (value) => {
        if (filters.sortBy === value) {
            // Clicking the active sort toggles direction
            onSortChange(
                "sortOrder",
                filters.sortOrder === "desc" ? "asc" : "desc",
            );
        } else {
            onSortChange("sortBy", value);
        }
    };

    return (
        <Box>
            {/* Sort toggle buttons */}
            <Flex
                direction={{ base: "column", md: "row" }}
                gap={3}
                mb={4}
                align={{ base: "stretch", md: "center" }}
                flexWrap="wrap"
            >
                <Heading size="lg">Browse</Heading>
                <Spacer />
                <HStack spacing={1} flexWrap="wrap">
                    {SORT_OPTIONS.map(({ label, value }) => {
                        const isActive = filters.sortBy === value;
                        return (
                            <Button
                                key={value}
                                size="sm"
                                variant={isActive ? "solid" : "ghost"}
                                colorScheme={isActive ? "purple" : "gray"}
                                borderRadius="full"
                                rightIcon={
                                    isActive ? (
                                        filters.sortOrder === "desc" ? (
                                            <FaArrowDown size="10px" />
                                        ) : (
                                            <FaArrowUp size="10px" />
                                        )
                                    ) : undefined
                                }
                                onClick={() => handleSortClick(value)}
                            >
                                {label}
                            </Button>
                        );
                    })}
                </HStack>
            </Flex>

            {/* Active filter chips */}
            {chips.length > 0 && (
                <Flex gap={2} flexWrap="wrap" mb={3} align="center">
                    {chips.map((chip) => (
                        <Tag
                            key={chip.key}
                            size="sm"
                            colorScheme="purple"
                            variant="subtle"
                            borderRadius="full"
                        >
                            <TagLabel>{chip.label}</TagLabel>
                            <TagCloseButton
                                onClick={() => onClearOneFilter(chip.key)}
                            />
                        </Tag>
                    ))}
                    <Button
                        size="xs"
                        variant="ghost"
                        color="gray.500"
                        _hover={{ color: "white" }}
                        onClick={onClearAllFilters}
                    >
                        Clear all
                    </Button>
                </Flex>
            )}

            {/* Result count */}
            {!isLoading && !isError && games && (
                <Text fontSize="sm" color="gray.500" mb={4}>
                    {games.length} game{games.length !== 1 ? "s" : ""} found
                </Text>
            )}

            {/* Loading skeletons */}
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
                    <Center
                        minH="400px"
                        flexDirection="column"
                        gap={4}
                        borderWidth="1px"
                        borderColor="gray.700"
                        borderStyle="dashed"
                        borderRadius="xl"
                    >
                        <Icon as={FaSearch} boxSize={10} color="gray.700" />
                        <VStack spacing={1}>
                            <Text fontWeight="semibold" color="gray.300">
                                No games found
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Try adjusting or clearing your filters
                            </Text>
                        </VStack>
                        {chips.length > 0 && (
                            <Button
                                size="sm"
                                colorScheme="purple"
                                variant="outline"
                                onClick={onClearAllFilters}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </Center>
                ))}
        </Box>
    );
};
