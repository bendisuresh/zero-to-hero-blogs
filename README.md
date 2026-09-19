# Zero to Hero Blogs

A production-oriented full-stack blog platform built with **React, Flask, SQLAlchemy, JWT authentication, PostgreSQL, and a modular service-based architecture**.

The project was developed with an emphasis on security, maintainability, reusable components, testing, pagination, content moderation, responsive UI, and deployment readiness.

---

## Live Project

| Resource | Link |
|---|---|
| Frontend | https://zero-to-hero-blogs.vercel.app |
| Backend API | https://zero-to-hero-blogs.onrender.com |
| GitHub | https://github.com/bendisuresh/zero-to-hero-blogs |

---

# 1. Project Overview

Zero to Hero Blogs is a full-stack content management and blogging platform.

It provides two major experiences:

### Public Blog

Visitors can:

- Browse published stories
- Search and filter stories
- Open individual stories
- View categories and tags
- Read related/additional stories
- View reading time and publication information
- Add comments
- View approved comments
- Like or dislike stories
- Access RSS content

### Admin CMS

Administrators can:

- Authenticate securely
- Create stories
- Edit stories
- Delete stories
- Save drafts
- Publish stories
- Upload images
- Manage tags
- Moderate comments
- View dashboard statistics
- Manage published and draft content

---

# 2. Key Engineering Features

- React + Vite frontend
- Flask REST API
- PostgreSQL production database
- SQLAlchemy ORM
- JWT authentication
- Role-based admin authorization
- Flask Blueprints
- Service-layer architecture
- Request validation
- Draft/publish workflow
- Comment moderation
- Image uploads
- Tags and categories
- Likes/dislikes
- Story views
- Search and filtering
- Database-level pagination
- RSS feed
- Reusable React components
- Custom authentication hook
- Loading, error, and empty states
- Skeleton loaders
- Responsive UI
- Automated pytest test suite
- GitHub Actions CI
- Vercel frontend deployment
- Render backend deployment
- Neon PostgreSQL

---

# 3. Technology Stack

## Frontend

- React
- Vite
- React Router
- JavaScript
- HTML
- CSS
- TipTap rich-text editor

## Backend

- Python
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- JWT authentication
- Flask-CORS
- Bleach
- Gunicorn

## Database

- PostgreSQL
- Neon
- SQLite for local/testing scenarios where applicable

## Testing

- pytest

## Deployment

- Vercel
- Render
- Neon PostgreSQL

## Development

- Git
- GitHub
- GitHub Actions
- VS Code

---

# 4. Architecture

The application follows a layered full-stack architecture.

```text
User / Admin Browser
        |
        v
React + Vite
        |
        | REST / JSON
        v
Flask API
        |
        +--> JWT Authentication
        |
        +--> Blueprints / Routes
        |
        +--> Validation / Schemas
        |
        +--> Service Layer
        |
        v
SQLAlchemy ORM
        |
        v
PostgreSQL / Neon
```

Detailed architecture documentation is available in:

```text
docs/
└── architecture/
    ├── system-architecture.md
    └── deployment-architecture.md
```

---

# 5. Production Deployment Architecture

```text
                    INTERNET
                        |
                        v
               +----------------+
               |     VERCEL     |
               | React + Vite   |
               +----------------+
                        |
                    HTTPS / REST
                        |
                        v
               +----------------+
               |     RENDER     |
               | Flask +        |
               | Gunicorn       |
               +----------------+
                        |
                  SQLAlchemy / SQL
                        |
                        v
               +----------------+
               |      NEON      |
               |   PostgreSQL   |
               +----------------+
```

The frontend does not connect directly to PostgreSQL.

All database operations go through the Flask backend.

---

# 6. Request Flow

A typical request follows this structure:

