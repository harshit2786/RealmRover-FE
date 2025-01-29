import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import MapEditorScene from "@/phaserUtils/MapBuilder";

const Map: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "phaser-game",
      scene: [MapEditorScene],
    };

    gameRef.current = new Phaser.Game(config);
    // Handle window resize
    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return <div className="w-full h-full overflow-x-hidden overflow-hidden" id="phaser-game" />;
};

export default Map;
