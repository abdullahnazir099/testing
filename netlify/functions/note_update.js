const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {
    // Check for the presence of an authenticated user in the context object
   

    // Parse the request body to extract note ID and updated note content
    const { id, note } = JSON.parse(event.body);

    // Establish a database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Define the SQL query to update the note with the specified ID
    const query = 'UPDATE notes SET note = ?, updated_at = NOW() WHERE id = ?';

    // Execute the update query with the provided note content and ID
    await connection.execute(query, [note, id]);

    // Close the database connection
    await connection.end();

    // Return a success response indicating that the note was updated successfully
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Note updated successfully" })
    };
  } catch (error) {
    // Log and return an error response in case of any exceptions
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update note", details: error.message })
    };
  }
};

