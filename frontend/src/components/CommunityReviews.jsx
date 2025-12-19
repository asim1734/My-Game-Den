import React from "react";
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Icon,
    Avatar,
    Divider,
    Flex,
    Skeleton,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from "@chakra-ui/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchCommunityReviewsForGame } from "../api";

/**
 * CommunityReviews Component
 * Fetches and displays reviews from other users for a specific game.
 */
export const CommunityReviews = ({ gameId }) => {
    const { data: reviews, isLoading, isError } = useQuery({
        queryKey: ["community-reviews", gameId],
        queryFn: () => fetchCommunityReviewsForGame(gameId),
        enabled: !!gameId,
    });

    // Calculate Average Rating
    // Now returns null if no reviews exist to allow for "N/A" display
    const hasReviews = reviews && reviews.length > 0;
    const averageRating = hasReviews 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : null;

    if (isLoading) {
        return (
            <VStack align="stretch" spacing={4} mt={8}>
                <Skeleton h="20px" w="150px" />
                <Skeleton h="100px" borderRadius="xl" />
                <Skeleton h="80px" borderRadius="xl" />
            </VStack>
        );
    }

    if (isError) {
        return (
            <Box p={4} bg="red.900" borderRadius="md" color="red.100">
                <Text>Failed to load community reviews. Please try again later.</Text>
            </Box>
        );
    }

    return (
        <VStack align="stretch" spacing={6} mt={10} mb={10}>
            {/* Aggregate Stats Header */}
            <Flex 
                justify="space-between" 
                align="center" 
                bg="brand.800" 
                p={6} 
                borderRadius="2xl" 
                boxShadow="2xl"
                border="1px solid"
                borderColor="brand.700"
            >
                <VStack align="flex-start" spacing={1}>
                    <Heading size="md" color="brand.100">Community Feedback</Heading>
                    <Text color="gray.400" fontSize="sm">Ratings from other GameDen users</Text>
                </VStack>
                
                <Stat textAlign="right" maxW="150px">
                    <StatLabel color="gray.400">Average Score</StatLabel>
                    <StatNumber 
                        color={hasReviews ? "yellow.400" : "gray.500"} 
                        fontSize="3xl" 
                        fontWeight="black"
                    >
                        {hasReviews ? (
                            <>
                                {averageRating} 
                            </>
                        ) : (
                            "N/A"
                        )}
                    </StatNumber>
                    <StatHelpText color="gray.500" fontWeight="bold">
                        {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                    </StatHelpText>
                </Stat>
            </Flex>

            {/* Individual Review Cards */}
            <VStack align="stretch" spacing={4}>
                {hasReviews ? (
                    reviews.map((review) => (
                        <Box 
                            key={review.id} 
                            p={6} 
                            bg="brand.800" 
                            borderRadius="xl" 
                            border="1px solid" 
                            borderColor="brand.700"
                            transition="all 0.2s"
                            _hover={{ borderColor: "brand.500", shadow: "lg" }}
                        >
                            <VStack align="stretch" spacing={4}>
                                <HStack justify="space-between" align="center">
                                    <HStack spacing={3}>
                                        <Avatar 
                                            size="sm" 
                                            name={review.userName} 
                                            src={review.userAvatar} 
                                            bg="brand.600"
                                            border="2px solid"
                                            borderColor="brand.400"
                                        />
                                        <VStack align="flex-start" spacing={0}>
                                            <Text fontWeight="bold" color="white" fontSize="sm">
                                                {review.userName}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                {new Date(review.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    
                                    <HStack spacing={0.5}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Icon
                                                key={star}
                                                as={review.rating >= star ? FaStar : FaRegStar}
                                                color={review.rating >= star ? "yellow.400" : "gray.600"}
                                                boxSize={3.5}
                                            />
                                        ))}
                                    </HStack>
                                </HStack>

                                <Divider borderColor="whiteAlpha.100" />

                                <Text color="gray.200" fontSize="md" lineHeight="tall">
                                    {review.content ? (
                                        review.content
                                    ) : (
                                        <Text as="span" fontStyle="italic" color="gray.500">
                                            User shared a rating without a written review.
                                        </Text>
                                    )}
                                </Text>
                            </VStack>
                        </Box>
                    ))
                ) : (
                    <Box 
                        textAlign="center" 
                        py={12} 
                        px={4}
                        bg="brand.800" 
                        borderRadius="xl" 
                        border="2px dashed" 
                        borderColor="brand.700"
                    >
                        <Text color="gray.500" fontSize="lg">
                            No community reviews yet.
                        </Text>
                        <Text color="gray.600" fontSize="sm">
                            Be the first to share your thoughts above!
                        </Text>
                    </Box>
                )}
            </VStack>
        </VStack>
    );
};