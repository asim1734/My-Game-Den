import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableGameCard } from "./SortableGameCard";
import { TrashZone } from "./TrashZone";

export const UnrankedPool = ({ games, id = "unranked", onRemove }) => {
    const { setNodeRef } = useDroppable({
        id,
        data: { type: "container", id },
    });

    return (
        <Flex
            mb={2}
            bg="blackAlpha.400"
            borderRadius="md"
            overflow="hidden"
            minH="100px"
        >
            {/* Left label — matches TierRow label column */}
            <Box
                w="80px"
                bg="gray.700"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={1}
                flexShrink={0}
            >
                <Text
                    color="gray.300"
                    fontWeight="900"
                    fontSize="xs"
                    textAlign="center"
                    textTransform="uppercase"
                    lineHeight="1.1"
                >
                    UNRANKED
                </Text>
                <Text color="gray.500" fontSize="9px" textAlign="center" mt={1}>
                    {games.length} game{games.length !== 1 ? "s" : ""}
                </Text>
            </Box>

            {/* Games area — matches TierRow games column */}
            <Box ref={setNodeRef} flex={1} p={2} minW="0">
                <SortableContext
                    id={id}
                    items={games.map((g) => g.igdbId || g.id)}
                    strategy={rectSortingStrategy}
                >
                    <Flex wrap="wrap" gap={2} minH="80px" align="center">
                        {games.length === 0 ? (
                            <Text
                                fontSize="xs"
                                color="gray.700"
                                fontStyle="italic"
                                userSelect="none"
                                pl={1}
                                data-export-hide="true"
                            >
                                Add games from the sidebar!
                            </Text>
                        ) : (
                            games.map((game) => (
                                <SortableGameCard
                                    key={game.igdbId || game.id}
                                    id={game.igdbId || game.id}
                                    game={game}
                                    onRemove={onRemove}
                                />
                            ))
                        )}
                    </Flex>
                </SortableContext>
            </Box>

            {/* Trash zone — inline at the end of the pool */}
            <Flex
                align="center"
                justify="center"
                px={3}
                flexShrink={0}
                data-export-hide="true"
            >
                <TrashZone />
            </Flex>
        </Flex>
    );
};
