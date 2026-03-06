import React, { useRef } from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useToast,
    Text,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTierList } from "../../api";

export const DeleteTierListAlert = ({ isOpen, onClose, tierList }) => {
    const cancelRef = useRef();
    const toast = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteTierList,
        onSuccess: () => {
            toast({ title: "Tier list deleted", status: "success", position: "top" });
            queryClient.invalidateQueries(["my-tierlists"]);
            onClose();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    "Could not delete tier list",
                status: "error",
                position: "top",
            });
        },
    });

    const handleDelete = () => {
        if (tierList?._id) mutation.mutate(tierList._id);
    };

    const rankedCount =
        tierList?.tiers?.reduce((acc, t) => acc + (t.games?.length || 0), 0) ||
        0;
    const unrankedCount = tierList?.unrankedPool?.length || 0;
    const totalGames = rankedCount + unrankedCount;

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent
                    bg="brand.800"
                    color="white"
                    border="1px solid"
                    borderColor="brand.700"
                >
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Tier List
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure you want to delete{" "}
                        <Text as="span" fontWeight="bold" color="purple.300">
                            "{tierList?.title}"
                        </Text>
                        ?
                        <br />
                        <br />
                        <Text fontSize="sm" color="gray.400">
                            This action cannot be undone. All {totalGames} games
                            inside will be removed.
                        </Text>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            ref={cancelRef}
                            onClick={onClose}
                            variant="ghost"
                            _hover={{ bg: "whiteAlpha.100" }}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleDelete}
                            ml={3}
                            isLoading={mutation.isPending}
                        >
                            Delete Tier List
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};
