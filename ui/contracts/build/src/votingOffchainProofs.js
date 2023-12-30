import { Field, PrivateKey, Poseidon, SelfProof, Struct, MerkleMapWitness, MerkleWitness, ZkProgram, } from 'o1js';
const num_voters = 2; // Total Number of Voters
const options = 2; // TOtal Number of Options
class VoterListMerkleWitness extends MerkleWitness(num_voters + 1) {
}
class VoteCountMerkleWitness extends MerkleWitness(options + 1) {
}
export class votingDataStruct extends Struct({
    nullifierHash: Field,
    voteChoice: Field,
    votersMerkleTreeRoot: Field,
    votingID: Field,
}) {
}
export class offChainStateChangeStruct extends Struct({
    votingID: Field,
    votersMerkleRoot: Field,
    nullifierMerkleRoot: Field,
    voteCountMerkleRoot: Field,
    modifiedNullifierMapMerkleRoot: Field,
    modifiedVoteCountMerkleRoot: Field,
}) {
}
export const votingDataProof = ZkProgram({
    name: 'votingDataProof',
    publicInput: votingDataStruct,
    methods: {
        verifyData: {
            privateInputs: [PrivateKey, VoterListMerkleWitness],
            method(voterInfo, voterPrivateKey, voterListWitness) {
                const leaf = Poseidon.hash(voterPrivateKey.toPublicKey().toFields());
                leaf.assertEquals(Poseidon.hash(voterPrivateKey.toPublicKey().toFields()));
                // Check that the leaf is in the merkle tree
                const calculatedVotersMerkleRoot = voterListWitness.calculateRoot(leaf);
                voterInfo.votersMerkleTreeRoot.assertEquals(calculatedVotersMerkleRoot);
                // Check that the voter has not already voted
                const calculatedNullifierHash = Poseidon.hash(voterPrivateKey.toFields().concat([voterInfo.votingID]));
                calculatedNullifierHash.assertEquals(Poseidon.hash(voterPrivateKey.toFields().concat([voterInfo.votingID])));
                // Verify that the nullifierHash of votingDataStruct is correct
                voterInfo.nullifierHash.assertEquals(calculatedNullifierHash);
            },
        },
    },
});
export const offChainStateProofs = ZkProgram({
    name: 'offChainStateProofs',
    publicInput: offChainStateChangeStruct,
    methods: {
        vote: {
            privateInputs: [
                ZkProgram.Proof(votingDataProof),
                MerkleMapWitness,
                VoteCountMerkleWitness,
                Field,
            ],
            method(stateChange, voteProof, nullifierWitness, voteCountWitness, voteCountLeaf) {
                // Verify previous proof
                voteProof.verify();
                // Check that votersMerkleTreeRoot and votingID are correct
                voteProof.publicInput.votersMerkleTreeRoot.assertEquals(stateChange.votersMerkleRoot);
                voteProof.publicInput.votingID.assertEquals(stateChange.votingID);
                const [calculatedNullifierMerkleRoot, calculatedNullifierKey] = nullifierWitness.computeRootAndKey(Field(0));
                stateChange.nullifierMerkleRoot.assertEquals(calculatedNullifierMerkleRoot);
                calculatedNullifierKey.assertEquals(voteProof.publicInput.nullifierHash);
                // Check the previous vote count is correct
                const calculatedVoteCountRoot = voteCountWitness.calculateRoot(voteCountLeaf);
                stateChange.voteCountMerkleRoot.assertEquals(calculatedVoteCountRoot);
                // Do voting
                stateChange.modifiedVoteCountMerkleRoot.assertEquals(voteCountWitness.calculateRoot(voteCountLeaf.add(1)));
                // Update the state of root of nullifier merkle tree to avoid double voting
                const [newNullifierMerkleRoot, _] = nullifierWitness.computeRootAndKey(Field(1));
                stateChange.modifiedNullifierMapMerkleRoot.assertEquals(newNullifierMerkleRoot);
            },
        },
        merge: {
            privateInputs: [SelfProof, SelfProof],
            method(stateChange, proof1, proof2) {
                // Verify both the proofs
                proof1.verify();
                proof2.verify();
                stateChange.votersMerkleRoot.assertEquals(proof1.publicInput.votersMerkleRoot);
                stateChange.votersMerkleRoot.assertEquals(proof2.publicInput.votersMerkleRoot);
                stateChange.votingID.assertEquals(proof1.publicInput.votingID);
                stateChange.votingID.assertEquals(proof2.publicInput.votingID);
                stateChange.nullifierMerkleRoot.assertEquals(proof1.publicInput.nullifierMerkleRoot);
                stateChange.voteCountMerkleRoot.assertEquals(proof1.publicInput.voteCountMerkleRoot);
                proof1.publicInput.modifiedNullifierMapMerkleRoot.assertEquals(proof2.publicInput.nullifierMerkleRoot);
                proof1.publicInput.modifiedVoteCountMerkleRoot.assertEquals(proof2.publicInput.voteCountMerkleRoot);
                proof2.publicInput.modifiedNullifierMapMerkleRoot.assertEquals(stateChange.modifiedNullifierMapMerkleRoot);
                proof2.publicInput.modifiedVoteCountMerkleRoot.assertEquals(stateChange.modifiedVoteCountMerkleRoot);
            },
        },
    },
});
const offChainStateProof = ZkProgram.Proof(offChainStateProofs);
export class OffChainStateProofs extends offChainStateProof {
}
//# sourceMappingURL=votingOffchainProofs.js.map