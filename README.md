# Miso ( Web client )

A Next.js-based frontend application for the Miso companion platform with real-time voice AI interaction.

## Prerequisites

- Node.js 18+
- npm or yarn package manager
- Backend server running (see [backend README](../miso/README.md))

## Features

- **Speak your mind** - Real-time audio conversations with AI companion
- **Conversation insights** - Detailed metrics and insights for each conversation
- **Clen and modern UI** - Clutter free UI experience
- **Session Resume** - Continue previous conversations seamlessly
- **Progress Tracking** - Visual dashboard with session history and metrics

## Environment Setup

1. **Clone the repository and navigate to the client directory:**
   ```bash
   cd miso-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env.local` file with the following variables:**
   ```env
   # Backend API
   NEXT_PUBLIC_API_URL="http://localhost:8000"
   
   # LiveKit Configuration
   NEXT_PUBLIC_LIVEKIT_URL="wss://your-livekit-server.livekit.cloud"
   
   # Supabase (optional - for direct client access)
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

## Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Type Checking
```bash
npm run type-check
# or
yarn type-check
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## Application Structure

```
miso-client/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── auth/
│   │   │   ├── signin/         # Sign in page
│   │   │   └── signup/         # Sign up page
│   │   ├── dashboard/          # Main dashboard
│   │   ├── session/[id]/       # Individual session view
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── AuthenticatedLayout.tsx
│   │   ├── SessionView.tsx
│   │   ├── ai-agent-sphere.tsx
│   │   └── nav-sessions.tsx
│   ├── lib/                    # Utilities and configurations
│   │   ├── api.ts              # API client
│   │   └── utils.ts            # Helper functions
│   └── hooks/                  # Custom React hooks
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Key Features

### Authentication Flow

The application uses HTTP-only cookies for secure authentication:

1. **Sign Up/Sign In** - Users authenticate via email/password
2. **Session Management** - Automatic token refresh with fallback handling
3. **Protected Routes** - Authenticated layout wrapper for secure pages

[Screenshot placeholder: Sign in page with form fields and gradient background]

### Voice Therapy Sessions

Real-time voice interaction powered by LiveKit:

1. **AI Agent Sphere** - Interactive visual indicator that pulses with AI speech
2. **Voice Controls** - One-click start/stop session functionality
3. **Real-time Audio** - Low-latency voice communication with AI therapist

[Screenshot placeholder: Dashboard with large AI sphere and start session button]

### Session Management

Comprehensive session tracking and analytics:

1. **Session History** - Sidebar navigation with organized session groups
2. **Resume Functionality** - Continue previous conversations with context
3. **Session Analytics** - Detailed metrics including duration, mood, and engagement

[Screenshot placeholder: Session details page with metric cards and charts]

### Dashboard Overview

Modern, responsive dashboard interface:

1. **Welcome Message** - Personalized greeting with user context
2. **Feature Cards** - Voice-first, compassionate, and secure highlights
3. **Session Controls** - Easy access to start new or resume existing sessions

[Screenshot placeholder: Full dashboard view with welcome message and feature cards]

## Components

### Core Components

- **`AuthenticatedLayout`** - Wrapper for protected pages with sidebar navigation
- **`SessionView`** - Main therapy session interface with AI sphere
- **`AIAgentSphere`** - Interactive sphere that responds to AI voice activity
- **`NavSessions`** - Sidebar navigation with session history and controls

### UI Components (shadcn/ui)

- **`Dialog`** - Modal dialogs for confirmations and forms
- **`AlertDialog`** - Confirmation dialogs for destructive actions
- **`Sidebar`** - Collapsible navigation sidebar
- **`Toast`** - Notification system using Sonner

## API Integration

The application communicates with the backend via a centralized API client (`src/lib/api.ts`):

### Authentication Endpoints
```typescript
// Sign in user
await apiClient.signIn({ email, password })

// Sign up new user
await apiClient.signUp({ username, email, password })

