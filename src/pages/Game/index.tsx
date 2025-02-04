import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from '@/phaserUtils/Game';
import { BlockedRecieved, ElementReceived } from '@/model/model';

interface MapComponentProps {
  width: number; // Number of grids horizontally
  height: number; // Number of grids vertically
  elements: ElementReceived[]; // Map elements
  blockedCoordinates: BlockedRecieved[]; // Blocked coordinates
}

const MapComponent: React.FC<MapComponentProps> = ({ width, height, elements, blockedCoordinates }) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Phaser game configuration
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: width * 32, // Assuming each grid is 32x32 pixels
      height: height * 32,
      parent: 'phaser-container', // ID of the container div
      scene: [new GameScene( {width, height, elements, blockedCoordinates })], // Pass data to the scene
    };

    // Initialize the Phaser game
    gameRef.current = new Phaser.Game(config);

    // Cleanup when the component unmounts
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, [width, height, elements, blockedCoordinates]);

  return <div id="phaser-container" />; // Container for the Phaser game
};

export default MapComponent;