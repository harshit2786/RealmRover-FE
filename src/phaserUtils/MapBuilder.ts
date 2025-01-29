import Phaser from 'phaser';
interface MapElement {
    id: string;
    x: number;
    y: number;
}
export default class MapEditorScene extends Phaser.Scene {
    private gridGraphics!: Phaser.GameObjects.Graphics;
    private mapElements: MapElement[] = [];
    private gridSize: number = 32; // Size of each grid cell
    private gridWidth: number = 40; // Fixed number of horizontal grids
    private gridHeight: number = 20; // Fixed number of vertical grids
    private selectedElement: Phaser.GameObjects.Image | null = null;
    private isDraggingMap: boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private panelHeight: number = 100; // Height of the top panel

    constructor() {
        super({ key: 'MapEditorScene' });
    }

    preload() {
        // Load your map element assets here
        this.load.image('tree', 'assets/tree.jpg');
        this.load.image('rock', 'assets/rock.jpg');
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
        const tree = this.add.image(50, this.panelHeight / 2, 'tree').setInteractive();
        const rock = this.add.image(150, this.panelHeight / 2, 'rock').setInteractive();

        // Set origin to (0.5, 0.5) for panel elements
        tree.setOrigin(0, 0);
        rock.setOrigin(0, 0);

        // Make panel elements fixed (not affected by camera scroll)
        tree.setScrollFactor(0);
        rock.setScrollFactor(0);
        tree.setDepth(101); // Higher than the panel background
        rock.setDepth(101);
        // Make panel elements draggable
        this.input.setDraggable([tree, rock]);

        // Handle drag events for panel elements
        this.input.on('dragstart', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            this.selectedElement = gameObject;
        });

        this.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
            console.log("y", dragY + this.cameras.main.scrollY)
            gameObject.setPosition(dragX, dragY);
        });

        this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
            if (pointer.y > this.panelHeight && gameObject.y + this.cameras.main.scrollY > this.panelHeight && gameObject.y + this.cameras.main.scrollY < this.panelHeight + (this.gridSize * this.gridHeight) && gameObject.x + this.cameras.main.scrollX > 0 && gameObject.x + this.cameras.main.scrollX < this.gridSize * this.gridWidth) {
                // Convert pointer coordinates to world space
                const worldX = gameObject.x + this.cameras.main.scrollX;
                const worldY = gameObject.y + this.cameras.main.scrollY;

                // Snap the element to the grid
                const snappedX = Math.round(worldX / this.gridSize) * this.gridSize;
                const snappedY = Math.round(worldY / this.gridSize) * this.gridSize + 4;

                // Create a new object in the map at the snapped position
                this.add.image(snappedX, snappedY, gameObject.texture.key).setOrigin(0, 0);

                // Add the new element to the map
                this.mapElements.push({
                    id: gameObject.texture.key, // Use the texture key as the ID
                    x: snappedX / this.gridSize, // Convert to grid coordinates
                    y: (snappedY - this.panelHeight) / this.gridSize, // Adjust for panel height
                });
            }

            // Reset the panel element to its original position
            gameObject.setPosition(gameObject.input?.dragStartX, gameObject.input?.dragStartY);
            this.selectedElement = null;
        });
    }

    private drawGrid() {
        this.gridGraphics = this.add.graphics({ lineStyle: { width: 1, color: 0xffffff } });

        for (let x = 0; x <= this.gridWidth * this.gridSize; x += this.gridSize) {
            this.gridGraphics.lineBetween(x, this.panelHeight, x, this.panelHeight + this.gridHeight * this.gridSize);
        }

        for (let y = this.panelHeight; y <= this.panelHeight + this.gridHeight * this.gridSize; y += this.gridSize) {
            this.gridGraphics.lineBetween(0, y, this.gridWidth * this.gridSize, y);
        }
    }

    private setupMapPanning() {
        // Enable map dragging (panning)
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!this.selectedElement && pointer.y > this.panelHeight) {
                this.isDraggingMap = true;
                this.dragStartX = pointer.x + this.cameras.main.scrollX;
                this.dragStartY = pointer.y + this.cameras.main.scrollY;
            }
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isDraggingMap) {
                this.cameras.main.scrollX = this.dragStartX - pointer.x;
                this.cameras.main.scrollY = this.dragStartY - pointer.y;
            }
        });

        this.input.on('pointerup', () => {
            this.isDraggingMap = false;
        });
    }


}