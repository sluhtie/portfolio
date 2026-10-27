import * as THREE from "three";
import { PALETTE, SIMPLEX_3D } from "./noise";
import { pointer, scrollState } from "../lib/pointer";

/**
 * The fixed, page-wide WebGL "world" that lives behind every section:
 *  - a card-style glow field (violet top-left, lime centre, teal bottom-right)
 *  - a liquid, noise-displaced orb with iridescent rim light
 *  - orbit rings echoing the outline on the business card
 *  - a drifting particle field that parallaxes with scroll
 *
 * Each section declares a "state" (position/scale/energy of the orb). While
 * scrolling, the world blends between the states of neighbouring sections.
 */

type OrbState = {
  x: number; // fraction of half viewport width
  y: number; // fraction of half viewport height
  scale: number; // fraction of half viewport height
  alpha: number;
  distort: number;
  glow: number; // background field intensity
  hue: number; // 0 = violet-led, 0.5 = lime-led, 1 = teal-led
};

const DESKTOP_STATES: Record<string, OrbState> = {
  top: { x: 0, y: 0.02, scale: 0.6, alpha: 1, distort: 0.22, glow: 1, hue: 0.5 },
  about: { x: 0.56, y: -0.05, scale: 0.4, alpha: 0.5, distort: 0.15, glow: 0.65, hue: 0.15 },
  services: { x: -0.78, y: 0.55, scale: 0.26, alpha: 0.8, distort: 0.28, glow: 0.45, hue: 0.85 },
  work: { x: 0, y: -0.15, scale: 1.25, alpha: 0.22, distort: 0.13, glow: 0.4, hue: 0.3 },
  process: { x: -0.6, y: -0.62, scale: 0.28, alpha: 0.9, distort: 0.21, glow: 0.55, hue: 0.7 },
  contact: { x: 0, y: 0.08, scale: 0.72, alpha: 0.75, distort: 0.25, glow: 1, hue: 0.5 },
};

const MOBILE_STATES: Record<string, OrbState> = {
  top: { x: 0, y: 0.1, scale: 0.42, alpha: 0.95, distort: 0.21, glow: 1, hue: 0.5 },
  about: { x: 0.55, y: 0.55, scale: 0.28, alpha: 0.6, distort: 0.15, glow: 0.6, hue: 0.15 },
  services: { x: -0.6, y: 0.65, scale: 0.22, alpha: 0.5, distort: 0.28, glow: 0.45, hue: 0.85 },
  work: { x: 0, y: 0, scale: 0.9, alpha: 0.18, distort: 0.13, glow: 0.4, hue: 0.3 },
  process: { x: 0.55, y: 0.6, scale: 0.26, alpha: 0.5, distort: 0.21, glow: 0.5, hue: 0.7 },
  contact: { x: 0, y: 0.35, scale: 0.5, alpha: 0.55, distort: 0.25, glow: 1, hue: 0.5 },
};

const SECTION_IDS = ["top", "about", "services", "work", "process", "contact"];

const c = (hex: string) => new THREE.Color(hex);

const BG_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const BG_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uScroll;
uniform float uGlow;
uniform float uHue;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform vec3 uViolet;
uniform vec3 uLime;
uniform vec3 uTeal;
uniform vec3 uBg;
${SIMPLEX_3D}

