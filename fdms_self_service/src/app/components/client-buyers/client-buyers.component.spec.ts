import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBuyersComponent } from './client-buyers.component';

describe('ClientBuyersComponent', () => {
  let component: ClientBuyersComponent;
  let fixture: ComponentFixture<ClientBuyersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientBuyersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientBuyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
