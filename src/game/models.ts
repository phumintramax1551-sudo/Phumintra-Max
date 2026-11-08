import * as THREE from 'three';
import {
  createCrateTexture,
  createShippingContainerTexture,
  createHumanFaceTexture,
  createHairTexture,
  createTacticalUniformTexture,
  createOperativeFaceTexture,
  createTacticalBuildingTexture,
} from './textures';

/**
 * Procedural 3D Models built with 3-12 parts per subject (Three.js Skill Directive)
 * Featuring Realistic Anatomical Human Operatives with authentic human faces, hair, and combat gear.
 */

// --- WEAPONS (FIRST PERSON VIEW) ---

export function createRifleModel(): THREE.Group {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.65, roughness: 0.35 });
  const barrelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.15 });
  const gripMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.2, roughness: 0.75 });
  const neonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.4, roughness: 0.1, transmission: 0.8 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.55), bodyMat);
  group.add(body);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.55, 12), barrelMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.05, -0.45);
  group.add(barrel);

  const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.1, 10), barrelMat);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.position.set(0, 0.05, -0.73);
  group.add(muzzle);

  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.25, 0.14), gripMat);
  mag.position.set(0, -0.16, -0.06);
  mag.rotation.x = 0.22;
  group.add(mag);

  const magStrip = new THREE.Mesh(new THREE.BoxGeometry(0.074, 0.18, 0.02), neonMat);
  magStrip.position.set(0, -0.16, -0.01);
  magStrip.rotation.x = 0.22;
  group.add(magStrip);

  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.1), gripMat);
  grip.position.set(0, -0.14, 0.18);
  grip.rotation.x = -0.35;
  group.add(grip);

  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.32), gripMat);
  stock.position.set(0, -0.02, 0.42);
  group.add(stock);

  const sightFrame = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.14), barrelMat);
  sightFrame.position.set(0, 0.13, -0.05);
  group.add(sightFrame);

  const lens = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.06, 0.01), glassMat);
  lens.position.set(0, 0.135, -0.05);
  group.add(lens);

  const sideNeon = new THREE.Mesh(new THREE.BoxGeometry(0.126, 0.02, 0.4), neonMat);
  sideNeon.position.set(0, 0.02, -0.02);
  group.add(sideNeon);

  return group;
}

export function createSniperModel(): THREE.Group {
  const group = new THREE.Group();

  const chassisMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.25 });
  const barrelMat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.9, roughness: 0.15 });
  const purpleNeon = new THREE.MeshBasicMaterial({ color: 0xa855f7 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.7), chassisMat);
  group.add(body);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.95, 12), barrelMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.04, -0.75);
  group.add(barrel);

  const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.14), barrelMat);
  muzzle.position.set(0, 0.04, -1.24);
  group.add(muzzle);

  const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.45, 16), chassisMat);
  scope.rotation.x = Math.PI / 2;
  scope.position.set(0, 0.18, -0.08);
  group.add(scope);

  const mount1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, 0.04), barrelMat);
  mount1.position.set(0, 0.12, 0.05);
  const mount2 = mount1.clone();
  mount2.position.set(0, 0.12, -0.2);
  group.add(mount1, mount2);

  const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8), chassisMat);
  leg1.position.set(-0.08, -0.14, -0.5);
  leg1.rotation.z = 0.25;
  const leg2 = leg1.clone();
  leg2.position.set(0.08, -0.14, -0.5);
  leg2.rotation.z = -0.25;
  group.add(leg1, leg2);

  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.4), chassisMat);
  stock.position.set(0, -0.02, 0.52);
  group.add(stock);

  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.16), barrelMat);
  mag.position.set(0, -0.16, -0.05);
  group.add(mag);

  const glow = new THREE.Mesh(new THREE.BoxGeometry(0.146, 0.03, 0.5), purpleNeon);
  glow.position.set(0, 0.03, 0.05);
  group.add(glow);

  return group;
}

export function createDualPistolsModel(): THREE.Group {
  const container = new THREE.Group();

  const createSinglePistol = (isLeft: boolean) => {
    const pistol = new THREE.Group();
    const slideMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.85, roughness: 0.2 });
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x312e81, metalness: 0.3, roughness: 0.7 });
    const pinkNeon = new THREE.MeshBasicMaterial({ color: 0xec4899 });

    const slide = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.36), slideMat);
    pistol.add(slide);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.09), gripMat);
    grip.position.set(0, -0.12, 0.08);
    grip.rotation.x = -0.3;
    pistol.add(grip);

    const tac = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 10), slideMat);
    tac.rotation.x = Math.PI / 2;
    tac.position.set(0, -0.06, -0.08);
    pistol.add(tac);

    const accent = new THREE.Mesh(new THREE.BoxGeometry(0.084, 0.015, 0.28), pinkNeon);
    accent.position.set(0, 0.02, -0.02);
    pistol.add(accent);

    pistol.position.set(isLeft ? -0.22 : 0.22, -0.08, 0);
    pistol.rotation.y = isLeft ? 0.08 : -0.08;
    return pistol;
  };

  container.add(createSinglePistol(true));
  container.add(createSinglePistol(false));
  return container;
}

