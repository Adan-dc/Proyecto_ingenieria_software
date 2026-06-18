import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExitoPage } from './exito.page';

describe('ExitoPage', () => {
  let component: ExitoPage;
  let fixture: ComponentFixture<ExitoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
