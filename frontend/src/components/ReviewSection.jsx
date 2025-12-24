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
    Avatar,
    Divider,
    Center,
} from "@chakra-ui/react";
import { FaStar, FaTrash, FaPencilAlt, FaLock } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserReviewForGame, submitReview, deleteReview } from "../api";

export const ReviewSection = ({ game }) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const isAuthenticated = !!localStorage.getItem("x-auth-token");
    const username = localStorage.getItem("username");

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState("");

    const { data: existingReview, isLoading } = useQuery({
        queryKey: ["review", game?.igdbId],
        queryFn: () => fetchUserReviewForGame(game.igdbId),
        enabled: !!game?.igdbId && isAuthenticated,
    });

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setContent(existingReview.content || "");
            onClose(); // Default to view mode if review exists
        } else {
            onOpen(); // Default to write mode if no review
        }
    }, [existingReview, onClose, onOpen]);

    const mutation = useMutation({
        mutationFn: submitReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review", game.igdbId] });
            queryClient.invalidateQueries({ queryKey: ["reviews", "community", game.igdbId] });
            toast({ title: "Review saved!", status: "success", position: "top" });
            onClose();
        },
    });

    const removeMutation = useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review", game.igdbId] });
            queryClient.invalidateQueries({ queryKey: ["reviews", "community", game.igdbId] });
            setRating(0);
            setContent("");
            toast({ title: "Review deleted.", status: "info", position: "top" });
            onOpen();
        },
    });

    const handleSubmit = () => {
        if (rating === 0) {
            return toast({ title: "Please select a star rating", status: "warning", position: "top" });
        }
        mutation.mutate({
            gameId: game.igdbId,
            gameTitle: game.title,
            gameCover: game.coverUrl,
            rating,
            content,
        });
    };

    if (!isAuthenticated) {
        return (
            <Box bg="brand.800" p={8} borderRadius="xl" border="1px dashed" borderColor="brand.600" textAlign="center">
                <VStack spacing={3}>
                    <Icon as={FaLock} w={6} h={6} color="brand.400" />
                    <Heading size="sm">Want to leave a review?</Heading>
                    <Text fontSize="sm" color="gray.400">Please log in to share your thoughts with the den.</Text>
                </VStack>
            </Box>
        );
    }

    if (isLoading) return null;

    return (
        <Box 
            bg="brand.800" 
            p={6} 
            borderRadius="xl" 
            border="1px solid" 
            borderColor="brand.700" 
            boxShadow="2xl"
        >
            <VStack align="stretch" spacing={5}>
                <HStack justify="space-between">
                    <HStack spacing={3}>
                        <Avatar size="xs" name={username} bg="brand.500" />
                        <Heading size="sm" color="white">Your Experience</Heading>
                    </HStack>
                    
                    {existingReview && !isOpen && (
                        <HStack spacing={2}>
                            <IconButton
                                size="xs"
                                variant="ghost"
                                icon={<FaPencilAlt />}
                                onClick={onOpen}
                                aria-label="Edit"
                                color="gray.400"
                                _hover={{ bg: "brand.700", color: "white" }}
                            />
                            <IconButton
                                size="xs"
                                variant="ghost"
                                colorScheme="red"
                                icon={<FaTrash />}
                                onClick={() => removeMutation.mutate(game.igdbId)}
                                isLoading={removeMutation.isPending}
                                aria-label="Delete"
                            />
                        </HStack>
                    )}
                </HStack>

                <Divider borderColor="brand.700" />

                {isOpen ? (
                    /* --- WRITE / EDIT STATE --- */
                    <VStack align="stretch" spacing={4}>
                        <HStack spacing={2}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Icon
                                    key={star}
                                    as={FaStar}
                                    boxSize={7}
                                    cursor="pointer"
                                    color={(hoverRating || rating) >= star ? "yellow.400" : "gray.600"}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    transition="all 0.2s"
                                    _hover={{ transform: "scale(1.1)" }}
                                />
                            ))}
                            <Text ml={2} fontSize="sm" color="gray.400" fontWeight="bold">
                                {rating > 0 ? `${rating} / 5` : "Select Rating"}
                            </Text>
                        </HStack>

                        <Textarea
                            placeholder="What did you think of the gameplay, story, and graphics?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            bg="brand.900"
                            border="1px solid"
                            borderColor="brand.700"
                            _focus={{ borderColor: "brand.500", ring: 1, ringColor: "brand.500" }}
                            rows={4}
                            fontSize="sm"
                        />

                        <HStack justify="flex-end">
                            {existingReview && (
                                <Button variant="ghost" size="sm" onClick={onClose} color="gray.400">
                                    Cancel
                                </Button>
                            )}
                            <Button
                                colorScheme="purple"
                                size="sm"
                                px={6}
                                onClick={handleSubmit}
                                isLoading={mutation.isPending}
                            >
                                {existingReview ? "Update Review" : "Post to Den"}
                            </Button>
                        </HStack>
                    </VStack>
                ) : (
                    /* --- VIEW STATE --- */
                    <Box px={2}>
                        <HStack mb={3} spacing={1}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Icon
                                    key={star}
                                    as={FaStar}
                                    boxSize={4}
                                    color={rating >= star ? "yellow.400" : "gray.700"}
                                />
                            ))}
                        </HStack>
                        <Text color="gray.200" fontSize="md" fontStyle={!content ? "italic" : "normal"}>
                            {content || "You rated this game but didn't write a text review."}
                        </Text>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};