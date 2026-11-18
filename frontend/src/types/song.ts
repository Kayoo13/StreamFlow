export interface Song {
    id: number;
    title: string;
    durationSeconds: number;
    audioUrl: string;
    coverUrl: string;
    artistId: number;
    artistName: string;
}