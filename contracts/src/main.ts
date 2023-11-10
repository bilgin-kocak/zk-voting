import { Votes } from './Votes.js';
import {
  Field,
  Mina,
  MerkleTree,
  PrivateKey,
  AccountUpdate,
  MerkleWitness,
  Poseidon,
  MerkleMap,
} from 'o1js';

const useProof = false;

const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } =
  Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } =
  Local.testAccounts[1];

// Create a public/private key pair. The public key is your address and where you deploy the zkApp to
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

// create an instance of Votes Contract - and deploy it to zkAppAddress
const zkAppInstance = new Votes(zkAppAddress);

const voters = new MerkleMap();
const candidates = new MerkleMap();

console.log('state before init:');
console.log('voters:', voters.getRoot().toString());
console.log('candidates:', candidates.getRoot().toString());

// Deploy the zkApp to the blockchain
const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
  zkAppInstance.initState(candidates.getRoot(), voters.getRoot());
});
await deployTxn.prove();
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

// get the initial state of IncrementSecret after deployment
const candidates_ = zkAppInstance.candidates.get();
const voters_ = zkAppInstance.voters.get();
console.log('state after init:');
console.log('voters:', voters_.toString());
console.log('candidates:', candidates_.toString());
