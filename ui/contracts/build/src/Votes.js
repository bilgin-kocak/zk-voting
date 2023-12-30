var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, Poseidon, MerkleMapWitness, Bool, MerkleMap, MerkleTree, MerkleWitness, Nullifier, } from 'o1js';
import { offChainStateChangeStruct, } from './votingOffchainProofs.js';
const num_voters = 2; // Total Number of Voters
const options = 2; // TOtal Number of Options
class VoterListMerkleWitness extends MerkleWitness(num_voters + 1) {
}
class VoteCountMerkleWitness extends MerkleWitness(options + 1) {
}
export class Votes extends SmartContract {
    constructor() {
        super(...arguments);
        this.votersMerkleRoot = State();
        this.nullifiersMerkleRoot = State();
        this.voteCountMerkleRoot = State();
        this.isInitialized = State();
        this.votingID = State();
    }
    init() {
        super.init();
        // Initialize the state variables
        this.isInitialized.set(Bool(false));
        this.nullifiersMerkleRoot.set(new MerkleMap().getRoot());
        this.voteCountMerkleRoot.set(new MerkleTree(options + 1).getRoot());
        this.votersMerkleRoot.set(Field(0));
        this.votingID.set(Field(0));
    }
    initState(votingID, votersMerkleTree) {
        this.isInitialized.assertEquals(Bool(false));
        // Set vote count root to the root of a new MerkleMap object
        this.votersMerkleRoot.set(votersMerkleTree);
        this.votingID.set(votingID);
        this.isInitialized.set(Bool(true));
    }
    vote(nullifier, voterListWitness, nullifierWitness, voteCountWitness, prevVoteCount) {
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
        const calculatedVoteCountMerkleRoot = voteCountWitness.calculateRoot(prevVoteCount);
        this.voteCountMerkleRoot.assertEquals(calculatedVoteCountMerkleRoot);
        // Do voting and update the state of root of vote count merkle tree
        this.voteCountMerkleRoot.set(voteCountWitness.calculateRoot(prevVoteCount.add(1)));
        // Update the state of root of nullifier merkle tree to avoid double voting
        const [newNullifierMerkleRoot, _] = nullifierWitness.computeRootAndKey(Field(1));
        this.nullifiersMerkleRoot.set(newNullifierMerkleRoot);
    }
    verifyTally(voteProof) {
        const currentVoterListRoot = this.votersMerkleRoot.getAndAssertEquals();
        const currentNullifierMapRoot = this.nullifiersMerkleRoot.getAndAssertEquals();
        const currentVoteCountRoot = this.voteCountMerkleRoot.getAndAssertEquals();
        const currentBallotID = this.votingID.getAndAssertEquals();
        // assert that the aggregate proof begins with the correct state variables
        voteProof.votingID.assertEquals(currentBallotID);
        voteProof.votersMerkleRoot.assertEquals(currentVoterListRoot);
        voteProof.nullifierMerkleRoot.assertEquals(currentNullifierMapRoot);
        voteProof.voteCountMerkleRoot.assertEquals(currentVoteCountRoot);
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Votes.prototype, "votersMerkleRoot", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Votes.prototype, "nullifiersMerkleRoot", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Votes.prototype, "voteCountMerkleRoot", void 0);
__decorate([
    state(Bool),
    __metadata("design:type", Object)
], Votes.prototype, "isInitialized", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Votes.prototype, "votingID", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field]),
    __metadata("design:returntype", void 0)
], Votes.prototype, "initState", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Nullifier,
        VoterListMerkleWitness,
        MerkleMapWitness,
        VoteCountMerkleWitness,
        Field]),
    __metadata("design:returntype", void 0)
], Votes.prototype, "vote", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [offChainStateChangeStruct]),
    __metadata("design:returntype", void 0)
], Votes.prototype, "verifyTally", null);
//# sourceMappingURL=Votes.js.map