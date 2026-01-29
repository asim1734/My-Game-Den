import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { 
    useSensor, useSensors, PointerSensor, KeyboardSensor 
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import html2canvas from "html2canvas"; // Keep this for export
import { getTierList, updateTierList, fetchGamesByIds } from "../api"; 

export const useTierList = (tierListId) => {
    const toast = useToast();
    const [listTitle, setListTitle] = useState("");
    const [itemsLoaded, setItemsLoaded] = useState(false);
    const [activeDragItem, setActiveDragItem] = useState(null);

    // 1. NEW: State for Tier Definitions (Labels & Colors)
    const [tierDefs, setTierDefs] = useState([
        { id: 'S', label: 'S', color: '#ff7f7f' },
        { id: 'A', label: 'A', color: '#ffbf7f' },
        { id: 'B', label: 'B', color: '#ffff7f' },
        { id: 'C', label: 'C', color: '#7fff7f' },
        { id: 'D', label: 'D', color: '#7fbfff' },
    ]);

    const [items, setItems] = useState({
        S: [], A: [], B: [], C: [], D: [], unranked: []
    });

    // --- LOAD DATA ---
    useEffect(() => {
        if (!tierListId) return;

        const loadData = async () => {
            try {
                const data = await getTierList(tierListId);
                console.log("Loaded Data:", data);
                
                setListTitle(data.title || data.name || "Untitled Tier List");

                // A. Parse Tier Definitions (Labels/Colors) from Backend
                const loadedDefs = [];
                const rawDataMap = { unranked: [] }; // Helper to store games
                
                // Default IDs if backend doesn't provide them
                const defaultIds = ['S', 'A', 'B', 'C', 'D'];

                if (data.tiers && Array.isArray(data.tiers)) {
                    data.tiers.forEach((tierObj, index) => {
                        // Use existing ID or fallback
                        const tierId = defaultIds[index] || `tier-${index}`;
                        
                        // 1. Save Definition
                        loadedDefs.push({
                            id: tierId,
                            label: tierObj.label || defaultIds[index], // Use saved label ("GOOD")
                            color: tierObj.color || '#333',
                        });

                        // 2. Save Games for this tier
                        rawDataMap[tierId] = tierObj.games || [];
                    });
                } else {
                    // Fallback if new list
                    loadedDefs.push(...tierDefs);
                }

                // If backend had fewer tiers, ensure we fill the gap or just use what we found
                // For now, let's sync the state
                if (loadedDefs.length > 0) {
                    setTierDefs(loadedDefs);
                }

                // B. Map Unranked
                if (data.unrankedPool) {
                    rawDataMap.unranked = data.unrankedPool;
                }

                // C. Hydrate Games (Same as before)
                let idsToFetch = [];
                const allKeys = [...loadedDefs.map(d => d.id), 'unranked'];

                allKeys.forEach(key => {
                    const games = rawDataMap[key] || [];
                    games.forEach(game => {
                        if (game && typeof game !== 'object') idsToFetch.push(game);
                    });
                });

                let fullGamesMap = {};
                if (idsToFetch.length > 0) {
                    const uniqueIds = [...new Set(idsToFetch)];
                    const fetchedGames = await fetchGamesByIds(uniqueIds);
                    fetchedGames.forEach(g => { fullGamesMap[g.id] = g; });
                }

                // D. Build Items State
                const finalItems = {};
                allKeys.forEach(key => {
                    const games = rawDataMap[key] || [];
                    finalItems[key] = games.map(gameOrId => {
                        if (typeof gameOrId === 'object') {
                            return {
                                ...gameOrId,
                                id: gameOrId.igdbId || gameOrId.id,
                                title: gameOrId.title || gameOrId.name,
                                coverUrl: gameOrId.coverUrl || (gameOrId.cover ? gameOrId.cover.url : "")
                            };
                        }
                        return fullGamesMap[gameOrId] || null;
                    }).filter(Boolean);
                });

                setItems(finalItems);
                setItemsLoaded(true);

            } catch (error) {
                console.error("Load Error:", error);
                toast({ title: "Error loading list", status: "error" });
            }
        };

        loadData();
    }, [tierListId]);

    // --- SENSORS ---
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const findContainer = (id) => {
        if (id in items) return id;
        return Object.keys(items).find((key) => 
            items[key].find((g) => (g.igdbId || g.id).toString() === id.toString())
        );
    };

    // --- ACTIONS ---

    // 2. NEW: Update Tier Definition (Label/Color)
    const handleUpdateTier = (tierId, newUpdates) => {
        setTierDefs(prev => prev.map(tier => 
            tier.id === tierId ? { ...tier, ...newUpdates } : tier
        ));
    };

    const handleAddGame = (game) => {
        const gameId = game.igdbId || game.id;
        const exists = Object.values(items).flat().some(g => (g.igdbId || g.id) === gameId);
        if (exists) return toast({ title: "Already added", status: "warning", duration: 1000 });
        
        setItems(prev => ({ ...prev, unranked: [...prev.unranked, game] }));
    };

    const handleSave = async () => {
        // Use the DYNAMIC tierDefs state to build the payload
        const formattedTiers = tierDefs.map(def => ({
            label: def.label,
            color: def.color,
            games: (items[def.id] || []).map(g => ({
                igdbId: g.igdbId || g.id,
                title: g.title || g.name,
                coverUrl: g.coverUrl || (g.cover ? g.cover.url : "")
            }))
        }));

        const payload = {
            title: listTitle,
            tiers: formattedTiers,
            unrankedPool: items.unranked.map(g => ({
                igdbId: g.igdbId || g.id,
                title: g.title || g.name,
                coverUrl: g.coverUrl || (g.cover ? g.cover.url : "")
            }))
        };

        try {
            await updateTierList(tierListId, payload);
            toast({ title: "Saved!", status: "success", duration: 2000 });
        } catch (error) {
            console.error("Save Error:", error);
            toast({ title: "Save failed", status: "error" });
        }
    };

    const downloadImage = async (elementId) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        const toastId = toast({ title: "Generating Image...", status: "loading", duration: null });

        try {
            const clonedElement = element.cloneNode(true);
            Object.assign(clonedElement.style, {
                position: 'absolute', top: '-9999px', left: '-9999px',
                width: `${element.scrollWidth}px`, height: `${element.scrollHeight}px`,
                overflow: 'visible', maxHeight: 'none', maxWidth: 'none', zIndex: '-1',
                backgroundColor: '#171923', paddingTop: '60px'
            });

            const headerDiv = document.createElement('div');
            Object.assign(headerDiv.style, {
                position: 'absolute', top: '0', left: '0', width: '100%', height: '60px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#1A202C', borderBottom: '1px solid #2D3748', fontFamily: 'system-ui, sans-serif'
            });

            const titleEl = document.createElement('h1');
            titleEl.innerText = listTitle || "My Tier List";
            Object.assign(titleEl.style, {
                color: 'white', fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: '0'
            });

            const logoImg = document.createElement('img');
            logoImg.src = "/MyGameDenLogo.png"; 
            Object.assign(logoImg.style, {
                position: 'absolute', right: '20px', height: '40px', width: 'auto'
            });

            headerDiv.appendChild(titleEl);
            headerDiv.appendChild(logoImg);
            clonedElement.insertBefore(headerDiv, clonedElement.firstChild);
            document.body.appendChild(clonedElement);

            const canvas = await html2canvas(clonedElement, {
                useCORS: true, backgroundColor: "#171923", scale: 2, logging: false,
                width: element.scrollWidth, height: element.scrollHeight + 60,
                windowWidth: element.scrollWidth, windowHeight: element.scrollHeight + 60,
                x: 0, y: 0
            });

            document.body.removeChild(clonedElement);
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `${listTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.update(toastId, { title: "Downloaded!", status: "success", duration: 2000 });
        } catch (error) {
            console.error("Export failed:", error);
            toast.update(toastId, { title: "Export failed", status: "error", duration: 3000 });
        }
    };

    // ... (Keep handleDragStart, handleDragOver, handleDragEnd SAME as before) ...
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
        if (!over || over.id === "TRASH") return;

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
                [activeContainer]: [...prev[activeContainer].filter(item => (item.igdbId || item.id).toString() !== activeId.toString())],
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
                toast({ title: "Game Removed", status: "info", duration: 1000 });
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
        items,
        tierDefs, // EXPOSED
        listTitle,
        itemsLoaded,
        activeDragItem,
        sensors,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleAddGame,
        handleSave,
        handleUpdateTier, // EXPOSED
        downloadImage
    };
};