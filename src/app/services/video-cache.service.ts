import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class VideoCacheService {
    private cache = new Map<string, SafeResourceUrl>();

    constructor(private sanitizer: DomSanitizer) { }

    getSafeUrl(url: string): SafeResourceUrl {
        if (this.cache.has(url)) {
            return this.cache.get(url)!;
        }

        // Convert standard YouTube URLs to embed URLs if necessary
        let embedUrl = url;
        if (url.includes('watch?v=')) {
            embedUrl = url.replace('watch?v=', 'embed/');
        } else if (url.includes('youtu.be/')) {
            embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
        } else if (url.includes('youtube.com/shorts/')) {
            embedUrl = url.replace('youtube.com/shorts/', 'youtube.com/embed/');
        }

        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        this.cache.set(url, safeUrl);
        return safeUrl;
    }

    clearCache() {
        this.cache.clear();
    }
}
