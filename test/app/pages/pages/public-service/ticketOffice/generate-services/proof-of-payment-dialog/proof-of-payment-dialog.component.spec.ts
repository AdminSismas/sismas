import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofOfPaymentDialogComponent } from './proof-of-payment-dialog.component';

describe('ProofOfPaymentDialogComponent', () => {
  let component: ProofOfPaymentDialogComponent;
  let fixture: ComponentFixture<ProofOfPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProofOfPaymentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProofOfPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
