import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { 
    useSensor, useSensors, PointerSensor, KeyboardSensor 
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { getTierList, updateTierList } from "../api";

export const useTierList = (tierListId) => {
    const toast = useToast();
    
    // --- STATE ---
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [listTitle, setListTitle] = useState("Untitled Tier List");
    const [activeDragItem, setActiveDragItem] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [rows, setRows] = useState([]);

    const [items, setItems] = useState({ unranked: [] });

    // Default Config (Fallback)
    const defaultRows = [
        { id: 'S', label: 'S', color: '#ff7f7f' },
        { id: 'A', label: 'A', color: '#ffbf7f' },
        { id: 'B', label: 'B', color: '#ffff7f' },
        { id: 'C', label: 'C', color: '#7fff7f' },
        { id: 'D', label: 'D', color: '#7fbfff' },
    ];

    // --- SENSORS ---
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // --- HELPERS ---
    const findContainer = (id) => {
        if (id in items) return id;
        return Object.keys(items).find((key) => 
            items[key].find((g) => (g.igdbId || g.id).toString() === id.toString())
        );
    };

    // --- API: FETCH DATA ---
    useEffect(() => {
        const fetchList = async () => {
            if (!tierListId) return;
            try {
                const data = await getTierList(tierListId);
                setListTitle(data.title);

                const loadedItems = { unranked: data.unrankedPool || [] };
                let loadedRows = [];

                if (data.tiers && data.tiers.length > 0) {
                    loadedRows = data.tiers.map((tier, index) => {
                        const rowId = tier._id || tier.id || `row-${index}`; 
                        loadedItems[rowId] = tier.games;
                        return {
                            id: rowId,
                            label: tier.label,
                            color: tier.color
                        };
                    });
                } else {
                    loadedRows = defaultRows;
                    loadedRows.forEach(row => loadedItems[row.id] = []);
                }

                setRows(loadedRows);
                setItems(prev => ({ ...prev, ...loadedItems }));
            } catch (error) {
                console.error(error);
                toast({ title: "Error loading list", status: "error" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchList();
    }, [tierListId]);

    // --- API: SAVE DATA ---
    const handleSave = async () => {
        setIsSaving(true);
        
        const formattedTiers = rows.map(row => ({
            id: row.id, 
            label: row.label,
            color: row.color,
            games: items[row.id] || []
        }));

        const payload = {
            title: listTitle,
            tiers: formattedTiers,
            unrankedPool: items.unranked
        };

        try {
            await updateTierList(tierListId, payload);
            toast({ title: "Progress Saved", status: "success", duration: 2000 });
        } catch (error) {
            toast({ title: "Save failed", status: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    // --- ROW MANAGEMENT ACTIONS ---

    const addRow = () => {
        const newId = `row-${Date.now()}`;
        setRows(prev => [...prev, { id: newId, label: 'New Tier', color: '#cbd5e0' }]);
        setItems(prev => ({ ...prev, [newId]: [] }));
    };

    const deleteRow = (rowId) => {
        const gamesToSave = items[rowId] || [];
        
        setRows(prev => prev.filter(row => row.id !== rowId));
        setItems(prev => {
            const newItems = { ...prev };
            delete newItems[rowId]; 
            newItems.unranked = [...newItems.unranked, ...gamesToSave];
            return newItems;
        });
    };

    const updateRow = (rowId, updates) => {
        setRows(prev => prev.map(row => 
            row.id === rowId ? { ...row, ...updates } : row
        ));
    };

    const moveRow = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= rows.length) return;
        
        const newRows = [...rows];
        const [movedRow] = newRows.splice(index, 1);
        newRows.splice(newIndex, 0, movedRow);
        setRows(newRows);
    };

    // --- GAME ACTIONS ---
    const handleAddGame = (game) => {
        const gameId = game.igdbId || game.id;
        const exists = Object.values(items).flat().some(g => (g.igdbId || g.id) === gameId);
        
        if (exists) {
            return toast({ title: "Already added", status: "warning", duration: 1000, position: "top-right" });
        }
        setItems(prev => ({
            ...prev,
            unranked: [...prev.unranked, game]
        }));
    };

    // --- DND HANDLERS ---
    const handleDragStart = (event) => {
        const { active } = event;
        const container = findContainer(active.id);
        if (container) {
            const item = items[container].find(g => (g.igdbId || g.id).toString() === active.id.toString());
            setActiveDragItem(item);
        }
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;
        if (over.id === "TRASH") return;

        const activeId = active.id;
        const overId = over.id;
        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            
            const activeIndex = activeItems.findIndex(g => (g.igdbId || g.id).toString() === activeId.toString());
            const overIndex = overItems.findIndex(g => (g.igdbId || g.id).toString() === overId.toString());

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => (item.igdbId || item.id).toString() !== activeId.toString())
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    activeItems[activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length)
                ]
            };
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) {
            setActiveDragItem(null);
            return;
        }

        if (over.id === "TRASH") {
            const activeContainer = findContainer(active.id);
            if (activeContainer) {
                const activeIdString = active.id.toString();
                
                setItems((prev) => ({
                    ...prev,
                    [activeContainer]: prev[activeContainer].filter(
                        (item) => (item.igdbId || item.id).toString() !== activeIdString
                    )
                }));
                
                toast({ title: "Game Removed", status: "info", duration: 1500, isClosable: true });
            }
            setActiveDragItem(null);
            return;
        }

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (activeContainer && overContainer && activeContainer === overContainer) {
            const activeIndex = items[activeContainer].findIndex(g => (g.igdbId || g.id).toString() === active.id.toString());
            const overIndex = items[overContainer].findIndex(g => (g.igdbId || g.id).toString() === over.id.toString());

            if (activeIndex !== overIndex) {
                setItems((prev) => ({
                    ...prev,
                    [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex)
                }));
            }
        }
        
        setActiveDragItem(null);
    };

    return {
        // State
        items,
        rows, // Replaces tiersConfig
        isLoading,
        isSaving,
        listTitle,
        activeDragItem,
        isSidebarOpen,
        sensors,
        
        // Actions
        setSidebarOpen,
        handleAddGame,
        handleSave,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        
        // New Row Actions
        addRow,
        deleteRow,
        updateRow,
        moveRow
    };
};