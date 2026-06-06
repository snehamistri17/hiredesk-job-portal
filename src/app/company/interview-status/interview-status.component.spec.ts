import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewStatusComponent } from './interview-status.component';

describe('InterviewStatusComponent', () => {
  let component: InterviewStatusComponent;
  let fixture: ComponentFixture<InterviewStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterviewStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