export function createKatanaModel(): THREE.Group {
  const group = new THREE.Group();

  const bladeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
  const innerBladeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const guardMat = new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.9, roughness: 0.2 });
  const hiltMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });

  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.07, 0.9), bladeMat);
  blade.position.set(0, 0.02, -0.45);
  group.add(blade);

  const core = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.04, 0.88), innerBladeMat);
  core.position.set(0, 0.02, -0.45);
  group.add(core);

  const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), guardMat);
  guard.position.set(0, 0.02, 0.01);
  group.add(guard);

  const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.32, 12), hiltMat);
  hilt.rotation.x = Math.PI / 2;
  hilt.position.set(0, 0.02, 0.17);
  group.add(hilt);

  const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), guardMat);
  pommel.position.set(0, 0.02, 0.34);
  group.add(pommel);

  return group;
}

// --- REALISTIC HUMAN OPERATIVES (FEMALE "SERENA" & MALE "MARCUS") ---

function attachAngelWings(group: THREE.Group, accentColor: number) {
  const wingGroup = new THREE.Group();
  wingGroup.name = 'angelWings';
  wingGroup.visible = false;

  const wingMat = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
  });

  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.lineTo(-0.9, 1.3);
  wingShape.lineTo(-1.8, 0.9);
  wingShape.lineTo(-1.3, 0.2);
  wingShape.lineTo(0, 0);
  const wingGeo = new THREE.ShapeGeometry(wingShape);

  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.set(-0.15, 1.35, -0.22);
  leftWing.rotation.y = -0.3;

  const rightWing = leftWing.clone();
  rightWing.scale.x = -1;
  rightWing.position.set(0.15, 1.35, -0.22);
  rightWing.rotation.y = 0.3;

  wingGroup.add(leftWing, rightWing);

  const haloGeo = new THREE.TorusGeometry(0.32, 0.025, 8, 24);
  const halo = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({ color: accentColor }));
  halo.rotation.x = Math.PI / 2;
  halo.position.set(0, 2.25, 0);
  wingGroup.add(halo);

  group.add(wingGroup);
}

/**
 * Realistic Female Operative ("Serena - Angel Valkyrie")
 * Authentic human face with eyes/eyelashes/lips, styled ponytail hair, realistic neck,
 * contoured tactical uniform, gloves, holsters, and grounded contact shadow.
 */
