# AI Customer Support Intelligence Platform

## 📋 Documentation

A comprehensive Gmail-like customer support platform with AI-powered features including message classification, sentiment analysis, conversation summarization, and response suggestions.

---

## 🏗️ Project Structure

```
ai-customer-support-intelligence-platform/
├── apps/                           # Aplikasi Utama
│   ├── api/                        # Backend Server (Node.js + Express)
│   │   ├── config/                 # Konfigurasi Koneksi Eksternal
│   │   │   ├── gemini.js          # Setup Google Gemini AI
│   │   │   └── supabaseClient.js  # Setup Supabase Database
│   │   │
│   │   ├── controllers/            # Logika Bisnis (Otak Aplikasi)
│   │   │   ├── authController.js  # Logic Login/Register/Logout
│   │   │   ├── dashboardController.js # Logic Statistik & Analytics (BARU)
│   │   │   └── messageController.js   # Logic Inbox, Reply, & Assign Ticket
│   │   │
│   │   ├── middleware/             # Satpam & Filter
│   │   │   ├── authMiddleware.js  # Cek Token & Role (Agent vs Lead)
│   │   │   └── rateLimiter.js     # Batasi Spam (Anti-Abuse)
│   │   │
│   │   ├── routes/                 # Pintu Masuk URL (API Endpoints)
│   │   │   ├── authRoutes.js      # /api/auth/...
│   │   │   ├── dashboardRoutes.js # /api/dashboard/... (BARU)
│   │   │   └── messageRoutes.js   # /api/messages/...
│   │   │
│   │   ├── services/               # Layanan Khusus
│   │   │   └── aiService.js       # Fungsi untuk ngobrol sama AI
│   │   │
│   │   ├── index.js                # File Utama (Server Launcher)
│   │   ├── package.json            # Daftar Dependencies
│   │   └── README.md               # Dokumentasi
│   │
│   └── web/                        # Frontend Application (Next.js)
│       ├── src/
│       │   ├── app/                # Next.js App Router pages
│       │   │   ├── layout.tsx     # Root layout with ThemeProvider
│       │   │   ├── page.tsx       # Main inbox page
│       │   │   ├── help/
│       │   │   │   └── page.tsx   # Help & IT Support page
│       │   │   └── settings/
│       │   │       └── page.tsx   # Settings page (theme, etc.)
│       │   │
│       │   ├── components/         # React components
│       │   │   ├── icons/
│       │   │   │   └── Icons.tsx  # SVG icon components
│       │   │   ├── inbox/
│       │   │   │   ├── AISummaryPanel.tsx        # AI-generated summary display
│       │   │   │   ├── AIResponseSuggestion.tsx  # AI response suggestion panel
│       │   │   │   ├── MessageDetail.tsx         # Full message view
│       │   │   │   ├── MessageList.tsx           # Inbox message list
│       │   │   │   └── MessageListItem.tsx       # Individual message row
│       │   │   ├── layout/
│       │   │   │   └── Sidebar.tsx # Main navigation sidebar
│       │   │   └── ui/
│       │   │       ├── CategoryTag.tsx    # Issue category badge
│       │   │       ├── LoadingSpinner.tsx # Loading states
│       │   │       ├── PriorityBadge.tsx  # Priority level badge
│       │   │       ├── SentimentBadge.tsx # Sentiment indicator
│       │   │       └── StatusBadge.tsx    # Ticket status badge
│       │   │
│       │   ├── context/
│       │   │   └── ThemeContext.tsx # Dark/light mode context
│       │   │
│       │   ├── lib/
│       │   │   └── api.ts          # API utility functions
│       │   │
│       │   ├── styles/
│       │   │   └── globals.css    # Global styles and Tailwind config
│       │   │
│       │   └── types/
│       │       └── index.ts        # TypeScript type definitions
│       │
│       ├── public/                 # Static assets
│       ├── package.json            # Frontend dependencies
│       └── tsconfig.json           # TypeScript configuration
│
└── README.md                       # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation & Running

#### 1. Backend Setup

```bash
cd Backend
npm install
npm start
```

The backend will run on `http://localhost:4000`

#### 2. Frontend Setup

```bash
cd Frontend/ai-frontend-gdg
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

---

## 📡 API Documentation

### Base URL

```
http://localhost:4000
```

### Endpoints

#### Health Check

```
GET /
```

Returns server status and available endpoints.

#### Get All Messages

```
GET /api/messages
```

Returns all customer messages for the inbox.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_name": "Budi Santoso",
      "customer_email": "budi.santoso@email.com",
      "subject": "Saldo tidak masuk",
      "preview": "Saya sudah topup 50rb...",
      "timestamp": "2024-01-04T09:30:00",
      "status": "Open",
      "category": "Billing",
      "sentiment": "Negative",
      "priority": "High",
      "isRead": false,
      "conversation": [...]
    }
  ],
  "total": 7
}
```

#### Get Message Detail

```
GET /api/messages/:id
```

Returns full message with conversation history.

#### Get AI Summary

```
GET /api/messages/:id/summary
```

Returns AI-generated summary of the conversation.

**Response:**

```json
{
  "success": true,
  "data": {
    "keyPoints": [
      "Customer topped up Rp 50,000 but balance shows 0",
      "Customer has proof of transfer",
      "Urgent - needed for important transaction"
    ],
    "customerIntent": "The customer wants their top-up to be credited...",
    "suggestedAction": "Verify the transaction in the payment system...",
    "urgencyLevel": "High"
  }
}
```

#### Get AI Response Suggestion

```
GET /api/messages/:id/suggest-response
```

