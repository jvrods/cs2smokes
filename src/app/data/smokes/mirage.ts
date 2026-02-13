import { Smoke } from '../../models/smoke.model';

export const MIRAGE_SMOKES: Smoke[] = [
    {
        id: 'm1',
        mapId: 'mirage',
        title: 'Cs Tatics',
        description: 'Ez Mirage Smokes.',
        imageUrl: 'assets/smokes/mirage_stairs.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=AKuqMLnB07U',
        type: 'smoke'
    },
    {
        id: 'm2',
        mapId: 'mirage',
        title: 'Jungle and Stairs Smokes for A-SITE - Cs Tatics',
        description: 'Jungle and Stairs Smokes for A-SITE.',
        imageUrl: 'assets/smokes/mirage_jungle.jpg',
        videoUrl: 'https://www.youtube.com/shorts/ZFIKDVO1dmg',
        type: 'smoke'
    },
    {
        id: 'm3',
        mapId: 'mirage',
        title: 'CT Smoke Mirage',
        description: 'Blocks CT spawn vision to A site.',
        imageUrl: 'assets/smokes/mirage_ct.jpg',
        videoUrl: 'https://www.youtube.com/shorts/3mODdpHvNKg',
        type: 'smoke'
    },
];
