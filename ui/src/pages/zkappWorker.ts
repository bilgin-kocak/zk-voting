import {
  Mina,
  PublicKey,
  PrivateKey,
  fetchAccount,
  MerkleWitness,
  MerkleMapWitness,
  Field,
  AccountUpdate,
  MerkleTree,
  MerkleMap,
  Poseidon,
} from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

// import type { Votes } from '../../../contracts/src/Votes';

import { Votes } from '../../../contracts/build/src/Votes.js';

const state = {
  Votes: null as null | typeof Votes,
  zkapp: null as null | Votes,
  transaction: null as null | Transaction,
  Local: null as null | ReturnType<typeof Mina.LocalBlockchain>,
  offChainInstance: null as null | OffChainStorage,
  zkAppPrivateKey: null as null | PrivateKey,
  deployerKey: null as null | PrivateKey,
  Mina: Mina,
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

class VoterListMerkleWitness extends MerkleWitness(num_voters + 1) {}
class VoteCountMerkleWitness extends MerkleWitness(options + 1) {}

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      'https://proxy.berkeley.minaexplorer.com/graphql'
    );
    console.log('Berkeley Instance Created');
    Mina.setActiveInstance(Berkeley);
  },
  setLocalInstance: async (args: {}) => {
    const Local = Mina.LocalBlockchain({ proofsEnabled: false });
    console.log('Local Instance Created');
    Mina.setActiveInstance(Local);
    state.Mina = Mina;
    state.Local = Local;
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
    state.offChainInstance = offChainInstance;
  },

  deployContract: async (args: {}) => {
    const { privateKey: deployerKey, publicKey: deployerAccount } =
      state.Local!.testAccounts[0];

    // Create a public/private key pair. The public key is our address and where we will deploy to
    const zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();

    // create an instance of Votes - and deploy it to zkAppAddress
    const zkAppInstance = new Votes(zkAppAddress);
    const deployTxn = await state.Mina!.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkAppInstance.deploy();
    });
    state.zkapp = zkAppInstance;
    await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();
    state.deployerKey = deployerKey;
    state.zkAppPrivateKey = zkAppPrivateKey;
  },

  initState: async (args: {}) => {
    const { privateKey: deployerKey, publicKey: deployerAccount } =
      state.Local!.testAccounts[0];

    const txn = await state.Mina.transaction(deployerAccount, () => {
      state.zkapp!.initState(
        Field.random(), // votingID
        state.offChainInstance!.votersMerkleTree.getRoot() // Save the root of the voter list Merkle tree
      );
    });
    await txn.prove();
    await txn.sign([deployerKey]).send();
  },

  loadContract: async (args: {}) => {
    const { Votes } = await import('../../../contracts/build/src/Votes.js');
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

  doInitialStuff: async (args: {}) => {
    const useProof = false;

    const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
    Mina.setActiveInstance(Local);

    const { privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0];

    // Create a public/private key pair. The public key is our address and where we will deploy to
    const zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();

    // create an instance of Votes - and deploy it to zkAppAddress
    const zkAppInstance = new Votes(zkAppAddress);
    const deployTxn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkAppInstance.deploy();
    });
    console.log('zkApp deployed');
    await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

    console.log('zkApp deployed-');

    const txn = await Mina.transaction(deployerAccount, () => {
      zkAppInstance.initState(
        Field.random(), // votingID
        state.offChainInstance!.votersMerkleTree.getRoot() // Save the root of the voter list Merkle tree
      );
    });
    await txn.prove();
    await txn.sign([deployerKey]).send();

    console.log('zkApp initialized');
  },
  // getNum: async (args: {}) => {
  //   const currentNum = await state.zkapp!.num.get();
  //   return JSON.stringify(currentNum.toJSON());
  // },
  getNullifiersMerkleRoot: async (args: {}) => {
    const currentNullifiersMerkleRoot =
      await state.zkapp!.nullifiersMerkleRoot.get();
    return JSON.stringify(currentNullifiersMerkleRoot.toJSON());
  },
  getVoteCountMerkleRoot: async (args: {}) => {
    const currentVoteCountMerkleRoot =
      await state.zkapp!.voteCountMerkleRoot.get();
    return JSON.stringify(currentVoteCountMerkleRoot.toJSON());
  },
  getVotingID: async (args: {}) => {
    const currentVotingID = await state.zkapp!.votingID.get();
    return JSON.stringify(currentVotingID.toJSON());
  },
  // createVoteTransaction: async (args: {
  //   privateKey: PrivateKey;
  //   voterListWitness: VoterListMerkleWitness;
  //   nullifierWitness: MerkleMapWitness;
  //   voteCountWitness: VoteCountMerkleWitness;
  //   prevVoteCount: Field;
  // }) => {
  //   const transaction = await Mina.transaction(() => {
  //     state.zkapp!.vote(
  //       args.privateKey,
  //       args.voterListWitness,
  //       args.nullifierWitness,
  //       args.voteCountWitness,
  //       args.prevVoteCount
  //     );
  //   });
  //   state.transaction = transaction;
  // },
  proveUpdateTransaction: async (args: {}) => {
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

class OffChainStorage {
  readonly votersMerkleTree: MerkleTree;
  voteCountMerkleTree: MerkleTree;
  nullifierMerkleMap: MerkleMap;

  constructor(num_voters: number, options: number, voters: Field[]) {
    this.votersMerkleTree = new MerkleTree(num_voters + 1);
    this.voteCountMerkleTree = new MerkleTree(options + 1);
    this.nullifierMerkleMap = new MerkleMap();
    this.votersMerkleTree.fill(voters);
  }

  updateOffChainState(nullifierHash: Field, voteOption: bigint) {
    this.nullifierMerkleMap.set(nullifierHash, Field(1));
    const currentVote = this.voteCountMerkleTree.getNode(0, voteOption);
    this.voteCountMerkleTree.setLeaf(voteOption, currentVote.add(1));
  }
}

console.log('Web Worker Successfully Initialized.');
