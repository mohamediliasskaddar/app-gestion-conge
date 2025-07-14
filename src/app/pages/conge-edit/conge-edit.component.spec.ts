import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongeEditComponent } from './conge-edit.component';

describe('CongeEditComponent', () => {
  let component: CongeEditComponent;
  let fixture: ComponentFixture<CongeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongeEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
