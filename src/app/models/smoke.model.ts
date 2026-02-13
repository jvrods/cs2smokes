export interface Map {
    id: string;
    name: string;
    image: string;
}

export interface Smoke {
    id: string;
    mapId: string;
    title: string;
    description: string;
    videoUrl?: string;
    imageUrl: string;
    type: 'smoke' | 'flash' | 'molotov' | 'grenade';
}