float blob(vec2 uv, vec2 p, float r) {
  float d = length(uv - p);
  return exp(-(d * d) / (r * r));
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 st = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.05;

  // slow domain warp so the glows breathe like ink in water
  float w1 = snoise(vec3(st * 1.2, t));
  float w2 = snoise(vec3(st * 1.2 + 7.3, t + 3.1));
  st += vec2(w1, w2) * 0.12;

  // scrolling slowly swings the glows around the page centre
  float drift = uScroll * 0.00035;
  vec2 sw = vec2(sin(drift), cos(drift * 0.8)) * 0.08;
  vec2 m = uMouse * 0.04;

  vec2 pV = vec2(0.18 * aspect, 0.86 + sin(t * 3.0) * 0.04) + sw + m;
  vec2 pL = vec2(0.56 * aspect + sin(t * 2.0) * 0.05, 0.5 + cos(t * 2.3) * 0.05) - sw * 0.5 - m * 0.6;
  vec2 pT = vec2(0.86 * aspect, 0.16 + cos(t * 2.7) * 0.05) - sw + m * 0.8;

  // hue shifts which glow leads as you travel through the page
  float vW = mix(1.0, 0.55, uHue);
  float tW = mix(0.55, 1.0, uHue);
  float lW = 1.0 - abs(uHue - 0.5) * 0.9;

  float r = 0.42 * max(aspect, 1.0) * 0.75 + 0.1;
  vec3 col = uBg;
  col += uViolet * blob(st, pV, r) * 0.55 * vW;
  col += uLime * blob(st, pL, r * 0.7) * 0.2 * lW;
  col += uTeal * blob(st, pT, r * 0.85) * 0.42 * tW;
  col = mix(uBg, col, uGlow);

  // vignette
  float v = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(1.0, 1.2)));
  col *= mix(0.55, 1.0, v);

  // dither to kill banding
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (n - 0.5) / 255.0 * 2.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

const ORB_VERT = /* glsl */ `
uniform float uTime;
uniform float uDistort;
uniform float uFreq;
uniform float uEnergy;
varying vec3 vNormal;
varying vec3 vObjNormal;
varying vec3 vViewPos;
varying float vDisp;
${SIMPLEX_3D}

float field(vec3 p) {
  float t = uTime * 0.22;
  float n = snoise(p * uFreq + vec3(t, t * 0.8, -t * 0.6));
  n += 0.18 * snoise(p * uFreq * 2.2 - vec3(t * 1.3));
  return n * (uDistort + uEnergy * 0.12);
}

vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}

void main() {
  vec3 n = normalize(normal);
  float d = field(position);
  vec3 displaced = position + n * d;

  // recompute the normal from two nearby displaced neighbours
  float eps = 0.01;
  vec3 tA = orthogonal(n);
  vec3 tB = normalize(cross(n, tA));
  vec3 pA = position + tA * eps;
  vec3 pB = position + tB * eps;
  vec3 nA = normalize(pA);
  vec3 nB = normalize(pB);
  pA += nA * field(pA);
  pB += nB * field(pB);
  vec3 newN = normalize(cross(pA - displaced, pB - displaced));

  vDisp = d;
  vObjNormal = newN;
  vNormal = normalize(normalMatrix * newN);
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const ORB_FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uAlpha;
uniform float uHue;
uniform vec3 uViolet;
uniform vec3 uLime;
uniform vec3 uTeal;
varying vec3 vNormal;
varying vec3 vObjNormal;
varying vec3 vViewPos;
varying float vDisp;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(-vViewPos);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.2);

  // card mapping: violet up-left, teal down-right, lime in the "core"
  vec3 on = normalize(vObjNormal);
  float wV = smoothstep(-0.2, 0.9, dot(on, normalize(vec3(-1.0, 1.0, 0.4))));
  float wT = smoothstep(-0.2, 0.9, dot(on, normalize(vec3(1.0, -1.0, 0.4))));
  float wL = smoothstep(0.05, 0.45, vDisp + 0.15) * (0.4 + 0.6 * (1.0 - abs(uHue - 0.5)));
  wV *= mix(1.15, 0.6, uHue);
  wT *= mix(0.6, 1.15, uHue);

  vec3 tint = uViolet * wV + uTeal * wT + uLime * wL * 0.65;

  // thin-film shimmer, kept inside the palette
  float film = 0.5 + 0.5 * sin(vDisp * 14.0 + fres * 6.0 - uTime * 0.6);
  vec3 sheen = mix(uViolet, uTeal, film);
  sheen = mix(sheen, uLime, smoothstep(0.75, 1.0, film) * 0.5);

  vec3 L = normalize(vec3(-0.5, 0.8, 0.6));
  float diff = max(dot(n, L), 0.0);
  float spec = pow(max(dot(reflect(-L, n), v), 0.0), 48.0);

  vec3 col = vec3(0.018, 0.016, 0.026);
  col += tint * (0.12 + diff * 0.28);
  col += sheen * fres * 1.15;
  col += vec3(1.0) * spec * 0.35;
  col += uLime * pow(fres, 5.0) * 0.25;

  gl_FragColor = vec4(col, uAlpha);
}
`;

