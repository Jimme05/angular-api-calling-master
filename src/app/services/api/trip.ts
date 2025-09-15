import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';
import { lastValueFrom } from 'rxjs';
import { GetTripRes } from '../../models/Get_Trip_Response';
@Injectable({
  providedIn: 'root',
})
export class Trip {
  constructor(private http: HttpClient, private constants: Constants) {}

  async getAllTrips() {
    const url = this.constants.API_ENDPOINT + 'trip';
    var data = await lastValueFrom(this.http.get<GetTripRes[]>(url));
    return data;
  }

  async getTripById(id: any) {
    const url = this.constants.API_ENDPOINT + 'trip/' + id;
    var data = await lastValueFrom(this.http.get<GetTripRes>(url));
    return data;
  }

  async DeleteTripByid(id: any) {
    const url = this.constants.API_ENDPOINT + 'trip/' + id;
    var data = await lastValueFrom(this.http.delete(url));
    return data;
  }

  async InsetTrip(body: any) {
    const url = this.constants.API_ENDPOINT + 'trip';
    var data = await lastValueFrom(this.http.post(url, body));
    return data;
  }

  async Uploadfromfile(formData: any) {
    const url = this.constants.API_ENDPOINT + 'upload';
    var data = await lastValueFrom(this.http.post(url, formData));
    return data;
  }
}
