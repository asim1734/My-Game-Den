# My Game Den

A full-stack web application for tracking your video game library, creating tier lists, and writing reviews. Built with React + Express + MongoDB.

## Features

### Browse & Discover
- **Game Discovery** — Top rated, new releases, and upcoming games on the dashboard
- **Advanced Search** — Real-time search with `Ctrl+K` keyboard shortcut
- **Browse with Filters** — Filter by genre, platform, rating, and release year
- **Game Details** — View screenshots, trailers, platforms, genres, and external links

### Collections & Library
- **Game Lists** — Create custom collections (default: Collection, Wishlist)
- **Organize Games** — Add/remove games from any list
- **Library Dashboard** — Quick access to all your collections and tier lists

### Tier List Creator
- **Drag & Drop Editor** — Intuitive tier list builder with smooth animations
- **Customizable Tiers** — Add, remove, reorder, rename, and color-code tiers
- **Game Search** — Search and add any game from IGDB's database
- **Undo/Redo** — `Ctrl+Z` / `Ctrl+Y` support
- **Export as Image** — Save your tier list as a PNG

### Reviews
- **Write Reviews** — Rate games 1-5 stars with optional text
- **Community Reviews** — See what others think about each game
- **Review History** — View and manage all your reviews

## Tech Stack

### Frontend
- **React 18** + **Vite** — Fast development and builds
- **Chakra UI** — Component library with dark theme
- **React Router** — Client-side routing
- **TanStack Query** — Server state management
- **@dnd-kit** — Drag and drop for tier lists
- **Framer Motion** — Animations

### Backend
- **Express 5** — Web framework
- **MongoDB** + **Mongoose** — Database and ODM
- **JWT** — Authentication
- **bcrypt** — Password hashing

### External
- **IGDB API** — Game data (covers, ratings, metadata)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- IGDB API credentials ([get them here](https://api-docs.igdb.com/#getting-started))
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/asim1734/My-Game-Den.git
   cd My-Game-Den
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   pnpm install

   # Frontend
   cd ../frontend
   pnpm install
   ```

3. **Set up environment variables**

   Create `backend/.env`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mygamedb
   JWT_ACCESS_TOKEN=your-secret-key-here
   IGDB_CLIENT_ID=your-igdb-client-id
   IGDB_CLIENT_SECRET=your-igdb-client-secret
   IGDB_BEARER_TOKEN=your-igdb-bearer-token
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   pnpm dev

   # Terminal 2 - Frontend
   cd frontend
   pnpm dev
   ```

5. **Open the app**

   Visit [http://localhost:5173](http://localhost:5173)

## Project Structure

```
My-Game-Den/
├── backend/
│   ├── app.js              # Express entry point
│   ├── controller/         # Route handlers
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose schemas
│   └── routes/             # API route definitions
│
└── frontend/
    ├── src/
    │   ├── api.js          # API client
    │   ├── components/     # React components
    │   │   ├── library/    # Collection/list components
    │   │   ├── tier-list/  # Tier list editor components
    │   │   └── ui/         # Reusable UI components
    │   ├── hooks/          # Custom React hooks
    │   ├── pages/          # Page components
    │   └── router.jsx      # Route definitions
    └── public/             # Static assets
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Games
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games/top-games` | Get highest rated games |
| GET | `/api/games/new-releases` | Get recent releases |
| GET | `/api/games/upcoming` | Get upcoming games |
| GET | `/api/games/search` | Search games |
| GET | `/api/games/browse` | Browse with filters |
| GET | `/api/games/:id` | Get game details |

### User Lists (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/lists` | Get all user lists |
| POST | `/api/users/lists` | Create new list |
| PUT | `/api/users/lists/:name` | Rename list |
| DELETE | `/api/users/lists/:name` | Delete list |
| POST | `/api/users/lists/:name/games` | Add game to list |
| DELETE | `/api/users/lists/:name/games/:id` | Remove game |

### Reviews (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/my-reviews` | Get user's reviews |
| POST | `/api/reviews` | Create/update review |
| DELETE | `/api/reviews/game/:id` | Delete review |
| GET | `/api/reviews/community/:id` | Get community reviews |

### Tier Lists (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tierlists/my` | Get user's tier lists |
| POST | `/api/tierlists` | Create tier list |
| GET | `/api/tierlists/:id` | Get tier list |
| PUT | `/api/tierlists/:id` | Update tier list |
| DELETE | `/api/tierlists/:id` | Delete tier list |

## Scripts

### Backend
```bash
pnpm dev      # Start with nodemon (auto-restart)
```

### Frontend
```bash
pnpm dev      # Start Vite dev server
pnpm build    # Build for production
pnpm preview  # Preview production build
pnpm lint     # Run ESLint
```

## Deployment

### Frontend (Vercel)
The frontend includes a `vercel.json` configured for SPA routing. Deploy directly from GitHub or run:
```bash
cd frontend
vercel
```

### Backend
Deploy to any Node.js host (Railway, Render, Fly.io, etc.). Ensure environment variables are set.

## License

MIT
