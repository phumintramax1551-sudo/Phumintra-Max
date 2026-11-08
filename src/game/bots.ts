import * as THREE from 'three';
import { BotEntity, Team, CharacterGender, BotGenderSetting, CharacterId } from './types';
import { createOperativeModel, createMutantMummyCharacter } from './models';
import { soundEngine } from './audio';
import { ParticleSystem } from './particles';
import { BoundingBox } from './map';

export class BotManager {
  private scene: THREE.Scene;
  private bots: BotEntity[] = [];
  private particleSystem: ParticleSystem;

  constructor(scene: THREE.Scene, particleSystem: ParticleSystem) {
    this.scene = scene;
    this.particleSystem = particleSystem;
  }

  public getBots(): BotEntity[] {
    return this.bots;
  }

  public spawnBots(
    mode: 'tdm' | 'mutant' | 'training',
    count: number = 7,
    genderSetting: BotGenderSetting = 'mixed'
  ) {
    this.clearBots();

    const maleNames = ['Kevin_Assault', 'Hayato_Blade', 'Titan_Raven', 'Striker_Jack', 'Apex_Zero', 'Ghost_Rider'];
    const femaleNames = ['Eva_Valkyrie', 'Kelly_Sprint', 'Seraph_Luna', 'Phantom_Nova', 'Frost_Iris', 'Shadow_Viper'];

    for (let i = 0; i < count; i++) {
      let team: Team = i % 2 === 0 ? 'red' : 'blue';
      let isMutant = false;

      if (mode === 'mutant') {
        team = i === 0 ? 'mutant' : 'blue';
        isMutant = i === 0;
      } else if (mode === 'training') {
        team = 'red';
      }

      // Determine gender
      let gender: CharacterGender = 'female';
      if (genderSetting === 'all_male') {
        gender = 'male';
      } else if (genderSetting === 'all_female') {
        gender = 'female';
      } else {
        gender = i % 2 === 0 ? 'female' : 'male';
      }

      const namePool = gender === 'female' ? femaleNames : maleNames;
      const botName = namePool[i % namePool.length];

      // Assign character ID
      let characterId: CharacterId = 'eva';
      if (gender === 'female') {
        characterId = i % 4 === 0 ? 'eva' : 'kelly';
      } else {
        characterId = i % 4 === 1 ? 'kevin' : 'hayato';
      }

      const spawnX = team === 'red' ? (Math.random() - 0.5) * 28 : (Math.random() - 0.5) * 28;
      const spawnZ = team === 'red' ? -26 + (Math.random() - 0.5) * 6 : 26 + (Math.random() - 0.5) * 6;

      const bot: BotEntity = {
        id: `bot_${i}_${Date.now()}`,
        name: botName,
        gender,
        characterId,
        team,
        position: { x: spawnX, y: 0, z: spawnZ },
        rotationY: team === 'red' ? 0 : Math.PI,
        hp: isMutant ? 850 : 100,
        maxHp: isMutant ? 850 : 100,
        isMutant,
        isArchangel: false,
        isDancing: false,
        isAlive: true,
        targetPos: null,
        shootCooldown: Math.random() * 1.5,
        strafeTimer: Math.random() * 2,
        strafeDir: Math.random() > 0.5 ? 1 : -1,
        kills: 0,
        deaths: 0,
      };

      const mesh = isMutant
        ? createMutantMummyCharacter()
        : createOperativeModel(characterId, team, false);

      mesh.position.set(bot.position.x, bot.position.y, bot.position.z);
      this.scene.add(mesh);
      bot.meshGroup = mesh;

      this.bots.push(bot);
    }
  }

  public infectBot(bot: BotEntity) {
    if (bot.isMutant) return;
    bot.isMutant = true;
    bot.team = 'mutant';
    bot.maxHp = 800;
    bot.hp = 800;

    if (bot.meshGroup) {
      this.scene.remove(bot.meshGroup);
    }
    const mutantMesh = createMutantMummyCharacter();
    mutantMesh.position.set(bot.position.x, bot.position.y, bot.position.z);
    this.scene.add(mutantMesh);
    bot.meshGroup = mutantMesh;

    soundEngine.playAnnouncement('mutant_alert');
  }

