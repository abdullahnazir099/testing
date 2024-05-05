const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {
    // Check for the presence of an authenticated user in the context object
   

    // Extract the contact ID from the query string parameters
    const { id } = event.queryStringParameters;

    // Establish a database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Define the SQL query to delete the contact
    const query = 'DELETE FROM contacts WHERE id = ?';

    // Execute the query with the contact ID
    await connection.execute(query, [id]);

    // Close the database connection
    await connection.end();

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Contact deleted successfully' })
    };
  } catch (error) {
    // Log and return an error response in case of any exceptions
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete contact', details: error.message })
    };
  }
};


    