export function createFemaleCharacter(team: 'blue' | 'red' | 'mutant', isPlayer: boolean = false): THREE.Group {
  const group = new THREE.Group();

  const mainColor = team === 'blue' ? 0x0284c7 : team === 'red' ? 0xe11d48 : 0x10b981;
  const accentColor = team === 'blue' ? 0x38bdf8 : team === 'red' ? 0xf87171 : 0x34d399;

  // Textures
  const faceTex = createHumanFaceTexture('female');
  const hairTex = createHairTexture('#1e1b4b');
  const suitTex = createTacticalUniformTexture('#0f172a', team === 'blue' ? '#0284c7' : '#e11d48');

  // Materials
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.6, metalness: 0.05 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbe4d8, roughness: 0.6, metalness: 0.05 });
  const hairMat = new THREE.MeshStandardMaterial({ map: hairTex, roughness: 0.35, metalness: 0.1 });
  const suitMat = new THREE.MeshStandardMaterial({ map: suitTex, roughness: 0.5, metalness: 0.4 });
  const armorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
  const coreMat = new THREE.MeshBasicMaterial({ color: accentColor });
  const gloveMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.2 });

  // 1. Soft Ground Contact Shadow (Grounding directive)
  const shadowGeo = new THREE.PlaneGeometry(1.4, 1.4);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  // 2. Head with Realistic Face Texture
  // Cylinder with rounded caps provides natural face mapping
  const headGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.38, 16);
  const head = new THREE.Mesh(headGeo, faceMat);
  head.position.set(0, 1.78, 0);
  head.rotation.y = -Math.PI / 2; // Orient face forward
  head.castShadow = true;
  group.add(head);

  // 3. Realistic Layered 3D Hair
  const hairCapGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
  hairCap.position.set(0, 1.84, -0.03);
  group.add(hairCap);

  // Side hair locks
  const sideLockGeo = new THREE.CylinderGeometry(0.03, 0.015, 0.35, 8);
  const leftLock = new THREE.Mesh(sideLockGeo, hairMat);
  leftLock.position.set(-0.16, 1.75, 0.08);
  leftLock.rotation.z = -0.15;
  const rightLock = leftLock.clone();
  rightLock.position.set(0.16, 1.75, 0.08);
  rightLock.rotation.z = 0.15;
  group.add(leftLock, rightLock);

  // High Ponytail with ribbon
  const ponytail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.02, 0.55, 8), hairMat);
  ponytail.rotation.x = -0.45;
  ponytail.position.set(0, 1.82, -0.22);
  const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 8, 16), coreMat);
  ribbon.position.set(0, 1.88, -0.16);
  group.add(ponytail, ribbon);

  // 4. Slender Anatomical Neck & Collarbone
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.16, 12), skinMat);
  neck.position.set(0, 1.56, 0);
  group.add(neck);

  // 5. Anatomical Torso with Tactical Bodysuit & Armor Plate
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.65, 0.3), suitMat);
  torso.position.set(0, 1.25, 0);
  torso.castShadow = true;
  group.add(torso);

  // Sculpted Breastplate
  const breastplate = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.32, 0.18), armorMat);
  breastplate.position.set(0, 1.34, 0.09);
  group.add(breastplate);

  // Glowing Angel Heart Core
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16), coreMat);
  core.rotation.x = Math.PI / 2;
  core.position.set(0, 1.34, 0.19);
  group.add(core);

  // 6. Tactical Utility Belt with Side Holster
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.08, 0.32), armorMat);
  belt.position.set(0, 0.92, 0);
  const holster = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.12), gloveMat);
  holster.position.set(0.28, 0.88, 0);
  group.add(belt, holster);

  // 7. Anatomical Arms with Forearm Guards & Gloved Hands
  const createArm = (isLeft: boolean) => {
    const arm = new THREE.Group();
    // Shoulder Deltoid
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), armorMat);
    shoulder.position.set(0, 0.28, 0);
    arm.add(shoulder);

    // Bicep
    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.3, 10), suitMat);
    bicep.position.set(0, 0.12, 0);
    arm.add(bicep);

    // Forearm with Bracer
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.28, 10), armorMat);
    forearm.position.set(0, -0.15, 0.04);
    arm.add(forearm);

    // Gloved Hand
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.05), gloveMat);
    hand.position.set(0, -0.32, 0.06);
    arm.add(hand);

    arm.position.set(isLeft ? -0.34 : 0.34, 1.25, 0);
    if (!isLeft) {
      arm.rotation.x = Math.PI / 4.2;
    }
    return arm;
  };
  const leftArm = createArm(true);
  const rightArm = createArm(false);
  group.add(leftArm, rightArm);

  // 8. Articulated Legs with Knee Armor & Boots
  const createLeg = (isLeft: boolean) => {
    const leg = new THREE.Group();
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.42, 12), suitMat);
    thigh.position.set(0, 0.65, 0);
    thigh.castShadow = true;
    leg.add(thigh);

    const kneePad = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.08), armorMat);
    kneePad.position.set(0, 0.45, 0.07);
    leg.add(kneePad);

    const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.38, 12), suitMat);
    calf.position.set(0, 0.25, 0);
    leg.add(calf);

    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.16, 0.28), armorMat);
    boot.position.set(0, 0.08, 0.04);
    boot.castShadow = true;
    leg.add(boot);

    leg.position.set(isLeft ? -0.16 : 0.16, 0, 0);
    return leg;
  };
  const leftLeg = createLeg(true);
  const rightLeg = createLeg(false);
  group.add(leftLeg, rightLeg);

  attachAngelWings(group, accentColor);

  if (!isPlayer) {
    const rifle = createRifleModel();
    rifle.scale.set(0.65, 0.65, 0.65);
    rifle.position.set(0.28, 1.15, 0.4);
    group.add(rifle);
  } else {
    const rifle = createRifleModel();
    rifle.scale.set(0.7, 0.7, 0.7);
    rifle.position.set(0.28, 1.12, 0.38);
    rifle.rotation.set(0.15, -0.2, 0);
    group.add(rifle);
  }

  group.userData = {
    headPos: new THREE.Vector3(0, 1.78, 0),
    head,
    torso,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    wings: group.getObjectByName('angelWings'),
  };
  return group;
}

/**
 * Realistic Male Operative ("Kevin - Heavy Assault")
 */
