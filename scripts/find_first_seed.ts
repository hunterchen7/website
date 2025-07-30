const manifest: any[] = [];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 314431) % 24377;
    return value / 44333;
  };
}

const target = "HC_09897.jpg";
const seeds: number[] = [];
let seed = 1;
while (seeds.length < 5 && seed < 100000) {
  const rand = seededRandom(seed);
  let arr = [...manifest];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr[0].url === target) {
    seeds.push(seed);
    console.log("Seed:", seed);
  }
  seed++;
}
console.log("Seeds where target is first:", seeds);

// To run: npx ts-node scripts/find_seeds_for_01728_first.ts