```text
React UI
   |
   v
API Request
   |
   v
Flask Blueprint
   |
   +--> Authentication / Authorization
   |
   +--> Validation
   |
   v
Service Layer
   |
   v
SQLAlchemy
   |
   v
PostgreSQL
   |
   v
JSON Response
   |
   v
React UI
```

This separation keeps HTTP handling, business logic, and database access from
being tightly coupled.

---

# 7. Backend Architecture

The backend is organized into focused modules.

```text
backend/
├── app.py
├── database.py
├── models.py
├── create_admin.py
├── seed_local_stories.py
│
├── routes/
│   ├── auth.py
│   ├── posts.py
│   ├── comments.py
│   ├── reactions.py
│   ├── uploads.py
│   ├── dashboard.py
│   ├── additional_stories.py
│   └── rss.py
│
├── services/
│   ├── post_service.py
│   ├── comment_service.py
│   ├── reaction_service.py
│   ├── upload_service.py
│   ├── dashboard_service.py
│   ├── additional_story_service.py
│   └── rss_service.py
│
├── schemas/
│   └── post_schema.py
│
├── serializers/
│   └── post_serializer.py
│
├── utils/
│   └── validators.py
│
├── migrations/
│   └── versions/
│
└── tests/
    ├── conftest.py
    ├── test_auth.py
    ├── test_posts.py
    ├── test_comments.py
    ├── test_reactions.py
    ├── test_upload.py
    ├── test_rss.py
    └── test_additional_stories.py
```

---

# 8. Frontend Architecture

```text
frontend/
└── src/
    ├── components/
    │   ├── AdminCommentList
    │   ├── AdminStoryList
    │   ├── AdminStatCard
    │   ├── EmptyState
    │   ├── ErrorState
    │   ├── ImageUploader
    │   ├── LoadingState
    │   ├── Navbar
    │   ├── Pagination
    │   ├── PostCard
    │   ├── ProtectedRoute
    │   ├── RichTextEditor
    │   ├── Skeleton
    │   ├── StoryCardSkeleton
    │   ├── StoryForm
    │   └── TagInput
    │
    ├── hooks/
    │   └── useAuth
    │
    ├── pages/
    │   ├── Home
    │   ├── Post
    │   ├── CategoryPage
    │   ├── AdminLogin
    │   ├── AdminDashboard
    │   ├── CreateStory
    │   └── EditStory
    │
    └── App.jsx
```

The frontend separates:

- Pages
- Reusable components
- Authentication state
- API communication
- Loading/error/empty states

---

# 9. Authentication and Authorization

Administrative operations are protected using JWT authentication.

The general flow is:

```text
Admin Login
    |
    v
Credentials
    |
    v
Flask Authentication Endpoint
    |
    v
JWT Token
    |
    v
Protected API Request
    |
    v
JWT Verification
    |
    v
Admin Authorization
    |
    v
Protected Operation
```

The application distinguishes authentication from authorization.

### Authentication

Determines whether the request has a valid authenticated identity.

### Authorization

Determines whether that authenticated user has the required administrative
permission.

Administrative operations include:

- Story creation
- Story editing
- Story deletion
- Publishing
- Image uploads
- Comment moderation

---

# 10. Draft and Publish Workflow

Stories support publication states.

```text
                 Story
                   |
          +--------+--------+
          |                 |
        Draft            Published
          |                 |
          |                 |
     Admin only        Public users
          |
       Publish
          |
          v
      Published
```

Public endpoints expose published content.

Administrators can manage both draft and published stories.

---

# 11. Comment Moderation

New comments enter a moderation workflow.

```text
New Comment
     |
     v
  Pending
   /   \
  /     \
Approve Reject
  |       |
  v       v
Approved Rejected
  |
  v
Publicly Visible
```

Public users see approved comments.

Administrators can approve, reject, or delete comments.

---

# 12. Pagination

Blog listing endpoints support database-level pagination.

Example:

```text
GET /api/posts?page=1&limit=10
```

A paginated response contains information such as:

