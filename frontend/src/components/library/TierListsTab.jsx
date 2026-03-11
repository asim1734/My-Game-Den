import React, { useState } from "react";
import {
    SimpleGrid,
    Box,
    Text,
    Badge,
    VStack,
    HStack,
    Center,
    Spinner,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    useDisclosure,
    Portal,
} from "@chakra-ui/react";
import { FaEllipsisV, FaPen, FaTrash } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getTierLists } from "../../api";
import { RenameTierListModal } from "./RenameTierListModal";
import { DeleteTierListAlert } from "./DeleteTierListAlert";

const CATEGORY_COLOR = {
    Games: "purple",
    Characters: "orange",
    Series: "teal",
    Other: "gray",
};

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const TierListsTab = () => {
    const navigate = useNavigate();

    const [selectedTierList, setSelectedTierList] = useState(null);

    const {
        isOpen: isRenameOpen,
        onOpen: onRenameOpen,
        onClose: onRenameClose,
    } = useDisclosure();

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
    } = useDisclosure();

    const { data: tierLists, isLoading } = useQuery({
        queryKey: ["my-tierlists"],
        queryFn: getTierLists,
    });

    const handleRenameClick = (e, list) => {
        e.stopPropagation();
        setSelectedTierList(list);
        onRenameOpen();
    };

    const handleDeleteClick = (e, list) => {
        e.stopPropagation();
        setSelectedTierList(list);
        onDeleteOpen();
    };

    if (isLoading) {
        return (
            <Center py={10}>
                <Spinner color="purple.500" />
            </Center>
        );
    }

    return (
        <Box>
            {tierLists?.length > 0 ? (
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                    {tierLists.map((list, index) => {
                        const rankedCount =
                            list.tiers?.reduce(
                                (acc, t) => acc + (t.games?.length || 0),
                                0,
                            ) || 0;
                        const unrankedCount = list.unrankedPool?.length || 0;
                        const category = list.category || "Games";
                        const categoryColor = CATEGORY_COLOR[category] || "gray";
                        const title = list.title || list.name || "Untitled List";
                        const titleFontSize =
                            title.length > 24 ? "xs" :
                            title.length > 8 ? "sm" : "md";

                        return (
                            <Box
                                key={list._id || index}
                                bg="brand.800"
                                borderRadius="xl"
                                border="1px solid"
                                borderColor="brand.700"
                                cursor="pointer"
                                transition="all 0.2s"
                                position="relative"
                                overflow="hidden"
                                _hover={{
                                    transform: "translateY(-4px)",
                                    borderColor: "purple.500",
                                    boxShadow: "lg",
                                }}
                                onClick={() =>
                                    navigate(`/tierlist-editor/${list._id}`)
                                }
                            >
                                {/* Tier color strip */}
                                <HStack spacing={0} h="10px">
                                    {list.tiers?.length > 0 ? (
                                        list.tiers.map((tier, i) => (
                                            <Box
                                                key={i}
                                                flex={1}
                                                h="full"
                                                bg={tier.color || "purple.500"}
                                            />
                                        ))
                                    ) : (
                                        <Box
                                            flex={1}
                                            h="full"
                                            bgGradient="linear(to-r, purple.900, purple.700)"
                                        />
                                    )}
                                </HStack>

                                <VStack align="start" spacing={3} p={6} w="full">
                                    {/* Top row: badges + menu */}
                                    <HStack justify="space-between" w="full">
                                        <HStack spacing={2}>
                                            <Badge
                                                colorScheme={categoryColor}
                                                variant="subtle"
                                                borderRadius="full"
                                                px={2}
                                            >
                                                {category}
                                            </Badge>
                                            <Badge
                                                colorScheme={list.isPublic ? "green" : "gray"}
                                                variant="subtle"
                                                borderRadius="full"
                                                px={2}
                                            >
                                                {list.isPublic ? "Public" : "Private"}
                                            </Badge>
                                        </HStack>

                                        <Menu isLazy>
                                            <MenuButton
                                                as={IconButton}
                                                icon={<FaEllipsisV />}
                                                variant="ghost"
                                                size="xs"
                                                color="gray.400"
                                                _hover={{
                                                    color: "white",
                                                    bg: "whiteAlpha.200",
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <Portal>
                                                <MenuList
                                                    bg="brand.900"
                                                    borderColor="brand.700"
                                                    boxShadow="dark-lg"
                                                    zIndex="popover"
                                                >
                                                    <MenuItem
                                                        icon={<FaPen />}
                                                        bg="brand.900"
                                                        fontSize="sm"
                                                        _hover={{ bg: "brand.700" }}
                                                        onClick={(e) => handleRenameClick(e, list)}
                                                    >
                                                        Rename Tier List
                                                    </MenuItem>
                                                    <MenuItem
                                                        icon={<FaTrash />}
                                                        bg="brand.900"
                                                        color="red.300"
                                                        fontSize="sm"
                                                        _hover={{ bg: "red.900", color: "white" }}
                                                        onClick={(e) => handleDeleteClick(e, list)}
                                                    >
                                                        Delete Tier List
                                                    </MenuItem>
                                                </MenuList>
                                            </Portal>
                                        </Menu>
                                    </HStack>

                                    {/* Title — own row, full width, no flex competition */}
                                    <Text
                                        fontSize={titleFontSize}
                                        fontWeight="bold"
                                        color="white"
                                        w="full"
                                        noOfLines={1}
                                    >
                                        {title}
                                    </Text>

                                    {/* Stats + date */}
                                    <HStack justify="space-between" w="full" align="center">
                                        <Text fontSize="xs" color="gray.400">
                                            <Text as="span" color="white" fontWeight="semibold">
                                                {rankedCount}
                                            </Text>{" "}
                                            ranked &middot;{" "}
                                            <Text as="span" color="gray.500">
                                                {unrankedCount}
                                            </Text>{" "}
                                            unranked
                                        </Text>
                                        {list.updatedAt && (
                                            <Text fontSize="xs" color="gray.600">
                                                {formatDate(list.updatedAt)}
                                            </Text>
                                        )}
                                    </HStack>
                                </VStack>
                            </Box>
                        );
                    })}
                </SimpleGrid>
            ) : (
                <Center
                    py={20}
                    border="2px dashed"
                    borderColor="brand.700"
                    borderRadius="2xl"
                >
                    <VStack spacing={2}>
                        <Text color="gray.500" fontWeight="medium">
                            No tier lists found.
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Click 'New Entry' to start creating.
                        </Text>
                    </VStack>
                </Center>
            )}

            {selectedTierList && (
                <RenameTierListModal
                    isOpen={isRenameOpen}
                    onClose={onRenameClose}
                    tierList={selectedTierList}
                />
            )}

            {selectedTierList && (
                <DeleteTierListAlert
                    isOpen={isDeleteOpen}
                    onClose={onDeleteClose}
                    tierList={selectedTierList}
                />
            )}
        </Box>
    );
};
