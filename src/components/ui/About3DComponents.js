import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

// =========================================================
// SHARED HELPER: High-Performance Vanilla Scene Setup
// =========================================================
const useVanillaScene = (initScene, animateScene) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 5;

    // 2. Renderer (Cinematic Settings)
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance" 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Initialize Content
    const cleanupUser = initScene(scene, camera, renderer);

    // 4. Animation Loop
    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const delta = clock.getDelta();
      
      if (animateScene) animateScene(scene, camera, time, delta);
      renderer.render(scene, camera);
    };
    animate();

    // 5. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (cleanupUser) cleanupUser();
      renderer.dispose();
      // Safe removal check
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Empty dependency array ensures run once

  return <div ref={containerRef} className="w-full h-full absolute top-0 left-0 pointer-events-none" />;
};

// --- HELPER: Load 3D Text (Replaces <Text>) ---
const loadTextGeo = (text, size, scene, position = [0,0,0], color = 0xffffff) => {
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        const geo = new TextGeometry(text, {
            font: font,
            size: size,
            height: size * 0.1, // Reduced depth for cleaner look
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: size * 0.02,
            bevelSize: size * 0.01,
            bevelSegments: 2
        });
        
        // Center the text
        geo.computeBoundingBox();
        const centerOffset = - 0.5 * ( geo.boundingBox.max.x - geo.boundingBox.min.x );
        const centerY = - 0.5 * ( geo.boundingBox.max.y - geo.boundingBox.min.y );
        geo.translate(centerOffset, centerY, 0);

        const mat = new THREE.MeshStandardMaterial({ 
            color: color, 
            roughness: 0.3, 
            metalness: 0.8 
        });
        const mesh = new THREE.Mesh(geo, mat);
        
        // Handle rotation for back-face text if needed (hacky flip)
        if (position[2] < 0) mesh.rotation.y = Math.PI; 

        mesh.position.set(...position);
        scene.add(mesh);
        
        // Store reference for cleanup/animation if needed
        if(!scene.userData.texts) scene.userData.texts = [];
        scene.userData.texts.push(mesh);
    });
};


