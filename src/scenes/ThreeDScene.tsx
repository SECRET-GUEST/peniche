import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ThreeDScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();

    // Fog
    scene.fog = new THREE.FogExp2(0xff0000, 0.028);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    containerRef.current?.appendChild(renderer.domElement);

    // AmbientLight
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
    scene.add(ambientLight);

    // Red SpotLight
    const redSpotLight = new THREE.SpotLight(0xff0000, 28);
    redSpotLight.position.set(-0.091, 3.333, 1.661);
    redSpotLight.angle = 1.571;
    scene.add(redSpotLight);

    // Violet SpotLight
    const violetSpotLight = new THREE.SpotLight(0x9400D3, 6.94);
    violetSpotLight.position.set(-0.036, -0.194, 0.549);
    violetSpotLight.angle = 1.374;
    violetSpotLight.penumbra = 1.00;
    violetSpotLight.decay = 3;
    scene.add(violetSpotLight);

    const loader = new GLTFLoader();
    loader.load('/zero/assets/models/zero.glb', (gltf: any) => {
      gltf.scene.traverse((child: any) => { 
        if (child instanceof THREE.Mesh && child.name === "Tube") {
          child.material.transparent = true;
          child.material.opacity = 0.44;
        }
      });
      
      scene.add(gltf.scene);
    });
    
    

    camera.position.set(-0.101, 0.178, -10.005);
    camera.rotation.set(
      THREE.MathUtils.degToRad(-173.73),
      THREE.MathUtils.degToRad(-0.65),
      THREE.MathUtils.degToRad(-179.93)
    );
    

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      controls.dispose();
      renderer.dispose();
      if (container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); 

  return <div ref={containerRef} />;
}

export default ThreeDScene;
