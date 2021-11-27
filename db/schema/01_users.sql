-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS maps CASCADE;
DROP TABLE IF EXISTS collaborators CASCADE;
DROP TABLE IF EXISTS favorite_maps CASCADE;
DROP TABLE IF EXISTS maps CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE maps (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id),
  name VARCHAR(255),
  description TEXT,
  image_url TEXT
);

CREATE TABLE collaborators (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id),
  name VARCHAR(255),
  description TEXT,
  image_url TEXT
);

CREATE TABLE favorite_maps (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  map_id INTEGER REFERENCES maps(id)
);

CREATE TABLE points (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  map_id INTEGER REFERENCES maps(id),
  description TEXT,
  title VARCHAR(255),
  picture_url VARCHAR(255)
);
