import React, { useState } from "react";
import {
    Box,
    Heading,
    Button,
    VStack,
    HStack,
    Text,
    Spinner,
    Center,
    Icon,
    Spacer,
    IconButton,
    useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserLists } from "../api";
import { FaPlus, FaPencilAlt, FaTrash, FaChevronRight } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { CreateListModal } from "../components/CreateListModal";
import { RenameListModal } from "../components/RenameListModal";
import { DeleteListAlert } from "../components/DeleteListAlert";

// We can't rename or delete these
const defaultLists = ["collection", "wishlist"];

export const MyListsPage = () => {
    // This query fetches all lists
    const { data: allLists, isLoading } = useQuery({
        queryKey: ["userLists"],
        queryFn: getAllUserLists,
    });

    // State for the modals
    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose,
    } = useDisclosure();
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

    // State to track *which* list is being edited/deleted
    const [selectedList, setSelectedList] = useState(null);

    const handleRenameClick = (list) => {
        setSelectedList(list);
        onRenameOpen();
    };

    const handleDeleteClick = (list) => {
        setSelectedList(list);
        onDeleteOpen();
    };

    if (isLoading) {
        return (
            <Center minH="calc(100vh - 200px)">
                <Spinner size="xl" color="brand.500" />
            </Center>
        );
    }

    return (
        <Box p={8} maxW="800px" mx="auto">
            <HStack mb={6}>
                <Heading>My Lists</Heading>
                <Spacer />
                <Button
                    leftIcon={<Icon as={FaPlus} />}
                    variant="solid" // Will use our brand purple
                    onClick={onCreateOpen}
                >
                    Create List
                </Button>
            </HStack>

            <VStack spacing={4} align="stretch">
                {allLists?.map((list) => {
                    const isDefault = defaultLists.includes(
                        list.name.toLowerCase()
                    );
                    return (
                        <HStack
                            key={list.name}
                            p={4}
                            bg="brand.800"
                            borderRadius="md"
                            boxShadow="sm"
                            as={RouterLink}
                            to={`/lists/${list.name}`}
                            _hover={{ bg: "brand.700" }}
                            transition="background 0.2s ease-in-out"
                        >
                            <Box>
                                <Heading size="md">{list.name}</Heading>
                                <Text color="gray.400">
                                    {list.games.length} games
                                </Text>
                            </Box>
                            <Spacer />
                            {!isDefault && (
                                <HStack
                                    onClick={(e) => e.preventDefault()} // Stop link nav
                                >
                                    <IconButton
                                        aria-label={`Rename ${list.name}`}
                                        icon={<FaPencilAlt />}
                                        variant="ghost"
                                        onClick={() => handleRenameClick(list)}
                                    />
                                    <IconButton
                                        aria-label={`Delete ${list.name}`}
                                        icon={<FaTrash />}
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => handleDeleteClick(list)}
                                    />
                                </HStack>
                            )}
                            <Icon as={FaChevronRight} color="gray.500" />
                        </HStack>
                    );
                })}
            </VStack>

            {/* Modals */}
            <CreateListModal isOpen={isCreateOpen} onClose={onCreateClose} />
            {selectedList && (
                <RenameListModal
                    isOpen={isRenameOpen}
                    onClose={onRenameClose}
                    list={selectedList}
                />
            )}
            {selectedList && (
                <DeleteListAlert
                    isOpen={isDeleteOpen}
                    onClose={onDeleteClose}
                    list={selectedList}
                />
            )}
        </Box>
    );
};
