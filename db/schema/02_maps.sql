DROP TABLE IF EXISTS maps CASCADE;
DROP TABLE IF EXISTS points_of_interest CASCADE;
DROP TABLE IF EXISTS favourite_maps CASCADE;

CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT 'Enter a description',
  image_url VARCHAR(255) DEFAULT 'Enter a url',
  latlng VARCHAR(255)
);

CREATE TABLE points_of_interest (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  description TEXT DEFAULT 'Enter a description',
  title VARCHAR(255) NOT NULL,
  picture_url VARCHAR(255) DEFAULT 'Enter a url',
  latitude INTEGER NOT NULL,
  longitude INTEGER NOT NULL
);

CREATE TABLE favourite_maps (
  id SERIAL PRIMARY KEY NOT NULL,
  saved_from_map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  saved_to_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
