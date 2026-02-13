import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'youtubeEmbed',
    standalone: true
})
export class YoutubeEmbedPipe implements PipeTransform {

    transform(url: string | undefined): string {
        if (!url) return '';

        // Handle already correct embed URLs
        if (url.includes('embed')) return url;

        // Handle standard watch URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
        const expandedUrlMatch = url.match(/[?&]v=([^&]+)/);
        if (expandedUrlMatch) {
            return `https://www.youtube.com/embed/${expandedUrlMatch[1]}`;
        }

        // Handle short URLs (e.g., https://youtu.be/VIDEO_ID)
        const shortUrlMatch = url.match(/youtu\.be\/([^?]+)/);
        if (shortUrlMatch) {
            return `https://www.youtube.com/embed/${shortUrlMatch[1]}`;
        }

        // Handle shorts URLs (e.g., https://www.youtube.com/shorts/VIDEO_ID)
        const shortsUrlMatch = url.match(/shorts\/([^?]+)/);
        if (shortsUrlMatch) {
            return `https://www.youtube.com/embed/${shortsUrlMatch[1]}`;
        }

        return url;
    }
}
