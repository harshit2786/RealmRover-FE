export interface MapElement {
    id: string;
    x: number;
    y: number;
    order: number,
    h: number,
    w: number,
    ref: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite
}
export type Mode = "pan" | "delete" | "block" | "picker";

export interface ElementReceived {
    id: string,
    x: number,
    y: number,
    order: number,
    animate: boolean,
    h: number,
    w: number,
    frames?: number
}