import { Box, Flex, Text } from "@chakra-ui/react";
import { TierGameCard } from "./TierGameCard";

export const UnrankedPool = ({ games, onRemove }) => {
    return (
        <Box mt={10} p={6} bg="brand.800" borderRadius="xl" border="2px dashed" borderColor="brand.700">
            <Text mb={4} fontWeight="bold" color="gray.500" fontSize="xs" textTransform="uppercase">
                Unranked Pool
            </Text>
            <Flex wrap="wrap" gap={3}>
                {games.length === 0 ? (
                    <Text color="gray.600" fontSize="sm">Add games from the sidebar to start ranking...</Text>
                ) : (
                    games.map((game) => (
                        <TierGameCard 
                            key={game.igdbId} 
                            game={game} 
                            onRemove={onRemove} 
                        />
                    ))
                )}
            </Flex>
        </Box>
    );
};