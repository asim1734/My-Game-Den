import React, { useState } from "react";
import { 
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, FormControl, FormLabel, Input, useToast 
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export const CreateCollectionModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const toast = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newListName) => {
            await api.post("/users/lists", { name: newListName });
        },
        onSuccess: () => {
            toast({ title: "Collection Created!", status: "success" });
            queryClient.invalidateQueries(["my-collections"]);
            onClose();
        },
        onError: (error) => {
            const msg = error.response?.data?.message || "Failed to create collection";
            toast({ title: "Error", description: msg, status: "error" });
        }
    });

    const handleCreate = () => {
        if (!name.trim()) return;
        mutation.mutate(name);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg="brand.800" color="white">
                <ModalHeader>New Collection</ModalHeader>
                <ModalBody>
                    <FormControl>
                        <FormLabel>Collection Name</FormLabel>
                        <Input 
                            placeholder="e.g., Couch Co-op Games" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            bg="brand.900"
                            border="1px solid"
                            borderColor="brand.700"
                            autoFocus
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
                    <Button 
                        colorScheme="purple" 
                        onClick={handleCreate} 
                        isLoading={mutation.isPending}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};