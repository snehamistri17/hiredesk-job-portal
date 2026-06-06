import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringHistoryComponent } from './hiring-history.component';

describe('HiringHistoryComponent', () => {
  let component: HiringHistoryComponent;
  let fixture: ComponentFixture<HiringHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HiringHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
