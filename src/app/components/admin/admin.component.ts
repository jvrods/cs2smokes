import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SmokeService } from '../../services/smoke.service';
import { Smoke, Map as GameMap } from '../../models/smoke.model';
import { Observable, map, of, take } from 'rxjs';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  private storage: Storage = inject(Storage);

  smoke: Smoke = {
    id: '',
    mapId: '',
    title: '',
    description: '',
    imageUrl: '',
    type: 'smoke',
    videoUrl: ''
  };

  selectedFile: File | null = null;
  maps$: Observable<GameMap[]>;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  viewMode: 'add-content' | 'manage-maps' | 'edit-nades' = 'add-content';
  smokes$: Observable<Smoke[]> = new Observable<Smoke[]>();

  // Manage Maps State
  selectedMap: GameMap | null = null;

  // Edit Nades State
  selectedMapForEdit: string = '';
  filteredSmokesForEdit$: Observable<Smoke[]> = of([]);
  selectedSmokeForEdit: Smoke | null = null;

  constructor(
    private authService: AuthService,
    private smokeService: SmokeService,
    private router: Router
  ) {
    this.maps$ = this.smokeService.getMaps();
    this.loadSmokes();
  }

  loadSmokes() {
    this.smokes$ = this.smokeService.getAllSmokes();
  }

  switchMode(mode: 'add-content' | 'manage-maps' | 'edit-nades') {
    this.viewMode = mode;
    this.resetForm();
    if (mode === 'manage-maps') {
      this.selectedMap = null;
    }
    if (mode === 'edit-nades') {
      this.selectedMapForEdit = '';
      this.selectedSmokeForEdit = null;
      this.filteredSmokesForEdit$ = of([]);
    }
  }

  // --- Manage Maps Logic ---
  async onMapSelect(mapId: string) {
    if (!mapId) return;
    this.maps$.pipe(take(1)).subscribe(maps => {
      const found = maps.find(m => m.id === mapId);
      if (found) {
        console.log('Selected Map:', found);
        this.selectedMap = { ...found };
        this.selectedFile = null;
      }
    });
  }

  // --- Edit Nades Logic ---
  onEditMapSelect() {
    this.selectedSmokeForEdit = null;

    if (this.selectedMapForEdit) {
      this.filteredSmokesForEdit$ = this.smokes$.pipe(
        map(smokes => {
          const filtered = smokes.filter(s => s.mapId === this.selectedMapForEdit);
          return filtered;
        })
      );
    } else {
      this.filteredSmokesForEdit$ = of([]);
    }
  }

  onEditSmokeSelect() {
    if (this.selectedSmokeForEdit) {
      this.smoke = { ...this.selectedSmokeForEdit };
      // We are editing this smoke now
    }
  }

  async deleteSmoke() {
    if (!this.selectedSmokeForEdit) return;
    if (confirm(`Are you sure you want to delete "${this.selectedSmokeForEdit.title}"?`)) {
      try {
        await this.smokeService.deleteSmoke(this.selectedSmokeForEdit.id);
        this.showMessage('success', 'Nade deleted successfully.');
        this.selectedSmokeForEdit = null;
        this.loadSmokes(); // Refresh list
        this.onEditMapSelect(); // Re-filter
      } catch (error: any) {
        this.showMessage('error', 'Deletion failed: ' + error.message);
      }
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  async onSubmit() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      // 1. Handle Image Upload if file selected
      let uploadedImageUrl = '';
      if (this.selectedFile) {
        const folder = this.viewMode === 'manage-maps' ? 'maps' : 'smokes';
        const filePath = `${folder}/${Date.now()}_${this.selectedFile.name}`;
        const storageRef = ref(this.storage, filePath);
        const uploadResult = await uploadBytes(storageRef, this.selectedFile);
        uploadedImageUrl = await getDownloadURL(uploadResult.ref);
      }

      if (this.viewMode === 'add-content') {
        // Add Mode: Create new smoke
        if (uploadedImageUrl) this.smoke.imageUrl = uploadedImageUrl;

        await this.smokeService.addSmoke(this.smoke);
        this.showMessage('success', 'Content added successfully!');
        this.resetForm();

      } else if (this.viewMode === 'manage-maps') {
        // Manage Maps Mode
        if (!this.selectedMap) throw new Error("No map selected");

        if (uploadedImageUrl) {
          this.selectedMap.image = uploadedImageUrl;
        }

        await this.smokeService.updateMap(this.selectedMap);
        this.showMessage('success', 'Map updated successfully!');

      } else if (this.viewMode === 'edit-nades') {
        // Edit Nades Mode
        if (!this.smoke.id) throw new Error("No nade selected");

        if (uploadedImageUrl) this.smoke.imageUrl = uploadedImageUrl;

        await this.smokeService.updateSmoke(this.smoke);
        this.showMessage('success', 'Nade updated successfully!');
        this.loadSmokes(); // Refresh
      }

    } catch (error: any) {
      console.error(error);
      this.showMessage('error', 'Operation failed: ' + error.message);
    } finally {
      this.isSubmitting = false;
    }
  }

  showMessage(type: 'success' | 'error', message: string) {
    if (type === 'success') {
      this.successMessage = message;
      this.errorMessage = '';
    } else {
      this.errorMessage = message;
      this.successMessage = '';
    }

    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  removeFile() {
    this.selectedFile = null;
    // Reset file input value to allow re-selecting same file if needed
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  resetForm() {
    this.selectedFile = null;
    this.smoke = {
      id: '',
      mapId: this.smoke.mapId, // Keep map for convenience in add mode
      title: '',
      description: '',
      imageUrl: '',
      type: 'smoke',
      videoUrl: ''
    };
  }
}
