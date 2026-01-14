import React, { useState } from "react";
import { 
    Box, Input, InputGroup, InputLeftElement, 
    Spinner, SimpleGrid, Button, HStack, Text 
} from "@chakra-ui/react";
import { FaSearch, FaList } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { searchGames } from "../../api"; 
import { TierGameCard } from "./TierGameCard";

function useDebounceValue(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    React.useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export const GamePickerSidebar = ({ onAddGame }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounceValue(searchTerm, 500);
    const [activeTab, setActiveTab] = useState("search");

    const { data: searchResults, isLoading } = useQuery({
        queryKey: ["searchGames", debouncedSearch],
        queryFn: () => searchGames(debouncedSearch),
        enabled: debouncedSearch.length > 2,
        staleTime: 1000 * 60 * 5,
    });

    return (
        <Box 
            w="320px" 
            h="full"
            bg="brand.900" 
            borderLeft="1px solid" 
            borderColor="brand.700"
            display="flex"
            flexDirection="column"
        >
            <Box p={4} borderBottom="1px solid" borderColor="brand.700">
                <HStack mb={4} spacing={2}>
                    <Button 
                        size="sm" 
                        flex={1} 
                        variant={activeTab === "search" ? "solid" : "ghost"}
                        colorScheme="purple"
                        leftIcon={<FaSearch />}
                        onClick={() => setActiveTab("search")}
                    >
                        Search
                    </Button>
                    <Button 
                        size="sm" 
                        flex={1} 
                        variant={activeTab === "collection" ? "solid" : "ghost"}
                        colorScheme="purple"
                        leftIcon={<FaList />}
                        onClick={() => setActiveTab("collection")}
                        isDisabled // Enable later
                    >
                        Library
                    </Button>
                </HStack>

                <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none"><FaSearch color="gray.500" /></InputLeftElement>
                    <Input 
                        placeholder="Search for games..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="brand.800"
                        borderRadius="full"
                        borderColor="brand.700"
                        _focus={{ borderColor: "purple.500" }}
                    />
                </InputGroup>
            </Box>

            <Box flex={1} overflowY="auto" p={4} css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                {isLoading ? (
                    <Box textAlign="center" py={10}><Spinner color="purple.500" /></Box>
                ) : searchResults && searchResults.length > 0 ? (
                    <SimpleGrid columns={3} spacing={3}>
                        {searchResults.map((game) => (
                            <TierGameCard 
                                // FIX: Use igdbId for the unique key
                                key={game.igdbId || game.id} 
                                game={game} 
                                variant="sidebar"
                                onClick={() => onAddGame(game)} 
                            />
                        ))}
                    </SimpleGrid>
                ) : (
                    <Box textAlign="center" py={10} color="gray.500">
                        {debouncedSearch.length > 2 
                            ? "No games found." 
                            : "Type to search IGDB."}
                    </Box>
                )}
            </Box>
        </Box>
    );
};