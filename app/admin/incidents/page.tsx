'use client';

import { useState, useEffect } from 'react';
import { listIncidents, listTechnicians, updateIncident, type Incident, type Technician } from '@/lib/api-helpers';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter, searchTerm]);

  const loadData = async () => {
    try {
      const [incidentsData, techsData] = await Promise.all([
        listIncidents({ status: statusFilter, search: searchTerm }),
        listTechnicians(),
      ]);
      setIncidents(incidentsData);
      setTechnicians(techsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTechnician = async (incidentId: number, technicianId: number) => {
    try {
      await updateIncident(incidentId, { assigned_technician_id: technicianId });
      loadData();
    } catch (error) {
      console.error('Failed to assign technician:', error);
    }
  };

  const handleUpdateStatus = async (incidentId: number, status: string) => {
    try {
      await updateIncident(incidentId, { status });
      loadData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Incidents</h1>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search incidents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Building</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {incidents.map((incident) => (
              <tr key={incident.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{incident.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{incident.building_id}</td>
                <td className="px-6 py-4 text-sm">{incident.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={incident.status}
                    onChange={(e) => handleUpdateStatus(incident.id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {incident.technician?.name || 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={incident.assigned_technician_id || ''}
                    onChange={(e) => handleAssignTechnician(incident.id, parseInt(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Assign...</option>
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
