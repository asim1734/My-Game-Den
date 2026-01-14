import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TierGameCard } from "./TierGameCard";
import { Box } from "@chakra-ui/react";

export const SortableGameCard = ({ game, id }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1, 
        zIndex: isDragging ? 999 : "auto",
        touchAction: "none" 
    };

    return (
        <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TierGameCard game={game} variant="board" />
        </Box>
    );
};