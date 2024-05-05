const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {
    // Check for the presence of an authenticated user in the context object
    if (!context.clientContext || !context.clientContext.user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'You must be logged in to read contacts.' }),
      };
    }

    // Parse the request body to extract the contact ID
    const { id } = event.queryStringParameters;

    // Establish a database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Define the SQL query to select a contact with the specified ID
    const query = 'SELECT * FROM contacts WHERE id = ?';

    // Execute the query to fetch the contact details
    const [rows] = await connection.execute(query, [id]);

    // Close the database connection
    await connection.end();

    // Check if the contact with the specified ID exists
    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Contact not found" })
      };
    }

    // Return a success response with the contact details
    return {
      statusCode: 200,
      body: JSON.stringify(rows[0])
    };
  } catch (error) {
    // Log and return an error response in case of any exceptions
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to read contact", details: error.message })
    };
  }
};


