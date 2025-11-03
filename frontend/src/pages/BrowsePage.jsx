// src/pages/BrowsePage.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Grid, GridItem } from "@chakra-ui/react";
import { FilterSidebar } from "../components/FilterSidebar"; // Import new component
import { ResultsGrid } from "../components/ResultsGrid"; // Import new component

export const BrowsePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Read all filters from the URL
    const urlFilters = {
        genre: searchParams.get("genre")?.split(",") || [],
        platform: searchParams.get("platform")?.split(",") || [],
        minRating: searchParams.get("minRating") || "",
        releaseYearStart: searchParams.get("releaseYearStart") || "",
        releaseYearEnd: searchParams.get("releaseYearEnd") || "",
        sortBy: searchParams.get("sortBy") || "total_rating_count",
        sortOrder: searchParams.get("sortOrder") || "desc",
        page: parseInt(searchParams.get("page") || "1"),
    };

    // 2. This handler updates the URL when the sidebar "Apply" button is clicked
    const handleApplyFilters = (localFilters) => {
        const newParams = new URLSearchParams();

        if (localFilters.genre.length > 0)
            newParams.set("genre", localFilters.genre.join(","));
        if (localFilters.platform.length > 0)
            newParams.set("platform", localFilters.platform.join(","));
        if (localFilters.minRating)
            newParams.set("minRating", localFilters.minRating);
        if (localFilters.releaseYearStart)
            newParams.set("releaseYearStart", localFilters.releaseYearStart);
        if (localFilters.releaseYearEnd)
            newParams.set("releaseYearEnd", localFilters.releaseYearEnd);
        if (localFilters.sortBy) newParams.set("sortBy", localFilters.sortBy);
        if (localFilters.sortOrder)
            newParams.set("sortOrder", localFilters.sortOrder);
        newParams.set("page", "1");

        setSearchParams(newParams);
    };

    // 3. This handler updates the URL when the sort dropdowns change
    const handleSortChange = (name, value) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(name, value);
        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    return (
        <Grid templateColumns={{ base: "1fr", lg: "280px 1fr" }} gap={8} p={8}>
            <GridItem>
                <FilterSidebar
                    initialFilters={urlFilters}
                    onApplyFilters={handleApplyFilters}
                />
            </GridItem>
            <GridItem>
                <ResultsGrid
                    filters={urlFilters}
                    onSortChange={handleSortChange}
                />
            </GridItem>
        </Grid>
    );
};
