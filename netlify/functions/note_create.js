const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {
    // Check for the presence of an authenticated user in the context object


    // Parse the request body to extract note details
    const requestBody = JSON.parse(event.body);
    const { contact_id, note } = requestBody;

    // Validate required fields
    if (!contact_id || !note) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters (contact_id, note).' }),
      };
    }

    // Establish a database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Define the SQL query to insert the new note
    const query = 'INSERT INTO notes (contact_id, note, created_at, updated_at) VALUES (?, ?, NOW(), NOW())';

    // Execute the query to insert the new note
    const [result] = await connection.execute(query, [contact_id, note]);

    // Close the database connection
    await connection.end();

    // Check if the note was inserted successfully
    if (result.affectedRows !== 1) {
      throw new Error('Failed to create note.');
    }

    // Return a success response indicating that the note was created
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Note created successfully' })
    };
  } catch (error) {
    // Log and return an error response in case of any exceptions
    console.error('Error creating note:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create note', details: error.message })
    };
  }
};


