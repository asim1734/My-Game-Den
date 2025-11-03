import axios from "axios";
import { Box, Flex, Heading, Text, Center, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import GameCard from "../components/GameCard";
import GameCardSkeleton from "../components/GameCardSkeleton";
import { fetchTopGames, fetchNewReleases, fetchUpcomingGames } from "../api";

const GameRow = ({ title, queryKey, fetcher }) => {
    const {
        data: games,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey,
        queryFn: fetcher,
        staleTime: 1000 * 60 * 10,
    });

    const skeletons = Array(10).fill(0);

    return (
        <Box my={8}>
            <Heading mb={4}>{title}</Heading>

            {isLoading && (
                <Box overflowX="auto" pb={4}>
                    <Flex gap={4} flexWrap="nowrap">
                        {skeletons.map((_, index) => (
                            <GameCardSkeleton key={index} />
                        ))}
                    </Flex>
                </Box>
            )}

            {isError && (
                <Center p={10}>
                    <Text color="red.400">
                        Could not load games: {error.message}
                    </Text>
                </Center>
            )}

            {games && (
                <Box overflowX="auto" pb={4}>
                    <Flex gap={4} flexWrap="nowrap">
                        {games.map((game) => (
                            <GameCard key={game.igdbId} game={game} />
                        ))}
                    </Flex>
                </Box>
            )}
        </Box>
    );
};

export const DashboardPage = () => {
    return (
        <Box p={8}>
            <GameRow
                title="Top Games"
                queryKey={["topGames"]}
                fetcher={fetchTopGames}
            />
            <GameRow
                title="Upcoming Games"
                queryKey={["upcomingGames"]}
                fetcher={fetchUpcomingGames}
            />
            <GameRow
                title="New Releases"
                queryKey={["newReleases"]}
                fetcher={fetchNewReleases}
            />
        </Box>
    );
};
