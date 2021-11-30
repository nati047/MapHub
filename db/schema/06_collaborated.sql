DROP TABLE IF EXISTS collaborated CASCADE;

CREATE TABLE collaborated (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  map_id INTEGER REFERENCES maps(id)
);
