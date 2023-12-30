import { PrivateKey, SelfProof, MerkleMapWitness, Proof } from 'o1js';
declare const VoterListMerkleWitness_base: typeof import("o1js/dist/node/lib/merkle_tree").BaseMerkleWitness;
declare class VoterListMerkleWitness extends VoterListMerkleWitness_base {
}
declare const VoteCountMerkleWitness_base: typeof import("o1js/dist/node/lib/merkle_tree").BaseMerkleWitness;
declare class VoteCountMerkleWitness extends VoteCountMerkleWitness_base {
}
declare const votingDataStruct_base: (new (value: {
    nullifierHash: import("o1js/dist/node/lib/field").Field;
    voteChoice: import("o1js/dist/node/lib/field").Field;
    votersMerkleTreeRoot: import("o1js/dist/node/lib/field").Field;
    votingID: import("o1js/dist/node/lib/field").Field;
}) => {
    nullifierHash: import("o1js/dist/node/lib/field").Field;
    voteChoice: import("o1js/dist/node/lib/field").Field;
    votersMerkleTreeRoot: import("o1js/dist/node/lib/field").Field;
    votingID: import("o1js/dist/node/lib/field").Field;
}) & {
    _isStruct: true;
} & import("o1js/dist/node/snarky").ProvablePure<{
    nullifierHash: import("o1js/dist/node/lib/field").Field;
    voteChoice: import("o1js/dist/node/lib/field").Field;
    votersMerkleTreeRoot: import("o1js/dist/node/lib/field").Field;
    votingID: import("o1js/dist/node/lib/field").Field;
}> & {
    toInput: (x: {
        nullifierHash: import("o1js/dist/node/lib/field").Field;
        voteChoice: import("o1js/dist/node/lib/field").Field;
        votersMerkleTreeRoot: import("o1js/dist/node/lib/field").Field;
        votingID: import("o1js/dist/node/lib/field").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        nullifierHash: import("o1js/dist/node/lib/field").Field;
        voteChoice: import("o1js/dist/node/lib/field").Field;
        votersMerkleTreeRoot: import("o1js/dist/node/lib/field").Field;
        votingID: import("o1js/dist/node/lib/field").Field;
    }) => {
        nullifierHash: string;
        voteChoice: string;
        votersMerkleTreeRoot: string;
        votingID: string;
    };
    fromJSON: (x: {
        nullifierHash: string;
        voteChoice: string;
        votersMerkleTreeRoot: string;
        votingID: string;
    }) => {
        nullifierHash: import("o1js/dist/node/lib/field").Field;
        voteChoice: import("o1js/dist/node/lib/field").Field;
        votersMerkleTreeRoot: import("o1js/dist/node/lib/field").Field;
        votingID: import("o1js/dist/node/lib/field").Field;
    };
    empty: () => {
        nullifierHash: import("o1js/dist/node/lib/field").Field;
        voteChoice: import("o1js/dist/node/lib/field").Field;
        votersMerkleTreeRoot: import("o1js/dist/node/lib/field").Field;
        votingID: import("o1js/dist/node/lib/field").Field;
    };
};
export declare class votingDataStruct extends votingDataStruct_base {
}
declare const offChainStateChangeStruct_base: (new (value: {
    votingID: import("o1js/dist/node/lib/field").Field;
    votersMerkleRoot: import("o1js/dist/node/lib/field").Field;
    nullifierMerkleRoot: import("o1js/dist/node/lib/field").Field;
    voteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
    modifiedNullifierMapMerkleRoot: import("o1js/dist/node/lib/field").Field;
    modifiedVoteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
}) => {
    votingID: import("o1js/dist/node/lib/field").Field;
    votersMerkleRoot: import("o1js/dist/node/lib/field").Field;
    nullifierMerkleRoot: import("o1js/dist/node/lib/field").Field;
    voteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
    modifiedNullifierMapMerkleRoot: import("o1js/dist/node/lib/field").Field;
    modifiedVoteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
}) & {
    _isStruct: true;
} & import("o1js/dist/node/snarky").ProvablePure<{
    votingID: import("o1js/dist/node/lib/field").Field;
    votersMerkleRoot: import("o1js/dist/node/lib/field").Field;
    nullifierMerkleRoot: import("o1js/dist/node/lib/field").Field;
    voteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
    modifiedNullifierMapMerkleRoot: import("o1js/dist/node/lib/field").Field;
    modifiedVoteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
}> & {
    toInput: (x: {
        votingID: import("o1js/dist/node/lib/field").Field;
        votersMerkleRoot: import("o1js/dist/node/lib/field").Field;
        nullifierMerkleRoot: import("o1js/dist/node/lib/field").Field;
        voteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
        modifiedNullifierMapMerkleRoot: import("o1js/dist/node/lib/field").Field;
        modifiedVoteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        votingID: import("o1js/dist/node/lib/field").Field;
        votersMerkleRoot: import("o1js/dist/node/lib/field").Field;
        nullifierMerkleRoot: import("o1js/dist/node/lib/field").Field;
        voteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
        modifiedNullifierMapMerkleRoot: import("o1js/dist/node/lib/field").Field;
        modifiedVoteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
    }) => {
        votingID: string;
        votersMerkleRoot: string;
        nullifierMerkleRoot: string;
        voteCountMerkleRoot: string;
        modifiedNullifierMapMerkleRoot: string;
        modifiedVoteCountMerkleRoot: string;
    };
    fromJSON: (x: {
        votingID: string;
        votersMerkleRoot: string;
        nullifierMerkleRoot: string;
        voteCountMerkleRoot: string;
        modifiedNullifierMapMerkleRoot: string;
        modifiedVoteCountMerkleRoot: string;
    }) => {
        votingID: import("o1js/dist/node/lib/field").Field;
        votersMerkleRoot: import("o1js/dist/node/lib/field").Field;
        nullifierMerkleRoot: import("o1js/dist/node/lib/field").Field;
        voteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
        modifiedNullifierMapMerkleRoot: import("o1js/dist/node/lib/field").Field;
        modifiedVoteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
    };
    empty: () => {
        votingID: import("o1js/dist/node/lib/field").Field;
        votersMerkleRoot: import("o1js/dist/node/lib/field").Field;
        nullifierMerkleRoot: import("o1js/dist/node/lib/field").Field;
        voteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
        modifiedNullifierMapMerkleRoot: import("o1js/dist/node/lib/field").Field;
        modifiedVoteCountMerkleRoot: import("o1js/dist/node/lib/field").Field;
    };
};
export declare class offChainStateChangeStruct extends offChainStateChangeStruct_base {
}
export declare const votingDataProof: {
    name: string;
    compile: (options?: {
        cache?: import("o1js/dist/node/lib/proof-system/cache").Cache | undefined;
        forceRecompile?: boolean | undefined;
    } | undefined) => Promise<{
        verificationKey: {
            data: string;
            hash: import("o1js/dist/node/lib/field").Field;
        };
    }>;
    verify: (proof: Proof<votingDataStruct, void>) => Promise<boolean>;
    digest: () => string;
    analyzeMethods: () => {
        verifyData: {
            rows: number;
            digest: string;
            result: unknown;
            gates: import("o1js/dist/node/snarky").Gate[];
            publicInputSize: number;
            print(): void;
            summary(): Partial<Record<import("o1js/dist/node/snarky").GateType | "Total rows", number>>;
        };
    };
    publicInputType: typeof votingDataStruct;
    publicOutputType: import("o1js/dist/node/lib/circuit_value").ProvablePureExtended<void, null>;
    privateInputTypes: {
        verifyData: [typeof PrivateKey, typeof VoterListMerkleWitness];
    };
    rawMethods: {
        verifyData: (publicInput: votingDataStruct, ...args: [PrivateKey, VoterListMerkleWitness] & any[]) => void;
    };
} & {
    verifyData: (publicInput: votingDataStruct, ...args: [PrivateKey, VoterListMerkleWitness] & any[]) => Promise<Proof<votingDataStruct, void>>;
};
export declare const offChainStateProofs: {
    name: string;
    compile: (options?: {
        cache?: import("o1js/dist/node/lib/proof-system/cache").Cache | undefined;
        forceRecompile?: boolean | undefined;
    } | undefined) => Promise<{
        verificationKey: {
            data: string;
            hash: import("o1js/dist/node/lib/field").Field;
        };
    }>;
    verify: (proof: Proof<offChainStateChangeStruct, void>) => Promise<boolean>;
    digest: () => string;
    analyzeMethods: () => {
        vote: {
            rows: number;
            digest: string;
            result: unknown;
            gates: import("o1js/dist/node/snarky").Gate[];
            publicInputSize: number;
            print(): void;
            summary(): Partial<Record<import("o1js/dist/node/snarky").GateType | "Total rows", number>>;
        };
        merge: {
            rows: number;
            digest: string;
            result: unknown;
            gates: import("o1js/dist/node/snarky").Gate[];
            publicInputSize: number;
            print(): void;
            summary(): Partial<Record<import("o1js/dist/node/snarky").GateType | "Total rows", number>>;
        };
    };
    publicInputType: typeof offChainStateChangeStruct;
    publicOutputType: import("o1js/dist/node/lib/circuit_value").ProvablePureExtended<void, null>;
    privateInputTypes: {
        vote: [{
            new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
                proof: unknown;
                publicInput: votingDataStruct;
                publicOutput: void;
                maxProofsVerified: 0 | 2 | 1;
            }): {
                publicInput: votingDataStruct;
                publicOutput: void;
                proof: unknown;
                maxProofsVerified: 0 | 2 | 1;
                shouldVerify: import("o1js/dist/node/lib/bool").Bool;
                verify(): void;
                verifyIf(condition: import("o1js/dist/node/lib/bool").Bool): void;
                toJSON(): import("o1js/dist/node/lib/proof_system").JsonProof;
            };
            publicInputType: typeof votingDataStruct;
            publicOutputType: import("o1js/dist/node/lib/circuit_value").ProvablePureExtended<void, null>;
            tag: () => {
                name: string;
                publicInputType: typeof votingDataStruct;
                publicOutputType: import("o1js/dist/node/lib/circuit_value").ProvablePureExtended<void, null>;
            };
            fromJSON<S extends (new (...args: any) => Proof<unknown, unknown>) & {
                prototype: Proof<any, any>;
                publicInputType: import("o1js/dist/node/lib/circuit_value").FlexibleProvablePure<any>;
                publicOutputType: import("o1js/dist/node/lib/circuit_value").FlexibleProvablePure<any>;
                tag: () => {
                    name: string;
                };
                fromJSON: typeof Proof.fromJSON;
                dummy: typeof Proof.dummy;
            } & {
                prototype: Proof<unknown, unknown>;
            }>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js/dist/node/lib/proof_system").JsonProof): Proof<import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicInputType"], import("o1js/dist/node/lib/field").Field>, import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicOutputType"], import("o1js/dist/node/lib/field").Field>>;
            dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 2 | 1, domainLog2?: number | undefined): Promise<Proof<Input, OutPut>>;
        }, typeof MerkleMapWitness, typeof VoteCountMerkleWitness, typeof import("o1js/dist/node/lib/field").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/field").Field | import("o1js/dist/node/lib/field").FieldVar | import("o1js/dist/node/lib/field").FieldConst) => import("o1js/dist/node/lib/field").Field)];
        merge: [typeof SelfProof, typeof SelfProof];
    };
    rawMethods: {
        vote: (publicInput: offChainStateChangeStruct, ...args: [{
            publicInput: votingDataStruct;
            publicOutput: void;
            proof: unknown;
            maxProofsVerified: 0 | 2 | 1;
            shouldVerify: import("o1js/dist/node/lib/bool").Bool;
            verify(): void;
            verifyIf(condition: import("o1js/dist/node/lib/bool").Bool): void;
            toJSON(): import("o1js/dist/node/lib/proof_system").JsonProof;
        }, MerkleMapWitness, VoteCountMerkleWitness, import("o1js/dist/node/lib/field").Field] & any[]) => void;
        merge: (publicInput: offChainStateChangeStruct, ...args: [SelfProof<unknown, unknown>, SelfProof<unknown, unknown>] & any[]) => void;
    };
} & {
    vote: (publicInput: offChainStateChangeStruct, ...args: [{
        publicInput: votingDataStruct;
        publicOutput: void;
        proof: unknown;
        maxProofsVerified: 0 | 2 | 1;
        shouldVerify: import("o1js/dist/node/lib/bool").Bool;
        verify(): void;
        verifyIf(condition: import("o1js/dist/node/lib/bool").Bool): void;
        toJSON(): import("o1js/dist/node/lib/proof_system").JsonProof;
    }, MerkleMapWitness, VoteCountMerkleWitness, import("o1js/dist/node/lib/field").Field] & any[]) => Promise<Proof<offChainStateChangeStruct, void>>;
    merge: (publicInput: offChainStateChangeStruct, ...args: [SelfProof<unknown, unknown>, SelfProof<unknown, unknown>] & any[]) => Promise<Proof<offChainStateChangeStruct, void>>;
};
declare const offChainStateProof: {
    new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
        proof: unknown;
        publicInput: offChainStateChangeStruct;
        publicOutput: void;
        maxProofsVerified: 0 | 2 | 1;
    }): {
        publicInput: offChainStateChangeStruct;
        publicOutput: void;
        proof: unknown;
        maxProofsVerified: 0 | 2 | 1;
        shouldVerify: import("o1js/dist/node/lib/bool").Bool;
        verify(): void;
        verifyIf(condition: import("o1js/dist/node/lib/bool").Bool): void;
        toJSON(): import("o1js/dist/node/lib/proof_system").JsonProof;
    };
    publicInputType: typeof offChainStateChangeStruct;
    publicOutputType: import("o1js/dist/node/lib/circuit_value").ProvablePureExtended<void, null>;
    tag: () => {
        name: string;
        publicInputType: typeof offChainStateChangeStruct;
        publicOutputType: import("o1js/dist/node/lib/circuit_value").ProvablePureExtended<void, null>;
    };
    fromJSON<S extends (new (...args: any) => Proof<unknown, unknown>) & {
        prototype: Proof<any, any>;
        publicInputType: import("o1js/dist/node/lib/circuit_value").FlexibleProvablePure<any>;
        publicOutputType: import("o1js/dist/node/lib/circuit_value").FlexibleProvablePure<any>;
        tag: () => {
            name: string;
        };
        fromJSON: typeof Proof.fromJSON;
        dummy: typeof Proof.dummy;
    } & {
        prototype: Proof<unknown, unknown>;
    }>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js/dist/node/lib/proof_system").JsonProof): Proof<import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicInputType"], import("o1js/dist/node/lib/field").Field>, import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicOutputType"], import("o1js/dist/node/lib/field").Field>>;
    dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 2 | 1, domainLog2?: number | undefined): Promise<Proof<Input, OutPut>>;
};
export declare class OffChainStateProofs extends offChainStateProof {
}
export {};
