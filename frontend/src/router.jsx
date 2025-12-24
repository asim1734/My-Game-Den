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
import { MyReviewsPage } from "./pages/MyReviewsPage";
import { MyListsPage } from "./pages/MyListsPage";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Import the guard

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
                path: "browse",
                element: <BrowsePage />,
            },
            {
                path: "game/:id",
                element: <GameDetailsPage />,
            },
            {
                path: "search/:term",
                element: <SearchResultsPage />,
            },
            // --- PROTECTED ROUTES ---
            {
                path: "lists/:listName",
                element: (
                    <ProtectedRoute>
                        <UserListPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "my-lists",
                element: (
                    <ProtectedRoute>
                        <MyListsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "my-reviews",
                element: (
                    <ProtectedRoute>
                        <MyReviewsPage />
                    </ProtectedRoute>
                )
            }
        ],
    },
    {
        path: "*",
        element: <ErrorPage />,
    },
]);

export default router;