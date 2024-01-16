import {
  Mina,
  PublicKey,
  fetchAccount,
  UInt32,
  Field,
  Poseidon,
  MerkleTree,
  MerkleMap,
  PrivateKey,
} from 'o1js';
import { uploadBuffer } from './helpers';
import axios from 'axios';
type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Votes } from '@/contracts/src/Votes';

const state = {
  Votes: null as null | typeof Votes,
  zkapp: null as null | Votes,
  transaction: null as null | Transaction,
  offChainInstance: null as null | OffChainStorage,
};

const num_voters = 2; // Total Number of Voters
const options = 2; // TOtal Number of Options

// You can write different public keys to each voter
const votableAdresses = [
  'B62qjSfWdftx3W27jvzFFaxsK1oeyryWibUcP8TqSWYAi4Q5JJJXjp1',
  'B62qjSfWdftx3W27jvzFFaxsK1oeyryWibUcP8TqSWYAi4Q5JJJXjp1',
  'B62qjSfWdftx3W27jvzFFaxsK1oeyryWibUcP8TqSWYAi4Q5JJJXjp1',
  'B62qjSfWdftx3W27jvzFFaxsK1oeyryWibUcP8TqSWYAi4Q5JJJXjp1',
];

class OffChainStorage {
  readonly votersMerkleTree: MerkleTree;
  voteCountMerkleTree: MerkleTree;
  nullifierMerkleMap: MerkleMap;
  voters: Field[];
  voterCounts: number[];
  nullifiers: Field[];

  constructor(num_voters: number, options: number, voters: Field[]) {
    this.votersMerkleTree = new MerkleTree(num_voters + 1);
    this.voteCountMerkleTree = new MerkleTree(options + 1);
    this.nullifierMerkleMap = new MerkleMap();
    this.votersMerkleTree.fill(voters);
    this.voters = voters;
    this.voterCounts = new Array(options).fill(0);
    this.nullifiers = [];
  }

  updateOffChainState(nullifierHash: Field, voteOption: bigint) {
    this.nullifierMerkleMap.set(nullifierHash, Field(1));
    const currentVote = this.voteCountMerkleTree.getNode(0, voteOption);
    console.log('Current Vote:', currentVote);
    // this.voteCountMerkleTree.setLeaf(voteOption, currentVote.add(1));
    this.nullifiers.push(nullifierHash);
    // Add increase vote options in voterCounts
    const index = Number(voteOption);
    this.voterCounts[index] += 1;
  }

  saveOffChainState() {
    const voters = this.voters;
    const voterCounts = this.voterCounts;
    const nullifiers = this.nullifiers;
    const ojb = {
      voters: voters.map((v) => v.toString()),
      voterCounts,
      nullifiers: nullifiers.map((n) => n.toString()),
    };
    return ojb;
  }

  loadOffChainState(obj: any) {
    const voters = obj.voters.map((v: string) => Field(v));
    const voterCounts = obj.voterCounts;
    const nullifiers = obj.nullifiers.map((n: string) => Field(n));
    this.voters = voters;
    this.voterCounts = voterCounts;
    this.nullifiers = nullifiers;
    this.votersMerkleTree.fill(voters);
    this.voteCountMerkleTree.fill(voterCounts.map((v: number) => BigInt(v)));
    for (let i = 0; i < nullifiers.length; i++) {
      this.nullifierMerkleMap.set(nullifiers[i], Field(1));
    }
  }
}

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      'https://proxy.berkeley.minaexplorer.com/graphql'
    );
    console.log('Berkeley Instance Created');
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { Votes } = await import('@/contracts/build/src/Votes');
    state.Votes = Votes;
  },
  compileContract: async (args: {}) => {
    await state.Votes!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.Votes!(publicKey);
  },

  getIsInitialized: async (args: {}) => {
    const isInitialized = await state.zkapp!.isInitialized.get();
    return JSON.stringify(isInitialized);
  },

  setOffChainInstance: async (args: {}) => {
    const publicKeyHashes: Field[] = votableAdresses.map((key) =>
      Poseidon.hash(PublicKey.fromBase58(key).toFields())
    );
    let offChainInstance = new OffChainStorage(
      num_voters,
      options,
      publicKeyHashes
    );
    console.log('OffChain Instance Created');

    const cid = 'QmcE4pX4gtcdqEx6trwNUKPRs2pvaPG2LSxnp1PEp6cC6G';

    // Get Offchain State from Remote Server
    const url = `http://localhost:3001/offchain/{cid}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    // Make the PUT request

    try {
      const response = await axios.get(url, { headers: headers });
      console.log('Response:', response.data);
      offChainInstance.loadOffChainState(response.data);
    } catch (error) {
      console.error(error);
    }

    state.offChainInstance = offChainInstance;
  },

  initState: async (args: {}) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.initState(
        Field.random(), // votingID
        state.offChainInstance!.votersMerkleTree.getRoot() // Save the root of the voter list Merkle tree
      );
    });
    state.transaction = transaction;
  },

  getVotingID: async (args: {}) => {
    const votingID = await state.zkapp!.votingID.get();
    return JSON.stringify(votingID);
  },

  castVote: async (args: { voteOption: number }) => {
    const votersMerkleTree = state.offChainInstance!.votersMerkleTree;
    const voteCountMerkleTree = state.offChainInstance!.voteCountMerkleTree;
    const nullifierMerkleMap = state.offChainInstance!.nullifierMerkleMap;

    const offChainInstance = state.offChainInstance!;
    const option = BigInt(args.voteOption);

    const nullifierHash = Poseidon.hash([Field.random()]);

    offChainInstance.updateOffChainState(nullifierHash, option);

    // Save the offChainInstance to file
    const obj = offChainInstance.saveOffChainState();

    // Save stringified to file
    const data = JSON.stringify(obj);
    console.log('New OffChain State:', data);

    // Define the URL and headers
    const url = 'http://localhost:3001/offchain';
    const headers = {
      'Content-Type': 'application/json',
    };

    // Make the PUT request

    try {
      const response = await axios.post(url, obj, { headers: headers });
      console.log('Response:', response.data);
    } catch (error) {
      console.error(error);
    }

    // Save new states to cache
    state.offChainInstance = offChainInstance;

    // TODO: change contract to accept public key instead of private key

    // Those will change
    // Create Witness
    // const option = BigInt(args.voteOption);
    // const votersWitness = votersMerkleTree.getWitness(option);
    // const votingID: Field = await state.zkapp!.votingID.get();
    // const nullifierHash = Poseidon.hash(
    //   args.privateKey.toFields().concat([votingID])
    // );
    // const nullifierWitness = nullifierMerkleMap.getWitness(nullifierHash);

    // const voteCountsWitness = voteCountMerkleTree.getWitness(option);
    // const currentVotes = voteCountMerkleTree.getNode(0, option);

    // const transaction = await Mina.transaction(() => {
    //   state.zkapp!.vote(
    //     args.privateKey,
    //     votersWitness,
    //     nullifierWitness,
    //     voteCountsWitness,
    //     currentVotes
    //   );
    // });
    // state.transaction = transaction;
  },

  // getBallot: async (args: {}) => {
  //   const currentBallot = await state.zkapp!.ballot.get();
  //   return JSON.stringify(currentBallot);
  // },
  // cast: async (args: { candidate: number }) => {
  //   const transaction = await Mina.transaction(() => {
  //     state.zkapp!.cast(UInt32.from(args.candidate));
  //   });
  //   state.transaction = transaction;
  // },
  proveTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== 'undefined') {
  addEventListener(
    'message',
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}

console.log('Web Worker Successfully Initialized.');
