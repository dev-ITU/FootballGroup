import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { useI18n } from "@/shared/i18n/index.jsx";

const SOCCER_PANEL_COORDS = [
  [-1, 1.618, 0],
  [1, 1.618, 0],
  [-1, -1.618, 0],
  [1, -1.618, 0],
  [0, -1, 1.618],
  [0, 1, 1.618],
  [0, -1, -1.618],
  [0, 1, -1.618],
  [1.618, 0, -1],
  [1.618, 0, 1],
  [-1.618, 0, -1],
  [-1.618, 0, 1],
];

const SOCCER_PANELS = SOCCER_PANEL_COORDS.map((coords, index) => {
  const normal = new THREE.Vector3(...coords).normalize();
  const position = normal.clone().multiplyScalar(0.402);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

  return {
    key: index,
    position: position.toArray(),
    quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
  };
});

function PitchMarkings() {
  return (
    <group position={[0, -0.945, 0]}>
	 <mesh rotation={[-Math.PI / 2, 0, 0]}>
	   <planeGeometry args={[5.7, 3.5]} />
	   <meshStandardMaterial color="#11864f" roughness={0.92} />
	 </mesh>
	 <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
	   <ringGeometry args={[0.52, 0.56, 64]} />
	   <meshBasicMaterial color="#ffffff" />
	 </mesh>
	 {[
	   [0, 0.001, 0, 0.06, 0.002, 3.4],
	   [0, 0.001, -1.72, 5.64, 0.002, 0.06],
	   [0, 0.001, 1.72, 5.64, 0.002, 0.06],
	   [-2.82, 0.001, 0, 0.06, 0.002, 3.5],
	   [2.82, 0.001, 0, 0.06, 0.002, 3.5],
	   [-1.82, 0.001, -0.95, 2.0, 0.002, 0.06],
	   [-1.82, 0.001, 0.95, 2.0, 0.002, 0.06],
	   [-2.82, 0.001, 0, 0.06, 0.002, 1.9],
	   [1.82, 0.001, -0.95, 2.0, 0.002, 0.06],
	   [1.82, 0.001, 0.95, 2.0, 0.002, 0.06],
	   [2.82, 0.001, 0, 0.06, 0.002, 1.9],
	 ].map(([x, y, z, width, height, depth], index) => (
	   <mesh key={index} position={[x, y, z]}>
		<boxGeometry args={[width, height, depth]} />
		<meshBasicMaterial color="#ffffff" />
	   </mesh>
	 ))}
    </group>
  );
}

function SoccerBall({ ballRef }) {
  return (
    <group ref={ballRef} position={[2.02, -0.57, 1.32]}>
	 <mesh castShadow>
	   <sphereGeometry args={[0.39, 48, 48]} />
	   <meshStandardMaterial color="#ffffff" roughness={0.62} metalness={0.06} />
	 </mesh>
	 {SOCCER_PANELS.map((panel) => (
	   <mesh
		key={panel.key}
		position={panel.position}
		quaternion={panel.quaternion}
		scale={[1, 1, 1]}
	   >
		<circleGeometry args={[0.115, 5]} />
		<meshStandardMaterial color="#111827" roughness={0.88} metalness={0.08} side={THREE.DoubleSide} />
	   </mesh>
	 ))}
    </group>
  );
}

