# AI Customer Support Intelligence Platform

## Documentation

A comprehensive Gmail-like customer support platform with AI-powered features including message classification, sentiment analysis, conversation summarization, response suggestions, role-based access control, and analytics dashboard.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [System Requirements](#system-requirements)
- [Installation and Configuration](#installation-and-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Component Documentation](#component-documentation)
- [Type Definitions](#type-definitions)
- [Theme System](#theme-system)
- [State Management](#state-management)
- [Responsive Design](#responsive-design)
- [Key Features](#key-features)
- [Development Notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

The AI Customer Support Intelligence Platform is a full-stack application designed to revolutionize customer support operations through artificial intelligence integration. The platform provides automated message analysis, intelligent ticket routing, sentiment detection, and contextual response suggestions to enhance agent productivity and customer satisfaction.

### Core Capabilities

- **Automated Message Classification**: AI-powered categorization of incoming messages
- **Sentiment Analysis**: Real-time detection of customer emotions and urgency
- **Intelligent Prioritization**: Automatic priority assignment based on content analysis
- **Conversation Summarization**: AI-generated summaries of customer interactions
- **Response Suggestions**: Context-aware reply recommendations
- **Role-Based Access Control**: Separate permissions for Agents and Team Leads
- **Analytics Dashboard**: Comprehensive statistics and performance metrics
- **Secure Authentication**: JWT-based authentication system

---

## Technology Stack

### Backend Technologies

- **Runtime Environment**: Node.js v18.0.0+
- **Web Framework**: Express.js
- **Database**: Supabase (PostgreSQL Database-as-a-Service)
- **Artificial Intelligence**: Google Gemini AI (via Google Generative AI SDK)
- **Authentication**: JWT (JSON Web Tokens)
- **Environment Management**: Dotenv
- **Development Tools**: Nodemon

### Frontend Technologies

- **Framework**: Next.js 14+ (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **UI Components**: Custom component library

---

## Project Structure
```
ai-customer-support-intelligence-platform/
├── apps/                              # Main Applications
│   ├── api/                           # Backend Server (Node.js + Express)
│   │   ├── config/                    # External Service Configuration
│   │   │   ├── gemini.js             # Google Gemini AI Setup
│   │   │   └── supabaseClient.js     # Supabase Database Setup
│   │   │
│   │   ├── controllers/               # Business Logic Layer
│   │   │   ├── authController.js     # Authentication Logic (Login/Register/Logout)
│   │   │   ├── dashboardController.js # Statistics & Analytics Logic
│   │   │   └── messageController.js   # Message Management & Ticket Assignment
│   │   │
│   │   ├── middleware/                # Request Processing Layer
│   │   │   ├── authMiddleware.js     # Token Verification & Role Authorization
│   │   │   └── rateLimiter.js        # API Rate Limiting & Abuse Prevention
│   │   │
│   │   ├── routes/                    # API Endpoint Definitions
│   │   │   ├── authRoutes.js         # /api/auth/* endpoints
│   │   │   ├── dashboardRoutes.js    # /api/dashboard/* endpoints
│   │   │   └── messageRoutes.js      # /api/messages/* endpoints
│   │   │
│   │   ├── services/                  # Specialized Services
│   │   │   └── aiService.js          # AI Integration Functions
│   │   │
│   │   ├── .env                       # Environment Variables (not in repository)
│   │   ├── .env.example              # Environment Variables Template
│   │   ├── index.js                   # Application Entry Point
│   │   ├── package.json               # Backend Dependencies
│   │   └── README.md                  # Backend Documentation
│   │
│   └── web/                           # Frontend Application (Next.js)
│       ├── src/
│       │   ├── app/                   # Next.js App Router Pages
│       │   │   ├── layout.tsx        # Root Layout with ThemeProvider
│       │   │   ├── page.tsx          # Main Inbox Page
│       │   │   ├── help/
│       │   │   │   └── page.tsx      # Help & IT Support Page
│       │   │   └── settings/
│       │   │       └── page.tsx      # Settings Page (Theme Configuration)
│       │   │
│       │   ├── components/            # React Components
│       │   │   ├── icons/
│       │   │   │   └── Icons.tsx     # SVG Icon Components
│       │   │   ├── inbox/
│       │   │   │   ├── AISummaryPanel.tsx        # AI Summary Display
│       │   │   │   ├── AIResponseSuggestion.tsx  # AI Response Suggestion Panel
│       │   │   │   ├── MessageDetail.tsx         # Full Message View
│       │   │   │   ├── MessageList.tsx           # Inbox Message List
│       │   │   │   └── MessageListItem.tsx       # Individual Message Row
│       │   │   ├── layout/
│       │   │   │   └── Sidebar.tsx   # Main Navigation Sidebar
│       │   │   └── ui/
│       │   │       ├── CategoryTag.tsx    # Issue Category Badge
│       │   │       ├── LoadingSpinner.tsx # Loading State Component
│       │   │       ├── PriorityBadge.tsx  # Priority Level Badge
│       │   │       ├── SentimentBadge.tsx # Sentiment Indicator
│       │   │       └── StatusBadge.tsx    # Ticket Status Badge
│       │   │
│       │   ├── context/
│       │   │   └── ThemeContext.tsx  # Dark/Light Mode Context
│       │   │
│       │   ├── lib/
│       │   │   └── api.ts            # API Utility Functions
│       │   │
│       │   ├── styles/
│       │   │   └── globals.css       # Global Styles and Tailwind Configuration
│       │   │
│       │   └── types/
│       │       └── index.ts          # TypeScript Type Definitions
│       │
│       ├── public/                    # Static Assets
│       ├── .env.local                 # Frontend Environment Variables
│       ├── package.json               # Frontend Dependencies
│       ├── tsconfig.json              # TypeScript Configuration
│       └── next.config.js             # Next.js Configuration
│
├── .gitignore                         # Git Ignore Configuration
└── README.md                          # Project Documentation (This File)
```

---

## System Requirements

Before running this project, ensure your system meets the following requirements:

- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **NPM**: Version 8.0.0 or higher (installed alongside Node.js)
- **Git**: Version control system for repository management
- **Supabase Account**: Active project with valid URL and API Key
- **Google AI Studio API Key**: Valid API key with access to Gemini models
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+ recommended)
- **RAM**: Minimum 4GB available memory
- **Storage**: At least 1GB free disk space

---

## Installation and Configuration

### Step 1: Clone Repository

Download the source code from the repository:
```bash
git clone <repository-url>
cd ai-customer-support-intelligence-platform
```

### Step 2: Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd apps/api
npm install
```

### Step 3: Backend Environment Configuration

Create a `.env` file in the `apps/api` directory. This file contains sensitive credentials required for the backend to function.

**Template `.env` file:**
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Supabase Configuration (Database & Authentication)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Google AI Configuration (Gemini Model)
GEMINI_API_KEY=your-google-ai-studio-api-key

# Security Configuration (JWT Authentication)
JWT_SECRET=your_very_long_and_secure_random_string_minimum_32_characters
JWT_EXPIRATION=24h

# Optional: CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

**How to Obtain Required Credentials:**

1. **Supabase Credentials**:
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Navigate to Project Settings > API
   - Copy `SUPABASE_URL` and `SUPABASE_KEY` (anon/public key)
   - Copy `SUPABASE_SERVICE_KEY` (service_role key) for admin operations

2. **Google Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the generated key to `GEMINI_API_KEY`

3. **JWT Secret**:
   - Generate a secure random string (minimum 32 characters)
   - Use online generators or run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**Security Warning**: Never commit the `.env` file to version control. Ensure it is listed in `.gitignore`.

### Step 4: Database Schema Setup

Ensure your Supabase project has the required database tables:

**Required Tables:**
- `messages`: Stores customer messages and AI analysis results
- `users`: Manages agent and lead user accounts
- `auth.users`: Supabase authentication table (created automatically)

**Database Schema Notes:**
- The `messages` table should include columns for: `id`, `customer_name`, `customer_email`, `subject`, `content`, `category`, `sentiment`, `priority`, `status`, `ai_summary`, `ai_suggested_reply`, `assigned_to`, `created_at`, `updated_at`
- The `users` table should include: `id`, `email`, `full_name`, `role` (agent/lead), `created_at`
- Enable Row Level Security (RLS) policies for data protection

### Step 5: Frontend Setup

Navigate to the frontend directory and install dependencies:
```bash
cd ../web
npm install
```

### Step 6: Frontend Environment Configuration

Create a `.env.local` file in the `apps/web` directory:
```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Optional: Frontend-specific Configuration
NEXT_PUBLIC_APP_NAME=AI Customer Support Platform
```

---

## Running the Application

### Starting the Backend Server

From the `apps/api` directory:

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The backend will be available at `http://localhost:4000`

**Verify Backend is Running**:
```bash
curl http://localhost:4000/
```

Expected response:
```json
{
  "message": "AI Customer Support Backend API",
  "status": "active",
  "version": "1.0.0"
}
```

### Starting the Frontend Application

From the `apps/web` directory:

**Development Mode**:
```bash
npm run dev
```

**Production Build**:
```bash
npm run build
npm start
```

The frontend will be available at `http://localhost:3000`

### Running Both Simultaneously

**Option 1: Using separate terminals**
- Terminal 1: `cd apps/api && npm run dev`
- Terminal 2: `cd apps/web && npm run dev`

**Option 2: Using a process manager** (e.g., concurrently, PM2)
```bash
npm install -g concurrently
concurrently "cd apps/api && npm run dev" "cd apps/web && npm run dev"
```

---

## API Documentation

### Base URL
```
http://localhost:4000/api
```

### Complete API Reference

For comprehensive API documentation with interactive examples, request/response schemas, and testing capabilities, refer to the official Postman collection:

**Postman Documentation**: [https://documenter.getpostman.com/view/50299653/2sBXVo8Sjs](https://documenter.getpostman.com/view/50299653/2sBXVo8Sjs)

### Authentication Endpoints

#### User Login

Authenticates a user and returns a JWT token.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "agent@example.com",
  "password": "secure_password"
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "email": "agent@example.com",
    "full_name": "John Doe",
    "role": "agent"
  }
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

#### User Registration

Creates a new user account (Agent or Lead role).

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "newagent@example.com",
  "password": "secure_password_123",
  "full_name": "Jane Smith",
  "role": "agent"
}
```

**Valid Roles**:
- `agent`: Regular support agent with ticket management permissions
- `lead`: Team lead with full access including analytics dashboard

**Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid-string",
    "email": "newagent@example.com",
    "full_name": "Jane Smith",
    "role": "agent"
  }
}
```

### Message Management Endpoints

**Authentication Required**: All message endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get All Messages (Inbox)

Retrieves all customer messages for the inbox view.

**Endpoint**: `GET /api/messages`

**Query Parameters** (Optional):
- `status`: Filter by status (open, in_progress, closed)
- `priority`: Filter by priority (high, medium, low)
- `page`: Page number for pagination
- `limit`: Items per page

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_name": "Budi Santoso",
      "customer_email": "budi.santoso@email.com",
      "subject": "Balance not credited",
      "preview": "I topped up 50k but...",
      "timestamp": "2024-01-04T09:30:00Z",
      "status": "open",
      "category": "Billing",
      "sentiment": "Negative",
      "priority": "High",
      "isRead": false,
      "assigned_to": null
    }
  ],
  "total": 7
}
```

#### Get Message Detail

Retrieves full message details including conversation history and AI analysis.

**Endpoint**: `GET /api/messages/:id`

**URL Parameters**:
- `id` (integer, required): Message identifier

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "customer_name": "Budi Santoso",
    "customer_email": "budi.santoso@email.com",
    "subject": "Balance not credited",
    "content": "I topped up 50k but my balance still shows 0...",
    "category": "Billing",
    "sentiment": "Negative",
    "priority": "High",
    "status": "open",
    "ai_summary": "Customer experiencing balance crediting issue after top-up",
    "ai_suggested_reply": "Dear Budi, we apologize for the inconvenience...",
    "conversation": [
      {
        "id": 1,
        "sender": "customer",
        "content": "I topped up 50k but my balance still shows 0",
        "timestamp": "2024-01-04T09:30:00Z"
      }
    ],
    "assigned_to": null,
    "created_at": "2024-01-04T09:30:00Z",
    "updated_at": "2024-01-04T09:30:00Z"
  }
}
```

#### Get AI Summary

Retrieves AI-generated conversation summary with key points and suggested actions.

**Endpoint**: `GET /api/messages/:id/summary`

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "keyPoints": [
      "Customer topped up Rp 50,000 but balance shows 0",
      "Customer has proof of transfer",
      "Urgent - needed for important transaction"
    ],
    "customerIntent": "The customer wants their top-up to be credited immediately",
    "suggestedAction": "Verify the transaction in the payment system and credit manually if confirmed",
    "urgencyLevel": "High"
  }
}
```

#### Get AI Response Suggestion

Returns AI-generated empathetic response recommendation.

**Endpoint**: `GET /api/messages/:id/suggest-response`

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "suggestion": "Dear Budi Santoso,\n\nThank you for reaching out to us. I sincerely apologize for the inconvenience...",
    "tone": "empathetic",
    "confidence": 0.94
  }
}
```

#### Create New Message

Creates a new customer message (used for simulation or API integration).

**Endpoint**: `POST /api/messages`

**Request Body**:
```json
{
  "customer_name": "Rara Sekar",
  "customer_email": "rara@example.com",
  "subject": "Internet Connection Down",
  "content": "My home internet has been down since this morning"
}
```

**Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Message received and queued for AI analysis",
  "data": {
    "id": 25,
    "customer_name": "Rara Sekar",
    "subject": "Internet Connection Down",
    "status": "open",
    "created_at": "2024-01-10T10:15:00Z"
  }
}
```

**Note**: AI analysis (category, sentiment, priority, summary) is processed asynchronously and will be available within 2-5 seconds.

#### Send Reply to Customer

Sends agent reply and updates ticket status.

**Endpoint**: `POST /api/messages/:id/reply`

**Request Body**:
```json
{
  "content": "Your reply message here..."
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Reply sent successfully",
  "data": {
    "id": 25,
    "status": "closed",
    "replied_at": "2024-01-10T11:00:00Z"
  }
}
```

#### Mark Message as Read

Updates the read status of a message.

**Endpoint**: `PATCH /api/messages/:id/read`

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Message marked as read"
}
```

#### Update Message Status

Manually updates ticket status without sending a reply.

**Endpoint**: `PATCH /api/messages/:id/status`

**Request Body**:
```json
{
  "status": "in_progress"
}
```

**Valid Status Values**:
- `open`: Initial state for new messages
- `in_progress`: Agent is actively working on the issue
- `closed`: Issue resolved or reply sent

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "id": 25,
    "status": "in_progress",
    "updated_at": "2024-01-10T11:30:00Z"
  }
}
```

### Dashboard Analytics Endpoints

**Authorization Required**: Lead role only. Agent role users will receive 403 Forbidden.

#### Get Dashboard Statistics

Retrieves comprehensive analytics and performance metrics.

**Endpoint**: `GET /api/dashboard/stats`

**Request Headers**:
```
Authorization: Bearer <jwt-token-lead>
```

**Query Parameters** (Optional):
- `period`: Time period (today, week, month, year, all)
- `agent_id`: Filter by specific agent

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "total_tickets": 150,
    "status_breakdown": {
      "open": 45,
      "in_progress": 30,
      "closed": 75
    },
    "sentiment_breakdown": {
      "positive": 60,
      "neutral": 50,
      "negative": 40
    },
    "priority_breakdown": {
      "high": 30,
      "medium": 70,
      "low": 50
    },
    "category_breakdown": {
      "Technical Support": 55,
      "Billing": 35,
      "General": 40,
      "Account": 20
    },
    "agent_performance": [
      {
        "agent_id": "uuid-1",
        "agent_name": "John Doe",
        "total_handled": 35,
        "avg_response_time": "2.5 hours",
        "resolution_rate": "94%"
      }
    ]
  },
  "generated_at": "2024-01-10T12:00:00Z"
}
```

