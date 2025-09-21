# Car Rental Backend (ASP.NET Core Web API)

This is the backend for the Car Rental system, built with ASP.NET Core 7 Web API, Entity Framework Core, JWT authentication, role-based authorization, Serilog logging, Swagger, and Docker support.

## Features
- RESTful API for car rental management
- JWT authentication & refresh token
- Role-based authorization (Admin, Staff, Customer)
- Vehicle, booking, payment, invoice, user management
- Swagger/OpenAPI documentation
- Serilog logging & exception handling
- File upload endpoints (vehicle images)
- Health checks endpoint
- Seed data & migrations
- Dockerfile & docker-compose support
- Unit tests (xUnit), AutoMapper

## Getting Started

### Prerequisites
- .NET 7 SDK
- SQL Server (local or Docker)

### Setup & Run
```bash
dotnet restore
dotnet build
dotnet ef database update
dotnet run
```

### Docker
```bash
docker build -t car-rental-backend .
docker-compose up --build
```

### API Docs
- Swagger UI: `/swagger`

### Environment Variables
- Configure secrets in `appsettings.Development.json` (local) or environment variables (production)

## Project Structure
- Controllers/
- Services/
- Repositories/
- Models/
- DTOs/
- Migrations/

## Testing
```bash
dotnet test
```

## License
MIT
