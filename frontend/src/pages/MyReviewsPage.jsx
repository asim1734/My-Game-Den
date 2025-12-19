import React from "react";
import {
    Box,
    Heading,
    SimpleGrid,
    Text,
    Image,
    VStack,
    HStack,
    Icon,
    Badge,
    Spinner,
    Center,
    LinkBox,
    LinkOverlay,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getMyReviews } from "../api";
import { FaStar } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

export const MyReviewsPage = () => {
    const { data: reviews, isLoading } = useQuery({
        queryKey: ["myReviews"],
        queryFn: getMyReviews,
    });

    if (isLoading) {
        return (
            <Center minH="calc(100vh - 200px)">
                <Spinner size="xl" color="brand.500" />
            </Center>
        );
    }

    return (
        <Box p={8} maxW="1200px" mx="auto">
            <Heading mb={8}>My Ratings & Reviews</Heading>

            {reviews?.length === 0 ? (
                <Center p={10} bg="brand.800" borderRadius="xl">
                    <Text color="gray.400">You haven't reviewed any games yet.</Text>
                </Center>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {reviews.map((review) => (
                        <LinkBox
                            key={review._id}
                            as={VStack}
                            bg="brand.800"
                            borderRadius="lg"
                            overflow="hidden"
                            align="stretch"
                            spacing={0}
                            transition="all 0.2s"
                            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
                        >
                            <HStack p={4} align="start" spacing={4}>
                                <Image
                                    src={review.gameCover}
                                    alt={review.gameTitle}
                                    w="80px"
                                    h="110px"
                                    borderRadius="md"
                                    objectFit="cover"
                                    fallbackSrc="https://via.placeholder.com/80x110?text=No+Cover"
                                />
                                <VStack align="start" flex={1} spacing={1}>
                                    <LinkOverlay as={RouterLink} to={`/game/${review.gameId}`}>
                                        <Heading size="sm" noOfLines={2}>
                                            {review.gameTitle}
                                        </Heading>
                                    </LinkOverlay>
                                    <HStack spacing={1}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Icon
                                                key={star}
                                                as={FaStar}
                                                boxSize={3}
                                                color={review.rating >= star ? "yellow.400" : "gray.600"}
                                            />
                                        ))}
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                        Reviewed on {new Date(review.updatedAt).toLocaleDateString()}
                                    </Text>
                                </VStack>
                            </HStack>
                            {review.content && (
                                <Box px={4} pb={4}>
                                    <Text fontSize="sm" color="gray.300" noOfLines={3}>
                                        "{review.content}"
                                    </Text>
                                </Box>
                            )}
                        </LinkBox>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
};