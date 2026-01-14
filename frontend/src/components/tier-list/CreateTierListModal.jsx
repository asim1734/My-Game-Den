import React, { useState } from "react";
import { 
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, FormControl, FormLabel, Input, Textarea, useToast 
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const CreateTierListModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleCreate = async () => {
        if (!title) return toast({ title: "Please enter a title", status: "warning" });

        setIsLoading(true);
        try {
            const token = localStorage.getItem("x-auth-token");
            const res = await axios.post("http://localhost:3000/api/tierlists", 
                { title }, 
                { headers: { "x-auth-token": token } }
            );
            
            toast({ title: "Tier List Created", status: "success" });
            onClose();
            navigate(`/tierlist-editor/${res.data._id}`);
        } catch (error) {
            toast({ title: "Error creating list", status: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg="brand.800" color="white">
                <ModalHeader>Create New Tier List</ModalHeader>
                <ModalBody>
                    <FormControl>
                        <FormLabel>Title</FormLabel>
                        <Input 
                            placeholder="e.g., Top RPGs of all time" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            bg="brand.900"
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
                    <Button colorScheme="purple" onClick={handleCreate} isLoading={isLoading}>
                        Start Ranking
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};