import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TierGameCard } from "./TierGameCard";
import { Box } from "@chakra-ui/react";

export const SortableGameCard = ({ game, id, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? undefined : transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 999 : "auto",
        touchAction: "none",
        willChange: isDragging ? "transform" : "auto",
    };

    return (
        <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TierGameCard game={game} variant="board" onRemove={onRemove} />
        </Box>
    );
};
