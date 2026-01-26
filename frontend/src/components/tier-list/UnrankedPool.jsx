import React from "react";
import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableGameCard } from "./SortableGameCard";

export const UnrankedPool = ({ games, id = "unranked" }) => {
    // 1. Make this pool a droppable zone
    const { setNodeRef } = useDroppable({
        id: id,
        data: { type: "container", id: id }
    });

    return (
        <Box 
            bg="gray.900"
            // borderTop="1px solid" 
            // borderColor="whiteAlpha.300"
            boxShadow="0px -4px 20px rgba(0,0,0,0.5)"
            h="auto"
            minH="200px" 
            w="full"
            p={4}
            pb={10} 
            display="flex"
            flexDirection="column"
            zIndex={10}
        >
            <HStack justify="space-between" mb={3}>
                <Text color="purple.200" fontSize="10px" fontWeight="bold" letterSpacing="wider">
                    UNRANKED POOL ({games.length})
                </Text>
            </HStack>

            {/* 2. The Context enables sorting for items inside */}
            <Box ref={setNodeRef} flex={1}>
                <SortableContext 
                    id={id} 
                    items={games.map(g => g.igdbId || g.id)} 
                    strategy={rectSortingStrategy} // Better for grids
                >
                    <Flex 
                        gap={3} 
                        wrap="wrap" 
                        alignContent="flex-start"
                    >
                        {games.length === 0 ? (
                            <Text color="gray.600" fontSize="xs" w="full" textAlign="center" mt={8}>
                                Pool is empty. Add games from the sidebar!
                            </Text>
                        ) : (
                            games.map(game => (
                                <SortableGameCard 
                                    key={game.igdbId || game.id} 
                                    id={game.igdbId || game.id} 
                                    game={game} 
                                />
                            ))
                        )}
                    </Flex>
                </SortableContext>
            </Box>
        </Box>
    );
};