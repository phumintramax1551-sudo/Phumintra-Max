import * as THREE from 'three';

export interface Tracer {
  mesh: THREE.Line;
  start: THREE.Vector3;
  end: THREE.Vector3;
  dir: THREE.Vector3;
  life: number;
  maxLife: number;
  speed: number;
}

export interface Particle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  color: THREE.Color;
  scaleDecay: boolean;
}

export class ParticleSystem {
  private scene: THREE.Scene;
  private tracers: Tracer[] = [];
  private particles: Particle[] = [];
  private danceRings: THREE.Mesh[] = [];

  // Reusable geometries
  private sparkGeo: THREE.BoxGeometry;
  private sparkMat: THREE.MeshBasicMaterial;
  private bloodMat: THREE.MeshBasicMaterial;
  private mutantBloodMat: THREE.MeshBasicMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.sparkGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    this.sparkMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.bloodMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    this.mutantBloodMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
  }

  // 1. Bullet Tracer Streak
  public addTracer(origin: THREE.Vector3, target: THREE.Vector3, color: number = 0x00f0ff) {
    const points = [origin.clone(), origin.clone()];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color, linewidth: 2, transparent: true, opacity: 0.9 });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);

    const dir = new THREE.Vector3().subVectors(target, origin).normalize();
    const dist = origin.distanceTo(target);

    this.tracers.push({
      mesh: line,
      start: origin.clone(),
      end: target.clone(),
      dir,
      life: 0,
      maxLife: Math.min(0.2, dist / 250),
      speed: 350,
    });
  }

  // 2. Surface Impact Sparks
  public addImpactSparks(point: THREE.Vector3, normal: THREE.Vector3, isFlesh: boolean = false, isMutant: boolean = false) {
    const count = isFlesh ? 8 : 12;
    const baseMat = isMutant ? this.mutantBloodMat : isFlesh ? this.bloodMat : this.sparkMat;

    for (let i = 0; i < count; i++) {
      const pMesh = new THREE.Mesh(this.sparkGeo, baseMat.clone());
      pMesh.position.copy(point);

      // Random spray around normal
      const vel = new THREE.Vector3(
        normal.x + (Math.random() - 0.5) * 1.5,
        normal.y + (Math.random() - 0.5) * 1.5 + 0.5,
        normal.z + (Math.random() - 0.5) * 1.5
      ).normalize().multiplyScalar(4 + Math.random() * 8);

      this.scene.add(pMesh);
      this.particles.push({
        mesh: pMesh,
        vel,
        life: 0,
        maxLife: 0.35 + Math.random() * 0.25,
        color: baseMat.color,
        scaleDecay: true,
      });
    }
  }

  // 3. Explosion Blast FX
  public addExplosion(center: THREE.Vector3) {
    // Shockwave ring
    const ringGeo = new THREE.RingGeometry(0.5, 1.2, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(center).add(new THREE.Vector3(0, 0.1, 0));
    this.scene.add(ring);

    // Fireball particles
    for (let i = 0; i < 30; i++) {
      const pGeo = new THREE.SphereGeometry(0.3 + Math.random() * 0.4, 6, 6);
      const pMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.4 ? 0xf97316 : 0xfacc15,
        transparent: true,
        opacity: 0.85,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.copy(center);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        Math.random() * 10 + 2,
        (Math.random() - 0.5) * 12
      );

      this.scene.add(pMesh);
      this.particles.push({
        mesh: pMesh,
        vel,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
        color: pMat.color,
        scaleDecay: true,
      });
    }
  }

  // 4. Angel Dance Healing Aura Rings
  public addDanceHealingRing(pos: THREE.Vector3) {
    const ringGeo = new THREE.TorusGeometry(0.9 + Math.random() * 0.4, 0.04, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(pos).add(new THREE.Vector3(0, 0.2, 0));

    this.scene.add(ring);
    this.particles.push({
      mesh: ring,
      vel: new THREE.Vector3(0, 2.2, 0),
      life: 0,
      maxLife: 0.8,
      color: ringMat.color,
      scaleDecay: false,
    });
  }

  // Update per frame
  public update(dt: number) {
    // 1. Update Tracers
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life += dt;
      if (t.life >= t.maxLife) {
        this.scene.remove(t.mesh);
        t.mesh.geometry.dispose();
        (t.mesh.material as THREE.Material).dispose();
        this.tracers.splice(i, 1);
      } else {
        const progress = t.life / t.maxLife;
        const currentFront = new THREE.Vector3().lerpVectors(t.start, t.end, progress);
        const currentBack = new THREE.Vector3().lerpVectors(t.start, t.end, Math.max(0, progress - 0.35));
        const positions = new Float32Array([
          currentBack.x, currentBack.y, currentBack.z,
          currentFront.x, currentFront.y, currentFront.z,
        ]);
        t.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      }
    }

    // 2. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
        this.particles.splice(i, 1);
      } else {
        // Apply physics: velocity + gravity
        p.vel.y -= 9.8 * dt;
        p.mesh.position.addScaledVector(p.vel, dt);

        const ratio = 1 - p.life / p.maxLife;
        if (p.scaleDecay) {
          p.mesh.scale.setScalar(Math.max(0.01, ratio));
        }
        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        if (mat.transparent) {
          mat.opacity = ratio;
        }
      }
    }
  }

  public dispose() {
    this.tracers.forEach((t) => {
      this.scene.remove(t.mesh);
      t.mesh.geometry.dispose();
      (t.mesh.material as THREE.Material).dispose();
    });
    this.particles.forEach((p) => {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    });
    this.tracers = [];
    this.particles = [];
  }
}
