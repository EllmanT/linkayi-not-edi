import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyValuePairsComponent } from './key-value-pairs.component';

describe('KeyValuePairsComponent', () => {
  let component: KeyValuePairsComponent;
  let fixture: ComponentFixture<KeyValuePairsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValuePairsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KeyValuePairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
