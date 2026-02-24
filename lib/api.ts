import type {
  User,
  Incident,
  CreateIncidentInput,
  UpdateIncidentInput,
  LoginResponse,
  CalendarEventResponse,
} from './types';
import { getToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/api/me');
  }

  // Incidents
  async listIncidents(params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<Incident[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString();
    return this.request<Incident[]>(
      `/api/incidents${queryString ? `?${queryString}` : ''}`
    );
  }

  async getIncident(id: number): Promise<Incident> {
    return this.request<Incident>(`/api/incidents/${id}`);
  }

  async createIncident(data: CreateIncidentInput): Promise<Incident> {
    return this.request<Incident>('/api/incidents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateIncident(
    id: number,
    data: UpdateIncidentInput
  ): Promise<Incident> {
    return this.request<Incident>(`/api/incidents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async addIncidentNote(id: number, note: string): Promise<void> {
    return this.request<void>(`/api/incidents/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  }

  // Technicians
  async listTechnicians(): Promise<User[]> {
    return this.request<User[]>('/api/technicians');
  }

  // Reports
  async listReports(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<Incident[]> {
    const query = new URLSearchParams();
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);

    const queryString = query.toString();
    return this.request<Incident[]>(
      `/api/reports${queryString ? `?${queryString}` : ''}`
    );
  }

  // Calendar
  async createCalendarEvent(incidentId: number): Promise<CalendarEventResponse> {
    return this.request<CalendarEventResponse>('/api/calendar/events', {
      method: 'POST',
      body: JSON.stringify({ incidentId }),
    });
  }
}

export const api = new APIClient(API_BASE_URL);
