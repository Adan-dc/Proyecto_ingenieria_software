import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscripcionExitosaPage } from './inscripcion-exitosa.page';

describe('InscripcionExitosaPage', () => {
  let component: InscripcionExitosaPage;
  let fixture: ComponentFixture<InscripcionExitosaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionExitosaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
