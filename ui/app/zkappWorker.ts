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
  Nullifier,
  Provable,
  MerkleMapWitness,
  MerkleWitness,
  AccountUpdate,
} from 'o1js';
import { uploadBuffer } from './helpers';
import axios from 'axios';
type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Votes } from '@/contracts/src/Votes';

interface VerificationKeyData {
  data: string;
  hash: Field;
}

const state = {
  Votes: null as null | typeof Votes,
  zkapp: null as null | Votes,
  transaction: null as null | Transaction,
  offChainInstance: null as null | OffChainStorage,
  verificationKey: null as null | VerificationKeyData | any, //| VerificationKeyData;
};

const num_voters = 2; // Total Number of Voters
const options = 2; // TOtal Number of Options

class VoterListMerkleWitness extends MerkleWitness(num_voters + 1) {}
class VoteCountMerkleWitness extends MerkleWitness(options + 1) {}

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
  nullifier: Nullifier;
  voters: Field[];
  voterCounts: number[];
  nullifiers: Field[];

  constructor(
    num_voters: number,
    options: number,
    voters: Field[],
    nullifier: Nullifier
  ) {
    this.votersMerkleTree = new MerkleTree(num_voters + 1);
    this.voteCountMerkleTree = new MerkleTree(options + 1);
    this.nullifierMerkleMap = new MerkleMap();
    this.votersMerkleTree.fill(voters);
    this.voters = voters;
    this.voterCounts = new Array(options).fill(0);
    this.nullifiers = [];
    this.nullifier = nullifier;
  }

  updateOffChainState(
    nullifier: Nullifier,
    voteOption: bigint,
    zkAppAddress: string
  ) {
    // this.nullifierMerkleMap.set(nullifierHash, Field(1));
    const currentVote = this.voteCountMerkleTree.getNode(0, voteOption);
    console.log('Current Vote:', currentVote);
    // this.voteCountMerkleTree.setLeaf(voteOption, currentVote.add(1));
    this.nullifierMerkleMap.set(nullifier.key(), Field(1));
    this.nullifiers.push(nullifier.key());
    // Add increase vote options in voterCounts
    const index = Number(voteOption);
    // Use FHE to add 1 to the vote count
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/fhe-vote`;
    const headers = {
      'Content-Type': 'application/json',
    };
    // Send get request with body parameters
    // voteResult, newVote, zkAppAddress
    const data = {
      voteResult: this.voterCounts,
      newVote: index,
      zkAppAddress: zkAppAddress,
    };
    // Make the POST request
    try {
      const response = axios.get(url, {
        headers: headers,
        data: data,
      });
      console.log('Response:', response);
    } catch (error) {
      console.error(error);
    }
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
    const { verificationKey } = await state.Votes!.compile();
    state.verificationKey = verificationKey;
  },

  createDeployTransaction: async (args: {
    feePayer: string;
  }): Promise<string> => {
    if (state === null) {
      throw Error('state is null');
    }
    // const zkAppPrivateKey: PrivateKey = PrivateKey.fromBase58(
    //   args.privateKey58
    // );

    let zkAppPrivateKey = PrivateKey.random();
    let zkAppAddress = zkAppPrivateKey.toPublicKey();

    // await initZkappInstance(zkAppAddress);
    // const zkAppAddress = zkAppPrivateKey.toPublicKey();
    state.zkapp = new state.Votes!(zkAppAddress);

    const feePayerPublickKey = PublicKey.fromBase58(args.feePayer);
    const transaction = await Mina.transaction(feePayerPublickKey, () => {
      AccountUpdate.fundNewAccount(feePayerPublickKey);
      state.zkapp!.deploy({
        zkappKey: zkAppPrivateKey,
        verificationKey: state.verificationKey as VerificationKeyData,
      });
    });
    transaction.sign([zkAppPrivateKey]);
    state.transaction = transaction;
    return zkAppAddress.toBase58();
  },

  getDeployTransactionJSON: async (args: { publicKey58: string }) => {
    const { Votes } = await import('@/contracts/build/src/Votes.js');
    const zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();
    const zkAppInstance = new Votes(zkAppAddress);
    return state.transaction!.toJSON();
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

  setOffChainInstance: async (args: { nullifier: Nullifier }) => {
    const publicKeyHashes: Field[] = votableAdresses.map((key) =>
      Poseidon.hash(PublicKey.fromBase58(key).toFields())
    );

    // Type Conversion
    const nullifier = Nullifier.fromJSON(NullifierToJson(args.nullifier));

    // We need mina signer to sign the nullifier
    console.log('Nullifier:', args.nullifier);

    let offChainInstance = new OffChainStorage(
      num_voters,
      options,
      publicKeyHashes,
      nullifier
    );
    console.log('OffChain Instance Created');

    const cid = 'QmcE4pX4gtcdqEx6trwNUKPRs2pvaPG2LSxnp1PEp6cC6G';

    // Get Offchain State from Remote Server
    const url = `https://zk-voting-backend-75cf681f0f1c.herokuapp.com/offchain/${cid}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    // Make the GET request
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

  castVote: async (args: { voteOption: number; nullifier: Nullifier }) => {
    const nullifier = Nullifier.fromJSON(NullifierToJson(args.nullifier));

    const voteCountMerkleTree = state.offChainInstance!.voteCountMerkleTree;

    const offChainInstance = state.offChainInstance!;
    const option = BigInt(args.voteOption);

    offChainInstance.updateOffChainState(
      state.offChainInstance!.nullifier,
      option,
      state.zkapp!.address.toBase58()
    );

    // Save the offChainInstance to file
    const obj = offChainInstance.saveOffChainState();

    // Save stringified to file
    const data = JSON.stringify(obj);
    console.log('New OffChain State:', data);

    // Define the URL and headers
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/offchain`;
    const headers = {
      'Content-Type': 'application/json',
    };

    // Make the POST request
    try {
      const response = await axios.post(url, obj, { headers: headers });
      console.log('Response:', response.data);
    } catch (error) {
      console.error(error);
    }

    // Save new states to cache
    state.offChainInstance = offChainInstance;

    // Create Witness
    const votersWitness = new VoterListMerkleWitness(
      offChainInstance.votersMerkleTree.getWitness(option)
    );

    const voteCountsWitness = new VoteCountMerkleWitness(
      offChainInstance.voteCountMerkleTree.getWitness(option)
    );

    const votingID = await state.zkapp!.votingID.get();
    console.log('Voting ID:', votingID);

    let nullifierWitness = Provable.witness(MerkleMapWitness, () =>
      offChainInstance.nullifierMerkleMap.getWitness(nullifier.key())
    );

    const currentVotes = voteCountMerkleTree.getNode(0, option);

    const transaction = await Mina.transaction(() => {
      state.zkapp!.vote(
        nullifier,
        votersWitness,
        nullifierWitness,
        voteCountsWitness,
        currentVotes
      );
    });
    state.transaction = transaction;
  },

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

function NullifierToJson(nullifier: Nullifier) {
  const jsonNullifier = {
    private: {
      c: nullifier.private.c.toString(),
      g_r: {
        x: nullifier.private.g_r.x.toString(),
        y: nullifier.private.g_r.y.toString(),
      },
      h_m_pk_r: {
        x: nullifier.private.h_m_pk_r.x.toString(),
        y: nullifier.private.h_m_pk_r.y.toString(),
      },
    },
    public: {
      nullifier: {
        x: nullifier.public.nullifier.x.toString(),
        y: nullifier.public.nullifier.y.toString(),
      },
      s: nullifier.public.s.toString(),
    },
    publicKey: {
      x: nullifier.publicKey.x.toString(),
      y: nullifier.publicKey.y.toString(),
    },
  };
  return jsonNullifier;
}

console.log('Web Worker Successfully Initialized.');
