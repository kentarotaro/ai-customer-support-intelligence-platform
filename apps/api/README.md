# AI Customer Support Intelligence Platform - Backend Service

A backend service for the AI Customer Support Intelligence Platform designed to manage customer messages with automated analysis using Artificial Intelligence (Google Gemini). This system provides APIs for sentiment detection, priority determination, issue categorization, and delivers automated summaries and reply suggestions to enhance customer support agent efficiency.

## Table of Contents

- [Technology Stack](#technology-stack)
- [System Requirements](#system-requirements)
- [Installation and Configuration](#installation-and-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [License](#license)

## Technology Stack

This project is built using the following technologies:

- **Runtime Environment:** Node.js (JavaScript server-side)
- **Web Framework:** Express.js (REST API framework)
- **Database:** Supabase (PostgreSQL Database-as-a-Service)
- **Artificial Intelligence:** Google Gemini (via Google Generative AI SDK)
- **Utilities:** Dotenv (Environment variable management), Nodemon (Development tool)

## System Requirements

Before running this project in a local environment, ensure your system meets the following requirements:

- **Node.js**: Version 18.0.0 or higher
- **NPM (Node Package Manager)**: Installed alongside Node.js
- **Git**: For version control and repository management
- **Supabase Account**: Active project with URL and API Key
- **Google AI Studio API Key**: Valid access key for Gemini model

## Installation and Configuration

### 1. Clone Repository and Install Dependencies

Download the source code and install required dependency packages through the terminal:
```bash
cd Backend
npm install
```

### 2. Environment Variables Configuration (.env)

The system requires environment variable configuration to connect to the database and AI services. Create a file named `.env` inside the `Backend` directory.

Copy the configuration below and adjust the values with your credentials:
```env
# Server Configuration
PORT=4000

# Supabase Configuration (Database)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key

# Google AI Configuration (Gemini)
GEMINI_API_KEY=your-google-ai-api-key

# Security (JWT Token)
JWT_SECRET=your_very_long_secret_key
```

> **Security Warning:** The `.env` file contains sensitive information (API Keys). Ensure this file is registered in `.gitignore` and never uploaded to public repositories.

## Running the Application

You can run the server in two modes:

### Development Mode

Using nodemon to automatically restart the server whenever code changes occur:
```bash
npm run dev
```

### Production Mode

Running the server using standard Node.js:
```bash
npm start
```

If successful, the terminal will display a message indicating the server is running at `http://localhost:4000` and the connection to Supabase is ready.

## Project Structure

This project implements a modular structure to facilitate maintenance, code readability, and further development:
```
api/                        # Backend Server (Node.js + Express)
├── config/                 # External Connection Configuration
│   ├── gemini.js          # Google Gemini AI Setup
│   └── supabaseClient.js  # Supabase Database Setup
│
├── controllers/            # Business Logic (Application Brain)
│   ├── authController.js  # Login/Register/Logout Logic
│   ├── dashboardController.js # Statistics & Analytics Logic
│   └── messageController.js   # Inbox, Reply, & Ticket Assignment Logic
│
├── middleware/             # Guards & Filters
│   ├── authMiddleware.js  # Token & Role Verification (Agent vs Lead)
│   └── rateLimiter.js     # Spam Prevention (Anti-Abuse)
│
├── routes/                 # URL Entry Points (API Endpoints)
│   ├── authRoutes.js      # /api/auth/...
│   ├── dashboardRoutes.js # /api/dashboard/...
│   └── messageRoutes.js   # /api/messages/...
│
├── services/               # Specialized Services
│   └── aiService.js       # AI Communication Functions
│
├── index.js                # Main File (Server Launcher)
├── package.json            # Dependencies List
└── README.md               # Documentation
```

## API Documentation

This service provides a RESTful API. All endpoints have a base prefix: `http://localhost:4000/api`

### 1. Retrieve All Messages (Inbox)

Retrieves a list of all incoming messages, sorted from newest to oldest.

- **Method:** `GET`
- **Endpoint:** `/messages`
- **Description:** Used to display the message table on the main page (Inbox). AI-generated priority can be used for visual indicators (High/Medium/Low).

**Example Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "customer_name": "Budi Santoso",
    "subject": "Login Issue",
    "content": "I cannot access the application...",
    "priority": "High",
    "status": "Open",
    "created_at": "2024-01-10T08:00:00Z"
  }
]
```

### 2. Retrieve Message Details

Retrieves detailed information for a specific message, including AI analysis results (Issue Summary and Reply Suggestions).

- **Method:** `GET`
- **Endpoint:** `/messages/:id`
- **URL Parameter:** `id` (Integer) - Unique message ID

**Example Success Response (200 OK):**
```json
{
  "id": 5,
  "customer_name": "Siti Aminah",
  "content": "Payment keeps failing even though balance is sufficient...",
  "category": "Billing",
  "sentiment": "Negative",
  "priority": "High",
  "ai_summary": "Customer experiencing transaction failure despite having sufficient balance.",
  "ai_suggested_reply": "Hello Siti, we apologize for the inconvenience. Could you please provide the payment method used?"
}
```

### 3. Create New Message (Simulation)

Simulates a new incoming message from a customer. This endpoint will trigger an asynchronous background AI analysis process.

- **Method:** `POST`
- **Endpoint:** `/messages`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "customer_name": "Rara Sekar",
  "subject": "Internet Down",
  "content": "My home internet connection has been completely down since this morning."
}
```

> **Note:** The API response will be returned immediately after data is saved to the database. AI analysis result columns (category, sentiment, summary) will be updated a few seconds later after the AI process completes.

### 4. Reply to Message

Sends a customer service agent reply and automatically closes the ticket.

- **Method:** `POST`
- **Endpoint:** `/messages/:id/reply`
- **URL Parameter:** `id` (Integer) - Unique message ID
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "reply_content": "Hello Rara, our technician is on the way to your location."
}
```

**Response:** Returns the updated message object with status `Closed`.

### 5. Authentication (Auth)

Manages user access (Agent & Lead).

#### Login
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "agent@example.com",
  "password": "secure_password"
}
```

