import {
  Field,
  SmartContract,
  state,
  State,
  method,
  PrivateKey,
  PublicKey,
  Poseidon,
  MerkleMapWitness,
  Bool,
  MerkleMap,
  MerkleTree,
  MerkleWitness,
  Nullifier,
  Circuit,
} from 'o1js';

import {
  OffChainStateProofs,
  offChainStateChangeStruct,
} from './votingOffchainProofs.js';

const num_voters = 2; // Total Number of Voters
const options = 2; // TOtal Number of Options

class VoterListMerkleWitness extends MerkleWitness(num_voters + 1) {}
class VoteCountMerkleWitness extends MerkleWitness(options + 1) {}

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

  @method vote(
    nullifier: Nullifier,
    voterListWitness: VoterListMerkleWitness,
    nullifierWitness: MerkleMapWitness,
    voteCountWitness: VoteCountMerkleWitness,
    prevVoteCount: Field
  ) {
    // After initialisation, allow voting
    this.isInitialized.assertEquals(Bool(true));

    const currentVoteCountRoot = this.voteCountMerkleRoot.getAndAssertEquals();
    const currentNullifierRoot = this.nullifiersMerkleRoot.getAndAssertEquals();
    const currentVotersRoot = this.votersMerkleRoot.getAndAssertEquals();
    const currentVotingID = this.votingID.getAndAssertEquals();

    // we compute the current root and make sure the entry is set to 0 (= unused)
    nullifier.assertUnused(nullifierWitness, currentNullifierRoot);

    // Get public key from the nullifier
    const publicKey = nullifier.getPublicKey();

    // Authentication of the voter
    const leafVoter = Poseidon.hash(publicKey.toFields());
    leafVoter.assertEquals(Poseidon.hash(publicKey.toFields()));

    const calculatedMerkleRoot = voterListWitness.calculateRoot(leafVoter);
    this.votersMerkleRoot.assertEquals(calculatedMerkleRoot);

    // we set the nullifier to 1 (= used) and calculate the new root
    let newRoot = nullifier.setUsed(nullifierWitness);

    // we update the on-chain root
    this.nullifiersMerkleRoot.set(newRoot);

    // Check previous vote count is correct
    const calculatedVoteCountMerkleRoot =
      voteCountWitness.calculateRoot(prevVoteCount);
    this.voteCountMerkleRoot.assertEquals(calculatedVoteCountMerkleRoot);

    // Do voting and update the state of root of vote count merkle tree
    this.voteCountMerkleRoot.set(
      voteCountWitness.calculateRoot(prevVoteCount.add(1))
    );

    // Update the state of root of nullifier merkle tree to avoid double voting
    const [newNullifierMerkleRoot, _] = nullifierWitness.computeRootAndKey(
      Field(1)
    );
    this.nullifiersMerkleRoot.set(newNullifierMerkleRoot);
  }

  @method verifyTally(voteProof: offChainStateChangeStruct) {
    const currentVoterListRoot = this.votersMerkleRoot.getAndAssertEquals();
    const currentNullifierMapRoot =
      this.nullifiersMerkleRoot.getAndAssertEquals();
    const currentVoteCountRoot = this.voteCountMerkleRoot.getAndAssertEquals();
    const currentBallotID = this.votingID.getAndAssertEquals();

    // assert that the aggregate proof begins with the correct state variables
    voteProof.votingID.assertEquals(currentBallotID);
    voteProof.votersMerkleRoot.assertEquals(currentVoterListRoot);
    voteProof.nullifierMerkleRoot.assertEquals(currentNullifierMapRoot);
    voteProof.voteCountMerkleRoot.assertEquals(currentVoteCountRoot);
  }
}
