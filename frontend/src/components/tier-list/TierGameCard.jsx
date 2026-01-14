import React from "react";
import { Box, Image, Tooltip, IconButton } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

export const TierGameCard = ({ game, onRemove, onClick, variant = "board" }) => {
    const isSidebar = variant === "sidebar";
    
    const width = isSidebar ? "70px" : "60px";
    const height = isSidebar ? "93px" : "80px"; 

    // --- DATA NORMALIZATION ---
    const gameTitle = game.title || game.name || "Unknown Game";
    const gameId = game.igdbId || game.id;
    
    // --- IMAGE HANDLING ---
    const getCoverUrl = (g) => {
        let url = g.coverUrl || (g.cover && g.cover.url) || "";
        if (!url) return "https://via.placeholder.com/150?text=No+Image";
        if (url.startsWith("//")) url = "https:" + url;
        return url.replace("t_thumb", "t_cover_small").replace("t_cover_big", "t_cover_small");
    };

    const displayCover = getCoverUrl(game);

    return (
        <Tooltip label={gameTitle} hasArrow openDelay={500}>
            <Box 
                w={width} 
                h={height}
                position="relative"
                borderRadius="sm"
                overflow="hidden"
                cursor={onClick ? "pointer" : "grab"}
                boxShadow="dark-lg" // Deeper shadow for pop
                border="2px solid transparent"
                transition="all 0.2s"
                bg="gray.800"
                _hover={{ borderColor: "purple.400", transform: "scale(1.05)", zIndex: 10 }}
                onClick={() => onClick && onClick(game)}
                role="group"
            >
                <Image 
                    src={displayCover} 
                    alt={gameTitle} 
                    w="full" 
                    h="full" 
                    objectFit="cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Error"; }}
                />

                {!isSidebar && onRemove && (
                    <IconButton
                        icon={<FaTimes />}
                        size="xs"
                        position="absolute"
                        top={0}
                        right={0}
                        colorScheme="red"
                        variant="solid"
                        opacity={0}
                        _groupHover={{ opacity: 1 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(gameId);
                        }}
                        aria-label="Remove game"
                        minW="14px"
                        h="14px"
                        fontSize="9px"
                        roundedTopLeft="none"
                        roundedBottomRight="none"
                        zIndex={3}
                    />
                )}
            </Box>
        </Tooltip>
    );
};