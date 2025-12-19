import React, { useState, useEffect } from "react";
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Textarea,
    Button,
    Icon,
    useToast,
    IconButton,
    useDisclosure,
} from "@chakra-ui/react";
import { FaStar, FaTrash, FaPencilAlt } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserReviewForGame, submitReview, deleteReview } from "../api";

export const ReviewSection = ({ game }) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    
    // isOpen controls the "Form/Edit" state. 
    // If true: Show textarea/rating picker. 
    // If false: Show the saved review.
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState("");

    const { data: existingReview, isLoading } = useQuery({
        queryKey: ["review", game?.igdbId],
        queryFn: () => fetchUserReviewForGame(game.igdbId),
        enabled: !!game?.igdbId,
    });

    // Handle initial state and synchronization
    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setContent(existingReview.content || "");
            // If we have a review, we show the "view" state (isOpen = false)
            onClose();
        } else {
            // If no review exists, we show the "write" state (isOpen = true)
            onOpen();
        }
    }, [existingReview, onOpen, onClose]);

    const mutation = useMutation({
        mutationFn: submitReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review", game.igdbId] });
            toast({
                title: "Review saved!",
                status: "success",
                duration: 2000,
                position: "top",
            });
            // --- AUTOMATIC TRANSITION ---
            // Hide the form and go to the "view" state once saved
            onClose();
        },
    });

    const removeMutation = useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review", game.igdbId] });
            setRating(0);
            setContent("");
            toast({
                title: "Review deleted.",
                status: "info",
                duration: 2000,
                position: "top",
            });
            // Go back to the "write" state after deletion
            onOpen();
        },
    });

    const handleSubmit = () => {
        if (rating === 0) {
            return toast({ title: "Please select a rating", status: "warning" });
        }
        mutation.mutate({
            gameId: game.igdbId,
            gameTitle: game.title,
            gameCover: game.coverUrl,
            rating,
            content,
        });
    };

    if (isLoading) return null;

    return (
        <Box bg="brand.800" p={6} borderRadius="xl" boxShadow="xl">
            <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                    <Heading size="md" color="brand.100">Your Review</Heading>
                    {/* Only show these icons if we are NOT in edit mode and a review exists */}
                    {existingReview && !isOpen && (
                        <HStack>
                            <IconButton
                                size="sm"
                                variant="ghost"
                                color="gray.400"
                                _hover={{ color: "brand.300", bg: "brand.700" }}
                                icon={<FaPencilAlt />}
                                onClick={onOpen}
                                aria-label="Edit review"
                            />
                            <IconButton
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                icon={<FaTrash />}
                                onClick={() => removeMutation.mutate(game.igdbId)}
                                isLoading={removeMutation.isPending}
                                aria-label="Delete review"
                            />
                        </HStack>
                    )}
                </HStack>

                {/* WRITE / EDIT STATE */}
                {isOpen ? (
                    <VStack align="stretch" spacing={4}>
                        <HStack spacing={2}>
                            <Text fontWeight="bold" fontSize="sm">Rating:</Text>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Icon
                                    key={star}
                                    as={FaStar}
                                    boxSize={6}
                                    cursor="pointer"
                                    color={(hoverRating || rating) >= star ? "yellow.400" : "gray.600"}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    transition="all 0.2s"
                                    _hover={{ transform: "scale(1.2)" }}
                                />
                            ))}
                        </HStack>

                        <Textarea
                            placeholder="Share your thoughts on this game..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            bg="brand.900"
                            border="none"
                            _focus={{ ring: 1, ringColor: "brand.500" }}
                            rows={4}
                        />

                        <HStack justify="flex-end">
                            {/* If editing an existing review, allow user to cancel back to view mode */}
                            {existingReview && (
                                <Button variant="ghost" size="sm" onClick={onClose}>
                                    Cancel
                                </Button>
                            )}
                            <Button
                                colorScheme="teal"
                                size="sm"
                                onClick={handleSubmit}
                                isLoading={mutation.isPending}
                            >
                                {existingReview ? "Update Review" : "Post Review"}
                            </Button>
                        </HStack>
                    </VStack>
                ) : (
                    /* VIEW STATE */
                    existingReview && (
        <Box>
            <HStack mb={2} spacing={1}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                        key={star}
                        as={FaStar}
                        boxSize={4}
                        // Use optional chaining here as a safety net
                        color={(existingReview?.rating ?? 0) >= star ? "yellow.400" : "gray.600"}
                    />
                ))}
            </HStack>
            <Text color="gray.300" fontSize="md">
                {existingReview?.content || (
                    <Text as="span" fontStyle="italic" color="gray.500">
                        No text review provided.
                    </Text>
                )}
            </Text>
        </Box>
    )
                )}
            </VStack>
        </Box>
    );
};