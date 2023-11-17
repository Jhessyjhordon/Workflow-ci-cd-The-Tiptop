import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GainsDetailleComponent } from './gains-detaille.component';

describe('GainsDetailleComponent', () => {
  let component: GainsDetailleComponent;
  let fixture: ComponentFixture<GainsDetailleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GainsDetailleComponent]
    });
    fixture = TestBed.createComponent(GainsDetailleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
