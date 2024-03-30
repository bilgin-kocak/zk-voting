const SEAL = require('node-seal');

async function voteFHE(voteResult, newVote) {
  const seal = await SEAL();

  const schemeType = seal.SchemeType.bfv;
  const securityLevel = seal.SecurityLevel.tc128;
  const polyModulusDegree = 4096;
  const bitSizes = [36, 36, 37];
  const bitSize = 20;

  const encParms = seal.EncryptionParameters(schemeType);

  // Set the PolyModulusDegree
  encParms.setPolyModulusDegree(polyModulusDegree);

  // Create a suitable set of CoeffModulus primes
  encParms.setCoeffModulus(
    seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
  );

  // Set the PlainModulus to a prime of bitSize 20.
  encParms.setPlainModulus(
    seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  );
  // const context = // Initialize context with parameters
  const context = seal.Context(
    encParms, // Encryption Parameters
    true, // ExpandModChain
    securityLevel // Enforce a security level
  );

  const encoder = seal.BatchEncoder(context);
  const keyGenerator = seal.KeyGenerator(context);
  const publicKey = keyGenerator.createPublicKey();
  const secretKey = keyGenerator.secretKey();
  const encryptor = seal.Encryptor(context, publicKey);
  const decryptor = seal.Decryptor(context, secretKey);

  const int32Array = new Int32Array(voteResult);
  const int32Array2 = new Int32Array(newVote);

  // Encode and encrypt arrays
  const plainText1 = encoder.encode(int32Array);
  const cipherText1 = encryptor.encrypt(plainText1);
  const plainText2 = encoder.encode(int32Array2);
  const cipherText2 = encryptor.encrypt(plainText2);

  // Perform homomorphic operations
  const evaluator = seal.Evaluator(context);
  const newCipherText = evaluator.add(cipherText1, cipherText2); // Homomorphic addition // Add vote

  // Decrypt and decode the result
  //    const decryptedPlainText = decryptor.decrypt(newCipherText);
  //    const result = encoder.decode(decryptedPlainText);

  const result = {
    newCipherText: newCipherText,
    secretKey: secretKey,
  };
  return result;
}

async function decryptVoteResult(secretKey, voteResultCipherText) {
  const seal = await SEAL();

  const schemeType = seal.SchemeType.bfv;
  const securityLevel = seal.SecurityLevel.tc128;
  const polyModulusDegree = 4096;
  const bitSizes = [36, 36, 37];
  const bitSize = 20;

  const encParms = seal.EncryptionParameters(schemeType);

  // Set the PolyModulusDegree
  encParms.setPolyModulusDegree(polyModulusDegree);

  // Create a suitable set of CoeffModulus primes
  encParms.setCoeffModulus(
    seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
  );

  // Set the PlainModulus to a prime of bitSize 20.
  encParms.setPlainModulus(
    seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  );
  // const context = // Initialize context with parameters
  const context = seal.Context(
    encParms, // Encryption Parameters
    true, // ExpandModChain
    securityLevel // Enforce a security level
  );

  const decryptor = seal.Decryptor(context, secretKey);
  // Decrypt and decode the result
  const decryptedPlainText = decryptor.decrypt(voteResultCipherText);
  const result = encoder.decode(decryptedPlainText);
  return result;
}

module.exports = {
  voteFHE,
  decryptVoteResult,
};
