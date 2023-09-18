import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecompencesComponent } from './recompences.component';

describe('RecompencesComponent', () => {
  let component: RecompencesComponent;
  let fixture: ComponentFixture<RecompencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecompencesComponent]
    });
    fixture = TestBed.createComponent(RecompencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
