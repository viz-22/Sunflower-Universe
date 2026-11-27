import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Heart, Moon, Sparkles, Sun, X } from 'lucide-react';
import { GardenFlowerMessage, SUNFLOWER_CONTENT } from '../config/sunflowerContent';
import { SunlightTheme } from '../utils/universeState';
import { IllustratedBoy } from './StoryCharacters';

interface SunflowerGarden3DProps {
  mode: 'main' | 'secret';
  sunlightTheme: SunlightTheme;
  eveningMode: boolean;
  visitedFlowers: number[];
  unusualComforted: boolean;
  discoveredSurprises: string[];
  onFlowerVisited: (id: number) => void;
  onEnterSecretGarden: () => void;
  onExitSecretGarden: () => void;
  onComfortUnusualSunflower: () => void;
  onUnusualFocused: (focused: boolean) => void;
  onDiscoverSurprise: (id: string) => void;
  onPlaySfx: (kind: 'petal' | 'water' | 'sun' | 'bloom' | 'letter' | 'sparkle') => void;
}

// Reusable module-level math helpers (zero GC inside animation loop)
const _vec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();
const _targetSkyColor = new THREE.Color();
const _targetLightColor = new THREE.Color();
const _targetHemiColor = new THREE.Color();

function createSeedDiskTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 128);
  grad.addColorStop(0, '#3D2410');
  grad.addColorStop(0.65, '#59391F');
  grad.addColorStop(1, '#7A4F2B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Fibonacci phyllotaxis seed spiral
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < 240; i++) {
    const r = Math.sqrt(i / 240) * 116;
    const theta = i * goldenAngle;
    const x = 128 + Math.cos(theta) * r;
    const y = 128 + Math.sin(theta) * r;
    ctx.fillStyle = i % 5 === 0 ? '#C88D32' : '#2C180A';
    ctx.beginPath();
    ctx.arc(x, y, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createMeadowGroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const bg = ctx.createLinearGradient(0, 0, 512, 512);
  bg.addColorStop(0, '#4F6A3D');
  bg.addColorStop(0.5, '#597545');
  bg.addColorStop(1, '#465F36');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle =
      i % 4 === 0
        ? 'rgba(116, 146, 82, 0.38)'
        : i % 4 === 1
          ? 'rgba(62, 85, 46, 0.35)'
          : 'rgba(148, 168, 92, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y, 2.2, 6.5, (Math.random() - 0.5) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(18, 18);
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
  g.addColorStop(0, 'rgba(30, 18, 8, 0.55)');
  g.addColorStop(1, 'rgba(30, 18, 8, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

interface FlowerRig {
  root: THREE.Group;
  headGroup: THREE.Group;
  petalsGroup: THREE.Group;
  hitMesh: THREE.Mesh;
  baseRotY: number;
  baseRotX: number;
  bendTarget: number;
  bendCurrent: number;
  petalFlare: number;
  kind: 'hero' | 'portal' | 'main-unusual' | 'secret-normal' | 'secret-unusual';
  messageId?: number;
}

export const SunflowerGarden3D: React.FC<SunflowerGarden3DProps> = ({
  mode,
  sunlightTheme,
  eveningMode,
  visitedFlowers,
  unusualComforted,
  discoveredSurprises,
  onFlowerVisited,
  onEnterSecretGarden,
  onExitSecretGarden,
  onComfortUnusualSunflower,
  onUnusualFocused,
  onDiscoverSurprise,
  onPlaySfx,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedFlower, setSelectedFlower] = useState<GardenFlowerMessage | null>(null);
  const [portalZooming, setPortalZooming] = useState(false);
  const [portalIntroVisible, setPortalIntroVisible] = useState(false);
  const [unusualModalOpen, setUnusualModalOpen] = useState(false);
  const [rayaModalOpen, setRayaModalOpen] = useState(false);
  const [rayaWarmed, setRayaWarmed] = useState(false);
  const [webglFallback, setWebglFallback] = useState(false);

  // Refs synced with props so WebGL mounts once and never resets on React state changes
  const modeRef = useRef(mode);
  const sunlightThemeRef = useRef(sunlightTheme);
  const unusualComfortedRef = useRef(unusualComforted);
  const unusualFocusedRef = useRef(false);
  const rayaFocusedRef = useRef(false);
  const rayaWarmedRef = useRef(false);
  const portalZoomRef = useRef(false);
  const hoveredKindRef = useRef<string | null>(null);

  const callbacksRef = useRef({
    onFlowerVisited,
    onEnterSecretGarden,
    onPlaySfx,
    onUnusualFocused,
  });

  useEffect(() => {
    callbacksRef.current = {
      onFlowerVisited,
      onEnterSecretGarden,
      onPlaySfx,
      onUnusualFocused,
    };
  }, [onFlowerVisited, onEnterSecretGarden, onPlaySfx, onUnusualFocused]);

  useEffect(() => {
    modeRef.current = mode;
    setSelectedFlower(null);
    if (mode === 'secret') {
      setPortalIntroVisible(true);
      setPortalZooming(false);
      portalZoomRef.current = false;
      setRayaModalOpen(false);
      rayaFocusedRef.current = false;
    } else {
      setUnusualModalOpen(false);
      unusualFocusedRef.current = false;
      callbacksRef.current.onUnusualFocused(false);
    }
  }, [mode]);

  useEffect(() => {
    sunlightThemeRef.current = sunlightTheme;
  }, [sunlightTheme]);

  useEffect(() => {
    unusualComfortedRef.current = unusualComforted;
  }, [unusualComforted]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    const scene = new THREE.Scene();
    const initialSkyColor = new THREE.Color(sunlightThemeRef.current.skyHex);
    const secretSkyColor = new THREE.Color('#3B2618');
    const secretWarmSkyColor = new THREE.Color('#6F4824');

    scene.background = initialSkyColor.clone();
    scene.fog = new THREE.FogExp2(initialSkyColor.getHex(), 0.017);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity =
      sunlightThemeRef.current.mode === 'Moonlight'
        ? 0.25
        : sunlightThemeRef.current.mode === 'Sunrise'
          ? 1.05
          : 0.85;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 180);
    camera.position.set(0, 5.2, 16.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2.08;
    controls.minPolarAngle = 0.28;
    controls.minDistance = 4;
    controls.maxDistance = 28;
    controls.target.set(0, 2.2, 0);

    let userInteracting = false;
    controls.addEventListener('start', () => {
      userInteracting = true;
    });

    // Lighting rig: Dynamic directional key + Hemisphere fill
    const hemiLight = new THREE.HemisphereLight(
      0xffe6b3,
      0x3b4d2b,
      sunlightThemeRef.current.threeHemiIntensity,
    );
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(
      0xffcf77,
      sunlightThemeRef.current.threeSunIntensity,
    );
    sunLight.position.set(16, 18, -18);
    if (!isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.radius = sunlightThemeRef.current.threeShadowRadius;
      sunLight.shadow.camera.left = -22;
      sunLight.shadow.camera.right = 22;
      sunLight.shadow.camera.top = 22;
      sunLight.shadow.camera.bottom = -22;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xf6d3b5, 0.55);
    rimLight.position.set(-10, 8, 12);
    scene.add(rimLight);

    // Shared procedural textures & materials
    const seedTex = createSeedDiskTexture();
    const meadowTex = createMeadowGroundTexture();
    const shadowTex = createContactShadowTexture();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    seedTex.anisotropy = maxAniso;
    meadowTex.anisotropy = maxAniso;

    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x4c6839,
      roughness: 0.78,
      metalness: 0.02,
    });
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x567443,
      roughness: 0.74,
      side: THREE.DoubleSide,
    });
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf4a81d,
      emissive: 0x452200,
      emissiveIntensity: 0.16,
      roughness: 0.64,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    const petalWarmMat = new THREE.MeshStandardMaterial({
      color: 0xe08910,
      emissive: 0x3a1b00,
      emissiveIntensity: 0.14,
      roughness: 0.68,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: seedTex,
      roughness: 0.85,
      metalness: 0.05,
    });
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.42,
    });

    // Shared Geometries
    const stemGeo = new THREE.CylinderGeometry(0.06, 0.09, 2.4, 8);
    stemGeo.translate(0, 1.2, 0);
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.28, 0.18, 0.18, 0.55);
    leafShape.quadraticCurveTo(0, 0.72, -0.18, 0.55);
    leafShape.quadraticCurveTo(-0.28, 0.18, 0, 0);
    const leafGeo = new THREE.ShapeGeometry(leafShape, 6);

    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.16, 0.25, 0.08, 0.65);
    petalShape.quadraticCurveTo(0, 0.82, -0.08, 0.65);
    petalShape.quadraticCurveTo(-0.16, 0.25, 0, 0);
    const petalGeo = new THREE.ShapeGeometry(petalShape, 6);

    const centerGeo = new THREE.CylinderGeometry(0.42, 0.38, 0.16, 20);
    centerGeo.rotateX(Math.PI / 2);
    const calyxGeo = new THREE.ConeGeometry(0.42, 0.26, 16);
    calyxGeo.rotateX(-Math.PI / 2);
    const hitGeo = new THREE.SphereGeometry(0.95, 10, 10);
    const shadowDiscGeo = new THREE.CircleGeometry(0.65, 16);
    shadowDiscGeo.rotateX(-Math.PI / 2);

    // Helper to build a composite multi-part sunflower THREE.Group
    const interactables: THREE.Mesh[] = [];
    const flowerRigs: FlowerRig[] = [];

    function buildCompositeSunflower(
      x: number,
      z: number,
      scale: number,
      rotY: number,
      kind: FlowerRig['kind'],
      messageId?: number,
    ): FlowerRig {
      const root = new THREE.Group();
      root.position.set(x, 0, z);
      root.scale.setScalar(scale);

      const shadowDisc = new THREE.Mesh(shadowDiscGeo, shadowMat);
      shadowDisc.position.y = 0.02;
      root.add(shadowDisc);

      const stem = new THREE.Mesh(stemGeo, stemMat);
      if (!isSoftwareGl) stem.castShadow = true;
      root.add(stem);

      const leafLeft = new THREE.Mesh(leafGeo, leafMat);
      leafLeft.position.set(-0.05, 0.95, 0);
      leafLeft.rotation.set(0.5, 0.2, 0.95);
      root.add(leafLeft);

      const leafRight = new THREE.Mesh(leafGeo, leafMat);
      leafRight.position.set(0.05, 1.35, 0);
      leafRight.rotation.set(0.45, -0.2, -0.9);
      root.add(leafRight);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 2.38, 0.08);
      headGroup.rotation.y = rotY;
      const baseRotX =
        kind === 'secret-unusual' ? 0.34 : kind === 'main-unusual' ? 0.24 : -0.15;
      headGroup.rotation.x = baseRotX;
      root.add(headGroup);

      const disk = new THREE.Mesh(centerGeo, centerMat);
      headGroup.add(disk);

      const calyx = new THREE.Mesh(calyxGeo, leafMat);
      calyx.position.z = -0.15;
      headGroup.add(calyx);

      const petalsGroup = new THREE.Group();
      headGroup.add(petalsGroup);

      const petalCount = kind === 'portal' ? 24 : 18;
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const p = new THREE.Mesh(petalGeo, i % 2 === 0 ? petalMat : petalWarmMat);
        p.position.set(Math.sin(angle) * 0.36, Math.cos(angle) * 0.36, i % 2 === 0 ? 0.02 : -0.02);
        p.rotation.z = -angle;
        p.rotation.x = i % 2 === 0 ? -0.15 : -0.05;
        petalsGroup.add(p);
      }

      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(0, 2.38, 0.1);
      if (kind === 'main-unusual' || kind === 'secret-unusual') {
        hitMesh.scale.setScalar(1.3);
      }
      root.add(hitMesh);

      const rig: FlowerRig = {
        root,
        headGroup,
        petalsGroup,
        hitMesh,
        baseRotY: rotY,
        baseRotX,
        bendTarget: 0,
        bendCurrent: 0,
        petalFlare: 0,
        kind,
        messageId,
      };
      hitMesh.userData.rig = rig;
      interactables.push(hitMesh);
      flowerRigs.push(rig);
      return rig;
    }

    // ==================== MAIN UNIVERSE GROUP ====================
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: meadowTex,
      roughness: 0.92,
      metalness: 0.0,
    });
    const mainGround = new THREE.Mesh(new THREE.CircleGeometry(48, 48), groundMat);
    mainGround.rotation.x = -Math.PI / 2;
    if (!isSoftwareGl) mainGround.receiveShadow = true;
    mainGroup.add(mainGround);

    // Distant Sun Orb in Main Meadow
    const mainSunOrb = new THREE.Mesh(
      new THREE.SphereGeometry(3.4, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xffe48f }),
    );
    mainSunOrb.position.set(14, 14, -36);
    mainGroup.add(mainSunOrb);

    // InstancedMesh background sunflower field (150 varied blooms with crisp 12-petal silhouettes)
    const bgCount = 150;
    // Fast 4-triangle sculpted petal shape for instancing (48 tris/flower total)
    const lowPetalGeo = new THREE.BufferGeometry();
    const lpVerts = new Float32Array([
      0, 0, 0,
      -0.11, 0.28, 0.02,
      0, 0.74, 0,
      0.11, 0.28, 0.02,
    ]);
    lowPetalGeo.setAttribute('position', new THREE.BufferAttribute(lpVerts, 3));
    lowPetalGeo.setIndex([0, 2, 1, 0, 3, 2]);
    lowPetalGeo.computeVertexNormals();

    const petalParts: THREE.BufferGeometry[] = [];
    for (let p = 0; p < 12; p++) {
      const ang = (p / 12) * Math.PI * 2;
      const g = lowPetalGeo.clone();
      g.rotateZ(-ang);
      g.translate(Math.sin(ang) * 0.36, Math.cos(ang) * 0.36, p % 2 === 0 ? 0.015 : -0.015);
      petalParts.push(g);
    }
    const bgPetalRingGeo = mergeGeometries(petalParts, false);
    petalParts.forEach((g) => g.dispose());
    lowPetalGeo.dispose();

    const bgStemInst = new THREE.InstancedMesh(stemGeo, stemMat, bgCount);
    const bgHeadInst = new THREE.InstancedMesh(centerGeo, centerMat, bgCount);
    const bgPetalInst = new THREE.InstancedMesh(bgPetalRingGeo, petalMat, bgCount);

    for (let i = 0; i < bgCount; i++) {
      // Spread behind and along flanks so the center foreground camera corridor stays open
      const x = (Math.random() - 0.5) * 58;
      let z = -34 + Math.random() * 44;
      if (z > 4 && Math.abs(x) < 11) {
        z = -8 - Math.random() * 24;
      }
      if (Math.hypot(x, z + 4.5) < 4.5) {
        z -= 6;
      }
      const s = 0.65 + Math.random() * 0.62;

      _dummy.position.set(x, 0, z);
      _dummy.rotation.set(0, (Math.random() - 0.5) * 0.16, 0);
      _dummy.scale.setScalar(s);
      _dummy.updateMatrix();
      bgStemInst.setMatrixAt(i, _dummy.matrix);

      _dummy.position.set(x, 2.35 * s, z + 0.05);
      _dummy.rotation.set(-0.15, (Math.random() - 0.5) * 0.14, 0);
      _dummy.scale.setScalar(s);
      _dummy.updateMatrix();
      bgHeadInst.setMatrixAt(i, _dummy.matrix);
      bgPetalInst.setMatrixAt(i, _dummy.matrix);

      _color.setHex(i % 2 === 0 ? 0xffd154 : 0xf2aa24);
      bgPetalInst.setColorAt(i, _color);
    }
    bgStemInst.computeBoundingSphere();
    bgHeadInst.computeBoundingSphere();
    bgPetalInst.computeBoundingSphere();
    mainGroup.add(bgStemInst, bgHeadInst, bgPetalInst);

    // 12 Interactive Hero Sunflowers all facing the sunlit direction together
    const heroCoords = [
      [-6.5, 7.2],
      [-3.4, 8.8],
      [3.6, 8.6],
      [6.8, 7.0],
      [-8.4, 2.5],
      [-4.8, 3.6],
      [4.9, 3.4],
      [8.5, 2.2],
      [-7.2, -2.8],
      [-3.8, -1.6],
      [4.2, -1.8],
      [7.4, -3.0],
    ];
    heroCoords.forEach(([hx, hz], idx) => {
      const rig = buildCompositeSunflower(
        hx,
        hz,
        0.92 + (idx % 3) * 0.12,
        -hx * 0.025,
        'hero',
        idx,
      );
      mainGroup.add(rig.root);
    });

    // ONE DISTINCT SUNFLOWER IN THE MAIN MEADOW NOT FACING THE SUN — FACING AWAY FOR RAYA
    const mainUnusualX = -1.9;
    const mainUnusualZ = 5.4;
    const mainUnusualAwayRotY = Math.PI * 0.88;
    const mainUnusualRig = buildCompositeSunflower(
      mainUnusualX,
      mainUnusualZ,
      1.04,
      mainUnusualAwayRotY,
      'main-unusual',
    );
    const rayaBackHeartShape = new THREE.Shape();
    rayaBackHeartShape.moveTo(0, -0.1);
    rayaBackHeartShape.bezierCurveTo(0.13, 0.02, 0.13, 0.14, 0, 0.07);
    rayaBackHeartShape.bezierCurveTo(-0.13, 0.14, -0.13, 0.02, 0, -0.1);
    const rayaBackHeartGeo = new THREE.ShapeGeometry(rayaBackHeartShape);
    const rayaBackHeartMesh = new THREE.Mesh(
      rayaBackHeartGeo,
      new THREE.MeshBasicMaterial({
        color: 0xffd166,
        side: THREE.DoubleSide,
      }),
    );
    rayaBackHeartMesh.position.set(0, 0.02, -0.28);
    rayaBackHeartMesh.rotation.y = Math.PI;
    mainUnusualRig.headGroup.add(rayaBackHeartMesh);
    mainGroup.add(mainUnusualRig.root);

    // Enormous Giant Portal Sunflower in the center-back
    const portalRig = buildCompositeSunflower(0, -4.5, 2.35, 0, 'portal');
    // Glowing golden seed halo around portal center
    const portalRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.028, 10, 36),
      new THREE.MeshBasicMaterial({ color: 0xffe48f }),
    );
    portalRing.position.z = 0.09;
    portalRig.headGroup.add(portalRing);
    mainGroup.add(portalRig.root);

    // Glowing particles (pollen / fireflies)
    const particleCount = 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 32;
      pPos[i * 3 + 1] = 0.5 + Math.random() * 8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 32;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffdf78,
      size: 0.16,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ==================== SECRET MINIATURE GARDEN GROUP ====================
    const secretGroup = new THREE.Group();
    secretGroup.visible = false;
    scene.add(secretGroup);

    const secretFloor = new THREE.Mesh(
      new THREE.CircleGeometry(28, 40),
      new THREE.MeshStandardMaterial({ color: 0x3b4d2b, roughness: 0.9 }),
    );
    secretFloor.rotation.x = -Math.PI / 2;
    secretGroup.add(secretFloor);

    // Canopy ring of giant petals overhead (symbolizing being inside the giant sunflower)
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * Math.PI * 2;
      const canopyPetal = new THREE.Mesh(
        petalGeo,
        new THREE.MeshStandardMaterial({
          color: 0xe8a92e,
          roughness: 0.5,
          transparent: true,
          opacity: 0.72,
          side: THREE.DoubleSide,
        }),
      );
      canopyPetal.scale.set(16, 16, 16);
      canopyPetal.position.set(Math.cos(ang) * 20, 12, Math.sin(ang) * 20);
      canopyPetal.lookAt(0, 16, 0);
      secretGroup.add(canopyPetal);
    }

    // Radiant Sun inside the Secret Garden (positioned at +X, -Z)
    const secretSunPos = new THREE.Vector3(11, 7.5, -12);
    const secretSunOrb = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xffe48f }),
    );
    secretSunOrb.position.copy(secretSunPos);
    secretGroup.add(secretSunOrb);

    const secretWarmLight = new THREE.PointLight(0xffcb66, 3.2, 40);
    secretWarmLight.position.copy(secretSunPos);
    secretGroup.add(secretWarmLight);

    // 24 Sunflowers facing toward the secret sun
    const secretNormalRigs: FlowerRig[] = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2 + (i % 2) * 0.14;
      const radius = 3.2 + (i % 4) * 2.1;
      const sx = Math.cos(angle) * radius;
      const sz = Math.sin(angle) * radius;
      // Avoid overlapping the unusual sunflower slot at (-3.2, 3.8)
      if (Math.hypot(sx - -3.2, sz - 3.8) < 2.2) continue;

      const rotToSun = Math.atan2(secretSunPos.x - sx, secretSunPos.z - sz);
      const rig = buildCompositeSunflower(
        sx,
        sz,
        0.82 + (i % 3) * 0.1,
        rotToSun,
        'secret-normal',
      );
      secretNormalRigs.push(rig);
      secretGroup.add(rig.root);
    }

    // THE ONE UNUSUAL SUNFLOWER — facing AWAY from the sun
    const unusualX = -3.2;
    const unusualZ = 3.8;
    const rotToSunUnusual = Math.atan2(secretSunPos.x - unusualX, secretSunPos.z - unusualZ);
    const rotAwayFromSun = rotToSunUnusual + Math.PI; // Facing away from sunlight
    const unusualRig = buildCompositeSunflower(
      unusualX,
      unusualZ,
      0.86,
      rotAwayFromSun,
      'secret-unusual',
    );
    // Small glowing heart near its center (visible once discovered/focused)
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, -0.14);
    heartShape.bezierCurveTo(0.18, 0.02, 0.18, 0.2, 0, 0.1);
    heartShape.bezierCurveTo(-0.18, 0.2, -0.18, 0.02, 0, -0.14);
    const glowingHeartMesh = new THREE.Mesh(
      new THREE.ShapeGeometry(heartShape),
      new THREE.MeshBasicMaterial({
        color: 0xffd166,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      }),
    );
    glowingHeartMesh.position.set(0, 0.05, 0.14);
    unusualRig.headGroup.add(glowingHeartMesh);
    secretGroup.add(unusualRig.root);

    // Raycasting for Click & Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y) > 8) return;
      updateMouse(e.clientX, e.clientY);
      raycaster.setFromCamera(mouse, camera);

      const activeHitMeshes = interactables.filter((m) => {
        const rig = m.userData.rig as FlowerRig;
        if (modeRef.current === 'main') {
          return rig.kind === 'hero' || rig.kind === 'portal' || rig.kind === 'main-unusual';
        }
        return rig.kind === 'secret-unusual' || rig.kind === 'secret-normal';
      });

      const hits = raycaster.intersectObjects(activeHitMeshes, false);
      if (hits.length === 0) return;
      const rig = hits[0].object.userData.rig as FlowerRig;

      if (rig.kind === 'hero' && typeof rig.messageId === 'number') {
        rig.bendTarget = 1;
        rig.petalFlare = 1;
        const msg =
          SUNFLOWER_CONTENT.gardenFlowers[rig.messageId % SUNFLOWER_CONTENT.gardenFlowers.length];
        setSelectedFlower(msg);
        callbacksRef.current.onFlowerVisited(rig.messageId);
        callbacksRef.current.onPlaySfx('petal');
      } else if (rig.kind === 'main-unusual') {
        rig.petalFlare = 1;
        rayaFocusedRef.current = true;
        setRayaModalOpen(true);
        callbacksRef.current.onUnusualFocused(true);
        callbacksRef.current.onPlaySfx('letter');
      } else if (rig.kind === 'portal') {
        portalZoomRef.current = true;
        setPortalZooming(true);
        callbacksRef.current.onPlaySfx('sparkle');
        window.setTimeout(() => {
          callbacksRef.current.onEnterSecretGarden();
        }, 1250);
      } else if (rig.kind === 'secret-unusual') {
        unusualFocusedRef.current = true;
        setUnusualModalOpen(true);
        callbacksRef.current.onUnusualFocused(true);
        callbacksRef.current.onPlaySfx('letter');
      }
    };

    let lastHover = 0;
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHover < 60) return;
      lastHover = now;
      updateMouse(e.clientX, e.clientY);
      raycaster.setFromCamera(mouse, camera);

      const activeHitMeshes = interactables.filter((m) => {
        const rig = m.userData.rig as FlowerRig;
        return modeRef.current === 'main'
          ? rig.kind === 'hero' || rig.kind === 'portal' || rig.kind === 'main-unusual'
          : rig.kind === 'secret-unusual';
      });

      const hits = raycaster.intersectObjects(activeHitMeshes, false);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
      hoveredKindRef.current =
        hits.length > 0 ? ((hits[0].object.userData.rig as FlowerRig).kind ?? null) : null;
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // Resize observer
    const onResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', onResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const startTimeMs = performance.now();
    let prevTimeMs = startTimeMs;
    let frameId = 0;
    let lastModeRendered: 'main' | 'secret' | null = null;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const nowMs = performance.now();
      const delta = Math.min((nowMs - prevTimeMs) / 1000, 0.1);
      const elapsed = (nowMs - startTimeMs) / 1000;
      prevTimeMs = nowMs;

      const currentMode = modeRef.current;
      const isSecret = currentMode === 'secret';

      mainGroup.visible = !isSecret;
      secretGroup.visible = isSecret;

      if (lastModeRendered !== currentMode) {
        lastModeRendered = currentMode;
        userInteracting = false;
        if (isSecret) {
          camera.position.set(0, 4.6, 12.2);
          controls.target.set(0, 1.8, 0);
        } else {
          camera.position.set(0, 5.2, 16.5);
          controls.target.set(0, 2.2, 0);
        }
      }

      // Sky & Lighting transitions driven by Sunlight Intensity theme
      const activeSunTheme = sunlightThemeRef.current;
      const lightLerp = 1 - Math.exp(-7 * delta);
      const targetBg = isSecret
        ? unusualComfortedRef.current
          ? secretWarmSkyColor
          : secretSkyColor
        : _targetSkyColor.set(activeSunTheme.skyHex);
      (scene.background as THREE.Color).lerp(targetBg, lightLerp);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(scene.background as THREE.Color);
      }

      const targetSunIntensity = isSecret
        ? unusualComfortedRef.current
          ? 2.2
          : 1.35
        : activeSunTheme.threeSunIntensity;
      const targetHemiIntensity = isSecret ? 0.65 : activeSunTheme.threeHemiIntensity;
      const targetEnvIntensity = isSecret
        ? 0.75
        : activeSunTheme.mode === 'Moonlight'
          ? 0.25
          : activeSunTheme.mode === 'Sunrise'
            ? 1.05
            : 0.85;
      sunLight.intensity = THREE.MathUtils.damp(sunLight.intensity, targetSunIntensity, 7, delta);
      hemiLight.intensity = THREE.MathUtils.damp(hemiLight.intensity, targetHemiIntensity, 7, delta);
      scene.environmentIntensity = THREE.MathUtils.damp(
        scene.environmentIntensity,
        targetEnvIntensity,
        7,
        delta,
      );

      _targetLightColor.setHex(
        !isSecret && activeSunTheme.mode === 'Moonlight'
          ? 0x9eb4ff
          : !isSecret && activeSunTheme.mode === 'Sunrise'
            ? 0xffe8b0
            : 0xffcf77,
      );
      sunLight.color.lerp(_targetLightColor, lightLerp);

      _targetHemiColor.setHex(
        !isSecret && activeSunTheme.mode === 'Moonlight'
          ? 0x828ec9
          : !isSecret && activeSunTheme.mode === 'Sunrise'
            ? 0xfff0cc
            : 0xffe6b3,
      );
      hemiLight.color.lerp(_targetHemiColor, lightLerp);

      if (!isSoftwareGl) {
        sunLight.shadow.radius = THREE.MathUtils.damp(
          sunLight.shadow.radius,
          isSecret ? 3.0 : activeSunTheme.threeShadowRadius,
          7,
          delta,
        );
      }

      const orbMat = mainSunOrb.material as THREE.MeshBasicMaterial;
      const targetOrbHex =
        activeSunTheme.mode === 'Moonlight'
          ? 0xe8e2f8
          : activeSunTheme.mode === 'Sunrise'
            ? 0xfff0ba
            : 0xffe48f;
      orbMat.color.lerp(_color.setHex(targetOrbHex), lightLerp);

      secretWarmLight.intensity = THREE.MathUtils.damp(
        secretWarmLight.intensity,
        unusualComfortedRef.current ? 4.8 : 2.6,
        2.5,
        delta,
      );

      // Gentle wind & flower kinematics
      for (let i = 0; i < flowerRigs.length; i++) {
        const rig = flowerRigs[i];
        const wind = Math.sin(elapsed * 1.4 + i * 0.7) * 0.045;
        rig.root.rotation.z = wind;

        rig.bendCurrent = THREE.MathUtils.damp(rig.bendCurrent, rig.bendTarget, 4.5, delta);
        rig.petalFlare = THREE.MathUtils.damp(rig.petalFlare, 0, 1.6, delta);
        if (rig.bendCurrent > 0.85) rig.bendTarget = 0;

        if (rig.kind === 'secret-unusual') {
          const comforted = unusualComfortedRef.current;
          const targetRotY = comforted ? rotAwayFromSun + 0.9 : rotAwayFromSun;
          const targetRotX = comforted ? 0.04 : 0.34;
          rig.headGroup.rotation.y = THREE.MathUtils.damp(
            rig.headGroup.rotation.y,
            targetRotY,
            1.6,
            delta,
          );
          rig.headGroup.rotation.x = THREE.MathUtils.damp(
            rig.headGroup.rotation.x,
            targetRotX,
            1.6,
            delta,
          );
          const heartMat = glowingHeartMesh.material as THREE.MeshBasicMaterial;
          heartMat.opacity = THREE.MathUtils.damp(
            heartMat.opacity,
            unusualFocusedRef.current || comforted ? 0.92 : 0.0,
            3,
            delta,
          );
        } else if (rig.kind === 'main-unusual') {
          const warmed = rayaWarmedRef.current;
          const targetRotY = warmed ? mainUnusualAwayRotY - 1.15 : mainUnusualAwayRotY;
          const targetRotX = warmed ? -0.02 : 0.24;
          rig.headGroup.rotation.y = THREE.MathUtils.damp(
            rig.headGroup.rotation.y,
            targetRotY,
            1.8,
            delta,
          );
          rig.headGroup.rotation.x = THREE.MathUtils.damp(
            rig.headGroup.rotation.x,
            targetRotX,
            1.8,
            delta,
          );
        } else {
          rig.headGroup.rotation.x = rig.baseRotX + rig.bendCurrent * 0.28;
          rig.headGroup.rotation.y = rig.baseRotY + Math.sin(elapsed * 0.5 + i) * 0.05;
        }

        const scalePulse = 1 + rig.petalFlare * 0.14;
        rig.petalsGroup.scale.setScalar(scalePulse);
      }

      // Portal zoom or Unusual Sunflower focus camera choreography
      if (portalZoomRef.current && !isSecret) {
        _targetPos.set(0, 5.4, -1.8);
        _targetLook.set(0, 5.6, -4.5);
        camera.position.lerp(_targetPos, 1 - Math.exp(-3.6 * delta));
        controls.target.lerp(_targetLook, 1 - Math.exp(-3.6 * delta));
      } else if (!isSecret && rayaFocusedRef.current && !userInteracting) {
        _targetPos.set(-1.1, 3.1, 9.8);
        _targetLook.set(mainUnusualX, 2.35, mainUnusualZ);
        camera.position.lerp(_targetPos, 1 - Math.exp(-2.8 * delta));
        controls.target.lerp(_targetLook, 1 - Math.exp(-2.8 * delta));
      } else if (isSecret && unusualFocusedRef.current && !userInteracting) {
        _targetPos.set(-1.1, 2.7, 7.6);
        _targetLook.set(unusualX, 2.0, unusualZ);
        camera.position.lerp(_targetPos, 1 - Math.exp(-2.8 * delta));
        controls.target.lerp(_targetLook, 1 - Math.exp(-2.8 * delta));
      }

      // Subtle floating golden particles
      const posAttr = pGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i) + delta * 0.22;
        if (y > 8.5) y = 0.5;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    controls.update();
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      controls.dispose();
      seedTex.dispose();
      meadowTex.dispose();
      shadowTex.dispose();
      stemGeo.dispose();
      leafGeo.dispose();
      petalGeo.dispose();
      bgPetalRingGeo.dispose();
      centerGeo.dispose();
      calyxGeo.dispose();
      rayaBackHeartGeo.dispose();
      hitGeo.dispose();
      shadowDiscGeo.dispose();
      pGeo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      aria-label={mode === 'main' ? 'Main 3D Sunflower Universe' : 'Secret Miniature Garden'}
      data-scene-mode={mode}
      style={{ backgroundColor: sunlightTheme.skyHex }}
      className="relative h-screen w-full overflow-hidden transition-colors duration-500"
    >
      {/* Dedicated WebGL Mount Container (never shares DOM with HUD overlays) */}
      <div
        ref={mountRef}
        data-testid="sunflower-3d-canvas"
        className="absolute inset-0 h-full w-full"
      />

      {webglFallback && (
        <div className="universe-page-bg absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className="universe-shadow max-w-md rounded-2xl border border-[#59391F]/15 bg-[#FFFCF5] p-6 text-[#59391F]">
            <h2 className="font-display text-2xl font-semibold">The Sunlit Meadow</h2>
            <p className="mt-2 text-sm opacity-85">
              3D graphics are unavailable in this browser session, but every flower, love letter, and secret surprise can still be explored below.
            </p>
          </div>
        </div>
      )}

      {/* Subtle Top-Left Guidance Banner (non-blocking) */}
      <div className="pointer-events-none fixed top-24 sm:top-16 left-4 right-4 z-20 flex flex-wrap items-start justify-between gap-3">
        <div
          style={{
            boxShadow: '0 6px var(--universe-shadow-blur) rgba(25, 16, 12, 0.16)',
          }}
          className="pointer-events-auto max-w-sm rounded-2xl border border-[#59391F]/15 bg-[#FFF7E7]/92 px-4 py-2.5 text-[#59391F]"
        >
          {mode === 'main' ? (
            <>
              <div className="text-xs font-semibold tracking-wide text-[#D98A47]">
                {sunlightTheme.mode} Meadow · {visitedFlowers.length}/12 Flowers Opened
              </div>
              <p className="mt-0.5 text-xs leading-snug opacity-85">
                Tap any sunflower to read its note, click the giant sunflower in the centre, or spot the one sunflower facing away from the sun.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onEnterSecretGarden}
                  className="cursor-pointer rounded-full bg-[#59391F] px-3 py-1 text-[11px] font-medium text-[#FFF7E7] transition-colors hover:bg-[#734A29]"
                >
                  Enter Giant Sunflower Portal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = visitedFlowers.length % SUNFLOWER_CONTENT.gardenFlowers.length;
                    setSelectedFlower(SUNFLOWER_CONTENT.gardenFlowers[nextIdx]);
                    onFlowerVisited(nextIdx);
                    onPlaySfx('petal');
                  }}
                  className="cursor-pointer rounded-full border border-[#59391F]/20 bg-[#FFFCF5] px-3 py-1 text-[11px] font-medium text-[#59391F] hover:bg-[#F6D3B5]/40"
                >
                  Pick a Flower Note
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-xs font-semibold tracking-wide text-[#D98A47]">
                Inside the Giant Sunflower
              </div>
              <p className="mt-0.5 text-xs leading-snug opacity-85">
                Explore the 25 sunflowers in this clearing. Can you find the one little flower not facing the sun?
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onExitSecretGarden}
                  className="cursor-pointer rounded-full border border-[#59391F]/20 bg-[#FFFCF5] px-3 py-1 text-[11px] font-medium text-[#59391F] hover:bg-[#F6D3B5]/40"
                >
                  Return to Meadow
                </button>
                <button
                  type="button"
                  onClick={() => {
                    unusualFocusedRef.current = true;
                    setUnusualModalOpen(true);
                    onUnusualFocused(true);
                    onPlaySfx('letter');
                  }}
                  className="cursor-pointer rounded-full bg-[#D98A47] px-3 py-1 text-[11px] font-medium text-[#FFFCF5] hover:bg-[#C17534]"
                >
                  Inspect the Quiet Sunflower
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sky Time Toggle + Clickable Evening Moon Surprise */}
        {mode === 'main' && (
          <div className="pointer-events-auto flex items-center gap-2">
            {eveningMode && (
              <button
                type="button"
                onClick={() => onDiscoverSurprise('surprise-moon')}
                aria-label="Click the glowing twilight crescent moon"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#F9C846]/50 bg-[#2B2038]/90 text-[#F9C846] shadow-md transition-transform hover:scale-110"
                title="Twilight Moon Surprise"
              >
                <Moon className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onDiscoverSurprise('__toggle_evening__')}
              aria-label={eveningMode ? 'Switch to golden hour sky' : 'Switch to twilight evening sky'}
              className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-[#59391F]/15 bg-[#FFF7E7]/95 px-3.5 text-xs font-medium text-[#59391F] shadow-sm transition-colors hover:bg-[#F6D3B5]"
            >
              {eveningMode ? <Sun className="h-3.5 w-3.5 text-[#D98A47]" /> : <Moon className="h-3.5 w-3.5 text-[#59391F]" />}
              <span>{eveningMode ? 'Golden Hour' : 'Evening Sky'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Hidden Butterfly & Golden Seed #1 in Main Meadow */}
      {mode === 'main' && (
        <>
          <div className="fixed top-44 right-6 sm:right-16 z-20">
            <button
              type="button"
              onClick={() => onDiscoverSurprise('surprise-butterfly')}
              aria-label="Catch golden butterfly in the meadow"
              className="cursor-pointer rounded-full p-2 transition-transform hover:scale-125 animate-butterfly"
            >
              <svg width="34" height="28" viewBox="0 0 36 30" fill="none" aria-hidden="true">
                <path d="M17 15 C11 4, 2 5, 3 13 C4 19, 11 19, 17 16 Z" fill="#F9C846" stroke="#59391F" strokeWidth="1" />
                <path d="M19 15 C25 4, 34 5, 33 13 C32 19, 25 19, 19 16 Z" fill="#F9C846" stroke="#59391F" strokeWidth="1" />
                <line x1="18" y1="8" x2="18" y2="23" stroke="#59391F" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onDiscoverSurprise('surprise-seed-1')}
            aria-label="Collect hidden golden seed in the meadow"
            title="A shimmering golden seed"
            className={`fixed bottom-24 left-6 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-transform hover:scale-125 ${
              discoveredSurprises.includes('surprise-seed-1')
                ? 'border-[#526B42]/40 bg-[#526B42]/20 text-[#FFF7E7]'
                : 'border-[#F9C846] bg-[#F9C846]/85 text-[#59391F] shadow-md'
            }`}
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Hidden Heart in the Grass inside Secret Garden */}
      {mode === 'secret' && (
        <button
          type="button"
          onClick={() => onDiscoverSurprise('surprise-heart-flower')}
          aria-label="Discover tiny heart hidden in the grass"
          title="Tiny heart in the grass"
          className="fixed bottom-24 right-8 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#F6D3B5]/60 bg-[#59391F]/80 text-[#F9C846] shadow-md transition-transform hover:scale-125"
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>
      )}

      {/* Portal Zooming Overlay */}
      {portalZooming && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#3B2618]/85 text-[#FFF7E7] transition-opacity">
          <div className="h-20 w-20 rounded-full border-4 border-[#F9C846] bg-[#59391F] animate-soft-beat shadow-[0_0_50px_rgba(249,200,70,0.65)]" />
          <p className="mt-4 font-display text-2xl">Stepping inside the sunflower...</p>
        </div>
      )}

      {/* Secret Garden Entrance Welcome Note */}
      {mode === 'secret' && portalIntroVisible && !unusualModalOpen && (
        <div
          role="dialog"
          aria-label="World Inside a Sunflower Message"
          className="fixed bottom-20 left-1/2 z-30 w-[min(92vw,460px)] -translate-x-1/2 rounded-3xl border border-[#F9C846]/40 bg-[#FFF7E7] px-6 py-5 text-center text-[#59391F] shadow-xl"
        >
          <button
            type="button"
            onClick={() => setPortalIntroVisible(false)}
            aria-label="Close portal welcome note"
            className="absolute top-3 right-3 cursor-pointer rounded-full p-1.5 hover:bg-[#F6D3B5]/40"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="font-display text-2xl font-semibold">
            {SUNFLOWER_CONTENT.portal.title}
          </h2>
          <p className="mt-2 font-hand text-xl text-[#7A4F2B]">
            {SUNFLOWER_CONTENT.portal.message[0]}
          </p>
          <p className="font-hand text-xl text-[#7A4F2B]">
            {SUNFLOWER_CONTENT.portal.message[1]}
          </p>
          <button
            type="button"
            onClick={() => setPortalIntroVisible(false)}
            className="mt-4 cursor-pointer rounded-full bg-[#59391F] px-5 py-1.5 text-xs font-semibold text-[#FFF7E7] hover:bg-[#734A29]"
          >
            Explore the Clearing
          </button>
        </div>
      )}

      {/* Handwritten Card when a Hero Sunflower in Main Meadow is Clicked */}
      {selectedFlower && mode === 'main' && (
        <div
          role="dialog"
          aria-label={selectedFlower.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1D14]/45 p-4"
        >
          <div className="paper-texture relative w-full max-w-md rounded-3xl border border-[#D98A47]/35 px-7 py-8 text-center text-[#59391F] shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedFlower(null)}
              aria-label="Close sunflower note"
              className="absolute top-4 right-4 cursor-pointer rounded-full p-2 text-[#59391F] hover:bg-[#F6D3B5]/50"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="text-xs font-semibold tracking-wider text-[#D98A47]">
              {selectedFlower.title}
            </div>
            <p className="mt-4 font-hand text-3xl leading-snug text-[#59391F]">
              “{selectedFlower.message}”
            </p>
            <p className="mt-4 text-xs italic text-[#7A4F2B]">
              — {selectedFlower.signature}
            </p>
            <button
              type="button"
              onClick={() => setSelectedFlower(null)}
              className="mt-6 cursor-pointer rounded-full bg-[#59391F] px-5 py-2 text-xs font-semibold text-[#FFF7E7] hover:bg-[#734A29]"
            >
              Keep Exploring
            </button>
          </div>
        </div>
      )}

      {/* Emotional Centerpiece Modal: The Unusual Sunflower Facing Away */}
      {unusualModalOpen && mode === 'secret' && (
        <div
          role="dialog"
          aria-label="The Quiet Sunflower Message"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#23170F]/60 p-4"
        >
          <div className="paper-texture relative my-auto max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#F9C846]/40 px-6 py-7 text-[#59391F] shadow-2xl sm:px-9">
            <button
              type="button"
              onClick={() => {
                setUnusualModalOpen(false);
                unusualFocusedRef.current = false;
                onUnusualFocused(false);
              }}
              aria-label="Close quiet sunflower message"
              className="sticky float-right top-0 cursor-pointer rounded-full bg-[#FFF7E7] p-2 hover:bg-[#F6D3B5]/50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F9C846]/30 text-[#D98A47]">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold">
                  {SUNFLOWER_CONTENT.unusualSunflower.title}
                </h2>
                <p className="text-xs text-[#7A4F2B]">A quiet corner just for cloudy days</p>
              </div>
            </div>

            {unusualComforted && (
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-[#E8A92E]/40 bg-[#F9C846]/20 p-4">
                <IllustratedBoy extendingFlower className="h-28 w-20 shrink-0" />
                <p className="font-hand text-xl text-[#59391F]">
                  {SUNFLOWER_CONTENT.unusualSunflower.afterSunshineNote}
                </p>
              </div>
            )}

            <div className="mt-5 space-y-2.5 text-sm sm:text-base leading-relaxed text-[#59391F]/95">
              {SUNFLOWER_CONTENT.unusualSunflower.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={
                    p === 'Always.' || p === "And that's okay." || p === 'And so do you.'
                      ? 'font-semibold text-[#7A4F2B]'
                      : ''
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onComfortUnusualSunflower();
                  onPlaySfx('sun');
                }}
                className="cursor-pointer rounded-full bg-[#E8A92E] px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#3D2410] shadow-md transition-transform hover:scale-[1.02] hover:bg-[#F9C846]"
              >
                {SUNFLOWER_CONTENT.unusualSunflower.sunshineButton}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUnusualModalOpen(false);
                  unusualFocusedRef.current = false;
                  onUnusualFocused(false);
                }}
                className="cursor-pointer rounded-full border border-[#59391F]/20 px-4 py-2 text-xs font-medium text-[#59391F] hover:bg-[#F6D3B5]/40"
              >
                Stay in Clearing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Love Notes Modal for Raya when Clicking the Away-Facing Sunflower in Main Meadow */}
      {rayaModalOpen && mode === 'main' && (
        <div
          role="dialog"
          aria-label="Love Notes for Raya"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#23170F]/60 p-4 pb-16"
        >
          <div
            style={{
              boxShadow: '0 14px var(--universe-shadow-blur) rgba(25, 16, 12, 0.34)',
            }}
            className="paper-texture relative my-auto max-h-[78vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#F9C846]/50 px-6 py-5 text-[#59391F] sm:px-8 sm:py-6"
          >
            <button
              type="button"
              onClick={() => {
                setRayaModalOpen(false);
                rayaFocusedRef.current = false;
                onUnusualFocused(false);
              }}
              aria-label="Close Raya love notes"
              className="sticky float-right top-0 cursor-pointer rounded-full bg-[#FFF7E7] p-2 hover:bg-[#F6D3B5]/50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F9C846]/30 text-[#D98A47]">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
                  {SUNFLOWER_CONTENT.rayaSpecialSunflower.title}
                </h2>
                <p className="text-xs text-[#7A4F2B]">
                  {SUNFLOWER_CONTENT.rayaSpecialSunflower.subtitle}
                </p>
              </div>
            </div>

            {rayaWarmed && (
              <div className="mt-3 flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-[#E8A92E]/40 bg-[#F9C846]/20 p-3">
                <IllustratedBoy extendingFlower className="h-24 w-16 shrink-0" />
                <p className="font-hand text-xl text-[#59391F]">
                  {SUNFLOWER_CONTENT.rayaSpecialSunflower.afterWarmthNote}
                </p>
              </div>
            )}

            <div className="mt-4 space-y-2.5">
              {SUNFLOWER_CONTENT.rayaSpecialSunflower.notes.map((note, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#D98A47]/25 bg-[#FFF7E7]/85 px-4 py-3"
                >
                  <div className="font-hand text-xl font-semibold text-[#D98A47]">
                    {note.heading}
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-[#59391F]">
                    {note.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setRayaWarmed(true);
                  rayaWarmedRef.current = true;
                  onPlaySfx('sun');
                }}
                className="cursor-pointer rounded-full bg-[#E8A92E] px-5 py-2 text-xs sm:text-sm font-semibold text-[#3D2410] shadow-md transition-transform hover:scale-[1.02] hover:bg-[#F9C846]"
              >
                {SUNFLOWER_CONTENT.rayaSpecialSunflower.warmthButton}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRayaModalOpen(false);
                  rayaFocusedRef.current = false;
                  onUnusualFocused(false);
                }}
                className="cursor-pointer rounded-full border border-[#59391F]/20 px-4 py-2 text-xs font-medium text-[#59391F] hover:bg-[#F6D3B5]/40"
              >
                Keep Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
