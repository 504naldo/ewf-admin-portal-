-- Insert test incidents with various statuses
INSERT INTO incidents (building_id, description, status, priority, assigned_technician_id, created_at, updated_at) VALUES
('BLDG-001', 'Fire alarm system malfunction in main lobby', 'pending', 'high', NULL, NOW(), NOW()),
('BLDG-002', 'HVAC system not responding on 3rd floor', 'assigned', 'medium', 1, NOW(), NOW()),
('BLDG-003', 'Emergency exit door stuck - needs immediate attention', 'in_progress', 'high', 2, NOW(), NOW()),
('BLDG-004', 'Water leak detected in basement mechanical room', 'resolved', 'medium', 3, NOW(), NOW()),
('BLDG-005', 'Elevator emergency phone not working', 'pending', 'high', NULL, NOW(), NOW()),
('BLDG-006', 'Security camera system offline in parking garage', 'assigned', 'low', 4, NOW(), NOW()),
('BLDG-007', 'Smoke detector beeping - battery replacement needed', 'resolved', 'low', 5, NOW(), NOW()),
('BLDG-008', 'Generator failed to start during power outage test', 'in_progress', 'high', 1, NOW(), NOW());
