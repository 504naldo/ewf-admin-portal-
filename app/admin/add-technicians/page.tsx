'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function AddTechniciansPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const technicians = [
    { name: 'Chris', email: 'chris@ewandf.ca', role: 'technician' },
    { name: 'Craig', email: 'craig@ewandf.ca', role: 'technician' },
    { name: 'Pat', email: 'pat@ewandf.ca', role: 'technician' },
    { name: 'Ranaldo', email: 'ranaldo@ewandf.ca', role: 'manager' },
    { name: 'Russ', email: 'russ@ewandf.ca', role: 'technician' },
  ];

  const addTechnicians = async () => {
    setLoading(true);
    setResult('');
    let successCount = 0;
    let errorCount = 0;
    let messages: string[] = [];

    for (const tech of technicians) {
      try {
        await api.post('/api/technicians', {
          name: tech.name,
          email: tech.email,
          role: tech.role,
          is_available: true,
        });
        successCount++;
        messages.push(`✓ Added ${tech.name}`);
      } catch (error: any) {
        errorCount++;
        messages.push(`✗ Failed to add ${tech.name}: ${error.response?.data?.message || error.message}`);
      }
    }

    setResult(`
Added ${successCount} technicians successfully.
${errorCount > 0 ? `Failed to add ${errorCount} technicians.` : ''}

${messages.join('\n')}
    `);
    setLoading(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Add Technicians</h1>
          <p className="mt-2 text-sm text-gray-700">
            Add EWF technicians to the database.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Technicians to Add:
        </h3>
        <ul className="space-y-2 mb-6">
          {technicians.map((tech) => (
            <li key={tech.email} className="text-sm text-gray-700">
              • {tech.name} - {tech.email} ({tech.role})
            </li>
          ))}
        </ul>

        <button
          onClick={addTechnicians}
          disabled={loading}
          className="rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? 'Adding Technicians...' : 'Add All Technicians'}
        </button>

        {result && (
          <pre className="mt-4 bg-gray-50 border border-gray-200 rounded p-4 text-sm whitespace-pre-wrap">
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
