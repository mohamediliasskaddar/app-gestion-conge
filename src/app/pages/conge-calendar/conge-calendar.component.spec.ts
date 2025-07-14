import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongeCalendarComponent } from './conge-calendar.component';

describe('CongeCalendarComponent', () => {
  let component: CongeCalendarComponent;
  let fixture: ComponentFixture<CongeCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongeCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
