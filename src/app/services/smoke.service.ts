import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Map, Smoke } from '../models/smoke.model';
import {
  MIRAGE_SMOKES,
  INFERNO_SMOKES,
  DUST2_SMOKES,
  NUKE_SMOKES,
  OVERPASS_SMOKES,
  VERTIGO_SMOKES,
  ANCIENT_SMOKES,
  ANUBIS_SMOKES
} from '../data/smokes';

export type { Map, Smoke }; // Re-export for compatibility if needed, though components should update imports

@Injectable({
  providedIn: 'root'
})
export class SmokeService {

  private maps: Map[] = [
    { id: 'mirage', name: 'Mirage', image: 'assets/maps/mirage.jpg' },
    { id: 'inferno', name: 'Inferno', image: 'assets/maps/inferno.jpg' },
    { id: 'nuke', name: 'Nuke', image: 'assets/maps/nuke.jpg' },
    { id: 'overpass', name: 'Overpass', image: 'assets/maps/overpass.jpg' },
    { id: 'vertigo', name: 'Vertigo', image: 'assets/maps/vertigo.jpg' },
    { id: 'ancient', name: 'Ancient', image: 'assets/maps/ancient.jpg' },
    { id: 'anubis', name: 'Anubis', image: 'assets/maps/anubis.jpg' },
    { id: 'dust2', name: 'Dust II', image: 'assets/maps/dust2.jpg' }
  ];

  private smokes: Smoke[] = [
    ...MIRAGE_SMOKES,
    ...INFERNO_SMOKES,
    ...DUST2_SMOKES,
    ...NUKE_SMOKES,
    ...OVERPASS_SMOKES,
    ...VERTIGO_SMOKES,
    ...ANCIENT_SMOKES,
    ...ANUBIS_SMOKES
  ];

  constructor() { }

  getMaps(): Observable<Map[]> {
    return of(this.maps);
  }

  getSmokes(mapId: string): Observable<Smoke[]> {
    return of(this.smokes.filter(s => s.mapId === mapId));
  }

  getMap(id: string): Observable<Map | undefined> {
    return of(this.maps.find(m => m.id === id));
  }
}
