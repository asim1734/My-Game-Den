import React, { useState } from "react";
import { Box, Heading, Button, HStack, useToast, Container } from "@chakra-ui/react";
import { TierBoard } from "../components/tier-list/TierBoard";
import { UnrankedPool } from "../components/tier-list/UnrankedPool";

export const TierListEditorPage = () => {
    const toast = useToast();
    
    const [tiers, setTiers] = useState([
        { label: 'S', color: '#ff7f7f', games: [] },
        { label: 'A', color: '#ffbf7f', games: [] },
        { label: 'B', color: '#ffff7f', games: [] },
        { label: 'C', color: '#7fff7f', games: [] },
        { label: 'D', color: '#7fbfff', games: [] },
    ]);

    const [unrankedPool, setUnrankedPool] = useState([]);

    const handleSave = async () => {
        toast({ 
            title: "Progress Saved", 
            description: "Your tier list snapshot has been stored.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Container maxW="container.xl" py={8}>
            <HStack justify="space-between" mb={8} alignItems="center">
                <Box>
                    <Heading size="lg" color="white">Tier List Creator</Heading>
                    <Heading size="xs" color="gray.500" mt={1} fontWeight="medium">
                        Drag and drop games to rank them
                    </Heading>
                </Box>
                <Button colorScheme="purple" size="md" onClick={handleSave} px={8}>
                    Save Changes
                </Button>
            </HStack>

            <TierBoard tiers={tiers} onUpdateTiers={setTiers} />
            
            <UnrankedPool 
                games={unrankedPool} 
                onRemove={(id) => setUnrankedPool(prev => prev.filter(g => g.igdbId !== id))} 
            />
        </Container>
    );
};