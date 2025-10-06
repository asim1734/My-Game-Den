// src/hooks/useGameActions.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { addGameToList, removeGameFromList } from "../api";

export const useGameActions = (game) => {
    const toast = useToast();
    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: addGameToList,
        onSuccess: (data, variables) => {
            toast({
                title: "Success!",
                description: `${game.title} has been added to your ${variables.listName}.`,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
            queryClient.invalidateQueries({ queryKey: ["userLists"] });
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

    const removeMutation = useMutation({
        mutationFn: removeGameFromList,

        onMutate: async ({ listName, gameId: gameIdToRemove }) => {
            // 1. Get the current list of IDs to build the correct query key for the PAGE data.
            const userLists = queryClient.getQueryData(["userLists"]);
            const gameIds = userLists?.find((l) => l.name === listName)?.games;
            const gamesQueryKey = [`${listName}Games`, gameIds];

            // 2. Cancel any outgoing refetches for the page data.
            await queryClient.cancelQueries({ queryKey: gamesQueryKey });

            // 3. Snapshot the previous page data.
            const previousGames = queryClient.getQueryData(gamesQueryKey);

            // 4. Optimistically update ONLY the page data.
            queryClient.setQueryData(gamesQueryKey, (oldData) =>
                oldData
                    ? oldData.filter((g) => g.igdbId !== gameIdToRemove)
                    : []
            );

            // 5. Return the context for rollback.
            return { previousGames, gamesQueryKey };
        },
        onError: (err, variables, context) => {
            // Roll back the page data on failure.
            queryClient.setQueryData(
                context.gamesQueryKey,
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
        // onSettled: () => {
        //     // 6. After everything, tell the main list of IDs to sync up in the background.
        //     // This will NOT cause a spinner.
        //     queryClient.invalidateQueries({ queryKey: ["userLists"] });
        // },
    });

    const handleAddGame = (e, listName) => {
        e.preventDefault();
        addMutation.mutate({ listName, gameId: game.igdbId });
    };

    const handleRemoveGame = (e, listName) => {
        e.preventDefault();
        removeMutation.mutate({ listName, gameId: game.igdbId });
    };

    return {
        handleAddGame,
        isAdding: addMutation.isPending,
        handleRemoveGame,
        isRemoving: removeMutation.isPending,
    };
};
