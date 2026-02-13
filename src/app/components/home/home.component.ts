import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SmokeService, Map } from '../../services/smoke.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  maps$: Observable<Map[]>;

  constructor(private smokeService: SmokeService) {
    this.maps$ = this.smokeService.getMaps();
  }

  ngOnInit(): void {
  }
}
