const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { connectMongoDB } = require('./config/mongoDbConnection'); // Correct import with matching name
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');
const { Api } = require('./routes/api');
const cronTask = require('./app/Helper/croneJob');



// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//run crone job
cronTask.start();


// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Find-and-Glow",
      version: "1.0.0",
    },
    servers: [{ url: process.env.BASE_URL }],
  },
  apis: ["./routes/*.js"], // your route folder
};

// Read swagger.json file
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));

app.use(
  "/api-docs",
  (req, res, next) => {
    swaggerDocument.host = req.get("host");
    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

app.use('/api/', Api);



// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  // logger.error(`Uncaught Exception: ${err.message}`);
  // Restart the server after a delay
  setTimeout(() => {
    server.close(() => {
      console.log('Server closed due to uncaught exception. Restarting...');
      startServer();
    });
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  // logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  setTimeout(() => {
    server.close(() => {
      console.log('Server closed due to unhandled rejection. Restarting...');
      startServer();
    });
  }, 1000);
});
// Create an asynchronous function to start the server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      connectMongoDB();
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

// Call the function to start the server
startServer();
