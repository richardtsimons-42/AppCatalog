# AppCatalog Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a personal web app catalog (like MS MyApps) with user registration, JWT authentication, role-based access, and CRUD for cataloged web apps.

**Architecture:** Clean architecture with SOLID principles. Backend is a .NET 10 Web API with layered design (Controllers → Services → Repositories → EF Core). Frontend is React + Vite + TypeScript with React Router for protected routes. JWT Bearer auth with role-based authorization. SQL Server via Docker.

**Tech Stack:**
- Backend: .NET 10 Web API, EF Core 10, SQL Server, JWT Bearer Auth, xUnit
- Frontend: React 19, Vite, TypeScript, react-router-dom, axios
- Infra: Docker Compose (API + SQL Server)
- Git: feature branch workflow with `main` as protected trunk

---

## Git Branching Strategy

- `main` — production-ready code, always deployable
- `feature/<name>` — short-lived branches for each feature (e.g., `feature/user-registration`)
- Branch from `main`, merge back via squash or rebase
- Commit convention: `type: description` (feat, fix, refactor, docs, chore, test)
