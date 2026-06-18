import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComentarioTallerPage } from './comentario-taller.page';

describe('ComentarioTallerPage', () => {
  let component: ComentarioTallerPage;
  let fixture: ComponentFixture<ComentarioTallerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComentarioTallerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
