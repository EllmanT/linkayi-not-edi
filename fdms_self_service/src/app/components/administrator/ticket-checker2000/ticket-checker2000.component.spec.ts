import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketChecker2000Component } from './ticket-checker2000.component';

describe('TicketChecker2000Component', () => {
  let component: TicketChecker2000Component;
  let fixture: ComponentFixture<TicketChecker2000Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicketChecker2000Component]
    });
    fixture = TestBed.createComponent(TicketChecker2000Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
