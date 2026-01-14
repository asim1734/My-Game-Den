import React, { useState } from "react";
import { 
    SimpleGrid, Box, Text, Heading, Badge, 
    VStack, HStack, Icon, Center, Spinner,
    Menu, MenuButton, MenuList, MenuItem, IconButton, useDisclosure,
    Portal // <--- 1. Import Portal
} from "@chakra-ui/react";
import { FaFolderOpen, FaEllipsisV, FaPen, FaTrash } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api"; 

// Import your Modals
import { RenameListModal } from "./RenameListModal"; 
import { DeleteListAlert } from "./DeleteListAlert";  

export const CollectionsTab = () => {
    const navigate = useNavigate();
    
    // State to track which collection is being acted upon
    const [selectedCollection, setSelectedCollection] = useState(null);
    
    // Modal controls
    const { 
        isOpen: isRenameOpen, 
        onOpen: onRenameOpen, 
        onClose: onRenameClose 
    } = useDisclosure();
    
    const { 
        isOpen: isDeleteOpen, 
        onOpen: onDeleteOpen, 
        onClose: onDeleteClose 
    } = useDisclosure();

    const { data: collections = [], isLoading, isError } = useQuery({
        queryKey: ["my-collections"],
        queryFn: async () => {
            const res = await api.get("/users/lists");
            if (res.data && !Array.isArray(res.data) && Array.isArray(res.data.lists)) {
                return res.data.lists;
            }
            if (!Array.isArray(res.data)) return [];
            return res.data;
        }
    });

    const handleRenameClick = (e, list) => {
        e.stopPropagation(); 
        setSelectedCollection(list);
        onRenameOpen();
    };

    const handleDeleteClick = (e, list) => {
        e.stopPropagation(); 
        setSelectedCollection(list);
        onDeleteOpen();
    };

    const getGameCountLabel = (count) => (count === 1 ? "1 Game" : `${count || 0} Games`);

    if (isLoading) return <Center py={10}><Spinner color="purple.500" size="xl" /></Center>;
    if (isError) return <Text color="red.400">Error loading collections.</Text>;

    return (
        <Box pt={6}>
            {collections.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {collections.map((list, index) => (
                        <Box 
                            key={`${list.name}-${index}`} 
                            p={5}
                            bg="brand.800"
                            borderRadius="xl"
                            border="1px solid"
                            borderColor="brand.700"
                            cursor="pointer"
                            transition="all 0.2s"
                            position="relative"
                            _hover={{ 
                                transform: "translateY(-4px)", 
                                borderColor: "brand.500", 
                                shadow: "dark-lg" 
                            }}
                            onClick={() => navigate(`/lists/${encodeURIComponent(list.name)}`)}
                        >
                            <VStack align="start" spacing={3}>
                                <HStack justify="space-between" w="full" align="flex-start">
                                    <HStack>
                                        <Icon as={FaFolderOpen} color="brand.400" boxSize={5} />
                                        <Badge colorScheme="purple" borderRadius="full" px={2}>
                                            {getGameCountLabel(list.games?.length)}
                                        </Badge>
                                    </HStack>

                                    {/* FIX: Portal stops the menu from being trapped under other cards */}
                                    <Menu isLazy>
                                        <MenuButton 
                                            as={IconButton}
                                            icon={<FaEllipsisV />}
                                            variant="ghost"
                                            size="xs"
                                            color="gray.400"
                                            _hover={{ color: "white", bg: "whiteAlpha.200" }}
                                            onClick={(e) => e.stopPropagation()} 
                                        />
                                        {/* 2. Wrap MenuList in Portal to break out of the card's z-index context */}
                                        <Portal>
                                            <MenuList bg="brand.900" borderColor="brand.700" boxShadow="dark-lg" zIndex="popover">
                                                <MenuItem 
                                                    icon={<FaPen />} 
                                                    bg="brand.900" 
                                                    fontSize="sm"
                                                    _hover={{ bg: "brand.700" }}
                                                    onClick={(e) => handleRenameClick(e, list)}
                                                >
                                                    Rename Collection
                                                </MenuItem>
                                                <MenuItem 
                                                    icon={<FaTrash />} 
                                                    bg="brand.900" 
                                                    color="red.300"
                                                    fontSize="sm"
                                                    _hover={{ bg: "red.900", color: "white" }}
                                                    onClick={(e) => handleDeleteClick(e, list)}
                                                >
                                                    Delete Collection
                                                </MenuItem>
                                            </MenuList>
                                        </Portal>
                                    </Menu>
                                </HStack>

                                <Box>
                                    <Heading size="md" color="white" noOfLines={1}>
                                        {list.name}
                                    </Heading>
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        Collection
                                    </Text>
                                </Box>
                            </VStack>
                        </Box>
                    ))}
                </SimpleGrid>
            ) : (
                <Center py={20} flexDirection="column" border="2px dashed" borderColor="brand.700" borderRadius="2xl">
                    <Icon as={FaFolderOpen} boxSize={10} color="gray.600" mb={4} />
                    <Text color="gray.500">You don't have any collections yet.</Text>
                </Center>
            )}

            {selectedCollection && (
                <RenameListModal 
                    isOpen={isRenameOpen} 
                    onClose={onRenameClose} 
                    list={selectedCollection} 
                />
            )}

            {selectedCollection && (
                <DeleteListAlert 
                    isOpen={isDeleteOpen} 
                    onClose={onDeleteClose} 
                    list={selectedCollection} 
                />
            )}
        </Box>
    );
};