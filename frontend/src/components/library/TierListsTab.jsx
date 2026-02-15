import React from "react";
import {
    SimpleGrid,
    Box,
    Text,
    Heading,
    Badge,
    VStack,
    HStack,
    Icon,
    Center,
    Spinner,
} from "@chakra-ui/react";
import { FaLayerGroup } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getTierLists } from "../../api";

export const TierListsTab = () => {
    const navigate = useNavigate();

    const { data: tierLists, isLoading } = useQuery({
        queryKey: ["my-tierlists"],
        queryFn: getTierLists,
    });

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
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {tierLists.map((list, index) => {
                        const rankedCount =
                            list.tiers?.reduce(
                                (acc, t) => acc + (t.games?.length || 0),
                                0,
                            ) || 0;
                        const unrankedCount = list.unrankedPool?.length || 0;
                        const totalGames = rankedCount + unrankedCount;

                        return (
                            <Box
                                key={list._id || index}
                                p={5}
                                bg="brand.800"
                                borderRadius="xl"
                                border="1px solid"
                                borderColor="brand.700"
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{
                                    transform: "translateY(-4px)",
                                    borderColor: "purple.500",
                                    boxShadow: "lg",
                                }}
                                onClick={() =>
                                    navigate(`/tierlist-editor/${list._id}`)
                                }
                            >
                                <VStack align="start" spacing={3}>
                                    <HStack justify="space-between" w="full">
                                        <Icon
                                            as={FaLayerGroup}
                                            color="purple.400"
                                            boxSize={5}
                                        />
                                        <Badge
                                            colorScheme={
                                                list.isPublic ? "green" : "gray"
                                            }
                                            variant="subtle"
                                            borderRadius="full"
                                            px={2}
                                        >
                                            {list.isPublic
                                                ? "Public"
                                                : "Private"}
                                        </Badge>
                                    </HStack>

                                    <Box w="full">
                                        <Heading
                                            size="sm"
                                            color="white"
                                            noOfLines={1}
                                            mb={1}
                                        >
                                            {list.title ||
                                                list.name ||
                                                "Untitled List"}
                                        </Heading>
                                        <Text fontSize="xs" color="gray.500">
                                            {totalGames} Games
                                        </Text>
                                    </Box>
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
        </Box>
    );
};
