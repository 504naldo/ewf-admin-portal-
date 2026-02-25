'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Incident, User } from '@/lib/types';
import { format } from 'date-fns';
import StatusBadge from '@/components/StatusBadge';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = async () => {
    try {
      const [incidentsData, techsData] = await Promise.all([
        api.listIncidents({ status: statusFilter, search: searchTerm }),
        api.listTechnicians(),
      ]);
      setIncidents(incidentsData);
      setTechnicians(techsData);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const poll = async () => {
      try {
        const [incidentsData, techsData] = await Promise.all([
          api.listIncidents({ status: statusFilter, search: searchTerm }),
          api.listTechnicians(),
        ]);
        setIncidents(incidentsData);
        setTechnicians(techsData);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [statusFilter, searchTerm]);

  const handleAssignTech = async (incidentId: number, techId: number) => {
    try {
      await api.updateIncident(incidentId, { assignedTechId: techId, status: 'assigned' });
      await fetchData();
      setSelectedIncident(null);
    } catch (err: any) {
      alert(err.message || 'Failed to assign technician');
    }
  };

  const handleUpdateStatus = async (incidentId: number, status: Incident['status']) => {
    try {
      await api.updateIncident(incidentId, { status });
      await fetchData();
      setSelectedIncident(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading incidents...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage emergency incidents and assign technicians
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            Create Incident
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <input
          type="text"
          placeholder="Search by building ID, site name, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-md border-gray-300 border shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2"
        />
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Building ID</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Site Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assigned Tech</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {incidents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-gray-500">
                        {searchTerm || statusFilter ? 'No incidents match your filters.' : 'No incidents yet.'}
                      </td>
                    </tr>
                  ) : (
                    incidents.map((incident) => (
                      <tr key={incident.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">#{incident.id}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm"><StatusBadge status={incident.status} /></td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 font-medium">{incident.buildingId}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{incident.siteName}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{incident.assignedTech?.name || 'Unassigned'}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{format(new Date(incident.createdAt), 'MMM d, yyyy HH:mm')}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button onClick={() => setSelectedIncident(incident)} className="text-primary-600 hover:text-primary-800 font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedIncident && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Incident #{selectedIncident.id}</h2>
              <button onClick={() => setSelectedIncident(null)} className="text-gray-400 hover:text-gray-500">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedIncident.status}
                  onChange={(e) => handleUpdateStatus(selectedIncident.id, e.target.value as Incident['status'])}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="new">New</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assign Technician</label>
                <select
                  value={selectedIncident.assignedTechId || ''}
                  onChange={(e) => handleAssignTech(selectedIncident.id, Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Unassigned</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>{tech.name} ({tech.availability || 'unknown'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Building ID</label>
                <p className="mt-1 text-sm text-gray-900">{selectedIncident.buildingId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Site Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedIncident.siteName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-sm text-gray-900">{selectedIncident.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900">{selectedIncident.description}</p>
              </div>
              {selectedIncident.contactName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedIncident.contactName}{selectedIncident.contactPhone ? ` — ${selectedIncident.contactPhone}` : ''}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedIncident(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateIncidentModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); fetchData(); }}
        />
      )}
    </div>
  );
}

function CreateIncidentModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    buildingId: '',
    siteName: '',
    address: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    contactName: '',
    contactPhone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createIncident(formData);
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to create incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Incident</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Building ID *</label>
            <input type="text" required value={formData.buildingId} onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Name *</label>
            <input type="text" required value={formData.siteName} onChange={(e) => setFormData({ ...formData, siteName: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as typeof formData.priority })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Name</label>
            <input type="text" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input type="tel" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
