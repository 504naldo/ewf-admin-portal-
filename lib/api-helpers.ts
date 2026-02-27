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

// Helper function to call tRPC endpoints with correct HTTP format
async function callTRPC(procedure: string, input?: any) {
  // tRPC HTTP format: { "0": { "json": inputData } }
  const requestBody = {
    "0": {
      "json": input || {}
    }
  };
  
  const response = await api.post(`/api/trpc/${procedure}`, requestBody);
  
  // tRPC wraps responses in [{ result: { data: ... } }]
  if (Array.isArray(response.data) && response.data[0]?.result?.data) {
    return response.data[0].result.data;
  }
  
  // Single response format: { result: { data: ... } }
  if (response.data?.result?.data) {
    return response.data.result.data;
  }
  
  return response.data;
}

export async function listIncidents(params?: { status?: string; search?: string }) {
  return await callTRPC('admin.getAllIncidents', params);
}

export async function getIncident(id: number) {
  return await callTRPC('incidents.getDetails', { id });
}

export async function updateIncident(id: number, data: Partial<Incident>) {
  return await callTRPC('incidents.updateStatus', {
    incidentId: id,
    status: data.status,
  });
}

export async function listTechnicians() {
  return await callTRPC('admin.getAllUsers');
}

export async function updateTechnician(id: number, data: Partial<Technician>) {
  return await callTRPC('admin.updateUser', {
    userId: id,
    ...data,
  });
}

export async function listReports(params?: { incident_id?: number }) {
  return [];
}

export async function createIncident(data: {
  building_id: string;
  description: string;
  priority: string;
  assigned_technician_id?: number;
  site?: string;
  incident_type?: string;
  caller_name?: string;
  caller_phone?: string;
  trigger_routing?: boolean;
}) {
  return await callTRPC('incidents.createManual', {
    buildingId: data.building_id,
    site: data.site || data.building_id,
    incidentType: data.incident_type || 'Manual Incident',
    description: data.description,
    priority: data.priority,
    callerName: data.caller_name,
    callerPhone: data.caller_phone,
    assignedTechId: data.assigned_technician_id,
    triggerRouting: data.trigger_routing || false,
  });
}
