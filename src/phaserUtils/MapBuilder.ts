import Phaser from 'phaser';
interface MapElement {
    id: string;
    x: number;
    y: number;
    order: number,
    h: number,
    w: number,
    ref: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite
}
type Mode = "pan" | "delete" | "block" | "picker";
export default class MapEditorScene extends Phaser.Scene {
    private gridGraphics!: Phaser.GameObjects.Graphics;
    private mapElements: MapElement[] = [];
    private gridSize: number = 32; // Size of each grid cell
    private gridWidth: number = 60; // Fixed number of horizontal grids
    private gridHeight: number = 30; // Fixed number of vertical grids
    private selectedElement: Phaser.GameObjects.Image | null = null;
    private isDraggingMap: boolean = false;
    private mode: Mode = "pan";
    private offset: number = 2;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private panelHeight: number = this.offset * 100; // Height of the top panel
    private restrictedArea: number = 3;

    constructor() {
        super({ key: 'MapEditorScene' });
    }

    preload() {
        // Load your map element assets here
        this.load.image('tree', 'assets/tree.png');
        this.load.image('rock', 'assets/rock.png');
        this.load.image('water', `assets/water.png`);
        this.load.image('horizonalfence', `assets/horfences.png`);
        this.load.image('verticalfence', `assets/verfences.png`);
        this.load.image('lchair', `assets/lchair.png`);
        this.load.image('rchair', `assets/rchair.png`);
        this.load.image('table', `assets/table.png`);
        this.load.image('lamp', `assets/lamp.png`);
        this.load.image('tulip', `assets/tulip.png`);
        this.load.image('drawer', `assets/drawer.png`);
        this.load.image('bed', `assets/bed.png`);
        this.load.image('mat', `assets/mat.png`);
        this.load.image('log', `assets/log.png`);
        this.load.image('lotus', `assets/lotus.png`);
        this.load.image('lilypad', `assets/lilypad.png`);
        this.load.image('thintree', `assets/thintree.png`);
        this.load.image('bush', `assets/bush.png`);
        this.load.image('bridge', `assets/bridge.png`)
        this.load.image('closedoor', `assets/closedoor.png`)
        this.load.image('opendoor', `assets/opendoor.png`)
        this.load.image('sgrass', `assets/sgrass.png`)
        this.load.image('lgrass', `assets/lgrass.png`)
        this.load.image('dirt', `assets/dirt.png`)
        this.load.image('computer', `assets/computer.png`)
        this.load.image('sofa', `assets/sofa.png`)
        this.load.image('vending', `assets/vending.png`)
        this.load.image('walla', `assets/walla.png`)
        this.load.image('wallb', `assets/wallb.png`)
        this.load.image('wallc', `assets/wallc.png`)
        this.load.image('walld', `assets/walld.png`)
        this.load.image('walle', `assets/walle.png`)
        this.load.image('wallf', `assets/wallf.png`)
        this.load.image('wallg', `assets/wallg.png`)
        this.load.image('wallh', `assets/wallh.png`)
        this.load.image('floorb', `assets/floorb.png`)
        this.load.image('floora', `assets/floora.png`)
        this.load.image('tableb', `assets/tableb.png`)
        this.load.image('cat', `assets/cat.png`)
        for (let i = 1; i <= 8; i++) {
            this.load.image(`cat${i}`, `assets/cat${i}.png`);
        }
    }

    create() {
        // Draw the top panel
        this.drawPanel();

        // Draw the grid
        this.drawGrid();

        // Enable map panning
        this.setupMapPanning();

        // Add draggable elements to the panel
        this.addPanelElements();
    }

    private drawPanel() {
        // Draw a background for the panel
        const panel = this.add.rectangle(
            this.cameras.main.centerX,
            this.panelHeight / 2,
            this.cameras.main.width,
            this.panelHeight,
            0x2c3e50
        ).setOrigin(0.5, 0.5);

        // Make the panel fixed (not affected by camera scroll)
        panel.setScrollFactor(0);

        panel.setDepth(100);
    }

