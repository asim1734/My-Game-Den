import React, { useState, useEffect } from "react";
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
import { renameList } from "../api";

export const RenameListModal = ({ isOpen, onClose, list }) => {
    const [newName, setNewName] = useState(list.name);
    const toast = useToast();
    const queryClient = useQueryClient();

    // Update state if the prop changes (e.g., opening for a different list)
    useEffect(() => {
        setNewName(list.name);
    }, [list]);

    const mutation = useMutation({
        mutationFn: renameList,
        onSuccess: () => {
            toast({
                title: "List renamed!",
                status: "success",
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
                    error.response?.data?.msg || "Could not rename list.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        },
    });

    const handleRename = () => {
        if (newName.trim().length > 0 && newName.trim() !== list.name) {
            mutation.mutate({ listName: list.name, newName: newName.trim() });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg="brand.800">
                <ModalHeader>Rename '{list.name}'</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleRename()}
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
                        onClick={handleRename}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