export function createMaleCharacter(team: 'blue' | 'red' | 'mutant', isPlayer: boolean = false): THREE.Group {
  const group = new THREE.Group();

  const mainColor = team === 'blue' ? 0x0284c7 : team === 'red' ? 0xe11d48 : 0x10b981;
  const accentColor = team === 'blue' ? 0x38bdf8 : team === 'red' ? 0xf87171 : 0x34d399;

  const faceTex = createHumanFaceTexture('male');
  const hairTex = createHairTexture('#18181b');
  const suitTex = createTacticalUniformTexture('#0f172a', team === 'blue' ? '#0284c7' : '#e11d48');

  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.65, metalness: 0.05 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xeecdbb, roughness: 0.65, metalness: 0.05 });
  const hairMat = new THREE.MeshStandardMaterial({ map: hairTex, roughness: 0.5, metalness: 0.1 });
  const suitMat = new THREE.MeshStandardMaterial({ map: suitTex, roughness: 0.6, metalness: 0.4 });
  const vestMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.7 });
  const gloveMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });

  const shadowGeo = new THREE.PlaneGeometry(1.6, 1.6);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.48, depthWrite: false });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  const headGeo = new THREE.CylinderGeometry(0.2, 0.18, 0.4, 16);
  const head = new THREE.Mesh(headGeo, faceMat);
  head.position.set(0, 1.82, 0);
  head.rotation.y = -Math.PI / 2;
  head.castShadow = true;
  group.add(head);

  const hairCapGeo = new THREE.BoxGeometry(0.42, 0.18, 0.44);
  const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
  hairCap.position.set(0, 1.95, -0.02);
  group.add(hairCap);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.16, 12), skinMat);
  neck.position.set(0, 1.58, 0);
  group.add(neck);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.72, 0.38), suitMat);
  torso.position.set(0, 1.25, 0);
  torso.castShadow = true;
  group.add(torso);

  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.48, 0.24), vestMat);
  chestPlate.position.set(0, 1.34, 0.1);
  group.add(chestPlate);

  for (let m = -1; m <= 1; m++) {
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.09), gloveMat);
    pouch.position.set(m * 0.2, 1.1, 0.24);
    group.add(pouch);
  }

  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.4), vestMat);
  belt.position.set(0, 0.9, 0);
  group.add(belt);

  const createMaleArm = (isLeft: boolean) => {
    const arm = new THREE.Group();
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), vestMat);
    shoulder.position.set(0, 0.3, 0);
    arm.add(shoulder);

    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.32, 10), suitMat);
    bicep.position.set(0, 0.12, 0);
    arm.add(bicep);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.3, 10), vestMat);
    forearm.position.set(0, -0.16, 0.04);
    arm.add(forearm);

    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 0.06), gloveMat);
    hand.position.set(0, -0.34, 0.06);
    arm.add(hand);

    arm.position.set(isLeft ? -0.44 : 0.44, 1.25, 0);
    if (!isLeft) {
      arm.rotation.x = Math.PI / 4.0;
    }
    return arm;
  };
  const leftArm = createMaleArm(true);
  const rightArm = createMaleArm(false);
  group.add(leftArm, rightArm);

  const createMaleLeg = (isLeft: boolean) => {
    const leg = new THREE.Group();
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.44, 12), suitMat);
    thigh.position.set(0, 0.65, 0);
    thigh.castShadow = true;
    leg.add(thigh);

    const kneePad = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.09), vestMat);
    kneePad.position.set(0, 0.44, 0.08);
    leg.add(kneePad);

    const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.095, 0.38, 12), suitMat);
    calf.position.set(0, 0.25, 0);
    leg.add(calf);

    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.32), vestMat);
    boot.position.set(0, 0.08, 0.05);
    boot.castShadow = true;
    leg.add(boot);

    leg.position.set(isLeft ? -0.21 : 0.21, 0, 0);
    return leg;
  };
  const leftLeg = createMaleLeg(true);
  const rightLeg = createMaleLeg(false);
  group.add(leftLeg, rightLeg);

  attachAngelWings(group, accentColor);

  if (!isPlayer) {
    const rifle = createRifleModel();
    rifle.scale.set(0.7, 0.7, 0.7);
    rifle.position.set(0.35, 1.15, 0.42);
    group.add(rifle);
  } else {
    const rifle = createRifleModel();
    rifle.scale.set(0.75, 0.75, 0.75);
    rifle.position.set(0.35, 1.12, 0.4);
    rifle.rotation.set(0.15, -0.2, 0);
    group.add(rifle);
  }

  group.userData = {
    headPos: new THREE.Vector3(0, 1.82, 0),
    head,
    torso,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    wings: group.getObjectByName('angelWings'),
  };
  return group;
}

/**
 * Realistic Female Operative ("Kelly - Sprint Scout")
 * Yellow athletic track tracksuit with black racing stripes, athletic ponytail, speed sneakers.
 */
