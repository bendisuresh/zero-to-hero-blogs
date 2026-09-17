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
```

## Backend Structure

The backend is organized around API blueprints, services, models, and shared database configuration.

```text
backend/
├── app.py
├── database.py
├── models.py
├── create_admin.py
├── requirements.txt
├── pytest.ini
├── routes/
│   ├── auth.py
│   ├── posts.py
│   ├── comments.py
│   ├── reactions.py
│   ├── uploads.py
│   ├── rss.py
│   ├── dashboard.py
│   └── additional_stories.py
├── services/
│   ├── post_service.py
│   ├── comment_service.py
│   └── dashboard_service.py
└── tests/
    ├── conftest.py
    └── test_posts.py
```

### Backend Design

- **Routes / Blueprints** handle HTTP requests and responses.
- **Services** contain reusable business logic.
- **Models** define database entities.
- **Authentication utilities** protect administrator operations.
- **Tests** use an isolated test database.

## Frontend Structure

The frontend uses reusable React components and route-level code splitting.

```text
frontend/
├── src/
│   ├── components/
│   │   ├── AdminCommentList.jsx
│   │   ├── AdminStatCard.jsx
│   │   ├── AdminStoryList.jsx
│   │   ├── ImageUploader.jsx
│   │   ├── Pagination.jsx
│   │   ├── RichTextEditor.jsx
│   │   ├── StoryForm.jsx
│   │   ├── TagInput.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── Post.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── CreateStory.jsx
│   │   ├── EditStory.jsx
│   │   └── AddAdditionalStory.jsx
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

### Frontend Design

Reusable components include:

- `StoryForm` - Shared story creation and editing form.
- `RichTextEditor` - Tiptap-based rich text editing.
- `ImageUploader` - Image selection and upload handling.
- `TagInput` - Story tag input and management.
- `Pagination` - Reusable pagination controls.
- `ProtectedRoute` - Verifies administrator access before rendering protected pages.
- `AdminStoryList` - Story list UI for the admin dashboard.
- `AdminCommentList` - Comment moderation UI.

Route-level lazy loading is used to split page bundles and reduce the initial frontend bundle size.

## Authentication Flow

The application uses JWT authentication for administrator operations.

```text
Admin
  |
  v
POST /api/admin/login
  |
  v
Flask validates credentials
  |
  v
JWT access token
  |
  v
Frontend stores admin token
  |
  v
Protected admin request
  |
  v
JWT validation + admin role check
  |
  +---- 401 --> Unauthenticated
  |
  +---- 403 --> Authenticated but not an admin
  |
  +---- 200 --> Authorized admin operation
```

Story creation, editing, deletion, and image uploads are restricted to authenticated administrators.

## Performance

The project includes several measures intended to improve application performance and maintainability:

- Database-backed pagination for story listings
- Latest, oldest, and popularity sorting
- Search and category/tag filtering
- Route-level frontend code splitting
- Reusable frontend components
- Database access through SQLAlchemy ORM
- Separate service layer for business logic

## Project Status

The core assignment requirements are implemented, including:

- Public blog experience
- Protected admin panel
- Admin authentication and authorization
- Story CRUD
- Rich text editing
- Image upload and replacement
- Comment moderation
- Categories and tags
- Reactions and views
- RSS feed
- Dashboard statistics
- Automated backend tests
- GitHub Actions CI
- Responsive UI
- Route-level frontend code splitting

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
```

## Backend Setup

Open a terminal in the `backend` directory:

```cmd
cd backend
```

Create and activate a Python virtual environment.

### Windows

```cmd
python -m venv venv
venv\Scripts\activate
```

Install backend dependencies:

```cmd
pip install -r requirements.txt
```

### Configure Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/zero_to_hero_blogs
JWT_SECRET_KEY=your_secure_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
FRONTEND_URL=http://localhost:5173
```

Replace the example database credentials, JWT secret, and administrator credentials with your own local values.

### Create PostgreSQL Database

Create a PostgreSQL database named:

```text
zero_to_hero_blogs
```

Make sure PostgreSQL is running.

### Run Database Migrations

```cmd
flask db upgrade
```

### Create an Admin Account

