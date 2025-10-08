import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { UserRightsComponent } from './components/user-rights/user-rights.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MyCoursesComponent } from './components/my-courses/my-courses.component';
import { ProgressComponent } from './components/progress/progress.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    PrivacyPolicyComponent,
    TermsOfUseComponent,
    CookiePolicyComponent,
    UserRightsComponent,
    SidebarComponent,
    MyCoursesComponent,
    ProgressComponent,
    CertificatesComponent,
    SettingsComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }