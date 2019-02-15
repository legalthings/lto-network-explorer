import { Component, OnInit, Input } from '@angular/core';
import { Transaction, TransactionType, ScreenService, ScreenSize } from '@app/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {
  @Input()
  transactionsType: TransactionType | null = null;

  @Input()
  transactions!: Transaction[];

  columns$: Observable<string[]>;
  private _type$ = new BehaviorSubject<TransactionType | null>(null);

  constructor(_screen: ScreenService) {
    this.columns$ = combineLatest(_screen.size$, this._type$).pipe(
      map(([screenSize, transactionType]) => {
        if (screenSize === ScreenSize.XS) {
          return ['id'];
        }

        switch (transactionType) {
          case TransactionType.TRANSFER:
          case TransactionType.LEASING:
            return ['id', 'fee', 'timestamp', 'sender', 'recipient', 'amount'];
          case TransactionType.MASS_TRANSFER:
            return ['id', 'fee', 'timestamp', 'sender', 'total_amount'];
          case TransactionType.CANCEL_LEASING:
            return ['id', 'fee', 'timestamp', 'sender', 'leasing'];
          case TransactionType.ANCHOR:
          case TransactionType.ANCHOR_NEW:
            return ['id', 'fee', 'timestamp', 'sender'];
          default:
            return ['id', 'sender', 'amount'];
        }
      })
    );
  }

  ngOnInit() {}
}
