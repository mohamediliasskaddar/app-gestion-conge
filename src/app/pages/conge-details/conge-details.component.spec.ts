import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongeDetailsComponent } from './conge-details.component';

describe('CongeDetailsComponent', () => {
  let component: CongeDetailsComponent;
  let fixture: ComponentFixture<CongeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
