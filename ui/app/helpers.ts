export async function uploadBuffer(file: Buffer) {
  const lighthouse = (await import('@lighthouse-web3/sdk')).default;
  const res = await lighthouse.uploadBuffer(
    file,
    process.env.NEXT_LIGHTHOUSE_API_KEY!
  );
  return res.data;
}

export async function uploadFile(filePath: string) {
  const lighthouse = (await import('@lighthouse-web3/sdk')).default;
  const res = await lighthouse.upload(
    filePath,
    process.env.NEXT_LIGHTHOUSE_API_KEY!
  );
  return res.data;
}

export async function uploadText(text: string) {
  const lighthouse = (await import('@lighthouse-web3/sdk')).default;
  const res = await lighthouse.uploadText(
    text,
    process.env.NEXT_LIGHTHOUSE_API_KEY!
  );
  return res.data;
}
