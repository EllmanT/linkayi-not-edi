import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentNavComponent } from './document-nav.component';

describe('DocumentNavComponent', () => {
  let component: DocumentNavComponent;
  let fixture: ComponentFixture<DocumentNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
