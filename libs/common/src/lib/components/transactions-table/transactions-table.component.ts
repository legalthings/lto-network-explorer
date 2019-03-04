import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Transaction, TransactionType } from '@lto/core';
import { ScreenService, ScreenSize } from '../../services';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'lto-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {
  @Input()
  set transactionsType(type: TransactionType | null) {
    this._type$.next(type);
  }

  @Input()
  transactions!: Transaction[];

  @Input() addressLinkTemplate: TemplateRef<any> | null = null;
  @Input() transactionLinkTemplate: TemplateRef<any> | null = null;

  @Input() directionColumn = false;
  @Input() walletAddress = '';

  columns$: Observable<string[]>;
  private _type$ = new BehaviorSubject<TransactionType | null>(null);

  constructor(private _screen: ScreenService) {
    this.columns$ = combineLatest(_screen.size$, this._type$).pipe(
      map(([screenSize, transactionType]) => {
        let columns: string[];
        if (screenSize === ScreenSize.XS) {
          return ['id'];
        }

        switch (transactionType) {
          case TransactionType.TRANSFER:
          case TransactionType.LEASE:
            columns = ['id', 'fee', 'timestamp', 'sender', 'recipient', 'amount'];
            if (this.directionColumn) {
              columns = ['direction', ...columns];
            }
            break;
          case TransactionType.MASS_TRANSFER:
            columns = ['id', 'fee', 'timestamp', 'sender', 'amount'];
            if (this.directionColumn) {
              columns = ['direction', ...columns];
            }
            break;
          case TransactionType.CANCEL_LEASE:
            columns = ['id', 'fee', 'timestamp', 'sender', 'leasing'];
            break;
          case TransactionType.DATA:
          case TransactionType.ANCHOR:
            columns = ['id', 'fee', 'timestamp', 'sender'];
            break;
          default:
            columns = ['id', 'sender', 'amount'];
            break;
        }

        return columns;
      })
    );
  }

  ngOnInit() {}

  isOutgoing(transaction: Transaction) {
    return transaction.isRecipient(this.walletAddress) !== true;
  }
}