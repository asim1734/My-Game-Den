import { Box, VStack, HStack, Text, Flex } from "@chakra-ui/react";
import { TierGameCard } from "./TierGameCard";

export const TierBoard = ({ tiers, onUpdateTiers }) => {
    
    const handleRemoveGame = (tierIndex, gameId) => {
        const newTiers = [...tiers];
        newTiers[tierIndex].games = newTiers[tierIndex].games.filter(g => g.igdbId !== gameId);
        onUpdateTiers(newTiers);
    };

    return (
        <VStack spacing={2} align="stretch" w="full" bg="brand.900" p={2} borderRadius="md">
            {tiers.map((tier, index) => (
                <HStack key={index} spacing={0} minH="80px" align="stretch">
                    {/* Tier Label */}
                    <Flex
                        w="80px"
                        bg={tier.color}
                        align="center"
                        justify="center"
                        p={2}
                        textAlign="center"
                    >
                        <Text color="gray.900" fontWeight="bold" fontSize="lg">{tier.label}</Text>
                    </Flex>

                    {/* Drop Zone */}
                    <Flex
                        flex={1}
                        bg="brand.800"
                        p={2}
                        wrap="wrap"
                        gap={2}
                        border="1px solid"
                        borderColor="brand.700"
                    >
                        {tier.games.map((game) => (
                            <TierGameCard 
                                key={game.igdbId} 
                                game={game} 
                                onRemove={(id) => handleRemoveGame(index, id)} 
                            />
                        ))}
                    </Flex>
                </HStack>
            ))}
        </VStack>
    );
};