// server.js
const express = require('express');
const sql = require('mssql');

const app = express();

app.get('/database-names', async (req, res) => {
  const serverLocation = req.query.serverLocation;

  try {
    // Configure the connection to the SQL server
    const config = {
      user: "sa",
      password: "sa@123",
      server: serverLocation,
      options: {
        encrypt: true,
        enableArithAbort: true,
      },
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

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
