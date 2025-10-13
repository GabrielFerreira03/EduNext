import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { UserRightsComponent } from './components/user-rights/user-rights.component';
import { MyCoursesComponent } from './components/my-courses/my-courses.component';
import { ProgressComponent } from './components/progress/progress.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HomeGuard } from './guards/home.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [HomeGuard] },
  { path: 'home', component: HomeComponent, canActivate: [HomeGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'my-courses', component: MyCoursesComponent },
  { path: 'progress', component: ProgressComponent },
  { path: 'certificates', component: CertificatesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-use', component: TermsOfUseComponent },
  { path: 'cookie-policy', component: CookiePolicyComponent },
  { path: 'user-rights', component: UserRightsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }