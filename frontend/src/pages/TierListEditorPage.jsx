import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { 
    Box, Flex, Heading, Button, HStack, useToast, Text 
} from "@chakra-ui/react";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa"; 
import { GamePickerSidebar } from "../components/tier-list/GamePickerSidebar";
import { TierGameCard } from "../components/tier-list/TierGameCard";

const TierRow = ({ label, color, games }) => (
    <Flex 
        minH="95px" 
        bg="blackAlpha.400" 
        mb={1} 
        borderRadius="md" 
        overflow="hidden" 
        border="1px solid" 
        borderColor="whiteAlpha.100"
    >
        <Box w="70px" bg={color} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
            <Text fontWeight="bold" color="black" fontSize="xl">{label}</Text>
        </Box>
        <Flex p={2} gap={2} flexWrap="wrap" flex={1} alignItems="center">
            {games.map(g => <TierGameCard key={g.igdbId || g.id} game={g} variant="board" />)}
        </Flex>
    </Flex>
);

export const TierListEditorPage = () => {
    const { id } = useParams();
    const toast = useToast();
    
    // --- STATE ---
    const [isSidebarOpen, setSidebarOpen] = useState(false); 
    
    const [tiers, setTiers] = useState([
        { id: 'S', label: 'S', color: '#ff7f7f', games: [] },
        { id: 'A', label: 'A', color: '#ffbf7f', games: [] },
        { id: 'B', label: 'B', color: '#ffff7f', games: [] },
        { id: 'C', label: 'C', color: '#7fff7f', games: [] },
        { id: 'D', label: 'D', color: '#7fbfff', games: [] },
    ]);

    const [unrankedGames, setUnrankedGames] = useState([]);

    // --- HANDLERS ---
    const handleAddGame = (game) => {
        const inUnranked = unrankedGames.find(g => g.igdbId === game.igdbId);
        const inTier = tiers.some(tier => tier.games.find(g => g.igdbId === game.igdbId));

        if (inUnranked || inTier) {
            toast({ 
                title: "Already added", 
                status: "warning", 
                duration: 1000,
                position: "top-right" 
            });
            return;
        }

        setUnrankedGames(prev => [...prev, game]);
        toast({ 
            title: "Added to Pool", 
            status: "success", 
            duration: 800,
            position: "bottom-right",
            variant: "subtle"
        });
    };

    const handleSave = async () => {
        toast({ title: "Progress Saved", status: "success", duration: 2000 });
    };

    return (
        <Flex 
            h="calc(100vh - 64px)" 
            overflow="hidden" 
            bg="brand.900"
            mx={{ base: -2, md: -4 }} 
            mt={{ base: -2, md: -4 }}
            mb={{ base: -2, md: -4 }} 
            w="auto"
        >
            
            {/* LEFT SIDE: Main Editor Area */}
            <Flex flex={1} direction="column" overflow="hidden" position="relative">
                
                {/* 1. Sticky Header */}
                <HStack 
                    px={4} py={2} 
                    bg="brand.800" 
                    borderBottom="1px solid" 
                    borderColor="brand.700" 
                    justify="space-between"
                    flexShrink={0}
                    zIndex={20}
                >
                    <Box>
                        <Heading size="xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                            Tier List Editor
                        </Heading>
                    </Box>
                    <HStack>
                        <Button 
                            leftIcon={isSidebarOpen ? <FaTimes /> : <FaPlus />} 
                            colorScheme={isSidebarOpen ? "gray" : "purple"} 
                            variant={isSidebarOpen ? "ghost" : "solid"}
                            size="xs"
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? "Close" : "Add Games"}
                        </Button>
                        <Button leftIcon={<FaSave />} size="xs" colorScheme="green" variant="outline" onClick={handleSave}>
                            Save
                        </Button>
                    </HStack>
                </HStack>

                {/* 2. Unified Scrollable Area (Tiers + Pool) */}
                <Box 
                    flex={1} 
                    overflowY="auto" // The one and only scrollbar
                    // Custom Scrollbar Styling
                    css={{ 
                        '&::-webkit-scrollbar': { width: '8px' },
                        '&::-webkit-scrollbar-track': { background: 'rgba(0,0,0,0.1)' },
                        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }
                    }}
                >
                    {/* Tier Rows Section */}
                    <Box p={4} pb={0}>
                        {tiers.map((tier) => (
                            <TierRow 
                                key={tier.id} 
                                label={tier.label} 
                                color={tier.color} 
                                games={tier.games} 
                            />
                        ))}
                    </Box>

                    {/* Unranked Pool Section (Flows naturally below rows) */}
                    <Box 
                        mt={4}
                        bg="gray.900"
                        borderTop="1px solid" 
                        borderColor="whiteAlpha.300"
                        // CHANGE: h="auto" allows it to grow infinitely
                        h="auto"
                        // CHANGE: minH ensures it always looks substantial even if empty
                        minH="300px" 
                        w="full"
                        p={4}
                        pb={10} // Extra padding at bottom for comfortable scrolling
                    >
                         <HStack justify="space-between" mb={3}>
                            <Text color="purple.200" fontSize="10px" fontWeight="bold" letterSpacing="wider">
                                UNRANKED POOL ({unrankedGames.length})
                            </Text>
                        </HStack>

                        <Flex 
                            gap={3} 
                            wrap="wrap" // Games drop to next line
                            alignContent="flex-start"
                        >
                            {unrankedGames.length === 0 ? (
                                <Text color="gray.600" fontSize="xs" w="full" textAlign="center" mt={8}>
                                    Pool is empty. Add games from the sidebar!
                                </Text>
                            ) : (
                                unrankedGames.map(game => (
                                    <TierGameCard 
                                        key={game.igdbId || game.id}
                                        game={game} 
                                        variant="board"
                                        onRemove={(id) => setUnrankedGames(prev => prev.filter(g => (g.igdbId || g.id) !== id))}
                                    />
                                ))
                            )}
                        </Flex>
                    </Box>
                </Box>
            </Flex>

            {/* RIGHT SIDE: Sidebar (Remains fixed height so you don't lose your search) */}
            <Box 
                w={isSidebarOpen ? "320px" : "0px"} 
                overflow="hidden"
                transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                borderLeft={isSidebarOpen ? "1px solid" : "none"}
                borderBottom={isSidebarOpen ? "1px solid" : "none"}
                borderColor="brand.700"
                bg="brand.900"
            >
                <Box w="320px" h="full">
                    <GamePickerSidebar onAddGame={handleAddGame} />
                </Box>
            </Box>

        </Flex>
    );
};