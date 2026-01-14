import React, { useState } from "react";
import { 
    Box, Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, 
    Button, HStack, useDisclosure, Icon 
} from "@chakra-ui/react";
import { FaPlus, FaLayerGroup, FaListUl, FaSortAmountDown } from "react-icons/fa";

// Import BOTH modals
import { CreateTierListModal } from "../components/tier-list/CreateTierListModal";
import { CreateCollectionModal } from "../components/library/CreateCollectionModal"; // We will build this next

import { CollectionsTab } from "../components/library/CollectionsTab";
import { TierListsTab } from "../components/library/TierListsTab";

export const MyLibraryPage = () => {
    // Track which tab is active (0 = Collections, 1 = Tier Lists, 2 = Rankings)
    const [tabIndex, setTabIndex] = useState(0);
    
    // Manage Modal State
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Helper to determine what the button should say/do
    const getButtonLabel = () => {
        if (tabIndex === 0) return "New Collection";
        if (tabIndex === 1) return "New Tier List";
        return "New Entry";
    };

    return (
        <Container maxW="container.xl" py={8}>
            <HStack justify="space-between" mb={8} align="center">
                <Box>
                    <Heading size="xl" color="white">My Library</Heading>
                    <Heading size="xs" color="gray.500" mt={1}>Manage your collections and rankings</Heading>
                </Box>
            </HStack>

            {/* onChange updates our state so we know which modal to open */}
            <Tabs variant="soft-rounded" colorScheme="purple" onChange={(index) => setTabIndex(index)}>
                <HStack justify="space-between" mb={6}>
                    <TabList bg="brand.800" p={1} borderRadius="full">
                        <Tab px={6} gap={2}><Icon as={FaListUl} /> Collections</Tab>
                        <Tab px={6} gap={2}><Icon as={FaLayerGroup} /> Tier Lists</Tab>
                        <Tab px={6} gap={2}><Icon as={FaSortAmountDown} /> Rankings</Tab>
                    </TabList>

                    {/* The Smart Button */}
                    <Button 
                        leftIcon={<FaPlus />} 
                        colorScheme="purple" 
                        borderRadius="full"
                        onClick={onOpen}
                        // Disable button for "Rankings" tab since it's not ready
                        isDisabled={tabIndex === 2} 
                    >
                        {getButtonLabel()}
                    </Button>
                </HStack>

                <TabPanels>
                    {/* Tab 0: Collections */}
                    <TabPanel p={0}>
                        <CollectionsTab />
                    </TabPanel>

                    {/* Tab 1: Tier Lists */}
                    <TabPanel p={0}>
                        <TierListsTab />
                    </TabPanel>

                    {/* Tab 2: Rankings (Placeholder) */}
                    <TabPanel p={0}>
                        <Box py={10} textAlign="center" border="2px dashed" borderColor="brand.700" borderRadius="xl">
                            <Heading size="sm" color="gray.500">Ranked Lists (Coming Soon)</Heading>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            {/* Conditionally Render the Correct Modal */}
            {tabIndex === 0 && (
                <CreateCollectionModal isOpen={isOpen} onClose={onClose} />
            )}
            
            {tabIndex === 1 && (
                <CreateTierListModal isOpen={isOpen} onClose={onClose} />
            )}
        </Container>
    );
};