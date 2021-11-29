const { Pool } = require('pg');

const pool = new Pool({
  user: 'tobias',
  password: 'password',
  host: 'localhost',
  database: 'midterm'
});

const getAllProperties = (options, limit = 5) => {
  const queryParams = [];
  // 2
  let queryString = `
  SELECT maps.*
  FROM maps
  `;
  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY maps.id
  LIMIT $${queryParams.length};
  `;

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getAllProperties = getAllProperties;
