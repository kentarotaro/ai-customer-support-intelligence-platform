# AI Customer Support Intelligence Platform - Backend Service

A comprehensive backend service for the AI Customer Support Intelligence Platform, designed to manage customer messages with automated analysis using Artificial Intelligence (Google Gemini). This system provides robust APIs for sentiment detection, priority determination, issue categorization, and delivers automated summaries with intelligent reply suggestions to significantly enhance customer support agent efficiency.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [System Requirements](#system-requirements)
- [Installation and Configuration](#installation-and-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
  - [Postman Collection](#postman-collection)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Message Management Endpoints](#message-management-endpoints)
  - [Dashboard Analytics Endpoints](#dashboard-analytics-endpoints)
  - [Ticket Assignment Endpoints](#ticket-assignment-endpoints)
- [Environment Variables Reference](#environment-variables-reference)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

This backend service serves as the core infrastructure for an intelligent customer support platform. It leverages Google Gemini AI to automatically analyze incoming customer messages, categorize issues, detect sentiment, prioritize tickets, and generate contextual reply suggestions. The system is built with scalability, security, and maintainability in mind, implementing industry-standard practices for API development and authentication.

### Key Features

- **Automated AI Analysis**: Real-time sentiment analysis, priority detection, and issue categorization using Google Gemini
- **Intelligent Reply Suggestions**: Context-aware automated reply drafts to accelerate agent response time
- **Role-Based Access Control**: Separate permissions for Agents and Lead roles
- **Comprehensive Analytics**: Dashboard statistics for ticket monitoring and performance tracking
- **Secure Authentication**: JWT-based authentication system with token management
- **Rate Limiting**: Built-in protection against API abuse and spam
- **RESTful API Design**: Clean, standardized endpoints following REST principles

## Technology Stack

This project is built using modern, production-ready technologies:

- **Runtime Environment**: Node.js v18.0.0+ (JavaScript server-side runtime)
- **Web Framework**: Express.js (Fast, minimalist web framework for Node.js)
- **Database**: Supabase (PostgreSQL Database-as-a-Service with real-time capabilities)
- **Artificial Intelligence**: Google Gemini (Advanced AI model via Google Generative AI SDK)
- **Authentication**: JWT (JSON Web Tokens for stateless authentication)
- **Environment Management**: Dotenv (Secure environment variable configuration)
- **Development Tools**: Nodemon (Auto-reload development server)
- **Security**: Rate limiting middleware, input validation, and secure headers

## System Requirements

Before running this project in a local or production environment, ensure your system meets the following requirements:

- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **NPM**: Version 8.0.0 or higher (installed alongside Node.js)
- **Git**: Version control system for repository management
- **Supabase Account**: Active project with valid URL and API Key
- **Google AI Studio API Key**: Valid API key with access to Gemini models
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+ recommended)
- **RAM**: Minimum 2GB available memory
- **Storage**: At least 500MB free disk space

## Installation and Configuration

### Step 1: Clone Repository and Install Dependencies

Download the source code and install all required dependency packages:
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the backend directory
cd apps/api

# Install dependencies
npm install
```

### Step 2: Environment Variables Configuration

The system requires proper environment variable configuration to connect to external services. Create a `.env` file in the `Backend` directory root.

**Template `.env` file:**
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Supabase Configuration (Database & Authentication)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key

# Google AI Configuration (Gemini Model)
GEMINI_API_KEY=your-google-ai-studio-api-key

# Security Configuration
JWT_SECRET=your_very_long_and_secure_random_string_minimum_32_characters
JWT_EXPIRATION=24h

# Optional: CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

**Important Security Notes:**
- The `.env` file contains sensitive credentials and must never be committed to version control
- Ensure `.env` is listed in your `.gitignore` file
- Use strong, randomly generated values for `JWT_SECRET`
- Rotate API keys regularly in production environments

### Step 3: Database Setup

Ensure your Supabase project has the required database tables. The schema should include:

- `messages` table: Stores customer messages and AI analysis results
- `users` table: Manages agent and lead user accounts
- `tickets` table: Optional table for advanced ticket management

Refer to the database migration files or Supabase dashboard for detailed schema information.

## Running the Application

You can run the server in two different modes depending on your use case:

### Development Mode

Uses nodemon for automatic server restart on code changes:
```bash
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:4000
Supabase connection established successfully
```

### Production Mode

Runs the server using standard Node.js without auto-reload:
```bash
npm start
```

### Verifying Installation

Test if the server is running correctly:
```bash
curl http://localhost:4000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-10T10:30:00.000Z",
  "service": "AI Customer Support Backend"
}
```

## Project Structure

This project implements a modular, layered architecture following MVC (Model-View-Controller) principles for maintainability and scalability:
```
api/                           # Backend Server Root Directory
├── config/                    # Configuration Files
│   ├── gemini.js             # Google Gemini AI SDK initialization
│   └── supabaseClient.js     # Supabase client setup and connection
│
├── controllers/               # Business Logic Layer (Application Core)
│   ├── authController.js     # Authentication logic (login, register, logout)
│   ├── dashboardController.js # Analytics and statistics aggregation
│   └── messageController.js   # Message CRUD operations and AI processing
│
├── middleware/                # Request Processing Layer
│   ├── authMiddleware.js     # JWT verification and role-based authorization
│   ├── rateLimiter.js        # API rate limiting and abuse prevention
│   └── validator.js          # Input validation and sanitization
│
├── routes/                    # API Route Definitions
│   ├── authRoutes.js         # Authentication endpoints (/api/auth/*)
│   ├── dashboardRoutes.js    # Dashboard endpoints (/api/dashboard/*)
│   └── messageRoutes.js      # Message endpoints (/api/messages/*)
│
├── services/                  # Business Services Layer
│   ├── aiService.js          # AI integration and prompt management
│   └── emailService.js       # Email notification service (optional)
│
├── utils/                     # Utility Functions
│   ├── logger.js             # Application logging
│   └── errorHandler.js       # Centralized error handling
│
├── .env                       # Environment variables (not in repository)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore configuration
├── index.js                  # Application entry point
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

### Architecture Overview

**Controller Layer**: Handles HTTP request/response logic and orchestrates service calls

**Service Layer**: Contains reusable business logic and external API integrations

**Middleware Layer**: Processes requests before they reach controllers (authentication, validation, rate limiting)

**Routes Layer**: Maps HTTP endpoints to controller functions

## API Documentation

This service provides a comprehensive RESTful API. All endpoints use the base URL: `http://localhost:4000/api`

### Postman Collection

For complete API documentation with request/response examples, testing capabilities, and interactive exploration:

**Official Postman Documentation**: [https://documenter.getpostman.com/view/50299653/2sBXVo8Sjs](https://documenter.getpostman.com/view/50299653/2sBXVo8Sjs)

The Postman collection includes:
- Pre-configured request examples for all endpoints
- Environment variables for easy testing
- Automated test scripts
- Detailed parameter descriptions
- Sample responses for success and error cases
- Authentication token management

### Authentication Endpoints

#### 1. User Login

Authenticates a user and returns a JWT token for subsequent requests.

**Endpoint**: `POST /api/auth/login`

**Request Headers**:
```
Content-Type: application/json
```

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
  },
  "expiresIn": "24h"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

#### 2. User Registration

Creates a new user account (Agent or Lead).

**Endpoint**: `POST /api/auth/register`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "newagent@example.com",
  "password": "secure_password_123",
  "full_name": "Jane Smith",
  "role": "agent"
}
```

**Validation Rules**:
- Email must be valid format and unique
- Password minimum 8 characters
- Role must be either "agent" or "lead"
- Full name is required

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

#### 3. Token Refresh

Refreshes an existing JWT token before expiration.

**Endpoint**: `POST /api/auth/refresh`

**Request Headers**:
```
Authorization: Bearer <current-token>
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

### Message Management Endpoints

#### 4. Retrieve All Messages (Inbox)

Fetches a paginated list of all customer messages with AI analysis results.

**Endpoint**: `GET /api/messages`

**Request Headers**:
```
Authorization: Bearer <jwt-token>
```

**Query Parameters** (Optional):
- `page` (integer): Page number for pagination (default: 1)
- `limit` (integer): Number of items per page (default: 20, max: 100)
- `status` (string): Filter by status (open, in_progress, closed)
- `priority` (string): Filter by priority (high, medium, low)
- `sort` (string): Sort order (newest, oldest, priority)

**Example Request**:
```
GET /api/messages?page=1&limit=20&status=open&sort=priority
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_name": "Budi Santoso",
      "customer_email": "budi@example.com",
      "subject": "Login Issue",
      "content": "I cannot access the application after password reset...",
      "category": "Technical Support",
      "sentiment": "Negative",
      "priority": "High",
      "status": "open",
      "assigned_to": null,
      "created_at": "2024-01-10T08:00:00Z",
      "updated_at": "2024-01-10T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### 5. Retrieve Message Details

Fetches comprehensive details for a specific message including full AI analysis.

**Endpoint**: `GET /api/messages/:id`

**URL Parameters**:
- `id` (integer, required): Unique message identifier

**Request Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "customer_name": "Siti Aminah",
    "customer_email": "siti@example.com",
    "subject": "Payment Processing Error",
    "content": "Payment keeps failing even though balance is sufficient. Transaction ID: TRX-12345",
    "category": "Billing",
    "sentiment": "Negative",
    "priority": "High",
    "status": "open",
    "ai_summary": "Customer experiencing recurring payment transaction failures despite having sufficient account balance. Transaction reference provided.",
    "ai_suggested_reply": "Hello Siti, we apologize for the inconvenience you're experiencing. I've checked your account and found the issue. Could you please provide the payment method used (credit card, bank transfer, etc.) and the exact time of the failed transaction? Our billing team will prioritize this issue.",
    "assigned_to": {
      "id": "agent-uuid",
      "full_name": "John Doe",
      "email": "john@example.com"
    },
    "created_at": "2024-01-10T09:30:00Z",
    "updated_at": "2024-01-10T09:30:00Z"
  }
}
```

**Error Response (404 Not Found)**:
```json
{
  "success": false,
  "error": "Message not found"
}
```

#### 6. Create New Message

Creates a new customer message and triggers asynchronous AI analysis.

**Endpoint**: `POST /api/messages`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "customer_name": "Rara Sekar",
  "customer_email": "rara@example.com",
  "subject": "Internet Connection Down",
  "content": "My home internet connection has been completely down since this morning at 6 AM. I've tried restarting the router multiple times but nothing works."
}
```

**Validation Rules**:
- `customer_name`: Required, 2-100 characters
- `customer_email`: Required, valid email format
- `subject`: Required, 5-200 characters
- `content`: Required, minimum 10 characters

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

**Note**: AI analysis fields (category, sentiment, priority, ai_summary, ai_suggested_reply) will be populated asynchronously within 2-5 seconds after creation.

#### 7. Reply to Message

Sends an agent reply to a customer message and updates ticket status.

**Endpoint**: `POST /api/messages/:id/reply`

**URL Parameters**:
- `id` (integer, required): Message identifier

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body**:
```json
{
  "reply_content": "Hello Rara, thank you for reporting this issue. Our technical team has identified a network outage in your area. A technician is currently on the way to your location and should arrive within 2 hours. We apologize for the inconvenience."
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
    "reply_content": "Hello Rara, thank you for reporting this issue...",
    "replied_by": {
      "id": "agent-uuid",
      "full_name": "John Doe"
    },
    "replied_at": "2024-01-10T11:00:00Z"
  }
}
```

#### 8. Update Message Status

Manually updates ticket status without sending a reply.

**Endpoint**: `PATCH /api/messages/:id/status`

**URL Parameters**:
- `id` (integer, required): Message identifier

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

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

#### 9. Get Dashboard Statistics

Retrieves comprehensive analytics for the support dashboard (Lead role only).

**Endpoint**: `GET /api/dashboard/stats`

**Request Headers**:
```
Authorization: Bearer <jwt-token-lead>
```

**Query Parameters** (Optional):
- `period` (string): Time period for statistics (today, week, month, year, all)
- `agent_id` (string): Filter statistics by specific agent

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
      "Product Inquiry": 40,
      "Other": 20
    },
    "agent_performance": [
      {
        "agent_id": "uuid-1",
        "agent_name": "John Doe",
        "total_handled": 35,
        "avg_response_time": "2.5 hours",
        "resolution_rate": "94%"
      }
    ],
    "trend_data": {
      "daily_tickets": [12, 15, 18, 14, 20, 16, 19],
      "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
  },
  "generated_at": "2024-01-10T12:00:00Z"
}
```

**Authorization Note**: This endpoint requires Lead role. Agent role users will receive a 403 Forbidden response.

### Ticket Assignment Endpoints

#### 10. Assign Ticket to Self

Allows an agent to claim an unassigned ticket.

**Endpoint**: `POST /api/messages/:id/assign`

**URL Parameters**:
- `id` (integer, required): Message identifier

**Request Headers**:
```
Authorization: Bearer <jwt-token-agent>
```

**Request Body**:
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
      "full_name": "John Doe",
      "email": "john@example.com"
    },
    "assigned_at": "2024-01-10T13:00:00Z"
  }
}
```

#### 11. Assign Ticket to Another Agent (Lead Only)

Allows a lead to assign a ticket to a specific agent.

**Endpoint**: `POST /api/messages/:id/assign`

**URL Parameters**:
- `id` (integer, required): Message identifier

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
      "full_name": "Jane Smith",
      "email": "jane@example.com"
    },
    "assigned_by": {
      "id": "lead-uuid",
      "full_name": "Lead Manager"
    },
    "assigned_at": "2024-01-10T13:30:00Z"
  }
}
```

