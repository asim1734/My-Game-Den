import React, { useState, useEffect } from "react";
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Input, Button, useToast, FormControl, FormLabel, FormErrorMessage
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameList } from "../../api"; 

export const RenameListModal = ({ isOpen, onClose, list }) => {
    const [newName, setNewName] = useState("");
    const toast = useToast();
    const queryClient = useQueryClient();

    // Reset input when the modal opens
    useEffect(() => {
        if (list?.name) {
            setNewName(list.name);
        }
    }, [list, isOpen]);

    const mutation = useMutation({
        // WRAPPER: Takes the object from .mutate(), splits it into 2 args for your API
        mutationFn: (variables) => {
            return renameList(variables.listName, variables.newName);
        },
        onSuccess: () => {
            toast({ title: "Collection renamed!", status: "success", duration: 2000 });
            queryClient.invalidateQueries(["my-collections"]);
            onClose();
        },
        onError: (error) => {
            const msg = error.response?.data?.message || "Could not rename collection";
            toast({ title: "Error", description: msg, status: "error", duration: 3000 });
        },
    });

    const handleRename = () => {
        const trimmedName = newName.trim();
        if (!trimmedName || trimmedName === list.name) return;

        // We pass ONE object here
        mutation.mutate({ 
            listName: list.name, 
            newName: trimmedName 
        });
    };

    const isInvalid = !newName.trim();
    const isUnchanged = newName.trim() === list?.name;

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(2px)" />
            <ModalContent bg="brand.800" color="white" border="1px solid" borderColor="brand.700">
                <ModalHeader>Rename Collection</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={isInvalid}>
                        <FormLabel>Collection Name</FormLabel>
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isInvalid && !isUnchanged) handleRename();
                            }}
                            autoFocus
                            bg="brand.900"
                            borderColor="brand.600"
                        />
                        {isInvalid && <FormErrorMessage>Name cannot be empty.</FormErrorMessage>}
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} _hover={{ bg: "whiteAlpha.100" }}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="purple"
                        onClick={handleRename}
                        isLoading={mutation.isPending}
                        isDisabled={isInvalid || isUnchanged}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};