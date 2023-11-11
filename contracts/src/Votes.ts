import {
  Field,
  SmartContract,
  state,
  State,
  method,
  PublicKey,
  Poseidon,
  MerkleMapWitness,
  Bool,
  MerkleMap,
  MerkleTree,
  MerkleWitness,
} from 'o1js';

const num_voters = 2; // Total Number of Voters
const options = 2; // TOtal Number of Options

export class VoterListMerkleWitness extends MerkleWitness(num_voters + 1) {}
export class VoteCountMerkleWitness extends MerkleWitness(options + 1) {}

export class Votes extends SmartContract {
  @state(Field) votersMerkleRoot = State<Field>();
  @state(Field) nullifiersMerkleRoot = State<Field>();
  @state(Field) voteCountMerkleRoot = State<Field>();

  @state(Bool) isInitialized = State<Bool>();
  @state(Field) votingID = State<Field>();

  init() {
    super.init();
    // Initialize the state variables
    this.isInitialized.set(Bool(false));
    this.nullifiersMerkleRoot.set(new MerkleMap().getRoot());
    this.voteCountMerkleRoot.set(new MerkleTree(options + 1).getRoot());
    this.votersMerkleRoot.set(Field(0));
    this.votingID.set(Field(0));
  }

  @method initState(votingID: Field, votersMerkleTree: Field) {
    this.isInitialized.assertEquals(Bool(false));
    // Set vote count root to the root of a new MerkleMap object
    this.votersMerkleRoot.set(votersMerkleTree);
    this.votingID.set(votingID);
    this.isInitialized.set(Bool(true));
  }
}
