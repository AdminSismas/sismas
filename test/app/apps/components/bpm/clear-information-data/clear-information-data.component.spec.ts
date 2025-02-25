import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule, provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  ClearInformationDataComponent
} from '../../../../../../src/app/apps/components/bpm/clear-information-data/clear-information-data.component';
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
import { HttpClientModule } from '@angular/common/http';


describe(ClearInformationDataComponent.name, () => {
  let component: ClearInformationDataComponent;
  let fixture: ComponentFixture<ClearInformationDataComponent>;

  const dialogMock = {
    close: () => { }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClearInformationDataComponent,
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
        MatIconModule
      ],
      providers: [
        provideIcons(),
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClearInformationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
