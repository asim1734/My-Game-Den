// src/components/StoreLink.jsx
import React from "react";
import { Button, Icon } from "@chakra-ui/react";
import {
    FaSteam,
    FaLink,
    FaXbox,
    FaYoutube,
    FaReddit,
    FaDiscord,
    FaTwitch,
} from "react-icons/fa";
import {
    SiGogdotcom,
    SiEpicgames,
    SiPlaystation,
    SiNintendoswitch,
} from "react-icons/si";

export const StoreLink = ({ website }) => {
    let StoreIcon = FaLink;
    let storeName = "Website";
    let bgColor = "gray.600"; // Default background
    let textColor = "white"; // Default text color

    // Determine styles based on category/type
    const categoryOrType = website.category ?? website.type;

    switch (categoryOrType) {
        // --- Stores ---
        case 13: // Steam
            StoreIcon = FaSteam;
            storeName = "Steam";
            bgColor = "#1b2838";
            break;
        case 16: // Epic Games
            StoreIcon = SiEpicgames;
            storeName = "Epic Games";
            bgColor = "#000000";
            break;
        case 17: // GOG
            StoreIcon = SiGogdotcom;
            storeName = "GOG";
            bgColor = "#8a4a9c";
            break;
        case 23: // PlayStation
            StoreIcon = SiPlaystation;
            storeName = "PlayStation";
            bgColor = "#0070d1";
            break;
        case 22: // Xbox
            StoreIcon = FaXbox;
            storeName = "Xbox";
            bgColor = "#107c10";
            break;
        case 24: // Nintendo
            StoreIcon = SiNintendoswitch;
            storeName = "Nintendo";
            bgColor = "#e60012";
            break;
        case 14: // Reddit
            StoreIcon = FaReddit;
            storeName = "Reddit";
            bgColor = "#FF4500"; // Reddit Orange-Red
            break;
        case 18: // Discord (Note: This was YouTube before, corrected below)
            StoreIcon = FaDiscord;
            storeName = "Discord";
            bgColor = "#5865F2"; // Discord Blurple
            break;
        case 1: // Official
            storeName = "Official Site";
            bgColor = "gray.500";
            break;
        case 6: // Twitch
            StoreIcon = FaTwitch;
            storeName = "Twitch";
            bgColor = "#9146ff";
            break;
        case 9: // YouTube
            StoreIcon = FaYoutube;
            storeName = "YouTube";
            bgColor = "#FF0000";
            break;
        // Add cases for Twitter (15), Facebook (14), Instagram (12), Reddit (8), Discord (6) if desired
        default:
            return null; // Ignore other types like wikis, etc.
    }

    return (
        <Button
            as="a"
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<Icon as={StoreIcon} />}
            bg={bgColor}
            color={textColor}
            size="sm"
            _hover={{ opacity: 0.8 }}
        >
            {storeName}
        </Button>
    );
};
