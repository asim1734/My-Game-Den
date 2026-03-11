import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import {
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import html2canvas from "html2canvas";
import { getTierList, updateTierList, fetchGamesByIds } from "../api";

export const useTierList = (tierListId) => {
    const toast = useToast();
    const [listTitle, setListTitle] = useState("");
    const [itemsLoaded, setItemsLoaded] = useState(false);
    const [activeDragItem, setActiveDragItem] = useState(null);
    const [isDirty, setIsDirty] = useState(false);

    const [tierDefs, setTierDefs] = useState([
        { id: "S", label: "S", color: "#ff7f7f" },
        { id: "A", label: "A", color: "#ffbf7f" },
        { id: "B", label: "B", color: "#ffff7f" },
        { id: "C", label: "C", color: "#7fff7f" },
        { id: "D", label: "D", color: "#7fbfff" },
    ]);

    const [items, setItems] = useState({
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
        unranked: [],
    });

    // Always-current refs — lets stable useCallbacks read latest state without closures
    const itemsRef = useRef(items);
    itemsRef.current = items;
    const tierDefsRef = useRef(tierDefs);
    tierDefsRef.current = tierDefs;

    // --- UNDO / REDO ---
    const historyRef = useRef([]);
    const historyIndexRef = useRef(-1);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const pushHistory = useCallback((newItems, newTierDefs) => {
        // Drop any redo states ahead of current position
        historyRef.current = historyRef.current.slice(
            0,
            historyIndexRef.current + 1,
        );
        historyRef.current.push({ items: newItems, tierDefs: newTierDefs });
        historyIndexRef.current = historyRef.current.length - 1;
        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(false);
        setIsDirty(true);
    }, []);

    const undo = useCallback(() => {
        if (historyIndexRef.current <= 0) return;
        historyIndexRef.current--;
        const snap = historyRef.current[historyIndexRef.current];
        setItems(snap.items);
        setTierDefs(snap.tierDefs);
        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(true);
        setIsDirty(true);
    }, []);

    const redo = useCallback(() => {
        if (historyIndexRef.current >= historyRef.current.length - 1) return;
        historyIndexRef.current++;
        const snap = historyRef.current[historyIndexRef.current];
        setItems(snap.items);
        setTierDefs(snap.tierDefs);
        setCanUndo(true);
        setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
        setIsDirty(true);
    }, []);

    // --- LOAD DATA ---
    useEffect(() => {
        if (!tierListId) return;

        const loadData = async () => {
            try {
                const data = await getTierList(tierListId);
                console.log("Loaded Data:", data);

                setListTitle(data.title || data.name || "Untitled Tier List");

                const loadedDefs = [];
                const rawDataMap = { unranked: [] };
                const defaultIds = ["S", "A", "B", "C", "D"];

                if (data.tiers && Array.isArray(data.tiers)) {
                    data.tiers.forEach((tierObj, index) => {
                        const tierId = defaultIds[index] || `tier-${index}`;
                        loadedDefs.push({
                            id: tierId,
                            label: tierObj.label || defaultIds[index],
                            color: tierObj.color || "#333",
                        });
                        rawDataMap[tierId] = tierObj.games || [];
                    });
                } else {
                    loadedDefs.push(...tierDefs);
                }

                if (data.unrankedPool) {
                    rawDataMap.unranked = data.unrankedPool;
                }

                let idsToFetch = [];
                const allKeys = [...loadedDefs.map((d) => d.id), "unranked"];

                allKeys.forEach((key) => {
                    const games = rawDataMap[key] || [];
                    games.forEach((game) => {
                        if (game && typeof game !== "object")
                            idsToFetch.push(game);
                    });
                });

                let fullGamesMap = {};
                if (idsToFetch.length > 0) {
                    const uniqueIds = [...new Set(idsToFetch)];
                    const fetchedGames = await fetchGamesByIds(uniqueIds);
                    fetchedGames.forEach((g) => {
                        fullGamesMap[g.id] = g;
                    });
                }

                const finalItems = {};
                allKeys.forEach((key) => {
                    const games = rawDataMap[key] || [];
                    finalItems[key] = games
                        .map((gameOrId) => {
                            if (typeof gameOrId === "object") {
                                return {
                                    ...gameOrId,
                                    id: gameOrId.igdbId || gameOrId.id,
                                    title: gameOrId.title || gameOrId.name,
                                    coverUrl:
                                        gameOrId.coverUrl ||
                                        (gameOrId.cover
                                            ? gameOrId.cover.url
                                            : ""),
                                };
                            }
                            return fullGamesMap[gameOrId] || null;
                        })
                        .filter(Boolean);
                });

                const finalDefs =
                    loadedDefs.length > 0 ? loadedDefs : [...tierDefs];
                setTierDefs(finalDefs);
                setItems(finalItems);
                setItemsLoaded(true);

                // Initialize history with the loaded state
                historyRef.current = [
                    { items: finalItems, tierDefs: finalDefs },
                ];
                historyIndexRef.current = 0;
                setCanUndo(false);
                setCanRedo(false);
                setIsDirty(false);
            } catch (error) {
                console.error("Load Error:", error);
                toast({ title: "Error loading list", status: "error" });
            }
        };

        loadData();
    }, [tierListId]);

    // --- WARN ON UNSAVED CHANGES ---
    useEffect(() => {
        const handler = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    // --- SENSORS ---
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const findContainer = useCallback((id) => {
        const current = itemsRef.current;
        if (id in current) return id;
        return Object.keys(current).find((key) =>
            current[key].find(
                (g) => (g.igdbId || g.id).toString() === id.toString(),
            ),
        );
    }, []);

    // --- TIER ACTIONS ---

    const handleUpdateTier = useCallback((tierId, newUpdates) => {
        const newDefs = tierDefsRef.current.map((tier) =>
            tier.id === tierId ? { ...tier, ...newUpdates } : tier,
        );
        setTierDefs(newDefs);
        pushHistory(itemsRef.current, newDefs);
    }, [pushHistory]);

    const handleAddTier = useCallback(() => {
        const newId = `tier-${Date.now()}`;
        const newDef = { id: newId, label: "New", color: "#7f7f7f" };
        const newTierDefs = [...tierDefsRef.current, newDef];
        const newItems = { ...itemsRef.current, [newId]: [] };
        setTierDefs(newTierDefs);
        setItems(newItems);
        pushHistory(newItems, newTierDefs);
    }, [pushHistory]);

    const handleDeleteTier = useCallback((tierId) => {
        const currentItems = itemsRef.current;
        const currentDefs = tierDefsRef.current;
        const tierGames = currentItems[tierId] || [];
        const newTierDefs = currentDefs.filter((t) => t.id !== tierId);
        const newItems = { ...currentItems };
        delete newItems[tierId];
        newItems.unranked = [...newItems.unranked, ...tierGames];
        setTierDefs(newTierDefs);
        setItems(newItems);
        pushHistory(newItems, newTierDefs);
    }, [pushHistory]);

    // --- GAME ACTIONS ---

    const handleRemoveGame = useCallback((gameId) => {
        const currentItems = itemsRef.current;
        const container = Object.keys(currentItems).find(
            (key) =>
                key === gameId.toString() ||
                currentItems[key]?.find(
                    (g) => (g.igdbId || g.id).toString() === gameId.toString(),
                ),
        );
        if (!container) return;
        const newItems = {
            ...currentItems,
            [container]: currentItems[container].filter(
                (g) => (g.igdbId || g.id).toString() !== gameId.toString(),
            ),
        };
        setItems(newItems);
        pushHistory(newItems, tierDefsRef.current);
    }, [pushHistory]);

    const handleAddGame = useCallback((game) => {
        const currentItems = itemsRef.current;
        const gameId = game.igdbId || game.id;
        const exists = Object.values(currentItems)
            .flat()
            .some((g) => (g.igdbId || g.id) === gameId);
        if (exists)
            return toast({
                title: "Already added",
                status: "warning",
                duration: 1000,
            });

        const newItems = { ...currentItems, unranked: [...currentItems.unranked, game] };
        setItems(newItems);
        pushHistory(newItems, tierDefsRef.current);
    }, [pushHistory, toast]);

    // --- SAVE ---

    const handleSave = async () => {
        const formattedTiers = tierDefs.map((def) => ({
            label: def.label,
            color: def.color,
            games: (items[def.id] || []).map((g) => ({
                igdbId: g.igdbId || g.id,
                title: g.title || g.name,
                coverUrl: g.coverUrl || (g.cover ? g.cover.url : ""),
            })),
        }));

        const payload = {
            title: listTitle,
            tiers: formattedTiers,
            unrankedPool: items.unranked.map((g) => ({
                igdbId: g.igdbId || g.id,
                title: g.title || g.name,
                coverUrl: g.coverUrl || (g.cover ? g.cover.url : ""),
            })),
        };

        try {
            await updateTierList(tierListId, payload);
            setIsDirty(false);
            toast({ title: "Saved!", status: "success", duration: 2000 });
        } catch (error) {
            console.error("Save Error:", error);
            toast({ title: "Save failed", status: "error" });
        }
    };

    // --- EXPORT ---

    const downloadImage = async (elementId) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        const toastId = toast({
            title: "Generating Image...",
            status: "loading",
            duration: null,
        });

        try {
            const clonedElement = element.cloneNode(true);

            // Hide UI chrome (drag handles, settings icons, etc.) from the export
            clonedElement.querySelectorAll('[data-export-hide="true"]').forEach(el => {
                el.style.display = 'none';
            });

            Object.assign(clonedElement.style, {
                position: "absolute",
                top: "-9999px",
                left: "-9999px",
                width: `${element.scrollWidth}px`,
                height: `${element.scrollHeight}px`,
                overflow: "visible",
                maxHeight: "none",
                maxWidth: "none",
                zIndex: "-1",
                backgroundColor: "#171923",
                paddingTop: "60px",
            });

            const headerDiv = document.createElement("div");
            Object.assign(headerDiv.style, {
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1A202C",
                borderBottom: "1px solid #2D3748",
                fontFamily: "system-ui, sans-serif",
            });

            const titleEl = document.createElement("h1");
            titleEl.innerText = listTitle || "My Tier List";
            Object.assign(titleEl.style, {
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: "0",
            });

            const logoImg = document.createElement("img");
            logoImg.src = "/MyGameDenLogo.png";
            Object.assign(logoImg.style, {
                position: "absolute",
                right: "20px",
                height: "40px",
                width: "auto",
            });

            headerDiv.appendChild(titleEl);
            headerDiv.appendChild(logoImg);
            clonedElement.insertBefore(headerDiv, clonedElement.firstChild);
            document.body.appendChild(clonedElement);

            const canvas = await html2canvas(clonedElement, {
                useCORS: true,
                backgroundColor: "#171923",
                scale: 2,
                logging: false,
                width: element.scrollWidth,
                height: element.scrollHeight + 60,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight + 60,
                x: 0,
                y: 0,
            });

            document.body.removeChild(clonedElement);
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `${listTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.update(toastId, {
                title: "Downloaded!",
                status: "success",
                duration: 2000,
            });
        } catch (error) {
            console.error("Export failed:", error);
            toast.update(toastId, {
                title: "Export failed",
                status: "error",
                duration: 3000,
            });
        }
    };

    // --- DRAG AND DROP ---

    const handleDragStart = useCallback((event) => {
        const { active } = event;
        if (active.data.current?.type === "tier") return;

        const container = findContainer(active.id);
        if (container) {
            const item = itemsRef.current[container].find(
                (g) => (g.igdbId || g.id).toString() === active.id.toString(),
            );
            setActiveDragItem(item);
        }
    }, [findContainer]);

    const handleDragOver = useCallback((event) => {
        const { active, over } = event;
        if (active.data.current?.type === "tier") return;
        if (!over || over.id === "TRASH") return;

        const activeId = active.id;
        const overId = over.id;
        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        )
            return;

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex(
                (g) => (g.igdbId || g.id).toString() === activeId.toString(),
            );
            const overIndex = overItems.findIndex(
                (g) => (g.igdbId || g.id).toString() === overId.toString(),
            );

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top >
                        over.rect.top + over.rect.height;
                const modifier = isBelowOverItem ? 1 : 0;
                newIndex =
                    overIndex >= 0
                        ? overIndex + modifier
                        : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter(
                        (item) =>
                            (item.igdbId || item.id).toString() !==
                            activeId.toString(),
                    ),
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    activeItems[activeIndex],
                    ...prev[overContainer].slice(
                        newIndex,
                        prev[overContainer].length,
                    ),
                ],
            };
        });
    }, [findContainer]);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;

        // --- TIER ROW REORDER ---
        if (active.data.current?.type === "tier") {
            if (
                over &&
                over.data.current?.type === "tier" &&
                active.id !== over.id
            ) {
                const stripPrefix = (id) => id.toString().replace(/^row-/, "");
                const currentDefs = tierDefsRef.current;
                const activeIndex = currentDefs.findIndex(
                    (t) => t.id === stripPrefix(active.id),
                );
                const overIndex = currentDefs.findIndex(
                    (t) => t.id === stripPrefix(over.id),
                );
                if (activeIndex !== -1 && overIndex !== -1) {
                    const newTierDefs = arrayMove(
                        currentDefs,
                        activeIndex,
                        overIndex,
                    );
                    setTierDefs(newTierDefs);
                    pushHistory(itemsRef.current, newTierDefs);
                }
            }
            setActiveDragItem(null);
            return;
        }

        if (!over) {
            setActiveDragItem(null);
            return;
        }

        // --- TRASH ---
        if (over.id === "TRASH") {
            const activeContainer = findContainer(active.id);
            if (activeContainer) {
                const activeIdString = active.id.toString();
                const currentItems = itemsRef.current;
                const newItems = {
                    ...currentItems,
                    [activeContainer]: currentItems[activeContainer].filter(
                        (item) =>
                            (item.igdbId || item.id).toString() !==
                            activeIdString,
                    ),
                };
                setItems(newItems);
                pushHistory(newItems, tierDefsRef.current);
                toast({
                    title: "Game Removed",
                    status: "info",
                    duration: 1000,
                });
            }
            setActiveDragItem(null);
            return;
        }

        // --- SAME CONTAINER REORDER ---
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);
        if (
            activeContainer &&
            overContainer &&
            activeContainer === overContainer
        ) {
            const currentItems = itemsRef.current;
            const activeIndex = currentItems[activeContainer].findIndex(
                (g) => (g.igdbId || g.id).toString() === active.id.toString(),
            );
            const overIndex = currentItems[overContainer].findIndex(
                (g) => (g.igdbId || g.id).toString() === over.id.toString(),
            );
            if (activeIndex !== overIndex) {
                const newItems = {
                    ...currentItems,
                    [activeContainer]: arrayMove(
                        currentItems[activeContainer],
                        activeIndex,
                        overIndex,
                    ),
                };
                setItems(newItems);
                pushHistory(newItems, tierDefsRef.current);
            }
        }

        setActiveDragItem(null);
    }, [findContainer, pushHistory, toast]);

    return {
        items,
        tierDefs,
        listTitle,
        itemsLoaded,
        activeDragItem,
        sensors,
        isDirty,
        canUndo,
        canRedo,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleAddGame,
        handleRemoveGame,
        handleSave,
        handleUpdateTier,
        handleAddTier,
        handleDeleteTier,
        undo,
        redo,
        downloadImage,
    };
};
