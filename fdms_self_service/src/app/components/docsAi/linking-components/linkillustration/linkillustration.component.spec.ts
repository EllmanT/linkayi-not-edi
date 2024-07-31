import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkillustrationComponent } from './linkillustration.component';

describe('LinkillustrationComponent', () => {
  let component: LinkillustrationComponent;
  let fixture: ComponentFixture<LinkillustrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkillustrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkillustrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
