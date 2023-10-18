import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictedSpaceComponent } from './restricted-space.component';

describe('RestrictedSpaceComponent', () => {
  let component: RestrictedSpaceComponent;
  let fixture: ComponentFixture<RestrictedSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestrictedSpaceComponent]
    });
    fixture = TestBed.createComponent(RestrictedSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
