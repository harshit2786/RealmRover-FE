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

export interface BlockedRecieved {
    x : number,
    y : number
}

export type AssetGroup = "building" | "nature" | "interior" | "animated"

export interface StaticAsset {
    key : string,
    h : number,
    w : number
}

export interface AnimatedAsset extends StaticAsset {
    frames : number
}

export interface BlockedCoordinates {
    x : number,
    y : number,
    ref: Phaser.GameObjects.Image
}
