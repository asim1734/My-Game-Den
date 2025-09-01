// src/pages/DashboardPage.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Box, Flex, Heading, Text, Center, Spinner } from "@chakra-ui/react";
import GameCard from "../components/GameCard";

export const DashboardPage = () => {
    const [popularGames, setPopularGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchGames = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/games/default"
                );
                setPopularGames(response.data.popularGames);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (isLoading) {
        return (
            <Center minH="calc(100vh - 150px)">
                <Spinner size="xl" color="teal.500" />
            </Center>
        );
    }

    if (!popularGames || popularGames.length === 0) {
        return (
            <Center minH="calc(100vh - 150px)">
                <Text>No popular games to display.</Text>
            </Center>
        );
    }

    return (
        <Box p={8}>
            <Heading mb={6}>Top Games</Heading>
            <Box overflowX="auto" pb={4}>
                <Flex gap={4} flexWrap="nowrap">
                    {popularGames.map((game) => (
                        <GameCard key={game.title} game={game} />
                    ))}
                </Flex>
            </Box>
        </Box>
    );
};
