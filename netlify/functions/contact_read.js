const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {
    // Check for the presence of an authenticated user in the context object
   

    // Establish a database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Define the SQL query to select all contacts
    const query = 'SELECT * FROM contacts';

    // Execute the query to fetch all contacts
    const [rows] = await connection.execute(query);

    // Close the database connection
    await connection.end();

    // Return a success response with the fetched contacts
    return {
      statusCode: 200,
      body: JSON.stringify(rows)
    };
  } catch (error) {
    // Log and return an error response in case of any exceptions
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read contacts', details: error.message })
    };
  }
};

