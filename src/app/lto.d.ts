declare namespace LTO.API {
  export interface Version {
    version: string;
  }

  export interface BlockHeight {
    height: number;
  }

  export interface Balance {
    address: string;
    regular: number;
    generating: number;
    available: number;
    effective: number;
  }

  export interface BlockHeader {
    version: number;
    timestamp: number;
    reference: string;
    features: string[];
    generator: string;
    signature: string;
    blocksize: number;
    transactionCount: number;
    height: number;
    'nxt-consensus'?: {
      'base-target': number;
      'generation-signature': string;
    };
  }

  export interface Block extends BlockHeader {
    fee: number;
    transactions: Transaction[];
  }

  export type TransactionType = 4 | 15;

  export interface Transaction {
    type: TransactionType;
    id: string;
    sender: string;
    recipient?: string;
    senderPublicKey: string;
    fee: number;
    timestamp: number;
    proofs: string[];
    version: number;
    amount?: number;
    anchors: string[];
  }
}
