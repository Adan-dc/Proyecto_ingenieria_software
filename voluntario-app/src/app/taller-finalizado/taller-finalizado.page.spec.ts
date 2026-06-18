import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TallerFinalizadoPage } from './taller-finalizado.page';

describe('TallerFinalizadoPage', () => {
  let component: TallerFinalizadoPage;
  let fixture: ComponentFixture<TallerFinalizadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TallerFinalizadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
