import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where, doc, setDoc, getDocs, addDoc, orderBy, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, of, map, from } from 'rxjs';
import { Smoke, Map as GameMap } from '../models/smoke.model';

@Injectable({
  providedIn: 'root'
})
export class SmokeService {
  private firestore: Firestore = inject(Firestore);
  private mapsCollection = collection(this.firestore, 'maps');
  private smokesCollection = collection(this.firestore, 'smokes');

  getMaps(): Observable<GameMap[]> {
    const q = query(this.mapsCollection, orderBy('name'));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as GameMap)))
    );
  }

  getMap(id: string): Observable<GameMap | undefined> {
    const docRef = doc(this.firestore, 'maps', id);
    return from(getDocs(query(this.mapsCollection, where('id', '==', id)))).pipe(
      map(snapshot => {
        if (snapshot.empty) return undefined;
        return snapshot.docs[0].data() as GameMap;
      })
    );
    // Simpler: Just search in the all-maps list for now to satisfy the interface, 
    // or fetch single doc if we want.
    // Actually, getMap is usually used via getMaps().find() in this app structure? 
    // Let's check how it was used.
    // It was: this.getMaps().pipe(map(maps => maps.find...))
    // So if getMaps() is now DB, that still works if we keep the implementation wrapping it.
  }

  // Re-implementing getMap to use the new observable stream source
  // so we don't break existing components that rely on it.
  getMapFromCollection(id: string): Observable<GameMap | undefined> {
    return this.getMaps().pipe(
      map(maps => maps.find(m => m.id === id))
    );
  }

  getSmokes(mapId: string): Observable<Smoke[]> {
    // Using getDocs instead of collectionData to avoid '_Query' type mismatch error
    return from(getDocs(this.smokesCollection)).pipe(
      map(snapshot => {
        const smokes = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Smoke));
        return smokes.filter(s => s.mapId === mapId);
      })
    );
  }

  getAllSmokes(): Observable<Smoke[]> {
    // collectionData causing type errors, switching to getDocs pattern
    return from(getDocs(this.smokesCollection)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Smoke)))
    );
  }

  async testRead(): Promise<any> {
    try {
      const snapshot = await getDocs(this.smokesCollection);
      return snapshot.size;
    } catch (e) {
      throw e;
    }
  }

  async testWrite(): Promise<void> {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Write operation timed out (5s). Check Firewall/Rules.')), 5000)
      );

      const docRef = await Promise.race([
        addDoc(this.smokesCollection, {
          title: 'Test Smoke',
          videoId: 'test',
          mapId: 'test',
          type: 'smoke',
          side: 't',
          description: 'Test Description',
          tags: ['test']
        }),
        timeoutPromise
      ]) as any; // Cast to any to avoid strict type issues with the race

      console.log('Test write successful, ID:', docRef.id);
    } catch (e) {
      throw e;
    }
  }

  addSmoke(smoke: Smoke): Promise<void> {
    if (!smoke.id) {
      const { id, ...data } = smoke; // Remove empty ID
      return addDoc(this.smokesCollection, data).then(() => { });
    }
    const docRef = doc(this.smokesCollection, smoke.id);
    return setDoc(docRef, smoke);
  }

  updateSmoke(smoke: Smoke): Promise<void> {
    const docRef = doc(this.firestore, 'smokes', smoke.id);
    return setDoc(docRef, smoke, { merge: true });
  }

  async updateMap(map: GameMap): Promise<void> {
    if (!map.id) throw new Error('Map ID is missing');
    console.log('Updating map with ID:', map.id);
    const docRef = doc(this.firestore, 'maps', map.id);
    // Use updateDoc to prevent creating new documents if ID is wrong (will fail instead)
    return updateDoc(docRef, { ...map });
  }

  deleteSmoke(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'smokes', id);
    return deleteDoc(docRef);
  }
}
