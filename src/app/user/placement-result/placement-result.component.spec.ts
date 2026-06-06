import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementResultComponent } from './placement-result.component';

describe('PlacementResultComponent', () => {
  let component: PlacementResultComponent;
  let fixture: ComponentFixture<PlacementResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlacementResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
