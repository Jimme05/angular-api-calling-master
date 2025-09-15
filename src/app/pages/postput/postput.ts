import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-postput',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, MatButtonModule, FormsModule],
  templateUrl: './postput.html',
  styleUrl: './postput.scss',
})
export class PostputComponent {
  name: string = '';
  destination: string = '';
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
  addNew() {
    console.log(this.destination);
    
  }
}

interface Destination {
  value: number;
  name: string;
}