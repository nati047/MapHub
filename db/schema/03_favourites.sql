DROP TABLE IF EXISTS favourites CASCADE;

CREATE TABLE favourites (
  id SERIAL PRIMARY KEY NOT NULL,
  saved_to_user_id INTEGER REFERENCES users(id),
  saved_from_map_id INTEGER REFERENCES maps(id)
);