  /**
   * Resolves bot collision against map obstacle colliders (Shipping containers, crates, walls)
   * Prevents bots from passing through objects!
   */
  private resolveBotMapCollision(
    botPos: { x: number; y: number; z: number },
    colliders: BoundingBox[]
  ): { x: number; z: number; hitObstacle: boolean } {
    const botRadius = 0.55;
    let newX = botPos.x;
    let newZ = botPos.z;
    let hitObstacle = false;

    for (const box of colliders) {
      // Check horizontal AABB intersection
      if (
        newX + botRadius > box.min.x &&
        newX - botRadius < box.max.x &&
        newZ + botRadius > box.min.z &&
        newZ - botRadius < box.max.z
      ) {
        // Only collide if obstacle is at bot's height
        if (box.max.y > 0.5) {
          hitObstacle = true;
          // Calculate penetration depth along X and Z
          const dx1 = newX + botRadius - box.min.x;
          const dx2 = box.max.x - (newX - botRadius);
          const dz1 = newZ + botRadius - box.min.z;
          const dz2 = box.max.z - (newZ - botRadius);

          const minD = Math.min(dx1, dx2, dz1, dz2);

          if (minD === dx1) newX = box.min.x - botRadius;
          else if (minD === dx2) newX = box.max.x + botRadius;
          else if (minD === dz1) newZ = box.min.z - botRadius;
          else if (minD === dz2) newZ = box.max.z + botRadius;
        }
      }
    }

    return { x: newX, z: newZ, hitObstacle };
  }

  public update(
    dt: number,
    playerPos: THREE.Vector3,
    playerTeam: Team,
    playerIsAlive: boolean,
    colliders: BoundingBox[],
    onPlayerHit: (damage: number, attackerName: string) => void,
    onBotKill: (bot: BotEntity, killerName: string) => void
  ) {
    this.bots.forEach((bot) => {
      if (!bot.isAlive || !bot.meshGroup) return;

      const botPos = new THREE.Vector3(bot.position.x, bot.position.y, bot.position.z);

      let nearestTargetPos: THREE.Vector3 | null = null;
      let minDistance = Infinity;

      const distToPlayer = botPos.distanceTo(playerPos);
      const isPlayerEnemy = bot.team === 'mutant'
        ? (playerTeam !== 'mutant')
        : (bot.team !== playerTeam);

      if (playerIsAlive && isPlayerEnemy) {
        nearestTargetPos = playerPos;
        minDistance = distToPlayer;
      }

      this.bots.forEach((other) => {
        if (!other.isAlive || other.id === bot.id) return;
        const isEnemy = bot.team === 'mutant' ? other.team !== 'mutant' : bot.team !== other.team;
        if (isEnemy) {
          const otherPos = new THREE.Vector3(other.position.x, other.position.y, other.position.z);
          const d = botPos.distanceTo(otherPos);
          if (d < minDistance) {
            minDistance = d;
            nearestTargetPos = otherPos;
          }
        }
      });

      // Angel Dance Regen Behavior: If bot HP < 35% and not in immediate danger, hide & dance to heal
      if (!bot.isMutant && bot.hp < 35 && minDistance > 16) {
        bot.isDancing = true;
        bot.hp = Math.min(bot.maxHp, bot.hp + 20 * dt);
        if (Math.random() < 0.15) {
          this.particleSystem.addDanceHealingRing(botPos);
        }
        bot.meshGroup.rotation.y += 3.5 * dt;
        bot.meshGroup.position.y = bot.position.y + Math.sin(Date.now() * 0.008) * 0.1;
        const wings = bot.meshGroup.getObjectByName('angelWings');
        if (wings) wings.visible = true;
        if (bot.hp >= bot.maxHp * 0.9) {
          bot.isDancing = false;
          if (wings) wings.visible = false;
        }
        return;
      } else {
        bot.isDancing = false;
        const wings = bot.meshGroup.getObjectByName('angelWings');
        if (wings && !bot.isArchangel) wings.visible = false;
      }

      // Movement & Obstacle Navigation
      if (nearestTargetPos) {
        const toTarget = new THREE.Vector3().subVectors(nearestTargetPos, botPos);
        const dist = toTarget.length();
        toTarget.y = 0;
        toTarget.normalize();

        const targetAngle = Math.atan2(toTarget.x, toTarget.z);
        bot.rotationY = THREE.MathUtils.damp(bot.rotationY, targetAngle, 8, dt);
        bot.meshGroup.rotation.y = bot.rotationY;

        bot.strafeTimer -= dt;
        if (bot.strafeTimer <= 0) {
          bot.strafeTimer = 1.2 + Math.random() * 1.5;
          bot.strafeDir = Math.random() > 0.5 ? 1 : -1;
        }

        const moveSpeed = bot.isMutant ? 8.2 : 4.6;
        const strafeVec = new THREE.Vector3(-toTarget.z, 0, toTarget.x).multiplyScalar(bot.strafeDir * 0.6);

        let moveDir = new THREE.Vector3();
        if (bot.isMutant) {
          moveDir.add(toTarget);
        } else {
          if (dist > 20) {
            moveDir.add(toTarget);
          } else if (dist < 8) {
            moveDir.addScaledVector(toTarget, -1);
          }
          moveDir.add(strafeVec);
        }

        moveDir.normalize();

        // Calculate proposed new position
        const proposedPos = {
          x: bot.position.x + moveDir.x * moveSpeed * dt,
          y: bot.position.y,
          z: bot.position.z + moveDir.z * moveSpeed * dt,
        };

        // Strict Collision Detection Against Map Obstacles (NO CLIPPING THROUGH CONTAINERS/WALLS)
        const resolved = this.resolveBotMapCollision(proposedPos, colliders);
        bot.position.x = resolved.x;
        bot.position.z = resolved.z;

        // If bot ran into a container, steer slightly around it
        if (resolved.hitObstacle) {
          bot.strafeDir *= -1; // switch strafe direction to detour around container
        }

        // Keep within arena bounds
        bot.position.x = Math.max(-36, Math.min(36, bot.position.x));
        bot.position.z = Math.max(-36, Math.min(36, bot.position.z));

        // Walking cycle
        const walkCycle = Math.sin(Date.now() * 0.012) * 0.08;
        bot.meshGroup.position.set(bot.position.x, bot.position.y + Math.abs(walkCycle), bot.position.z);

        // Attack Logic
        bot.shootCooldown -= dt;
        if (bot.shootCooldown <= 0 && dist < (bot.isMutant ? 3.0 : 45)) {
          if (bot.isMutant) {
            bot.shootCooldown = 0.9;
            soundEngine.playMutantSwipe();
            if (nearestTargetPos === playerPos && dist < 3.0) {
              onPlayerHit(40, bot.name);
            }
          } else {
            bot.shootCooldown = 0.16 + Math.random() * 0.22;
            soundEngine.playRifleShot();

            const muzzlePos = botPos.clone().add(new THREE.Vector3(0, 1.3, 0));
            const spread = new THREE.Vector3(
              (Math.random() - 0.5) * 1.0,
              (Math.random() - 0.5) * 0.8,
              (Math.random() - 0.5) * 1.0
            );
            const aimPos = nearestTargetPos.clone().add(new THREE.Vector3(0, 1.2, 0)).add(spread);

            this.particleSystem.addTracer(muzzlePos, aimPos, bot.team === 'blue' ? 0x00f0ff : 0xef4444);

            if (nearestTargetPos === playerPos && Math.random() < 0.6) {
              onPlayerHit(16, bot.name);
            }
          }
        }
      } else {
        bot.meshGroup.position.set(bot.position.x, bot.position.y, bot.position.z);
      }
    });
  }

