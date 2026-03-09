import { handleRequest } from '../src/app.js';

export default async function handler(req, res) {
    // Vercel serverless functions parse the body automatically.
    // We attach a custom property so our app.js knows it's already parsed.
    req.isVercel = true;

    await handleRequest(req, res);
}
