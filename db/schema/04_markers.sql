DROP TABLE IF EXISTS markers CASCADE;

CREATE TABLE markers (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  markername VARCHAR(255),
  description TEXT DEFAULT 'Enter a description',
  picture_url VARCHAR(255) DEFAULT 'Enter a url',
  latitude VARCHAR(255) NOT NULL,
  longitude VARCHAR(255) NOT NULL
);
