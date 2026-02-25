# EquationEdge - Dual-Purpose Math Tutoring Website

A sophisticated dual-purpose website that appears to be a legitimate math tutoring platform but contains hidden advanced features accessible through secret access methods.

## 🎓 Public Features

- **Professional Homepage**: Hero section with feature highlights and call-to-action buttons
- **Navigation**: Links to Lessons, Practice, About, and Contact sections
- **Lessons Page**: Math subject categories (Algebra, Geometry, Calculus, Statistics, Trigonometry, Pre-Calculus)
- **Practice Section**: Interactive problem sets with instant feedback
- **About Page**: Mission statement and credibility information
- **Responsive Design**: Mobile-friendly layout for all screen sizes
- **Professional Branding**: Clean, modern design with EquationEdge branding

## 🔐 Secret Features

### Access Methods

**Method 1: Secret Login**
- Navigate to the login form (triggered via the hidden login modal)
- Username: `admin`
- Password: `secret123`

**Method 2: Konami Code Sequence**
- Press the following keys in order: ↑ ↑ ↓ ↓ ← → ← → B A
- This automatically opens the secret panel

### Secret Panel Features

**AI Chat Interface**
- Message input with send button
- Image upload capability (drag-and-drop and file picker)
- Free LLM-powered responses for math problems
- Step-by-step solution generation
- Markdown rendering for formatted responses
- Chat history management
- Loading states and error handling

**Web Proxy**
- URL input field for proxy requests
- Access any website through the proxy
- Iframe-based content display
- Error handling for failed requests
- Session management

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express 4 + tRPC 11
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth (built-in)
- **UI Components**: shadcn/ui with Radix UI
- **Testing**: Vitest
- **Build Tool**: Vite

## 📦 Project Structure

```
equation-edge/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (SecretContext)
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities (tRPC client)
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   └── index.html         # HTML template
├── server/                # Backend Express application
│   ├── routers/           # tRPC routers
│   │   └── secret.ts      # Secret panel API routes
│   ├── db.ts              # Database queries
│   ├── routers.ts         # Main router
│   └── _core/             # Core server utilities
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Table definitions
├── shared/                # Shared types and constants
├── storage/               # S3 storage helpers
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
└── vitest.config.ts       # Vitest config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 22.13.0 or higher
- pnpm 10.4.1 or higher
- MySQL/TiDB database

### Installation

1. **Extract the ZIP file**
   ```bash
   unzip equation-edge.zip
   cd equation-edge
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   VITE_APP_ID=your_app_id
   OAUTH_SERVER_URL=your_oauth_url
   VITE_OAUTH_PORTAL_URL=your_oauth_portal_url
   ```

4. **Push database schema**
   ```bash
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## 🧪 Testing

Run all tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm format` - Format code with Prettier
- `pnpm check` - Run TypeScript type checking
- `pnpm db:push` - Push database migrations

## 🔑 Secret Credentials

**Default Secret Login:**
- Username: `admin`
- Password: `secret123`

**Konami Code:**
- Arrow Up × 2
- Arrow Down × 2
- Arrow Left
- Arrow Right
- Arrow Left
- Arrow Right
- B
- A

## 📊 Database Schema

### Users Table
- Stores user information and authentication data
- Fields: id, openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn

### Chat History Table
- Stores chat messages and image URLs
- Fields: id, userId, role, content, imageUrl, createdAt

### Secret Sessions Table
- Tracks active secret panel sessions
- Fields: id, userId, sessionToken, isActive, createdAt, expiresAt

## 🔒 Security Features

- Session-based authentication with 24-hour token expiration
- Input validation and sanitization
- Protected tRPC procedures
- CORS configuration
- Secure cookie handling
- Role-based access control (admin/user)

## 🎨 Design Features

- Smooth animations for secret panel reveal
- Professional color scheme (blue/slate/purple)
- Responsive grid layouts
- Loading states and spinners
- Toast notifications for user feedback
- Accessible UI with ARIA labels
- Keyboard navigation support

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

The project is configured for deployment on Manus platform. To deploy:

1. Create a checkpoint in the Manus dashboard
2. Click the Publish button
3. Configure custom domain (optional)

For GitHub Pages deployment:
1. Build the project: `pnpm build`
2. Push to GitHub repository
3. Enable GitHub Pages in repository settings
4. Select the `dist` folder as the source

## 📚 API Routes

### Secret Router (`/api/trpc/secret.*`)

**Login**
- `POST /api/trpc/secret.login`
- Input: `{ username: string, password: string }`
- Returns: `{ sessionToken: string, expiresAt: Date }`

**Chat**
- `POST /api/trpc/secret.chat`
- Input: `{ message: string, sessionToken: string, imageUrl?: string }`
- Returns: `{ response: string }`

**Proxy**
- `POST /api/trpc/secret.proxy`
- Input: `{ url: string, sessionToken: string }`
- Returns: `{ content: string }`

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🎯 Future Enhancements

- Integrate advanced LLM APIs for better math problem solving
- Add more interactive lesson content
- Implement real-time collaboration features
- Add video tutorials
- Create mobile app version
- Add user progress tracking
- Implement payment system for premium features

## 📞 Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Built with ❤️ using React, Express, and TypeScript**
