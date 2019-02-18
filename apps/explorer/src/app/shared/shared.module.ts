import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { LtoCommonModule } from '@lto/common';
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatMenuModule
} from '@angular/material';
import { NgSuspenseModule } from 'ng-suspense';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import { BlocksTableComponent } from './components/blocks-table/blocks-table.component';
import { CardContentTableComponent } from './components/card-content-table/card-content-table.component';

@NgModule({
  imports: [
    MatTableModule,
    RouterModule.forChild([]),
    LtoCommonModule,
    CommonModule,
    FlexLayoutModule
  ],
  declarations: [TransactionsTableComponent, BlocksTableComponent, CardContentTableComponent],
  exports: [
    CommonModule,
    LtoCommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    FlexLayoutModule,
    NgSuspenseModule,
    TransactionsTableComponent,
    BlocksTableComponent,
    CardContentTableComponent
  ]
})
export class SharedModule {}