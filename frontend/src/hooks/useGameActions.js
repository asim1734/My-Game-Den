import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { addToCollection, removeFromCollection } from "../api";

export const useGameActions = (game) => {
    const toast = useToast();
    const queryClient = useQueryClient();

    // --- ADD MUTATION ---
    const addMutation = useMutation({
        mutationFn: addToCollection,
        onSuccess: () => {
            toast({
                title: "Success!",
                description: `${game.title} has been added to your collection.`,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
            queryClient.invalidateQueries({ queryKey: ["collectionIds"] });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.msg || "You must be logged in.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        },
    });

    // --- REMOVE MUTATION (WITH OPTIMISTIC UPDATE) ---
    const removeMutation = useMutation({
        mutationFn: removeFromCollection,
        onMutate: async (gameIdToRemove) => {
            const collectionIds = queryClient.getQueryData(["collectionIds"]);
            const collectionQueryKey = ["collectionGames", collectionIds];

            await queryClient.cancelQueries({ queryKey: collectionQueryKey });
            const previousGames = queryClient.getQueryData(collectionQueryKey);
            queryClient.setQueryData(collectionQueryKey, (oldData) =>
                oldData
                    ? oldData.filter((g) => g.igdbId !== gameIdToRemove)
                    : []
            );
            return { previousGames, collectionQueryKey };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(
                context.collectionQueryKey,
                context.previousGames
            );
            toast({
                title: "Error",
                description: "Could not remove the game. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        },
    });

    const handleAddToCollection = (e) => {
        e.preventDefault();
        addMutation.mutate(game.igdbId);
    };

    const handleRemoveFromCollection = (e) => {
        e.preventDefault();
        removeMutation.mutate(game.igdbId);
    };

    return {
        handleAddToCollection,
        isAdding: addMutation.isPending,
        handleRemoveFromCollection,
        isRemoving: removeMutation.isPending,
    };
};