```json
{
  "posts": [],
  "page": 1,
  "limit": 10,
  "total": 100,
  "total_pages": 10
}
```

Pagination is performed at the database query level rather than loading all
stories into application memory.

This helps keep responses and frontend rendering manageable as the number of
stories grows.

---

# 13. Search, Filtering, and Sorting

The blog API supports query-based discovery.

Typical query parameters include:

- Search
- Category
- Tag
- Sort order
- Page
- Limit

Conceptual flow:

```text
Search / Filter UI
       |
       v
Query Parameters
       |
       v
Flask API
       |
       v
Database Query
       |
       v
Filtered / Sorted Results
```

---

# 14. Loading, Error, and Empty States

The frontend provides explicit UI states for asynchronous operations.

```text
API Request
    |
    +---- Loading ----> Skeleton / Loading State
    |
    +---- Success ----> Content
    |
    +---- Empty ------> Empty State
    |
    +---- Error ------> Error State
```

Reusable components prevent the same state-handling UI from being duplicated
throughout the application.

Examples:

- `LoadingState`
- `ErrorState`
- `EmptyState`
- `Skeleton`
- `StoryCardSkeleton`

---

# 15. Rich Text Editing

Story creation and editing use a rich-text editor.

The editor allows administrators to create formatted story content while the
backend remains responsible for validating and handling submitted content.

---

# 16. Image Uploads

The admin interface supports image uploads for stories.

The upload flow is:

```text
Admin
  |
  v
ImageUploader
  |
  v
Upload API
  |
  v
Backend Upload Service
  |
  v
Stored Image
  |
  v
Story Image URL
```

Upload operations are protected as administrative operations.

---

# 17. Reusable Components

The project uses reusable components to reduce duplication.

Important components include:

- `Navbar`
- `PostCard`
- `StoryForm`
- `RichTextEditor`
- `ImageUploader`
- `TagInput`
- `Pagination`
- `ProtectedRoute`
- `AdminStoryList`
- `AdminCommentList`
- `AdminStatCard`
- `LoadingState`
- `ErrorState`
- `EmptyState`
- `Skeleton`
- `StoryCardSkeleton`

This allows page components to focus primarily on page-level behavior.

---

# 18. Database and Migrations

The production database is PostgreSQL.

Database access is handled through SQLAlchemy.

Database schema changes are tracked using migrations.

Relevant migration areas include:

- Post indexes
- Publication status
- Comment moderation status
- Story image URLs

Conceptually:

```text
Application Model Change
        |
        v
Migration
        |
        v
Database Schema
```

This makes schema changes reproducible across environments.

---

# 19. Testing

The backend uses pytest.

Test areas include:

- Authentication
- Authorization
- Post CRUD
- Draft/publish behavior
- Comments
- Comment moderation
- Reactions
- Uploads
- RSS
- Additional stories

Test organization:

```text
backend/tests/
├── conftest.py
├── test_auth.py
├── test_posts.py
├── test_comments.py
├── test_reactions.py
├── test_upload.py
├── test_rss.py
└── test_additional_stories.py
```

Run the backend test suite with:

```bash
cd backend
pytest -v
```

---

# 20. CI

The repository includes GitHub Actions for backend testing.

The workflow:

```text
Git Push / Pull Request
          |
          v
   GitHub Actions
          |
          v
 Install Dependencies
          |
          v
       Pytest
          |
          v
     Pass / Fail
```

The CI workflow uses Python 3.12 and executes:

```bash
pytest -v
```

---

# 21. Local Development

## Prerequisites

Install:

- Node.js
- npm
- Python
- PostgreSQL or a suitable local/test database configuration
- Git

---

## Clone the repository

```bash
git clone https://github.com/bendisuresh/zero-to-hero-blogs.git
cd zero-to-hero-blogs
```

---

## Backend setup

```bash
cd backend
python -m venv venv
```

Windows:

