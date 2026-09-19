# Zero to Hero Blogs — System Architecture

## 1. Production Architecture

```mermaid
flowchart LR
    U[User / Admin Browser]

    V[Vercel<br/>React + Vite]
    R[Render<br/>Flask API + Gunicorn]
    N[(Neon<br/>PostgreSQL)]

    U -->|HTTPS| V
    V -->|REST / JSON| R
    R -->|SQLAlchemy / PostgreSQL| N
    N -->|Query Results| R
    R -->|JSON Response| V
    V -->|Web UI| U
```

---

## 2. Application Architecture

```mermaid
flowchart TD
    UI[React Pages]
    C[Reusable Components]
    H[Custom Hooks / Auth State]
    API[apiFetch / API Layer]

    B[Flask Application]
    BP[Flask Blueprints]
    AUTH[JWT Authentication & Authorization]
    S[Validation / Schemas]
    SV[Service Layer]
    ORM[SQLAlchemy]
    DB[(PostgreSQL / Neon)]

    UI --> C
    UI --> H
    C --> H
    C --> API
    H --> API

    API -->|HTTP REST / JSON| B
    B --> BP
    BP --> AUTH
    BP --> S
    BP --> SV
    AUTH --> SV
    S --> SV
    SV --> ORM
    ORM --> DB
```

---

## 3. Request Flow

```mermaid
sequenceDiagram
    participant User
    participant React
    participant Flask
    participant Auth as JWT/Auth
    participant Service
    participant DB as PostgreSQL

    User->>React: Perform action
    React->>Flask: HTTP request
    Flask->>Auth: Validate token / permissions
    Auth-->>Flask: Authorized
    Flask->>Service: Business operation
    Service->>DB: Query / Insert / Update / Delete
    DB-->>Service: Database result
    Service-->>Flask: Processed result
    Flask-->>React: JSON response
    React-->>User: Updated UI
```

---

## 4. Public Blog Flow

```mermaid
flowchart LR
    A[Visitor] --> B[React Home]
    B --> C[GET /api/posts]
    C --> D[Flask Posts Route]
    D --> E[Post Service]
    E --> F[(PostgreSQL)]
    F --> E
    E --> D
    D --> C
    C --> B
    B --> G[Published Stories]
```

Public story listing uses published content for public users.

---

## 5. Admin Flow

```mermaid
flowchart TD
    A[Admin Login]
    B[JWT Token]
    C[Protected Admin Route]
    D[Authorization]
    E[Service Layer]
    F[(PostgreSQL)]

    A --> B
    B --> C
    C --> D
    D -->|Admin| E
    E --> F
    F --> E
    E --> C
```

Administrative operations include:

- Create story
- Update story
- Delete story
- Save draft
- Publish story
- Upload images
- Moderate comments
- View dashboard data

---

## 6. Draft / Publish Flow

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Published: Admin publishes
    Published --> Draft: Admin unpublishes / edits
    Draft --> [*]: Delete
    Published --> [*]: Delete
```

Public users see published stories, while administrators can manage drafts and
published stories.

---

## 7. Comment Moderation Flow

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Approved: Admin approves
    Pending --> Rejected: Admin rejects
    Approved --> Rejected: Admin rejects
    Rejected --> Approved: Admin approves
    Approved --> [*]: Delete
    Rejected --> [*]: Delete
```

New comments enter the moderation workflow before public display.

---

## 8. Frontend Structure

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

---

## 9. Backend Structure

```text
backend/
├── app.py
├── database.py
├── models.py
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

## 10. Security Architecture

```mermaid
flowchart TD
    R[Incoming Request]
    J[JWT Verification]
    I[User Identity]
    A[Authorization Check]
    P[Protected Operation]
    X[401 / 403 Response]

    R --> J
    J -->|Invalid / Missing| X
    J -->|Valid| I
    I --> A
    A -->|Not Allowed| X
    A -->|Allowed| P
```

The application distinguishes:

- **401 Unauthorized** — authentication is missing or invalid.
- **403 Forbidden** — the authenticated user does not have the required
  permission.

Administrative story creation, editing, deletion, uploads, and moderation are
protected by authentication and authorization.

---

## 11. Pagination Architecture

```mermaid
flowchart LR
    U[React UI]
    Q[Query Parameters<br/>page + limit]
    API[Flask API]
    S[Post Service]
    DB[(PostgreSQL)]

    U --> Q
    Q --> API
    API --> S
    S --> DB
    DB --> S
    S --> API
    API --> U
```

Example:

```text
GET /api/posts?page=1&limit=10
```

The API returns pagination metadata so the frontend can render navigation
controls without loading every story into the browser.

---

## 12. Testing and CI

```mermaid
flowchart LR
    D[Developer]
    G[Git Push / Pull Request]
    GH[GitHub]
    CI[GitHub Actions]
    P[Pytest]
    R[Pass / Fail]

    D --> G
    G --> GH
    GH --> CI
    CI --> P
    P --> R
```

The backend test suite covers authentication, authorization, posts, comments,
reactions, uploads, RSS, and additional stories.

---

## 13. Architectural Principles

### Separation of Concerns
HTTP routing, validation, business logic, database access, and presentation are
kept in separate layers.

### Reusability
Common frontend behavior is implemented through reusable components and hooks.

### Security
JWT authentication and role-based authorization protect administrative
operations.

### Testability
Backend behavior is covered by automated pytest tests and CI.

### Maintainability
Blueprints and service modules keep the backend modular as features grow.

### Performance
Database-level pagination and indexes reduce unnecessary data processing.

---
