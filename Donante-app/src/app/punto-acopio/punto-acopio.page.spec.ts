import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PuntoAcopioPage } from './punto-acopio.page';

describe('PuntoAcopioPage', () => {
  let component: PuntoAcopioPage;
  let fixture: ComponentFixture<PuntoAcopioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoAcopioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
