import {
  DEFAULT_MAX_SPEED,
  DEFAULT_MAX_FORCE,
  DEFAULT_SEPARATION_RADIUS,
  DEFAULT_ALIGNMENT_RADIUS,
  DEFAULT_COHESION_RADIUS,
  DEFAULT_MOUSE_AVOID_RADIUS,
  DEFAULT_MOUSE_AVOID_FORCE,
} from "../constants/bird";

export interface Boid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface MousePosition {
  x: number;
  y: number;
}

// Helper: vector length
function len(v: { x: number; y: number }) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

// Small epsilon to avoid division by zero producing extreme forces
const EPS = 1e-6;

export function separate(
  boid: Boid,
  neighbors: Boid[],
  separationRadius = DEFAULT_SEPARATION_RADIUS,
  maxSpeed = DEFAULT_MAX_SPEED,
  maxForce = DEFAULT_MAX_FORCE
) {
  let steer = { x: 0, y: 0 };
  let count = 0;

  neighbors.forEach((other) => {
    const dx = boid.x - other.x;
    const dy = boid.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > EPS && distance < separationRadius) {
      const diff = { x: dx / (distance + EPS), y: dy / (distance + EPS) };
      // Weight inversely by distance to push harder when very close
      diff.x /= distance;
      diff.y /= distance;
      steer.x += diff.x;
      steer.y += diff.y;
      count++;
    }
  });

  if (count > 0) {
    steer.x /= count;
    steer.y /= count;
    const length = len(steer);
    if (length > EPS) {
      // Desired velocity
      const desired = {
        x: (steer.x / length) * maxSpeed,
        y: (steer.y / length) * maxSpeed,
      };
      // Steering = desired - current velocity
      steer.x = desired.x - boid.vx;
      steer.y = desired.y - boid.vy;
      // Limit force
      const forceLength = len(steer);
      if (forceLength > maxForce) {
        steer.x = (steer.x / forceLength) * maxForce;
        steer.y = (steer.y / forceLength) * maxForce;
      }
    }
  }

  return steer;
}

export function align(
  boid: Boid,
  neighbors: Boid[],
  alignmentRadius = DEFAULT_ALIGNMENT_RADIUS,
  maxSpeed = DEFAULT_MAX_SPEED,
  maxForce = DEFAULT_MAX_FORCE
) {
  let sum = { x: 0, y: 0 };
  let count = 0;

  neighbors.forEach((other) => {
    const dx = boid.x - other.x;
    const dy = boid.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > EPS && distance < alignmentRadius) {
      sum.x += other.vx;
      sum.y += other.vy;
      count++;
    }
  });

  if (count > 0) {
    sum.x /= count;
    sum.y /= count;
    const length = len(sum);
    if (length > EPS) {
      const desired = {
        x: (sum.x / length) * maxSpeed,
        y: (sum.y / length) * maxSpeed,
      };
      const steer = { x: desired.x - boid.vx, y: desired.y - boid.vy };
      const forceLength = len(steer);
      if (forceLength > maxForce) {
        steer.x = (steer.x / forceLength) * maxForce;
        steer.y = (steer.y / forceLength) * maxForce;
      }
      return steer;
    }
  }

  return { x: 0, y: 0 };
}

export function cohesion(
  boid: Boid,
  neighbors: Boid[],
  cohesionRadius = DEFAULT_COHESION_RADIUS,
  maxSpeed = DEFAULT_MAX_SPEED,
  maxForce = DEFAULT_MAX_FORCE
) {
  let sum = { x: 0, y: 0 };
  let count = 0;

  neighbors.forEach((other) => {
    const dx = boid.x - other.x;
    const dy = boid.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > EPS && distance < cohesionRadius) {
      sum.x += other.x;
      sum.y += other.y;
      count++;
    }
  });

  if (count > 0) {
    sum.x /= count;
    sum.y /= count;
    const steerToCenter = { x: sum.x - boid.x, y: sum.y - boid.y };
    const length = len(steerToCenter);
    if (length > EPS) {
      const desired = {
        x: (steerToCenter.x / length) * maxSpeed,
        y: (steerToCenter.y / length) * maxSpeed,
      };
      const steer = { x: desired.x - boid.vx, y: desired.y - boid.vy };
      const forceLength = len(steer);
      if (forceLength > maxForce) {
        steer.x = (steer.x / forceLength) * maxForce;
        steer.y = (steer.y / forceLength) * maxForce;
      }
      return steer;
    }
  }

  return { x: 0, y: 0 };
}

export function avoidMouse(
  boid: Boid,
  mouse: MousePosition,
  mouseAvoidRadius = DEFAULT_MOUSE_AVOID_RADIUS,
  maxSpeed = DEFAULT_MAX_SPEED,
  mouseAvoidForce = DEFAULT_MOUSE_AVOID_FORCE
) {
  const dx = boid.x - mouse.x;
  const dy = boid.y - mouse.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > EPS && distance < mouseAvoidRadius) {
    const steerDir = { x: dx / (distance + EPS), y: dy / (distance + EPS) };
    const desired = { x: steerDir.x * maxSpeed, y: steerDir.y * maxSpeed };
    const steer = { x: desired.x - boid.vx, y: desired.y - boid.vy };
    const intensity = (mouseAvoidRadius - distance) / mouseAvoidRadius;
    steer.x *= intensity * 4;
    steer.y *= intensity * 4;
    const forceLength = len(steer);
    if (forceLength > mouseAvoidForce) {
      steer.x = (steer.x / forceLength) * mouseAvoidForce;
      steer.y = (steer.y / forceLength) * mouseAvoidForce;
    }
    return steer;
  }

  return { x: 0, y: 0 };
}

export function upwardBias() {
  return { x: 0, y: -0.02 };
}

export function getRotation(boid: Boid) {
  return Math.atan2(boid.vy, boid.vx) * (180 / Math.PI);
}

export function getBoidStyle(boid: Boid) {
  const violetShades = [
    [124, 58, 237], // violet-600
    [109, 40, 217], // violet-700
    [91, 33, 182], // violet-800
    [76, 29, 149], // violet-900
  ];

  const colorIndex = (boid.id * 3) % 4;
  const [r, g, b] = violetShades[colorIndex];
  const opacity = (60 + ((boid.id * 7) % 31)) / 100;

  return {
    "border-bottom-color": `rgba(${r}, ${g}, ${b}, ${opacity})`,
    transform: "translateX(-50%) translateY(-50%) rotate(90deg)",
  };
}

export function createInitialBoids(count: number) {
  if (typeof window === "undefined") return [] as Boid[];
  const arr: Boid[] = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    });
  }
  return arr;
}