```cmd
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the backend environment using:

```text
backend/.env.example
```

Start the backend according to the project's application entry point.

---

## Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will provide the local frontend URL.

---

# 22. Useful Commands

## Frontend

```bash
cd frontend
npm install
npm run dev
npm run lint
npm run build
```

## Backend

```bash
cd backend
pip install -r requirements.txt
pytest -v
```

---

# 23. API Overview

## Authentication

```text
POST /api/auth/login
```

Used to authenticate an administrative user.

---

## Public Posts

```text
GET /api/posts
GET /api/posts/:id
```

Used to retrieve public blog content.

---

## Admin Posts

Administrative story operations are protected.

Conceptually:

```text
POST   /api/admin/posts
PATCH  /api/admin/posts/:id
DELETE /api/admin/posts/:id
```

---

## Comments

Public comment creation and approved-comment retrieval are available through
the comments API.

Administrative comment moderation is protected.

---

## Reactions

The application supports story reactions such as likes and dislikes.

---

## Uploads

Image upload operations are available through protected administrative API
routes.

---

## RSS

The application exposes an RSS feed for published content.

---

# 24. Security Practices

The project follows several security practices:

- JWT-based authentication
- Server-side authorization
- Admin-only protected operations
- Environment variables for secrets
- `.env` files excluded from Git
- Production database credentials kept outside source code
- Backend validation
- Sanitization support through Bleach
- CORS configuration
- Protected image upload operations

Sensitive local files such as:

```text
.env
venv/
node_modules/
dist/
uploads/
```

are excluded from source control where appropriate.

---

# 25. Engineering Decisions

## Why React?

React provides reusable UI components and supports a clear separation between
pages and reusable interface elements.

## Why Flask?

Flask provides a lightweight Python API foundation and works well with a
modular Blueprint and service architecture.

## Why PostgreSQL?

PostgreSQL provides a production-oriented relational database suitable for
structured content, relationships, indexing, and scalable querying.

## Why SQLAlchemy?

SQLAlchemy provides an ORM abstraction and keeps database access organized
through Python models and queries.

## Why JWT?

JWT allows the API to authenticate protected requests without maintaining
traditional server-side session state for every request.

## Why a service layer?

A service layer keeps business logic separate from HTTP route handling.

## Why reusable React components?

Reusable components reduce duplication and make UI behavior easier to maintain.

## Why automated tests?

Automated tests provide repeatable verification of authentication, CRUD,
moderation, reactions, uploads, RSS, and other backend behavior.

---

# 26. Project Evolution

The project evolved from a simpler full-stack application into a more modular
architecture.

### Initial concept

```text
React
  |
Flask
  |
SQLite
```

### Current architecture

```text
React
  |
Reusable Components + Hooks
  |
REST API
  |
Flask Blueprints
  |
Validation / Schemas
  |
Service Layer
  |
SQLAlchemy
  |
