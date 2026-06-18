import { TestBed } from '@angular/core/testing';

import { ComentarioTaller } from './comentario-taller';

describe('ComentarioTaller', () => {
  let service: ComentarioTaller;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComentarioTaller);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
