import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoDetailsComponent } from './servico-details.component';

describe('ServicoDetailsComponent', () => {
  let component: ServicoDetailsComponent;
  let fixture: ComponentFixture<ServicoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicoDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
