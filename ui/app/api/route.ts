import axios from 'axios';

export async function GET(req: any, res: any) {
  try {
    console.log('GET request received:', req);

    return Response.json({ data: 'Success' });
  } catch (error) {
    console.error('Error forwarding GET request:', error);
    // res.status(500).send('Error forwarding request');
    return Response.json({ error: 'Error forwarding request' });
  }
}
