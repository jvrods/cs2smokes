import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SmokeService } from '../../services/smoke.service';
import { Smoke, Map } from '../../models/smoke.model';
import { Observable, switchMap, map } from 'rxjs';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { YoutubeEmbedPipe } from '../../pipes/youtube-embed.pipe';

@Component({
  selector: 'app-map-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeUrlPipe, YoutubeEmbedPipe],
  templateUrl: './map-detail.component.html',
  styleUrl: './map-detail.component.css'
})
export class MapDetailComponent implements OnInit {
  smokes$: Observable<Smoke[]>;
  map$: Observable<Map | undefined>;
  mapId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private smokeService: SmokeService
  ) {
    this.smokes$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.mapId = params.get('id');
        return this.smokeService.getSmokes(this.mapId!);
      })
    );

    this.map$ = this.route.paramMap.pipe(
      switchMap(params => this.smokeService.getMap(params.get('id')!))
    );
  }

  ngOnInit(): void {
  }
}
