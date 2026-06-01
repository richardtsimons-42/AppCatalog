FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY *.sln .
COPY AppCatalog.Api/*.csproj AppCatalog.Api/
RUN dotnet restore AppCatalog.Api/AppCatalog.Api.csproj

COPY AppCatalog.Api/. AppCatalog.Api/
WORKDIR /src/AppCatalog.Api
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "AppCatalog.Api.dll"]
