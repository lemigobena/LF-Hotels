// This is the starting point for the server
import 'dotenv/config';
import http from 'http';
import { handleRequest } from './app.js';

const PORT = process.env.PORT || 5000;

// Create the server and use the app logic
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
