import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalEventComponent } from './add-medical-event.component';

describe('AddMedicalEventComponent', () => {
  let component: AddMedicalEventComponent;
  let fixture: ComponentFixture<AddMedicalEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicalEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicalEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
