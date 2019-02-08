import { Component, OnInit } from '@angular/core';
import { LtoPublicNodeService, Transaction } from '@app/core';
import { Observable, timer, of } from 'rxjs';
import { switchMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-unconfirmed-transactions',
  templateUrl: './unconfirmed-transactions.component.html',
  styleUrls: ['./unconfirmed-transactions.component.scss']
})
export class UnconfirmedTransactionsComponent implements OnInit {
  transactions$: Observable<Transaction[]>;
  visibleColumns$: Observable<string[]> = of(['id', 'fee', 'amount']);

  constructor(private _publicNode: LtoPublicNodeService) {
    this.transactions$ = timer(0, 3000).pipe(switchMapTo(_publicNode.unconfirmed()));
  }

  ngOnInit() {}
}
