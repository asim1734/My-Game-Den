import React, { useState, useEffect } from "react";
import {
    Box,
    Heading,
    VStack,
    CheckboxGroup,
    Checkbox,
    Button,
    NumberInput,
    NumberInputField,
    HStack,
    FormControl,
    FormLabel,
    Text,
} from "@chakra-ui/react";

const genreOptions = [
    "RPG",
    "Shooter",
    "Adventure",
    "Strategy",
    "Platform",
    "Racing",
    "Sport",
    "Indie",
    "MOBA",
    "Simulator",
];
const platformOptions = [
    "PC",
    "PS5",
    "PS4",
    "Xbox Series",
    "Xbox One",
    "Switch",
];
const currentYear = new Date().getFullYear();

export const FilterSidebar = ({
    initialFilters,
    onApplyFilters,
    isFetching,
}) => {
    const [localFilters, setLocalFilters] = useState(initialFilters);

    useEffect(() => {
        setLocalFilters(initialFilters);
    }, [initialFilters]);

    const handleLocalFilterChange = (name, value) => {
        setLocalFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClearFilters = () => {
        setLocalFilters({
            genre: [],
            platform: [],
            minRating: "",
            releaseYearStart: "",
            releaseYearEnd: "",
            sortBy: "total_rating_count",
            sortOrder: "desc",
            page: 1,
        });
        // Passing an empty object to onApplyFilters might reset all external filters
        // If specific default values are needed, they should be passed here.
        onApplyFilters({});
    };

    return (
        <VStack
            spacing={6}
            align="stretch"
            position="sticky"
            top="100px"
            h="calc(100vh - 120px)"
            overflowY="auto" // Main scrollbar for the whole sidebar
            p={4} // Added padding to the entire sidebar
            pb={6} // Extra bottom padding for buttons
            borderRightWidth="1px" // Optional: Add a subtle border for separation
            borderColor="gray.700" // Optional: Border color
        >
            <Heading size="md" mb={2}>
                Filters
            </Heading>{" "}
            {/* Increased bottom margin for heading */}
            {/* Genre Filter */}
            <Box>
                <Text fontWeight="bold" mb={2}>
                    Genres
                </Text>
                <CheckboxGroup
                    colorScheme="purple"
                    value={localFilters.genre}
                    onChange={(val) => handleLocalFilterChange("genre", val)}
                >
                    <VStack align="start" spacing={1}>
                        {/* Removed maxH and overflowY from inner Vstack for genre */}
                        {genreOptions.map((g) => (
                            <Checkbox key={g} value={g}>
                                {g}
                            </Checkbox>
                        ))}
                    </VStack>
                </CheckboxGroup>
            </Box>
            {/* Platform Filter */}
            <Box>
                <Text fontWeight="bold" mb={2}>
                    Platforms
                </Text>
                <CheckboxGroup
                    colorScheme="purple"
                    value={localFilters.platform}
                    onChange={(val) => handleLocalFilterChange("platform", val)}
                >
                    <VStack align="start" spacing={1}>
                        {platformOptions.map((p) => (
                            <Checkbox key={p} value={p}>
                                {p}
                            </Checkbox>
                        ))}
                    </VStack>
                </CheckboxGroup>
            </Box>
            {/* Min. Rating Filter */}
            <Box>
                <Text fontWeight="bold" mb={2}>
                    Min. Rating (0-100)
                </Text>
                <NumberInput
                    min={0}
                    max={100}
                    value={localFilters.minRating}
                    onChange={(val) =>
                        handleLocalFilterChange("minRating", val)
                    }
                >
                    <NumberInputField placeholder="e.g., 75" />
                </NumberInput>
            </Box>
            {/* Release Year Filter */}
            <Box>
                <Text fontWeight="bold" mb={2}>
                    Release Year
                </Text>
                <HStack>
                    <FormControl>
                        <FormLabel fontSize="sm" m={0}>
                            From
                        </FormLabel>
                        <NumberInput
                            min={1980}
                            max={currentYear}
                            value={localFilters.releaseYearStart}
                            onChange={(val) =>
                                handleLocalFilterChange("releaseYearStart", val)
                            }
                        >
                            <NumberInputField placeholder="e.g., 2018" />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel fontSize="sm" m={0}>
                            To
                        </FormLabel>
                        <NumberInput
                            min={1980}
                            max={currentYear + 5}
                            value={localFilters.releaseYearEnd}
                            onChange={(val) =>
                                handleLocalFilterChange("releaseYearEnd", val)
                            }
                        >
                            <NumberInputField placeholder="e.g., 2025" />
                        </NumberInput>
                    </FormControl>
                </HStack>
            </Box>
            <Button
                colorScheme="purple"
                size="lg"
                py={4}
                onClick={() => onApplyFilters(localFilters)}
                isLoading={isFetching}
                mt={4}
            >
                Apply Filters
            </Button>
            <Button
                variant="outline"
                size="lg"
                py={4}
                onClick={handleClearFilters}
            >
                Clear All
            </Button>
        </VStack>
    );
};
