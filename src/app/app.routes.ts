import { Routes } from '@angular/router';
import { CallApi } from './pages/call-api/call-api';
import { PostputComponent } from './pages/postput/postput';
import { UploadComponent } from './pages/upload/upload';
import { TripDetailsComponent } from './pages/detail/detail';
import { TripEditComponent } from './pages/trip-form/trip-form';
import { TripCreateComponent } from './pages/trip-create/trip-create';
export const routes: Routes = [
  { path: '', component: CallApi },
  { path: 'posput', component: PostputComponent },
  { path: 'trips/new', component: TripCreateComponent },    // เพิ่ม
  { path: 'trips/:id/edit', component: TripEditComponent }, // แก้ไข
   { path: 'trips/:id', component: TripDetailsComponent }, // แก้ไข
  { path: 'upload', component: UploadComponent },
];
