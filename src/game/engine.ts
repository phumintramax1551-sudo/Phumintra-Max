import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  GameMode,
  GameState,
  PlayerStats,
  Team,
  KillEvent,
  DamageNumber,
  MatchScore,
  CharacterGender,
  BotGenderSetting,
  MapType,
  CharacterId,
  EmoteType,
} from './types';
import { WEAPON_REGISTRY } from './weapons';
import { buildTacticalMap, MapData, BoundingBox } from './map';
import { ParticleSystem } from './particles';
import { BotManager } from './bots';
import { soundEngine } from './audio';
import {
  createRifleModel,
  createSniperModel,
  createDualPistolsModel,
  createKatanaModel,
  createOperativeModel,
  createValkyrieCharacter,
} from './models';

export interface EngineCallbacks {
  onStatsUpdate: (stats: PlayerStats) => void;
  onMatchScoreUpdate: (score: MatchScore) => void;
  onKillEvent: (event: KillEvent) => void;
  onAnnouncement: (type: 'first_blood' | 'double_kill' | 'triple_kill' | 'rampage' | 'headshot') => void;
  onHitmarker: (isHeadshot: boolean, damage: number) => void;
  onGameOver: (winner: string, playerStats: PlayerStats) => void;
  onPointerLockChange: (isLocked: boolean) => void;
}

export class GameEngine {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  private container: HTMLElement;
  private callbacks: EngineCallbacks;

  private isSoftwareGl: boolean = false;
  private animFrameId: number = 0;
  private lastTime: number = performance.now();

  // Map & Systems
  private mapData!: MapData;
  private particleSystem!: ParticleSystem;
  private botManager!: BotManager;

  // Game Mode & State
  public mode: GameMode = 'tdm';
  public state: GameState = 'lobby'; // Starts in Lobby (Bullet Angel style)
  public botGenderSetting: BotGenderSetting = 'mixed';
  private matchTimer: number = 300;
  private mutantCountdown: number = 15;
  private mutantRoundActive: boolean = false;
  private blueKills: number = 0;
  private redKills: number = 0;
  private targetKills: number = 30;

  public currentMapType: MapType = 'classic';

  // Player Entity & Stats
  public playerStats: PlayerStats = {
    characterId: 'eva',
    gender: 'female',
    hp: 100,
    maxHp: 100,
    armor: 100,
    maxArmor: 100,
    score: 0,
    kills: 0,
    deaths: 0,
    headshots: 0,
    isDancing: false,
    currentEmote: 'angel_dance',
    danceProgress: 0,
    isMutant: false,
    isArchangel: false,
    isReloading: false,
    reloadProgress: 0,
    activeWeaponIndex: 0,
    currentAmmo: [30, 5, 24, 1],
    reserveAmmo: [120, 25, 96, 1],
    grenadeCount: 2,
    isADS: false,
  };

  // Player Physics & Controls
  public playerPos = new THREE.Vector3(0, 1.8, 25);
  public playerVel = new THREE.Vector3(0, 0, 0);
  public isGrounded: boolean = true;
  private cameraPitch: number = 0;
  private cameraYaw: number = 0;
  private recoilPitch: number = 0;
  private recoilYaw: number = 0;
  public mouseSensitivity: number = 0.0022;
  public baseFov: number = 75;

  private keys: { [key: string]: boolean } = {};
  public isPointerLocked: boolean = false;

  // Viewmodel & Weapon Rigs
  private viewmodelCamera: THREE.PerspectiveCamera;
  private viewmodelScene: THREE.Scene;
  private weaponRig: THREE.Group = new THREE.Group();
  private weaponModels: THREE.Group[] = [];
  private muzzleFlashLight: THREE.PointLight;
  private flashTimer: number = 0;
  private shootCooldown: number = 0;
  private weaponBobTime: number = 0;

  // Third-person model for Lobby & Angel Dance
  private playerThirdPersonMesh!: THREE.Group;
  public lobbyCharRotation: number = 0;

  // Kill streak tracking
  private recentKillsCount: number = 0;
  private lastKillTime: number = 0;

  // Active Grenades
  private activeGrenades: {
    mesh: THREE.Mesh;
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    timer: number;
  }[] = [];

  constructor(container: HTMLElement, callbacks: EngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. Software WebGL Guard (Three.js Skill Directive)
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.autoClear = false;

    container.appendChild(this.renderer.domElement);

    // 3. Main Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060914);
    this.scene.fog = new THREE.FogExp2(0x060914, 0.015);

    this.camera = new THREE.PerspectiveCamera(
      this.baseFov,
      container.clientWidth / container.clientHeight,
      0.1,
      400
    );
    this.camera.rotation.order = 'YXZ';

    // 4. Viewmodel Scene
    this.viewmodelScene = new THREE.Scene();
    this.viewmodelCamera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.01,
      10
    );
    this.viewmodelCamera.rotation.order = 'YXZ';
    this.viewmodelScene.add(this.weaponRig);

    this.muzzleFlashLight = new THREE.PointLight(0x00f0ff, 0, 8);
    this.muzzleFlashLight.position.set(0.2, -0.1, -0.6);
    this.viewmodelScene.add(this.muzzleFlashLight);

    // 5. Studio Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    this.viewmodelScene.environment = this.scene.environment;
    pmremGenerator.dispose();

    // 6. Lighting Rig
    this.initLighting();

