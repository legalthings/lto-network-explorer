import { TransactionType } from './transaction-type';

export abstract class Transaction {
  abstract type: TransactionType;
  abstract signature: string;

  static fromJSON(apiData: LTO.API.Transaction[]): Transaction[];
  static fromJSON(apiData: LTO.API.Transaction): Transaction;
  static fromJSON(
    apiData: LTO.API.Transaction | LTO.API.Transaction[]
  ): Transaction | Transaction[] {
    if (Array.isArray(apiData)) {
      return apiData.map(transactionData => {
        const _ctor = getConstructor(transactionData.type);
        return new _ctor(transactionData);
      });
    }

    const ctor = getConstructor(apiData.type);
    return new ctor(apiData);
  }

  static group(transactions: Transaction[]): Map<TransactionType, Transaction[]> {
    return transactions.reduce((group, transaction) => {
      const transactionsOfType = group.get(transaction.type) || [];
      group.set(transaction.type, [...transactionsOfType, transaction]);

      return group;
    }, new Map());
  }

  get timestamp() {
    return this._apiData.timestamp;
  }

  get fee() {
    return this._apiData.fee;
  }

  get sender() {
    return this._apiData.sender;
  }

  get recipient() {
    return this._apiData.recipient || '';
  }

  get amount(): number {
    return this._apiData.amount || 0;
  }

  get id() {
    return this._apiData.id;
  }

  get block(): number {
    return this._apiData.height || 0;
  }

  get anchors(): string[] {
    return this._apiData.anchors || [];
  }

  get hash(): string {
    return this._apiData.hash || '';
  }

  get party(): string {
    return this._apiData.party || '';
  }

  get associationType(): number {
    return this._apiData.associationType || 0;
  }

  protected constructor(protected _apiData: LTO.API.Transaction) {}

  /**
   * Checks if provided address is recipient or in recipients list (MASS_TRANSFER)
   * @param address wallet address
   */
  isRecipient(address: string): boolean {
    return this.recipient === address;
  }
}

export class TransferTransaction extends Transaction {
  readonly type = TransactionType.TRANSFER;
  get signature(): string {
    return this._apiData.signature || this._apiData.proofs[0] || '';
  }
}

export class LeaseTransaction extends Transaction {
  readonly type = TransactionType.LEASE;
  get signature(): string {
    return this._apiData.signature || this._apiData.proofs[0] || '';
  }
}

export class CancelLeaseTransaction extends Transaction {
  readonly type = TransactionType.CANCEL_LEASE;

  get leaseId(): string {
    return this._apiData.lease ? this._apiData.lease.id : '';
  }

  get signature(): string {
    return this._apiData.signature || this._apiData.proofs[0] || '';
  }
}

export class MassTransferTransaction extends Transaction {
  readonly type = TransactionType.MASS_TRANSFER;
  get signature(): string {
    return this._apiData.proofs ? this._apiData.proofs[0] : '';
  }

  get amount(): number {
    if (!this._apiData.transfers) {
      return 0;
    }
    return this._apiData.transfers.reduce((total, transfer) => {
      return total + transfer.amount;
    }, 0);
  }

  get transfers() {
    return this._apiData.transfers || [];
  }

  isRecipient(address: string): boolean {
    return this.transfers.some(transfer => transfer.recipient === address);
  }
}

export class DataTransaction extends Transaction {
  readonly type = TransactionType.DATA;

  get anchors() {
    return [];
  }

  get signature(): string {
    return this._apiData.proofs ? this._apiData.proofs[0] : '';
  }
}

export class AnchorTransaction extends Transaction {
  readonly type = TransactionType.ANCHOR;

  get anchors(): string[] {
    return this._apiData.anchors;
  }

  get signature(): string {
    return this._apiData.proofs ? this._apiData.proofs[0] : '';
  }
}

export class InvokeAssociationTransaction extends Transaction {
  readonly type = TransactionType.INVOKE_ASSOCIATION;

  get hash(): string {
    return this._apiData.hash || '';
  }

  get party(): string {
    return this._apiData.party || '';
  }

  get associationType(): number {
    return this._apiData.associationType || 0;
  }

  get signature(): string {
    return this._apiData.proofs ? this._apiData.proofs[0] : '';
  }
}

export class RevokeAssociationTransaction extends Transaction {
  readonly type = TransactionType.REVOKE_ASSOCIATION;

  get hash(): string {
    return this._apiData.hash || '';
  }

  get party(): string {
    return this._apiData.party || '';
  }

  get associationType(): number {
    return this._apiData.associationType || 0;
  }

  get signature(): string {
    return this._apiData.proofs ? this._apiData.proofs[0] : '';
  }
}

export class SponsorTransaction extends Transaction {
  readonly type = TransactionType.SPONSOR;
  get signature(): string {
    return this._apiData.signature || this._apiData.proofs[0] || '';
  }
}

export class CancelSponsorTransaction extends Transaction {
  readonly type = TransactionType.CANCEL_SPONSOR;
  get signature(): string {
    return this._apiData.signature || this._apiData.proofs[0] || '';
  }
}

function getConstructor(type: TransactionType) {
  switch (type) {
    case TransactionType.TRANSFER:
      return TransferTransaction;
    case TransactionType.LEASE:
      return LeaseTransaction;
    case TransactionType.CANCEL_LEASE:
      return CancelLeaseTransaction;
    case TransactionType.MASS_TRANSFER:
      return MassTransferTransaction;
    case TransactionType.DATA:
      return DataTransaction;
    case TransactionType.ANCHOR:
      return AnchorTransaction;
    case TransactionType.INVOKE_ASSOCIATION:
      return InvokeAssociationTransaction;
    case TransactionType.REVOKE_ASSOCIATION:
      return RevokeAssociationTransaction;
    case TransactionType.SPONSOR:
      return SponsorTransaction;
    case TransactionType.CANCEL_SPONSOR:
      return CancelSponsorTransaction;
    default:
      throw new Error(`Uncnown transaction type ${type}`);
  }
}
