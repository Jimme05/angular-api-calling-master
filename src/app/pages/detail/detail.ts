import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { GetTripRes } from '../../models/Get_Trip_Response';
import { Trip } from '../../services/api/trip';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class TripDetailsComponent implements OnInit {
  loading = signal<boolean>(true);
  trip = signal<GetTripRes | null>(null);

  constructor(private route: ActivatedRoute, private service: Trip) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }
    try {
      const data = await this.service.getTripById(id);
      this.trip.set(data ?? null);
    } catch (e) {
      console.error('getTripById error:', e);
      this.trip.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
