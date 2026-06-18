import { TestBed } from '@angular/core/testing';

import { GestionDonacion } from './gestion-donacion';

describe('GestionDonacion', () => {
  let service: GestionDonacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionDonacion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
