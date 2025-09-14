// Constants for Bird boids behavior
export const BUTTON_SIZE = 50; // size used elsewhere (kept for reference)

// Boid/following behavior constants
export const DEFAULT_MAX_SPEED = 3; // how fast birds fly (pixels per frame)
export const DEFAULT_MAX_FORCE = 0.05; // how quickly birds can turn
export const DEFAULT_SEPARATION_RADIUS = 25; // personal space before avoiding
export const DEFAULT_ALIGNMENT_RADIUS = 65; // how far birds match direction
export const DEFAULT_COHESION_RADIUS = 100; // how far birds sense the flock center
export const DEFAULT_MOUSE_AVOID_RADIUS = 200; // distance birds start fleeing from cursor
export const DEFAULT_MOUSE_AVOID_FORCE = 0.2; // how strongly birds flee from cursor

// Random boid count range
export const MIN_BOID_COUNT = 20;
export const MAX_BOID_COUNT = 30;

export function randomBoidCount() {
  return (
    Math.floor(Math.random() * (MAX_BOID_COUNT - MIN_BOID_COUNT + 1)) +
    MIN_BOID_COUNT
  );
}
