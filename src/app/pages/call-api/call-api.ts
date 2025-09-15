import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { lastValueFrom } from 'rxjs';
import { GetTripRes } from '../../models/Get_Trip_Response';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Trip } from '../../services/api/trip';

@Component({
  selector: 'app-call-api',
  imports: [
    CommonModule,
    MatButtonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './call-api.html',
  styleUrl: './call-api.scss',
})
export class CallApi {
  constructor(private http: HttpClient, private Service: Trip) {}
  trips: GetTripRes[] = [];

  async callApi() {
    this.trips = await this.Service.getAllTrips();
    console.log(this.trips);
    console.log(this.trips[0].name);
    console.log('Call Completed');
  }

  async findOne(input: HTMLInputElement) {
    try {
      const data = await this.Service.getTripById(input.value);
      this.trips = [];
      if (data) {
        this.trips.push(data);
      }
      console.log(this.trips);
      console.log('Call Completed');
    } catch (error) {
      console.error('Error fetching data for findOne:', error);
      this.trips = [];
    }
  }

  async findName(input: HTMLInputElement) {
    console.log(input.value);
    this.trips = await this.Service.getAllTrips();
    this.trips = this.trips.filter((x) =>
      x.name.toLowerCase().includes(input.value.toLowerCase())
    );
    console.log(this.trips);
    if (this.trips.length > 0) {
      console.log(this.trips[0].name);
    }
    console.log('Call Completed');
  }

  async deleteByid(id: any) {
    try {
      var data = await this.Service.DeleteTripByid(id);
      console.log(' Delete Sessceed', data);
    } catch (error) {
      console.error('Error fetching data for deleteByid:', error);
    }
  }
}
