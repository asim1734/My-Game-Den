import React, { useState } from "react";
import { 
    Box, Input, InputGroup, InputLeftElement, 
    Spinner, SimpleGrid, Button, HStack, Text, VStack, IconButton, Icon
} from "@chakra-ui/react";
import { FaSearch, FaList, FaFolder, FaArrowLeft, FaGamepad } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

import { searchGames, getAllUserLists, fetchGamesByIds } from "../../api"; 
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
    const [selectedCollection, setSelectedCollection] = useState(null); 

    // --- QUERY 1: SEARCH ---
    const { data: searchResults, isLoading: isSearchLoading } = useQuery({
        queryKey: ["searchGames", debouncedSearch],
        queryFn: () => searchGames(debouncedSearch),
        enabled: activeTab === "search" && debouncedSearch.length > 2,
        staleTime: 1000 * 60 * 5,
    });

    // --- QUERY 2: FETCH USER LISTS ---
    const { data: userLists, isLoading: isLibraryLoading } = useQuery({
        queryKey: ["userLists"],
        queryFn: getAllUserLists,
        enabled: activeTab === "library",
    });

    // --- QUERY 3: HYDRATE SELECTED FOLDER ---
    const { data: collectionGames, isLoading: isCollectionLoading } = useQuery({
        // FIX: Use the actual game IDs as the unique identifier for the cache.
        // Even if the list has no name or _id, the content (games) will be different.
        queryKey: ["collectionGames", selectedCollection?.games?.join(',')], 
        
        queryFn: () => fetchGamesByIds(selectedCollection.games),
        enabled: activeTab === "library" && !!selectedCollection && selectedCollection.games?.length > 0,
        // Keep data fresh for 5 mins so toggling back/forth is instant
        staleTime: 1000 * 60 * 5, 
    });

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedCollection(null);
    };

    return (
        <Box 
            w="320px" h="full" bg="brand.900" 
            borderLeft="1px solid" borderColor="brand.700"
            display="flex" flexDirection="column"
        >
            {/* HEADER */}
            <Box p={4} borderBottom="1px solid" borderColor="brand.700">
                <HStack mb={4} spacing={2} bg="blackAlpha.300" p={1} borderRadius="md">
                    <Button 
                        size="xs" flex={1} 
                        variant={activeTab === "search" ? "solid" : "ghost"}
                        colorScheme={activeTab === "search" ? "purple" : "gray"}
                        leftIcon={<FaSearch />}
                        onClick={() => handleTabChange("search")}
                    >
                        Search
                    </Button>
                    <Button 
                        size="xs" flex={1} 
                        variant={activeTab === "library" ? "solid" : "ghost"}
                        colorScheme={activeTab === "library" ? "purple" : "gray"}
                        leftIcon={<FaList />}
                        onClick={() => handleTabChange("library")}
                    >
                        My Library
                    </Button>
                </HStack>

                {activeTab === "search" && (
                    <InputGroup size="sm">
                        <InputLeftElement pointerEvents="none"><FaSearch color="gray.500" /></InputLeftElement>
                        <Input 
                            placeholder="Search IGDB..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            bg="brand.800" borderRadius="full"
                            borderColor="brand.700" _focus={{ borderColor: "purple.500" }}
                        />
                    </InputGroup>
                )}

                {activeTab === "library" && selectedCollection && (
                    <HStack>
                        <IconButton 
                            icon={<FaArrowLeft />} size="xs" variant="ghost" 
                            onClick={() => setSelectedCollection(null)} aria-label="Back"
                        />
                        <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                            {selectedCollection.name || selectedCollection.title}
                        </Text>
                    </HStack>
                )}
            </Box>

            {/* CONTENT */}
            <Box flex={1} overflowY="auto" p={4} css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                
                {/* 1. SEARCH RESULTS */}
                {activeTab === "search" && (
                    <>
                        {isSearchLoading ? (
                            <Box textAlign="center" py={10}><Spinner color="purple.500" /></Box>
                        ) : searchResults && searchResults.length > 0 ? (
                            <SimpleGrid columns={3} spacing={3}>
                                {searchResults.map((game) => (
                                    <TierGameCard 
                                        key={game.igdbId || game.id} 
                                        game={game} 
                                        variant="sidebar"
                                        onClick={() => onAddGame(game)} 
                                    />
                                ))}
                            </SimpleGrid>
                        ) : (
                            <Box textAlign="center" py={10} color="gray.500" fontSize="sm">
                                {debouncedSearch.length > 2 ? "No games found." : "Type to search."}
                            </Box>
                        )}
                    </>
                )}

                {/* 2. LIBRARY FOLDERS */}
                {activeTab === "library" && !selectedCollection && (
                    <>
                        {isLibraryLoading ? (
                            <Box textAlign="center" py={10}><Spinner color="purple.500" /></Box>
                        ) : userLists && userLists.length > 0 ? (
                            <VStack spacing={2} align="stretch">
                                {userLists.map((list, index) => (
                                    <HStack 
                                        // Fallback Key if _id is missing
                                        key={list._id || index}
                                        p={3} bg="whiteAlpha.50" borderRadius="md" cursor="pointer"
                                        _hover={{ bg: "whiteAlpha.100", transform: "translateX(2px)" }}
                                        transition="all 0.2s"
                                        onClick={() => setSelectedCollection(list)}
                                    >
                                        <Icon as={FaFolder} color="yellow.400" boxSize={4} />
                                        <VStack align="start" spacing={0} flex={1}>
                                            <Text fontSize="sm" fontWeight="bold">{list.name || list.title || "Untitled"}</Text>
                                            <Text fontSize="xs" color="gray.500">{list.games?.length || 0} games</Text>
                                        </VStack>
                                        <Icon as={FaGamepad} color="gray.600" boxSize={3} />
                                    </HStack>
                                ))}
                            </VStack>
                        ) : (
                            <Box textAlign="center" py={10} color="gray.500" fontSize="sm">
                                No lists found.
                            </Box>
                        )}
                    </>
                )}

                {/* 3. LIBRARY GAMES (HYDRATED) */}
                {activeTab === "library" && selectedCollection && (
                    <>
                        {isCollectionLoading ? (
                             <Box textAlign="center" py={10}><Spinner color="purple.500" /></Box>
                        ) : collectionGames && collectionGames.length > 0 ? (
                            <SimpleGrid columns={3} spacing={3}>
                                {collectionGames.map((game) => (
                                    <TierGameCard 
                                        key={game.igdbId || game.id} 
                                        game={game} 
                                        variant="sidebar"
                                        onClick={() => onAddGame(game)} 
                                    />
                                ))}
                            </SimpleGrid>
                        ) : (
                            <Box textAlign="center" py={10} color="gray.500" fontSize="sm">
                                This list is empty.
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};