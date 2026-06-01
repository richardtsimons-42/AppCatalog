# Task 14: Docker Compose Setup

**Objective:** Create Docker Compose to run SQL Server alongside the API. The React frontend runs via Vite dev server locally.

**Files:**
- Create: `docker-compose.yml`
- Create: `Dockerfile` (in AppCatalog.Api directory)

**Step 1: Create Dockerfile for the API**

Create `AppCatalog.Api/Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and restore
COPY *.sln .
COPY AppCatalog.Api/*.csproj AppCatalog.Api/
RUN dotnet restore AppCatalog.Api/AppCatalog.Api.csproj

# Copy source and build
COPY AppCatalog.Api/. AppCatalog.Api/
WORKDIR /src/AppCatalog.Api
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "AppCatalog.Api.dll"]
```

**Step 2: Create docker-compose.yml**

Create `docker-compose.yml` in the project root:

```yaml
services:
  api:
    build: ./AppCatalog.Api
    ports:
      - "5000:8080"
    environment:
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=AppCatalog;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;
      - TokenSettings__Secret=YourSuperSecretKeyThatIsAtLeast32CharactersLong!
      - TokenSettings__Issuer=AppCatalog
      - TokenSettings__Audience=AppCatalogUsers
      - TokenSettings__ExpiryMinutes=60
      - ASPNETCORE_ENVIRONMENT=Development
    depends_on:
      sqlserver:
        condition: service_healthy
    restart: unless-stopped

  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    ports:
      - "1434:1433"
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong!Passw0rd
      - MSSQL_PID=Developer
    volumes:
      - sqlserver-data:/var/opt/mssql
    healthcheck:
      test: ["CMD-SHELL", "/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -Q 'SELECT 1'"]
      interval: 10s
      retries: 10
      start_period: 30s
      timeout: 5s

volumes:
  sqlserver-data:
```

**Step 3: Update appsettings.Development.json**

Update `AppCatalog.Api/appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=AppCatalog;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
  }
}
```

**Step 4: Commit**

```bash
cd /c/Users/richa/AppData/Local/hermes/app-catalog
git add -A
git commit -m "infra: add Dockerfile and docker-compose.yml for API + SQL Server"
```
