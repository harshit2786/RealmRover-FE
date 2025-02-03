import { AnimatedAsset, AssetGroup, BlockedCoordinates, BlockedRecieved, ElementReceived, MapElement, Mode, StaticAsset } from '@/model/model';
import Phaser from 'phaser';

export default class MapEditorScene extends Phaser.Scene {
    private gridGraphics!: Phaser.GameObjects.Graphics;
    private mapElements: MapElement[] = [];
    private gridSize: number = 32; // Size of each grid cell
    private selectedTab: AssetGroup = "building"
    private selectedTabElements: Phaser.GameObjects.Image[] = []
    private buildingAssets: StaticAsset[]
    private interiorAssets: StaticAsset[]
    private defaultBlocked : Phaser.GameObjects.Image[] = []
    private panel: Phaser.GameObjects.Rectangle | null = null
    private blockedRefs: BlockedCoordinates[] = []
    private blockedCoordinates: BlockedRecieved[]
    private natureAssets: StaticAsset[]
    private animatedAssets: AnimatedAsset[]
    private gridWidth: number // Fixed number of horizontal grids
    private gridHeight: number // Fixed number of vertical grids
    private selectedElement: Phaser.GameObjects.Image | null = null;
    private isDraggingMap: boolean = false;
    private mode: Mode
    private prev: ElementReceived[]
    private setElements: (e: MapElement[]) => void
    private setBlocked: (e: BlockedRecieved[]) => void
    private offset: number = 2;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private panelHeight: number = this.offset * 100; // Height of the top panel
    private restrictedArea: number = 4;

    constructor(config: { mode: Mode, setBlocked: (e: BlockedRecieved[]) => void, setElements: (e: MapElement[]) => void, widthNum: number, heightNum: number, prev: ElementReceived[], blocked: BlockedRecieved[], buildingAssets: StaticAsset[], interiorAssets: StaticAsset[], natureAssets: StaticAsset[], animatedAssets: AnimatedAsset[] }) {
        super({ key: 'MapEditorScene' });
        this.mode = config.mode
        this.setElements = config.setElements
        this.gridWidth = config.widthNum + 2 * this.restrictedArea
        this.gridHeight = config.heightNum + 2 * this.restrictedArea
        this.prev = config.prev
        this.buildingAssets = config.buildingAssets
        this.interiorAssets = config.interiorAssets
        this.natureAssets = config.natureAssets
        this.animatedAssets = config.animatedAssets
        this.setBlocked = config.setBlocked
        this.blockedCoordinates = config.blocked
    }

    preload() {
        // Load your map element assets here
        for (let i = 0; i < this.buildingAssets.length; i++) {
            this.load.image(this.buildingAssets[i].key, `assets/${this.buildingAssets[i].key}.png`)
        }
        for (let i = 0; i < this.interiorAssets.length; i++) {
            this.load.image(this.interiorAssets[i].key, `assets/${this.interiorAssets[i].key}.png`)
        }
        for (let i = 0; i < this.natureAssets.length; i++) {
            this.load.image(this.natureAssets[i].key, `assets/${this.natureAssets[i].key}.png`)
        }
        for (let i = 0; i < this.animatedAssets.length; i++) {
            this.load.image(this.animatedAssets[i].key, `assets/${this.animatedAssets[i].key}.png`)
            for (let j = 1; j <= this.animatedAssets[i].frames; j++) {
                this.load.image(`${this.animatedAssets[i].key}${j}`, `assets/${this.animatedAssets[i].key}${j}.png`)
            }
        }
        this.load.image('blocked', 'assets/blocked.png');
    }

    create() {
        // Draw the top panel
        this.drawPanel();
        // Draw the grid

        this.drawGrid();
        // Enable map panning
        this.setupMapPanning();

        // Add draggable elements to the panel
        this.addPanelElements(this.selectedTab);
        this.updateEveryElement();

    }

