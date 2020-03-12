import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { AbetComponent } from './abet/abet.component';
import { InstructorComponent } from './instructor/instructor.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
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
import { AddAssignmentComponent } from './document-management/add-assignment/add-assignment.component';
import { ViewAssignmentsComponent } from './document-management/view-assignments/view-assignments.component';
import { ViewRequirementsComponent } from './requirements-management/view-requirements/view-requirements.component';
import { AddRequirementComponent } from './requirements-management/add-requirement/add-requirement.component';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  { 
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'instructor',
    component: InstructorComponent
  },
  {
    path: 'abet',
    component: AbetComponent
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
  {
    path: 'requirements-management',
    component: RequirementsManagementComponent
  },
  {
    path: 'user-management',
    component: UserManagementComponent
  },
  {
    path: 'course-management',
    component: CourseManagementComponent
  },
  {
    path: 'document-management',
    component: DocumentManagementComponent
  }
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    AbetComponent,
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
  ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    // BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
