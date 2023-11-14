import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesGainsComponent } from './mes-gains.component';

describe('MesGainsComponent', () => {
  let component: MesGainsComponent;
  let fixture: ComponentFixture<MesGainsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MesGainsComponent]
    });
    fixture = TestBed.createComponent(MesGainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
