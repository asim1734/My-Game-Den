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

const GameCardSkeleton = ({ variant = "grid" }) => {
    const isDashboardCard = variant === "dashboard";

    return (
        <Card
            minW={
                isDashboardCard
                    ? { base: "110px", sm: "164px", md: "180px" }
                    : 0
            }
            w={
                isDashboardCard
                    ? { base: "110px", sm: "164px", md: "180px" }
                    : "100%"
            }
            h={
                isDashboardCard
                    ? { base: "220px", sm: "392px", md: "430px" }
                    : "100%"
            }
            flexShrink={isDashboardCard ? 0 : 1}
            borderRadius="lg"
            overflow="hidden"
            as="div" // Use 'as' to avoid LinkBox/Card nesting warnings
        >
            <AspectRatio ratio={3 / 4} width="100%">
                <Skeleton height="100%" />
            </AspectRatio>

            <CardBody
                p={isDashboardCard ? { base: 1.5, sm: 2.5, md: 3 } : 3}
                display="flex"
                flexDirection="column"
                flex="1"
            >
                {/* Top Row: Badge and Year */}
                <HStack 
                    justify="space-between" 
                    mb={isDashboardCard ? { base: 1, sm: 2 } : 2} 
                    minH={isDashboardCard ? { base: "14px", sm: "20px" } : "20px"}
                >
                    <Skeleton height={isDashboardCard ? { base: "14px", sm: "20px" } : "20px"} width={isDashboardCard ? { base: "30px", sm: "45px" } : "45px"} borderRadius="md" />
                    <Skeleton height={isDashboardCard ? { base: "12px", sm: "16px" } : "16px"} width={isDashboardCard ? { base: "30px", sm: "50px" } : "50px"} />
                </HStack>

                {/* Title */}
                <SkeletonText
                    noOfLines={2}
                    spacing={isDashboardCard ? "2" : "3"}
                    skeletonHeight={isDashboardCard ? "2.5" : "3"}
                    mb={isDashboardCard ? { base: 1, sm: 2 } : 2}
                />

                {/* Info: Genres and Platforms */}
                <VStack 
                    align="start" 
                    spacing={1} 
                    color="gray.400" 
                    mb={3}
                    display={isDashboardCard ? { base: "none", sm: "flex" } : "flex"}
                >
                    <Skeleton height="14px" width="80%" />
                    <Skeleton height="14px" width="90%" />
                </VStack>

                <Spacer />

                {/* Buttons */}
                <HStack 
                    spacing="2" 
                    width="100%" 
                    mt={3}
                    display={isDashboardCard ? { base: "none", sm: "flex" } : "flex"}
                >
                    <Skeleton height="32px" flex="1" />
                </HStack>
            </CardBody>
        </Card>
    );
};

export default GameCardSkeleton;