**Error Response (403 Forbidden)**:
```json
{
  "success": false,
  "error": "Access denied. Lead role required."
}
```

### Ticket Assignment Endpoints

#### Assign Ticket to Self

Allows an agent to claim an unassigned ticket.

**Endpoint**: `POST /api/messages/:id/assign`

**Request Headers**:
```
Authorization: Bearer <jwt-token-agent>
```

**Request Body** (Empty for self-assignment):
```json
{}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Ticket assigned successfully",
  "data": {
    "id": 25,
    "assigned_to": {
      "id": "agent-uuid",
      "full_name": "John Doe"
    }
  }
}
```

#### Assign Ticket to Another Agent (Lead Only)

Allows a lead to assign a ticket to a specific agent.

**Endpoint**: `POST /api/messages/:id/assign`

**Request Headers**:
```
Authorization: Bearer <jwt-token-lead>
Content-Type: application/json
```

**Request Body**:
```json
{
  "agent_id": "uuid-of-target-agent"
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Ticket assigned to agent successfully",
  "data": {
    "id": 25,
    "assigned_to": {
      "id": "target-agent-uuid",
      "full_name": "Jane Smith"
    }
  }
}
```

#### Unassign Ticket

Removes the current assignment from a ticket.

**Endpoint**: `POST /api/messages/:id/unassign`

