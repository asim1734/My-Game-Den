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
    FormControl,
    FormLabel,
    FormErrorMessage,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTierList } from "../../api";

export const RenameTierListModal = ({ isOpen, onClose, tierList }) => {
    const [newTitle, setNewTitle] = useState("");
    const toast = useToast();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (tierList?.title) {
            setNewTitle(tierList.title);
        }
    }, [tierList, isOpen]);

    const mutation = useMutation({
        mutationFn: (variables) =>
            updateTierList(variables.id, { title: variables.title }),
        onSuccess: () => {
            toast({
                title: "Tier list renamed!",
                status: "success",
                duration: 2000,
                position: "top",
            });
            queryClient.invalidateQueries(["my-tierlists"]);
            onClose();
        },
        onError: (error) => {
            const msg =
                error.response?.data?.message || "Could not rename tier list";
            toast({
                title: "Error",
                description: msg,
                status: "error",
                duration: 3000,
                position: "top",
            });
        },
    });

    const handleRename = () => {
        const trimmedTitle = newTitle.trim();
        if (!trimmedTitle || trimmedTitle === tierList?.title) return;
        mutation.mutate({ id: tierList._id, title: trimmedTitle });
    };

    const isInvalid = !newTitle.trim();
    const isUnchanged = newTitle.trim() === tierList?.title;

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(2px)" />
            <ModalContent
                bg="brand.800"
                color="white"
                border="1px solid"
                borderColor="brand.700"
            >
                <ModalHeader>Rename Tier List</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={isInvalid}>
                        <FormLabel>Tier List Name</FormLabel>
                        <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    !isInvalid &&
                                    !isUnchanged
                                )
                                    handleRename();
                            }}
                            autoFocus
                            bg="brand.900"
                            borderColor="brand.600"
                        />
                        {isInvalid && (
                            <FormErrorMessage>
                                Name cannot be empty.
                            </FormErrorMessage>
                        )}
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        onClick={onClose}
                        _hover={{ bg: "whiteAlpha.100" }}
                    >
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
