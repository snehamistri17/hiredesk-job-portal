import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementRulesComponent } from './placement-rules.component';

describe('PlacementRulesComponent', () => {
  let component: PlacementRulesComponent;
  let fixture: ComponentFixture<PlacementRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementRulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlacementRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
