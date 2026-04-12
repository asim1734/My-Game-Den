import React from "react";
import { Box, Icon, Text, VStack } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { useDroppable } from "@dnd-kit/core";

export const TrashZone = () => {
    const { setNodeRef, isOver } = useDroppable({
        id: "TRASH",
        data: { type: "trash" }
    });

    return (
        <Box
            ref={setNodeRef}
            // Match dimensions to your Game Cards (80px x 110px) for consistency
            w={{ base: "58px", md: "80px" }}
            h={{ base: "78px", md: "110px" }}
            // Default: Dark Gray. Hover: Bright Red.
            bg={isOver ? "red.500" : "whiteAlpha.100"}
            // Border: Subtle dashed when idle, solid red when active
            border="2px dashed"
            borderColor={isOver ? "red.200" : "whiteAlpha.200"}
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            flexShrink={0}
            role="button"
            aria-label="Trash Zone"
        >
            <VStack spacing={1}>
                <Icon 
                    as={FaTrash} 
                    boxSize={{ base: 4, md: 5 }} 
                    color={isOver ? "white" : "gray.500"} 
                    transform={isOver ? "scale(1.2)" : "scale(1)"}
                    transition="transform 0.2s"
                />
                <Text 
                    fontSize={{ base: "9px", md: "10px" }} 
                    fontWeight="bold" 
                    textTransform="uppercase"
                    color={isOver ? "white" : "gray.500"}
                    display={{ base: "none", md: "block" }}
                >
                    Remove
                </Text>
            </VStack>
        </Box>
    );
};