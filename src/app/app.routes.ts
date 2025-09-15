import { Routes } from '@angular/router';
import { AsyncDemo } from './pages/async-demo/async-demo';
import { CallApi } from './pages/call-api/call-api';
import { PostputComponent } from './pages/postput/postput';
import { UploadComponent } from './pages/upload/upload';

export const routes: Routes = [
  { path: '', component: AsyncDemo },
  { path: 'callapi', component: CallApi },
  { path: 'posput', component: PostputComponent },
  { path: 'upload', component: UploadComponent },
];
