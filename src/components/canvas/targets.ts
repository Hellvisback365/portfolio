/**
 * I cinque stati del campo di particelle. Ogni generatore restituisce
 * un Float32Array di N*3 posizioni, calcolato una volta sola al mount.
 *
 * Il filo conduttore è il brief: precisione matematica + organico.
 * Lo stato hero è una sfera a fillotassi — l'angolo aureo che dispone
 * i semi del girasole — cioè il punto esatto in cui la matematica
 * incontra l'agricoltura.
 */

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ≈ 2.39996 rad

/** PRNG deterministico (mulberry32): stessa scena ad ogni load. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 0 · HERO — Sfera a fillotassi (reticolo di Fibonacci sferico). */
export function phylloSphere(n: number, radius = 4.6): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const y = 1 - 2 * t;                    // da +1 a −1
    const r = Math.sqrt(1 - y * y);
    const phi = GOLDEN_ANGLE * i;
    out[i * 3 + 0] = Math.cos(phi) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(phi) * r * radius;
  }
  return out;
}

/** 1 · ABOUT — Campo d'onda a filari: superficie sinusoidale con
 *  le particelle agganciate a righe regolari, come una semina. */
export function waveField(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = rng(11);
  const ROWS = 16;
  for (let i = 0; i < n; i++) {
    const x = (rand() * 2 - 1) * 8.2;
    const row = Math.floor(rand() * ROWS);
    const z = (row / (ROWS - 1) - 0.5) * 7.0 + (rand() - 0.5) * 0.12;
    const y =
      Math.sin(x * 0.55 + z * 1.25) * 1.05 +
      Math.sin(z * 1.7 + 1.3) * 0.45 -
      0.4;
    out[i * 3 + 0] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z * 0.62; // compresso verso la camera
  }
  return out;
}

/** 2 · SKILLS — Anello planetario frontale (inclusivo): un cerchio di stelle che abbraccia le skills. */
export function lattice(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = rng(23);
  for (let i = 0; i < n; i++) {
    const angle = rand() * Math.PI * 2;
    
    // Il frustum della camera a Z=14 copre circa X: [-9.5, 9.5] e Y: [-5.3, 5.3].
    // Per far sì che l'anello sia visibile e denso, i raggi devono stare in questi limiti.
    const radiusFactor = Math.pow(rand(), 1.5); 
    
    // Raggio X: da 2.5 (buco centrale) a 8.5 (bordo schermo)
    const rx = 3.0 + radiusFactor * 6.5; 
    // Raggio Y: da 1.5 a 4.8 (bordo verticale schermo)
    const ry = 1.8 + radiusFactor * 3.5;  
    
    // Spessore 3D dell'anello: maggiore al centro della fascia, minore ai bordi
    const thickness = (rand() - 0.5) * 4.0 * (1 - radiusFactor);

    out[i * 3 + 0] = Math.cos(angle) * rx;
    out[i * 3 + 1] = Math.sin(angle) * ry;
    out[i * 3 + 2] = thickness;
  }
  return out;
}

/** 3 · PROJECTS — Quattro costellazioni orbitali, una per progetto. */
export function clusters(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = rng(47);
  const centers: Array<[number, number, number]> = [
    [-3.4, 1.7, -0.6],
    [3.4, 1.5, 0.4],
    [-3.1, -1.8, 0.5],
    [3.2, -1.7, -0.5],
  ];
  const dust = Math.floor(n * 0.08);
  const perCluster = Math.floor((n - dust) / centers.length);
  let i = 0;
  for (let c = 0; c < centers.length; c++) {
    const [cx, cy, cz] = centers[c];
    const count = c === centers.length - 1 ? n - dust - perCluster * 3 : perCluster;
    for (let k = 0; k < count; k++, i++) {
      // mini-fillotassi locale: ogni progetto è un piccolo seme
      const t = (k + 0.5) / count;
      const y = 1 - 2 * t;
      const r = Math.sqrt(1 - y * y);
      const phi = GOLDEN_ANGLE * k;
      const radius = 1.45 * (0.55 + 0.45 * rand());
      out[i * 3 + 0] = cx + Math.cos(phi) * r * radius;
      out[i * 3 + 1] = cy + y * radius * 0.9;
      out[i * 3 + 2] = cz + Math.sin(phi) * r * radius;
    }
  }
  for (; i < n; i++) {
    out[i * 3 + 0] = (rand() * 2 - 1) * 7.5;
    out[i * 3 + 1] = (rand() * 2 - 1) * 4.0;
    out[i * 3 + 2] = (rand() * 2 - 1) * 2.5;
  }
  return out;
}

/** 4 · CONTACT — Anello di convergenza: quiete, un cerchio aperto. */
export function ring(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = rng(89);
  const R = 4.3;
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2;
    const jitter = 0.16;
    const wobble = Math.sin(theta * 3) * 0.18;
    out[i * 3 + 0] = Math.cos(theta) * (R + (rand() - 0.5) * jitter);
    out[i * 3 + 1] = wobble + (rand() - 0.5) * jitter * 1.6;
    out[i * 3 + 2] = Math.sin(theta) * (R + (rand() - 0.5) * jitter) * 0.55;
  }
  return out;
}

export function buildAllTargets(n: number): Float32Array[] {
  return [phylloSphere(n), waveField(n), lattice(n), clusters(n), ring(n)];
}
