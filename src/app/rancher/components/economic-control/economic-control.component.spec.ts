import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicControlComponent } from './economic-control.component';

describe('EconomicControlComponent', () => {
  let component: EconomicControlComponent;
  let fixture: ComponentFixture<EconomicControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomicControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
