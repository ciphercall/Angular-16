const express = require('express');
const sql = require('mssql');

const app = express();

// Add middleware to set the Access-Control-Allow-Origin header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/database-names', async (req, res) => {
  const serverLocation = req.query.serverLocation;

  try {
    // Configure the connection to the SQL server
    const config = {
      user: "sa",
      password: "sa@123",
      database: "",
      server: serverLocation,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    };

    // Connect to the SQL server
    await sql.connect(config);

    // Query the database names
    const result = await sql.query`SELECT name FROM master.dbo.sysdatabases`;

    // Return the database names
    res.json(result.recordset.map((row) => row.name));
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving the database names.');
  }
});

app.get('/table-names', async (req, res) => {
  const serverLocation = req.query.serverLocation;
  const databaseName = req.query.databaseName;

  try {
    // Configure the connection to the SQL server
    const config = {
      user: "sa",
      password: "sa@123",
      database: "master",
      server: serverLocation,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    };

    // Connect to the SQL server
    await sql.connect(config);

    // Query the table names
    const result = await sql.query(`SELECT TABLE_NAME FROM [${databaseName}].INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`);

    // Return the table names
    res.json(result.recordset.map((row) => row.TABLE_NAME));
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving the table names.');
  }
});

app.get('/column-names', async (req, res) => {
  const serverLocation = req.query.serverLocation;
  const databaseName = req.query.databaseName;
  let tableName = req.query.tableName;

  // Escape single quotes in the table name
  tableName = tableName.replace(/'/g, "''");

  try {
    // Configure the connection to the SQL server
    const config = {
      user: "sa",
      password: "sa@123",
      database: databaseName,
      server: serverLocation,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    };

    // Connect to the SQL server
    await sql.connect(config);

    // Query the column names
    const result = await sql.query(`SELECT COLUMN_NAME FROM [${databaseName}].INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`);

    // Return the column names
    res.json(result.recordset.map((row) => row.COLUMN_NAME));
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving the column names.');
  }
});

// Add a new endpoint for querying the results with pagination support
app.get('/query-results', async (req, res) => {
  const serverLocation = req.query.serverLocation;
  const query = req.query.query;
  const currentPage = parseInt(req.query.currentPage);
  const pageSize = parseInt(req.query.pageSize);

  try {
    // Configure the connection to the SQL server
    const config = {
      user: "sa",
      password: "sa@123",
      database: "",
      server: serverLocation,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    };

    // Connect to the SQL server
    await sql.connect(config);

    // Calculate the start and end row numbers for the current page
    const startRow = currentPage * pageSize + 1;
    const endRow = startRow + pageSize - 1;

    // Execute the query with pagination using ROW_NUMBER
    const paginatedQuery = `
      WITH OrderedResults AS (
        SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS RowNumber, *
        FROM (${query}) AS QueryResults
      )
      SELECT *
      FROM OrderedResults
      WHERE RowNumber BETWEEN ${startRow} AND ${endRow}
    `;
    const result = await sql.query(paginatedQuery);

    // Return the results
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while executing the query.');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
