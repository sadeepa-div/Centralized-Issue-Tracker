# BugFlow - Centralized Issue & Bug Tracking System

BugFlow is a full-stack web application for managing software projects, issues, assignments, comments, and issue progress from one centralized workspace. The project was developed as a Web Application Development mini project and demonstrates full CRUD operations, RESTful APIs, authentication, role-based access control, persistent MongoDB storage, validation, responsive UI, and version control.

## Core Features

- User registration and login with JWT authentication
- Role-based users: Admin, Project Manager, Developer, Tester
- Protected routes and backend role authorization
- Project creation and project detail views
- Add/remove project members
- Full Issue CRUD: Create, Read, Update, Delete
- Issue types: Bug, Task, Feature
- Priorities: Low, Medium, High, Critical
- Status workflow: Open, In Progress, Testing, Resolved, Closed
- Assign issues to Developers who belong to the project
- Role-aware issue status permissions
- My Issues page for role-specific work queues
- Search and filter issues by status, priority, project and assignee
- Issue comments
- Dashboard statistics and recent issues
- Project progress information
- Profile page and logout
- Toast notifications and user-friendly error messages
- Responsive React interface

## CRUD Requirement Mapping

The main CRUD entity is **Issue**.

| CRUD operation | Implementation |
|---|---|
| Create | Authenticated users can create new issues through the Create Issue form. |
| Read | Users can list issues, open issue details, search and filter records. |
| Update | Admins and Project Managers can edit issues; authorized roles can update issue status according to workflow rules. |
| Delete | Admins and Project Managers can safely delete issues. |

Projects also support create/read/delete operations, while project membership can be added and removed.

## Technology Stack

### Frontend
- React 19
- Vite
- React Router
- Lucide React icons
- CSS

### Backend
- Node.js
- Express.js
- JWT authentication
- bcryptjs password hashing
- CORS

### Database
- MongoDB
- Mongoose ODM

## Project Structure

```text
Centralized-Issue-Tracker/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── README.md
```

## Database Design

BugFlow uses four main MongoDB collections:

- **User** - stores user name, email, hashed password, role and timestamps.
- **Project** - stores project details, creator and project members.
- **Issue** - stores issue details, project reference, reporter, assignee, type, priority and status.
- **Comment** - stores comments linked to an issue and the user who created the comment.

### Main Relationships

- One User can create multiple Projects.
- A Project can contain multiple Users as members.
- One Project can contain multiple Issues.
- One User can report multiple Issues.
- One Developer can be assigned multiple Issues.
- One Issue can contain multiple Comments.
- One User can create multiple Comments.

## Role Permissions

| Role | Main permissions |
|---|---|
| Admin | Full project and issue management, assignment, status updates and member management. |
| Project Manager | Create/manage projects, manage project members, create/edit/delete issues, assign Developers and update status. |
| Developer | View assigned work, comment, and move assigned issues through Open / In Progress / Testing. |
| Tester | View Testing issues, comment, and move Testing issues to In Progress or Resolved. |

## API Overview

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`
- `DELETE /api/projects/:id`

### Issues
- `GET /api/issues`
- `GET /api/issues/my`
- `GET /api/issues/stats/summary`
- `POST /api/issues`
- `GET /api/issues/:id`
- `PATCH /api/issues/:id/status`
- `PATCH /api/issues/:id/assignee`
- `PATCH /api/issues/:id`
- `DELETE /api/issues/:id`

### Comments
- `GET /api/comments/:issueId`
- `POST /api/comments/:issueId`

### Users
- `GET /api/users/developers`
- `GET /api/users/team`
- `GET /api/users/project/:projectId/developers`

## Local Setup

### Prerequisites

Install:
- Node.js and npm
- MongoDB Community Server or use MongoDB Atlas
- Git

### 1. Clone the repository

```bash
git clone https://github.com/sadeepa-div/Centralized-Issue-Tracker.git
cd Centralized-Issue-Tracker
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_16_character_gmail_app_password
```

> Do not commit the real `.env` file to GitHub.
>
> Password reset email uses Gmail SMTP. Enable 2-Step Verification on the
> sending Google account, create a 16-character App Password, and use that
> value for `EMAIL_PASS` (not the account's normal sign-in password). Spaces
> in the displayed App Password are optional. `CLIENT_URL` must be the URL
> where the frontend is running so the reset link points to the right app.

Start the backend:

```bash
npm run dev
```

Expected output:

```text
MongoDB connected
Server running on port 5000
```

### 3. Configure the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

The frontend API configuration points to:

```text
http://127.0.0.1:5000/api
```

## Validation and Error Handling

The application includes both frontend and backend checks, including:

- Required input validation
- Email/password validation during authentication
- Duplicate user prevention
- Invalid project/issue handling
- Role-based authorization with 403 responses
- Project-member checks before issue assignment
- Duplicate project-member prevention
- Valid issue type, priority and status values through Mongoose enums
- Friendly toast/error messages in the frontend

## Security

- Passwords are hashed using bcryptjs.
- JWT tokens protect authenticated API routes.
- Backend middleware checks authenticated users and authorized roles.
- Sensitive environment variables are stored in `.env` and excluded from Git.

## Testing Performed

Manual functional testing covers:

- Registration and login
- Protected routes
- Admin workflow
- Project Manager workflow
- Developer workflow
- Tester workflow
- Project creation and member management
- Issue CRUD
- Assignment validation
- Issue status permissions
- Comments
- Search and filters
- Dashboard and profile
- Production frontend build

## UI Screenshots

Add final screenshots to your report and/or a `docs/screenshots/` folder, for example:

- Login page
- Dashboard
- Projects page
- Project details
- Issues page
- Create Issue form
- Issue details / comments
- My Issues page

## Notes for Demonstration

For the mini-project demonstration, focus on the working core features required by the rubric:

1. Login and dashboard
2. Create a project
3. Create an issue
4. Read/list/search/filter issues
5. Update an issue and change status
6. Delete an issue
7. Show role-based access using Developer or Tester
8. Briefly show MongoDB collections / relationships

## Author

Student: Rathnayaka R.M.S.D.
Index Number: EG/2023/5829 
Module: EC4307 Web Application Development
