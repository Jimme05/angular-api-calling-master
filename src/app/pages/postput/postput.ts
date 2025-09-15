import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Trip } from '../../services/api/trip';


@Component({
  selector: 'app-postput',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: './postput.html',
  styleUrl: './postput.scss',
})
export class PostputComponent {
  name: string = '';
  destination: number = 0;
  country: string = '';
  cover: string = '';
  detail: string = '';
  price: number = 0;
  duration: number = 0;

  distinations: Destination[] = [
    { value: 1, name: 'เอเชีย' },
    { value: 2, name: 'ยุโรป' },
    { value: 3, name: 'เอเชียตะวันออกเฉียงใต้' },
    { value: 9, name: 'ประเทศไทย' },
  ];

  constructor(private http: HttpClient, private Service: Trip) {}

  async addNew() {
    const body = {
      name: this.name,
      country: this.country,
      destinationid: Number(this.destination),
      coverimage: this.cover,
      detail: this.detail,
      price: this.price,
      duration: this.duration,
    };

   
    try {
      const response = await this.Service.InsetTrip(body);  
      console.log(response);
    } catch (error) {
      console.error("POST failed:", error);
    }
  }
}

interface Destination {
  value: number;
  name: string;
}