# CarBorrow - Car Rental Frontend

A modern car rental web application built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Authentication**: JWT-based auth with refresh tokens
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full type safety
- **Modern UI**: Clean and intuitive interface
- **API Integration**: Seamless connection with ASP.NET Core backend

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **State Management**: React Context
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

1. Copy `.env.local` and configure:
```env
NEXT_PUBLIC_API_URL=https://localhost:7000/api
```

2. Make sure the backend API is running on the configured URL.

## 🌐 API Endpoints

The frontend connects to these backend endpoints:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `GET /auth/profile` - User profile
- `GET /vehicles` - Vehicle listing
- `POST /rentals` - Create booking

## 📱 Pages

- `/` - Homepage
- `/login` - User login
- `/register` - User registration
- `/vehicles` - Vehicle listing
- `/dashboard` - User dashboard
- `/admin` - Admin panel (Admin only)

## 🔐 Demo Accounts

- **Admin**: admin@carborrow.com / Admin@123
- **Customer**: Register a new account

## 🎨 UI Components

- Responsive navigation bar
- Authentication forms with validation
- Loading states and error handling
- Modern card-based layouts
- Mobile-friendly design

## 🚀 Deployment

Build and deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
```

The app will be ready for deployment in the `.next` folder.

## 📄 License

This project is for educational purposes.