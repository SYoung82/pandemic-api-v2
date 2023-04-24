/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pandemic API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:7071/api',
        description: 'Local Function App',
      },
    ],
  },
  apis: ['./src/functions/**/*.ts'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
fs.writeFile('swagger.json', JSON.stringify(openapiSpecification), (err) => {
  if (err) {
    throw err;
  }
  console.log('Swagger file is saved.');
});
