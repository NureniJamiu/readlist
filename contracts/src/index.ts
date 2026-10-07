/**
 * Shared domain models, contracts, and validation rules for ReadList.
 */

export type ReadingStatus = 'unread' | 'read';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: ReadingStatus;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export interface CreateBookInput {
  title: string;
  author: string;
  genre: string;
  status?: ReadingStatus;
}

export interface UpdateBookStatusInput {
  status: ReadingStatus;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  genre?: string;
  status?: ReadingStatus;
}

export interface BookFilterQuery {
  search?: string;
  status?: 'all' | ReadingStatus;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}

export interface ValidationResult<T> {
  isValid: boolean;
  errors: Record<string, string[]>;
  value?: T;
}

/**
 * Validates payload for creating a new book.
 */
export function validateCreateBook(input: unknown): ValidationResult<CreateBookInput> {
  const errors: Record<string, string[]> = {};

  if (!input || typeof input !== 'object') {
    return {
      isValid: false,
      errors: { _general: ['Input must be a valid object'] }
    };
  }

  const raw = input as Record<string, unknown>;

  // Title validation
  if (typeof raw.title !== 'string' || raw.title.trim().length === 0) {
    errors.title = ['Title is required and cannot be empty'];
  } else if (raw.title.trim().length > 200) {
    errors.title = ['Title must be less than 200 characters'];
  }

  // Author validation
  if (typeof raw.author !== 'string' || raw.author.trim().length === 0) {
    errors.author = ['Author is required and cannot be empty'];
  } else if (raw.author.trim().length > 150) {
    errors.author = ['Author must be less than 150 characters'];
  }

  // Genre validation
  if (typeof raw.genre !== 'string' || raw.genre.trim().length === 0) {
    errors.genre = ['Genre is required and cannot be empty'];
  } else if (raw.genre.trim().length > 100) {
    errors.genre = ['Genre must be less than 100 characters'];
  }

  // Status validation (optional, defaults to 'unread')
  let status: ReadingStatus = 'unread';
  if (raw.status !== undefined && raw.status !== null) {
    if (raw.status !== 'unread' && raw.status !== 'read') {
      errors.status = ["Status must be either 'unread' or 'read'"];
    } else {
      status = raw.status as ReadingStatus;
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    value: isValid
      ? {
          title: (raw.title as string).trim(),
          author: (raw.author as string).trim(),
          genre: (raw.genre as string).trim(),
          status
        }
      : undefined
  };
}

/**
 * Validates payload for updating reading status.
 */
export function validateUpdateStatus(input: unknown): ValidationResult<UpdateBookStatusInput> {
  const errors: Record<string, string[]> = {};

  if (!input || typeof input !== 'object') {
    return {
      isValid: false,
      errors: { _general: ['Input must be a valid object'] }
    };
  }

  const raw = input as Record<string, unknown>;

  if (raw.status !== 'unread' && raw.status !== 'read') {
    errors.status = ["Status must be either 'unread' or 'read'"];
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    value: isValid ? { status: raw.status as ReadingStatus } : undefined
  };
}

/**
 * Validates payload for updating a book.
 * At least one valid field (title, author, genre, or status) must be provided.
 */
export function validateUpdateBook(input: unknown): ValidationResult<UpdateBookInput> {
  const errors: Record<string, string[]> = {};

  if (!input || typeof input !== 'object') {
    return {
      isValid: false,
      errors: { _general: ['Input must be a valid object'] }
    };
  }

  const raw = input as Record<string, unknown>;
  const value: UpdateBookInput = {};
  let fieldsProvided = 0;

  // Title validation
  if (raw.title !== undefined) {
    fieldsProvided++;
    if (typeof raw.title !== 'string' || raw.title.trim().length === 0) {
      errors.title = ['Title cannot be empty'];
    } else if (raw.title.trim().length > 200) {
      errors.title = ['Title must be less than 200 characters'];
    } else {
      value.title = raw.title.trim();
    }
  }

  // Author validation
  if (raw.author !== undefined) {
    fieldsProvided++;
    if (typeof raw.author !== 'string' || raw.author.trim().length === 0) {
      errors.author = ['Author cannot be empty'];
    } else if (raw.author.trim().length > 150) {
      errors.author = ['Author must be less than 150 characters'];
    } else {
      value.author = raw.author.trim();
    }
  }

  // Genre validation
  if (raw.genre !== undefined) {
    fieldsProvided++;
    if (typeof raw.genre !== 'string' || raw.genre.trim().length === 0) {
      errors.genre = ['Genre cannot be empty'];
    } else if (raw.genre.trim().length > 100) {
      errors.genre = ['Genre must be less than 100 characters'];
    } else {
      value.genre = raw.genre.trim();
    }
  }

  // Status validation
  if (raw.status !== undefined) {
    fieldsProvided++;
    if (raw.status !== 'unread' && raw.status !== 'read') {
      errors.status = ["Status must be either 'unread' or 'read'"];
    } else {
      value.status = raw.status as ReadingStatus;
    }
  }

  if (fieldsProvided === 0) {
    errors._general = ['At least one field must be provided to update'];
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    value: isValid ? value : undefined
  };
}

/**
 * Normalizes and validates query parameters for filtering book list.
 */
export function validateFilterQuery(query: unknown): BookFilterQuery {
  if (!query || typeof query !== 'object') {
    return { status: 'all' };
  }

  const raw = query as Record<string, unknown>;
  const result: BookFilterQuery = {};

  if (typeof raw.search === 'string') {
    const trimmed = raw.search.trim();
    if (trimmed.length > 0) {
      result.search = trimmed;
    }
  }

  if (raw.status === 'unread' || raw.status === 'read') {
    result.status = raw.status;
  } else {
    result.status = 'all';
  }

  return result;
}
