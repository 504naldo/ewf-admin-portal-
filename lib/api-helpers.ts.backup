import api from './api';

export interface Incident {
  id: number;
  building_id: string;
  description: string;
  status: string;
  priority: string;
  assigned_technician_id?: number;
  created_at: string;
  updated_at: string;
  technician?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Technician {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_available: boolean;
  role: string;
}

export interface Report {
  id: number;
  incident_id: number;
  technician_id: number;
  description: string;
  billable_hours: number;
  created_at: string;
  incident?: Incident;
  technician?: Technician;
}

export async function listIncidents(params?: { status?: string; search?: string }) {
  const response = await api.get('/api/incidents', { params });
  return response.data;
}

export async function getIncident(id: number) {
  const response = await api.get(`/api/incidents/${id}`);
  return response.data;
}

export async function updateIncident(id: number, data: Partial<Incident>) {
  const response = await api.put(`/api/incidents/${id}`, data);
  return response.data;
}

export async function listTechnicians() {
  const response = await api.get('/api/technicians');
  return response.data;
}

export async function updateTechnician(id: number, data: Partial<Technician>) {
  const response = await api.put(`/api/technicians/${id}`, data);
  return response.data;
}

export async function listReports(params?: { incident_id?: number }) {
  const response = await api.get('/api/reports', { params });
  return response.data;
}

export async function createIncident(data: {
  building_id: string;
  description: string;
  priority: string;
  assigned_technician_id?: number;
}) {
  const response = await api.post('/api/incidents', data);
  return response.data;
}
