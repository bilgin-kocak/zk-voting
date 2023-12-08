// pages/api/doWork.ts
import { Worker } from 'worker_threads';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function doWork(req: NextApiRequest, res: NextApiResponse) {
  const worker = new Worker('./zkAppWorker.js'); // The transpiled JavaScript file

  worker.on('message', (result) => {
    res.status(200).json({ result });
  });

  worker.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  worker.on('exit', (exitCode) => {
    console.log(`Worker exited with code ${exitCode}`);
  });

  worker.postMessage('start work');
}
