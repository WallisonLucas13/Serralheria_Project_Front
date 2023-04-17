import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAccessComponent } from './confirm-access.component';

describe('ConfirmAccessComponent', () => {
  let component: ConfirmAccessComponent;
  let fixture: ComponentFixture<ConfirmAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
