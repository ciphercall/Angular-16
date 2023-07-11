import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryResultsDialogComponent } from './query-results-dialog.component';

describe('QueryResultsDialogComponent', () => {
  let component: QueryResultsDialogComponent;
  let fixture: ComponentFixture<QueryResultsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueryResultsDialogComponent]
    });
    fixture = TestBed.createComponent(QueryResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
