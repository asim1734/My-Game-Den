import React from "react";
import { 
    Box, Flex, Text, IconButton, Popover, PopoverTrigger, PopoverContent, 
    PopoverBody, PopoverArrow, VStack, Input, HStack, SimpleGrid 
} from "@chakra-ui/react";
import { SettingsIcon, DeleteIcon, ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableGameCard } from "./SortableGameCard";

// Predefined colors for the picker
const COLORS = [
    "#ff7f7f", "#ffbf7f", "#ffff7f", "#7fff7f", "#7fbfff", 
    "#d69e2e", "#805ad5", "#f687b3", "#cbd5e0", "#2d3748"
];

export const TierRow = ({ 
    id, label, color, games, 
    onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast 
}) => {
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
            overflow="visible" // Allow popover to escape if needed
            border="2px solid" 
            borderColor={isOver ? "red.500" : "whiteAlpha.100"}
            boxShadow={isOver ? "0 0 10px rgba(255, 0, 0, 0.3)" : "none"}
            transition="all 0.2s"
        >
            {/* LABEL & SETTINGS AREA */}
            <Popover placement="right-start" isLazy>
                <PopoverTrigger>
                    <Box 
                        w="70px" 
                        bg={color} 
                        display="flex" 
                        flexDirection="column"
                        alignItems="center" 
                        justifyContent="center" 
                        flexShrink={0}
                        cursor="pointer"
                        role="group"
                        position="relative"
                    >
                        <Text 
                            fontWeight="bold" 
                            color="black" 
                            fontSize={label.length > 3 ? "sm" : "xl"} 
                            textAlign="center"
                            wordBreak="break-word"
                            px={1}
                        >
                            {label}
                        </Text>
                        
                        {/* Hover Overlay Icon */}
                        <Box 
                            position="absolute" 
                            inset={0} 
                            bg="blackAlpha.600" 
                            display="none" 
                            alignItems="center" 
                            justifyContent="center"
                            _groupHover={{ display: "flex" }}
                        >
                            <SettingsIcon color="white" />
                        </Box>
                    </Box>
                </PopoverTrigger>
                
                <PopoverContent bg="gray.800" borderColor="gray.600" w="240px">
                    <PopoverArrow bg="gray.800" />
                    <PopoverBody>
                        <VStack spacing={3} align="stretch">
                            <Box>
                                <Text fontSize="xs" color="gray.400" mb={1}>Label</Text>
                                <Input 
                                    size="sm" 
                                    value={label} 
                                    onChange={(e) => onUpdate(id, { label: e.target.value })} 
                                />
                            </Box>
                            
                            <Box>
                                <Text fontSize="xs" color="gray.400" mb={1}>Color</Text>
                                <SimpleGrid columns={5} spacing={1}>
                                    {COLORS.map(c => (
                                        <Box 
                                            key={c} 
                                            w="6" h="6" 
                                            bg={c} 
                                            borderRadius="full" 
                                            cursor="pointer"
                                            border={color === c ? "2px solid white" : "none"}
                                            onClick={() => onUpdate(id, { color: c })}
                                        />
                                    ))}
                                </SimpleGrid>
                            </Box>

                            <HStack justify="space-between">
                                <HStack>
                                    <IconButton 
                                        icon={<ChevronUpIcon />} 
                                        size="xs" 
                                        isDisabled={isFirst}
                                        onClick={onMoveUp}
                                        aria-label="Move Up"
                                    />
                                    <IconButton 
                                        icon={<ChevronDownIcon />} 
                                        size="xs" 
                                        isDisabled={isLast}
                                        onClick={onMoveDown}
                                        aria-label="Move Down"
                                    />
                                </HStack>
                                <IconButton 
                                    icon={<DeleteIcon />} 
                                    size="xs" 
                                    colorScheme="red" 
                                    onClick={() => onDelete(id)}
                                    aria-label="Delete Row"
                                />
                            </HStack>
                        </VStack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>

            {/* DROP ZONE */}
            <Box ref={setNodeRef} flex={1} p={2} w="full">
                <SortableContext 
                    id={id} 
                    items={games.map(g => g.igdbId || g.id)} 
                    strategy={rectSortingStrategy}
                >
                    <Flex gap={2} flexWrap="wrap" alignItems="center" w="full" h="full">
                        {games.length === 0 ? (
                            <Text color="whiteAlpha.200" fontSize="sm" w="full" h="full" display="flex" alignItems="center" pl={2}>
                                Drop here
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