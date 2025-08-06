# 🌍 Air Pollution Monitor

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple?style=for-the-badge)](https://web.dev/progressive-web-apps/)
[![Django](https://img.shields.io/badge/Django-4.2-092E20?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A comprehensive **Progressive Web Application (PWA)** for monitoring real-time air quality data, tracking pollution levels, and protecting environmental health. Built with modern web technologies including Next.js, React, TypeScript, and Prisma.

![Air Pollution Monitor Screenshot](public/image/image_1.png)

## ✨ Features

### 🔍 **Real-time Air Quality Monitoring**
- Live AQI (Air Quality Index) readings
- Multiple pollutant tracking (PM2.5, PM10, NO2, O3, CO, SO2, NH3, Pb)
- Interactive Google Maps integration
- Historical data visualization with charts

### 📱 **Progressive Web App (PWA)**
- **Offline functionality** - Works without internet connection
- **Push notifications** for air quality alerts
- **One-click installation** on mobile and desktop
- **Native app-like experience**
- **Background sync** for data updates

### 🤖 **AI-Powered Features**
- Intelligent chatbot for air quality insights
- Smart recommendations based on pollution levels
- Predictive analysis for air quality trends

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark/Light mode support
- Smooth animations with AOS
- Intuitive dashboard interface
- Mobile-first approach

### 🔐 **User Management**
- Secure authentication system
- Personalized settings and preferences
- User-specific notification preferences

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 15.3.5, React 19, TypeScript |
| **Backend** | Python3 /DJango|
| **Styling** | Tailwind CSS 4.0, Radix UI Components , shacn UI |
| **Database** | PostgreSQL with Prisma ORM |
| **Maps** | Google Maps API |
| **PWA** | Next-PWA, Web Push API |
| **State Management** | Redux Toolkit |
| **Forms** | React Hook Form with Zod validation |
| **Charts** | Recharts |
| **Animations** | AOS (Animate On Scroll) |
| **API** | OpenMeteo Weather API |

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Google Maps API key**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RinSanom/IoTWeb.git 
   cd IoTWeb
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/air_quality_db"
   
   # Google Maps API
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
   
   # Push Notifications (VAPID Keys)
   NEXT_PUBLIC_VAPID_PUBLIC_KEY="your_vapid_public_key"
   VAPID_PRIVATE_KEY="your_vapid_private_key"
   VAPID_EMAIL="your_email@example.com"
   
   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   ```

5. **Generate VAPID keys for push notifications**
   ```bash
   node generate-vapid-keys.js
   ```

6. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 📖 Usage

### Setting Up Google Maps API

1. Visit the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API**
4. Create credentials (API key)
5. Add the API key to your `.env.local` file

For detailed instructions, see [GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md).

### Push Notifications Setup

1. Generate VAPID keys using the provided script:
   ```bash
   node generate-vapid-keys.js
   ```
2. Add the keys to your environment variables
3. The app will automatically handle push notification subscriptions

For more details, see [PUSH_NOTIFICATIONS_GUIDE.md](PUSH_NOTIFICATIONS_GUIDE.md).

### PWA Installation

The app automatically detects if it can be installed as a PWA and shows installation prompts:
- **Mobile**: Add to home screen banner
- **Desktop**: Install app prompt in address bar
- **Manual**: Use the install button in the app

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── air-quality/       # Air quality page
│   ├── about/             # About page
│   └── settings/          # Settings page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── air-quality/      # Air quality specific components
│   └── auth/             # Authentication components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── services/         # API services
│   ├── store/            # Redux store
│   └── types/            # TypeScript type definitions
└── layout/               # Layout components

public/
├── icons/                # PWA icons
├── image/                # Static images
└── sw.js                 # Service worker
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint for code quality |

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

For detailed deployment instructions, see [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md).

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

## 📱 PWA Features

- ✅ **Offline Support**: Works without internet connection
- ✅ **Push Notifications**: Air quality alerts and updates
- ✅ **Background Sync**: Automatic data synchronization
- ✅ **Install Prompts**: Native installation experience
- ✅ **App Shortcuts**: Quick access to key features
- ✅ **Responsive Design**: Optimized for all screen sizes

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes and commit**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Main models:

```prisma
model AirQuality {
  id          Int      @id @default(autoincrement())
  aqiCategory String   // Air Quality Index category
  pm10        Float    // PM10 particles
  pm2_5       Float    // PM2.5 particles
  no2         Float    // Nitrogen Dioxide
  o3          Float    // Ozone
  co          Float    // Carbon Monoxide
  so2         Float    // Sulfur Dioxide
  nh3         Float    // Ammonia
  pb          Float    // Lead
  timestamp   DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | ✅ |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID public key for push notifications | ✅ |
| `VAPID_PRIVATE_KEY` | VAPID private key | ✅ |
| `VAPID_EMAIL` | Contact email for VAPID | ✅ |
| `NEXT_PUBLIC_APP_URL` | Application URL | ✅ |

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenMeteo** for weather and air quality data
- **Google Maps** for mapping services
- **Vercel** for hosting and deployment
- **Next.js team** for the amazing framework
- **Open source community** for various packages and tools

## 📞 Support

If you have any questions or need help:

- 📧 **Email**: rinsanom3@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/RinSanom/IoTWeb/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/RinSanom/IoTWeb/discussions)

---

<div align="center">
  <p>Made with ❤️ for a cleaner environment</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>