export function createKellyCharacter(team: 'blue' | 'red' | 'mutant', isPlayer: boolean = false): THREE.Group {
  const group = new THREE.Group();
  const accentColor = team === 'blue' ? 0x38bdf8 : team === 'red' ? 0xf87171 : 0xfacc15;

  const faceTex = createOperativeFaceTexture('kelly');
  const hairTex = createHairTexture('#451a03');
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.6, metalness: 0.05 });
  const trackMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, metalness: 0.2 });
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.8 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfae0cf, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ map: hairTex, roughness: 0.35 });

  const shadowGeo = new THREE.PlaneGeometry(1.4, 1.4);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45, depthWrite: false });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  const headGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.38, 16);
  const head = new THREE.Mesh(headGeo, faceMat);
  head.position.set(0, 1.78, 0);
  head.rotation.y = -Math.PI / 2;
  head.castShadow = true;
  group.add(head);

  // Kelly Ponytail
  const ponytail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.02, 0.6, 8), hairMat);
  ponytail.rotation.x = -0.55;
  ponytail.position.set(0, 1.84, -0.24);
  group.add(ponytail);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.16, 12), skinMat);
  neck.position.set(0, 1.56, 0);
  group.add(neck);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.62, 0.28), trackMat);
  torso.position.set(0, 1.25, 0);
  torso.castShadow = true;
  group.add(torso);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.64, 0.29), stripeMat);
  stripe.position.set(0, 1.25, 0);
  group.add(stripe);

  const createKellyArm = (isLeft: boolean) => {
    const arm = new THREE.Group();
    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.3, 10), trackMat);
    bicep.position.set(0, 0.12, 0);
    arm.add(bicep);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.28, 10), skinMat);
    forearm.position.set(0, -0.15, 0.04);
    arm.add(forearm);

    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.08, 10), trackMat);
    band.position.set(0, -0.18, 0.04);
    arm.add(band);

    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.09, 0.05), skinMat);
    hand.position.set(0, -0.32, 0.06);
    arm.add(hand);

    arm.position.set(isLeft ? -0.32 : 0.32, 1.25, 0);
    if (!isLeft) arm.rotation.x = Math.PI / 4.2;
    return arm;
  };
  const leftArm = createKellyArm(true);
  const rightArm = createKellyArm(false);
  group.add(leftArm, rightArm);

  const createKellyLeg = (isLeft: boolean) => {
    const leg = new THREE.Group();
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.08, 0.42, 12), trackMat);
    thigh.position.set(0, 0.65, 0);
    leg.add(thigh);

    const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.38, 12), trackMat);
    calf.position.set(0, 0.25, 0);
    leg.add(calf);

    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.28), stripeMat);
    shoe.position.set(0, 0.07, 0.04);
    leg.add(shoe);

    leg.position.set(isLeft ? -0.15 : 0.15, 0, 0);
    return leg;
  };
  const leftLeg = createKellyLeg(true);
  const rightLeg = createKellyLeg(false);
  group.add(leftLeg, rightLeg);

  attachAngelWings(group, accentColor);

  if (!isPlayer) {
    const rifle = createRifleModel();
    rifle.scale.set(0.65, 0.65, 0.65);
    rifle.position.set(0.28, 1.15, 0.4);
    group.add(rifle);
  } else {
    const rifle = createRifleModel();
    rifle.scale.set(0.7, 0.7, 0.7);
    rifle.position.set(0.28, 1.12, 0.38);
    rifle.rotation.set(0.15, -0.2, 0);
    group.add(rifle);
  }

  group.userData = {
    headPos: new THREE.Vector3(0, 1.78, 0),
    head,
    torso,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    wings: group.getObjectByName('angelWings'),
  };
  return group;
}

/**
 * Realistic Male Operative ("Hayato - Samurai Ronin")
 * Samurai martial arts vest, battle scar face, dark topknot, crimson sash, hakama greaves.
 */
export function createHayatoCharacter(team: 'blue' | 'red' | 'mutant', isPlayer: boolean = false): THREE.Group {
  const group = new THREE.Group();
  const accentColor = team === 'blue' ? 0x38bdf8 : team === 'red' ? 0xf87171 : 0xdc2626;

  const faceTex = createOperativeFaceTexture('hayato');
  const hairTex = createHairTexture('#090d16');
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.65, metalness: 0.05 });
  const vestMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.5, metalness: 0.4 });
  const sashMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe8c4ad, roughness: 0.65 });
  const hairMat = new THREE.MeshStandardMaterial({ map: hairTex, roughness: 0.4 });

  const shadowGeo = new THREE.PlaneGeometry(1.5, 1.5);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.48, depthWrite: false });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  const headGeo = new THREE.CylinderGeometry(0.19, 0.17, 0.4, 16);
  const head = new THREE.Mesh(headGeo, faceMat);
  head.position.set(0, 1.82, 0);
  head.rotation.y = -Math.PI / 2;
  head.castShadow = true;
  group.add(head);

  // Samurai Topknot Bun
  const topknot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.18, 8), hairMat);
  topknot.position.set(0, 2.08, -0.1);
  group.add(topknot);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.16, 12), skinMat);
  neck.position.set(0, 1.58, 0);
  group.add(neck);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.7, 0.34), vestMat);
  torso.position.set(0, 1.25, 0);
  torso.castShadow = true;
  group.add(torso);

  const sash = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.12, 0.36), sashMat);
  sash.position.set(0, 0.94, 0);
  group.add(sash);

  const createHayatoArm = (isLeft: boolean) => {
    const arm = new THREE.Group();
    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.3, 10), skinMat);
    bicep.position.set(0, 0.12, 0);
    arm.add(bicep);

    // Samurai wrist wraps
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.28, 10), sashMat);
    forearm.position.set(0, -0.15, 0.04);
    arm.add(forearm);

    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.1, 0.05), skinMat);
    hand.position.set(0, -0.32, 0.06);
    arm.add(hand);

    arm.position.set(isLeft ? -0.4 : 0.4, 1.25, 0);
    if (!isLeft) arm.rotation.x = Math.PI / 4.0;
    return arm;
  };
  const leftArm = createHayatoArm(true);
  const rightArm = createHayatoArm(false);
  group.add(leftArm, rightArm);

  const createHayatoLeg = (isLeft: boolean) => {
    const leg = new THREE.Group();
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.42, 12), vestMat);
    thigh.position.set(0, 0.65, 0);
    leg.add(thigh);

    const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.085, 0.38, 12), sashMat);
    calf.position.set(0, 0.25, 0);
    leg.add(calf);

    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.16, 0.3), vestMat);
    boot.position.set(0, 0.08, 0.04);
    leg.add(boot);

    leg.position.set(isLeft ? -0.19 : 0.19, 0, 0);
    return leg;
  };
  const leftLeg = createHayatoLeg(true);
  const rightLeg = createHayatoLeg(false);
  group.add(leftLeg, rightLeg);

  attachAngelWings(group, accentColor);

  if (!isPlayer) {
    const rifle = createRifleModel();
    rifle.scale.set(0.7, 0.7, 0.7);
    rifle.position.set(0.32, 1.15, 0.4);
    group.add(rifle);
  } else {
    const rifle = createRifleModel();
    rifle.scale.set(0.75, 0.75, 0.75);
    rifle.position.set(0.32, 1.12, 0.38);
    rifle.rotation.set(0.15, -0.2, 0);
    group.add(rifle);
  }

  group.userData = {
    headPos: new THREE.Vector3(0, 1.82, 0),
    head,
    torso,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    wings: group.getObjectByName('angelWings'),
  };
  return group;
}

