import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevmaxFormComponent } from './revmax-form.component';

describe('RevmaxFormComponent', () => {
  let component: RevmaxFormComponent;
  let fixture: ComponentFixture<RevmaxFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevmaxFormComponent]
    });
    fixture = TestBed.createComponent(RevmaxFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
