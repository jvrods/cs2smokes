import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SmokeService } from '../../services/smoke.service';
import { Map as GameMap } from '../../models/smoke.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  maps$: Observable<GameMap[]>;

  constructor(private smokeService: SmokeService) {
    this.maps$ = this.smokeService.getMaps();
  }

  ngOnInit(): void {
  }
}

