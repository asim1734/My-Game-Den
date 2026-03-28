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

export const FilterSidebar = ({ filters, onFilterChange, onClearAll }) => {
    // Local state only for number inputs — apply on blur to avoid
    // firing a request on every keystroke
    const [localRating, setLocalRating] = useState(filters.minRating);
    const [localYearStart, setLocalYearStart] = useState(
        filters.releaseYearStart,
    );
    const [localYearEnd, setLocalYearEnd] = useState(filters.releaseYearEnd);

    // Sync local inputs when URL changes (e.g. after clearing all)
    useEffect(() => {
        setLocalRating(filters.minRating);
        setLocalYearStart(filters.releaseYearStart);
        setLocalYearEnd(filters.releaseYearEnd);
    }, [filters.minRating, filters.releaseYearStart, filters.releaseYearEnd]);

    return (
        <VStack
            spacing={6}
            align="stretch"
            position="sticky"
            top="100px"
            h="calc(100vh - 120px)"
            overflowY="auto"
            p={4}
            pb={6}
            borderRightWidth="1px"
            borderColor="gray.700"
        >
            <Heading size="md" mb={2}>
                Filters
            </Heading>

            {/* Genre */}
            <Box>
                <Text fontWeight="bold" mb={2}>
                    Genres
                </Text>
                <CheckboxGroup
                    colorScheme="purple"
                    value={filters.genre}
                    onChange={(val) => onFilterChange("genre", val)}
                >
                    <VStack align="start" spacing={1}>
                        {genreOptions.map((g) => (
                            <Checkbox key={g} value={g}>
                                {g}
                            </Checkbox>
                        ))}
                    </VStack>
                </CheckboxGroup>
            </Box>

            {/* Platform */}
            <Box>
                <Text fontWeight="bold" mb={2}>
                    Platforms
                </Text>
                <CheckboxGroup
                    colorScheme="purple"
                    value={filters.platform}
                    onChange={(val) => onFilterChange("platform", val)}
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

            {/* Min Rating */}
            <Box>
                <Text fontWeight="bold" mb={2}>
                    Min. Rating (0–100)
                </Text>
                <NumberInput
                    min={0}
                    max={100}
                    value={localRating}
                    onChange={setLocalRating}
                    onBlur={() => onFilterChange("minRating", localRating)}
                >
                    <NumberInputField placeholder="e.g. 75" />
                </NumberInput>
            </Box>

            {/* Release Year */}
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
                            value={localYearStart}
                            onChange={setLocalYearStart}
                            onBlur={() =>
                                onFilterChange(
                                    "releaseYearStart",
                                    localYearStart,
                                )
                            }
                        >
                            <NumberInputField placeholder="e.g. 2018" />
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel fontSize="sm" m={0}>
                            To
                        </FormLabel>
                        <NumberInput
                            min={1980}
                            max={currentYear + 5}
                            value={localYearEnd}
                            onChange={setLocalYearEnd}
                            onBlur={() =>
                                onFilterChange("releaseYearEnd", localYearEnd)
                            }
                        >
                            <NumberInputField placeholder="e.g. 2025" />
                        </NumberInput>
                    </FormControl>
                </HStack>
            </Box>

            <Button
                variant="outline"
                size="lg"
                py={4}
                onClick={onClearAll}
                mt={4}
            >
                Clear All
            </Button>
        </VStack>
    );
};
