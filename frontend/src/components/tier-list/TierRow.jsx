import React, { useState } from "react";
import {
    Box,
    Text,
    Icon,
    IconButton,
    Flex,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    Input,
    VStack,
    Divider,
    Button,
} from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { FaCog, FaGripVertical, FaTrash } from "react-icons/fa";
import { SortableGameCard } from "./SortableGameCard";

function TierRowInner({ id, label, color, games, onUpdate, onDelete, onRemove }) {
    // Droppable zone for game cards — uses the actual tier id
    const { setNodeRef: setDropRef } = useDroppable({ id });

    // Sortable for row reordering — uses prefixed id to avoid collisions
    const {
        setNodeRef: setSortableRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `row-${id}`, data: { type: "tier" } });

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

    // 4-stage font scaling
    let fontSize = "xl";
    if (label.length > 12) {
        fontSize = "10px";
    } else if (label.length > 6) {
        fontSize = "xs";
    } else if (label.length > 2) {
        fontSize = "sm";
    }

    return (
        <Flex
            ref={setSortableRef}
            mb={2}
            bg="blackAlpha.400"
            borderRadius="md"
            overflow="hidden"
            minH="100px"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.4 : 1,
                zIndex: isDragging ? 999 : "auto",
            }}
        >
            {/* DRAG HANDLE — hidden in export */}
            <Flex
                {...attributes}
                {...listeners}
                data-export-hide="true"
                w="18px"
                bg="blackAlpha.200"
                align="center"
                justify="center"
                cursor="grab"
                color="gray.600"
                flexShrink={0}
                _hover={{ color: "gray.300", bg: "blackAlpha.400" }}
                _active={{ cursor: "grabbing" }}
            >
                <Icon as={FaGripVertical} boxSize={3} />
            </Flex>

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
                        p={1}
                        cursor="pointer"
                        _hover={{ filter: "brightness(1.1)" }}
                        role="group"
                    >
                        <Text
                            w="100%"
                            color="black"
                            fontWeight="900"
                            fontSize={fontSize}
                            textAlign="center"
                            lineHeight="1.1"
                            textTransform="uppercase"
                            wordBreak="break-word"
                            overflowWrap="anywhere"
                            whiteSpace="normal"
                        >
                            {label}
                        </Text>

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
                            data-export-hide="true"
                        />
                    </Box>
                </PopoverTrigger>

                {/* POPUP MENU */}
                <PopoverContent
                    w="200px"
                    bg="gray.700"
                    borderColor="gray.600"
                    onClick={(e) => e.stopPropagation()}
                >
                    <PopoverArrow bg="gray.700" />
                    <PopoverBody>
                        <VStack spacing={3}>
                            <Box w="full">
                                <Text fontSize="xs" color="gray.400" mb={1}>
                                    Label
                                </Text>
                                <Input
                                    size="sm"
                                    value={tempLabel}
                                    onChange={(e) =>
                                        setTempLabel(e.target.value)
                                    }
                                    onBlur={handleLabelBlur}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    color="white"
                                />
                            </Box>
                            <Box w="full">
                                <Text fontSize="xs" color="gray.400" mb={1}>
                                    Color
                                </Text>
                                <Flex wrap="wrap" gap={1}>
                                    {[
                                        "#ff4d4d", "#ff7f7f", "#ffb3b3",
                                        "#ff6600", "#ffbf7f", "#ffd9b3",
                                        "#ffcc00", "#ffff7f", "#ffffb3",
                                        "#00cc44", "#7fff7f", "#b3ffcc",
                                        "#0099ff", "#7fbfff", "#b3d9ff",
                                        "#6600cc", "#b366ff", "#d9b3ff",
                                        "#ff0080", "#ff7fbf", "#ffb3d9",
                                        "#00cccc", "#7fffff", "#b3ffff",
                                        "#ffffff", "#aaaaaa", "#555555",
                                    ].map((c) => (
                                        <Box
                                            key={c}
                                            w="18px"
                                            h="18px"
                                            bg={c}
                                            borderRadius="full"
                                            cursor="pointer"
                                            border={
                                                color === c
                                                    ? "2px solid white"
                                                    : "2px solid transparent"
                                            }
                                            onClick={() => handleColorChange(c)}
                                            _hover={{ transform: "scale(1.2)" }}
                                            transition="transform 0.1s"
                                        />
                                    ))}
                                </Flex>
                            </Box>
                            {onDelete && (
                                <>
                                    <Divider borderColor="gray.600" />
                                    <Button
                                        size="xs"
                                        w="full"
                                        colorScheme="red"
                                        variant="ghost"
                                        leftIcon={<FaTrash />}
                                        onClick={() => onDelete(id)}
                                    >
                                        Delete Tier
                                    </Button>
                                </>
                            )}
                        </VStack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>

            {/* GAMES AREA */}
            <Box ref={setDropRef} flex={1} p={2} minW="0">
                <SortableContext
                    id={id}
                    items={games.map((g) => g.igdbId || g.id)}
                    strategy={rectSortingStrategy}
                >
                    <Flex wrap="wrap" gap={2} minH="80px" align="center">
                        {games.length === 0 ? (
                            <Text
                                fontSize="xs"
                                color="gray.700"
                                fontStyle="italic"
                                userSelect="none"
                                pl={1}
                                data-export-hide="true"
                            >
                                Drop games here
                            </Text>
                        ) : (
                            games.map((game) => (
                                <SortableGameCard
                                    key={game.igdbId || game.id}
                                    id={game.igdbId || game.id}
                                    game={game}
                                    onRemove={onRemove}
                                />
                            ))
                        )}
                    </Flex>
                </SortableContext>
            </Box>
        </Flex>
    );
}

export const TierRow = React.memo(TierRowInner);
