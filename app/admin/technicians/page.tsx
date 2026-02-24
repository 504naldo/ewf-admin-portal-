'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';
import { format } from 'date-fns';

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTechnicians = async () => {
    try {
      const data = await api.listTechnicians();
      setTechnicians(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load technicians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
    // Poll every 15 seconds
    const interval = setInterval(fetchTechnicians, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading technicians...</div>;
  }

  const getAvailabilityColor = (availability?: string) => {
    return availability === 'available'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Technicians</h1>
          <p className="mt-2 text-sm text-gray-700">
            View technician availability and status
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{tech.name}</h3>
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getAvailabilityColor(
                    tech.availability
                  )}`}
                >
                  {tech.availability || 'unavailable'}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Email:</span> {tech.email}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Role:</span> {tech.role}
                </p>
                {tech.lastSeenAt && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Last seen:</span>{' '}
                    {format(new Date(tech.lastSeenAt), 'MMM d, yyyy HH:mm')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {technicians.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No technicians found
        </div>
      )}
    </div>
  );
}
