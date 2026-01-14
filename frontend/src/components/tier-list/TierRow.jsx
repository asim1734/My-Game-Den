import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableGameCard } from "./SortableGameCard";

export const TierRow = ({ id, label, color, games }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: { type: "container", id: id }
    });

    return (
        <Flex 
            minH="95px" 
            bg="blackAlpha.400" 
            mb={1} 
            borderRadius="md" 
            overflow="hidden" 
            border="1px solid" 
            borderColor={isOver ? "purple.400" : "whiteAlpha.100"}
            boxShadow={isOver ? "0 0 10px rgba(159, 122, 234, 0.3)" : "none"}
            transition="all 0.2s"
        >
            {/* Label (S, A, B...) */}
            <Box w="70px" bg={color} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                <Text fontWeight="bold" color="black" fontSize="xl">{label}</Text>
            </Box>

            <Box ref={setNodeRef} flex={1} p={2} w="full">
                <SortableContext 
                    id={id} 
                    items={games.map(g => g.igdbId || g.id)} 
                    strategy={rectSortingStrategy}
                >
                    <Flex gap={2} flexWrap="wrap" alignItems="center" w="full" h="full">
                        {games.length === 0 ? (
                            <Text color="whiteAlpha.200" fontSize="sm" w="full" h="full" display="flex" alignItems="center" pl={2}>
                               
                            </Text>
                        ) : (
                            games.map((game) => (
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
        </Flex>
    );
};