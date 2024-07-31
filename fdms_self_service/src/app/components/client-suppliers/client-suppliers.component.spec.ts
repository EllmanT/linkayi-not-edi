import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSuppliersComponent } from './client-suppliers.component';

describe('ClientSuppliersComponent', () => {
  let component: ClientSuppliersComponent;
  let fixture: ComponentFixture<ClientSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSuppliersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
