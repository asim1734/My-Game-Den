import React, { useRef } from "react";
import {
    AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
    Button, useToast, Text
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteList } from "../../api"; 

export const DeleteListAlert = ({ isOpen, onClose, list }) => {
    const cancelRef = useRef();
    const toast = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteList, 
        onSuccess: () => {
            toast({ title: "Collection deleted", status: "success" });
            queryClient.invalidateQueries(["my-collections"]);
            onClose();
        },
        onError: (error) => {
            toast({ 
                title: "Error", 
                description: error.response?.data?.message || "Could not delete collection", 
                status: "error" 
            });
        },
    });

    const handleDelete = () => {
        if (list?.name) mutation.mutate(list.name);
    };

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent bg="brand.800" color="white" border="1px solid" borderColor="brand.700">
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Collection
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure you want to delete <Text as="span" fontWeight="bold" color="purple.300">"{list?.name}"</Text>?
                        <br /><br />
                        <Text fontSize="sm" color="gray.400">
                            This action cannot be undone. All {list?.games?.length || 0} games inside will be unlisted.
                        </Text>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} variant="ghost" _hover={{ bg: "whiteAlpha.100" }}>
                            Cancel
                        </Button>
                        <Button 
                            colorScheme="red" 
                            onClick={handleDelete} 
                            ml={3} 
                            isLoading={mutation.isPending}
                        >
                            Delete Collection
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};