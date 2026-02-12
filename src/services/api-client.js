import { env } from '../config/env.js';

/**
 * Base API client - uses cookie auth from login (same origin).
 */
export class ApiClient {
  constructor(request, options = {}) {
    this.request = request;
    this.baseURL = options.baseURL || env.API_BASE_URL;
    this.baseWebURL = options.baseWebURL || env.BASE_URL;
  }

  async get(path, options = {}) {
    const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
    return this.request.get(url, {
      headers: { Accept: 'application/json', ...options.headers },
      ...options,
    });
  }

  async post(path, data, options = {}) {
    const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
    return this.request.post(url, {
      data,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...options.headers },
      ...options,
    });
  }

  async put(path, data, options = {}) {
    const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
    return this.request.put(url, {
      data,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...options.headers },
      ...options,
    });
  }

  async delete(path, options = {}) {
    const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
    return this.request.delete(url, {
      headers: { Accept: 'application/json', ...options.headers },
      ...options,
    });
  }
}
