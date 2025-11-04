import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { addGameToList, removeGameFromList } from "../api";

export const useGameActions = (game) => {
    const toast = useToast();
    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: addGameToList,

        // --- NEW: Optimistic Update for "userLists" ---
        onMutate: async ({ listName, gameId }) => {
            const userListsQueryKey = ["userLists"];
            await queryClient.cancelQueries({ queryKey: userListsQueryKey });

            const previousUserLists =
                queryClient.getQueryData(userListsQueryKey);

            // Optimistically add the gameId to the list in the cache
            queryClient.setQueryData(userListsQueryKey, (oldLists) => {
                if (!oldLists) return [];
                return oldLists.map((list) =>
                    list.name === listName
                        ? { ...list, games: [...list.games, gameId] }
                        : list
                );
            });

            return { previousUserLists };
        },

        onSuccess: (data, variables) => {
            toast({
                title: "Success!",
                description: `${game.title} has been added to your ${variables.listName}.`,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
            // We still invalidate to get the "true" data from the server
            queryClient.invalidateQueries({ queryKey: ["userLists"] });
        },
        onError: (error, variables, context) => {
            // --- NEW: Rollback for "userLists" ---
            if (context?.previousUserLists) {
                queryClient.setQueryData(
                    ["userLists"],
                    context.previousUserLists
                );
            }
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
            // --- This part is the same (for UserListPage) ---
            const userLists = queryClient.getQueryData(["userLists"]);
            const gameIds = userLists?.find((l) => l.name === listName)?.games;
            const gamesQueryKey = [`${listName}Games`, gameIds];

            // --- NEW: Optimistic Update for "userLists" ---
            const userListsQueryKey = ["userLists"];

            await queryClient.cancelQueries({ queryKey: gamesQueryKey });
            await queryClient.cancelQueries({ queryKey: userListsQueryKey });

            const previousGames = queryClient.getQueryData(gamesQueryKey);
            const previousUserLists =
                queryClient.getQueryData(userListsQueryKey);

            // 1. Optimistically update the UserListPage
            if (previousGames) {
                queryClient.setQueryData(gamesQueryKey, (oldData) =>
                    oldData
                        ? oldData.filter((g) => g.igdbId !== gameIdToRemove)
                        : []
                );
            }

            // 2. Optimistically update the ["userLists"] cache
            if (previousUserLists) {
                queryClient.setQueryData(userListsQueryKey, (oldLists) => {
                    return oldLists.map((list) =>
                        list.name === listName
                            ? {
                                  ...list,
                                  games: list.games.filter(
                                      (id) => id !== gameIdToRemove
                                  ),
                              }
                            : list
                    );
                });
            }

            return {
                previousGames,
                gamesQueryKey,
                previousUserLists,
                userListsQueryKey,
            };
        },

        // --- NEW: Add Success Toast for Remove ---
        onSuccess: (data, variables) => {
            toast({
                title: "Removed!",
                description: `${game.title} has been removed from your ${variables.listName}.`,
                status: "info", // Using 'info' for a neutral feel
                duration: 2000,
                isClosable: true,
                position: "top",
            });
            // Invalidate both to be sure
            queryClient.invalidateQueries({ queryKey: ["userLists"] });
            queryClient.invalidateQueries({
                queryKey: [`${variables.listName}Games`],
            });
        },

        onError: (err, variables, context) => {
            // --- NEW: Rollback both caches ---
            if (context?.previousGames) {
                queryClient.setQueryData(
                    context.gamesQueryKey,
                    context.previousGames
                );
            }
            if (context?.previousUserLists) {
                queryClient.setQueryData(
                    context.userListsQueryKey,
                    context.previousUserLists
                );
            }
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