    public updateMode(e: Mode) {
        this.selectedElement = null
        this.mode = e
        this.blockedRefs.forEach((a) => {
            a.ref.destroy();
        })
        this.defaultBlocked.forEach((a) => {
            a.destroy()
        });
        this.defaultBlocked = [];
        this.blockedRefs = [];
        if (e === "pan") {
            this.input.setDefaultCursor("grab");  // Set hand cursor
        } else {
            this.input.setDefaultCursor("pointer"); // Reset to normal cursor
        }
        if (this.mode === "block") {
            for(let i =0 ; i< this.gridWidth ; i++ ){
                for(let j=0 ; j < this.gridHeight ; j++){
                    if(i<this.restrictedArea || j < this.restrictedArea || i >= this.gridWidth - this.restrictedArea || j >= this.gridHeight - this.restrictedArea  ){
                        const X = i * this.gridSize;
                        const Y = j * this.gridSize + this.panelHeight;
                        const blockedRef = this.add.image(X, Y, 'blocked').setOrigin(0, 0);
                        this.defaultBlocked.push(blockedRef);
                    }
                }
            }
            this.blockedCoordinates.forEach((a) => {
                const X = a.x * this.gridSize;
                const Y = a.y * this.gridSize + this.panelHeight;
                const blockedRef = this.add.image(X, Y, 'blocked').setOrigin(0, 0)
                this.blockedRefs.push({ x: a.x, y: a.y, ref: blockedRef })
            })
        }
    }

    private updateEveryElement() {
        this.prev.forEach((a) => {
            const x = this.gridSize * a.x;
            const y = (this.gridSize * a.y) + this.panelHeight;
            let ref;
            if (a.animate && a.frames) {
                ref = this.playSprite(x, y, a.frames, a.id, a.order)

            } else {
                ref = this.add.image(x, y, a.id).setOrigin(0, 0);
            }
            this.mapElements.push({
                id: a.id, // Use the texture key as the ID
                x: a.x, // Convert to grid coordinates
                y: a.y, // Adjust for panel height
                order: a.order,
                h: a.h,
                w: a.w,
                ref
            });
        });
        this.setElements(this.mapElements)
    }
    private drawPanel() {
        // Draw a background for the panel
        const panel = this.add.rectangle(
            this.cameras.main.centerX,
            this.panelHeight / 2,
            this.cameras.main.width,
            this.panelHeight,
            0xfbe4ff
        ).setOrigin(0.5, 0.5);
        panel.setScrollFactor(0);
        panel.setDepth(100);
        this.panel = panel;
    }

