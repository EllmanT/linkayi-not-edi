import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmComponentComponent } from './confirm-component.component';

describe('ConfirmComponentComponent', () => {
  let component: ConfirmComponentComponent;
  let fixture: ComponentFixture<ConfirmComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmComponentComponent]
    });
    fixture = TestBed.createComponent(ConfirmComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
