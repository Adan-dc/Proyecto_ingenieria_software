import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonarPage } from './donar.page';

describe('DonarPage', () => {
  let component: DonarPage;
  let fixture: ComponentFixture<DonarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
