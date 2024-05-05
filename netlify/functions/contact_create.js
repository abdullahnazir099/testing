const mysql = require('mysql2/promise');

exports.handler = async (event, context) => {
  try {
    // Check for the presence of an authenticated user in the context object


    // Parse the request body to extract contact data
    const requestBody = JSON.parse(event.body);
    const { first_name, last_name, email, phone, category_id } = requestBody;

    // Validate required fields
    if (!first_name || !last_name || !email || !phone || !category_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters (first_name, last_name, email, phone, category_id).' }),
      };
    }

    // Establish a database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Define the SQL query to insert a new contact
    const query = 'INSERT INTO contacts (first_name, last_name, email, phone, category_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';

    // Execute the query with the contact data
    await connection.execute(query, [first_name, last_name, email, phone, category_id]);

    // Close the database connection
    await connection.end();

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Contact created successfully' })
    };
  } catch (error) {
    // Log and return an error response in case of any exceptions
    console.error('Error creating contact:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create your contact', details: error.message })
    };
  }
};


