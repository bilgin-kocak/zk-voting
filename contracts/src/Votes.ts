import {
  Field,
  SmartContract,
  state,
  State,
  method,
  PublicKey,
  Poseidon,
  MerkleMapWitness,
} from 'o1js';

export class Votes extends SmartContract {
  //MerkleMap key: PublicKey value: count(Votes)
  @state(Field) candidates = State<Field>();
  //Merkle Map: PublicKey    value: 1 (Already has voted)
  @state(Field) voters = State<Field>();

  @method initState(initialRootCandidates: Field, initialRootVoters: Field) {
    this.candidates.set(initialRootCandidates);
    this.voters.set(initialRootVoters);
  }
}
