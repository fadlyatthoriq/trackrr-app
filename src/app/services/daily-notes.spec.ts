import { TestBed } from '@angular/core/testing';

import { DailyNotes } from './daily-notes';

describe('DailyNotes', () => {
  let service: DailyNotes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyNotes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
