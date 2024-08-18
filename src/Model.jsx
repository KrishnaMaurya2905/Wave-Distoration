import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useLayoutEffect,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";

const Model = forwardRef(({ modelUrl }, ref) => {
  const { nodes, materials, scene } = useGLTF(modelUrl);
  const {
    viewport: { width, height },
    camera,
  } = useThree();

  const modelRef = useRef();

  // useLayoutEffect(() => {
  //   gsap.to(,{
  //       x:100
  //   })
  // }, []);
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(time) * 0.5;
      modelRef.current.position.x = Math.sin(time) * 0.2;
      // modelRef.current.rotation += [-Math.PI / 2, 1.6, Math.PI / 2]
    }
  });

  useEffect(() => {
    if (materials["Material.001"]) {
      materials["Material.001"].metalness = 1;
      materials["Material.001"].roughness = 0;
    }
  }, [materials]);
  return (
    <group
      ref={modelRef}
      scale={[1, .9, 1]}
      rotation={[-Math.PI / 2, 1.6, Math.PI / 2]}
      position={[, 3, 3]}
      dispose={null}
    >
      <group
        rotation={[
          -Math.PI / 2,
          0,
          modelUrl === "/src/assets/models/Monster_energy-Ultra.glb"
            ? 1.5
            : 2.3,
        ]}
      >
        <mesh
          geometry={nodes.Cylinder_Material001_0.geometry}
          material={materials["Material.001"]}
        />
      </group>
    </group>
  );
});

// useGLTF.preload(model1);
// useGLTF.preload(model2);

export default Model;
