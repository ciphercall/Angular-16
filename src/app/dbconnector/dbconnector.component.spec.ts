import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DBConnectorComponent } from './dbconnector.component';

describe('DBConnectorComponent', () => {
  let component: DBConnectorComponent;
  let fixture: ComponentFixture<DBConnectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DBConnectorComponent]
    });
    fixture = TestBed.createComponent(DBConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