**Request Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Ticket unassigned successfully",
  "data": {
    "id": 25,
    "assigned_to": null
  }
}
```

### Health Check Endpoint

#### Server Status

Returns server health and available endpoints.

**Endpoint**: `GET /`

**Success Response (200 OK)**:
```json
{
  "message": "AI Customer Support Backend API",
  "status": "active",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "messages": "/api/messages",
    "dashboard": "/api/dashboard"
  }
}
```

---

## Component Documentation

### Core Components

#### Sidebar Component

**File**: `src/components/layout/Sidebar.tsx`

Main navigation sidebar for the application.

**Props**:
```typescript
interface SidebarProps {
  isOpen: boolean;           // Controls mobile sidebar visibility
  onToggle: () => void;      // Toggle sidebar callback
  unreadCount: number;       // Badge count for unread messages
}
```

**Features**:
- Responsive design (collapsible on mobile)
- Unread message counter badge
- Active route highlighting
- Theme toggle integration

#### MessageList Component

**File**: `src/components/inbox/MessageList.tsx`

Container for inbox message list with search and filtering capabilities.

**Props**:
```typescript
interface MessageListProps {
  messages: Message[];                    // Array of messages to display
  selectedMessageId: number | null;       // Currently selected message ID
  onSelectMessage: (id: number) => void;  // Message selection callback
  onRefresh: () => void;                  // Refresh messages callback
  isLoading: boolean;                     // Loading state indicator
}
```

**Features**:
- Search functionality
- Status and priority filtering
- Sort options (newest, oldest, priority)
- Infinite scroll support (if implemented)
- Empty state handling

#### MessageDetail Component

**File**: `src/components/inbox/MessageDetail.tsx`

Full message view with conversation thread, AI analysis, and reply composer.

**Props**:
```typescript
interface MessageDetailProps {
  message: Message | null;    // Message object to display
  onBack: () => void;         // Mobile back navigation callback
  isLoading: boolean;         // Loading state indicator
}
```

**Features**:
- Conversation thread display
- AI summary panel integration
- AI response suggestion integration
- Reply composer with draft saving
- Status update controls
- Ticket assignment controls

#### AISummaryPanel Component

**File**: `src/components/inbox/AISummaryPanel.tsx`

Displays AI-generated conversation summary with key insights.

**Props**:
```typescript
interface AISummaryPanelProps {
  summary: AISummary | null;  // Summary data object
  isLoading: boolean;         // Loading state indicator
  error: string | null;       // Error message if fetch failed
}
```

**Features**:
- Key points list
- Customer intent analysis
- Suggested action items
- Urgency level indicator
- Collapsible panel

#### AIResponseSuggestionPanel Component

**File**: `src/components/inbox/AIResponseSuggestion.tsx`

Shows AI-generated response suggestion with copy and use actions.

**Props**:
```typescript
interface AIResponseSuggestionPanelProps {
  suggestion: AIResponseSuggestion | null;  // Suggestion data
  isLoading: boolean;                       // Loading state
  onUseSuggestion: (text: string) => void;  // Use suggestion callback
}
```

**Features**:
- Formatted suggestion display
- Copy to clipboard functionality
- One-click use in reply composer
- Confidence score indicator
- Tone indicator (empathetic/professional/friendly)

### UI Components

#### PriorityBadge Component

**File**: `src/components/ui/PriorityBadge.tsx`

Displays priority level with appropriate color coding.

**Props**:
```typescript
interface PriorityBadgeProps {
  priority: 'High' | 'Medium' | 'Low';
  size?: 'sm' | 'md' | 'lg';
}
```

**Color Scheme**:
- High: Red (#DC2626)
- Medium: Orange (#F59E0B)
- Low: Green (#10B981)

#### SentimentBadge Component

**File**: `src/components/ui/SentimentBadge.tsx`

Shows customer sentiment with emoji indicator.

**Props**:
```typescript
interface SentimentBadgeProps {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  showLabel?: boolean;
}
```

**Indicators**:
- Positive: Green with smile emoji
- Neutral: Gray with neutral emoji
- Negative: Red with frown emoji

#### CategoryTag Component

**File**: `src/components/ui/CategoryTag.tsx`

Displays issue category with consistent styling.

**Props**:
```typescript
interface CategoryTagProps {
  category: 'Billing' | 'Technical' | 'General' | 'Account' | 'Feature Request';
}
```

#### StatusBadge Component

**File**: `src/components/ui/StatusBadge.tsx`

Shows current ticket status.

**Props**:
```typescript
interface StatusBadgeProps {
  status: 'Open' | 'In Progress' | 'Closed';
}
```

**Color Scheme**:
- Open: Blue
- In Progress: Yellow
- Closed: Green

#### LoadingSpinner Component

**File**: `src/components/ui/LoadingSpinner.tsx`

Animated loading indicator.

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}
```

