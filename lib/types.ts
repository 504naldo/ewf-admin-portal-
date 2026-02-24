export interface User {
  id: number;
  email: string;
  name: string;
  role: 'tech' | 'admin' | 'manager';
  availability?: 'available' | 'unavailable';
  lastSeenAt?: string;
}

export interface Incident {
  id: number;
  createdAt: string;
  status: 'new' | 'assigned' | 'in_progress' | 'resolved';
  buildingId: string;
  siteName: string;
  address: string;
  description: string;
  assignedTechId?: number;
  assignedTech?: User;
  notes?: IncidentNote[];
  reportPdfUrl?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  contactName?: string;
  contactPhone?: string;
}

export interface IncidentNote {
  id: number;
  incidentId: number;
  userId: number;
  user?: User;
  note: string;
  createdAt: string;
}

export interface CreateIncidentInput {
  buildingId: string;
  siteName: string;
  address: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  contactName?: string;
  contactPhone?: string;
}

export interface UpdateIncidentInput {
  status?: 'new' | 'assigned' | 'in_progress' | 'resolved';
  assignedTechId?: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CalendarEventResponse {
  eventId: string;
  htmlLink: string;
}
