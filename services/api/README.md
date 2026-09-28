# @readlist/api

Lightweight Express REST API and file-based SQLite database repository for ReadList.

## Endpoints
- `GET /api/health` - Service health status
- `GET /api/books` - List books with optional `?search=` and `?status=all|read|unread`
- `GET /api/books/:id` - Fetch single book by ID
- `POST /api/books` - Add a new book
- `PATCH /api/books/:id/status` - Update reading status (`read` | `unread`)
- `DELETE /api/books/:id` - Remove a book

## Database
Uses `better-sqlite3` file-based database (`readlist.db` with WAL mode enabled). Supports in-memory database (`:memory:`) for instantaneous isolated testing.

## Testing & Quality Assurance
- **Gate tests**: `npm test` (<2s deterministic)
- **Evals**: `npm run eval`
