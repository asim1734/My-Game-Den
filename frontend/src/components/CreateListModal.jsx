import React, { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Button,
    useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createList } from "../api";

export const CreateListModal = ({ isOpen, onClose }) => {
    const [listName, setListName] = useState("");
    const toast = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createList,
        onSuccess: () => {
            toast({
                title: "List created!",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
            queryClient.invalidateQueries({ queryKey: ["userLists"] });
            onClose();
            setListName("");
        },
        onError: (error) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.msg || "Could not create list.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        },
    });

    const handleCreate = () => {
        if (listName.trim().length > 0) {
            mutation.mutate(listName.trim());
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg="brand.800">
                <ModalHeader>Create New List</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        placeholder="e.g., 'My Backlog', 'Favorites'"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleCreate()}
                        autoFocus
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        isLoading={mutation.isPending}
                        onClick={handleCreate}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
