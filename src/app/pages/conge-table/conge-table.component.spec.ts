import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongeTableComponent } from './conge-table.component';

describe('CongeTableComponent', () => {
  let component: CongeTableComponent;
  let fixture: ComponentFixture<CongeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
