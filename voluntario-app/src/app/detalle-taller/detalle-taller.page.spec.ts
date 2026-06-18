import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleTallerPage } from './detalle-taller.page';

describe('DetalleTallerPage', () => {
  let component: DetalleTallerPage;
  let fixture: ComponentFixture<DetalleTallerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTallerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