```cmd
python create_admin.py
```

### Start Backend

```cmd
python app.py
```

Backend:

```text
http://127.0.0.1:5000
```

## Frontend Setup

Open another terminal:

```cmd
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:5000
```

Start the development server:

```cmd
npm run dev
```

Frontend normally runs at:

```text
http://localhost:5173
```

## Running the Application

### Terminal 1 - Backend

```cmd
cd backend
venv\Scripts\activate
python app.py
```

### Terminal 2 - Frontend

```cmd
cd frontend
npm run dev
```

Open the frontend URL shown by Vite in your browser.

## Database Migrations

Run from the `backend` directory.

Apply existing migrations:

```cmd
flask db upgrade
```

After making model changes, create a migration:

```cmd
flask db migrate -m "describe the change"
```

Then apply it:

```cmd
flask db upgrade
```

## Running Tests

Run from the `backend` directory with the virtual environment activated:

```cmd
pytest
```

The automated test environment uses an isolated SQLite in-memory database when `TESTING=1`.

## Frontend Commands

Run from the `frontend` directory.

Development:

```cmd
npm run dev
```

Production build:

```cmd
npm run build
```

Preview production build:

```cmd
npm run preview
```

Lint:

```cmd
npm run lint
```

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

A successful login returns a JWT access token.

Protected administrator requests send the token using the `Authorization` header:

```text
Authorization: Bearer <access_token>
```

### Admin Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Verify administrator access |
| GET | `/api/admin/summary` | Get dashboard statistics |
| GET | `/api/admin/posts` | Get admin story listing |
| POST | `/api/admin/posts` | Create a story |
| PUT | `/api/admin/posts/:id` | Update a story |
| DELETE | `/api/admin/posts/:id` | Delete a story |
| POST | `/api/admin/upload` | Upload a story image |
| DELETE | `/api/admin/comments/:comment_id` | Delete a comment |
| POST | `/api/admin/posts/:post_id/additional-stories` | Add an additional story |

## Pagination

Story listing APIs support pagination using query parameters such as:

```text
/api/posts?page=1&limit=10
```

The response includes pagination metadata such as the current page and total pages.

Pagination is intended to reduce the amount of data returned for each request and provide a better browsing experience for larger story collections.

## Automated Testing and CI

The backend uses `pytest` for automated API testing.

The test suite covers areas including:

- Admin authentication
- Admin authorization
- Story CRUD
- Validation
- Unauthorized access
- Comments
- Reactions
- API behavior

The tests use a separate SQLite in-memory database instead of the development or production PostgreSQL database.

GitHub Actions runs the backend test suite automatically on repository pushes.

## Deployment

### Frontend

The React frontend is deployed using Vercel.

### Backend

The Flask backend is deployed using Render with Gunicorn.

### Database

The deployed application uses Neon PostgreSQL.

Production configuration is provided through environment variables rather than committing secrets to the repository.

## Engineering Decisions

### Flask Blueprints

API routes are separated into Blueprints to keep endpoint responsibilities organized.

### Service Layer

Business logic is separated from route handlers where appropriate, making the backend easier to maintain and test.

### JWT Authentication

JWT authentication protects administrator operations without exposing administrator credentials to the frontend.

### HTML Sanitization

Rich text HTML is sanitized with Bleach before being stored or rendered to reduce the risk of unsafe HTML content.

### PostgreSQL

PostgreSQL is used for the application database because it provides a relational database suitable for the deployed application.

### Neon

Neon provides the managed PostgreSQL database used by the deployed application.

### Vercel and Render

The frontend and backend are deployed separately so each application layer can be built and deployed independently.

### Route-Level Code Splitting

React route components are lazy-loaded so users do not need to download every page bundle during the initial application load.

## Security Notes

- Administrator credentials are stored as password hashes.
- JWT tokens are required for protected administrator endpoints.
- Administrator role checks prevent non-admin users from accessing admin operations.
- Story creation, editing, deletion, and image uploads are protected.
- Rich text HTML is sanitized using Bleach.
- Environment variables are used for database credentials and JWT secrets.
- CORS is configured for the application frontend.
- Production secrets should never be committed to Git.
