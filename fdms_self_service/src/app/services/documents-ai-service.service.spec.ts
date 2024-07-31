import { TestBed } from '@angular/core/testing';

import { DocumentsAiServiceService } from './documents-ai-service.service';

describe('DocumentsAiServiceService', () => {
  let service: DocumentsAiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentsAiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
