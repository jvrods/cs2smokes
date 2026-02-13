import { Smoke } from '../../models/smoke.model';

export const INFERNO_SMOKES: Smoke[] = [
    {
        id: 'i1',
        mapId: 'inferno',
        title: 'Coffins from Banana',
        description: 'Standard B execute smoke.',
        imageUrl: 'assets/smokes/inferno_coffins.jpg',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        type: 'smoke'
    },
    {
        id: 'i2',
        mapId: 'inferno',
        title: 'CT from Banana',
        description: 'Blocks CT rotation to B.',
        imageUrl: 'assets/smokes/inferno_ct.jpg',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        type: 'smoke'
    },
];