---

## Type Definitions

### Message Type

**File**: `src/types/index.ts`
```typescript
interface Message {
  id: number;
  customer_name: string;
  customer_email: string;
  subject: string;
  preview: string;
  timestamp: string;
  status: 'Open' | 'In Progress' | 'Closed';
  category: 'Billing' | 'Technical' | 'General' | 'Account' | 'Feature Request';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  priority: 'High' | 'Medium' | 'Low';
  conversation: ConversationMessage[];
  isRead: boolean;
  assigned_to: Agent | null;
  created_at: string;
  updated_at: string;
}
```

### ConversationMessage Type
```typescript
interface ConversationMessage {
  id: number;
  sender: 'customer' | 'agent';
  content: string;
  timestamp: string;
  agent_name?: string;
}
```

### AISummary Type
```typescript
interface AISummary {
  keyPoints: string[];
  customerIntent: string;
  suggestedAction: string;
  urgencyLevel: 'High' | 'Medium' | 'Low';
}
```

### AIResponseSuggestion Type
```typescript
interface AIResponseSuggestion {
  suggestion: string;
  tone: 'empathetic' | 'professional' | 'friendly';
  confidence: number; // 0-1 range
}
```

### User Type
```typescript
interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'agent' | 'lead';
  created_at: string;
}
```

