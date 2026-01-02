import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AboutComponent } from './pages/about.component';
import { SettingsComponent } from './pages/settings.component';
import { UserDetailComponent } from './pages/user-detail.component';
import { PostDetailComponent } from './pages/post-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'settings', component: SettingsComponent, title: 'Settings' },
  // Routes with parameters to test the arg filling
  { path: 'users/:id', component: UserDetailComponent, title: 'User Details' },
  { path: 'posts/:id/comments/:commentId', component: PostDetailComponent, title: 'Post Comment' },
];