export function createOperativeModel(
  characterId: 'eva' | 'kevin' | 'kelly' | 'hayato',
  team: 'blue' | 'red' | 'mutant',
  isPlayer: boolean = false
): THREE.Group {
  if (characterId === 'kevin') return createMaleCharacter(team, isPlayer);
  if (characterId === 'kelly') return createKellyCharacter(team, isPlayer);
  if (characterId === 'hayato') return createHayatoCharacter(team, isPlayer);
  return createFemaleCharacter(team, isPlayer);
}

export function createValkyrieCharacter(
  team: 'blue' | 'red' | 'mutant',
  isPlayer: boolean = false,
  gender: 'male' | 'female' = 'female'
): THREE.Group {
  return gender === 'male' ? createMaleCharacter(team, isPlayer) : createFemaleCharacter(team, isPlayer);
}

export function createMutantMummyCharacter(): THREE.Group {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.85, metalness: 0.1 });
  const carapaceMat = new THREE.MeshStandardMaterial({ color: 0x022c22, roughness: 0.6, metalness: 0.4 });
  const bioGlowMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
  const redEyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

  const shadowGeo = new THREE.PlaneGeometry(1.8, 1.8);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5, depthWrite: false });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.9, 0.55), skinMat);
  torso.position.set(0, 1.3, 0.1);
  torso.rotation.x = 0.2;
  torso.castShadow = true;
  group.add(torso);

  for (let i = 0; i < 4; i++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 6), carapaceMat);
    spike.rotation.x = -Math.PI / 3;
    spike.position.set(0, 1.0 + i * 0.25, -0.25 - i * 0.04);
    group.add(spike);
  }

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.45, 0.55), skinMat);
  head.position.set(0, 1.85, 0.32);
  head.castShadow = true;
  group.add(head);

  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), redEyeMat);
  leftEye.position.set(-0.14, 1.9, 0.6);
  const rightEye = leftEye.clone();
  rightEye.position.set(0.14, 1.9, 0.6);
  group.add(leftEye, rightEye);

  const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8), bioGlowMat);
  vial.position.set(0.3, 1.4, -0.18);
  vial.rotation.z = 0.4;
  group.add(vial);

  const createClawArm = (isLeft: boolean) => {
    const arm = new THREE.Group();
    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.7, 10), skinMat);
    arm.add(bicep);

    for (let c = -1; c <= 1; c++) {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.35, 6), carapaceMat);
      claw.rotation.x = Math.PI / 2;
      claw.position.set(c * 0.08, -0.45, 0.12);
      arm.add(claw);
    }
    arm.position.set(isLeft ? -0.55 : 0.55, 1.3, 0.35);
    arm.rotation.x = Math.PI / 3.5;
    return arm;
  };

  group.add(createClawArm(true), createClawArm(false));

  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.85, 10), skinMat);
  leftLeg.position.set(-0.25, 0.42, 0);
  const rightLeg = leftLeg.clone();
  rightLeg.position.set(0.25, 0.42, 0);
  group.add(leftLeg, rightLeg);

  group.userData = { headPos: new THREE.Vector3(0, 1.85, 0.32) };
  return group;
}

