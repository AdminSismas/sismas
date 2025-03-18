import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

// recursos de vex
import { VexPageLayoutComponent } from '../../../../../@vex/components/vex-page-layout/vex-page-layout.component';
import {
  VexPageLayoutContentDirective
} from '../../../../../@vex/components/vex-page-layout/vex-page-layout-content.directive';
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
import { CommentsService } from '../../../services/comments/comments.service';
import { PageCommentsData } from '../../../interfaces/general/page-comments-data.model';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { contentInfoComments } from '../../../interfaces/general/content-info-comments.model';
import { UserService } from 'src/app/pages/pages/auth/login/services/user.service';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { DecodeJwt } from '../../../interfaces/user-details/user.model';
import { CommentsCollection } from 'src/app/apps/interfaces/comments/comments.model';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'vex-comments',
    standalone: true,
    animations: [
        fadeInRight400ms,
        stagger80ms,
        scaleIn400ms,
        stagger40ms,
        fadeInUp400ms,
        scaleFadeIn400ms,
      ],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    MatDialogClose,
    MatIconModule,
    MatIconModule,
    MatDividerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgFor,
    NgIf
  ]
})
export class CommentsComponent implements OnInit {
  /* ============== ATRIBUTES ============== */
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  disablePaginator = true;
  NumPage = 0;
  NumSize = 5;
  totalElements = 0;
  pageSizeOptions: number[] = [5, 10, 20, 30];
  user: DecodeJwt | null = null;

  executionId!: string;
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
    private commentsService: CommentsService,
    private readonly layoutService: VexLayoutService,
    private alertSnakbar: MatSnackBar,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { value: { executionId: string } },
    private fb: FormBuilder ) {
      this.form = this.fb.group({
        newCommentText: [''],
      });
      if(this.data && this.data?.value && this.data?.value?.executionId){
        this.executionId = this.data.value.executionId;
      }
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
    this.commentsService.getDataPropertyByComments(this.executionId, pageData).subscribe({ //this.generateObjectPageCommentsData()
      next: (data) => {
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
    this.commentsData = (data.content || []).map((content: CommentsCollection) => new contentInfoComments(content));
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
      error: (err: HttpErrorResponse) => {
        console.error('Error al obtener los datos:', err.message);
      }
    });
  }


  deletedDataCommentService(commentId: number): void {
    this.commentsService.deleteDataPropertyByComments(this.executionId, commentId).subscribe({
      next: () => {
        this.alertSnakbar.open('Comentario Eliminado', 'Close', {
          duration: 10000,
          horizontalPosition: 'center'
        });
        this.getDataFromDocumentManagementService();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al obtener los datos:', err.message);
      }
    });
  }

}
