import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebasCessComponent } from './pruebas-cess.component';

describe('PruebasCessComponent', () => {
  let component: PruebasCessComponent;
  let fixture: ComponentFixture<PruebasCessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebasCessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebasCessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