// =========================================================
// SCENE 1: NEURAL BRAIN (With Custom Liquid Distortion)
// =========================================================
export const VanillaNeuralBrain = () => {
  return useVanillaScene((scene) => {
    // 1. Lights
    const ambient = new THREE.AmbientLight(0x4c1d95, 0.5);
    const point = new THREE.PointLight(0x7C3AED, 2, 10);
    point.position.set(2, 2, 2);
    scene.add(ambient, point);

    // 2. Liquid Core (Sphere with Noise Shader)
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 30); // High poly
    const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0x2e1065,
        emissive: 0x7C3AED,
        emissiveIntensity: 0.8,
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 1.0
    });
    
    // Inject Vertex Noise for "Distort" effect
    coreMat.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        scene.userData.coreShader = shader.uniforms; 
        
        shader.vertexShader = `
            uniform float time;
            // Ashima Simplex Noise
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857;
                vec3 ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }
            ${shader.vertexShader}
        `.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            float noise = snoise(position * 2.0 + time * 0.5);
            transformed += normal * noise * 0.3; 
            `
        );
    };

    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // 3. Particles
    const pCount = 2000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for(let i=0; i<pCount*3; i++) pPos[i] = (Math.random() - 0.5) * 4;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
        color: 0xA78BFA,
        size: 0.02,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const cloud = new THREE.Points(pGeo, pMat);
    scene.add(cloud);

    // 4. Shell
    const shellGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const shellMat = new THREE.MeshBasicMaterial({ color: 0x8B5CF6, wireframe: true, transparent: true, opacity: 0.1 });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shell);

    // 5. Orbiting Orbs
    const orbGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const orb1 = new THREE.Mesh(orbGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    const orb2 = new THREE.Mesh(orbGeo, new THREE.MeshBasicMaterial({ color: 0xf472b6 }));
    
    // Simple glow sprites
    const glowTex = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png');
    const glowMat1 = new THREE.SpriteMaterial({ map: glowTex, color: 0x38bdf8, transparent: true, blending: THREE.AdditiveBlending });
    const s1 = new THREE.Sprite(glowMat1); s1.scale.set(0.5, 0.5, 1); orb1.add(s1);
    
    const glowMat2 = glowMat1.clone(); glowMat2.color.setHex(0xf472b6);
    const s2 = new THREE.Sprite(glowMat2); s2.scale.set(0.5, 0.5, 1); orb2.add(s2);

    scene.add(orb1, orb2);

    scene.userData = { core, cloud, shell, orb1, orb2 };

  }, (scene, camera, t, delta) => {
    const { core, cloud, shell, orb1, orb2, coreShader } = scene.userData;
    
    if (coreShader) coreShader.time.value = t;

    cloud.rotation.y = -t * 0.05;
    cloud.rotation.x = -t * 0.02;

    shell.rotation.x = t * 0.1;
    shell.rotation.y = t * 0.1;

    orb1.position.set(Math.sin(t)*1.6, Math.sin(t*0.5)*0.5, Math.cos(t)*1.6);
    orb2.position.set(Math.sin(t+2)*1.8, Math.sin((t+2)*0.5)*0.5, Math.cos(t+2)*1.8);
  });
};


// =========================================================
// SCENE 2: MULTI-CHAIN NEXUS (Glass Cube + Binary)
// =========================================================
export const VanillaMultiChain = () => {
  return useVanillaScene((scene) => {
    // 1. Glass Cube
    const cubeGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const cubeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        thickness: 1.5,
        attenuationColor: new THREE.Color(0xA78BFA),
        attenuationDistance: 1,
        clearcoat: 1
    });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(cubeGeo),
        new THREE.LineBasicMaterial({ color: 0x7C3AED, transparent: true, opacity: 0.4 })
    );
    cube.add(edges);
    scene.add(cube);

    // 2. Binary Sprites
    const binaryGroup = new THREE.Group();
    // Helper to draw text to canvas
    const drawChar = (char, color) => {
        const cvs = document.createElement('canvas');
        cvs.width = 64; cvs.height = 64;
        const ctx = cvs.getContext('2d');
        ctx.font = 'bold 40px monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(char, 32, 32);
        return new THREE.CanvasTexture(cvs);
    };
    const tex0 = drawChar('0', '#A78BFA');
    const tex1 = drawChar('1', '#FFFFFF');
    
    for(let i=0; i<20; i++) {
        const mat = new THREE.SpriteMaterial({ map: Math.random()>0.5 ? tex1 : tex0, transparent: true });
        const s = new THREE.Sprite(mat);
        s.position.set((Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5));
        s.scale.setScalar(0.15);
        binaryGroup.add(s);
    }
    cube.add(binaryGroup);

    // 3. Nodes
    const nodes = [];
    const colors = [0xF0B90B, 0x627EEA, 0x14F195, 0x8247E5];
    colors.forEach((col, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 1.8;
        const node = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshBasicMaterial({ color: col }));
        node.position.x = radius;
        
        // Pipe
        const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(radius,0,0)]);
        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x8B5CF6, opacity: 0.2, transparent: true }));
        
        const group = new THREE.Group();
        group.add(node);
        group.add(line);
        group.rotation.y = angle;
        scene.add(group);
        nodes.push(group);
    });

    const light = new THREE.PointLight(0x8B5CF6, 2, 8);
    scene.add(light);

    scene.userData = { cube, nodes, binaryGroup };
  }, (scene, camera, t) => {
    const { cube, nodes, binaryGroup } = scene.userData;
    cube.rotation.y = t * 0.2;
    cube.rotation.z = Math.sin(t*0.5)*0.1;
    
    binaryGroup.children.forEach((b, i) => {
        b.position.y += Math.sin(t*3 + i) * 0.001;
    });

    nodes.forEach(g => g.rotation.y += 0.005);
  });
};


// =========================================================
// SCENE 3: SPINNING TOKEN (Gold + Text)
// =========================================================
export const VanillaToken = () => {
    return useVanillaScene((scene) => {
      // 1. Coin
      const geo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 64);
      const mat = new THREE.MeshPhysicalMaterial({
          color: 0xF59E0B, 
          metalness: 1.0,
          roughness: 0.2,
          clearcoat: 1.0,
          emissive: 0xB45309,
          emissiveIntensity: 0.2
      });
      const coin = new THREE.Mesh(geo, mat);
      coin.rotation.x = Math.PI / 2;
      scene.add(coin);
  
      // 2. Ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.03, 16, 64), new THREE.MeshBasicMaterial({ color: 0xFFFBEB }));
      coin.add(ring);
  
      // 3. Text (Requires FontLoader - handled via helper)
      loadTextGeo('$PTLY', 0.4, coin, [-0.7, -0.2, 0.1], 0xffffff); // Front
      
      // 4. Sparkles
      const sCount = 50;
      const sGeo = new THREE.BufferGeometry();
      const sPos = new Float32Array(sCount * 3);
      for(let i=0; i<sCount*3; i++) sPos[i] = (Math.random()-0.5)*5;
      sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
      
      const sMat = new THREE.PointsMaterial({
          color: 0xFCD34D,
          size: 0.05,
          transparent: true,
          blending: THREE.AdditiveBlending
      });
      const sparkles = new THREE.Points(sGeo, sMat);
      scene.add(sparkles);
  
      const dirLight = new THREE.DirectionalLight(0xffffff, 3);
      dirLight.position.set(5, 5, 10);
      scene.add(dirLight);

      scene.userData = { coin, sparkles };
    }, (scene, camera, t, delta) => {
      const { coin, sparkles } = scene.userData;
      coin.rotation.x = Math.PI/2;
      coin.rotation.z += delta * 1.5;
      coin.rotation.y = Math.sin(t)*0.2;
      sparkles.rotation.y -= delta * 0.1;
    });
};


// =========================================================
// SCENE 4: DATA EQUALIZER (Bars + Text)
// =========================================================
export const VanillaEqualizer = () => {
    return useVanillaScene((scene, camera) => {
        camera.position.set(1, 2, 4);
        camera.lookAt(0, 0, 0);

        const bars = [];
        const mat = new THREE.MeshPhysicalMaterial({ 
            color: 0x2e1065, 
            emissive: 0x8B5CF6, 
            emissiveIntensity: 0.5,
            metalness: 0.9, 
            roughness: 0.1 
        });

        for(let i=0; i<6; i++) {
            const geo = new THREE.BoxGeometry(0.3, 1, 0.3);
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set((i-2.5)*0.5, 0, 0);
            
            // Edges
            const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 }));
            mesh.add(edge);

            scene.add(mesh);
            bars.push({ mesh, offset: i*0.8 });
        }

        const grid = new THREE.GridHelper(10, 20, 0x8B5CF6, 0x27272a);
        grid.position.set(1, -0.5, 0);
        scene.add(grid);

        const light = new THREE.PointLight(0x10B981, 2, 8);
        light.position.set(2, 5, 2);
        scene.add(light);

        scene.userData = { bars, grid };
    }, (scene, camera, t) => {
        const { bars, grid } = scene.userData;
        grid.position.z = (t * 0.2) % 1;

        bars.forEach(({ mesh, offset }) => {
            const wave = Math.sin(t * 1.5 + offset);
            const targetH = 0.8 + Math.abs(wave) * 1.5;
            mesh.scale.y = targetH;
            mesh.position.y = (targetH * 1) / 2 - 0.5;
            mesh.material.emissiveIntensity = 0.5 + Math.abs(wave);
        });
    });
};