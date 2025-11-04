import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

// recursos de vex
import { VexLayoutService } from '@vex/services/vex-layout.service';

// recursos de angular material
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// recursos de archivos locales
import { CommentsService } from '@features/bpm-workflows/services';
import { PageCommentsData } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';
import { contentInfoComments } from '@shared/interfaces';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';
import { UserService } from '@shared/services';
import { PAGE_SIZE_OPTION } from '@shared/constants';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'vex-comments',
  standalone: true,
  templateUrl: './comments.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    NgFor,
    NgIf,
    ReactiveFormsModule,
  ]
})

export class CommentsComponent implements OnInit {
  /* ============== ATRIBUTES ============== */
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  disablePaginator = true;
  NumPage = 0;
  NumSize = 5;
  totalElements = 0;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  executionId = '';
  user: DecodeJwt | null = null;

  body: contentInfoComments = {
    commentText: ''
  };
  commentsData: contentInfoComments[] = [];
  paginatedComments: contentInfoComments[] = [];
  contentInformations!: InformationPegeable;


  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  form: FormGroup;


  /* ============== CONSTRUCTOR ============== */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { executionId: string },
    private dialog: MatDialog,
    private commentsService: CommentsService,
    private readonly layoutService: VexLayoutService,
    private alertSnakbar: MatSnackBar,
    private userService: UserService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      newCommentText: [''],
    });
  }
  /* ============== METHODS ============== */
  /* ------- Meth. Lifecycle Hooks ------- */
  ngOnInit(): void {
    this.getDataFromDocumentManagementService();
    this.user = this.userService.getUser();
  }


  /* ------- Meth. HTML ------- */


  /* ------- Meth. Common ------- */
  viewPaginator(numRegister: number): void {
    this.disablePaginator = numRegister < 4;
  }

  refreshPaginator(event: PageEvent) {
    if (!event) {
      return;
    }
    this.NumPage = event.pageIndex;
    this.NumSize = event.pageSize;
    this.getDataFromDocumentManagementService();
  }

  generateObjectPageCommentsData(): PageCommentsData {
    return new PageCommentsData(this.NumPage, this.NumSize);
  }



  /* ------- Meth. Services ------- */
  getDataFromDocumentManagementService(): void {
    const pageData = this.generateObjectPageCommentsData();
    this.executionId = this.data.executionId;
    this.commentsService.getDataPropertyByComments(this.executionId, pageData).subscribe({ //this.generateObjectPageCommentsData()
      next: (data: InformationPegeable) => {
        this.captureInformationSubscribe(data);
        this.viewPaginator(data.totalElements ?? 0);
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    });
  }

  captureInformationSubscribe(data: InformationPegeable) {
    this.contentInformations = data;
    this.totalElements = data.totalElements ?? 0;
    this.commentsData = (data.content || []).map(content => new contentInfoComments(content));
    this.viewPaginator(this.totalElements);
  }



  postDataCommentService(): void {
    if (!this.form.get('newCommentText')?.value.trim()) {
      this.alertSnakbar.open('El comentario está vacío', 'Close', {
        duration: 10000,
        horizontalPosition: 'center'
      });
      return;
    } else {
      this.body.commentText = this.form.get('newCommentText')?.value.trim();
    }

    this.commentsService.postDataPropertyByComments(this.executionId, this.body).subscribe({
      next: () => {
        this.alertSnakbar.open('Comentario Enviado', 'Close', {
          duration: 10000,
          horizontalPosition: 'center'
        });
        this.getDataFromDocumentManagementService();
        this.form.reset();
      },
      error: (err) => {
        console.error('Error al obtener los datos:', err);
      }
    });
  }


  delelteDataCommentService(commentId: number): void {
    this.commentsService.deleteDataPropertyByComments(this.executionId, commentId).subscribe({
      next: () => {
        this.alertSnakbar.open('Comentario Eliminado', 'Close', {
          duration: 10000,
          horizontalPosition: 'center'
        });
        this.getDataFromDocumentManagementService();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al obtener los datos:', err);
      }
    });
  }

}
