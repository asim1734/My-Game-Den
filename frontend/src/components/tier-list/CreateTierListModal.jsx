import React, { useState } from "react";
import { 
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, FormControl, FormLabel, Input, useToast 
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
// 1. Import your configured api instance instead of axios
import api from "../../api"; 

export const CreateTierListModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleCreate = async () => {
        if (!title.trim()) return toast({ title: "Please enter a title", status: "warning" });

        setIsLoading(true);
        try {
            const res = await api.post("/tierlists", { title });
            
            toast({ title: "Tier List Created", status: "success" });
            onClose();
            navigate(`/tierlist-editor/${res.data._id}`);
        } catch (error) {
            const msg = error.response?.data?.message || "Error creating list";
            toast({ title: "Error", description: msg, status: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg="brand.800" color="white" border="1px solid" borderColor="brand.700">
                <ModalHeader>Create New Tier List</ModalHeader>
                <ModalBody>
                    <FormControl>
                        <FormLabel>Title</FormLabel>
                        <Input 
                            placeholder="e.g., Top RPGs of all time" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            bg="brand.900"
                            borderColor="brand.600"
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} _hover={{ bg: "whiteAlpha.100" }}>
                        Cancel
                    </Button>
                    <Button 
                        colorScheme="purple" 
                        onClick={handleCreate} 
                        isLoading={isLoading}
                    >
                        Start Ranking
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};