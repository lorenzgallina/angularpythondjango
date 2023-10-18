import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSpaceComponent } from './public-space.component';

describe('PublicSpaceComponent', () => {
  let component: PublicSpaceComponent;
  let fixture: ComponentFixture<PublicSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicSpaceComponent]
    });
    fixture = TestBed.createComponent(PublicSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
