import { TestBed } from '@angular/core/testing';

import { SongFactoryService } from './song-factory.service';

describe('SongFactoryService', () => {
  let service: SongFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
