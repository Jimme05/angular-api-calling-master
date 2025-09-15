import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Trip } from '../../services/api/trip';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, HttpClientModule],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class UploadComponent {

  file?: File;
  constructor(private http: HttpClient, private Service: Trip) {}

  onFileSelected(event: Event) {
    if ((event.target as HTMLInputElement).files){
      this.file = (event.target as HTMLInputElement).files![0];
      console.log(this.file);      
    }
      
  }
  async upload() {
    if (this.file) {
      console.log('Uploading');
      const formData = new FormData();
      formData.append('file', this.file);
      const response = await this.Service.Uploadfromfile(formData);
      console.log(response);
    }
  }
}