import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { Trip } from '../../services/api/trip';
import { GetTripRes } from '../../models/Get_Trip_Response';

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatSnackBarModule, MatCardModule,
  ],
  // ✅ ใช้ไฟล์เทมเพลตของหน้าแก้ไขเองให้ชัดเจน (แยกจากหน้า create)
  templateUrl: './trip-form.html',
  styleUrls: ['./trip-form.scss'],
})
export class TripEditComponent implements OnInit {
  private fb = inject(FormBuilder);

  loading = signal(false);
  idxToEdit: number | null = null;

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
  destination_zone: [null as number | null, Validators.required], // ← ใช้เก็บ “id ของโซน”
  coverimage: ['', Validators.required],
  detail: ['', [Validators.required, Validators.maxLength(5000)]],
  price: [null as number | null, [Validators.required, Validators.min(0)]],
  duration: [1, [Validators.required, Validators.min(1)]],
});


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Trip,
    private snack: MatSnackBar
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { 
      this.snack.open('ไม่พบรหัสรายการ', 'ปิด', { duration: 1500 });
      this.router.navigateByUrl('/'); 
      return; 
    }
    this.idxToEdit = Number(id);
    await this.loadForEdit(id);
  }

  private async loadForEdit(id: string) {
  this.loading.set(true);
  try {
    const data = await this.service.getTripById(id);
    if (!data) { /* แจ้งเตือนและ redirect */ return; }

    // รับได้ทั้งสองชื่อฟิลด์ แล้วบังคับเป็น number
    const zoneId =
      data.destinationid ??
      (data.destination_zone != null ? Number(data.destination_zone) : null);

    this.form.patchValue({
      name: data.name,
      country: data.country,
      destination_zone: zoneId, // ← ใส่ลง control
      coverimage: data.coverimage,
      detail: data.detail,
      price: data.price,
      duration: data.duration,
    });
  } finally {
    this.loading.set(false);
  }
}


  async onSubmit() {
  if (this.form.invalid) { this.form.markAllAsTouched(); this.snack.open('กรอกข้อมูลให้ครบ', 'ปิด', { duration: 1600 }); return; }
  if (this.idxToEdit == null) { this.snack.open('ไม่พบ ID', 'ปิด', { duration: 1600 }); return; }

  const raw = this.form.getRawValue();

  const payload = {
    name: (raw.name ?? '').toString().trim(),
    country: (raw.country ?? '').toString().trim(),
    destinationid: Number(raw.destination_zone), // ← สำคัญ: ส่งเป็น destinationid (number)
    coverimage: (raw.coverimage ?? '').toString().trim(),
    detail: (raw.detail ?? '').toString().trim(),
    price: raw.price != null ? Number(raw.price) : 0,
    duration: raw.duration != null ? Number(raw.duration) : 1,
  };

  console.log('PUT /trip/:id', this.idxToEdit, payload);

  try {
    this.loading.set(true);
    await this.service.EditTrip(this.idxToEdit, payload);
    this.snack.open('บันทึกการแก้ไขสำเร็จ', 'ปิด', { duration: 1500 });
    this.router.navigateByUrl('/');
  } catch (e: any) {
    console.error('EditTrip error:', e);
    this.snack.open(e?.error?.message || 'บันทึกไม่สำเร็จ', 'ปิด', { duration: 2200 });
  } finally {
    this.loading.set(false);
  }
}


  async onUpload(file?: File) {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res: any = await this.service.Uploadfromfile(fd);
      // สมมติ backend คืน { url: '...' }
      if (res?.url) this.form.patchValue({ coverimage: res.url });
      this.snack.open('อัปโหลดรูปสำเร็จ', 'ปิด', { duration: 1200 });
    } catch (e) {
      console.error('upload error:', e);
      this.snack.open('อัปโหลดไม่สำเร็จ', 'ปิด', { duration: 2000 });
    }
  }
}
