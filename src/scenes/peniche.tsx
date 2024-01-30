/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const Peniche: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scenesVisibility, setScenesVisibility] = useState<boolean[]>([true, true, true, true, true, true, true]);
  const [indicationsVisibility, setIndicationsVisibility] = useState<boolean>(true);

  const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const renderer = useRef<THREE.WebGLRenderer>(new THREE.WebGLRenderer());
  const scene = useRef<THREE.Scene>(new THREE.Scene());

  useEffect(() => {
    const container = containerRef.current;

    scene.current.fog = new THREE.FogExp2(0xff0000, 0.028);

    renderer.current.setSize(window.innerWidth, window.innerHeight);
    container?.appendChild(renderer.current.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
    scene.current.add(ambientLight);

    const redSpotLight = new THREE.SpotLight(0xff0000, 28);
    redSpotLight.position.set(-0.091, 3.333, 1.661);
    redSpotLight.angle = 1.571;
    scene.current.add(redSpotLight);

    const violetSpotLight = new THREE.SpotLight(0x9400D3, 6.94);
    violetSpotLight.position.set(-0.036, -0.194, 0.549);
    violetSpotLight.angle = 1.374;
    violetSpotLight.penumbra = 1.00;
    violetSpotLight.decay = 3;
    scene.current.add(violetSpotLight);

    const mainPenicheScenes = ['bas.glb', 'etage.glb', 'fond.glb', 'murs.glb', 'plafond.glb'];

    mainPenicheScenes.forEach((sceneUrl) => {
      const loader = new GLTFLoader();
      loader.load(`/assets/models/peniche/${sceneUrl}`, (gltf: GLTF) => {
        scene.current.add(gltf.scene);
      });
    });

    const scenes = [
      'scene1.glb',
      'scene2.glb',
      'scene3.glb',
      'scene4.glb',
      'scene5.glb',
      'scene6.glb',
      'scene7.glb',
    ];

    scenes.forEach((sceneUrl) => {
      const loader = new GLTFLoader();
      loader.load(`/assets/models/scenes/${sceneUrl}`, (gltf: GLTF) => {
        scene.current.add(gltf.scene);
      });
    });

    const indicationsLoader = new GLTFLoader();
    indicationsLoader.load('/assets/models/indications.glb', (gltf: GLTF) => {
      scene.current.add(gltf.scene);
    });

    camera.current.position.set(-0.101, 0.178, -10.005);
    camera.current.rotation.set(
      THREE.MathUtils.degToRad(-173.73),
      THREE.MathUtils.degToRad(-0.65),
      THREE.MathUtils.degToRad(-179.93)
    );

    const controls = new OrbitControls(camera.current, renderer.current.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.current.render(scene.current, camera.current);
    };

    animate();

    return () => {
      controls.dispose();
      renderer.current.dispose();
      if (container) {
        container.removeChild(renderer.current.domElement);
      }
    };
  }, [scenesVisibility, indicationsVisibility]);

  const toggleSceneVisibility = (index: number) => {
    setScenesVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  const toggleIndicationsVisibility = () => {
    setIndicationsVisibility((prevVisibility) => !prevVisibility);
  };

  document.addEventListener('mousemove', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera.current);

    const intersects = raycaster.intersectObjects(scene.current.children, true);

    if (intersects.length > 0) {
      console.log('Collision detected with object:', intersects[0].object);
    }
  });

  return (
    <div>
      {scenesVisibility.map((_, index) => (
        <button key={index} onClick={() => toggleSceneVisibility(index)}>
          Toggle Scene {index + 1} Visibility
        </button>
      ))}

      <button onClick={toggleIndicationsVisibility}>Toggle Indications Visibility</button>

      {indicationsVisibility && (
        <div>
          <p>Indications are visible.</p>
        </div>
      )}
    </div>
  );
};

export default Peniche;
