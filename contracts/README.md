# @readlist/contracts

Shared TypeScript domain interfaces, validation rules, and schema contracts used across the ReadList API and Web services.

## Exports
- Types: `Book`, `CreateBookInput`, `UpdateBookStatusInput`, `BookFilterQuery`, `ApiResponse<T>`, `ValidationResult<T>`.
- Functions: `validateCreateBook`, `validateUpdateStatus`, `validateFilterQuery`.

## Testing & Quality Assurance
- **Gate tests**: `npm test` (<200ms)
- **Evals**: `npm run eval`
