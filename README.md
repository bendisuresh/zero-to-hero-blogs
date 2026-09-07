# Zero to Hero Blogs

Zero to Hero Blogs is a full-stack platform where people can discover and share real stories about how they started their journey from zero and worked toward success.

## Problem Statement

It is difficult to find structured stories about how successful, wealthy, business, and other inspiring people actually started their journey.

Many websites provide information about successful people, but their complete journey is often not available in one structured place.

Even when these stories are available, they are usually:

- Scattered across different websites and platforms.
- Difficult to search and discover.
- Not presented in a consistent and structured format.
- Difficult to find together in one place.
- Missing a simple way to contact the person who shared the story.

Because of this, users who want to learn how people started from zero or from very limited resources have to search through many different sources.

## Solution

I built Zero to Hero Blogs to bring these stories together in one platform.

The platform allows successful people, business professionals, working professionals, and other inspiring individuals to share their journey in a structured format.

A story can include:

- Starting point
- How they started
- Financial journey
- Their approach
- How their life changed
- Failures
- Lessons learned
- Tags
- Contact information

Users can easily search and explore these stories in one place and learn how different people started their journey from zero or from very limited resources.

The platform also allows users to contact storytellers through their provided email address.

## Features

### Public Features

- Browse stories
- Search stories
- Category-based stories
- Individual story pages
- View counter
- Like and dislike feedback
- Comments
- Contact storyteller
- Tags
- Additional stories
- RSS feed

### Admin Features

- Admin authentication
- JWT-based authorization
- Admin dashboard
- Create stories
- Edit stories
- Delete stories
- Rich text editor
- Image upload
- Add additional stories
- Comment moderation

## Categories

Stories are organized into:

- Business
- Job
- Investment
- Other

## Tech Stack

### Frontend

- JavaScript
- React.js
- React Router
- Vite
- Tiptap
- CSS

### Backend

- Python
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- Bleach

### Database

- PostgreSQL
- Neon PostgreSQL

### Deployment

- Vercel - Frontend
- Render - Backend
- Neon - Database

## Application Architecture

                    Users
                      |
                      v
                React Frontend
                    Vercel
                      |
                      | REST API
                      v
                Flask Backend
                    Render
                      |
                      v
                  PostgreSQL
                     Neon