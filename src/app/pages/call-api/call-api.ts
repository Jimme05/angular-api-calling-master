import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { GetTripRes } from '../../models/Get_Trip_Response';
import { Trip } from '../../services/api/trip';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-call-api',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterLink,
    // Angular Material
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './call-api.html',
  styleUrl: './call-api.scss',
})
export class CallApi implements OnInit {
  constructor(
    private Service: Trip,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  // ข้อมูลทั้งหมด
  private allTrips = signal<GetTripRes[]>([]);

  // ตัวกรอง
  idKeyword = signal<string>('');
  nameKeyword = signal<string>('');
  countryKeyword = signal<string>('');

  // รายชื่อประเทศ (จากข้อมูลจริง)
  countries = signal<string[]>([]);

  // รายการที่จะแสดงหลังกรอง
  trips = computed(() => {
    const idKw = this.idKeyword().trim().toLowerCase();
    const nameKw = this.nameKeyword().trim().toLowerCase();
    const country = this.countryKeyword();

    return this.allTrips().filter(t => {
      const byId = idKw ? String(t.idx).toLowerCase() === idKw : true;
      const byName = nameKw ? (t.name ?? '').toLowerCase().includes(nameKw) : true;
      const byCountry = country ? (t.country ?? '') === country : true;
      return byId && byName && byCountry;
    });
  });

  async ngOnInit() {
    await this.loadAll();
  }

  async loadAll() {
    const data = await this.Service.getAllTrips();
    this.allTrips.set(data ?? []);

    // อัปเดตรายชื่อประเทศแบบ unique
    const set = new Set<string>();
    for (const t of this.allTrips()) if (t?.country) set.add(t.country);
    this.countries.set([...set].sort((a, b) => a.localeCompare(b)));
  }

  // ค้นหาแบบยิงไปหลังบ้านด้วย ID เดี่ยว
  async findOneById() {
    const id = this.idKeyword().trim();
    if (!id) return;
    try {
      const item = await this.Service.getTripById(id);
      this.allTrips.set(item ? [item] : []);
    } catch (e) {
      console.error(e);
      this.allTrips.set([]);
    }
  }

  // ล้างตัวกรองแล้วรีเฟรช
  async clearFilters() {
    this.idKeyword.set('');
    this.nameKeyword.set('');
    this.countryKeyword.set('');
    await this.loadAll();
  }

  // ลบ (ยืนยันก่อน)
  async confirmAndDelete(idx: number) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `ต้องการลบสถานที่ (ID: ${idx}) ใช่หรือไม่?` },
    });
    const yes = await ref.afterClosed().toPromise();
    if (!yes) return;

    try {
      await this.Service.DeleteTripByid(idx);
      this.snack.open('ลบสำเร็จ', 'ปิด', { duration: 1500 });
      this.allTrips.set(this.allTrips().filter(t => t.idx !== idx));
    } catch (e) {
      console.error(e);
      this.snack.open('ลบไม่สำเร็จ', 'ปิด', { duration: 2000 });
    }
  }

  trackById = (_: number, item: GetTripRes) => item.idx;
}
