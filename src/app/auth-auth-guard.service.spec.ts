import { TestBed } from '@angular/core/testing';

import { AuthAuthGuardService } from './auth-auth-guard.service';

describe('AuthAuthGuardService', () => {
  let service: AuthAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
