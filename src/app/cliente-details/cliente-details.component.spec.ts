import { ComponentFixture, TestBed } from '@angular/core/testing';

import { clienteDetailsComponent } from './cliente-details.component';

describe('clienteDetailsComponent', () => {
  let component: clienteDetailsComponent;
  let fixture: ComponentFixture<clienteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ clienteDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(clienteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
