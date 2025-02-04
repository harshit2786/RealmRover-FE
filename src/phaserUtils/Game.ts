import { BlockedRecieved, ElementReceived } from '@/model/model';
import Phaser from 'phaser';

interface GameSceneConfig {
  width: number;
  height: number;
  elements: ElementReceived[];
  blockedCoordinates: BlockedRecieved[];
}

export default class GameScene extends Phaser.Scene {
  private gridSize: number = 32;
  private avatarCollisionSize: number = this.gridSize * 0.8;
  private width: number;
  private height: number;
  private elements: ElementReceived[];
  private blockedCoordinates: BlockedRecieved[];
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(config: GameSceneConfig) {
    super({ key: 'GameScene' });
    this.width = config.width;
    this.height = config.height;
    this.elements = config.elements;
    this.blockedCoordinates = config.blockedCoordinates;
  }

  preload() {
    this.elements.forEach((element) => {
      if (!element.animate) {
        this.load.image(element.id, `assets/${element.id}.png`);
      }
    });

    this.elements.forEach((element) => {
      if (element.animate && element.frames) {
        for (let j = 1; j <= element.frames; j++) {
          this.load.image(`${element.id}${j}`, `assets/${element.id}${j}.png`);
        }
      }
    });

    for (let i = 1; i <= 12; i++) {
      this.load.image(`avatar${i}`, `avatar/avatar${i}.png`);
    }
  }

  create() {
    this.elements.sort((a, b) => a.order - b.order).forEach((element) => {
      if (!element.animate) {
        const x = element.x * this.gridSize;
        const y = element.y * this.gridSize;
        this.add.image(x, y, element.id).setOrigin(0, 0);
      }
    });

    this.elements.sort((a, b) => a.order - b.order).forEach((element) => {
      if (element.animate) {
        const frames = [];
        for (let j = 1; j <= element.frames!; j++) {
          frames.push({ key: `${element.id}${j}` });
        }

        this.anims.create({
          key: `${element.id}_anim`,
          frames: frames,
          frameRate: 10,
          repeat: -1,
        });

        const x = element.x * this.gridSize;
        const y = element.y * this.gridSize;
        const sprite = this.add.sprite(x, y, `${element.id}1`).setOrigin(0, 0);
        sprite.play(`${element.id}_anim`);
      }
    });

    this.anims.create({
      key: 'moveDown',
      frames: [
        { key: 'avatar1' },
        { key: 'avatar2' },
        { key: 'avatar3' },
      ],
      frameRate: 10,
      repeat: -1, // Loop indefinitely
    });
  
    this.anims.create({
      key: 'moveLeft',
      frames: [
        { key: 'avatar4' },
        { key: 'avatar5' },
        { key: 'avatar6' },
      ],
      frameRate: 10,
      repeat: -1, // Loop indefinitely
    });
  
    this.anims.create({
      key: 'moveRight',
      frames: [
        { key: 'avatar7' },
        { key: 'avatar8' },
        { key: 'avatar9' },
      ],
      frameRate: 10,
      repeat: -1, // Loop indefinitely
    });
  
    this.anims.create({
      key: 'moveUp',
      frames: [
        { key: 'avatar10' },
        { key: 'avatar11' },
        { key: 'avatar12' },
      ],
      frameRate: 10,
      repeat: -1, // Loop indefinitely
    });
  
    // Render player avatar
    this.player = this.add.sprite(this.gridSize, this.gridSize, 'avatar2').setOrigin(0, 0);
    this.player.setScale(0.75);
    this.cursors = this.input!.keyboard!.createCursorKeys();
  }

  update() {
    // Player movement logic
    const speed = 100; // Pixels per second
    const prevX = this.player.x;
    const prevY = this.player.y;
    let isMoving = false;
  
    if (this.cursors.left.isDown) {
      this.player.x -= speed * this.game.loop.delta / 1000;
      this.player.play('moveLeft', true); // Play left animation
      isMoving = true;
    } else if (this.cursors.right.isDown) {
      this.player.x += speed * this.game.loop.delta / 1000;
      this.player.play('moveRight', true); // Play right animation
      isMoving = true;
    }
  
    if (this.cursors.up.isDown) {
      this.player.y -= speed * this.game.loop.delta / 1000;
      this.player.play('moveUp', true); // Play up animation
      isMoving = true;
    } else if (this.cursors.down.isDown) {
      this.player.y += speed * this.game.loop.delta / 1000;
      this.player.play('moveDown', true); // Play down animation
      isMoving = true;
    }
  
    // Freeze the sprite at the correct frame when the player stops moving
    if (!isMoving) {
      if (this.player.anims.currentAnim?.key === 'moveDown') {
        this.player.anims.stop();
        this.player.setTexture('avatar2'); // Freeze at avatar2
      } else if (this.player.anims.currentAnim?.key === 'moveLeft') {
        this.player.anims.stop();
        this.player.setTexture('avatar5'); // Freeze at avatar5
      } else if (this.player.anims.currentAnim?.key === 'moveRight') {
        this.player.anims.stop();
        this.player.setTexture('avatar8'); // Freeze at avatar8
      } else if (this.player.anims.currentAnim?.key === 'moveUp') {
        this.player.anims.stop();
        this.player.setTexture('avatar11'); // Freeze at avatar11
      }
    }

    // Check for collisions with blocked coordinates
    const isBlocked = this.isAvatarBlocked();
    if (isBlocked) {
      // Revert to previous position if blocked
      this.player.x = prevX;
      this.player.y = prevY;
    }

    // Ensure player stays within map boundaries
    const minX = 0; // Left boundary
    const maxX = this.width * this.gridSize - this.avatarCollisionSize; // Right boundary
    const minY = 0; // Top boundary
    const maxY = this.height * this.gridSize - this.avatarCollisionSize; // Bottom boundary

    this.player.x = Phaser.Math.Clamp(this.player.x, minX, maxX);
    this.player.y = Phaser.Math.Clamp(this.player.y, minY, maxY);
  }

  private isAvatarBlocked(): boolean {
    // Calculate the offset for the smaller collision block
    const offset = (this.gridSize - this.avatarCollisionSize) / 2;

    // Get the grid coordinates of all four corners of the avatar's collision block
    const topLeft = {
      x: Math.floor((this.player.x + offset) / this.gridSize),
      y: Math.floor((this.player.y + offset) / this.gridSize),
    };
    const topRight = {
      x: Math.floor((this.player.x + this.avatarCollisionSize - 1 + offset) / this.gridSize),
      y: Math.floor((this.player.y + offset) / this.gridSize),
    };
    const bottomLeft = {
      x: Math.floor((this.player.x + offset) / this.gridSize),
      y: Math.floor((this.player.y + this.avatarCollisionSize - 1 + offset) / this.gridSize),
    };
    const bottomRight = {
      x: Math.floor((this.player.x + this.avatarCollisionSize - 1 + offset) / this.gridSize),
      y: Math.floor((this.player.y + this.avatarCollisionSize - 1 + offset) / this.gridSize),
    };

    // Check if any of the corners overlap with blocked coordinates
    return (
      this.isCoordinateBlocked(topLeft) ||
      this.isCoordinateBlocked(topRight) ||
      this.isCoordinateBlocked(bottomLeft) ||
      this.isCoordinateBlocked(bottomRight)
    );
  }

  private isCoordinateBlocked(coord: { x: number; y: number }): boolean {
    return this.blockedCoordinates.some(
      (block) => block.x === coord.x && block.y === coord.y
    );
  }
}

