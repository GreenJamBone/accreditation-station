import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterOutlet, CanActivate } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { AuditComponent } from './audit/audit.component';
import { InstructorComponent } from './instructor/instructor.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from "@angular/cdk/overlay";
import { DocumentManagementComponent } from './document-management/document-management.component';
import { RequirementsManagementComponent } from './requirements-management/requirements-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CourseManagementComponent } from './course-management/course-management.component';
import { AddCourseComponent } from './course-management/add-course/add-course.component';
import { ViewCoursesComponent } from './course-management/view-courses/view-courses.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { ViewUsersComponent } from './user-management/view-users/view-users.component';
import { AddDocumentComponent } from './document-management/add-document/add-document.component';
import { ViewDocumentsComponent } from './document-management/view-documents/view-documents.component';
import { AddAssignmentComponent } from './assignment-management/add-assignment/add-assignment.component';
import { ViewAssignmentsComponent } from './assignment-management/view-assignments/view-assignments.component';
import { ViewRequirementsComponent } from './requirements-management/view-requirements/view-requirements.component';
import { AddRequirementComponent } from './requirements-management/add-requirement/add-requirement.component';
import { EditAssignmentComponent } from './assignment-management/edit-assignment/edit-assignment.component';
import { UserService } from './services/user.service';
import { CourseService } from './services/course.service';
import { RequirementsService } from './services/requirements.service';
import { DocumentService } from './services/document.service';
import { EditUserComponent } from './user-management/edit-user/edit-user.component';
import { EditCourseComponent } from './course-management/edit-course/edit-course.component';
import { AreYouSureModalComponent } from './are-you-sure-modal/are-you-sure-modal.component';
import { AssignmentManagementComponent } from './assignment-management/assignment-management.component';
import { AssignmentService } from './services/assignment.service';
import { EditDocumentComponent } from './document-management/edit-document/edit-document.component';
import { CommonPdfGeneratorComponent } from './common-pdf-generator/common-pdf-generator.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { InstructorCoursesComponent } from './instructor/instructor-courses/instructor-courses.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginService } from './services/login.service';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuardService } from './guards/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  { 
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password/:theCode',
    component: ForgotPasswordComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'instructor',
    component: InstructorComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: InstructorCoursesComponent
      },
      {
        path: 'add-assignment/:course',
        component: AddAssignmentComponent
      },
      {
        path: 'manage-assignments/:courseId',
        component: ViewAssignmentsComponent
      }
    ]
  },
  {
    path: 'audit',
    component: AuditComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'documents',
        component: ViewDocumentsComponent
      },
      {
        path: 'courses',
        component: ViewCoursesComponent
      }
    ]
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
  {
    path: 'requirements-management',
    component: RequirementsManagementComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'course-management',
    component: CourseManagementComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'document-management',
    component: DocumentManagementComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'assignment-management',
    component: AssignmentManagementComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit-assignment/:theAssignment',
    component: EditAssignmentComponent,
    canActivate: [AuthGuardService]
  }, 
  {
    path: 'view-assignments/:courseId',
    component: ViewAssignmentsComponent,
    canActivate: [AuthGuardService]
  }
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    AuditComponent,
    InstructorComponent,
    PageNotFoundComponent,
    RequirementsManagementComponent,
    UserManagementComponent,
    CourseManagementComponent,
    DocumentManagementComponent,
    AddCourseComponent,
    ViewCoursesComponent,
    AddUserComponent,
    ViewUsersComponent,
    AddDocumentComponent,
    ViewDocumentsComponent,
    AddAssignmentComponent,
    ViewAssignmentsComponent,
    ViewRequirementsComponent,
    AddRequirementComponent,
    EditAssignmentComponent,
    EditUserComponent,
    EditCourseComponent,
    AreYouSureModalComponent,
    AssignmentManagementComponent,
    EditDocumentComponent,
    CommonPdfGeneratorComponent,
    InstructorCoursesComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    OverlayModule,
    MatDialogModule,
    NgxExtendedPdfViewerModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash: true } // <-- debugging purposes only
    ),
    // BrowserAnimationsModule
  ],
  providers: [
    UserService, 
    MatDialog, 
    CourseService, 
    RequirementsService, 
    DocumentService, 
    AssignmentService, 
    LoginService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
