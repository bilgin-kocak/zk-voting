import { Field, Mina, PrivateKey, AccountUpdate, MerkleTree, MerkleMap, Poseidon, MerkleWitness, Nullifier, MerkleMapWitness, Provable, } from 'o1js';
import { Votes } from './Votes.js';
import { offChainStateChangeStruct, } from './votingOffchainProofs.js';
const num_voters = 2; // Total Number of Voters
const options = 2; // TOtal Number of Options
class VoterListMerkleWitness extends MerkleWitness(num_voters + 1) {
}
class VoteCountMerkleWitness extends MerkleWitness(options + 1) {
}
let privateKeys = [
    PrivateKey.random(),
    PrivateKey.random(),
    PrivateKey.random(),
    PrivateKey.random(),
];
let publicKeys = privateKeys.map((key) => key.toPublicKey());
class OffChainStorage {
    constructor(num_voters, options, voters, nullifier) {
        this.votersMerkleTree = new MerkleTree(num_voters + 1);
        this.voteCountMerkleTree = new MerkleTree(options + 1);
        this.nullifierMerkleMap = new MerkleMap();
        this.nullifier = nullifier;
        this.votersMerkleTree.fill(voters);
    }
    updateOffChainState(nullifier, voteOption) {
        // this.nullifierMerkleMap.set(nullifierHash, Field(1));
        this.nullifierMerkleMap.set(nullifier.key(), Field(1));
        this.nullifier = nullifier;
        const currentVote = this.voteCountMerkleTree.getNode(0, voteOption);
        this.voteCountMerkleTree.setLeaf(voteOption, currentVote.add(1));
    }
}
let publicKeyHashes = publicKeys.map((key) => Poseidon.hash(key.toFields()));
console.log('generating nullifier');
// a special account that is allowed to pull out half of the zkapp balance, once
let privilegedKey = privateKeys[0];
let privilegedAddress = privilegedKey.toPublicKey();
// a unique message
let nullifierMessage = Field(5);
let jsonNullifier = Nullifier.createTestNullifier([], privilegedKey);
console.log(jsonNullifier);
const nullifier = Nullifier.fromJSON(jsonNullifier);
// let nullifierWitness = Provable.witness(MerkleMapWitness, () =>
//   offChainInstance.nullifierMerkleMap.getWitness(nullifier.key())
// );
let offChainInstance = new OffChainStorage(num_voters, options, publicKeyHashes, nullifier);
// ZkApp deployment
const useProof = false;
const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } = Local.testAccounts[0];
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
// dispAllVar(zkAppInstance);
{
    const txn = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.initState(Field.random(), // votingID
        offChainInstance.votersMerkleTree.getRoot() // Save the root of the voter list Merkle tree
        );
    });
    await txn.prove();
    await txn.sign([deployerKey]).send();
}
console.log('zkApp initialized');
console.log('\nvoteCountMerkleTree After Initilization: ');
displayTree(offChainInstance.voteCountMerkleTree);
{
    // USER 1 TRIES TO VOTE (Successful Voting)
    console.log('\n User 1 tries to vote for option 0');
    // Create Witness
    const votersWitness = new VoterListMerkleWitness(offChainInstance.votersMerkleTree.getWitness(0n));
    const votingID = zkAppInstance.votingID.get();
    // const nullifierHash = Poseidon.hash(
    //   privateKeys[0].toFields().concat([votingID])
    // );
    // const nullifierWitness =
    //   offChainInstance.nullifierMerkleMap.getWitness(nullifierHash);
    let nullifierWitness = Provable.witness(MerkleMapWitness, () => offChainInstance.nullifierMerkleMap.getWitness(nullifier.key()));
    const option = 0n;
    const voteCountsWitness = new VoteCountMerkleWitness(offChainInstance.voteCountMerkleTree.getWitness(option));
    const currentVotes = offChainInstance.voteCountMerkleTree.getNode(0, option);
    // Do voting and update the state of root of vote count merkle tree from user 1
    try {
        const txn = await Mina.transaction(deployerAccount, () => {
            zkAppInstance.vote(Nullifier.fromJSON(jsonNullifier), votersWitness, nullifierWitness, voteCountsWitness, currentVotes);
        });
        await txn.prove();
        const txnResult = await txn.sign([deployerKey]).send();
        // Update the offchain state
        if (txnResult.isSuccess) {
            // offChainInstance.updateOffChainState(nullifierHash, option);
            nullifier.setUsed(nullifierWitness);
            offChainInstance.nullifier = nullifier;
            offChainInstance.updateOffChainState(nullifier, option);
        }
    }
    catch (err) {
        console.error('Error:', err.message);
    }
}
console.log('\nvoteCountMerkleTree After Vote of User 1: ');
displayTree(offChainInstance.voteCountMerkleTree);
{
    // USER 2 TRIES TO VOTE (Successful Voting)
    console.log('\n User 2 tries to vote for option 0');
    // Create a witness for index 1 for user 2
    const votersWitness = new VoterListMerkleWitness(offChainInstance.votersMerkleTree.getWitness(1n));
    const votingID = zkAppInstance.votingID.get();
    // private_key[1] used - not yet voted with this
    // const nullifierHash = Poseidon.hash(
    //   privateKeys[1].toFields().concat([votingID])
    // );
    // const nullifierWitness =
    //   offChainInstance.nullifierMerkleMap.getWitness(nullifierHash);
    let privilegedKey = privateKeys[1];
    let jsonNullifier = Nullifier.createTestNullifier([], privilegedKey);
    const nullifier = Nullifier.fromJSON(jsonNullifier);
    const nullifierWitness = Provable.witness(MerkleMapWitness, () => offChainInstance.nullifierMerkleMap.getWitness(nullifier.key()));
    const option = 0n;
    const voteCountsWitness = new VoteCountMerkleWitness(offChainInstance.voteCountMerkleTree.getWitness(option));
    const currentVotes = offChainInstance.voteCountMerkleTree.getNode(0, option);
    try {
        const txn = await Mina.transaction(deployerAccount, () => {
            zkAppInstance.vote(Nullifier.fromJSON(jsonNullifier), votersWitness, nullifierWitness, voteCountsWitness, currentVotes);
        });
        await txn.prove();
        const txnResult = await txn.sign([deployerKey]).send();
        // update the off chain state only if the txn succeeds
        if (txnResult.isSuccess) {
            // update off chain state
            nullifier.setUsed(nullifierWitness);
            offChainInstance.updateOffChainState(nullifier, option);
        }
    }
    catch (err) {
        console.error('Error:', err.message);
    }
}
console.log('\nvoteCountMerkleTree After Vote of User 2: ');
displayTree(offChainInstance.voteCountMerkleTree);
{
    // USER 2 TRIES TO VOTE AGAIN (Voting Fails)
    console.log('\n User 2 tries to vote again. It must fail');
    // Create a witness for index 1 for user 2
    const votersWitness = new VoterListMerkleWitness(offChainInstance.votersMerkleTree.getWitness(1n));
    const votingID = zkAppInstance.votingID.get();
    let privilegedKey = privateKeys[1];
    let jsonNullifier = Nullifier.createTestNullifier([], privilegedKey);
    const nullifier = Nullifier.fromJSON(jsonNullifier);
    const nullifierWitness = Provable.witness(MerkleMapWitness, () => offChainInstance.nullifierMerkleMap.getWitness(nullifier.key()));
    const option = 1n;
    const voteCountsWitness = new VoteCountMerkleWitness(offChainInstance.voteCountMerkleTree.getWitness(option));
    const currentVotes = offChainInstance.voteCountMerkleTree.getNode(0, option);
    try {
        const txn = await Mina.transaction(deployerAccount, () => {
            zkAppInstance.vote(nullifier, votersWitness, nullifierWitness, voteCountsWitness, currentVotes);
        });
        await txn.prove();
        const txnResult = await txn.sign([deployerKey]).send();
        // update the off chain state only if the txn succeeds
        if (txnResult.isSuccess) {
            // update off chain state
            nullifier.setUsed(nullifierWitness);
            offChainInstance.updateOffChainState(nullifier, option);
        }
    }
    catch (err) {
        console.error('Error:', err.message);
    }
}
console.log('\nvoteCountMerkleTree After Second Vote of User 2: ');
displayTree(offChainInstance.voteCountMerkleTree);
{
    // USER 3 TRIES TO VOTE (Succesfull Voting)
    // console.log('\n User 3 tries to vote with wrong private key. It must fail');
    // create witness for index 1
    const votersWitness = new VoterListMerkleWitness(offChainInstance.votersMerkleTree.getWitness(2n));
    const votingID = zkAppInstance.votingID.get();
    // private_key[1] used - not yet voted with this
    let privilegedKey = privateKeys[2];
    let jsonNullifier = Nullifier.createTestNullifier([], privilegedKey);
    const nullifier = Nullifier.fromJSON(jsonNullifier);
    const nullifierWitness = Provable.witness(MerkleMapWitness, () => offChainInstance.nullifierMerkleMap.getWitness(nullifier.key()));
    const option = 0n;
    const voteCountsWitness = new VoteCountMerkleWitness(offChainInstance.voteCountMerkleTree.getWitness(option));
    const currentVotes = offChainInstance.voteCountMerkleTree.getNode(0, option);
    try {
        const txn = await Mina.transaction(deployerAccount, () => {
            zkAppInstance.vote(nullifier, votersWitness, nullifierWitness, voteCountsWitness, currentVotes);
        });
        await txn.prove();
        const txnResult = await txn.sign([deployerKey]).send();
        // update the off chain state only if the txn succeeds
        if (txnResult.isSuccess) {
            // update off chain state
            nullifier.setUsed(nullifierWitness);
            offChainInstance.updateOffChainState(nullifier, option);
        }
    }
    catch (err) {
        console.error('Error:', err.message);
    }
}
console.log('\nvoteCountMerkleTree After Vote of User 3: ');
displayTree(offChainInstance.voteCountMerkleTree);
{
    // USER 4 TRIES TO VOTE (Successful Voting)
    console.log('\n User 4 tries to vote for option 1.');
    // create witness for index 1
    const votersWitness = new VoterListMerkleWitness(offChainInstance.votersMerkleTree.getWitness(3n));
    const votingID = zkAppInstance.votingID.get();
    // private_key[1] used - not yet voted with this
    let privilegedKey = privateKeys[3];
    let jsonNullifier = Nullifier.createTestNullifier([], privilegedKey);
    const nullifier = Nullifier.fromJSON(jsonNullifier);
    const nullifierWitness = Provable.witness(MerkleMapWitness, () => offChainInstance.nullifierMerkleMap.getWitness(nullifier.key()));
    // vote for option 1
    const option = 1n;
    const voteCountsWitness = new VoteCountMerkleWitness(offChainInstance.voteCountMerkleTree.getWitness(option));
    const currentVotes = offChainInstance.voteCountMerkleTree.getNode(0, option);
    try {
        const txn = await Mina.transaction(deployerAccount, () => {
            zkAppInstance.vote(nullifier, votersWitness, nullifierWitness, voteCountsWitness, currentVotes);
        });
        await txn.prove();
        const txnResult = await txn.sign([deployerKey]).send();
        // update the off chain state only if the txn succeeds
        if (txnResult.isSuccess) {
            // update off chain state
            nullifier.setUsed(nullifierWitness);
            offChainInstance.updateOffChainState(nullifier, option);
        }
    }
    catch (err) {
        console.error('Error:', err.message);
    }
}
console.log('\nvoteCountMerkleTree After Vote of User 4: ');
displayTree(offChainInstance.voteCountMerkleTree);
{
    // USER TRIES TO TALLY (Successful Voting)
    console.log('\n User tries to prove tally.');
    const offChainStateInstance = new offChainStateChangeStruct({
        votingID: zkAppInstance.votingID.get(),
        votersMerkleRoot: offChainInstance.votersMerkleTree.getRoot(),
        nullifierMerkleRoot: offChainInstance.nullifierMerkleMap.getRoot(),
        voteCountMerkleRoot: offChainInstance.voteCountMerkleTree.getRoot(),
        modifiedNullifierMapMerkleRoot: offChainInstance.nullifierMerkleMap.getRoot(),
        modifiedVoteCountMerkleRoot: offChainInstance.voteCountMerkleTree.getRoot(),
    });
    try {
        const txn = await Mina.transaction(deployerAccount, () => {
            zkAppInstance.verifyTally(offChainStateInstance);
        });
        await txn.prove();
        const txnResult = await txn.sign([deployerKey]).send();
        if (txnResult.isSuccess) {
            console.log('Tally verified successfully');
            console.log('The merkle tree of the vote count is:');
            displayTree(offChainInstance.voteCountMerkleTree);
            console.log('\nVoting Results:');
            console.log('Option 1: 3 \nOption 2: 1');
        }
    }
    catch (err) {
        console.error('Error:', err.message);
    }
}
function displayTree(mtree) {
    let h = mtree.height;
    for (let i = 0; i < h; i++) {
        console.log('Level:', i);
        for (let j = 0; j < 2 ** (h - 1 - i); j++) {
            console.log(mtree.getNode(i, BigInt(j)).toString());
        }
    }
}
//# sourceMappingURL=main.js.map