PostgreSQL / Neon
```

The refactoring focused on:

- Security
- Maintainability
- Testability
- Reusability
- Separation of concerns
- Production readiness

---

# 27. Interview Discussion Points

This project can be used to demonstrate practical understanding of:

### Frontend

- React component architecture
- React Router
- Authentication state
- Reusable components
- Custom hooks
- API integration
- Loading/error/empty states
- Skeleton loaders
- Responsive CSS
- Form handling
- Rich-text editing

### Backend

- REST API design
- Flask Blueprints
- JWT authentication
- Role-based authorization
- Validation
- Service-layer architecture
- SQLAlchemy
- CRUD operations
- Pagination
- Database indexing
- File uploads
- Comment moderation

### Database

- PostgreSQL
- Relational data modeling
- ORM usage
- Migrations
- Indexes
- Paginated queries

### Testing

- pytest
- Test fixtures
- Authentication tests
- Authorization tests
- CRUD tests
- API behavior tests

### DevOps

- Git
- GitHub
- GitHub Actions
- Vercel
- Render
- Neon
- Environment variables
- Production configuration

---

# 28. Common Interview Questions

## Q1. Why did you separate routes and services?

Routes are responsible for handling HTTP concerns, while services contain
business logic. This makes the code easier to test, reuse, and maintain.

---

## Q2. How do you protect admin APIs?

The request includes a JWT. The backend verifies the token and checks the
user's administrative authorization before allowing protected operations.

---

## Q3. What happens if a normal user calls an admin endpoint?

The backend rejects the request because authentication and authorization are
checked server-side.

The frontend cannot be treated as the security boundary.

---

## Q4. How does pagination work?

The client sends page and limit parameters. The backend performs pagination
at the database query level and returns both the requested records and
pagination metadata.

---

## Q5. How do you handle comments?

New comments enter a pending moderation state. Administrators can approve or
reject them. Only approved comments are exposed publicly.

---

## Q6. Why use a service layer?

It prevents route handlers from becoming large and tightly coupled to business
logic. It also makes business operations easier to test independently.

---

## Q7. Why PostgreSQL instead of SQLite in production?

PostgreSQL is designed for production relational workloads and provides
stronger capabilities for concurrent applications, indexing, relationships,
and deployment environments.

SQLite remains useful for local or test scenarios where appropriate.

---

## Q8. How does the frontend communicate with the backend?

The React application sends HTTP REST requests to the Flask API and receives
JSON responses.

---

## Q9. How do you handle loading states?

The application uses reusable loading components and skeleton loaders instead
of leaving the interface blank while asynchronous requests are running.

---

## Q10. How is the project tested?

The backend uses pytest with dedicated test modules and fixtures. GitHub
Actions runs the backend test suite automatically in CI.

---

# 29. Screenshots

Recommended screenshots for the final project documentation:

```text
docs/
└── screenshots/
    ├── home.png
    ├── story-reading.png
    ├── admin-login.png
    ├── admin-dashboard.png
    ├── create-story.png
    ├── edit-story.png
    └── comment-moderation.png
```

Screenshots should demonstrate both the public blog experience and the admin
CMS.

---

# 30. Architecture Documentation

Detailed architecture documents are stored here:

```text
docs/
└── architecture/
    ├── system-architecture.md
    └── deployment-architecture.md
```

These documents contain Mermaid diagrams for:

- System architecture
- Backend architecture
- Frontend architecture
- Request flow
- Authentication
- Draft/publish
- Comment moderation
- Pagination
- CI
- Production deployment

---

# 31. Current Project Status

The project has implemented:

- Public blogging experience
- Admin authentication
- Protected admin CRUD
- Draft/publish workflow
- Comment moderation
- Reactions
- Views
- Image uploads
- Tags/categories
- Search/filtering
- Pagination
- RSS
- Reusable frontend architecture
- Skeleton loaders
- Responsive UI
- Backend automated tests
- GitHub Actions CI
- Production deployment architecture
- Security/repository cleanup
- Architecture documentation

---

# 32. Future Improvements

Possible future improvements include:

- Richer analytics
- Advanced content search
- Additional caching
- Automated database backups
- More granular user roles
- Advanced media management
- More comprehensive frontend tests
- Performance monitoring
- Application observability
- Additional accessibility testing

---

# 33. Portfolio Summary

**Zero to Hero Blogs** demonstrates a complete full-stack development
workflow:

```text
Requirements
    |
    v
React UI
    |
    v
REST API
    |
    v
Authentication
    |
    v
Business Logic
    |
    v
Database
    |
    v
Automated Tests
    |
    v
CI
    |
    v
Production Deployment
```

The project is structured to demonstrate not only feature development, but
also security, testing, maintainability, architecture, and deployment
practices expected from a modern full-stack application.

---

## Author

**Bendi Suresh**

M.Tech — Data Science

GitHub:
https://github.com/bendisuresh/zero-to-hero-blogs