    private addPanelElements() {
        // Add draggable elements to the panel
        const tree = this.add.image(20, this.panelHeight / 8, 'tree').setInteractive().setData({ sprite: "static", h: "2", w: "2" });
        const rock = this.add.image(100, this.panelHeight / 8, 'rock').setInteractive().setData({ sprite: "static", h: "1", w: "1" });
        const water = this.add.image(150, this.panelHeight / 8, 'water').setInteractive().setData({ sprite: "static", h: "1", w: "1" });
        const horizonalFence = this.add.image(200, this.panelHeight / 8, 'horizonalfence').setInteractive().setData({ sprite: "static", h: "1", w: "2" })
        const verticalFence = this.add.image(300, this.panelHeight / 8, 'verticalfence').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const lChair = this.add.image(350, this.panelHeight / 8, 'lchair').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const rChair = this.add.image(400, this.panelHeight / 8, 'rchair').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const table = this.add.image(450, this.panelHeight / 8, 'table').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const lamp = this.add.image(500, this.panelHeight / 8, 'lamp').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const tulip = this.add.image(550, this.panelHeight / 8, 'tulip').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const drawer = this.add.image(600, this.panelHeight / 8, 'drawer').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const bed = this.add.image(650, this.panelHeight / 8, 'bed').setInteractive().setData({ sprite: "static", h: "2", w: "1" })
        const mat = this.add.image(700, this.panelHeight / 8, 'mat').setInteractive().setData({ sprite: "static", h: "1", w: "2" })
        const log = this.add.image(800, this.panelHeight / 8, 'log').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const lotus = this.add.image(850, this.panelHeight / 8, 'lotus').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const lilypad = this.add.image(900, this.panelHeight / 8, 'lilypad').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const thintree = this.add.image(950, this.panelHeight / 8, 'thintree').setInteractive().setData({ sprite: "static", h: "2", w: "1" })
        const bush = this.add.image(1000, this.panelHeight / 8, 'bush').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const bridge = this.add.image(1050, this.panelHeight / 8, 'bridge').setInteractive().setData({ sprite: "static", h: "1", w: "2" })
        const opendoor = this.add.image(1150, this.panelHeight / 8, 'opendoor').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const closedoor = this.add.image(1200, this.panelHeight / 8, 'closedoor').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const lgrass = this.add.image(100, this.panelHeight - this.panelHeight / 2, 'lgrass').setInteractive().setData({ sprite: "static", h: "2", w: "2" })
        const sgrass = this.add.image(50, this.panelHeight - this.panelHeight / 2, 'sgrass').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const dirt = this.add.image(200, this.panelHeight - this.panelHeight / 2, 'dirt').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const computer = this.add.image(250, this.panelHeight - this.panelHeight / 2, 'computer').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const sofa = this.add.image(300, this.panelHeight - this.panelHeight / 2, 'sofa').setInteractive().setData({ sprite: "static", h: "1", w: "2" })
        const vending = this.add.image(400, this.panelHeight - this.panelHeight / 2, 'vending').setInteractive().setData({ sprite: "static", h: "2", w: "1" })
        const walla = this.add.image(450, this.panelHeight - this.panelHeight / 2, 'walla').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const wallb = this.add.image(500, this.panelHeight - this.panelHeight / 2, 'wallb').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const wallc = this.add.image(550, this.panelHeight - this.panelHeight / 2, 'wallc').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const walld = this.add.image(600, this.panelHeight - this.panelHeight / 2, 'walld').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const walle = this.add.image(650, this.panelHeight - this.panelHeight / 2, 'walle').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const wallf = this.add.image(700, this.panelHeight - this.panelHeight / 2, 'wallf').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const wallg = this.add.image(750, this.panelHeight - this.panelHeight / 2, 'wallg').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const wallh = this.add.image(800, this.panelHeight - this.panelHeight / 2, 'wallh').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const floora = this.add.image(850, this.panelHeight - this.panelHeight / 2, 'floora').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const floorb = this.add.image(900, this.panelHeight - this.panelHeight / 2, 'floorb').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const tableb = this.add.image(950, this.panelHeight - this.panelHeight / 2, 'tableb').setInteractive().setData({ sprite: "static", h: "1", w: "1" })
        const cat = this.add.image(1000, this.panelHeight - this.panelHeight / 2, 'cat').setInteractive().setData({ sprite: "animated", prefix: "cat", num: "8", h: "1", w: "1" })


        // Set origin to (0.5, 0.5) for panel elements
        tree.setOrigin(0, 0);
        rock.setOrigin(0, 0);
        water.setOrigin(0, 0);
        horizonalFence.setOrigin(0, 0)
        verticalFence.setOrigin(0, 0)
        lChair.setOrigin(0, 0)
        rChair.setOrigin(0, 0)
        table.setOrigin(0, 0)
        lamp.setOrigin(0, 0)
        tulip.setOrigin(0, 0)
        drawer.setOrigin(0, 0)
        bed.setOrigin(0, 0)
        mat.setOrigin(0, 0)
        log.setOrigin(0, 0)
        lotus.setOrigin(0, 0)
        lilypad.setOrigin(0, 0)
        thintree.setOrigin(0, 0)
        bush.setOrigin(0, 0)
        bridge.setOrigin(0, 0)
        closedoor.setOrigin(0, 0)
        opendoor.setOrigin(0, 0)
        sgrass.setOrigin(0, 0)
        lgrass.setOrigin(0, 0)
        dirt.setOrigin(0, 0)
        computer.setOrigin(0, 0)
        sofa.setOrigin(0, 0)
        vending.setOrigin(0, 0)
        walla.setOrigin(0, 0)
        wallb.setOrigin(0, 0)
        wallc.setOrigin(0, 0)
        walld.setOrigin(0, 0)
        walle.setOrigin(0, 0)
        wallf.setOrigin(0, 0)
        wallg.setOrigin(0, 0)
        wallh.setOrigin(0, 0)
        floora.setOrigin(0, 0)
        floorb.setOrigin(0, 0)
        tableb.setOrigin(0, 0)
        cat.setOrigin(0, 0)

        // Make panel elements fixed (not affected by camera scroll)
        tree.setScrollFactor(0);
        rock.setScrollFactor(0);
        water.setScrollFactor(0);
        horizonalFence.setScrollFactor(0);
        verticalFence.setScrollFactor(0);
        lChair.setScrollFactor(0);
        rChair.setScrollFactor(0);
        table.setScrollFactor(0);
        lamp.setScrollFactor(0);
        tulip.setScrollFactor(0);
        drawer.setScrollFactor(0);
        bed.setScrollFactor(0);
        mat.setScrollFactor(0);
        log.setScrollFactor(0);
        lotus.setScrollFactor(0);
        lilypad.setScrollFactor(0);
        thintree.setScrollFactor(0);
        bush.setScrollFactor(0);
        bridge.setScrollFactor(0);
        opendoor.setScrollFactor(0);
        closedoor.setScrollFactor(0);
        sgrass.setScrollFactor(0);
        lgrass.setScrollFactor(0);
        dirt.setScrollFactor(0);
        computer.setScrollFactor(0);
        sofa.setScrollFactor(0);
        vending.setScrollFactor(0);
        walla.setScrollFactor(0);
        wallb.setScrollFactor(0);
        wallc.setScrollFactor(0);
        walld.setScrollFactor(0);
        walle.setScrollFactor(0);
        wallf.setScrollFactor(0);
        wallg.setScrollFactor(0);
        wallh.setScrollFactor(0);
        floora.setScrollFactor(0);
        floorb.setScrollFactor(0);
        tableb.setScrollFactor(0);
        cat.setScrollFactor(0);


        tree.setDepth(101); // Higher than the panel background
        rock.setDepth(101);
        water.setDepth(101);
        horizonalFence.setDepth(101);
        verticalFence.setDepth(101);
        lChair.setDepth(101);
        rChair.setDepth(101);
        table.setDepth(101);
        lamp.setDepth(101);
        tulip.setDepth(101);
        drawer.setDepth(101);
        bed.setDepth(101);
        mat.setDepth(101);
        log.setDepth(101);
        lotus.setDepth(101);
        lilypad.setDepth(101);
        thintree.setDepth(101);
        bush.setDepth(101);
        bridge.setDepth(101);
        closedoor.setDepth(101);
        opendoor.setDepth(101);
        sgrass.setDepth(101);
        lgrass.setDepth(101);
        dirt.setDepth(101);
        computer.setDepth(101);
        sofa.setDepth(101);
        vending.setDepth(101);
        walla.setDepth(101);
        wallb.setDepth(101);
        wallc.setDepth(101);
        walld.setDepth(101);
        walle.setDepth(101);
        wallf.setDepth(101);
        wallg.setDepth(101);
        wallh.setDepth(101);
        floorb.setDepth(101);
        floora.setDepth(101);
        tableb.setDepth(101);
        cat.setDepth(101);

        // Make panel elements draggable
        this.input.setDraggable([tree, rock, water, horizonalFence, verticalFence, lChair, rChair, table, lamp, tulip, drawer, bed, mat, log, lotus, lilypad, thintree, bush, bridge, closedoor, opendoor, lgrass, sgrass, dirt, computer, sofa, vending, walla, wallb, wallc, walld, walle, wallf, wallg, wallh, floora, floorb, tableb, cat]);

        // Handle drag events for panel elements
        this.input.on('dragstart', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            this.selectedElement = gameObject;
        });

