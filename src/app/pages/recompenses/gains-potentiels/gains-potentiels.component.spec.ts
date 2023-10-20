import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GainsPotentielsComponent } from './gains-potentiels.component';

describe('GainsPotentielsComponent', () => {
  let component: GainsPotentielsComponent;
  let fixture: ComponentFixture<GainsPotentielsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GainsPotentielsComponent]
    });
    fixture = TestBed.createComponent(GainsPotentielsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
