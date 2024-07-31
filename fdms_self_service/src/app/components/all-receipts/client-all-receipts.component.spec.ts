import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAllReceiptsComponent } from './client-all-receipts.component';

describe('ClientAllReceiptsComponent', () => {
  let component: ClientAllReceiptsComponent;
  let fixture: ComponentFixture<ClientAllReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAllReceiptsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientAllReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
