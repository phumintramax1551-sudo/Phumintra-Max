import * as THREE from 'three';
import {
  createCyberGridTexture,
  createWallTileTexture,
  createTargetTexture,
  createDesertSandTexture,
  createIceSnowTexture,
} from './textures';
import {
  createTacticalCrate,
  createShippingContainer,
  createTacticalHouse,
  HouseColliderSpec,
} from './models';
import { MapType } from './types';

export interface BoundingBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export interface MapData {
  scene: THREE.Scene;
  colliders: BoundingBox[];
  spawnPoints: {
    blue: THREE.Vector3[];
    red: THREE.Vector3[];
    neutral: THREE.Vector3[];
  };
  targets: THREE.Mesh[];
}

export function buildTacticalMap(
  scene: THREE.Scene,
  mapType: MapType = 'classic',
  maxAnisotropy: number = 4
): MapData {
  const colliders: BoundingBox[] = [];
  const targets: THREE.Mesh[] = [];

  const addCollider = (minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number) => {
    colliders.push({
      min: new THREE.Vector3(minX, minY, minZ),
      max: new THREE.Vector3(maxX, maxY, maxZ),
    });
  };

  const addHouseWithColliders = (
    houseGroup: THREE.Group,
    houseColliders: HouseColliderSpec[],
    posX: number,
    posZ: number,
    rotY: number = 0
  ) => {
    houseGroup.position.set(posX, 0, posZ);
    houseGroup.rotation.y = rotY;
    scene.add(houseGroup);

    // Transform local colliders to world space with rotation support
    const cosA = Math.cos(rotY);
    const sinA = Math.sin(rotY);

    houseColliders.forEach((c) => {
      // 4 corners of the box
      const corners = [
        { x: c.minX, z: c.minZ },
        { x: c.maxX, z: c.minZ },
        { x: c.minX, z: c.maxZ },
        { x: c.maxX, z: c.maxZ },
      ];

      const worldCorners = corners.map((pt) => ({
        x: posX + (pt.x * cosA - pt.z * sinA),
        z: posZ + (pt.x * sinA + pt.z * cosA),
      }));

      const minX = Math.min(...worldCorners.map((pt) => pt.x));
      const maxX = Math.max(...worldCorners.map((pt) => pt.x));
      const minZ = Math.min(...worldCorners.map((pt) => pt.z));
      const maxZ = Math.max(...worldCorners.map((pt) => pt.z));

      addCollider(minX, c.minY, minZ, maxX, c.maxY, maxZ);
    });
  };

  // 1. Arena Floor (80m x 80m)
  let floorTex: THREE.Texture;
  let floorColor = 0xffffff;
  let roughness = 0.55;
  let metalness = 0.45;

  if (mapType === 'desert') {
    floorTex = createDesertSandTexture(maxAnisotropy);
    floorTex.repeat.set(12, 12);
    roughness = 0.9;
    metalness = 0.05;
  } else if (mapType === 'ice') {
    floorTex = createIceSnowTexture(maxAnisotropy);
    floorTex.repeat.set(14, 14);
    roughness = 0.25;
    metalness = 0.6;
  } else {
    floorTex = createCyberGridTexture(maxAnisotropy);
    floorTex.repeat.set(16, 16);
  }

  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness,
    metalness,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(84, 84), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // 2. Outer Perimeter Walls (4 walls)
  const wallTex = createWallTileTexture(maxAnisotropy);
  wallTex.repeat.set(10, 2);
  const wallMat = new THREE.MeshStandardMaterial({
    map: wallTex,
    color: mapType === 'desert' ? 0xd97706 : mapType === 'ice' ? 0x93c5fd : 0xffffff,
    roughness: 0.5,
    metalness: 0.5,
  });

  const wallHeight = 7;
  const halfArena = 42;

  // North, South, East, West Walls
  const nWall = new THREE.Mesh(new THREE.BoxGeometry(84, wallHeight, 2), wallMat);
  nWall.position.set(0, wallHeight / 2, -halfArena);
  scene.add(nWall);
  addCollider(-42, 0, -halfArena - 1, 42, wallHeight, -halfArena + 1);

  const sWall = new THREE.Mesh(new THREE.BoxGeometry(84, wallHeight, 2), wallMat);
  sWall.position.set(0, wallHeight / 2, halfArena);
  scene.add(sWall);
  addCollider(-42, 0, halfArena - 1, 42, wallHeight, halfArena + 1);

  const eWall = new THREE.Mesh(new THREE.BoxGeometry(2, wallHeight, 84), wallMat);
  eWall.position.set(halfArena, wallHeight / 2, 0);
  scene.add(eWall);
  addCollider(halfArena - 1, 0, -42, halfArena + 1, wallHeight, 42);

  const wWall = new THREE.Mesh(new THREE.BoxGeometry(2, wallHeight, 84), wallMat);
  wWall.position.set(-halfArena, wallHeight / 2, 0);
  scene.add(wWall);
  addCollider(-halfArena - 1, 0, -42, -halfArena + 1, wallHeight, 42);

  // 3. TACTICAL HOUSES (MODERATE SIZED - AS REQUESTED BY USER)
  // House 1: West Tactical Combat House (Enterable with doorway & roof perch)
  const houseStyle = mapType === 'desert' ? 'desert' : mapType === 'ice' ? 'arctic' : 'cyber';
  const house1 = createTacticalHouse(houseStyle, maxAnisotropy);
  addHouseWithColliders(house1.group, house1.colliders, -22, -4, 0);

  // House 2: East Tactical Combat House (Enterable, facing opposite flank)
  const house2 = createTacticalHouse(houseStyle, maxAnisotropy);
  addHouseWithColliders(house2.group, house2.colliders, 22, 4, Math.PI);

  // House 3: Center Mid-Field Outpost Guard Depot (Moderate sized)
  if (mapType === 'classic' || mapType === 'desert') {
    const house3 = createTacticalHouse(houseStyle, maxAnisotropy);
    addHouseWithColliders(house3.group, house3.colliders, 0, -20, Math.PI / 2);
  }

  // 4. CENTRAL PODIUM & HIGHWAY / ELEVATED GROUND
  const centerPlatformMat = new THREE.MeshStandardMaterial({
    color: mapType === 'desert' ? 0x92400e : mapType === 'ice' ? 0x0f172a : 0x1e293b,
    roughness: 0.4,
    metalness: 0.6,
  });

  const p1 = new THREE.Mesh(new THREE.BoxGeometry(16, 1.4, 16), centerPlatformMat);
  p1.position.set(0, 0.7, 0);
  p1.receiveShadow = true;
  p1.castShadow = true;
  scene.add(p1);
  addCollider(-8, 0, -8, 8, 1.4, 8);

  // Hologram beacon spire in center
  const spireGeo = new THREE.OctahedronGeometry(1.2, 0);
  const spireColor = mapType === 'desert' ? 0xf59e0b : mapType === 'ice' ? 0x38bdf8 : 0x00f0ff;
  const spireMat = new THREE.MeshBasicMaterial({ color: spireColor, wireframe: true });
  const spire = new THREE.Mesh(spireGeo, spireMat);
  spire.position.set(0, 4.2, 0);
  scene.add(spire);

  // Access Ramps to Central Platform
  const rampMat = new THREE.MeshStandardMaterial({
    color: mapType === 'desert' ? 0xb45309 : mapType === 'ice' ? 0x334155 : 0x334155,
    roughness: 0.7,
  });
  const rampLength = 5.5;
  const rampWidth = 3.6;
  const rampHeight = 1.4;

  const sRamp = new THREE.Mesh(new THREE.BoxGeometry(rampWidth, 0.4, rampLength), rampMat);
  sRamp.position.set(0, rampHeight / 2, 8 + rampLength / 2);
  sRamp.rotation.x = -Math.atan2(rampHeight, rampLength);
  scene.add(sRamp);

  const nRamp = new THREE.Mesh(new THREE.BoxGeometry(rampWidth, 0.4, rampLength), rampMat);
  nRamp.position.set(0, rampHeight / 2, -8 - rampLength / 2);
  nRamp.rotation.x = Math.atan2(rampHeight, rampLength);
  scene.add(nRamp);

  // 5. SHIPPING CONTAINERS (ตู้คอนเทนเนอร์)
  const containerSpecs = [
    {
      x: 12,
      y: 1.3,
      z: 16,
      rotY: 0,
      baseColor: mapType === 'desert' ? '#d97706' : mapType === 'ice' ? '#0284c7' : '#0284c7',
      darkColor: mapType === 'desert' ? '#b45309' : mapType === 'ice' ? '#0369a1' : '#0369a1',
      label: 'CARGO // SECTOR ALPHA',
    },
    {
      x: -12,
      y: 1.3,
      z: -16,
      rotY: 0,
      baseColor: mapType === 'desert' ? '#92400e' : mapType === 'ice' ? '#38bdf8' : '#d97706',
      darkColor: mapType === 'desert' ? '#78350f' : mapType === 'ice' ? '#0284c7' : '#b45309',
      label: 'HAZARD // MUNITIONS',
    },
    {
      x: 0,
      y: 1.3,
      z: 26,
      rotY: Math.PI / 2,
      baseColor: '#0284c7',
      darkColor: '#075985',
      label: 'BLUE SQUADRON POST',
    },
    {
      x: 0,
      y: 1.3,
      z: -26,
      rotY: Math.PI / 2,
      baseColor: '#dc2626',
      darkColor: '#991b1b',
      label: 'RED SQUADRON POST',
    },
  ];

  containerSpecs.forEach((spec) => {
    const cont = createShippingContainer(spec.baseColor, spec.darkColor, spec.label, maxAnisotropy);
    cont.position.set(spec.x, spec.y, spec.z);
    cont.rotation.y = spec.rotY;
    scene.add(cont);

    const isRotated90 = Math.abs(spec.rotY - Math.PI / 2) < 0.1;
    const halfX = isRotated90 ? 3.15 : 1.25;
    const halfZ = isRotated90 ? 1.25 : 3.15;

    addCollider(
      spec.x - halfX,
      spec.y - 1.3,
      spec.z - halfZ,
      spec.x + halfX,
      spec.y + 1.3,
      spec.z + halfZ
    );
  });

  // 6. Tactical Crates & Cover Boulders
  const cratePositions = [
    { x: -6, y: 1, z: 8 },
    { x: 6, y: 1, z: -8 },
    { x: -14, y: 1, z: 20 },
    { x: 14, y: 1, z: -20 },
    { x: 28, y: 1, z: 18 },
    { x: -28, y: 1, z: -18 },
  ];

  cratePositions.forEach((pos) => {
    const crate = createTacticalCrate(maxAnisotropy);
    crate.position.set(pos.x, pos.y, pos.z);
    scene.add(crate);
    addCollider(pos.x - 1, pos.y - 1, pos.z - 1, pos.x + 1, pos.y + 1, pos.z + 1);
  });

  // Desert Palm Trees or Arctic Ice Crystals
  if (mapType === 'desert') {
    // 4 Palm Trees around the oasis
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });

    const treePositions = [
      { x: -12, z: 12 },
      { x: 12, z: -12 },
      { x: -32, z: 22 },
      { x: 32, z: -22 },
    ];

    treePositions.forEach((tp) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 6, 8), trunkMat);
      trunk.position.set(0, 3, 0);
      tree.add(trunk);

      for (let l = 0; l < 6; l++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 5), leafMat);
        leaf.rotation.x = Math.PI / 2.5;
        leaf.rotation.y = (l / 6) * Math.PI * 2;
        leaf.position.set(0, 6, 0);
        tree.add(leaf);
      }
      tree.position.set(tp.x, 0, tp.z);
      scene.add(tree);
      addCollider(tp.x - 0.6, 0, tp.z - 0.6, tp.x + 0.6, 6, tp.z + 0.6);
    });
  } else if (mapType === 'ice') {
    // Arctic Ice Spikes / Glacial Formations
    const iceMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.15,
      metalness: 0.4,
      transparent: true,
      opacity: 0.88,
    });
    const icePositions = [
      { x: -16, z: 14 },
      { x: 16, z: -14 },
      { x: -30, z: 24 },
      { x: 30, z: -24 },
    ];
    icePositions.forEach((ip) => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(1.8, 6.5, 6), iceMat);
      spike.position.set(ip.x, 3.2, ip.z);
      spike.castShadow = true;
      scene.add(spike);
      addCollider(ip.x - 1.5, 0, ip.z - 1.5, ip.x + 1.5, 6.5, ip.z + 1.5);
    });
  }

  // 7. Training Targets
  const targetTex = createTargetTexture();
  const targetMat = new THREE.MeshBasicMaterial({ map: targetTex });

  const targetPositions = [
    { x: 0, y: 2.2, z: -36 },
    { x: -16, y: 2.2, z: -36 },
    { x: 16, y: 2.2, z: -36 },
  ];

  targetPositions.forEach((tp) => {
    const tMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.08, 24), targetMat);
    tMesh.rotation.x = Math.PI / 2;
    tMesh.position.set(tp.x, tp.y, tp.z);
    tMesh.userData = { isTargetDummy: true, hp: 100, maxHp: 100 };
    scene.add(tMesh);
    targets.push(tMesh);
  });

  // 8. Distant Backdrop (Cyber / Desert dunes / Ice peaks)
  const backdropColor = mapType === 'desert' ? 0x78350f : mapType === 'ice' ? 0x1e293b : 0x050814;
  const skylineMat = new THREE.MeshBasicMaterial({ color: backdropColor });

  for (let b = 0; b < 24; b++) {
    const angle = (b / 24) * Math.PI * 2;
    const dist = 68 + Math.random() * 20;
    const bx = Math.cos(angle) * dist;
    const bz = Math.sin(angle) * dist;
    const bWidth = 12 + Math.random() * 14;
    const bHeight = 22 + Math.random() * 40;
    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(bWidth, bHeight, bWidth), skylineMat);
    bMesh.position.set(bx, bHeight / 2 - 5, bz);
    scene.add(bMesh);
  }

  // 9. Spawn Points
  const spawnPoints = {
    blue: [
      new THREE.Vector3(0, 1.8, 32),
      new THREE.Vector3(-10, 1.8, 30),
      new THREE.Vector3(10, 1.8, 30),
      new THREE.Vector3(-18, 1.8, 34),
      new THREE.Vector3(18, 1.8, 34),
    ],
    red: [
      new THREE.Vector3(0, 1.8, -32),
      new THREE.Vector3(-10, 1.8, -30),
      new THREE.Vector3(10, 1.8, -30),
      new THREE.Vector3(-18, 1.8, -34),
      new THREE.Vector3(18, 1.8, -34),
    ],
    neutral: [
      new THREE.Vector3(0, 2.5, 0),
      new THREE.Vector3(-22, 1.8, 0),
      new THREE.Vector3(22, 1.8, 0),
      new THREE.Vector3(-15, 1.8, 14),
      new THREE.Vector3(15, 1.8, -14),
    ],
  };

  return {
    scene,
    colliders,
    spawnPoints,
    targets,
  };
}

export function buildNeoTempleMap(scene: THREE.Scene, maxAnisotropy: number = 4): MapData {
  return buildTacticalMap(scene, 'classic', maxAnisotropy);
}
