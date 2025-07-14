import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongeFormComponent } from './conge-form.component';

describe('CongeFormComponent', () => {
  let component: CongeFormComponent;
  let fixture: ComponentFixture<CongeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
