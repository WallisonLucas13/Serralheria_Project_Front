import { ComponentFixture, TestBed } from '@angular/core/testing';

import { clientesComponent } from './clientes.component';

describe('clientesComponent', () => {
  let component: clientesComponent;
  let fixture: ComponentFixture<clientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ clientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(clientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
