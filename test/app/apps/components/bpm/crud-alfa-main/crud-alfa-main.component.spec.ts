import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { provideIcons } from '../../../../../../src/app/core/icons/icons.provider';
import {
  CrudAlfaMainComponent
} from '../../../../../../src/app/apps/components/bpm/alfa-main/crud-alfa-main/crud-alfa-main.component';
import { AlfaMainService } from '../../../../../../src/app/apps/services/bpm/core/alfa-main.service';
import { NoopAnimationsModule, provideNoopAnimations } from '@angular/platform-browser/animations';
import { CurrencyLandsPipe } from '../../../../../../src/app/apps/pipes/currency-lands.pipe';

describe(CrudAlfaMainComponent.name, () => {
  let component: CrudAlfaMainComponent;
  let fixture: ComponentFixture<CrudAlfaMainComponent>;

  const dialogMock = {
    close: () => {
    }
  };

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        imports: [
          CrudAlfaMainComponent,
          NoopAnimationsModule,
          HttpClientModule,
          MatDialogContent,
          MatDialogTitle,
          MatDialogActions,
          MatButtonModule,
          FormsModule,
          MatFormFieldModule,
          MatInputModule,
          ReactiveFormsModule,
          MatDialogClose,
          MatIconModule,
          CurrencyLandsPipe,
        ],
        providers: [
          provideIcons(),
          provideNoopAnimations(),
          { provide: MAT_DIALOG_DATA, useValue: {} },
          { provide: MatDialogRef, useValue: dialogMock },
          AlfaMainService
        ],
      })
      .compileComponents();

    fixture = TestBed.createComponent(CrudAlfaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});

