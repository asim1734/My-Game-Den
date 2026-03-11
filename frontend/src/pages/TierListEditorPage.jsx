import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Flex,
    Heading,
    Button,
    HStack,
    Tooltip,
    Spinner,
    VStack,
    Text,
} from "@chakra-ui/react";
import {
    FaPlus,
    FaSave,
    FaTimes,
    FaDownload,
    FaUndo,
    FaRedo,
} from "react-icons/fa";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// --- COMPONENTS ---
import { GamePickerSidebar } from "../components/tier-list/GamePickerSidebar";
import { TierRow } from "../components/tier-list/TierRow";
import { UnrankedPool } from "../components/tier-list/UnrankedPool";
import { TierGameCard } from "../components/tier-list/TierGameCard";

// --- HOOKS ---
import { useTierList } from "../hooks/useTierList";

export const TierListEditorPage = () => {
    const { id } = useParams();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const {
        items,
        listTitle,
        itemsLoaded,
        activeDragItem,
        sensors,
        tierDefs,
        isDirty,
        canUndo,
        canRedo,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleAddGame,
        handleRemoveGame,
        handleSave,
        downloadImage,
        handleUpdateTier,
        handleAddTier,
        handleDeleteTier,
        undo,
        redo,
    } = useTierList(id);

    // Ctrl+Z / Ctrl+Y keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if (
                ((e.ctrlKey || e.metaKey) && e.key === "y") ||
                ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
            ) {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [undo, redo]);

    if (!itemsLoaded) {
        return (
            <Flex
                h="calc(100vh - 64px)"
                align="center"
                justify="center"
                bg="brand.900"
            >
                <VStack spacing={4}>
                    <Spinner
                        size="xl"
                        color="purple.400"
                        thickness="3px"
                        speed="0.8s"
                    />
                    <Text color="gray.500" fontSize="sm">
                        Loading tier list...
                    </Text>
                </VStack>
            </Flex>
        );
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
                mx={{ base: -2, md: -4 }}
                mt={{ base: -2, md: -4 }}
                mb={{ base: -2, md: -4 }}
                w="auto"
            >
                {/* LEFT: Editor Area */}
                <Flex
                    flex={1}
                    direction="column"
                    overflow="hidden"
                    position="relative"
                >
                    {/* 1. Header Bar */}
                    <HStack
                        px={4}
                        py={2}
                        bg="brand.800"
                        borderBottom="1px solid"
                        borderColor="brand.700"
                        justify="space-between"
                        flexShrink={0}
                        zIndex={20}
                    >
                        <HStack spacing={2}>
                            <Heading
                                size="xs"
                                color="gray.400"
                                textTransform="uppercase"
                                letterSpacing="wide"
                            >
                                {listTitle || "Untitled List"}
                            </Heading>
                            {/* Unsaved changes dot */}
                            {isDirty && (
                                <Tooltip label="Unsaved changes" openDelay={300}>
                                    <Box
                                        w="7px"
                                        h="7px"
                                        borderRadius="full"
                                        bg="orange.400"
                                        flexShrink={0}
                                    />
                                </Tooltip>
                            )}
                        </HStack>

                        <HStack spacing={1}>
                            <Tooltip label="Undo (Ctrl+Z)" openDelay={500}>
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    colorScheme="gray"
                                    onClick={undo}
                                    isDisabled={!canUndo}
                                    px={2}
                                >
                                    <FaUndo />
                                </Button>
                            </Tooltip>

                            <Tooltip label="Redo (Ctrl+Y)" openDelay={500}>
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    colorScheme="gray"
                                    onClick={redo}
                                    isDisabled={!canRedo}
                                    px={2}
                                >
                                    <FaRedo />
                                </Button>
                            </Tooltip>

                            <Button
                                leftIcon={
                                    isSidebarOpen ? <FaTimes /> : <FaPlus />
                                }
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
                                colorScheme={isDirty ? "green" : "gray"}
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
                        css={{
                            "&::-webkit-scrollbar": { width: "8px" },
                            "&::-webkit-scrollbar-thumb": {
                                background: "rgba(255,255,255,0.2)",
                                borderRadius: "4px",
                            },
                        }}
                    >
                        <SortableContext
                            items={tierDefs.map((t) => `row-${t.id}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            {tierDefs.map((tier) => (
                                <TierRow
                                    key={tier.id}
                                    id={tier.id}
                                    label={tier.label}
                                    color={tier.color}
                                    games={items[tier.id] || []}
                                    onUpdate={handleUpdateTier}
                                    onDelete={handleDeleteTier}
                                    onRemove={handleRemoveGame}
                                />
                            ))}
                        </SortableContext>

                        {/* Add Tier Button — hidden in export */}
                        <Button
                            data-export-hide="true"
                            leftIcon={<FaPlus />}
                            size="sm"
                            w="full"
                            mt={2}
                            border="1px dashed"
                            borderColor="whiteAlpha.300"
                            color="gray.500"
                            bg="transparent"
                            _hover={{
                                borderColor: "purple.500",
                                color: "purple.300",
                                bg: "transparent",
                            }}
                            onClick={handleAddTier}
                        >
                            Add Tier
                        </Button>

                        {/* Unranked Pool — in-board, no fixed footer */}
                        <Box
                            mt={4}
                            pt={4}
                            borderTop="1px solid"
                            borderColor="whiteAlpha.100"
                            data-export-hide="true"
                        >
                            <UnrankedPool
                                games={items.unranked}
                                id="unranked"
                                onRemove={handleRemoveGame}
                            />
                        </Box>

                        <Box h="40px" />
                    </Box>

                </Flex>

                {/* 4. Right Sidebar */}
                <Box
                    w={isSidebarOpen ? "320px" : "0px"}
                    overflow="hidden"
                    transition="width 0.3s ease"
                    borderLeft={isSidebarOpen ? "1px solid" : "none"}
                    borderColor="brand.700"
                    bg="brand.900"
                >
                    <Box w="320px" h="full">
                        <GamePickerSidebar onAddGame={handleAddGame} />
                    </Box>
                </Box>
            </Flex>

            <DragOverlay>
                {activeDragItem ? (
                    <TierGameCard game={activeDragItem} variant="board" />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};