    public hidePanel(e: boolean) {
        if (e) {
            if (this.panel) {
                this.panel.destroy();
            }
            this.drawPanel()
            this.addPanelElements(this.selectedTab)
        } else {
            if (this.panel) {
                this.panel.destroy()
            }
            this.selectedTabElements.forEach((a) => {
                a.destroy()
            })
            this.selectedTabElements = []
        }
    }
    public addPanelElements(e: AssetGroup) {
        this.selectedTab = e;
        this.selectedTabElements.forEach((a) => {
            a.destroy()
        })
        const newElements = [];
        if (e === "animated") {
            for (let i = 0; i < this.animatedAssets.length; i++) {
                let x, y;
                if (i < 10) {
                    x = 70 + i * 100;
                    y = this.panelHeight / 8
                } else {
                    x = 70 + (i - 10) * 100;
                    y = this.panelHeight - this.panelHeight / 2
                }
                const data = { sprite: "animated", h: String(this.animatedAssets[i].h), w: String(this.animatedAssets[i].w), num: String(this.animatedAssets[i].frames) };
                const ele = this.add.image(x, y, this.animatedAssets[i].key).setInteractive().setData(data).setOrigin(0, 0).setScrollFactor(0).setDepth(101);
                newElements.push(ele);
            }
        } else {
            let elements;
            if (e === "building") {
                elements = this.buildingAssets;
            } else if (e === "interior") {
                elements = this.interiorAssets;
            } else {
                elements = this.natureAssets;
            }
            for (let i = 0; i < elements.length; i++) {
                let x, y;
                if (i < 10) {
                    x = 70 + i * 100;
                    y = this.panelHeight / 8
                } else {
                    x = 70 + (i - 10) * 100;
                    y = this.panelHeight - this.panelHeight / 2
                }
                const data = { sprite: "static", h: String(elements[i].h), w: String(elements[i].w) };
                const ele = this.add.image(x, y, elements[i].key).setInteractive().setData(data).setOrigin(0, 0).setScrollFactor(0).setDepth(101);
                newElements.push(ele);
            }
        }
        this.input.setDraggable(newElements);
        this.selectedTabElements = newElements;
        newElements.forEach((ele) => {
            ele.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                if (this.mode === "picker") {
                    if (pointer.y < this.panelHeight) {
                        this.selectedElement = ele;
                        console.log("qqqqqqqq", ele)
                    }
                }
            });
        })
        this.input.on('dragstart', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            if (this.mode === "pan") {
                this.selectedElement = gameObject;
            }
        });



        this.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
            if (this.mode === "pan") {
                gameObject.setPosition(dragX, dragY);
            }
        });

        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            if (this.mode === "pan") {
                this.addElementsToMap(pointer, gameObject)
                // Reset the panel element to its original position
                gameObject.setPosition(gameObject.input?.dragStartX, gameObject.input?.dragStartY);
                this.selectedElement = null;
            }

        });


    }

    private addElementsToMap(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) {
        let modex, modey;
        if (this.mode === "pan") {
            modex = gameObject.x;
            modey = gameObject.y;
        } else if (this.mode === "picker") {
            modex = pointer.x;
            modey = pointer.y;
        } else {
            return
        }
        if (pointer.y > this.panelHeight && modey + this.cameras.main.scrollY > this.panelHeight && modey + this.cameras.main.scrollY < this.panelHeight + (this.gridSize * this.gridHeight) && modex + this.cameras.main.scrollX > 0 && modex + this.cameras.main.scrollX < this.gridSize * this.gridWidth) {
            // Convert pointer coordinates to world space
            const worldX = modex + this.cameras.main.scrollX;
            const worldY = modey + this.cameras.main.scrollY;

            // Snap the element to the grid
            const snappedX = this.mode === "pan" ? Math.round(worldX / this.gridSize) * this.gridSize : Math.floor(worldX / this.gridSize) * this.gridSize;
            const snappedY = this.mode === "pan" ? Math.round(worldY / this.gridSize) * this.gridSize + (4 * this.offset) : Math.floor(worldY / this.gridSize) * this.gridSize + (4 * this.offset);

            const finalX = snappedX / this.gridSize;
            const finalY = (snappedY - this.panelHeight) / this.gridSize
            // Add the new element to the map
            let ref;
            const len = Date.now();
            const { h, w } = gameObject.data.values;

            // Create a new object in the map at the snapped position
            if (gameObject.data.values?.sprite === "animated") {
                const frameLen = Number(gameObject.data.values.num);
                const key = gameObject.texture.key;
                ref = this.playSprite(snappedX, snappedY, frameLen, key, len)

            } else {
                ref = this.add.image(snappedX, snappedY, gameObject.texture.key).setOrigin(0, 0);
            }
            this.mapElements.push({
                id: gameObject.texture.key, // Use the texture key as the ID
                x: finalX, // Convert to grid coordinates
                y: finalY, // Adjust for panel height
                order: len,
                h: Number(h),
                w: Number(w),
                ref
            });
            this.setElements(this.mapElements)
        }
    }
    private drawGrid() {
        this.gridGraphics = this.add.graphics();

        for (let x = 0; x <= this.gridWidth * this.gridSize; x += this.gridSize) {
            // Set different color for the first 3 and last 3 vertical lines
            if (x < this.restrictedArea * this.gridSize || x > (this.gridWidth - this.restrictedArea) * this.gridSize) {
                this.gridGraphics.lineStyle(1.5, 0x6366f1); // Orange color
                this.gridGraphics.strokeLineShape(new Phaser.Geom.Line(x, this.panelHeight, x, this.panelHeight + this.gridHeight * this.gridSize));
            } else {
                this.gridGraphics.lineStyle(1.5, 0x6366f1); // Orange color
                this.gridGraphics.strokeLineShape(new Phaser.Geom.Line(x, this.panelHeight, x, this.panelHeight + this.restrictedArea * this.gridSize));
                this.gridGraphics.lineStyle(1, 0x000000); // Default black color
                this.gridGraphics.strokeLineShape(new Phaser.Geom.Line(x, this.panelHeight + this.restrictedArea * this.gridSize, x, this.panelHeight + (this.gridHeight - this.restrictedArea) * this.gridSize));
                this.gridGraphics.lineStyle(1.5, 0x6366f1); // Orange color
                this.gridGraphics.strokeLineShape(new Phaser.Geom.Line(x, this.panelHeight + (this.gridHeight - this.restrictedArea) * this.gridSize, x, this.panelHeight + this.gridHeight * this.gridSize));
            }
        }

        for (let y = this.panelHeight; y <= this.panelHeight + this.gridHeight * this.gridSize; y += this.gridSize) {
            // Set different color for the top and bottom 3 horizontal lines
            if (y < this.panelHeight + this.restrictedArea * this.gridSize || y > this.panelHeight + (this.gridHeight - this.restrictedArea) * this.gridSize) {
                this.gridGraphics.lineStyle(1.5, 0x6366f1); // Orange color
                this.gridGraphics.strokeLineShape(new Phaser.Geom.Line(0, y, this.gridWidth * this.gridSize, y));
            } else {
                this.gridGraphics.lineStyle(1.5, 0x6366f1); // Orange color
                this.gridGraphics.strokeLineShape(new Phaser.Geom.Line(0, y, this.restrictedArea * this.gridSize, y));

                this.gridGraphics.lineStyle(1, 0x000000); // Default black color
                this.gridGraphics.strokeLineShape(new Phaser.Geom.Line(this.restrictedArea * this.gridSize, y, (this.gridWidth - this.restrictedArea) * this.gridSize, y));

                this.gridGraphics.lineStyle(1.5, 0x6366f1); // Orange color
                this.gridGraphics.strokeLineShape(new Phaser.Geom.Line((this.gridWidth - this.restrictedArea) * this.gridSize, y, this.gridWidth * this.gridSize, y));
            }
        }
    }

    public setInternalBlocked(e : BlockedRecieved[]) {
        this.blockedCoordinates = e;
    }

    private setupMapPanning() {
        // Enable map dragging (panning)
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.mode === "picker" && this.selectedElement) {
                this.addElementsToMap(pointer, this.selectedElement)
            } else if (!this.selectedElement && pointer.y > this.panelHeight) {
                const X = pointer.x + this.cameras.main.scrollX;
                const Y = pointer.y + this.cameras.main.scrollY;
                if (this.mode === "pan") {
                    this.isDraggingMap = true;
                    this.dragStartX = X;
                    this.dragStartY = Y;
                } else if (this.mode === "delete") {
                    const XCord = Math.floor(X / this.gridSize);
                    const YCord = Math.floor((Y - this.panelHeight) / this.gridSize);
                    let order = -1;
                    const deleteElement = this.mapElements.filter((a) => {
                        if ((a.x === XCord && a.y === YCord) || (a.x === XCord - 1 && a.y === YCord && a.w === 2) || (a.x === XCord && a.y === YCord - 1 && a.h === 2) || (a.x === XCord - 1 && a.y === YCord - 1 && a.h === 2 && a.w === 2)) {
                            if (a.order > order) {
                                order = a.order;
                                return true
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    });
                    if (deleteElement.length > 0) {
                        const { id, order } = deleteElement[deleteElement.length - 1];
                        this.mapElements = this.mapElements.filter((a) => !(a.id === id && a.order === order))
                        this.setElements(this.mapElements)
                        deleteElement[deleteElement.length - 1].ref.destroy();
                    }
                } else if(this.mode === "block") {
                    const XCord = Math.floor(X / this.gridSize);
                    const YCord = Math.floor((Y - this.panelHeight) / this.gridSize);
                    if (XCord >= this.restrictedArea && XCord < this.gridWidth - this.restrictedArea && YCord >= this.restrictedArea && YCord < this.gridHeight - this.restrictedArea) {
                        const exists = this.blockedRefs.find((a) => a.x === XCord && a.y === YCord);
                        if (exists) {
                            this.setBlocked(this.blockedCoordinates.filter((a) => !(a.x === XCord && a.y === YCord)));
                            exists.ref.destroy();
                            this.blockedRefs = this.blockedRefs.filter((a) => !(a.x === XCord && a.y === YCord));
                        } else {
                            const X = XCord * this.gridSize;
                            const Y = YCord * this.gridSize + this.panelHeight;
                            this.setBlocked([...this.blockedCoordinates, { x: XCord, y: YCord }]);
                            const newRef = this.add.image(X, Y, 'blocked').setOrigin(0, 0);
                            this.blockedRefs.push({ x: XCord, y: YCord, ref: newRef });
                        }
                    }
                }
            }
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isDraggingMap && this.mode === "pan") {
                this.cameras.main.scrollX = this.dragStartX - pointer.x;
                this.cameras.main.scrollY = this.dragStartY - pointer.y;
            }
        });

        this.input.on('pointerup', () => {
            this.isDraggingMap = false;
        });
    }

    private playSprite(x: number, y: number, framesLen: number, key: string, order: number) {
        const sprite = this.add.sprite(x, y, `${key}1`);
        sprite.setOrigin(0, 0)
        const frames = [];
        for (let i = 1; i <= framesLen; i++) {
            frames.push({ key: `${key}${i}` });
        }
        this.anims.create({
            key: `${key}_${order}`,
            frames: frames,
            frameRate: 10,
            repeat: -1,
        });

        sprite.play(`${key}_${order}`);
        return sprite;
    }
}