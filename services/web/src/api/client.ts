import {
  type Book,
  type CreateBookInput,
  type UpdateBookStatusInput,
  type BookFilterQuery,
  type ApiResponse
} from '@readlist/contracts';

export class ApiError extends Error {
  public details?: Record<string, string[]>;
  public statusCode?: number;

  constructor(message: string, statusCode?: number, details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    };

    let response: Response;
    try {
      response = await fetch(url, { ...options, headers });
    } catch (networkErr) {
      throw new ApiError(
        networkErr instanceof Error ? networkErr.message : 'Network request failed'
      );
    }

    let payload: ApiResponse<T>;
    try {
      payload = await response.json();
    } catch {
      throw new ApiError(`Invalid server response from ${endpoint}`, response.status);
    }

    if (!response.ok || !payload.success) {
      throw new ApiError(
        payload.error || `HTTP error ${response.status}`,
        response.status,
        payload.details
      );
    }

    return payload.data as T;
  }

  async getBooks(filters?: BookFilterQuery): Promise<Book[]> {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.search && filters.search.trim().length > 0) {
      params.append('search', filters.search.trim());
    }

    const queryStr = params.toString();
    const endpoint = `/api/books${queryStr ? `?${queryStr}` : ''}`;
    return this.request<Book[]>(endpoint, { method: 'GET' });
  }

  async getBook(id: string): Promise<Book> {
    return this.request<Book>(`/api/books/${encodeURIComponent(id)}`, { method: 'GET' });
  }

  async createBook(input: CreateBookInput): Promise<Book> {
    return this.request<Book>('/api/books', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }

  async updateBookStatus(id: string, status: UpdateBookStatusInput['status']): Promise<Book> {
    return this.request<Book>(`/api/books/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async deleteBook(id: string): Promise<void> {
    await this.request<{ id: string }>(`/api/books/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }
}

export const apiClient = new ApiClient();
