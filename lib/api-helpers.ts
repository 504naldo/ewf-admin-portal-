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
async function callTRPC(procedure: string, input?: any, method: 'GET' | 'POST' = 'POST') {
  let response;
  
  if (method === 'GET') {
    // For queries, use GET with input as query params
    const params = input ? { input: JSON.stringify({ "0": { "json": input } }) } : {};
    response = await api.get(`/api/trpc/${procedure}`, { params });
  } else {
    // For mutations, use POST with input in body
    const requestBody = {
      "0": {
        "json": input || {}
      }
    };
    response = await api.post(`/api/trpc/${procedure}`, requestBody);
  }
  
  // tRPC GET responses: [{ result: { data: { json: actualData } } }]
  if (Array.isArray(response.data) && response.data[0]?.result?.data) {
    const data = response.data[0].result.data;
    // Unwrap the json wrapper if present
    return data.json !== undefined ? data.json : data;
  }
  
  // tRPC POST responses: { result: { data: { json: actualData } } }
  if (response.data?.result?.data) {
    const data = response.data.result.data;
    // Unwrap the json wrapper if present
    return data.json !== undefined ? data.json : data;
  }
  
  return response.data;
}

export async function listIncidents(params?: { status?: string; search?: string }) {
  // Use incidents.getAllOpen for listing all open incidents (GET query)
  return await callTRPC('incidents.getAllOpen', params, 'GET');
}

export async function getIncident(id: number) {
  return await callTRPC('incidents.getDetails', { id }, 'GET');
}

export async function updateIncident(id: number, data: Partial<Incident>) {
  return await callTRPC('incidents.updateStatus', {
    incidentId: id,
    status: data.status,
  });
}

export async function listTechnicians() {
  // Use users.getAllTechs for listing all technicians (GET query)
  return await callTRPC('users.getAllTechs', undefined, 'GET');
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
