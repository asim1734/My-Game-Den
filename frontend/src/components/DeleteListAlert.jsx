import React from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteList } from "../api";

export const DeleteListAlert = ({ isOpen, onClose, list }) => {
    const cancelRef = React.useRef();
    const toast = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteList,
        onSuccess: () => {
            toast({
                title: "List deleted.",
                status: "info",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
            queryClient.invalidateQueries({ queryKey: ["userLists"] });
            onClose();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.msg || "Could not delete list.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        },
    });

    const handleDelete = () => {
        mutation.mutate(list.name);
    };

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent bg="brand.800">
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete List
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure you want to delete the list "{list.name}"?
                        This action cannot be undone.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            ref={cancelRef}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={handleDelete}
                            isLoading={mutation.isPending}
                            ml={3}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};
