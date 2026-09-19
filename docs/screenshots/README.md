# Zero to Hero Blogs — Screenshot Documentation

This folder contains the screenshots used to document the final project UI.

The screenshots should be captured from the real running application. Do not
use mock or placeholder screenshots.

---

## Recommended Screenshot Set

| # | Filename | Screen | Purpose |
|---|---|---|---|
| 1 | `home.png` | Home page | Demonstrates the public blog landing experience |
| 2 | `story-reading.png` | Story reading page | Demonstrates the complete article-reading experience |
| 3 | `admin-login.png` | Admin login | Demonstrates protected administration access |
| 4 | `admin-dashboard.png` | Admin dashboard | Demonstrates the CMS/admin management interface |
| 5 | `create-story.png` | Create story | Demonstrates story creation and rich-text editing |
| 6 | `edit-story.png` | Edit story | Demonstrates editing and draft/publish workflow |
| 7 | `comment-moderation.png` | Comment moderation | Demonstrates the moderation workflow |
| 8 | `mobile-responsive.png` | Mobile view | Demonstrates responsive design |

---

# 1. Home Page

### Filename

```text
home.png
```

### Capture

Capture the public home page showing:

- Navigation
- Hero/content area
- Blog cards
- Categories/tags where visible
- Search/filter controls where applicable
- Overall visual design

### Why it matters

This is the first visual representation of the application and demonstrates
the public-facing UI.

---

# 2. Story Reading Page

### Filename

```text
story-reading.png
```

### Capture

Open a real published story and capture:

- Breadcrumb/navigation
- Story title
- Story metadata
- Reading time
- Main story content
- Tags
- Reactions
- Comments
- Related/additional stories where visible

### Why it matters

This demonstrates the core content-reading experience.

---

# 3. Admin Login

### Filename

```text
admin-login.png
```

### Capture

Capture the administrator login page.

Do not include:

- Real passwords
- API keys
- JWT tokens
- Database credentials
- Other secrets

### Why it matters

This demonstrates the entry point to the protected CMS.

---

# 4. Admin Dashboard

### Filename

```text
admin-dashboard.png
```

### Capture

After authenticating as the administrator, capture:

- Dashboard statistics
- Story management
- Draft/published information
- Search/filter controls
- Pagination where visible
- Comment management access
- Main administrative navigation

### Why it matters

This demonstrates the CMS portion of the project.

---

# 5. Create Story

### Filename

```text
create-story.png
```

### Capture

Capture the create-story screen showing:

- Story title input
- Rich-text editor
- Category/tag inputs
- Image uploader
- Save draft / publish controls
- Relevant form structure

Use realistic sample content, but do not include private information.

### Why it matters

This demonstrates the content-authoring workflow.

---

# 6. Edit Story

### Filename

```text
edit-story.png
```

### Capture

Open an existing story in the admin editor.

Show:

- Existing title
- Existing content
- Tags/categories
- Publication status
- Save/update controls

### Why it matters

This demonstrates that the platform supports content lifecycle management,
not just creation.

---

# 7. Comment Moderation

### Filename

```text
comment-moderation.png
```

### Capture

Open the admin comment-management interface.

Show:

- Pending comment
- Comment status
- Approve action
- Reject action
- Delete action where appropriate

Do not include personal information from real users.

### Why it matters

This demonstrates the moderation workflow implemented in the backend and
admin UI.

---

# 8. Mobile Responsive View

### Filename

```text
mobile-responsive.png
```

### Capture

Use browser developer tools or a real mobile device.

Capture a representative public page showing:

- Responsive navigation
- Story cards/content
- Proper spacing
- No horizontal overflow
- Mobile-friendly layout

### Why it matters

This demonstrates responsive frontend implementation.

---

# Screenshot Quality Checklist

Before adding a screenshot to the repository:

- [ ] Use the real application
- [ ] Use realistic sample content
- [ ] No passwords visible
- [ ] No JWT tokens visible
- [ ] No API keys visible
- [ ] No database credentials visible
- [ ] No private user information visible
- [ ] Browser zoom is approximately 100%
- [ ] Important UI is clearly visible
- [ ] No unrelated windows are visible
- [ ] Screenshot has a useful filename
- [ ] Image is cropped cleanly

---

# Suggested README Placement

The root `README.md` can reference the screenshots like this:

```markdown
## Screenshots

### Home Page

![Home Page](docs/screenshots/home.png)

### Story Reading

![Story Reading](docs/screenshots/story-reading.png)

### Admin Dashboard

![Admin Dashboard](docs/screenshots/admin-dashboard.png)

### Create Story

![Create Story](docs/screenshots/create-story.png)

### Comment Moderation

![Comment Moderation](docs/screenshots/comment-moderation.png)

### Mobile Responsive

![Mobile Responsive](docs/screenshots/mobile-responsive.png)
```

---

# Recommended Capture Order

Capture screenshots in this order:

```text
1. Home
      ↓
2. Published Story
      ↓
3. Admin Login
      ↓
4. Admin Dashboard
      ↓
5. Create Story
      ↓
6. Edit Story
      ↓
7. Comment Moderation
      ↓
8. Mobile Responsive
```

This follows the natural user journey through the application.

---

# Screenshot Directory

Final directory:

```text
docs/
├── architecture/
│   ├── system-architecture.md
│   └── deployment-architecture.md
│
└── screenshots/
    ├── README.md
    ├── home.png
    ├── story-reading.png
    ├── admin-login.png
    ├── admin-dashboard.png
    ├── create-story.png
    ├── edit-story.png
    ├── comment-moderation.png
    └── mobile-responsive.png
```

The PNG files should only be added after the corresponding real screens have
been captured and verified.

---

# Important

Do not add fake screenshots just to fill the directory.

A smaller set of genuine, clean screenshots is better for a portfolio and
technical interview than a larger set of placeholder images.