    // 7. Subsystems
    const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.mapData = buildTacticalMap(this.scene, this.currentMapType, maxAnisotropy);
    this.particleSystem = new ParticleSystem(this.scene);
    this.botManager = new BotManager(this.scene, this.particleSystem);

    // 8. Viewmodel Weapons
    this.initWeaponModels();

    // 9. Third-Person Operative Model (Lobby & Angel Dance)
    this.buildThirdPersonPlayerModel();

    // 10. Inputs
    this.setupInputs();

    // 11. Loop
    this.tick = this.tick.bind(this);
    this.tick();
  }

  private initLighting() {
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e1b4b, 0.95);
    this.scene.add(hemiLight);

    const vHemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 1.2);
    this.viewmodelScene.add(vHemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(25, 45, 20);
    dirLight.castShadow = !this.isSoftwareGl;
    if (dirLight.castShadow) {
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      dirLight.shadow.camera.near = 10;
      dirLight.shadow.camera.far = 120;
      dirLight.shadow.camera.left = -40;
      dirLight.shadow.camera.right = 40;
      dirLight.shadow.camera.top = 40;
      dirLight.shadow.camera.bottom = -40;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    this.scene.add(dirLight);

    const vDirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    vDirLight.position.set(5, 5, 5);
    this.viewmodelScene.add(vDirLight);

    // Pagoda center accent point light
    const centerPoint = new THREE.PointLight(0x06b6d4, 2.5, 25);
    centerPoint.position.set(0, 5, 0);
    this.scene.add(centerPoint);
  }

  public loadMap(mapType: MapType) {
    if (this.currentMapType === mapType && this.mapData) return;
    this.currentMapType = mapType;
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    this.initLighting();
    const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.mapData = buildTacticalMap(this.scene, mapType, maxAnisotropy);
    this.buildThirdPersonPlayerModel();
  }

  public setPlayerCharacter(characterId: CharacterId) {
    this.playerStats.characterId = characterId;
    this.playerStats.gender = (characterId === 'kevin' || characterId === 'hayato') ? 'male' : 'female';
    this.buildThirdPersonPlayerModel();
    this.callbacks.onStatsUpdate({ ...this.playerStats });
  }

  private buildThirdPersonPlayerModel() {
    if (this.playerThirdPersonMesh) {
      this.scene.remove(this.playerThirdPersonMesh);
    }
    this.playerThirdPersonMesh = createOperativeModel(this.playerStats.characterId, 'blue', true);
    // In lobby, character is staged on the right side of the screen (1.5, 1.4, 0)
    // completely unobstructed by the left menus!
    if (this.state === 'lobby') {
      this.playerThirdPersonMesh.position.set(1.5, 1.4, 0);
      this.playerThirdPersonMesh.visible = true;
    } else {
      this.playerThirdPersonMesh.visible = false;
    }
    this.scene.add(this.playerThirdPersonMesh);
  }

  public setPlayerGender(gender: CharacterGender) {
    this.playerStats.gender = gender;
    this.playerStats.characterId = gender === 'female' ? 'eva' : 'kevin';
    this.buildThirdPersonPlayerModel();
    this.callbacks.onStatsUpdate({ ...this.playerStats });
  }

  private initWeaponModels() {
    const rifle = createRifleModel();
    rifle.position.set(0.24, -0.22, -0.42);
    this.weaponModels.push(rifle);

    const sniper = createSniperModel();
    sniper.position.set(0.26, -0.24, -0.5);
    this.weaponModels.push(sniper);

    const dual = createDualPistolsModel();
    dual.position.set(0, -0.2, -0.4);
    this.weaponModels.push(dual);

    const katana = createKatanaModel();
    katana.position.set(0.24, -0.2, -0.38);
    katana.rotation.set(0.2, -0.3, -0.4);
    this.weaponModels.push(katana);

    this.switchWeapon(0);
  }

  public switchWeapon(idx: number) {
    if (idx < 0 || idx >= this.weaponModels.length) return;
    this.playerStats.activeWeaponIndex = idx;
    this.playerStats.isADS = false;

    while (this.weaponRig.children.length > 0) {
      this.weaponRig.remove(this.weaponRig.children[0]);
    }

    const currentModel = this.weaponModels[idx];
    this.weaponRig.add(currentModel);

    soundEngine.playKatanaSlash();
    this.callbacks.onStatsUpdate({ ...this.playerStats });
  }

  private setupInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (e.code === 'KeyR' && this.state === 'playing') {
        this.reload();
      }
      if (e.code === 'KeyC' && this.state === 'playing') {
        this.toggleAngelDance();
      }
      if (e.code === 'KeyG' && this.state === 'playing') {
        this.throwGrenade();
      }
      if (e.code === 'Digit1') this.switchWeapon(0);
      if (e.code === 'Digit2') this.switchWeapon(1);
      if (e.code === 'Digit3') this.switchWeapon(2);
      if (e.code === 'Digit4') this.switchWeapon(3);
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('blur', () => {
      this.keys = {};
    });

    this.container.addEventListener('click', () => {
      if (this.state === 'playing' && !this.isPointerLocked) {
        this.container.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.container;
      this.callbacks.onPointerLockChange(this.isPointerLocked);
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked || this.state !== 'playing') return;

      // Clamp anomalous trackpad deltas
      const rawDx = Math.max(-100, Math.min(100, e.movementX));
      let rawDy = Math.max(-60, Math.min(60, e.movementY));

      // On laptop trackpads, swiping left or right can generate accidental vertical movement.
      // If horizontal turning is dominant (|rawDx| > 2.0 * |rawDy|), suppress the vertical drift
      // so the screen never suddenly pitches down when turning sideways!
      if (Math.abs(rawDx) > Math.abs(rawDy) * 2.0) {
        rawDy = 0;
      }

      const sens = this.playerStats.isADS ? this.mouseSensitivity * 0.45 : this.mouseSensitivity;
      this.cameraYaw -= rawDx * sens;
      this.cameraPitch -= rawDy * sens;
      // Strict clamping between -1.35 and 1.35 radians (prevents camera flipping)
      this.cameraPitch = Math.max(-1.35, Math.min(1.35, this.cameraPitch));
    });

    // Prevent wheel scrolling or gesture pitch drops while playing
    window.addEventListener('wheel', (e) => {
      if (this.isPointerLocked) e.preventDefault();
    }, { passive: false });

    window.addEventListener('mousedown', (e) => {
      if (this.state !== 'playing') return;

      if (e.button === 0) {
        if (this.playerStats.isDancing) {
          this.cancelAngelDance();
        }
        this.fireActiveWeapon();
      } else if (e.button === 2) {
        e.preventDefault();
        const activeDef = WEAPON_REGISTRY[this.playerStats.activeWeaponIndex];
        if (activeDef.canADS) {
          this.playerStats.isADS = !this.playerStats.isADS;
          this.callbacks.onStatsUpdate({ ...this.playerStats });
        }
      }
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.viewmodelCamera.aspect = w / h;
      this.viewmodelCamera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  // --- GAMEPLAY ACTIONS ---

  public enterLobby() {
    this.state = 'lobby';
    document.exitPointerLock?.();
    soundEngine.stopAngelDanceBGM();
    soundEngine.stopHeartbeat();
    this.buildThirdPersonPlayerModel();
  }

  public startGame(
    mode: GameMode,
    botGenderSetting: BotGenderSetting = 'mixed',
    mapType: MapType = 'classic'
  ) {
    this.mode = mode;
    this.botGenderSetting = botGenderSetting;
    this.loadMap(mapType);
    this.state = 'playing';
    this.matchTimer = mode === 'mutant' ? 160 : 300;
    this.mutantCountdown = 15;
    this.mutantRoundActive = false;
    this.blueKills = 0;
    this.redKills = 0;

    this.playerStats.hp = 100;
    this.playerStats.armor = 100;
    this.playerStats.score = 0;
    this.playerStats.kills = 0;
    this.playerStats.deaths = 0;
    this.playerStats.headshots = 0;
    this.playerStats.isDancing = false;
    this.playerStats.isMutant = false;
    this.playerStats.isArchangel = false;
    this.playerStats.currentAmmo = [30, 5, 24, 1];
    this.playerStats.reserveAmmo = [120, 25, 96, 1];
    this.playerStats.grenadeCount = 2;

    this.playerPos.set(0, 1.8, 25);
    this.playerVel.set(0, 0, 0);
    this.cameraYaw = 0;
    this.cameraPitch = 0;

    // Third person mesh hidden until Angel Dance
    this.playerThirdPersonMesh.visible = false;

    // Spawn AI bots with gender setting
    this.botManager.spawnBots(mode, 7, botGenderSetting);

    this.callbacks.onStatsUpdate({ ...this.playerStats });
    this.callbacks.onMatchScoreUpdate({
      blueKills: 0,
      redKills: 0,
      targetKills: this.targetKills,
      timeRemaining: this.matchTimer,
      humanCount: 8,
      mutantCount: 0,
    });

    soundEngine.playAnnouncement('first_blood');
  }

  public toggleAngelDance(emote: EmoteType = 'angel_dance') {
    if (this.playerStats.isMutant) return;
    if (this.playerStats.isDancing) {
      this.cancelAngelDance();
    } else {
      this.playerStats.isDancing = true;
      this.playerStats.currentEmote = emote;
      this.playerStats.isADS = false;

      // Position third person model right at player
      this.playerThirdPersonMesh.position.copy(this.playerPos);
      this.playerThirdPersonMesh.rotation.y = this.cameraYaw;
      this.playerThirdPersonMesh.visible = true;

      const wings = this.playerThirdPersonMesh.getObjectByName('angelWings');
      if (wings) wings.visible = true;

      soundEngine.startAngelDanceBGM();
      this.callbacks.onStatsUpdate({ ...this.playerStats });
    }
  }

  public cancelAngelDance() {
    if (!this.playerStats.isDancing) return;
    this.playerStats.isDancing = false;
    this.playerThirdPersonMesh.visible = false;
    const wings = this.playerThirdPersonMesh.getObjectByName('angelWings');
    if (wings && !this.playerStats.isArchangel) wings.visible = false;

    // Reset limbs to rest pose
    const limbs = this.playerThirdPersonMesh.userData;
    if (limbs) {
      if (limbs.torso) {
        limbs.torso.position.y = 1.25;
        limbs.torso.rotation.set(0, 0, 0);
      }
      if (limbs.leftArm) limbs.leftArm.rotation.set(0, 0, 0);
      if (limbs.rightArm) limbs.rightArm.rotation.set(Math.PI / 4, 0, 0);
      if (limbs.leftLeg) limbs.leftLeg.position.set(-0.16, 0, 0);
      if (limbs.rightLeg) limbs.rightLeg.position.set(0.16, 0, 0);
    }

    soundEngine.stopAngelDanceBGM();
    this.callbacks.onStatsUpdate({ ...this.playerStats });
  }

  public reload() {
    const idx = this.playerStats.activeWeaponIndex;
    const def = WEAPON_REGISTRY[idx];
    if (def.category === 'melee') return;
    if (this.playerStats.isReloading) return;
    if (this.playerStats.currentAmmo[idx] >= def.magazineSize) return;
    if (this.playerStats.reserveAmmo[idx] <= 0) return;

    this.playerStats.isReloading = true;
    this.playerStats.isADS = false;
    soundEngine.playReload();

    setTimeout(() => {
      const needed = def.magazineSize - this.playerStats.currentAmmo[idx];
      const take = Math.min(needed, this.playerStats.reserveAmmo[idx]);
      this.playerStats.currentAmmo[idx] += take;
      this.playerStats.reserveAmmo[idx] -= take;
      this.playerStats.isReloading = false;
      this.callbacks.onStatsUpdate({ ...this.playerStats });
    }, def.reloadTime * 1000);

    this.callbacks.onStatsUpdate({ ...this.playerStats });
  }

  public throwGrenade() {
    if (this.playerStats.grenadeCount <= 0) return;
    this.playerStats.grenadeCount--;
    this.callbacks.onStatsUpdate({ ...this.playerStats });

    const gGeo = new THREE.SphereGeometry(0.15, 12, 12);
    const gMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const gMesh = new THREE.Mesh(gGeo, gMat);
    const forward = this.getForwardVector();
    gMesh.position.copy(this.playerPos).add(new THREE.Vector3(0, 0.4, 0)).addScaledVector(forward, 0.6);
    this.scene.add(gMesh);

    const vel = forward.clone().multiplyScalar(22).add(new THREE.Vector3(0, 6, 0));
    this.activeGrenades.push({
      mesh: gMesh,
      pos: gMesh.position.clone(),
      vel,
      timer: 2.0,
    });
  }

  public fireActiveWeapon() {
    if (this.shootCooldown > 0 || this.playerStats.isReloading) return;
    const idx = this.playerStats.activeWeaponIndex;
    const def = WEAPON_REGISTRY[idx];

    if (def.category !== 'melee') {
      if (this.playerStats.currentAmmo[idx] <= 0) {
        this.reload();
        return;
      }
      this.playerStats.currentAmmo[idx]--;
      this.callbacks.onStatsUpdate({ ...this.playerStats });
    }

    this.shootCooldown = 1 / def.fireRate;

    this.recoilPitch += def.recoil.vertical;
    this.recoilYaw += (Math.random() - 0.5) * def.recoil.horizontal;

    this.flashTimer = 0.05;
    this.muzzleFlashLight.intensity = 2.5;

    // Softer balanced gunshot audio
    if (def.id === 'ar_astra') soundEngine.playRifleShot();
    else if (def.id === 'awp_valkyrie') soundEngine.playSniperShot();
    else if (def.id === 'dual_twin') soundEngine.playPistolShot();
    else if (def.id === 'plasma_katana') soundEngine.playKatanaSlash();

    this.weaponRig.position.z += 0.05;
    this.weaponRig.rotation.x -= 0.06;

    this.performBulletRaycast(def);
  }

  private performBulletRaycast(def: typeof WEAPON_REGISTRY[0]) {
    const raycaster = new THREE.Raycaster();
    const forward = this.getForwardVector();

    const spreadAngle = this.playerStats.isADS ? def.spread * 0.3 : def.spread;
    forward.x += (Math.random() - 0.5) * spreadAngle;
    forward.y += (Math.random() - 0.5) * spreadAngle;
    forward.z += (Math.random() - 0.5) * spreadAngle;
    forward.normalize();

    raycaster.set(this.playerPos, forward);
    raycaster.far = def.range;

    const muzzleWorld = this.playerPos.clone().add(forward.clone().multiplyScalar(0.6)).add(new THREE.Vector3(0, -0.15, 0));
    let hitPoint = this.playerPos.clone().addScaledVector(forward, def.range);
    let hitNormal = new THREE.Vector3(0, 1, 0);

    const mapIntersects = raycaster.intersectObjects(this.scene.children, true);
    let closestDist = Infinity;
    let hitTargetDummy: any = null;

    for (const hit of mapIntersects) {
      if (hit.object === this.playerThirdPersonMesh || hit.object.type === 'Line') continue;
      if (hit.distance < closestDist) {
        closestDist = hit.distance;
        hitPoint = hit.point;
        if (hit.face) hitNormal = hit.face.normal;
        if (hit.object.userData?.isTargetDummy) {
          hitTargetDummy = hit.object;
        }
      }
    }

    let hitBot: any = null;
    let isHeadshot = false;

    this.botManager.getBots().forEach((bot) => {
      if (!bot.isAlive) return;
      const botPos = new THREE.Vector3(bot.position.x, bot.position.y + 1.0, bot.position.z);
      const toBot = new THREE.Vector3().subVectors(botPos, this.playerPos);
      const proj = toBot.dot(forward);

      if (proj > 0 && proj < def.range && proj < closestDist + 0.5) {
        const closestRayPoint = this.playerPos.clone().addScaledVector(forward, proj);
        const distToCenter = closestRayPoint.distanceTo(botPos);

        if (distToCenter < 0.65) {
          hitBot = bot;
          hitPoint = closestRayPoint;
          if (closestRayPoint.y >= bot.position.y + 1.6) {
            isHeadshot = true;
          }
        }
      }
    });

    const tracerColor = def.id === 'awp_valkyrie' ? 0xa855f7 : def.id === 'dual_twin' ? 0xec4899 : 0x00f0ff;
    this.particleSystem.addTracer(muzzleWorld, hitPoint, tracerColor);

    if (hitBot) {
      let finalDamage = def.damage;
      if (isHeadshot) {
        finalDamage = Math.round(finalDamage * def.headshotMultiplier);
        soundEngine.playHeadshotDing();
        this.playerStats.headshots++;
      } else {
        soundEngine.playHitTick();
      }

      this.particleSystem.addImpactSparks(hitPoint, hitNormal, true, hitBot.isMutant);
      this.callbacks.onHitmarker(isHeadshot, finalDamage);

      const killed = this.botManager.damageBot(hitBot, finalDamage, 'Player');
      if (killed) {
        this.onPlayerScoredKill(hitBot.name, isHeadshot, def.name);
      }
    } else if (hitTargetDummy) {
      soundEngine.playHitTick();
      this.particleSystem.addImpactSparks(hitPoint, hitNormal, false);
      this.callbacks.onHitmarker(false, def.damage);
    } else {
      this.particleSystem.addImpactSparks(hitPoint, hitNormal, false);
    }
  }

  private onPlayerScoredKill(victimName: string, isHeadshot: boolean, weaponName: string) {
    this.playerStats.kills++;
    this.playerStats.score += isHeadshot ? 150 : 100;
    this.blueKills++;

    const now = performance.now();
    if (now - this.lastKillTime < 4500) {
      this.recentKillsCount++;
    } else {
      this.recentKillsCount = 1;
    }
    this.lastKillTime = now;

    if (this.recentKillsCount === 2) soundEngine.playAnnouncement('double_kill');
    else if (this.recentKillsCount === 3) soundEngine.playAnnouncement('triple_kill');
    else if (this.recentKillsCount >= 4) soundEngine.playAnnouncement('rampage');

    this.callbacks.onKillEvent({
      id: `kill_${Date.now()}`,
      killerName: 'You (Operative)',
      killerTeam: 'blue',
      victimName,
      victimTeam: 'red',
      weaponName,
      isHeadshot,
      timestamp: Date.now(),
    });

    this.callbacks.onStatsUpdate({ ...this.playerStats });
    this.checkMatchConditions();
  }

  public takePlayerDamage(amount: number, attackerName: string) {
    if (this.state !== 'playing') return;

    if (this.playerStats.isDancing) {
      amount = Math.round(amount * 1.25);
      this.cancelAngelDance();
    }

    if (this.playerStats.armor > 0) {
      const armorAbsorb = Math.min(this.playerStats.armor, amount * 0.65);
      this.playerStats.armor -= Math.round(armorAbsorb);
      amount -= armorAbsorb;
    }

    this.playerStats.hp = Math.max(0, this.playerStats.hp - Math.round(amount));

    this.cameraPitch += (Math.random() - 0.5) * 0.04;
    this.cameraYaw += (Math.random() - 0.5) * 0.04;

    if (this.playerStats.hp < 30) {
      soundEngine.startHeartbeat();
    }

    if (this.playerStats.hp <= 0) {
      this.onPlayerDeath(attackerName);
    }

    this.callbacks.onStatsUpdate({ ...this.playerStats });
  }

  private onPlayerDeath(killerName: string) {
    this.playerStats.deaths++;
    soundEngine.stopHeartbeat();
    soundEngine.stopAngelDanceBGM();
    this.redKills++;

    this.callbacks.onKillEvent({
      id: `kill_${Date.now()}`,
      killerName,
      killerTeam: 'red',
      victimName: 'You (Operative)',
      victimTeam: 'blue',
      weaponName: 'Assault Weapon',
      isHeadshot: false,
      timestamp: Date.now(),
    });

    setTimeout(() => {
      this.playerStats.hp = 100;
      this.playerStats.armor = 100;
      this.playerPos.set(0, 1.8, 28);
      this.playerVel.set(0, 0, 0);
      this.callbacks.onStatsUpdate({ ...this.playerStats });
    }, 3000);

    this.checkMatchConditions();
  }

  private checkMatchConditions() {
    if (this.mode === 'tdm') {
      if (this.blueKills >= this.targetKills) {
        this.state = 'game_over';
        this.callbacks.onGameOver('Blue Team (Victory!)', this.playerStats);
      } else if (this.redKills >= this.targetKills) {
        this.state = 'game_over';
        this.callbacks.onGameOver('Red Team (Defeat)', this.playerStats);
      }
    }
  }

  // --- CORE LOOP ---

  private tick() {
    const now = performance.now();
    const rawDt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    const dt = Math.min(rawDt, 0.05);

    if (this.state === 'playing') {
      this.updatePlayerMovement(dt);
      this.updateAngelDance(dt);
      this.updateWeapons(dt);
      this.updateGrenades(dt);
      // Pass colliders to bot update so bots do NOT walk through shipping containers or crates!
      this.botManager.update(
        dt,
        this.playerPos,
        'blue',
        this.playerStats.hp > 0,
        this.mapData.colliders,
        (dmg, attacker) => this.takePlayerDamage(dmg, attacker),
        () => {}
      );
      this.particleSystem.update(dt);
      this.updateMatchTimer(dt);
    } else if (this.state === 'lobby') {
      // 3D Character Staging in Bullet Angel Lobby (Shifted to right stage x=1.5 so menus don't cover it!)
      this.lobbyCharRotation += 0.5 * dt;
      if (this.playerThirdPersonMesh) {
        this.playerThirdPersonMesh.rotation.y = this.lobbyCharRotation;
        this.playerThirdPersonMesh.position.set(1.5, 1.4 + Math.sin(now * 0.002) * 0.03, 0);
        this.playerThirdPersonMesh.visible = true;
      }
      // Camera looking at operative at the right stage
      this.camera.position.set(1.5, 2.3, 3.8);
      this.camera.lookAt(1.5, 1.9, 0);
      this.particleSystem.update(dt);
    } else if (this.state === 'title') {
      const t = now * 0.0003;
      this.camera.position.set(Math.sin(t) * 24, 8 + Math.cos(t * 0.8) * 3, Math.cos(t) * 24);
      this.camera.lookAt(0, 2.5, 0);
      this.particleSystem.update(dt);
    }

    this.render();

    if (this.isSoftwareGl) {
      this.afterDraw(() => {
        this.animFrameId = requestAnimationFrame(this.tick);
      });
    } else {
      this.animFrameId = requestAnimationFrame(this.tick);
    }
  }

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        setTimeout(poll, 5);
      } else {
        gl.deleteSync(sync);
        setTimeout(cb, 60);
      }
    };
    setTimeout(poll, 5);
  }

  private updatePlayerMovement(dt: number) {
    if (this.playerStats.isDancing) {
      if (this.keys['KeyW'] || this.keys['KeyS'] || this.keys['KeyA'] || this.keys['KeyD'] || this.keys['Space']) {
        this.cancelAngelDance();
      }
      return;
    }

    this.recoilPitch = THREE.MathUtils.damp(this.recoilPitch, 0, 10, dt);
    this.recoilYaw = THREE.MathUtils.damp(this.recoilYaw, 0, 10, dt);

    const forward = new THREE.Vector3(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw)).normalize();
    const right = new THREE.Vector3(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw)).normalize();

    let moveDir = new THREE.Vector3();
    if (this.keys['KeyW']) moveDir.add(forward);
    if (this.keys['KeyS']) moveDir.addScaledVector(forward, -1);
    if (this.keys['KeyD']) moveDir.add(right);
    if (this.keys['KeyA']) moveDir.addScaledVector(right, -1);

    const isMoving = moveDir.lengthSq() > 0.001;
    if (isMoving) moveDir.normalize();

    const isSprinting = this.keys['ShiftLeft'] || this.keys['ShiftRight'];
    let speed = isSprinting ? 9.5 : 6.0;
    if (this.playerStats.isADS) speed = 3.2;

    if (this.playerStats.activeWeaponIndex === 3) speed *= 1.15;

    const targetVelX = moveDir.x * speed;
    const targetVelZ = moveDir.z * speed;
    this.playerVel.x = THREE.MathUtils.damp(this.playerVel.x, targetVelX, 12, dt);
    this.playerVel.z = THREE.MathUtils.damp(this.playerVel.z, targetVelZ, 12, dt);

    if (this.keys['Space'] && this.isGrounded) {
      this.playerVel.y = 7.5;
      this.isGrounded = false;
      soundEngine.playFootstep();
    }

    this.playerVel.y -= 22 * dt;

    const newPos = this.playerPos.clone();
    newPos.x += this.playerVel.x * dt;
    newPos.z += this.playerVel.z * dt;
    newPos.y += this.playerVel.y * dt;

    if (newPos.y <= 1.8) {
      newPos.y = 1.8;
      this.playerVel.y = 0;
      this.isGrounded = true;
    }

    // AABB collision resolution with all containers, buildings, and crates
    this.resolveMapCollisions(newPos);
    this.playerPos.copy(newPos);

    // Position camera at player head (when not dancing in 3rd person)
    if (!this.playerStats.isDancing) {
      this.camera.position.copy(this.playerPos);
    }
    const totalPitch = this.cameraPitch + this.recoilPitch;
    const totalYaw = this.cameraYaw + this.recoilYaw;

    // Use robust YXZ Euler rotation to prevent camera gimbal pitch flip on laptop turns!
    this.camera.rotation.set(totalPitch, totalYaw, 0, 'YXZ');

    if (isMoving && this.isGrounded && !this.playerStats.isDancing) {
      this.weaponBobTime += dt * (isSprinting ? 14 : 9);
      if (Math.sin(this.weaponBobTime) > 0.95) soundEngine.playFootstep();
    }

    const activeDef = WEAPON_REGISTRY[this.playerStats.activeWeaponIndex];
    const targetFov = this.playerStats.isADS ? activeDef.adsFov : this.baseFov;
    this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 14, dt);
    this.camera.updateProjectionMatrix();
  }

  private resolveMapCollisions(pos: THREE.Vector3) {
    const playerRadius = 0.5;
    for (const box of this.mapData.colliders) {
      if (
        pos.x + playerRadius > box.min.x &&
        pos.x - playerRadius < box.max.x &&
        pos.z + playerRadius > box.min.z &&
        pos.z - playerRadius < box.max.z &&
        pos.y - 1.8 < box.max.y &&
        pos.y > box.min.y
      ) {
        if (box.max.y <= pos.y - 1.2) {
          pos.y = box.max.y + 1.8;
          this.isGrounded = true;
          this.playerVel.y = 0;
        } else {
          const dx1 = pos.x + playerRadius - box.min.x;
          const dx2 = box.max.x - (pos.x - playerRadius);
          const dz1 = pos.z + playerRadius - box.min.z;
          const dz2 = box.max.z - (pos.z - playerRadius);
          const minD = Math.min(dx1, dx2, dz1, dz2);

          if (minD === dx1) pos.x = box.min.x - playerRadius;
          else if (minD === dx2) pos.x = box.max.x + playerRadius;
          else if (minD === dz1) pos.z = box.min.z - playerRadius;
          else if (minD === dz2) pos.z = box.max.z + playerRadius;
        }
      }
    }
  }

  private updateAngelDance(dt: number) {
    if (!this.playerStats.isDancing) return;

    this.playerStats.hp = Math.min(this.playerStats.maxHp, this.playerStats.hp + 28 * dt);
    this.playerStats.armor = Math.min(this.playerStats.maxArmor, this.playerStats.armor + 24 * dt);

    if (Math.random() < 0.25) {
      this.particleSystem.addDanceHealingRing(this.playerPos);
    }

    // Move third-person character model right with the player
    this.playerThirdPersonMesh.position.copy(this.playerPos);
    this.playerThirdPersonMesh.rotation.y = this.cameraYaw;

    // 3rd Person Orbit Camera: pulls back 3.2m behind player, angled up 1.6m looking at the dancing character!
    const camBackDist = 3.2;
    const camHeight = 1.6;
    const backX = Math.sin(this.cameraYaw) * camBackDist;
    const backZ = Math.cos(this.cameraYaw) * camBackDist;
    const targetCamPos = new THREE.Vector3(
      this.playerPos.x + backX,
      this.playerPos.y + camHeight,
      this.playerPos.z + backZ
    );
    this.camera.position.lerp(targetCamPos, 0.2);
    this.camera.lookAt(this.playerPos.x, this.playerPos.y + 1.25, this.playerPos.z);

    // FULL 3D PROCEDURAL DANCING ANIMATION ON CHARACTER LIMBS!
    const limbs = this.playerThirdPersonMesh.userData;
    if (limbs) {
      const t = performance.now() * 0.007;
      const emote = this.playerStats.currentEmote;

      if (emote === 'breakdance') {
        if (limbs.torso) {
          limbs.torso.position.y = 1.1 + Math.abs(Math.sin(t * 8)) * 0.2;
          limbs.torso.rotation.y = Math.sin(t * 6) * 0.8;
          limbs.torso.rotation.z = Math.cos(t * 6) * 0.35;
        }
        if (limbs.leftArm && limbs.rightArm) {
          limbs.leftArm.rotation.x = Math.sin(t * 8) * 1.4;
          limbs.leftArm.rotation.z = -0.7 + Math.cos(t * 8) * 0.8;
          limbs.rightArm.rotation.x = -Math.sin(t * 8) * 1.4;
          limbs.rightArm.rotation.z = 0.7 - Math.cos(t * 8) * 0.8;
        }
        if (limbs.leftLeg && limbs.rightLeg) {
          limbs.leftLeg.position.y = Math.max(0, Math.sin(t * 8) * 0.18);
          limbs.rightLeg.position.y = Math.max(0, -Math.sin(t * 8) * 0.18);
        }
      } else if (emote === 'victory_dab') {
        if (limbs.torso) {
          limbs.torso.position.y = 1.25 + Math.abs(Math.sin(t * 4)) * 0.1;
          limbs.torso.rotation.y = -0.3;
          limbs.torso.rotation.z = 0.2;
        }
        if (limbs.leftArm && limbs.rightArm) {
          limbs.leftArm.rotation.x = 0.4;
          limbs.leftArm.rotation.z = -1.8 + Math.sin(t * 4) * 0.2;
          limbs.rightArm.rotation.x = 1.2;
          limbs.rightArm.rotation.z = -0.8;
        }
      } else {
        // Signature Angel Dance & Love Dance
        if (limbs.torso) {
          limbs.torso.position.y = 1.25 + Math.abs(Math.sin(t * 5)) * 0.14;
          limbs.torso.rotation.y = Math.sin(t * 3.5) * 0.45;
          limbs.torso.rotation.z = Math.cos(t * 3.5) * 0.2;
        }
        if (limbs.leftArm && limbs.rightArm) {
          limbs.leftArm.rotation.x = Math.sin(t * 5) * 0.9;
          limbs.leftArm.rotation.z = -0.5 + Math.cos(t * 5) * 0.6;
          limbs.rightArm.rotation.x = -Math.sin(t * 5) * 0.9;
          limbs.rightArm.rotation.z = 0.5 - Math.cos(t * 5) * 0.6;
        }
        if (limbs.leftLeg && limbs.rightLeg) {
          limbs.leftLeg.position.y = Math.max(0, Math.sin(t * 5) * 0.12);
          limbs.rightLeg.position.y = Math.max(0, -Math.sin(t * 5) * 0.12);
        }
        if (limbs.wings) {
          limbs.wings.rotation.y = Math.sin(t * 7) * 0.35;
        }
      }
    }

    this.callbacks.onStatsUpdate({ ...this.playerStats });
  }

  public applyWeaponSkin(metalColor: number, neonColor: number, weaponId: string) {
    const weaponIdx = WEAPON_REGISTRY.findIndex((w) => w.id === weaponId);
    if (weaponIdx >= 0 && this.weaponModels[weaponIdx]) {
      const model = this.weaponModels[weaponIdx];
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const mat = mesh.material as any;
            if (mat.metalness && mat.metalness > 0.4) {
              mat.color.setHex(metalColor);
            } else if (mat.type === 'MeshBasicMaterial') {
              mat.color.setHex(neonColor);
            }
          }
        }
      });
    }
  }

  private updateWeapons(dt: number) {
    if (this.shootCooldown > 0) this.shootCooldown -= dt;

    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      if (this.flashTimer <= 0) {
        this.muzzleFlashLight.intensity = 0;
      }
    }

    // If dancing, viewmodel dance animation is handled in updateAngelDance
    if (this.playerStats.isDancing) return;

    const activeDef = WEAPON_REGISTRY[this.playerStats.activeWeaponIndex];
    if (activeDef.isAutomatic && this.keys['Mouse0'] && this.isPointerLocked) {
      this.fireActiveWeapon();
    }

    const bobX = Math.cos(this.weaponBobTime * 0.5) * 0.015;
    const bobY = Math.sin(this.weaponBobTime) * 0.015;

    let targetX = 0 + bobX;
    let targetY = 0 + bobY;
    let targetZ = 0;

    if (this.playerStats.isADS) {
      targetX = -0.24;
      targetY = 0.08;
      targetZ = 0.1;
    }

    this.weaponRig.position.x = THREE.MathUtils.damp(this.weaponRig.position.x, targetX, 14, dt);
    this.weaponRig.position.y = THREE.MathUtils.damp(this.weaponRig.position.y, targetY, 14, dt);
    this.weaponRig.position.z = THREE.MathUtils.damp(this.weaponRig.position.z, targetZ, 14, dt);

    this.weaponRig.rotation.x = THREE.MathUtils.damp(this.weaponRig.rotation.x, 0, 10, dt);
  }

  private updateGrenades(dt: number) {
    for (let i = this.activeGrenades.length - 1; i >= 0; i--) {
      const g = this.activeGrenades[i];
      g.timer -= dt;

      g.vel.y -= 18 * dt;
      g.pos.addScaledVector(g.vel, dt);

      if (g.pos.y <= 0.15) {
        g.pos.y = 0.15;
        g.vel.y = -g.vel.y * 0.45;
        g.vel.x *= 0.7;
        g.vel.z *= 0.7;
      }

      g.mesh.position.copy(g.pos);

      if (g.timer <= 0) {
        soundEngine.playExplosion();
        this.particleSystem.addExplosion(g.pos);

        this.botManager.getBots().forEach((bot) => {
          if (!bot.isAlive) return;
          const dist = g.pos.distanceTo(new THREE.Vector3(bot.position.x, bot.position.y, bot.position.z));
          if (dist < 8) {
            const dmg = Math.round(140 * (1 - dist / 8));
            const killed = this.botManager.damageBot(bot, dmg, 'Player (Grenade)');
            if (killed) this.onPlayerScoredKill(bot.name, false, 'Pulse Grenade');
          }
        });

        const distToPlayer = g.pos.distanceTo(this.playerPos);
        if (distToPlayer < 8) {
          const selfDmg = Math.round(90 * (1 - distToPlayer / 8));
          this.takePlayerDamage(selfDmg, 'Your Grenade');
        }

        this.scene.remove(g.mesh);
        g.mesh.geometry.dispose();
        (g.mesh.material as THREE.Material).dispose();
        this.activeGrenades.splice(i, 1);
      }
    }
  }

  private updateMatchTimer(dt: number) {
    this.matchTimer -= dt;
    if (this.matchTimer <= 0) {
      this.matchTimer = 0;
      this.state = 'game_over';
      const winner = this.blueKills >= this.redKills ? 'Blue Team (Victory!)' : 'Red Team (Defeat)';
      this.callbacks.onGameOver(winner, this.playerStats);
    }

    if (this.mode === 'mutant' && !this.mutantRoundActive) {
      this.mutantCountdown -= dt;
      if (this.mutantCountdown <= 0) {
        this.mutantRoundActive = true;
        const bots = this.botManager.getBots();
        if (bots.length > 0) {
          this.botManager.infectBot(bots[0]);
        }
        soundEngine.playAnnouncement('mutant_alert');
      }
    }

    this.callbacks.onMatchScoreUpdate({
      blueKills: this.blueKills,
      redKills: this.redKills,
      targetKills: this.targetKills,
      timeRemaining: Math.ceil(this.matchTimer),
      humanCount: 8 - this.botManager.getBots().filter((b) => b.isMutant).length,
      mutantCount: this.botManager.getBots().filter((b) => b.isMutant).length,
    });
  }

  private getForwardVector(): THREE.Vector3 {
    const forward = new THREE.Vector3(0, 0, -1);
    const euler = new THREE.Euler(
      this.cameraPitch + this.recoilPitch,
      this.cameraYaw + this.recoilYaw,
      0,
      'YXZ'
    );
    forward.applyEuler(euler);
    return forward;
  }

  private render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    if (this.state === 'playing' && !this.playerStats.isDancing) {
      this.renderer.clearDepth();
      this.renderer.render(this.viewmodelScene, this.viewmodelCamera);
    }
  }

  public dispose() {
    cancelAnimationFrame(this.animFrameId);
    this.particleSystem.dispose();
    this.botManager.clearBots();
    this.renderer.dispose();
    soundEngine.stopAngelDanceBGM();
    soundEngine.stopHeartbeat();
  }
}
