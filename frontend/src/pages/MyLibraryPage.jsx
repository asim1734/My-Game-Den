import React from "react";
import {
    Box,
    Container,
    Heading,
    Text,
    Flex,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Button,
    useDisclosure,
    Icon,
} from "@chakra-ui/react";
import {
    FaPlus,
    FaLayerGroup,
    FaListUl,
    FaSortAmountDown,
} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

// Import BOTH modals
import { CreateTierListModal } from "../components/tier-list/CreateTierListModal";
import { CreateCollectionModal } from "../components/library/CreateCollectionModal"; // We will build this next

import { CollectionsTab } from "../components/library/CollectionsTab";
import { TierListsTab } from "../components/library/TierListsTab";

const TAB_NAMES = ["collections", "tierlists", "rankings"];

export const MyLibraryPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Derive tab index from URL param; default to 0 (Collections)
    const tabParam = searchParams.get("tab");
    const tabIndex = TAB_NAMES.includes(tabParam)
        ? TAB_NAMES.indexOf(tabParam)
        : 0;

    // Manage Modal State
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Helper to determine what the button should say/do
    const getButtonLabel = () => {
        if (tabIndex === 0) return "New Collection";
        if (tabIndex === 1) return "New Tier List";
        return "New Entry";
    };

    return (
        <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 3, sm: 4, md: 6 }}>
            <Flex
                justify="space-between"
                mb={{ base: 5, md: 8 }}
                align={{ base: "flex-start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap={{ base: 2, md: 0 }}
            >
                <Box>
                    <Heading size={{ base: "lg", md: "xl" }} color="white">
                        My Library
                    </Heading>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mt={1}>
                        Manage your collections and rankings
                    </Text>
                </Box>
            </Flex>

            <Tabs
                variant="soft-rounded"
                colorScheme="purple"
                index={tabIndex}
                onChange={(index) => setSearchParams({ tab: TAB_NAMES[index] })}
            >
                <Flex
                    justify="space-between"
                    mb={{ base: 4, md: 6 }}
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 3, md: 0 }}
                    align={{ base: "stretch", md: "center" }}
                >
                    <Box overflowX="auto" pb={1}>
                        <TabList bg="brand.800" p={1} borderRadius="full" minW="max-content" w="fit-content">
                            <Tab px={{ base: 3, md: 6 }} gap={2} whiteSpace="nowrap">
                                <Icon as={FaListUl} />
                                <Text display={{ base: "none", sm: "inline" }}>Collections</Text>
                                <Text display={{ base: "inline", sm: "none" }}>Lists</Text>
                            </Tab>
                            <Tab px={{ base: 3, md: 6 }} gap={2} whiteSpace="nowrap">
                                <Icon as={FaLayerGroup} />
                                <Text display={{ base: "none", sm: "inline" }}>Tier Lists</Text>
                                <Text display={{ base: "inline", sm: "none" }}>Tiers</Text>
                            </Tab>
                            <Tab px={{ base: 3, md: 6 }} gap={2} whiteSpace="nowrap">
                                <Icon as={FaSortAmountDown} />
                                <Text display={{ base: "none", sm: "inline" }}>Rankings</Text>
                                <Text display={{ base: "inline", sm: "none" }}>Ranks</Text>
                            </Tab>
                        </TabList>
                    </Box>

                    <Button
                        leftIcon={<FaPlus />}
                        colorScheme="purple"
                        borderRadius="full"
                        onClick={onOpen}
                        // Disable button for "Rankings" tab since it's not ready
                        isDisabled={tabIndex === 2}
                        w={{ base: "100%", md: "auto" }}
                        size={{ base: "sm", md: "md" }}
                    >
                        {getButtonLabel()}
                    </Button>
                </Flex>

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
                        <Box
                            py={10}
                            textAlign="center"
                            border="2px dashed"
                            borderColor="brand.700"
                            borderRadius="xl"
                        >
                            <Heading size="sm" color="gray.500">
                                Ranked Lists (Coming Soon)
                            </Heading>
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
