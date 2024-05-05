const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {
    // Check for the presence of an authenticated user in the context object
    if (!context.clientContext || !context.clientContext.user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'You must be logged in to update contacts.' }),
      };
    }

    // Parse the request body to extract contact details
    const { id, first_name, last_name, email, phone, category_id } = JSON.parse(event.body);

    // Establish a database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Define the SQL query to update the specified contact
    const query = 'UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ?, category_id = ?, updated_at = NOW() WHERE id = ?';

    // Execute the query to update the contact record
    await connection.execute(query, [first_name, last_name, email, phone, category_id, id]);

    // Close the database connection
    await connection.end();

    // Return a success response indicating that the contact was updated
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Contact updated successfully' })
    };
  } catch (error) {
    // Log and return an error response in case of any exceptions
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update contact', details: error.message })
    };
  }
};


