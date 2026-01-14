import React from "react";
import { SimpleGrid, Box, Text, Heading, Badge, VStack, HStack, Icon, Center, Spinner } from "@chakra-ui/react";
import { FaLayerGroup } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const TierListsTab = () => {
    const navigate = useNavigate();

    const { data: tierLists, isLoading } = useQuery({
        queryKey: ["my-tierlists"],
        queryFn: async () => {
            const token = localStorage.getItem("x-auth-token");
            const res = await axios.get("http://localhost:3000/api/tierlists/my", {
                headers: { "x-auth-token": token }
            });
            return res.data;
        }
    });

    if (isLoading) return <Center py={10}><Spinner color="purple.500" /></Center>;

    return (
        <Box>
            {tierLists?.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {tierLists.map((list, index) => (
                        <Box 
                            key={`tier-${list._id || index}`}
                            p={5}
                            bg="brand.800"
                            borderRadius="xl"
                            border="1px solid"
                            borderColor="brand.700"
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{ transform: "translateY(-4px)", borderColor: "purple.500" }}
                            onClick={() => navigate(`/tierlist-editor/${list._id}`)}
                        >
                            <VStack align="start" spacing={3}>
                                <HStack justify="space-between" w="full">
                                    <Icon as={FaLayerGroup} color="purple.400" boxSize={5} />
                                    <Badge colorScheme={list.isPublic ? "green" : "gray"}>
                                        {list.isPublic ? "Public" : "Draft"}
                                    </Badge>
                                </HStack>
                                <Box>
                                    <Heading size="sm" color="white" noOfLines={1}>{list.title}</Heading>
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        {list.tiers.reduce((acc, t) => acc + t.games.length, 0)} Games Ranked
                                    </Text>
                                </Box>
                            </VStack>
                        </Box>
                    ))}
                </SimpleGrid>
            ) : (
                <Center py={20} border="2px dashed" borderColor="brand.700" borderRadius="2xl">
                    <Text color="gray.500">No tier lists found. Click 'New Entry' to start.</Text>
                </Center>
            )}
        </Box>
    );
};