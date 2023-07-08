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
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
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
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
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
  const tableName = req.query.tableName;

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
    console.log('this is the table name: '+tableName);
    console.log('this is the query: '+`SELECT COLUMN_NAME FROM [${databaseName}].INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`);
    console.log('this is total result: '+JSON.stringify(result));
    // Return the column names
    res.json(result.recordset.map((row) => row.COLUMN_NAME));
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving the column names.');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
