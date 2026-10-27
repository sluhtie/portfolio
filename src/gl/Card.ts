import * as THREE from "three";
import { PALETTE } from "./noise";
import { pointer } from "../lib/pointer";

export type CardCopy = {
  name: string;
  location: string;
  role: string;
  email: string;
  site: string;
  brand: string;
};

const W = 1;
const H = 1.28;
const TEX_W = 1024;
const TEX_H = Math.round(TEX_W * (H / W));

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, a: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color.replace("ALPHA", String(a)));
  g.addColorStop(0.45, color.replace("ALPHA", String(a * 0.45)));
  g.addColorStop(1, color.replace("ALPHA", "0"));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
}

function grain(ctx: CanvasRenderingContext2D, amount: number) {
  const img = ctx.getImageData(0, 0, TEX_W, TEX_H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function squirclePath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) {
  ctx.beginPath();
  const n = 3.2;
  for (let i = 0; i <= 240; i++) {
    const a = (i / 240) * Math.PI * 2;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const x = Math.sign(ca) * Math.pow(Math.abs(ca), 2 / n) * r;
    const y = Math.sign(sa) * Math.pow(Math.abs(sa), 2 / n) * r;
    const rx = x * Math.cos(rot) - y * Math.sin(rot);
    const ry = x * Math.sin(rot) + y * Math.cos(rot);
    if (i === 0) ctx.moveTo(cx + rx, cy + ry);
    else ctx.lineTo(cx + rx, cy + ry);
  }
  ctx.closePath();
}

/** Front: a faithful rendition of the printed business card. */
export function drawFront(copy: CardCopy) {
  const cv = document.createElement("canvas");
  cv.width = TEX_W;
  cv.height = TEX_H;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#0d0c11";
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  glow(ctx, TEX_W * 0.2, TEX_H * 0.1, TEX_W * 0.7, "rgba(110,72,220,ALPHA)", 1);
  glow(ctx, TEX_W * 0.6, TEX_H * 0.42, TEX_W * 0.45, "rgba(140,175,25,ALPHA)", 0.75);
  glow(ctx, TEX_W * 0.9, TEX_H * 0.82, TEX_W * 0.6, "rgba(25,185,155,ALPHA)", 1);
  grain(ctx, 14);

  squirclePath(ctx, TEX_W * 0.55, TEX_H * 0.44, TEX_W * 0.42, Math.PI / 4.6);
  ctx.strokeStyle = "rgba(236,235,228,0.2)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${TEX_W * 0.27}px "Clash Display", "General Sans", sans-serif`;
  ctx.fillStyle = "rgba(160,170,140,0.34)";
  ctx.fillText("CW", TEX_W * 0.5, TEX_H * 0.49);

  ctx.font = `500 ${TEX_W * 0.034}px "General Sans", sans-serif`;
  ctx.fillStyle = "rgba(236,235,228,0.78)";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText(copy.name, TEX_W * 0.06, TEX_H * 0.94);
  ctx.textAlign = "right";
  ctx.fillText(copy.location, TEX_W * 0.94, TEX_H * 0.94);
  return cv;
}

/** Back: contact side. */
export function drawBack(copy: CardCopy) {
  const cv = document.createElement("canvas");
  cv.width = TEX_W;
  cv.height = TEX_H;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#0b0a0e";
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  glow(ctx, TEX_W * 0.95, TEX_H * 0.05, TEX_W * 0.6, "rgba(22,165,140,ALPHA)", 0.45);
  glow(ctx, TEX_W * 0.05, TEX_H * 1.0, TEX_W * 0.7, "rgba(98,64,200,ALPHA)", 0.5);
  grain(ctx, 12);

  const pad = TEX_W * 0.08;
  // mark
  ctx.strokeStyle = PALETTE.lime;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(pad + 34, pad + 34, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = PALETTE.lime;
  ctx.beginPath();
  ctx.arc(pad + 34, pad + 34, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "right";
  ctx.font = `600 ${TEX_W * 0.032}px "Clash Display", sans-serif`;
  ctx.fillStyle = "rgba(236,235,228,0.9)";
  ctx.fillText(copy.brand, TEX_W - pad, pad + 46);

  ctx.textAlign = "left";
  ctx.font = `600 ${TEX_W * 0.1}px "Clash Display", sans-serif`;
  ctx.fillStyle = "#ecebe4";
  const [first, ...rest] = copy.name.split(" ");
  ctx.fillText(first, pad, TEX_H * 0.5);
  ctx.fillText(rest.join(" "), pad, TEX_H * 0.5 + TEX_W * 0.105);

  ctx.font = `500 ${TEX_W * 0.03}px "General Sans", sans-serif`;
  ctx.fillStyle = "rgba(236,235,228,0.55)";
  ctx.fillText(copy.role.toUpperCase().split("").join(String.fromCharCode(8202)), pad, TEX_H * 0.5 + TEX_W * 0.19);

  const g = ctx.createLinearGradient(pad, 0, TEX_W - pad, 0);
  g.addColorStop(0, PALETTE.violet);
  g.addColorStop(0.5, PALETTE.lime);
  g.addColorStop(1, PALETTE.teal);
  ctx.fillStyle = g;
  ctx.fillRect(pad, TEX_H * 0.78, TEX_W - pad * 2, 3);

  ctx.font = `500 ${TEX_W * 0.034}px "General Sans", sans-serif`;
  ctx.fillStyle = "rgba(236,235,228,0.85)";
  ctx.fillText(copy.email, pad, TEX_H * 0.86);
  ctx.fillStyle = "rgba(236,235,228,0.55)";
  ctx.fillText(copy.site, pad, TEX_H * 0.91);
  ctx.textAlign = "right";
  ctx.fillText(copy.location, TEX_W - pad, TEX_H * 0.91);
  return cv;
}

const CARD_VERT = /* glsl */ `
varying vec2 vUv;
varying float vFront;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vUv = uv;
  vFront = step(0.0, normal.z);
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const CARD_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uFront;
uniform sampler2D uBack;
uniform float uTilt;
uniform vec3 uViolet;
uniform vec3 uLime;
uniform vec3 uTeal;
varying vec2 vUv;
varying float vFront;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec2 uv = vUv;
  vec3 base = vFront > 0.5
    ? texture2D(uFront, uv).rgb
    : texture2D(uBack, vec2(1.0 - uv.x, uv.y)).rgb;

  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);

  // holographic foil sweeping across as the card tilts
  float band = sin((uv.x * 1.4 + uv.y) * 5.0 + uTilt * 5.0);
  float foil = smoothstep(0.75, 1.0, band);
  vec3 holo = mix(uViolet, uTeal, uv.x);
  holo = mix(holo, uLime, smoothstep(0.4, 0.9, uv.y) * 0.4);

  vec3 col = base;
  col += holo * foil * 0.12;
  col += holo * fres * 0.5;
  gl_FragColor = vec4(col, 1.0);
}
`;

export class Card3D {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  private group = new THREE.Group();
  private mat: THREE.ShaderMaterial;
  private frontTex?: THREE.CanvasTexture;
  private backTex?: THREE.CanvasTexture;
  private raf = 0;
  private running = false;
  private clock = new THREE.Clock();
  private t = 0;

  /** 0..1 progress of the card's section through the viewport */
  progress = 0;
  hover = false;
  flipped = false;
  private flip = 0;
  private tiltX = 0;
  private tiltY = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.set(0, 0, 3.6);

    const depth = 0.018;
    const geo = new THREE.ExtrudeGeometry(roundedRect(W, H, 0.045), {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 2,
      curveSegments: 10,
    });
    geo.translate(0, 0, -depth / 2);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, (pos.getX(i) + W / 2) / W, (pos.getY(i) + H / 2) / H);
    }
    uv.needsUpdate = true;

    this.mat = new THREE.ShaderMaterial({
      vertexShader: CARD_VERT,
      fragmentShader: CARD_FRAG,
      uniforms: {
        uFront: { value: null },
        uBack: { value: null },
        uTilt: { value: 0 },
        uViolet: { value: new THREE.Color(PALETTE.violet) },
        uLime: { value: new THREE.Color(PALETTE.lime) },
        uTeal: { value: new THREE.Color(PALETTE.teal) },
      },
    });
    const edge = new THREE.MeshBasicMaterial({ color: new THREE.Color("#2a2733") });
    const mesh = new THREE.Mesh(geo, [this.mat, edge]);
    this.group.add(mesh);
    this.scene.add(this.group);
    this.resize();
  }

  setCopy(copy: CardCopy) {
    this.frontTex?.dispose();
    this.backTex?.dispose();
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.frontTex = new THREE.CanvasTexture(drawFront(copy));
    this.backTex = new THREE.CanvasTexture(drawBack(copy));
    for (const tex of [this.frontTex, this.backTex]) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
    }
    this.mat.uniforms.uFront.value = this.frontTex;
    this.mat.uniforms.uBack.value = this.backTex;
  }

  resize = () => {
    const r = this.canvas.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // keep the whole card in frame on any aspect ratio
    const tan = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const fitH = (H * 1.18) / 2 / tan;
    const fitW = (W * 1.5) / 2 / tan / this.camera.aspect;
    this.camera.position.z = Math.max(fitH, fitW);
    this.camera.updateProjectionMatrix();
  };

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();
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

  private render() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.t += dt;
    const p = this.progress;
    const sm = (a: number, b: number, x: number) => {
      const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return k * k * (3 - 2 * k);
    };

    this.flip += ((this.flipped ? 1 : 0) - this.flip) * 0.08;
    const tx = this.hover ? pointer.y * 0.35 : 0;
    const ty = this.hover ? pointer.x * 0.45 : 0;
    this.tiltX += (tx - this.tiltX) * 0.08;
    this.tiltY += (ty - this.tiltY) * 0.08;

    const scrollSpin = -0.35 + sm(0.42, 0.78, p) * Math.PI + (p - 0.5) * 0.5;
    this.group.rotation.y = scrollSpin + this.flip * Math.PI + this.tiltY;
    this.group.rotation.x = -0.12 + (0.5 - p) * 0.35 - this.tiltX;
    this.group.rotation.z = 0.06 + Math.sin(this.t * 0.6) * 0.03;
    this.group.position.y = Math.sin(this.t * 0.9) * 0.03;
    this.mat.uniforms.uTilt.value = this.group.rotation.y + this.group.rotation.x;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    this.frontTex?.dispose();
    this.backTex?.dispose();
    this.scene.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
    this.mat.dispose();
    this.renderer.dispose();
  }
}