#### 12. Unassign Ticket

Removes the current assignment from a ticket.

**Endpoint**: `POST /api/messages/:id/unassign`

**URL Parameters**:
- `id` (integer, required): Message identifier

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
    "assigned_to": null,
    "unassigned_at": "2024-01-10T14:00:00Z"
  }
}
```

## Environment Variables Reference

Comprehensive guide to all environment variables used in the application:

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `PORT` | Integer | No | 4000 | Server port number |
| `NODE_ENV` | String | No | development | Environment mode (development, production, test) |
| `SUPABASE_URL` | String | Yes | - | Supabase project URL |
| `SUPABASE_KEY` | String | Yes | - | Supabase anonymous/public API key |
| `GEMINI_API_KEY` | String | Yes | - | Google AI Studio API key for Gemini |
| `JWT_SECRET` | String | Yes | - | Secret key for JWT token signing (min 32 chars) |
| `JWT_EXPIRATION` | String | No | 24h | JWT token expiration time |
| `ALLOWED_ORIGINS` | String | No | * | Comma-separated list of allowed CORS origins |
| `RATE_LIMIT_WINDOW` | Integer | No | 15 | Rate limit time window in minutes |
| `RATE_LIMIT_MAX` | Integer | No | 100 | Maximum requests per window |

## Security Considerations

### Best Practices

1. **Environment Variables**: Never commit `.env` files to version control. Use `.env.example` as a template.

2. **API Keys**: Rotate API keys regularly and use different keys for development and production.

3. **JWT Tokens**: 
   - Use strong, random secrets (minimum 32 characters)
   - Implement token refresh mechanism
   - Set appropriate expiration times (24h recommended)

4. **Rate Limiting**: Default configuration allows 100 requests per 15 minutes per IP. Adjust based on your needs.

5. **Input Validation**: All user inputs are validated and sanitized before processing.

6. **HTTPS**: Always use HTTPS in production environments. Configure reverse proxy (nginx, Apache) for SSL termination.

7. **Database Security**: Use Supabase Row Level Security (RLS) policies to restrict data access.

8. **CORS Configuration**: Specify exact allowed origins in production instead of using wildcards.

### Common Security Headers

The application automatically sets the following security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## Troubleshooting

### Common Issues and Solutions

#### Server won't start

**Issue**: `Error: Cannot find module 'express'`

**Solution**: Run `npm install` to install all dependencies.

---

#### Database connection fails

**Issue**: `Error: Invalid Supabase credentials`

**Solution**: 
1. Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
2. Check if Supabase project is active
3. Ensure API key has proper permissions

---

#### AI analysis not working

**Issue**: Messages created but AI fields remain null

**Solution**:
1. Verify `GEMINI_API_KEY` is valid
2. Check Google AI Studio API quota limits
3. Review server logs for AI service errors
4. Ensure network connectivity to Google AI services

---

#### JWT token errors

**Issue**: `Error: jwt malformed` or `Error: invalid signature`

**Solution**:
1. Ensure `JWT_SECRET` is set in `.env`
2. Clear browser cookies/local storage
3. Request a new token via login endpoint

---

#### Rate limit reached

**Issue**: `429 Too Many Requests`

**Solution**: 
1. Wait for the rate limit window to reset (default: 15 minutes)
2. Adjust `RATE_LIMIT_MAX` in configuration if legitimate use case
3. Implement request queuing on client side

---

### Debug Mode

Enable detailed logging for troubleshooting:
```bash
NODE_ENV=development DEBUG=* npm run dev
```

### Getting Help

For additional support:
1. Check the Postman collection for request examples
2. Review error messages in server logs
3. Consult Supabase and Google AI documentation
4. Open an issue in the project repository

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Maintained by**: AI Customer Support Intelligence Team

**Last Updated**: January 2024

**Backend Version**: 1.0.0

Built with Node.js, Express.js, Supabase, and Google Gemini AI