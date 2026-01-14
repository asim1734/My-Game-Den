import { Box, Tooltip, IconButton } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

export const TierGameCard = ({ game, onRemove, isEditing = true }) => {
    return (
        <Tooltip label={game.title} placement="top" hasArrow>
            <Box 
                w="70px" 
                h="70px" 
                bgImage={`url(${game.coverUrl})`}
                bgSize="cover"
                bgPosition="center"
                borderRadius="md"
                position="relative"
                cursor="grab"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.1)", zIndex: 10 }}
            >
                {isEditing && (
                    <IconButton
                        aria-label="Remove"
                        icon={<FaTimes />}
                        size="xs"
                        colorScheme="red"
                        position="absolute"
                        top="-8px"
                        right="-8px"
                        borderRadius="full"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(game.igdbId);
                        }}
                    />
                )}
            </Box>
        </Tooltip>
    );
};