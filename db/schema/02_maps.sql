DROP TABLE IF EXISTS maps CASCADE;
DROP TABLE IF EXISTS points_of_interest CASCADE;

CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  mapname VARCHAR(255) NOT NULL,
  description TEXT DEFAULT 'Enter a description',
  image_url VARCHAR(255) DEFAULT 'Enter a url',
  latitude VARCHAR(255) NOT NULL,
  longitude VARCHAR(255) NOT NULL
);

CREATE TABLE points_of_interest (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  description TEXT DEFAULT 'Enter a description',
  title VARCHAR(255) NOT NULL,
  picture_url VARCHAR(255) DEFAULT 'Enter a url',
  latitude VARCHAR(255) NOT NULL,
  longitude VARCHAR(255) NOT NULL
);