        this.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
            gameObject.setPosition(dragX, dragY);
        });

        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            if (pointer.y > this.panelHeight && gameObject.y + this.cameras.main.scrollY > this.panelHeight && gameObject.y + this.cameras.main.scrollY < this.panelHeight + (this.gridSize * this.gridHeight) && gameObject.x + this.cameras.main.scrollX > 0 && gameObject.x + this.cameras.main.scrollX < this.gridSize * this.gridWidth) {
                // Convert pointer coordinates to world space
                const worldX = gameObject.x + this.cameras.main.scrollX;
                const worldY = gameObject.y + this.cameras.main.scrollY;

                // Snap the element to the grid
                const snappedX = Math.round(worldX / this.gridSize) * this.gridSize;
                const snappedY = Math.round(worldY / this.gridSize) * this.gridSize + (4 * this.offset);

                const finalX = snappedX / this.gridSize;
                const finalY = (snappedY - this.panelHeight) / this.gridSize
                // Add the new element to the map
                let ref;
                const len = this.mapElements.length;
                const { h, w } = gameObject.data.values;

                // Create a new object in the map at the snapped position
                if (gameObject.data.values?.sprite === "animated") {
                    const frameLen = Number(gameObject.data.values.num);
                    const key = gameObject.data.values.prefix;
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
                // console.log("elements", this.mapElements);
            }

            // Reset the panel element to its original position
            gameObject.setPosition(gameObject.input?.dragStartX, gameObject.input?.dragStartY);
            this.selectedElement = null;
        });
    }

    private drawGrid() {
        this.gridGraphics = this.add.graphics();

        for (let x = 0; x <= this.gridWidth * this.gridSize; x += this.gridSize) {
            // Set different color for the first 3 and last 3 vertical lines
            if (x <= this.restrictedArea * this.gridSize || x >= (this.gridWidth - this.restrictedArea) * this.gridSize) {
                this.gridGraphics.lineStyle(1, 0xFFA500); // Orange color
            } else {
                this.gridGraphics.lineStyle(1, 0xffffff); // Default black color
            }
            this.gridGraphics.strokeLineShape(new Phaser.Geom.Line(x, this.panelHeight, x, this.panelHeight + this.gridHeight * this.gridSize));
        }

        for (let y = this.panelHeight; y <= this.panelHeight + this.gridHeight * this.gridSize; y += this.gridSize) {
            // Set different color for the top and bottom 3 horizontal lines
            if (y <= this.panelHeight + this.restrictedArea * this.gridSize || y >= this.panelHeight + (this.gridHeight - this.restrictedArea) * this.gridSize) {
                this.gridGraphics.lineStyle(1, 0xFFA500); // Orange color
            } else {
                this.gridGraphics.lineStyle(1, 0xffffff); // Default black color
            }
            this.gridGraphics.strokeLineShape(new Phaser.Geom.Line(0, y, this.gridWidth * this.gridSize, y));
        }
    }


    private setupMapPanning() {
        // Enable map dragging (panning)
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!this.selectedElement && pointer.y > this.panelHeight) {
                const X = pointer.x + this.cameras.main.scrollX;
                const Y = pointer.y + this.cameras.main.scrollY;
                if (this.mode === "pan") {
                    this.isDraggingMap = true;
                    this.dragStartX = X;
                    this.dragStartY = Y;
                } else  if (this.mode === "delete") {
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
                        deleteElement[deleteElement.length - 1].ref.destroy();
                    }
                    console.log("ele", this.mapElements);
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
        // Create a sprite at position (100, 100)
        const sprite = this.add.sprite(x, y, `${key}1`);
        sprite.setOrigin(0, 0)
        sprite.setScrollFactor(0);
        sprite.setDepth(101);
        // Define the animation frames
        const frames = [];
        for (let i = 1; i <= framesLen; i++) {
            frames.push({ key: `${key}${i}` });
        }

        // Create an animation from the frames
        this.anims.create({
            key: `${key}_${order}`, // Unique key for the animation
            frames: frames, // Array of frames
            frameRate: 10, // Frames per second
            repeat: -1, // Loop indefinitely
        });

        // Play the animation on the sprite
        sprite.play(`${key}_${order}`);
        return sprite;
    }
}