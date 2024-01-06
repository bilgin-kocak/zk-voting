// pages/api/ipfs.js

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello World' });
  }
  if (req.method === 'POST') {
    // Access the POST body data
    const data = req.body;

    // Process the data (example: log it to the console)
    console.log(data);

    // Respond to the request
    res.status(200).json({ message: 'Data received', receivedData: data });
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
