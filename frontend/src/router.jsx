import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./components/RootLayout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ErrorPage } from "./pages/ErrorPage";
import { UserListPage } from "./pages/UserListPage";
import { GameDetailsPage } from "./pages/GameDetailsPage";
import { SearchResultsPage } from "./pages/SearchResultPage";
import { BrowsePage } from "./pages/BrowsePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
            {
                path: "lists/:listName",
                element: <UserListPage />,
            },
            {
                path: "game/:id",
                element: <GameDetailsPage />,
            },
            {
                path: "search/:searchTerm",
                element: <SearchResultsPage />,
            },
            {
                path: "browse",
                element: <BrowsePage />,
            },
        ],
    },
    {
        path: "*",
        element: <ErrorPage />,
    },
]);

export default router;
