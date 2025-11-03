import React from "react";
import {
    Card,
    CardBody,
    AspectRatio,
    Skeleton,
    SkeletonText,
    HStack,
    VStack,
    Spacer,
} from "@chakra-ui/react";

const GameCardSkeleton = () => {
    return (
        <Card
            minWidth="180px" // Matches minWidth from GameCard
            borderRadius="lg"
            overflow="hidden"
            as="div" // Use 'as' to avoid LinkBox/Card nesting warnings
        >
            <AspectRatio ratio={3 / 4} width="100%">
                <Skeleton height="100%" />
            </AspectRatio>

            <CardBody p={3} display="flex" flexDirection="column" flex="1">
                {/* Top Row: Badge and Year */}
                <HStack justify="space-between" mb={2}>
                    <Skeleton height="20px" width="45px" borderRadius="md" />
                    <Skeleton height="16px" width="50px" />
                </HStack>

                {/* Title */}
                <SkeletonText
                    noOfLines={2}
                    spacing="3"
                    skeletonHeight="3"
                    mb={2}
                />

                {/* Info: Genres and Platforms */}
                <VStack align="start" spacing={1} color="gray.400" mb={3}>
                    <Skeleton height="14px" width="80%" />
                    <Skeleton height="14px" width="90%" />
                </VStack>

                <Spacer />

                {/* Buttons */}
                <HStack spacing="2" width="100%" mt={3}>
                    <Skeleton height="32px" flex="1" />
                    <Skeleton height="32px" flex="1" />
                </HStack>
            </CardBody>
        </Card>
    );
};

export default GameCardSkeleton;
