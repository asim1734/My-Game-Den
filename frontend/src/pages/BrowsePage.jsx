import React from "react";
import { useSearchParams } from "react-router-dom";
import {
    Box,
    Grid,
    GridItem,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { FiSliders } from "react-icons/fi";
import { FilterSidebar } from "../components/FilterSidebar";
import { ResultsGrid } from "../components/ResultsGrid";

export const BrowsePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const urlFilters = {
        genre: searchParams.get("genre")?.split(",").filter(Boolean) || [],
        platform:
            searchParams.get("platform")?.split(",").filter(Boolean) || [],
        minRating: searchParams.get("minRating") || "",
        releaseYearStart: searchParams.get("releaseYearStart") || "",
        releaseYearEnd: searchParams.get("releaseYearEnd") || "",
        sortBy: searchParams.get("sortBy") || "total_rating_count",
        sortOrder: searchParams.get("sortOrder") || "desc",
        page: parseInt(searchParams.get("page") || "1"),
    };

    // Instant filter update — called directly from sidebar on each change
    const handleFilterChange = (name, value) => {
        const newParams = new URLSearchParams(searchParams);
        const isEmpty =
            !value ||
            (Array.isArray(value) && value.length === 0) ||
            value === "";
        if (isEmpty) {
            newParams.delete(name);
        } else {
            newParams.set(name, Array.isArray(value) ? value.join(",") : value);
        }
        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    // Clear a single filter category (supports "year" to clear both year params)
    const handleClearOneFilter = (key) => {
        const newParams = new URLSearchParams(searchParams);
        if (key === "year") {
            newParams.delete("releaseYearStart");
            newParams.delete("releaseYearEnd");
        } else {
            newParams.delete(key);
        }
        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    // Clear all filters but preserve sort
    const handleClearAllFilters = () => {
        const newParams = new URLSearchParams();
        if (urlFilters.sortBy !== "total_rating_count")
            newParams.set("sortBy", urlFilters.sortBy);
        if (urlFilters.sortOrder !== "desc")
            newParams.set("sortOrder", urlFilters.sortOrder);
        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    const handleSortChange = (name, value) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(name, value);
        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    const activeFilterCount =
        urlFilters.genre.length +
        urlFilters.platform.length +
        (urlFilters.minRating ? 1 : 0) +
        (urlFilters.releaseYearStart || urlFilters.releaseYearEnd ? 1 : 0);

    return (
        <>
            {/* Mobile filter button — only visible below lg */}
            <Box display={{ base: "flex", lg: "none" }} px={8} pt={6}>
                <Button
                    leftIcon={<FiSliders />}
                    variant="outline"
                    colorScheme="purple"
                    size="sm"
                    onClick={onOpen}
                >
                    Filters
                    {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                </Button>
            </Box>

            <Grid
                templateColumns={{ base: "1fr", lg: "280px 1fr" }}
                gap={8}
                p={8}
            >
                {/* Desktop sidebar */}
                <GridItem display={{ base: "none", lg: "block" }}>
                    <FilterSidebar
                        filters={urlFilters}
                        onFilterChange={handleFilterChange}
                        onClearAll={handleClearAllFilters}
                    />
                </GridItem>

                <GridItem>
                    <ResultsGrid
                        filters={urlFilters}
                        onSortChange={handleSortChange}
                        onClearOneFilter={handleClearOneFilter}
                        onClearAllFilters={handleClearAllFilters}
                    />
                </GridItem>
            </Grid>

            {/* Mobile slide-out drawer */}
            <Drawer
                isOpen={isOpen}
                onClose={onClose}
                placement="left"
                size="xs"
            >
                <DrawerOverlay />
                <DrawerContent bg="gray.900">
                    <DrawerCloseButton />
                    <DrawerHeader
                        borderBottomWidth="1px"
                        borderColor="gray.700"
                    >
                        Filters
                    </DrawerHeader>
                    <DrawerBody p={0}>
                        <FilterSidebar
                            filters={urlFilters}
                            onFilterChange={handleFilterChange}
                            onClearAll={() => {
                                handleClearAllFilters();
                                onClose();
                            }}
                        />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};
