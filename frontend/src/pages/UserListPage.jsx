import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllUserLists, fetchGamesByIds } from "../api";
import {
    Box,
    Heading,
    SimpleGrid,
    Center,
    Spinner,
    Text,
} from "@chakra-ui/react";
import GameCard from "../components/GameCard";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const UserListPage = () => {
    const { listName } = useParams();

    const { data: allLists, status: listsStatus } = useQuery({
        queryKey: ["userLists"],
        queryFn: getAllUserLists,
    });

    const listIds = allLists?.find((list) => list.name === listName)?.games;

    const {
        data: listGames,
        status: gamesStatus,
        isError,
        error,
    } = useQuery({
        queryKey: [`${listName}Games`, listIds],
        queryFn: () => fetchGamesByIds(listIds),
        enabled: !!listIds,
    });

    const isInitialLoading =
        listsStatus === "pending" || gamesStatus === "pending";

    if (isInitialLoading) {
        return (
            <Center minH="calc(100vh - 150px)">
                <Spinner size="xl" color="brand.500" />
            </Center>
        );
    }

    if (isError) {
        return (
            <Center minH="calc(100vh - 150px)">
                <Text color="red.400">
                    Error fetching your wishlist: {error.message}
                </Text>
            </Center>
        );
    }

    return (
        <Box p={8}>
            <Heading mb={6}>My {capitalize(listName)}</Heading>

            {listGames && listGames.length > 0 ? (
                <SimpleGrid
                    columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
                    spacing={6}
                >
                    {listGames.map((game) => (
                        <GameCard
                            key={game.igdbId}
                            game={game}
                            variant={listName}
                        />
                    ))}
                </SimpleGrid>
            ) : (
                <Center
                    minH="200px"
                    borderWidth="1px"
                    borderColor="gray.700"
                    borderRadius="md"
                >
                    <Text>Your {listName} is empty. Start adding games!</Text>
                </Center>
            )}
        </Box>
    );
};
