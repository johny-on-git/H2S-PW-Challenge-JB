-- Enable PostGIS extension for geospatial querying
CREATE EXTENSION IF NOT EXISTS postgis;

-- Categories Table: Pre-defined buckets for civic reports
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,         -- e.g., 'safety', 'infrastructure'
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports Table: Individual citizen submissions
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id),
    reporter_identifier VARCHAR(255),         -- Optional: email or phone
    location GEOGRAPHY(Point, 4326) NOT NULL, -- (longitude, latitude)
    area_name VARCHAR(255),                   -- Reverse geocoded location name
    description TEXT,                         -- Optional context
    payload JSONB,                            -- Dynamic properties capture
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial Index: Essential for the 500m radius threshold querying
CREATE INDEX IF NOT EXISTS reports_location_idx ON reports USING GIST (location);

-- Alerts Table: Grouped reports that reached the Red Alert threshold (10+)
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id),
    center_location GEOGRAPHY(Point, 4326) NOT NULL,
    radius_meters INT DEFAULT 500,
    trigger_count INT NOT NULL,               -- e.g., 10+
    ai_summary TEXT,                          -- Generated summary from Gemini
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for resolving alerts in real-time
CREATE INDEX IF NOT EXISTS alerts_resolved_idx ON alerts (resolved);