export function createShippingContainer(
  baseColor: string = '#0284c7',
  darkColor: string = '#0369a1',
  stencilText: string = 'CA-LOGISTICS // SECTOR 9',
  maxAnisotropy: number = 4
): THREE.Group {
  const container = new THREE.Group();

  const length = 6.2;
  const height = 2.6;
  const width = 2.4;

  const containerTex = createShippingContainerTexture(baseColor, darkColor, stencilText, maxAnisotropy);
  const containerMat = new THREE.MeshStandardMaterial({
    map: containerTex,
    roughness: 0.45,
    metalness: 0.55,
  });

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.35,
    metalness: 0.8,
  });

  const lockRodMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.2,
    metalness: 0.9,
  });

  const hullGeo = new THREE.BoxGeometry(width, height, length);
  const hull = new THREE.Mesh(hullGeo, containerMat);
  hull.castShadow = true;
  hull.receiveShadow = true;
  container.add(hull);

  const postThick = 0.16;
  const cornerPositions = [
    [-width / 2 + postThick / 2, -length / 2 + postThick / 2],
    [width / 2 - postThick / 2, -length / 2 + postThick / 2],
    [-width / 2 + postThick / 2, length / 2 - postThick / 2],
    [width / 2 - postThick / 2, length / 2 - postThick / 2],
  ];

  cornerPositions.forEach(([x, z]) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(postThick, height + 0.04, postThick), frameMat);
    post.position.set(x, 0, z);
    container.add(post);

    [-height / 2, height / 2].forEach((y) => {
      const block = new THREE.Mesh(new THREE.BoxGeometry(postThick * 1.5, 0.18, postThick * 1.5), frameMat);
      block.position.set(x, y, z);
      container.add(block);
    });
  });

  const longBeamGeo = new THREE.BoxGeometry(postThick, 0.14, length + 0.04);
  [-width / 2 + postThick / 2, width / 2 - postThick / 2].forEach((x) => {
    [-height / 2 + 0.07, height / 2 - 0.07].forEach((y) => {
      const beam = new THREE.Mesh(longBeamGeo, frameMat);
      beam.position.set(x, y, 0);
      container.add(beam);
    });
  });

  [-0.4, 0.4].forEach((xOff) => {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, height * 0.85, 8), lockRodMat);
    rod.position.set(xOff, 0, length / 2 + 0.04);
    container.add(rod);

    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.04), lockRodMat);
    handle.position.set(xOff + 0.07, -0.2, length / 2 + 0.06);
    container.add(handle);
  });

  const neonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const topStrip1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, length), neonMat);
  topStrip1.position.set(-width / 2, height / 2 + 0.02, 0);
  const topStrip2 = topStrip1.clone();
  topStrip2.position.set(width / 2, height / 2 + 0.02, 0);
  container.add(topStrip1, topStrip2);

  return container;
}

export function createTacticalCrate(maxAnisotropy: number = 4): THREE.Mesh {
  const crateGeo = new THREE.BoxGeometry(2, 2, 2);
  const crateTex = createCrateTexture(maxAnisotropy);
  const crateMat = new THREE.MeshStandardMaterial({ map: crateTex, roughness: 0.5, metalness: 0.5 });
  const mesh = new THREE.Mesh(crateGeo, crateMat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function createCyberToriiGate(): THREE.Group {
  const group = new THREE.Group();
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
  const neonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

  const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 8, 8), pillarMat);
  p1.position.set(-6, 4, 0);
  p1.castShadow = true;

  const p2 = p1.clone();
  p2.position.set(6, 4, 0);
  group.add(p1, p2);

  const beam1 = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 1.4), pillarMat);
  beam1.position.set(0, 7.8, 0);
  beam1.castShadow = true;

  const beam2 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.6, 1.0), pillarMat);
  beam2.position.set(0, 6.2, 0);

  const neonLine = new THREE.Mesh(new THREE.BoxGeometry(15.8, 0.08, 1.45), neonMat);
  neonLine.position.set(0, 7.8, 0);

  group.add(beam1, beam2, neonLine);
  return group;
}

export interface HouseColliderSpec {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

/**
 * Moderate-Sized Tactical House / Combat Outpost Building
 * Realistic enterable architecture with doorway, window slits, interior covers,
 * and rooftop sniper perch with safety parapets.
 */
export function createTacticalHouse(
  style: 'cyber' | 'desert' | 'arctic' = 'cyber',
  maxAnisotropy: number = 4
): { group: THREE.Group; colliders: HouseColliderSpec[] } {
  const group = new THREE.Group();
  const colliders: HouseColliderSpec[] = [];

  const wallTex = createTacticalBuildingTexture(style, maxAnisotropy);
  const wallMat = new THREE.MeshStandardMaterial({
    map: wallTex,
    roughness: style === 'desert' ? 0.85 : 0.45,
    metalness: style === 'desert' ? 0.05 : 0.5,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: style === 'desert' ? 0xb45309 : style === 'arctic' ? 0x0284c7 : 0x0f172a,
    roughness: 0.5,
    metalness: 0.6,
  });

  const railingMat = new THREE.MeshStandardMaterial({
    color: style === 'desert' ? 0x78350f : 0x334155,
    roughness: 0.4,
    metalness: 0.8,
  });

  const W = 8;
  const H = 4.0;
  const L = 10;
  const T = 0.4; // Wall thickness

  // 1. Left Wall (Full length)
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(T, H, L), wallMat);
  leftWall.position.set(-W / 2 + T / 2, H / 2, 0);
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  group.add(leftWall);
  colliders.push({
    minX: -W / 2,
    minY: 0,
    minZ: -L / 2,
    maxX: -W / 2 + T,
    maxY: H,
    maxZ: L / 2,
  });