// Refresh access token
await apiClient.refreshToken()

// Sign out user
await apiClient.logout()
```

### Session Management
```typescript
// Create new therapy session
await apiClient.createSession()

// Resume existing session
await apiClient.resumeSession(sessionId)

// Get session details
await apiClient.getSessionData(sessionId)

// Delete session
await apiClient.deleteSession(sessionId)

// Get user sessions
await apiClient.getSessions()
```

## Styling

The application uses:

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Custom Gradients** - Orange to yellow gradients for branding
- **Responsive Design** - Mobile-first approach with breakpoint variants

### Theme Configuration

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      orange: {
        500: '#f97316',
        600: '#ea580c',
      },
      yellow: {
        500: '#eab308',
        600: '#ca8a04',
      }
    }
  }
}
```

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy automatically on git push**

[Screenshot placeholder: Vercel deployment dashboard with environment variables]

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL="https://your-backend-api.com"
NEXT_PUBLIC_LIVEKIT_URL="wss://your-livekit-server.livekit.cloud"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## Development

### Adding New Components

1. **Create component file in `src/components/`**
2. **Use TypeScript for type safety**
3. **Follow existing naming conventions**
4. **Add to component exports if reusable**

### Adding New Pages

1. **Create page in `src/app/` directory**
2. **Use app router file conventions**
3. **Wrap with `AuthenticatedLayout` if authentication required**
4. **Add proper metadata and SEO**

### State Management

The application uses React's built-in state management:

- **useState** - Local component state
- **useEffect** - Side effects and lifecycle
- **Context** - Shared state when needed (LiveKit room context)
- **Custom Hooks** - Reusable stateful logic

### API Error Handling

Centralized error handling with user-friendly messages:

```typescript
// Automatic toast notifications for errors
if (response.error) {
  toast.error(response.error)
  return
}

// Success notifications
toast.success('Session created successfully!')
```

## Testing

### Unit Testing
```bash
npm run test
# or
yarn test
```

### E2E Testing
```bash
npm run test:e2e
# or
yarn test:e2e
```

### Type Checking
```bash
npm run type-check
# or
yarn type-check
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` file exists
   - Restart development server after changes
   - Check variable names have `NEXT_PUBLIC_` prefix for client-side access

2. **LiveKit Connection Issues**
   - Verify `NEXT_PUBLIC_LIVEKIT_URL` is correct
   - Check browser microphone permissions
   - Ensure backend server is running and accessible

3. **Authentication Issues**
   - Clear browser cookies and localStorage
   - Check backend API URL in environment variables
   - Verify backend server authentication endpoints

4. **Build Errors**
   - Run `npm run type-check` to identify TypeScript errors
   - Check for missing dependencies
   - Verify all environment variables are set

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=true npm run dev
```

### Network Issues

Check browser developer tools:
1. **Network tab** - Verify API requests are reaching backend
2. **Console tab** - Check for JavaScript errors
3. **Application tab** - Inspect cookies and localStorage

## Performance Optimization

### Implemented Optimizations

- **Next.js App Router** - Automatic code splitting and optimization
- **Dynamic Imports** - Lazy loading of heavy components
- **Image Optimization** - Next.js automatic image optimization
- **Font Optimization** - Preloaded custom fonts

### Monitoring

Consider adding performance monitoring:

- **Vercel Analytics** - Built-in performance metrics
- **Web Vitals** - Core web vitals tracking
- **Error Tracking** - Sentry or similar service

## Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

Note: Voice features require modern browsers with WebRTC support.

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Follow existing code style and conventions**
4. **Add appropriate tests**
5. **Update documentation as needed**
6. **Submit a pull request**

## Support

For issues and questions:
1. Check this README and troubleshooting section
2. Review browser console for errors
3. Verify backend server status
4. Create an issue in the project repository

---

**Note**: This application requires the Miso backend server to be running. See the [backend README](../miso/README.md) for setup instructions.