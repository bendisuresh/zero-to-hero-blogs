# Zero to Hero Blogs

A full-stack blog platform where readers can explore real-world stories and administrators can create, manage, and publish blog content through a protected admin panel.

## Live Project

- Frontend: https://zero-to-hero-blogs.vercel.app
- Backend API: https://zero-to-hero-blogs.onrender.com
- GitHub: https://github.com/bendisuresh/zero-to-hero-blogs

## Overview

Zero to Hero Blogs is a full-stack web application designed around a public storytelling platform and an administrator-controlled content management system.

The application allows visitors to:

- Browse published stories
- Explore stories by category
- Search and filter stories
- Sort stories by latest, oldest, or popularity
- Read complete stories
- View story statistics such as views and reactions
- Submit comments
- Explore related and additional stories
- Browse story topics through tags

Administrators can securely:

- Log in through the protected admin system
- Create stories
- Edit existing stories
- Delete stories
- Upload and replace story images
- Manage story categories and tags
- Add additional stories
- Moderate comments
- View dashboard statistics
- Search, filter, sort, and paginate stories

## Key Features

### Public Blog

- Responsive home page
- Featured stories
- Latest stories
- Category-based browsing
- Story search
- Tag-based filtering
- Story detail pages
- Related/additional stories
- Reading time information
- Views, likes, and dislikes
- Comments
- RSS feed

### Admin Panel

- JWT-based admin authentication
- Role-based admin authorization
- Protected admin routes
- Story CRUD operations
- Rich text story editor
- Image upload
- Image replacement when editing stories
- Category and tag management
- Comment moderation
- Dashboard statistics
- Story search
- Category filtering
- Sorting
- Pagination

### Security

- JWT authentication for admin operations
- Admin role authorization
- Protected story creation
- Protected story editing and deletion
- Protected image uploads
- Request validation
- HTML sanitization using Bleach
- CORS configuration

## Technology Stack

### Frontend

- React.js
- Vite
- React Router
- Tiptap
- JavaScript
- HTML
- CSS

### Backend

- Python
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- Flask-CORS
- Bleach
- Gunicorn

### Database

- PostgreSQL
- Neon PostgreSQL for the deployed database
- SQLite in the automated test environment

### Deployment

- Vercel — Frontend
- Render — Backend
- Neon — PostgreSQL database

## Architecture

Zero to Hero Blogs follows a client-server architecture where the React frontend communicates with the Flask backend through REST APIs.

```mermaid
flowchart TD
    A[Web Browser] --> B[React Frontend]
    B -->|HTTP / JSON| C[Flask REST API]

    C --> D[Authentication]
    C --> E[API Blueprints]

    E --> F[Service Layer]
    F --> G[SQLAlchemy ORM]
    G --> H[(PostgreSQL / Neon)]

    D --> E

    E --> E1[Posts]
    E --> E2[Comments]
    E --> E3[Reactions]
    E --> E4[Image Uploads]
    E --> E5[RSS]
    E --> E6[Dashboard]
    E --> E7[Additional Stories]

    F --> F1[Business Logic]
    F --> F2[Validation]
    F --> F3[Data Processing]


## Local Development Setup

### Prerequisites

Install the following before running the project:

- Python 3.x
- Node.js and npm
- PostgreSQL
- Git

### Clone the Repository

```bash
git clone https://github.com/bendisuresh/zero-to-hero-blogs.git
cd zero-to-hero-blogs

## API Documentation

The backend exposes REST APIs for public blog content and protected administrator operations.

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health/status |
| GET | `/api/posts` | Get published stories |
| GET | `/api/posts/:id` | Get a story by ID |
| GET | `/api/posts/:id/comments` | Get comments for a story |
| POST | `/api/posts/:id/comments` | Submit a comment |
| GET | `/api/posts/:id/additional-stories` | Get additional stories |
| POST | `/api/posts/:id/view` | Record a story view |
| POST | `/api/posts/:id/like` | Like a story |
| POST | `/api/posts/:id/dislike` | Dislike a story |
| GET | `/api/rss` | RSS feed |

### Admin Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Authenticate an administrator |

A successful login returns a JWT access token. Protected administrator requests send the token using the `Authorization` header:

```text
Authorization: Bearer <access_token>