const GLOW_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uAlpha;
uniform float uTime;
void main() {
  vec2 p = vUv - 0.5;
  float d = length(p);
  float a = smoothstep(0.5, 0.0, d);
  a = pow(a, 2.4);
  float ang = atan(p.y, p.x);
  vec3 col = mix(uColorA, uColorB, 0.5 + 0.5 * sin(ang + uTime * 0.2));
  gl_FragColor = vec4(col * a * uAlpha, 1.0);
}
`;

const PARTICLE_VERT = /* glsl */ `
attribute float aSize;
attribute float aSeed;
attribute vec3 aColor;
uniform float uTime;
uniform float uScroll;
uniform float uPixelRatio;
uniform vec2 uMouse;
varying vec3 vColor;
varying float vTwinkle;
void main() {
  vec3 p = position;
  float depth = (p.z + 8.0) / 10.0; // 0 far … 1 near
  p.y = mod(p.y + uScroll * (0.0006 + depth * 0.0012) + uTime * 0.02 * (0.3 + aSeed) + 7.0, 14.0) - 7.0;
  p.x += sin(uTime * 0.2 + aSeed * 30.0) * 0.08;
  p.xy += uMouse * depth * 0.25;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * (12.0 / -mv.z);
  vColor = aColor;
  vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 50.0);
}
`;

const PARTICLE_FRAG = /* glsl */ `
precision highp float;
varying vec3 vColor;
varying float vTwinkle;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  gl_FragColor = vec4(vColor * a * vTwinkle, 1.0);
}
`;

function squircle(points = 220, n = 4, r = 1) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const x = Math.sign(ca) * Math.pow(Math.abs(ca), 2 / n) * r;
    const y = Math.sign(sa) * Math.pow(Math.abs(sa), 2 / n) * r;
    pts.push(new THREE.Vector3(x, y, 0));
  }
  return pts;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

export class World {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private bgScene = new THREE.Scene();
  private bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private raf = 0;
  private running = false;
  private disposed = false;

  private bgMat: THREE.ShaderMaterial;
  private orbMat: THREE.ShaderMaterial;
  private glowMat: THREE.ShaderMaterial;
  private particleMat: THREE.ShaderMaterial;

  private orbGroup = new THREE.Group();
  private orb: THREE.Mesh;
  private rings = new THREE.Group();
  private satellite: THREE.Mesh;
  private particles: THREE.Points;

  private anchors: { id: string; top: number }[] = [];
  private state: OrbState = { ...DESKTOP_STATES.top };
  private mobile = false;
  private reduced = false;
  private intro = 0; // 0 → 1 once the preloader lifts
  private introTarget = 0;
  private mouse = new THREE.Vector2();
  private energy = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.mobile = window.matchMedia("(max-width: 767px)").matches;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.mobile,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(c(PALETTE.bg), 1);
    this.renderer.autoClear = false;

    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    this.camera.position.set(0, 0, 6);

    const palette = {
      uViolet: { value: c(PALETTE.violet) },
      uLime: { value: c(PALETTE.lime) },
      uTeal: { value: c(PALETTE.teal) },
    };

    // --- background field ---
    this.bgMat = new THREE.ShaderMaterial({
      vertexShader: BG_VERT,
      fragmentShader: BG_FRAG,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uGlow: { value: 1 },
        uHue: { value: 0.5 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2() },
        uBg: { value: c(PALETTE.bg) },
        uViolet: { value: c(PALETTE.violetDeep) },
        uLime: { value: c(PALETTE.olive) },
        uTeal: { value: c(PALETTE.tealDeep) },
      },
    });
    this.bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.bgMat));

    // --- orb ---
    const detail = this.mobile ? 28 : 56;
    this.orbMat = new THREE.ShaderMaterial({
      vertexShader: ORB_VERT,
      fragmentShader: ORB_FRAG,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uDistort: { value: 0.3 },
        uFreq: { value: 0.9 },
        uEnergy: { value: 0 },
        uAlpha: { value: 1 },
        uHue: { value: 0.5 },
        ...palette,
      },
    });
    this.orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1, detail), this.orbMat);

    this.glowMat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: GLOW_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColorA: { value: c(PALETTE.violet) },
        uColorB: { value: c(PALETTE.teal) },
        uAlpha: { value: 0.35 },
        uTime: { value: 0 },
      },
    });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.4), this.glowMat);
    glow.position.z = -1.2;
    glow.renderOrder = -1;

    // --- rings (the outline from the business card + an orbit) ---
    const lineMat = (color: string, opacity: number) =>
      new THREE.LineBasicMaterial({ color: c(color), transparent: true, opacity, depthWrite: false });

    const cardRing = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(squircle(260, 3.2, 1.55)),
      lineMat("#ecebe4", 0.22)
    );
    cardRing.rotation.z = Math.PI / 4.6;

    const orbitPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 200; i++) {
      const a = (i / 200) * Math.PI * 2;
      orbitPts.push(new THREE.Vector3(Math.cos(a) * 1.9, Math.sin(a) * 1.9, 0));
    }
    const orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitPts), lineMat(PALETTE.lime, 0.16));
    orbit.rotation.set(1.15, 0.25, 0);

    this.satellite = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshBasicMaterial({ color: c(PALETTE.lime) })
    );
    orbit.add(this.satellite);

    this.rings.add(cardRing, orbit);
    this.orbGroup.add(glow, this.orb, this.rings);
    this.scene.add(this.orbGroup);

    // --- particles ---
    const count = this.mobile ? 650 : 1600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const seed = new Float32Array(count);
    const choices = [c(PALETTE.violet), c(PALETTE.lime), c(PALETTE.teal), c("#ecebe4")];
    const weights = [0.32, 0.18, 0.32, 0.18];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = -8 + Math.random() * 10;
      let r = Math.random();
      let k = 0;
      while (k < weights.length - 1 && r > weights[k]) r -= weights[k++];
      const cc = choices[k];
      const dim = 0.35 + Math.random() * 0.65;
      col[i * 3] = cc.r * dim;
      col[i * 3 + 1] = cc.g * dim;
      col[i * 3 + 2] = cc.b * dim;
      size[i] = 0.6 + Math.pow(Math.random(), 3) * 3.2;
      seed[i] = Math.random();
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pg.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    pg.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    pg.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    this.particleMat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uPixelRatio: { value: 1 },
        uMouse: { value: new THREE.Vector2() },
      },
    });
    this.particles = new THREE.Points(pg, this.particleMat);
    this.particles.frustumCulled = false;
    this.scene.add(this.particles);

    this.resize();
    window.addEventListener("resize", this.resize);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.measure();
  }

  /** Re-read section offsets (call after layout changes). */
  measure = () => {
    this.anchors = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      return el ? { id, top: el.getBoundingClientRect().top + window.scrollY } : null;
    }).filter(Boolean) as { id: string; top: number }[];
  };

  setIntro(v: number) {
    this.introTarget = v;
  }

  private resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.mobile = w < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, this.mobile ? 1.5 : 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.bgMat.uniforms.uRes.value.set(w, h);
    this.particleMat.uniforms.uPixelRatio.value = dpr;
    this.measure();
  };

  private onVisibility = () => {
    if (document.hidden) this.stop();
    else this.start();
  };

  private targetState(): OrbState {
    const states = this.mobile ? MOBILE_STATES : DESKTOP_STATES;
    const vh = window.innerHeight;
    const y = scrollState.y;
    const s: OrbState = { ...states[this.anchors[0]?.id ?? "top"] };
    for (let i = 1; i < this.anchors.length; i++) {
      const a = this.anchors[i];
      const k = Math.min(1, Math.max(0, (y + vh - a.top) / (vh * 0.75)));
      if (k <= 0) break;
      const next = states[a.id];
      const e = smooth(k);
      (Object.keys(s) as (keyof OrbState)[]).forEach((key) => {
        s[key] = lerp(s[key], next[key], e);
      });
    }
    return s;
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.clock.start();
    const loop = () => {
      if (!this.running) return;
      this.render();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private elapsed = 0;

  private render() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.elapsed += dt * (this.reduced ? 0.25 : 1);
    const t = this.elapsed;

    // eased inputs
    this.mouse.x += (pointer.x - this.mouse.x) * 0.05;
    this.mouse.y += (pointer.y - this.mouse.y) * 0.05;
    const vel = Math.min(1, Math.abs(scrollState.velocity) / 60);
    this.energy += (Math.max(vel, pointer.speed * 0.6) - this.energy) * 0.06;
    this.intro += (this.introTarget - this.intro) * 0.035;

    const target = this.targetState();
    const k = 0.08;
    (Object.keys(this.state) as (keyof OrbState)[]).forEach((key) => {
      this.state[key] += (target[key] - this.state[key]) * k;
    });

    const halfH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.position.z;
    const halfW = halfH * this.camera.aspect;
    const s = this.state;
    const introScale = 0.2 + 0.8 * smooth(Math.min(1, this.intro));

    this.orbGroup.position.set(s.x * halfW, s.y * halfH, 0);
    this.orbGroup.scale.setScalar(s.scale * halfH * introScale);
    this.orbGroup.rotation.x = -this.mouse.y * 0.25;
    this.orbGroup.rotation.y = this.mouse.x * 0.35;

    this.orb.rotation.y = t * 0.08;
    this.orb.rotation.z = t * 0.05;
    this.rings.children[0].rotation.z = Math.PI / 4.6 + t * 0.04 + scrollState.y * 0.0004;
    this.rings.children[1].rotation.z = t * 0.25;
    const sa = t * 0.9;
    this.satellite.position.set(Math.cos(sa) * 1.9, Math.sin(sa) * 1.9, 0);

    const alpha = s.alpha * Math.min(1, this.intro * 1.4);
    this.orbMat.uniforms.uTime.value = t;
    this.orbMat.uniforms.uDistort.value = s.distort;
    this.orbMat.uniforms.uEnergy.value = this.energy;
    this.orbMat.uniforms.uAlpha.value = alpha;
    this.orbMat.uniforms.uHue.value = s.hue;
    this.glowMat.uniforms.uAlpha.value = 0.32 * alpha;
    this.glowMat.uniforms.uTime.value = t;
    ((this.rings.children[0] as THREE.Line).material as THREE.LineBasicMaterial).opacity = 0.22 * alpha;
    ((this.rings.children[1] as THREE.Line).material as THREE.LineBasicMaterial).opacity = 0.18 * alpha;

    this.bgMat.uniforms.uTime.value = t;
    this.bgMat.uniforms.uScroll.value = scrollState.y;
    this.bgMat.uniforms.uGlow.value = s.glow * (0.35 + 0.65 * Math.min(1, this.intro));
    this.bgMat.uniforms.uHue.value = s.hue;
    this.bgMat.uniforms.uMouse.value.copy(this.mouse);

    this.particleMat.uniforms.uTime.value = t;
    this.particleMat.uniforms.uScroll.value = scrollState.y;
    this.particleMat.uniforms.uMouse.value.copy(this.mouse);

    this.camera.position.x = this.mouse.x * 0.12;
    this.camera.position.y = this.mouse.y * 0.08;
    this.camera.lookAt(0, 0, 0);

    this.renderer.clear();
    this.renderer.render(this.bgScene, this.bgCamera);
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    window.removeEventListener("resize", this.resize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    this.bgMat.dispose();
    this.renderer.dispose();
  }
}
