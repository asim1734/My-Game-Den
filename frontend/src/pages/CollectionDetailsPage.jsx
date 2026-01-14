import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Box, Heading, SimpleGrid, Center, Text, Button, VStack, Icon 
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FaGhost } from "react-icons/fa";

import { getAllUserLists, fetchGamesByIds } from "../api";
import GameCard from "../components/GameCard";
import GameCardSkeleton from "../components/GameCardSkeleton";

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

export const CollectionDetailsPage = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const decodedName = decodeURIComponent(name);

    // 1. Fetch all lists
    const { data: allLists, isLoading: isListsLoading } = useQuery({
        queryKey: ["userLists"],
        queryFn: getAllUserLists,
    });

    // 2. Extract IDs
    const currentList = allLists?.find((list) => list.name === decodedName);
    const listIds = currentList?.games || [];

    // 3. Fetch Game Metadata
    const { 
        data: listGames, 
        isLoading: isGamesLoading,
        isError 
    } = useQuery({
        queryKey: [`${decodedName}Games`, listIds],
        queryFn: () => fetchGamesByIds(listIds),
        enabled: !!listIds && listIds.length > 0,
        initialData: listIds.length === 0 ? [] : undefined 
    });

    const isLoading = isListsLoading || (listIds.length > 0 && isGamesLoading);

    // Error State
    if (isError) {
        return (
            <Center minH="50vh" flexDirection="column">
                <Text color="red.400" mb={4}>Error loading games.</Text>
                <Button size="sm" onClick={() => navigate("/library")}>Return to Library</Button>
            </Center>
        );
    }

    // Not Found
    if (!isLoading && !currentList) {
        return (
            <Center minH="50vh" flexDirection="column">
                <Heading size="md" color="gray.500">Collection Not Found</Heading>
                <Button mt={4} variant="link" onClick={() => navigate("/library")}>Return to Library</Button>
            </Center>
        );
    }

    return (
        // FIX: Increased maxW to 1600px to fill screen better (removes side gaps)
        // Reduced 'p' to reduce top gap
        <Box p={6} maxW="1600px" mx="auto">
            
            {/* Header matching your screenshot style */}
            <VStack align="start" mb={6} spacing={0}>
                <Button 
                    leftIcon={<ArrowBackIcon />} 
                    variant="link" 
                    color="gray.400"
                    size="sm"
                    mb={1}
                    _hover={{ color: "brand.400", textDecoration: "none" }}
                    onClick={() => navigate("/library")}
                >
                    Back to Library
                </Button>
                
                <Heading size="2xl" textTransform="capitalize" color="white" mb={1}>
                    {capitalize(currentList?.name)}
                </Heading>
                
                <Text fontSize="md" color="gray.500">
                    {listIds.length} {listIds.length === 1 ? 'game' : 'games'} in this collection
                </Text>
            </VStack>

            {/* Content Grid */}
            {isLoading ? (
                // FIX: Adjusted columns to make cards wider on typical screens
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5, "2xl": 6 }} spacing={6}>
                    {Array(10).fill(0).map((_, i) => <GameCardSkeleton key={i} />)}
                </SimpleGrid>
            ) : listGames && listGames.length > 0 ? (
                // FIX: Matches the layout above
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5, "2xl": 6 }} spacing={6}>
                    {listGames.map((game) => (
                        <GameCard 
                            key={game.igdbId} 
                            game={game} 
                            variant={currentList.name} 
                        />
                    ))}
                </SimpleGrid>
            ) : (
                <Center 
                    minH="300px" 
                    border="2px dashed" 
                    borderColor="brand.800" 
                    borderRadius="xl" 
                    flexDirection="column"
                    gap={4}
                    bg="whiteAlpha.50"
                >
                    <Icon as={FaGhost} w={12} h={12} color="gray.600" />
                    <Text color="gray.500" fontSize="lg">This collection is empty.</Text>
                    <Button colorScheme="purple" onClick={() => navigate("/")}>
                        Find Games to Add
                    </Button>
                </Center>
            )}
        </Box>
    );
};