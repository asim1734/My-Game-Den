import { 
    Box, Heading, Flex, Select, SimpleGrid, Text, Container, Center, Button, HStack 
} from "@chakra-ui/react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchGames } from "../api";
import GameCard from "../components/GameCard";
import GameCardSkeleton from "../components/GameCardSkeleton";

export const SearchResultsPage = () => {
    const { term } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const page = parseInt(searchParams.get("page") || "1");
    const sortBy = searchParams.get("sortBy") || "total_rating_count";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const { data: games, isLoading, isError, error } = useQuery({
        queryKey: ["search", term, sortBy, sortOrder, page],
        queryFn: () => searchGames(term, { sortBy, sortOrder, page }),
        enabled: !!term,
    });

    const updateParams = (updates) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            newParams.set(key, value);
        });
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Flex justify="space-between" mb={8} direction={{ base: "column", md: "row" }} gap={4} align={{ md: "center" }}>
                <Box>
                    <Heading size="lg">Results for "{term}"</Heading>
                    <Text color="gray.500">Page {page}</Text>
                </Box>
                
                <Flex gap={3} direction={{ base: "column", sm: "row" }} w={{ base: "100%", md: "auto" }}>
                    <Select
                        value={sortBy}
                        onChange={(e) => updateParams({ sortBy: e.target.value, page: "1" })}
                        width={{ base: "100%", sm: "180px" }}
                    >
                        <option value="total_rating_count">Popularity</option>
                        <option value="total_rating">Rating</option>
                        <option value="first_release_date">Release Date</option>
                    </Select>
                    <Select
                        value={sortOrder}
                        onChange={(e) => updateParams({ sortOrder: e.target.value, page: "1" })}
                        width={{ base: "100%", sm: "140px" }}
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </Select>
                </Flex>
            </Flex>

            {isLoading ? (
                <SimpleGrid columns={{ base: 3, md: 4, xl: 5 }} spacing={{ base: 3, md: 6 }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <GameCardSkeleton key={i} />
                    ))}
                </SimpleGrid>
            ) : isError ? (
                <Center py={20}>
                    <Text color="red.400">
                        Could not load results: {error?.message || "Unknown error"}
                    </Text>
                </Center>
            ) : games?.length > 0 ? (
                <>
                    <SimpleGrid columns={{ base: 3, md: 4, xl: 5 }} spacing={{ base: 3, md: 6 }}>
                        {games.map((game) => (
                            <GameCard key={game.igdbId} game={game} />
                        ))}
                    </SimpleGrid>

                    {/* --- Pagination Controls --- */}
                    <HStack justify="center" mt={12} spacing={4}>
                        <Button 
                            onClick={() => updateParams({ page: (page - 1).toString() })}
                            isDisabled={page === 1}
                            colorScheme="purple"
                            variant="outline"
                        >
                            Previous
                        </Button>
                        <Text fontWeight="bold">Page {page}</Text>
                        <Button 
                            onClick={() => updateParams({ page: (page + 1).toString() })}
                            isDisabled={games.length < 24} 
                            colorScheme="purple"
                        >
                            Next
                        </Button>
                    </HStack>
                </>
            ) : (
                <Center py={20}><Text>No games found for "{term}".</Text></Center>
            )}
        </Container>
    );
};