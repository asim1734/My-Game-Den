import React, { useState } from "react";
import { 
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, FormControl, FormLabel, Input, useToast, ModalCloseButton
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createList } from "../../api"; // Adjust path to your api.js

export const CreateListModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const toast = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createList, // Works directly because createList takes 1 arg
        onSuccess: () => {
            toast({ title: "Collection Created!", status: "success", duration: 2000 });
            queryClient.invalidateQueries(["my-collections"]);
            setName(""); // Reset form
            onClose();
        },
        onError: (error) => {
            const msg = error.response?.data?.message || "Failed to create collection";
            toast({ title: "Error", description: msg, status: "error", duration: 3000 });
        }
    });

    const handleCreate = () => {
        if (!name.trim()) return;
        mutation.mutate(name);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(2px)" />
            <ModalContent bg="brand.800" color="white" border="1px solid" borderColor="brand.700">
                <ModalHeader>New Collection</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Collection Name</FormLabel>
                        <Input 
                            placeholder="e.g., Couch Co-op Games" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            bg="brand.900"
                            border="1px solid"
                            borderColor="brand.600"
                            autoFocus
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} _hover={{ bg: "whiteAlpha.100" }}>Cancel</Button>
                    <Button 
                        colorScheme="purple" 
                        onClick={handleCreate} 
                        isLoading={mutation.isPending}
                        isDisabled={!name.trim()}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};