function StadiumModel() {
  const shellRef = useRef(null);
  const lightsRef = useRef(null);
  const ballRef = useRef(null);
  const ribbonRef = useRef(null);

  useFrame((state, delta) => {
    if (shellRef.current) {
	 shellRef.current.rotation.y += delta * 0.07;
	 shellRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.38) * 0.04;
    }

    if (lightsRef.current) {
	 lightsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.05;
    }

    if (ballRef.current) {
	 ballRef.current.rotation.x += delta * 0.7;
	 ballRef.current.rotation.y += delta * 0.45;
	 ballRef.current.position.y = -0.57 + Math.sin(state.clock.elapsedTime * 1.4) * 0.018;
    }

    if (ribbonRef.current) {
	 ribbonRef.current.rotation.y -= delta * 0.1;
    }
  });

  return (
    <group position={[0, -0.08, 0]}>
	 <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -1.12, 0]}>
	   <circleGeometry args={[6.85, 120]} />
	   <meshStandardMaterial color="#dbe7f2" metalness={0.1} roughness={0.96} />
	 </mesh>

	 <group ref={shellRef}>
	   <mesh castShadow receiveShadow position={[0, -0.7, 0]}>
		<cylinderGeometry args={[5.3, 6.2, 1.02, 88, 1, true]} />
		<meshStandardMaterial color="#f3f8fc" metalness={0.2} roughness={0.72} side={THREE.DoubleSide} />
	   </mesh>
	   <mesh castShadow receiveShadow position={[0, -0.06, 0]}>
		<cylinderGeometry args={[4.7, 5.2, 0.78, 88, 1, true]} />
		<meshStandardMaterial color="#ecf4fb" metalness={0.18} roughness={0.76} side={THREE.DoubleSide} />
	   </mesh>
	   <mesh castShadow position={[0, -0.36, 0]}>
		<torusGeometry args={[4.34, 0.26, 32, 120]} />
		<meshStandardMaterial color="#0b4fae" metalness={0.54} roughness={0.28} />
	   </mesh>
	   <mesh castShadow position={[0, 0.62, 0]}>
		<torusGeometry args={[4.6, 0.12, 24, 120]} />
		<meshStandardMaterial color="#dfe9f4" metalness={0.65} roughness={0.22} />
	   </mesh>
	   <mesh ref={ribbonRef} castShadow position={[0, -0.02, 0]}>
		<torusGeometry args={[4.82, 0.08, 16, 144]} />
		<meshStandardMaterial color="#2ea4ff" emissive="#2ea4ff" emissiveIntensity={0.82} roughness={0.2} />
	   </mesh>
	   <PitchMarkings />
	   <mesh position={[0, 0.52, -3.96]}>
		<boxGeometry args={[3.2, 0.9, 0.18]} />
		<meshStandardMaterial color="#092a56" emissive="#124fbb" emissiveIntensity={0.5} />
	   </mesh>
	   <group ref={lightsRef}>
		{[
		  [-4.28, 1.45, -2.4],
		  [4.28, 1.45, -2.4],
		  [-4.28, 1.45, 2.4],
		  [4.28, 1.45, 2.4],
		].map(([x, y, z], index) => (
		  <group key={index} position={[x, y, z]}>
		    <mesh>
			 <boxGeometry args={[0.12, 1.8, 0.12]} />
			 <meshStandardMaterial color="#d9e8f6" metalness={0.55} roughness={0.25} />
		    </mesh>
		    <mesh position={[0, 0.92, 0]}>
			 <boxGeometry args={[1.2, 0.16, 0.16]} />
			 <meshStandardMaterial color="#d9e8f6" metalness={0.6} roughness={0.24} />
		    </mesh>
		    <mesh position={[0, 0.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
			 <cylinderGeometry args={[0.04, 0.44, 1.5, 18, 1, true]} />
			 <meshBasicMaterial color="#73cfff" transparent opacity={0.12} side={THREE.DoubleSide} />
		    </mesh>
		  </group>
		))}
	   </group>
	 </group>

	 <SoccerBall ballRef={ballRef} />
	 <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[2.02, -1.01, 1.32]}>
	   <circleGeometry args={[0.56, 32]} />
	   <meshBasicMaterial color="#001737" transparent opacity={0.12} />
	 </mesh>
    </group>
  );
}

export default function StadiumScene({ clubName, stadiumName, featuredMatch = null }) {
  const { t } = useI18n();
  const resolvedClubName = clubName || t("brand.defaultShortName");
  const resolvedStadiumName = stadiumName || t("brand.defaultStadium");
  const versusLabel = t("common.versus");
  const featuredDateLabel = featuredMatch?.fullDateLabel || featuredMatch?.date_label || "";
  const featuredTimeLabel = featuredMatch?.timeLabel || featuredMatch?.time_label || "";

  return (
    <div className="stadium-scene">
	 <Canvas camera={{ position: [0, 2.95, 9.4], fov: 32 }} shadows dpr={[1, 1.35]}>
	   <color attach="background" args={["#edf4fb"]} />
	   <fog attach="fog" args={["#edf4fb", 8, 18]} />
	   <ambientLight intensity={1.25} />
	   <directionalLight
		castShadow
		intensity={2.5}
		position={[4.5, 8, 4]}
		shadow-mapSize-width={2048}
		shadow-mapSize-height={2048}
	   />
	   <pointLight position={[-4, 3, -2]} intensity={10} color="#64b5ff" />
	   <pointLight position={[4, 3, 2]} intensity={7} color="#ffffff" />
	   <spotLight position={[0, 6, 2]} angle={0.48} penumbra={0.9} intensity={16} color="#f8fcff" />
	   <StadiumModel />
	 </Canvas>
	 <div className="stadium-scene__hud">
	   <span>{t("stadium.matchday")}</span>
	   <strong>{resolvedStadiumName}</strong>
	   <p>{featuredMatch ? `${resolvedClubName} ${versusLabel} ${featuredMatch.opponent}` : t("stadium.homeArena")}</p>
	 </div>
	 <div className="stadium-scene__scoreboard">
	   <span>{featuredMatch?.competition || t("stadium.homeMatch")}</span>
	   <strong>{featuredMatch ? `${featuredDateLabel} · ${featuredTimeLabel}` : resolvedClubName}</strong>
	 </div>
	 <div className="stadium-scene__footer">
	   <span>{resolvedClubName}</span>
	   <strong>{featuredMatch ? `${resolvedClubName} ${versusLabel} ${featuredMatch.opponent}` : resolvedStadiumName}</strong>
	 </div>
    </div>
  );
}
