# AppCatalog

A personal web app catalog — like MS MyApps — built with .NET 10 and React.

## Features

- User registration and login with JWT authentication
- Role-based access (User / Admin)
- CRUD for cataloged web apps (name, URL, description, icon, category)
- Protected routes — only logged-in users can access the app catalog
- RESTful API with Swagger documentation
- Docker Compose deployment (API + SQL Server)

## Architecture

```
AppCatalog/
├── AppCatalog.Api/           # .NET 10 Web API
│   ├── Controllers/          # HTTP endpoints
│   ├── Services/             # Business logic (SOLID: SRP, DI)
│   ├── Data/                 # EF Core + Repository pattern
│   ├── Models/               # Domain entities
│   └── DTOs/                 # Request/Response contracts
├── AppCatalog.Api.Tests/     # xUnit integration tests
├── AppCatalog.Web/           # React 19 + Vite + TypeScript
│   ├── pages/                # Route components
│   ├── components/           # Reusable UI components
│   ├── context/              # Auth context (React Context API)
│   └── services/             # API client (axios)
├── docker-compose.yml        # API + SQL Server
└── docs/plans/               # Implementation plans
```

## SOLID Principles Applied

- **Single Responsibility** — Each class has one reason to change (controllers handle HTTP, services handle business logic, repositories handle data access)
- **Open/Closed** — Services depend on interfaces; new implementations can be added without modifying existing code
- **Dependency Inversion** — High-level modules (controllers, services) depend on abstractions (interfaces), not concrete classes
- **Interface Segregation** — Narrow interfaces (`IUserRepository`, `IAppCatalogEntryRepository`) instead of a fat generic one
- **Liskov Substitution** — Repository implementations can be swapped (in-memory for tests, SQL for production) without breaking callers

## Git Branching Strategy

- `main` — production-ready, always deployable
- `feature/<name>` — short-lived branches for each feature
- Commit convention: `type: description` (feat, fix, refactor, docs, chore, test)

## Getting Started

### Prerequisites

- .NET 10 SDK
- Node.js 18+
- Docker (for SQL Server)

### Run with Docker (full stack)

```bash
# Start SQL Server + API
docker compose up -d

# API available at http://localhost:5000
# Swagger at http://localhost:5000/swagger
```

### Run frontend locally (development)

```bash
cd AppCatalog.Web
npm install
npm run dev
# Frontend at http://localhost:5173
# Proxies /api requests to http://localhost:5000
```

### Run backend locally

```bash
cd AppCatalog.Api
dotnet run
# API at http://localhost:5000
```

### Run tests

```bash
dotnet test
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login, get JWT |
| GET | /api/appcatalog | Yes | Get all apps |
| GET | /api/appcatalog/my | Yes | Get my apps |
| GET | /api/appcatalog/{id} | Yes | Get app by ID |
| POST | /api/appcatalog | Yes | Create app |
| PUT | /api/appcatalog/{id} | Yes | Update app |
| DELETE | /api/appcatalog/{id} | Yes | Delete app |
