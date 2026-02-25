'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function SQLPage() {
  const [sql, setSql] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeSQL = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await api.post('/api/admin/sql', { query: sql });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to execute SQL');
    } finally {
      setLoading(false);
    }
  };

  const testData = `INSERT INTO incidents (building_id, description, status, priority, assigned_technician_id, created_at, updated_at) VALUES
('BLDG-001', 'Fire alarm system malfunction in main lobby', 'pending', 'high', NULL, NOW(), NOW()),
('BLDG-002', 'HVAC system not responding on 3rd floor', 'assigned', 'medium', 1, NOW(), NOW()),
('BLDG-003', 'Emergency exit door stuck - needs immediate attention', 'in_progress', 'high', 2, NOW(), NOW()),
('BLDG-004', 'Water leak detected in basement mechanical room', 'resolved', 'medium', 3, NOW(), NOW()),
('BLDG-005', 'Elevator emergency phone not working', 'pending', 'high', NULL, NOW(), NOW()),
('BLDG-006', 'Security camera system offline in parking garage', 'assigned', 'low', 4, NOW(), NOW()),
('BLDG-007', 'Smoke detector beeping - battery replacement needed', 'resolved', 'low', 5, NOW(), NOW()),
('BLDG-008', 'Generator failed to start during power outage test', 'in_progress', 'high', 1, NOW(), NOW());`;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">SQL Admin</h1>
          <p className="mt-2 text-sm text-gray-700">
            Execute SQL queries directly against the database. Use with caution!
          </p>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setSql(testData)}
          className="mb-4 rounded-md bg-secondary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-secondary-600"
        >
          Load Test Incidents SQL
        </button>

        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder="Enter SQL query..."
          rows={12}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border font-mono"
        />

        <button
          onClick={executeSQL}
          disabled={loading || !sql}
          className="mt-4 rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? 'Executing...' : 'Execute SQL'}
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
