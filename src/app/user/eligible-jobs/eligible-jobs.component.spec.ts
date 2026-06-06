import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleJobsComponent } from './eligible-jobs.component';

describe('EligibleJobsComponent', () => {
  let component: EligibleJobsComponent;
  let fixture: ComponentFixture<EligibleJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EligibleJobsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EligibleJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
