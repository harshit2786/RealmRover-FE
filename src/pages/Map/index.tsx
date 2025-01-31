import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import MapEditorScene from "@/phaserUtils/MapBuilder";
import { Hand, Pipette, Trash2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ElementReceived, MapElement, Mode } from "@/model/model";

const preVVV: ElementReceived[] = [
  {
    id: "lgrass",
    x: 4,
    y: 4,
    order: 1738354021209,
    h: 2,
    w: 2,
    animate: false,
  },
  {
    id: "lgrass",
    x: 6,
    y: 4,
    order: 1738354023812,
    h: 2,
    w: 2,
    animate: false,
  },
  {
    id: "vending",
    x: 13,
    y: 4,
    order: 1738354026844,
    h: 2,
    w: 1,
    animate: false,
  },
  {
    id: "mat",
    x: 18,
    y: 5,
    order: 1738354030511,
    h: 1,
    w: 2,
    animate: false,
  },
  {
    id: "floora",
    x: 16,
    y: 7,
    order: 1738354036314,
    h: 1,
    w: 1,
    animate: false,
  },
  {
    id: "cat",
    x: 16,
    y: 7,
    order: 1738354039977,
    h: 1,
    w: 1,
    animate: true,
    frames: 8,
  },
];

const Map: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<MapEditorScene | null>(null); // Ref to store the scene instance
  const [mode, setMode] = useState<Mode>("pan");
  const [elements, setElements] = useState<MapElement[]>([]);
//   const [prevElements, setPrevElements] = useState<ElementReceived[]>(preVVV);
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      backgroundColor: 0xffffff,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "phaser-game",
      scene: [
        new MapEditorScene({ mode, setElements, heightNum: 20, widthNum: 40 , prev : preVVV }),
      ], // Pass the class reference, NOT an instance
    };

    gameRef.current = new Phaser.Game(config);

    // Wait for Phaser to fully initialize the scene
    gameRef.current.events.on("ready", () => {
      const scene = gameRef.current?.scene.getScene(
        "MapEditorScene"
      ) as MapEditorScene;
      if (scene) {
        sceneRef.current = scene;
        scene.updateMode(mode); // Set initial mode
      }
    });
    // Handle window resize
    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Update the scene whenever the mode changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.updateMode(mode);
    }
  }, [mode]);

  return (
    <div className="w-full h-full relative">
      <div
        className="w-full h-full overflow-x-hidden overflow-hidden"
        id="phaser-game"
      />
      <div className="absolute w-40 h-10 rounded-xl flex items-center justify-evenly bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bottom-10 right-10 shadow-lg p-0.5">
        <div className="w-full h-full rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-evenly">
          <Button
            onClick={() => setMode("pan")}
            className={`w-6 h-6 rounded-full ${
              mode === "pan"
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            size="icon"
          >
            <Hand className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setMode("picker")}
            className={`w-6 h-6 rounded-full ${
              mode === "picker"
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            size="icon"
          >
            <Pipette className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setMode("delete")}
            className={`w-6 h-6 rounded-full ${
              mode === "delete"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            size="icon"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              console.log("elements----->", elements);
              setMode("block");
            }}
            className={`w-6 h-6 rounded-full ${
              mode === "block"
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            size="icon"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Map;
