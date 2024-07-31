import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseDayComponent } from './close-day.component';

describe('CloseDayComponent', () => {
  let component: CloseDayComponent;
  let fixture: ComponentFixture<CloseDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CloseDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
