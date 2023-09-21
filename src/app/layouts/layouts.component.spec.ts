import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutsComponent } from './layouts.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('LayoutsComponent', () => {
  let component: LayoutsComponent;
  let fixture: ComponentFixture<LayoutsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutsComponent, RouterTestingModule]
    });
    fixture = TestBed.createComponent(LayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
