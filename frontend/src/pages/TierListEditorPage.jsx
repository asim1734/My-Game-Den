import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { 
    Box, Flex, Heading, Button, HStack, useToast 
} from "@chakra-ui/react";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa"; // Removed FaDownload
import { 
    DndContext, DragOverlay, pointerWithin, 
    useSensor, useSensors, PointerSensor, KeyboardSensor 
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { FaDownload } from "react-icons/fa";

// --- COMPONENTS ---
import { GamePickerSidebar } from "../components/tier-list/GamePickerSidebar";
import { TierRow } from "../components/tier-list/TierRow";
import { UnrankedPool } from "../components/tier-list/UnrankedPool";
import { TierGameCard } from "../components/tier-list/TierGameCard";
import { TrashZone } from "../components/tier-list/TrashZone"; 

// --- HOOKS ---
import { useTierList } from "../hooks/useTierList"; 

export const TierListEditorPage = () => {
    const { id } = useParams(); 
    const toast = useToast();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // --- USE THE CUSTOM HOOK ---
    const {
        items,
        listTitle,
        itemsLoaded,
        activeDragItem,
        sensors,
        tierDefs,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleAddGame,
        handleSave,
        downloadImage,
        handleUpdateTier
    } = useTierList(id); 

    if (!itemsLoaded) {
        return <Box p={10} color="white">Loading Tier List...</Box>;
    }

    return (
        <DndContext 
            sensors={sensors} 
            collisionDetection={pointerWithin} 
            onDragStart={handleDragStart}
            onDragOver={handleDragOver} 
            onDragEnd={handleDragEnd}
        >
            <Flex 
                h="calc(100vh - 64px)" 
                overflow="hidden" 
                bg="brand.900"
                mx={{ base: -2, md: -4 }} mt={{ base: -2, md: -4 }} mb={{ base: -2, md: -4 }} 
                w="auto"
            >
                {/* LEFT: Editor Area */}
                <Flex flex={1} direction="column" overflow="hidden" position="relative">
                    
                    {/* 1. Header Bar */}
                    <HStack px={4} py={2} bg="brand.800" borderBottom="1px solid" borderColor="brand.700" justify="space-between" flexShrink={0} zIndex={20}>
                        <Heading size="xs" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                            {listTitle || "Untitled List"}
                        </Heading>
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

                            <Button 
                                leftIcon={<FaSave />} 
                                size="xs" 
                                colorScheme="green" 
                                variant="solid" 
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button 
                                leftIcon={<FaDownload />} 
                                size="xs" 
                                colorScheme="blue" 
                                variant="outline" 
                                onClick={() => downloadImage("tier-list-board")}
                            >
                                Export
                            </Button>
                        </HStack>
                    </HStack>

                    {/* 2. Scrollable Tiers */}
                    <Box 
                        id="tier-list-board" 
                        flex={1} 
                        overflowY="auto" 
                        p={4} 
                        bg="brand.900"
                        minH="0" 
                        css={{ '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.2)', borderRadius: '4px' } }}
                    >
                        {tierDefs.map((tier) => (
                            <TierRow 
                                key={tier.id} 
                                id={tier.id} 
                                label={tier.label} 
                                color={tier.color} 
                                games={items[tier.id]} 
                                onUpdate={handleUpdateTier}
                            />
                        ))}
                        <Box h="20px" /> 
                    </Box>

                    {/* 3. Fixed Footer (Unranked + Trash) */}
                    <Box 
                        flexShrink={0} 
                        zIndex={10} 
                        bg="#1A202C" 
                        borderTop="1px solid" 
                        borderColor="whiteAlpha.200"
                        boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
                    >
                        <Flex h="140px" align="center" px={4} py={2} gap={4}>
                            <Box flex={1} h="full" minW={0}> 
                                <UnrankedPool games={items.unranked} id="unranked" /> 
                            </Box>
                            <TrashZone />
                        </Flex>
                    </Box>

                </Flex>

                {/* 4. Right Sidebar */}
                <Box w={isSidebarOpen ? "320px" : "0px"} overflow="hidden" transition="width 0.3s ease" borderLeft={isSidebarOpen ? "1px solid" : "none"} borderColor="brand.700" bg="brand.900">
                    <Box w="320px" h="full">
                        <GamePickerSidebar onAddGame={handleAddGame} />
                    </Box>
                </Box>
            </Flex>

            <DragOverlay>
                {activeDragItem ? <TierGameCard game={activeDragItem} variant="board" /> : null}
            </DragOverlay>
        </DndContext>
    );
};