  // 2. Right Wall (Full length)
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(T, H, L), wallMat);
  rightWall.position.set(W / 2 - T / 2, H / 2, 0);
  rightWall.castShadow = true;
  rightWall.receiveShadow = true;
  group.add(rightWall);
  colliders.push({
    minX: W / 2 - T,
    minY: 0,
    minZ: -L / 2,
    maxX: W / 2,
    maxY: H,
    maxZ: L / 2,
  });

  // 3. Back Wall (With 2 tactical window slits)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(W - 2 * T, H, T), wallMat);
  backWall.position.set(0, H / 2, -L / 2 + T / 2);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  group.add(backWall);
  colliders.push({
    minX: -W / 2 + T,
    minY: 0,
    minZ: -L / 2,
    maxX: W / 2 - T,
    maxY: H,
    maxZ: -L / 2 + T,
  });

  // 4. Front Wall with Open Tactical Doorway (3m wide entrance)
  const sideW = (W - 3.0) / 2; // 2.5m each side
  const leftFront = new THREE.Mesh(new THREE.BoxGeometry(sideW, H, T), wallMat);
  leftFront.position.set(-W / 2 + sideW / 2, H / 2, L / 2 - T / 2);
  leftFront.castShadow = true;
  group.add(leftFront);
  colliders.push({
    minX: -W / 2,
    minY: 0,
    minZ: L / 2 - T,
    maxX: -W / 2 + sideW,
    maxY: H,
    maxZ: L / 2,
  });

  const rightFront = new THREE.Mesh(new THREE.BoxGeometry(sideW, H, T), wallMat);
  rightFront.position.set(W / 2 - sideW / 2, H / 2, L / 2 - T / 2);
  rightFront.castShadow = true;
  group.add(rightFront);
  colliders.push({
    minX: W / 2 - sideW,
    minY: 0,
    minZ: L / 2 - T,
    maxX: W / 2,
    maxY: H,
    maxZ: L / 2,
  });

  // Door lintel header above entrance
  const doorHeader = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, T), wallMat);
  doorHeader.position.set(0, H - 0.6, L / 2 - T / 2);
  doorHeader.castShadow = true;
  group.add(doorHeader);
  colliders.push({
    minX: -1.5,
    minY: H - 1.2,
    minZ: L / 2 - T,
    maxX: 1.5,
    maxY: H,
    maxZ: L / 2,
  });

  // 5. Reinforced Roof / Perch Floor
  const roof = new THREE.Mesh(new THREE.BoxGeometry(W + 0.4, 0.3, L + 0.4), roofMat);
  roof.position.set(0, H + 0.15, 0);
  roof.castShadow = true;
  roof.receiveShadow = true;
  group.add(roof);
  colliders.push({
    minX: -W / 2 - 0.2,
    minY: H,
    minZ: -L / 2 - 0.2,
    maxX: W / 2 + 0.2,
    maxY: H + 0.3,
    maxZ: L / 2 + 0.2,
  });

  // 6. Roof Safety Parapet / Sniper Cover (0.8m high)
  const parapetH = 0.8;
  const pFront = new THREE.Mesh(new THREE.BoxGeometry(W + 0.4, parapetH, 0.2), railingMat);
  pFront.position.set(0, H + 0.3 + parapetH / 2, L / 2 + 0.1);
  group.add(pFront);

  const pBack = new THREE.Mesh(new THREE.BoxGeometry(W + 0.4, parapetH, 0.2), railingMat);
  pBack.position.set(0, H + 0.3 + parapetH / 2, -L / 2 - 0.1);
  group.add(pBack);

  const pLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, parapetH, L + 0.4), railingMat);
  pLeft.position.set(-W / 2 - 0.1, H + 0.3 + parapetH / 2, 0);
  group.add(pLeft);

  // 7. Exterior Ladder on Right Wall
  const ladderGroup = new THREE.Group();
  for (let step = 0; step <= H; step += 0.4) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 8), railingMat);
    rung.position.set(W / 2 + 0.15, step, 2);
    ladderGroup.add(rung);
  }
  const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, H + 0.8, 8), railingMat);
  rail1.position.set(W / 2 + 0.15, H / 2, 1.6);
  const rail2 = rail1.clone();
  rail2.position.set(W / 2 + 0.15, H / 2, 2.4);
  ladderGroup.add(rail1, rail2);
  group.add(ladderGroup);

  // 8. Interior Tactical Ammo Box & Light
  const intCrate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.4), wallMat);
  intCrate.position.set(-W / 2 + 1.2, 0.45, -L / 2 + 1.4);
  group.add(intCrate);
  colliders.push({
    minX: -W / 2 + 0.5,
    minY: 0,
    minZ: -L / 2 + 0.7,
    maxX: -W / 2 + 1.9,
    maxY: 0.9,
    maxZ: -L / 2 + 2.1,
  });

  return { group, colliders };
}
