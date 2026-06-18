import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisTalleresPage } from './mis-talleres.page';

describe('MisTalleresPage', () => {
  let component: MisTalleresPage;
  let fixture: ComponentFixture<MisTalleresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisTalleresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
