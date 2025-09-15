import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { Trip } from '../../services/api/trip';
import { GetTripRes } from '../../models/Get_Trip_Response';

@Component({
  selector: 'app-trip-create',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatSnackBarModule, MatCardModule,
  ],
  templateUrl: './trip-create.html',
  styleUrl: './trip-create.scss',
})
export class TripCreateComponent {
  private fb = inject(FormBuilder);

  loading = signal(false);

  // TODO: เปลี่ยนเป็นรายการจริงจาก API ได้
  countries: string[] = ['Thailand', 'Japan', 'France', 'USA', 'Italy'];
  zones: { id: number; name: string }[] = [
    { id: 1, name: 'Asia' },
    { id: 2, name: 'Europe' },
    { id: 3, name: 'America' },
    { id: 4, name: 'Africa' },
    { id: 5, name: 'Oceania' },
  ];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    country: ['', Validators.required],
   destination_zone: [null as number | null, Validators.required], 
    coverimage: ['', Validators.required],
    detail: ['', [Validators.required, Validators.maxLength(5000)]],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    duration: [1, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private service: Trip,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  async onSubmit() {
  if (this.form.invalid) { this.form.markAllAsTouched(); return; }
  const raw = this.form.getRawValue();

  const body = {
    name: (raw.name ?? '').toString().trim(),
    country: (raw.country ?? '').toString().trim(),
    destinationid: Number(raw.destination_zone), // ← ส่งเป็น destinationid
    coverimage: (raw.coverimage ?? '').toString().trim(),
    detail: (raw.detail ?? '').toString().trim(),
    price: raw.price != null ? Number(raw.price) : 0,
    duration: raw.duration != null ? Number(raw.duration) : 1,
  };

  console.log('POST /trip', body);
  await this.service.InsetTrip(body as any);
  this.snack.open('เพิ่มสถานที่สำเร็จ', 'ปิด', { duration: 1500 });
  this.router.navigateByUrl('/');
}


  async onUpload(file?: File) {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res: any = await this.service.Uploadfromfile(fd);
      if (res?.url) this.form.patchValue({ coverimage: res.url });
      this.snack.open('อัปโหลดรูปสำเร็จ', 'ปิด', { duration: 1200 });
    } catch (e) {
      console.error(e);
      this.snack.open('อัปโหลดไม่สำเร็จ', 'ปิด', { duration: 2000 });
    }
  }
}