**Response:** Returns JWT Token and User Information.

#### Register
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "newagent@example.com",
  "password": "secure_password",
  "full_name": "John Doe",
  "role": "agent"
}
```

### 6. Dashboard Analytics (Lead Only)

Provides statistical data for executive dashboard charts.

- **Method:** `GET`
- **Endpoint:** `/dashboard/stats`
- **Headers:** `Authorization: Bearer <JWT_TOKEN_LEAD>`
- **Description:** Returns comprehensive ticket statistics including total tickets, status breakdown, sentiment analysis, and priority distribution.

**Example Success Response (200 OK):**
```json
{
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
  }
}
```

### 7. Ticket Management (Assignment)

Manages task distribution among agents.

#### Assign to Self
- **Method:** `POST`
- **Endpoint:** `/messages/:id/assign`
- **Headers:** `Authorization: Bearer <JWT_TOKEN_AGENT>`

**Request Body:**
```json
{}
```

**Description:** Empty body for self-assignment (claim ticket).

#### Assign to Another Agent (Lead Only)
- **Method:** `POST`
- **Endpoint:** `/messages/:id/assign`
- **Headers:** `Authorization: Bearer <JWT_TOKEN_LEAD>`

**Request Body:**
```json
{
  "agent_id": "UUID_AGENT"
}
```

#### Unassign Ticket
- **Method:** `POST`
- **Endpoint:** `/messages/:id/unassign`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Description:** Releases the ticket assignment.

### 8. Manual Status Update

Updates ticket status without replying to the message (e.g., moving to 'In Progress').

- **Method:** `PATCH`
- **Endpoint:** `/messages/:id/status`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Valid Status Values:** `open`, `in_progress`, `closed`

---

Built with Node.js, Express.js, Supabase, and Google Gemini AI