  public damageBot(bot: BotEntity, damage: number, killerName: string): boolean {
    if (!bot.isAlive) return false;
    bot.hp -= damage;
    if (bot.hp <= 0) {
      bot.hp = 0;
      bot.isAlive = false;
      bot.deaths++;

      const botPos = new THREE.Vector3(bot.position.x, bot.position.y, bot.position.z);
      this.particleSystem.addImpactSparks(
        botPos.add(new THREE.Vector3(0, 1.2, 0)),
        new THREE.Vector3(0, 1, 0),
        true,
        bot.isMutant
      );

      if (bot.meshGroup) {
        this.scene.remove(bot.meshGroup);
      }

      // Respawn after 4 seconds
      setTimeout(() => {
        if (!bot.meshGroup) {
          bot.isAlive = true;
          bot.hp = bot.maxHp;
          bot.position.x = (Math.random() - 0.5) * 36;
          bot.position.z = bot.team === 'red' ? -28 : 28;
          const mesh = bot.isMutant
            ? createMutantMummyCharacter()
            : createOperativeModel(bot.characterId, bot.team, false);
          mesh.position.set(bot.position.x, bot.position.y, bot.position.z);
          this.scene.add(mesh);
          bot.meshGroup = mesh;
        }
      }, 4000);

      return true;
    }
    return false;
  }

  public clearBots() {
    this.bots.forEach((b) => {
      if (b.meshGroup) {
        this.scene.remove(b.meshGroup);
      }
    });
    this.bots = [];
  }
}
