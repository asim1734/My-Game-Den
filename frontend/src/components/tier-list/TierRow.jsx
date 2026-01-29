import React, { useState } from "react";
import { 
    Box, Text, IconButton, Flex, Popover, PopoverTrigger, 
    PopoverContent, PopoverBody, PopoverArrow, Input, VStack, HStack 
} from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableGameCard } from "./SortableGameCard";

export const TierRow = ({ id, label, color, games, onUpdate }) => {
    const { setNodeRef } = useDroppable({ id });
    const [tempLabel, setTempLabel] = useState(label);

    const handleColorChange = (newColor) => {
        onUpdate(id, { color: newColor });
    };

    const handleLabelBlur = () => {
        if (tempLabel.trim() !== "") {
            onUpdate(id, { label: tempLabel });
        } else {
            setTempLabel(label); 
        }
    };

    // --- 3-STAGE FONT SCALING ---
    let fontSize = "xl"; // Default for S, A, B (1-2 chars)
    if (label.length > 6) {
        fontSize = "xs"; // Long words (Unsatisfactory)
    } else if (label.length > 2) {
        fontSize = "sm"; // Medium words (GOATED, Trash)
    }

    return (
        <Flex mb={2} bg="blackAlpha.400" borderRadius="md" overflow="hidden" minH="100px">
            {/* TIER LABEL (Left Side) */}
            <Popover placement="right-start">
                <PopoverTrigger>
                    <Box 
                        w="80px" 
                        bg={color} 
                        position="relative" 
                        display="flex" 
                        flexDirection="column"
                        alignItems="center" 
                        justifyContent="center" 
                        p={1} // Tighter padding
                        cursor="pointer"
                        _hover={{ filter: "brightness(1.1)" }}
                        role="group"
                    >
                        <Text 
                            color="black" 
                            fontWeight="900" // Extra Bold
                            fontSize={fontSize} // Apply scaled size
                            textAlign="center"
                            lineHeight="1.1"
                            textTransform="uppercase"
                            // Use 'break-word' to prevent splitting words unless absolutely necessary
                            wordBreak="normal" 
                            overflowWrap="break-word"
                        >
                            {label}
                        </Text>
                        
                        {/* Settings Icon (Absolute Position) */}
                        <IconButton 
                            icon={<FaCog />} 
                            size="xs" 
                            variant="ghost" 
                            color="blackAlpha.600"
                            position="absolute"
                            top="0"
                            right="0"
                            opacity={0}
                            _groupHover={{ opacity: 1 }}
                            aria-label="Edit Tier"
                            zIndex={2}
                            h="20px"
                            minW="20px"
                        />
                    </Box>
                </PopoverTrigger>
                
                {/* POPUP MENU */}
                <PopoverContent w="200px" bg="gray.700" borderColor="gray.600" onClick={e => e.stopPropagation()}>
                    <PopoverArrow bg="gray.700" />
                    <PopoverBody>
                        <VStack spacing={3}>
                            <Box w="full">
                                <Text fontSize="xs" color="gray.400" mb={1}>Label</Text>
                                <Input 
                                    size="sm" 
                                    value={tempLabel}
                                    onChange={(e) => setTempLabel(e.target.value)}
                                    onBlur={handleLabelBlur}
                                    onKeyDown={(e) => e.stopPropagation()} 
                                    color="white"
                                />
                            </Box>
                            <Box w="full">
                                <Text fontSize="xs" color="gray.400" mb={1}>Color</Text>
                                <HStack spacing={2} wrap="wrap">
                                    {['#ff7f7f', '#ffbf7f', '#ffff7f', '#7fff7f', '#7fbfff', '#d67fff', '#ff7fbf'].map(c => (
                                        <Box 
                                            key={c} 
                                            w="20px" h="20px" 
                                            bg={c} 
                                            borderRadius="full" 
                                            cursor="pointer"
                                            border={color === c ? "2px solid white" : "none"}
                                            onClick={() => handleColorChange(c)}
                                        />
                                    ))}
                                </HStack>
                            </Box>
                        </VStack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>

            {/* GAMES AREA */}
            <Box ref={setNodeRef} flex={1} p={2} minW="0">
                <SortableContext id={id} items={games.map(g => g.igdbId || g.id)} strategy={rectSortingStrategy}>
                    <Flex wrap="wrap" gap={2}>
                        {games.map((game) => (
                            <SortableGameCard 
                                key={game.igdbId || game.id} 
                                id={game.igdbId || game.id} 
                                game={game} 
                            />
                        ))}
                    </Flex>
                </SortableContext>
            </Box>
        </Flex>
    );
};