Returns AI-generated empathetic response suggestion.

**Response:**

```json
{
  "success": true,
  "data": {
    "suggestion": "Dear Budi Santoso,\n\nThank you for reaching out...",
    "tone": "empathetic",
    "confidence": 0.94
  }
}
```

#### Send Reply

```
POST /api/messages/:id/reply
Content-Type: application/json

{
  "content": "Your reply message here..."
}
```

#### Mark as Read

```
PATCH /api/messages/:id/read
```

#### Update Status

```
PATCH /api/messages/:id/status
Content-Type: application/json

{
  "status": "In Progress" // or "Open", "Closed"
}
```

---

## 🎨 Component Documentation

### Core Components

#### `Sidebar.tsx`

Main navigation sidebar component.

**Props:**

- `isOpen: boolean` - Controls mobile sidebar visibility
- `onToggle: () => void` - Toggle sidebar callback
- `unreadCount: number` - Badge count for unread messages

#### `MessageList.tsx`

Container for inbox message list with search and filtering.

**Props:**

- `messages: Message[]` - Array of messages to display
- `selectedMessageId: number | null` - Currently selected message
- `onSelectMessage: (id: number) => void` - Selection callback
- `onRefresh: () => void` - Refresh callback
- `isLoading: boolean` - Loading state

#### `MessageDetail.tsx`

Full message view with conversation, AI summary, and reply composer.

**Props:**

- `message: Message | null` - Message to display
- `onBack: () => void` - Mobile back navigation callback
- `isLoading: boolean` - Loading state

#### `AISummaryPanel.tsx`

Displays AI-generated conversation summary.

**Props:**

- `summary: AISummary | null` - Summary data
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message

#### `AIResponseSuggestionPanel.tsx`

Shows AI-generated response suggestion with copy/use actions.

**Props:**

- `suggestion: AIResponseSuggestion | null` - Suggestion data
- `isLoading: boolean` - Loading state
- `onUseSuggestion: (text: string) => void` - Use suggestion callback

### UI Components

#### `PriorityBadge.tsx`

Displays priority level (High/Medium/Low) with appropriate colors.

#### `SentimentBadge.tsx`

Shows customer sentiment (Positive/Neutral/Negative) with emoji.

#### `CategoryTag.tsx`

Displays issue category (Billing/Technical/General/Account/Feature Request).

#### `StatusBadge.tsx`

Shows ticket status (Open/In Progress/Closed).

#### `LoadingSpinner.tsx`

Animated loading spinner in various sizes.

---

## 🎯 Type Definitions

### Message

```typescript
interface Message {
  id: number;
  customer_name: string;
  customer_email: string;
  subject: string;
  preview: string;
  timestamp: string;
  status: "Open" | "In Progress" | "Closed";
  category: "Billing" | "Technical" | "General" | "Account" | "Feature Request";
  sentiment: "Positive" | "Neutral" | "Negative";
  priority: "High" | "Medium" | "Low";
  conversation: ConversationMessage[];
  isRead: boolean;
}
```

### AISummary

```typescript
interface AISummary {
  keyPoints: string[];
  customerIntent: string;
  suggestedAction: string;
  urgencyLevel: "High" | "Medium" | "Low";
}
```

### AIResponseSuggestion

```typescript
interface AIResponseSuggestion {
  suggestion: string;
  tone: "empathetic" | "professional" | "friendly";
  confidence: number; // 0-1
}
```

---

## 🌙 Theme System

The application supports three theme modes:

- **Light** - Light background with dark text
- **Dark** - Dark background with light text
- **System** - Follows device/OS preference

Theme is persisted in localStorage under key `ai-support-theme`.

### Using Theme in Components

```typescript
import { useTheme } from "@/context/ThemeContext";

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  // theme: 'light' | 'dark' | 'system'
  // resolvedTheme: 'light' | 'dark' (actual applied theme)
}
```

---

## 🔄 State Management

The application uses React's built-in state management:

1. **Global State** - Theme (via Context API)
2. **Page State** - Messages, selected message, loading states (via useState)
3. **Component State** - Local UI state (search, filters, etc.)

---

## 📱 Responsive Design

The application is fully responsive:

- **Mobile (< 1024px)**:

  - Collapsible sidebar
  - Full-screen message list OR detail view
  - Mobile header with menu toggle

- **Desktop (≥ 1024px)**:
  - Fixed sidebar
  - Side-by-side message list and detail view

---

## 🛠️ Development Notes

### Mock Data

The frontend includes fallback mock data that activates when the backend is unavailable. This allows frontend development without the backend running.

### Error Handling

- API calls are wrapped in try-catch blocks
- Fallback to mock data on error
- User-friendly error messages in UI

### Performance

- Messages loaded once on mount
- Selected message details loaded on demand
- AI features loaded asynchronously

---

## 📝 Key Features Checklist

- [x] Gmail-like inbox interface
- [x] Message list with search and filtering
- [x] Priority badges (High/Medium/Low)
- [x] Sentiment indicators (Positive/Neutral/Negative)
- [x] AI-classified categories
- [x] Conversation view
- [x] AI-generated summaries
- [x] AI response suggestions
- [x] Reply composer
- [x] Dark/Light theme toggle
- [x] Help & IT Support page
- [x] Settings page
- [x] Mobile responsive design
- [x] Comprehensive API backend

---

## 🤝 Contributing

1. Follow the existing code style
2. Add JSDoc comments to new functions
3. Update this documentation for new features
4. Test on both mobile and desktop

---

## 📄 License

This project is for educational purposes as part of the GDG AI project.
