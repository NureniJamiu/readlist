# ReadList

**Product Requirements Document (PRD)**

---

## 1. Overview

ReadList is a lightweight web application for tracking books a user wants to read. Users can add books, mark them as read, and filter their list, all without page reloads. The app targets a single-user, small-scope use case and prioritizes simplicity over the feature depth of larger platforms such as Goodreads.

## 2. Problem Statement

Readers collect book recommendations from friends, articles, and social media, but lack a simple, low-friction place to capture and track them. Existing tools (e.g., Goodreads) are often heavier than needed for someone who just wants a personal to-read list and a quick view of reading progress.

## 3. Target Users

- Casual readers who juggle recommendations from friends, articles, and social media
- Students & self-learners building a personal, low-effort reading backlog
- Minimalists who find apps like Goodreads too heavy for a simple to-read list

## 4. Value Proposition

A single, distraction-free place to capture book recommendations before they're forgotten, and to see progress toward a reading goal at a glance.

## 5. Goals & Success Criteria

- Users can add, view, update, and remove books with no page reloads
- Users can find a specific book quickly via search and status filters
- The experience remains lightweight: minimal setup, single-user, file-based storage

## 6. Functional Requirements

| # | Requirement | Description |
|---|---|---|
| 1 | Add a Book | Capture title, author, genre, and reading status via a form |
| 2 | View Books | Display all saved books with relevant book information |
| 3 | Update Reading Status | Change a book between Unread and Read |
| 4 | Delete a Book | Remove a book from the reading list |
| 5 | Search / Filter | Search by title or author; filter by reading status |

### 6.1 User Flow

Add Book → View List → Read Book → Mark as Read → Remove if desired

## 7. Interactivity & Dynamic Behavior

- **Add via Form:** a form collects title, author, genre, and reading status, and submits via a POST request to the backend
- **Filter & Search Without Reloading:** switching between All / Read / Unread, or searching by title or author, re-renders the list in place
- **Update Without Refreshing:** toggling reading status calls the API and updates the corresponding item in the UI immediately
- **Delete Without Refreshing:** removing a book calls the API and updates the displayed list without reloading the page

## 8. System Architecture

The browser renders the UI and calls the Express REST API (GET/POST/PATCH/DELETE) using `fetch()`. Express handles routing and business logic, then reads and writes book records in SQLite. Responses update the DOM directly, with no full page reload.

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React + Tailwind CSS | Component-based UI with utility-first styling; communicates with the API via `fetch()` |
| Backend | Node.js + Express | Lightweight REST API handling routing, validation, and business logic |
| Database | SQLite | Simple file-based, persistent storage — ideal for a single-user, small-scope project |

## 9. Non-Functional Considerations

- Lightweight footprint: no heavy dependencies, minimal setup
- Persistent storage via a file-based SQLite database
- Responsive, no-reload interactions for all core actions (add, update, delete, filter)

## 10. Out of Scope (Phase 1)

- Multi-user accounts / authentication
- Social features (sharing lists, following other readers)
- Reading goal tracking beyond a basic Read/Unread status

## 11. Open Questions

- Should reading status support more states than Unread/Read (e.g., In Progress)?
- Is pagination needed for large book lists, or is the scope small enough to skip it in Phase 1?