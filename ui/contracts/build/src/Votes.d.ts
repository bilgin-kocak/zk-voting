import { Field, SmartContract, State, MerkleMapWitness, Nullifier } from 'o1js';
import { offChainStateChangeStruct } from './votingOffchainProofs.js';
declare const VoterListMerkleWitness_base: typeof import("o1js/dist/node/lib/merkle_tree.js").BaseMerkleWitness;
declare class VoterListMerkleWitness extends VoterListMerkleWitness_base {
}
declare const VoteCountMerkleWitness_base: typeof import("o1js/dist/node/lib/merkle_tree.js").BaseMerkleWitness;
declare class VoteCountMerkleWitness extends VoteCountMerkleWitness_base {
}
export declare class Votes extends SmartContract {
    votersMerkleRoot: State<import("o1js/dist/node/lib/field.js").Field>;
    nullifiersMerkleRoot: State<import("o1js/dist/node/lib/field.js").Field>;
    voteCountMerkleRoot: State<import("o1js/dist/node/lib/field.js").Field>;
    isInitialized: State<import("o1js/dist/node/lib/bool.js").Bool>;
    votingID: State<import("o1js/dist/node/lib/field.js").Field>;
    init(): void;
    initState(votingID: Field, votersMerkleTree: Field): void;
    vote(nullifier: Nullifier, voterListWitness: VoterListMerkleWitness, nullifierWitness: MerkleMapWitness, voteCountWitness: VoteCountMerkleWitness, prevVoteCount: Field): void;
    verifyTally(voteProof: offChainStateChangeStruct): void;
}
export {};