### Agent Type
```typescript
interface Agent {
  id: string;
  full_name: string;
  email: string;
}
```

### DashboardStats Type
```typescript
interface DashboardStats {
  total_tickets: number;
  status_breakdown: {
    open: number;
    in_progress: number;
    closed: number;
  };
  sentiment_breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  priority_breakdown: {
    high: number;
    medium: number;
    low: number;
  };
  category_breakdown: {
    [key: string]: number;
  };
  agent_performance: AgentPerformance[];
}
```

---

## Theme System

The application supports three theme modes with persistent storage.

### Available Themes

1. **Light Mode**: Light background with dark text for daytime use
2. **Dark Mode**: Dark background with light text for reduced eye strain
3. **System Mode**: Automatically follows device/OS theme preference

### Theme Persistence

Theme preference is stored in browser localStorage under the key `ai-support-theme`.

### Using Theme in Components
```typescript
import { useTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  // theme: 'light' | 'dark' | 'system'
  // resolvedTheme: 'light' | 'dark' (actual applied theme)
  
  return (
    <button onClick={() => setTheme('dark')}>
      Switch to Dark Mode
    </button>
  );
}
```

### Theme Context API

**File**: `src/context/ThemeContext.tsx`
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}
```

---

## State Management

The application uses React's built-in state management patterns:

### Global State (Context API)

- **Theme State**: Managed via ThemeContext for application-wide theme switching
- **Authentication State**: User login status and JWT token (if implemented)

### Page-Level State (useState)

- **Messages List**: Array of inbox messages
- **Selected Message**: Currently viewed message details
- **Loading States**: API call loading indicators
- **Error States**: API error messages

### Component-Level State

- **Search Query**: Inbox search input
- **Filter Options**: Status and priority filters
- **Sort Options**: Message sorting preferences
- **UI State**: Modal visibility, dropdown state, etc.

### API State Management

API calls are managed using:
- Fetch API with async/await
- Try-catch error handling
- Loading state management
- Fallback to mock data on error

---

## Responsive Design

The application implements a mobile-first responsive design strategy.

### Breakpoints

- **Mobile**: < 1024px
- **Desktop**: >= 1024px

### Mobile Behavior (< 1024px)

- **Sidebar**: Collapsible overlay with hamburger menu toggle
- **Message List**: Full-screen view with header
- **Message Detail**: Full-screen view with back button
- **Navigation**: Bottom tab bar or hamburger menu
- **Touch Optimizations**: Larger touch targets, swipe gestures

### Desktop Behavior (>= 1024px)

- **Sidebar**: Fixed left sidebar (always visible)
- **Message List**: Fixed width column (33% of screen)
- **Message Detail**: Flexible width main content area (67% of screen)
- **Split View**: Side-by-side message list and detail view
- **Hover States**: Rich hover interactions

### Responsive Utilities

The application uses Tailwind CSS responsive utilities:
- `hidden lg:block`: Show on desktop only
- `lg:hidden`: Show on mobile only
- `lg:w-1/3`: Different widths per breakpoint

---

## Key Features

### Automated Intelligence

- **AI-Powered Message Classification**: Automatic categorization of incoming messages into predefined categories
- **Sentiment Analysis**: Real-time detection of customer emotions (Positive, Neutral, Negative)
- **Priority Detection**: Intelligent prioritization based on content urgency and sentiment
- **Conversation Summarization**: AI-generated summaries highlighting key points and customer intent
- **Response Suggestions**: Context-aware, empathetic reply recommendations

### User Management & Security

- **Role-Based Access Control (RBAC)**: Separate permissions for Agent and Lead roles
  - **Agent Role**: Message management, ticket assignment, reply capabilities
  - **Lead Role**: Full agent permissions plus analytics dashboard access
- **Secure Authentication**: JWT-based authentication with token expiration
- **Session Management**: Persistent login sessions with token refresh
- **Password Security**: Encrypted password storage using bcrypt

### Dashboard & Analytics (Lead Only)

- **Comprehensive Statistics**: Total tickets, status breakdown, sentiment analysis
- **Agent Performance Tracking**: Individual agent metrics and KPIs
- **Trend Visualization**: Daily, weekly, monthly ticket trends
- **Category Distribution**: Issue type analytics for resource allocation
- **Real-Time Updates**: Live dashboard with automatic data refresh

### Message Management

- **Gmail-Like Inbox Interface**: Familiar email-style user experience
- **Advanced Search**: Full-text search across all message fields
- **Multi-Level Filtering**: Filter by status, priority, category, sentiment
- **Sorting Options**: Sort by newest, oldest, priority, or custom criteria
- **Read/Unread Status**: Visual indicators for message read status
- **Bulk Actions**: Select multiple messages for batch operations (if implemented)

### Ticket Workflow

- **Self-Assignment**: Agents can claim unassigned tickets
- **Lead Assignment**: Team leads can assign tickets to specific agents
- **Status Transitions**: Open -> In Progress -> Closed workflow
- **Reply Management**: Send replies directly from the interface
- **Conversation Threading**: Full conversation history in chronological order

### User Experience

- **Dark/Light Theme Toggle**: User preference with system theme support
- **Mobile Responsive Design**: Optimized for all screen sizes
- **Loading States**: Clear indicators during API calls
- **Error Handling**: User-friendly error messages with recovery options
- **Offline Support**: Fallback to mock data when backend is unavailable
- **Keyboard Shortcuts**: Efficient navigation for power users (if implemented)

### Developer Experience

- **Comprehensive API Backend**: Well-documented RESTful API
- **Type Safety**: Full TypeScript implementation in frontend
- **Modular Architecture**: Organized file structure for easy maintenance
- **Environment Configuration**: Flexible environment variable management
- **Mock Data Support**: Built-in mock data for development without backend

---

## Development Notes

### Mock Data

The frontend includes comprehensive fallback mock data that automatically activates when the backend is unavailable. This enables:
- Frontend development without running the backend
- UI testing without database dependencies
- Demo mode for presentations
- Resilient user experience during backend maintenance

**Mock Data Location**: `src/lib/mockData.ts` (if implemented)

### Error Handling Strategy

The application implements multiple layers of error handling:

1. **API Layer**: Try-catch blocks around all fetch calls
2. **Component Layer**: Error boundaries for React component errors
3. **User Feedback**: Toast notifications or inline error messages
4. **Graceful Degradation**: Fallback to mock data or offline mode
5. **Logging**: Console logging for debugging (development only)

### Performance Optimization

- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Separate bundles for different routes
- **Memoization**: React.memo for expensive components
- **Debounced Search**: Search input with debounce to reduce API calls
- **Pagination**: Large message lists loaded in chunks (if implemented)
- **Caching**: API response caching to reduce redundant requests

### Development Workflow

1. **Local Development**: Run both backend and frontend locally
2. **Hot Reload**: Changes reflect immediately without manual refresh
3. **TypeScript**: Compile-time type checking for error prevention
4. **Linting**: ESLint for code quality enforcement
5. **Formatting**: Prettier for consistent code style (if configured)

### Testing Recommendations

- **Unit Tests**: Test individual components and utility functions
- **Integration Tests**: Test API integration and data flow
- **E2E Tests**: Test complete user workflows with Cypress or Playwright
- **API Tests**: Test backend endpoints with Postman or automated scripts

---

## Contributing

We welcome contributions to improve the AI Customer Support Intelligence Platform. Please follow these guidelines:

### Code Style

- Follow the existing code structure and naming conventions
- Use TypeScript for type safety in frontend code
- Write clean, self-documenting code with meaningful variable names
- Keep functions small and focused on a single responsibility

### Documentation

- Add JSDoc comments to all functions and components
- Update README.md for any new features or significant changes
- Document new API endpoints in the API Documentation section
- Include TypeScript type definitions for new data structures

### Testing

- Test all new features on both mobile and desktop viewports
- Verify API endpoints work correctly with authentication
- Test error scenarios and edge cases
- Ensure theme switching works properly with new components

### Pull Request Process

1. Fork the repository and create a feature branch
2. Make your changes with clear, descriptive commit messages
3. Update documentation to reflect your changes
4. Test thoroughly on multiple devices and browsers
5. Submit a pull request with a detailed description

### Reporting Issues

When reporting bugs or issues:
- Provide detailed steps to reproduce the problem
- Include screenshots or error messages
- Specify your environment (OS, browser, Node version)
- Check existing issues to avoid duplicates

---

## License

This project is developed for educational purposes as part of the AI Customer Support Intelligence Platform initiative.

**License Type**: MIT License (or specify your chosen license)

**Copyright**: 2024 AI Customer Support Intelligence Team

For commercial use or custom licensing inquiries, please contact the project maintainers.

---

## Additional Resources

### Official Documentation

- **Backend API Documentation**: Detailed in this README and Postman collection
- **Postman Collection**: [https://documenter.getpostman.com/view/50299653/2sBXVo8Sjs](https://documenter.getpostman.com/view/50299653/2sBXVo8Sjs)
- **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
- **Google Gemini AI Documentation**: [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)

### Support

For questions, bug reports, or feature requests:
- Open an issue in the GitHub repository
- Contact the development team
- Refer to the troubleshooting section in the backend README

### Acknowledgments

Built with modern technologies:
- **Backend**: Node.js, Express.js, Supabase, Google Gemini AI
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL via Supabase

---

**Project Version**: 1.0.0

**Last Updated**: January 2024

**Maintained By**: AI Customer Support Intelligence Development Team