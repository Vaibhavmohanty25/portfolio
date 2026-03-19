/* ============================================================
   SOLAR SYSTEM PORTFOLIO — SCRIPT.JS
   Three.js 3D solar system with planet interactions
   ============================================================ */

(function () {
  'use strict';

  // ======================== CONSTANTS ========================

  const PLANET_DATA = [
    { name: 'Projects Overview',           emoji: '🌍', color: 0x4fc3f7, radius: 1.2,  orbitRadius: 12,  speed: 0.35,  panelId: 'panel-projects'   },
    { name: 'University Management System', emoji: '🚀', color: 0x7c4dff, radius: 1.0,  orbitRadius: 17,  speed: 0.28,  panelId: 'panel-ums'        },
    { name: 'FaceSense',                    emoji: '🧠', color: 0xba68c8, radius: 0.9,  orbitRadius: 22,  speed: 0.22,  panelId: 'panel-facesense'  },
    { name: 'Mini Blogger',                 emoji: '✍️', color: 0x81c784, radius: 0.85, orbitRadius: 27,  speed: 0.18,  panelId: 'panel-blogger'    },
    { name: 'Civitas Disaster System',      emoji: '🌐', color: 0xff8a65, radius: 1.1,  orbitRadius: 32,  speed: 0.14,  panelId: 'panel-civitas'    },
    { name: 'Running',                      emoji: '🏃', color: 0xffd54f, radius: 0.7,  orbitRadius: 37,  speed: 0.12,  panelId: 'panel-running'    },
    { name: 'Swimming',                     emoji: '🏊', color: 0x4dd0e1, radius: 0.75, orbitRadius: 42,  speed: 0.10,  panelId: 'panel-swimming'   },
    { name: 'Skills & Tech Stack',          emoji: '🛠', color: 0xef5350, radius: 1.0,  orbitRadius: 47,  speed: 0.08,  panelId: 'panel-skills'     },
    { name: 'About Me',                     emoji: '👨‍💻', color: 0xf06292, radius: 0.95, orbitRadius: 52,  speed: 0.06,  panelId: 'panel-about'      },
  ];

  const SUN_PANEL_ID = 'panel-contact';

  // ======================== STATE ========================

  const state = {
    hoveredPlanet: null,
    focusedPlanet: null,   // index or 'sun'
    isZooming: false,
    isMobile: window.innerWidth < 768,
    orbitPaused: false,
    time: 0,
    cameraTarget: new THREE.Vector3(0, 0, 0),
    cameraDest: null,
    cameraLookDest: null,
    zoomProgress: 0,
    cameraStartPos: null,
    cameraStartLook: null,
  };

  // ======================== MOBILE CHECK ========================

  if (state.isMobile) {
    initMobile();
    hideLoadingScreen();
    return;
  }

  // ======================== THREE.JS SETUP ========================

  const canvas = document.getElementById('solar-system-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 45, 70);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // ======================== STARFIELD ========================

  function createStarfield() {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinkle = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute in a sphere
      const r = 400 + Math.random() * 600;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 2 + 0.5;
      twinkle[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('twinklePhase', new THREE.BufferAttribute(twinkle, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute float twinklePhase;
        varying float vAlpha;
        uniform float uTime;
        void main() {
          vAlpha = 0.4 + 0.6 * abs(sin(uTime * 0.5 + twinklePhase));
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
          gl_FragColor = vec4(0.9, 0.9, 1.0, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(geo, mat);
    scene.add(stars);
    return { mesh: stars, material: mat };
  }

  const starfield = createStarfield();

  // ======================== NEBULA / FOG EFFECT ========================

  function createNebula() {
    const nebulaGroup = new THREE.Group();

    // Create several translucent colored planes at various depths
    const nebulaColors = [
      { color: 0x1a0533, opacity: 0.15, pos: [-180, -50, -300], scale: 500 },
      { color: 0x0a0a4e, opacity: 0.1, pos: [200, 80, -350], scale: 400 },
      { color: 0x2a0520, opacity: 0.08, pos: [-100, 100, -250], scale: 350 },
    ];

    nebulaColors.forEach(n => {
      const geo = new THREE.PlaneGeometry(n.scale, n.scale);
      const mat = new THREE.MeshBasicMaterial({
        color: n.color,
        transparent: true,
        opacity: n.opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(n.pos[0], n.pos[1], n.pos[2]);
      mesh.rotation.set(Math.random(), Math.random(), 0);
      nebulaGroup.add(mesh);
    });

    scene.add(nebulaGroup);
    return nebulaGroup;
  }

  createNebula();

  // ======================== LIGHTING ========================

  const ambientLight = new THREE.AmbientLight(0x222244, 0.4);
  scene.add(ambientLight);

  const sunLight = new THREE.PointLight(0xffcc77, 2.5, 300, 1.5);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  // A secondary fill light
  const fillLight = new THREE.PointLight(0x4466ff, 0.5, 200);
  fillLight.position.set(0, 60, 0);
  scene.add(fillLight);

  // ======================== SUN ========================

  // Generate a circular gradient texture for the sun corona
  function createGlowTexture(size, innerColor, outerColor) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const center = size / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(0.4, innerColor);
    gradient.addColorStop(1, outerColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }

  function createSun() {
    const group = new THREE.Group();

    // Core sphere
    const coreGeo = new THREE.SphereGeometry(3.5, 64, 64);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffdd55,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Glow layers with additive blending
    for (let i = 0; i < 3; i++) {
      const glowGeo = new THREE.SphereGeometry(3.5 + (i + 1) * 0.8, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: [0xffaa33, 0xff8800, 0xff5500][i],
        transparent: true,
        opacity: [0.2, 0.1, 0.05][i],
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      group.add(glow);
    }

    // Corona sprite with canvas-generated circular gradient
    const coronaTexture = createGlowTexture(256, 'rgba(255,170,68,0.5)', 'rgba(255,170,68,0)');
    const spriteMat = new THREE.SpriteMaterial({
      map: coronaTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(22, 22, 1);
    group.add(sprite);

    // Second larger corona layer for extra glow
    const corona2Texture = createGlowTexture(256, 'rgba(255,100,20,0.3)', 'rgba(255,80,0,0)');
    const sprite2Mat = new THREE.SpriteMaterial({
      map: corona2Texture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite2 = new THREE.Sprite(sprite2Mat);
    sprite2.scale.set(30, 30, 1);
    group.add(sprite2);

    scene.add(group);
    return { group, core };
  }

  const sun = createSun();

  // ======================== PLANETS ========================

  const planets = [];

  function createPlanet(data, index) {
    const group = new THREE.Group();

    // Planet sphere
    const geo = new THREE.SphereGeometry(data.radius, 48, 48);
    const mat = new THREE.MeshStandardMaterial({
      color: data.color,
      emissive: data.color,
      emissiveIntensity: 0.25,
      metalness: 0.3,
      roughness: 0.6,
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    // Glow
    const glowGeo = new THREE.SphereGeometry(data.radius * 1.4, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: data.color,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);

    // Initial position
    const angle = (index / PLANET_DATA.length) * Math.PI * 2;
    group.position.x = Math.cos(angle) * data.orbitRadius;
    group.position.z = Math.sin(angle) * data.orbitRadius;

    scene.add(group);

    // Orbit ring
    const orbitGeo = new THREE.RingGeometry(data.orbitRadius - 0.05, data.orbitRadius + 0.05, 128);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = -Math.PI / 2;
    scene.add(orbitRing);

    return {
      group,
      mesh,
      glow,
      glowMat,
      mat,
      orbitRing,
      angle,
      data,
      index,
      currentSpeed: data.speed,
      targetScale: 1,
      currentScale: 1,
      baseEmissiveIntensity: 0.25,
      targetEmissiveIntensity: 0.25,
    };
  }

  PLANET_DATA.forEach((data, i) => {
    planets.push(createPlanet(data, i));
  });

  // ======================== RAYCASTER ========================

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const label = document.getElementById('planet-label');
  const labelText = label.querySelector('.planet-label-text');

  function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (state.focusedPlanet !== null) return;

    raycaster.setFromCamera(mouse, camera);

    // Check planets
    const planetMeshes = planets.map(p => p.mesh);
    const intersects = raycaster.intersectObjects(planetMeshes);

    // Check sun
    const sunIntersects = raycaster.intersectObject(sun.core);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const planet = planets.find(p => p.mesh === hit);
      if (planet) {
        state.hoveredPlanet = planet.index;
        canvas.style.cursor = 'pointer';

        // Update label
        labelText.textContent = planet.data.emoji + ' ' + planet.data.name;
        label.classList.remove('hidden');

        // Position label
        const screenPos = planet.group.position.clone().project(camera);
        const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;
        label.style.left = x + 'px';
        label.style.top = y + 'px';
      }
    } else if (sunIntersects.length > 0) {
      state.hoveredPlanet = 'sun';
      canvas.style.cursor = 'pointer';
      labelText.textContent = '☀️ Contact Me';
      label.classList.remove('hidden');

      const screenPos = new THREE.Vector3(0, 0, 0).project(camera);
      const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;
      label.style.left = x + 'px';
      label.style.top = y + 'px';
    } else {
      state.hoveredPlanet = null;
      canvas.style.cursor = 'default';
      label.classList.add('hidden');
    }
  }

  function onClick() {
    if (state.isZooming) return;

    if (state.hoveredPlanet === 'sun') {
      zoomToSun();
    } else if (state.hoveredPlanet !== null) {
      zoomToPlanet(state.hoveredPlanet);
    }
  }

  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('click', onClick);

  // ======================== ZOOM TRANSITIONS ========================

  function zoomToPlanet(index) {
    const planet = planets[index];
    state.isZooming = true;
    state.focusedPlanet = index;
    state.orbitPaused = true;
    label.classList.add('hidden');
    canvas.style.cursor = 'default';

    // Compute camera destination
    const pPos = planet.group.position.clone();
    const dir = pPos.clone().normalize();
    const offset = dir.multiplyScalar(planet.data.radius * 5);
    const camDest = pPos.clone().add(new THREE.Vector3(offset.x, planet.data.radius * 3, offset.z));

    state.cameraStartPos = camera.position.clone();
    state.cameraStartLook = state.cameraTarget.clone();
    state.cameraDest = camDest;
    state.cameraLookDest = pPos.clone();
    state.zoomProgress = 0;

    // Hide nav hint
    document.getElementById('nav-hint').classList.add('hidden');

    // Show panel after zoom
    setTimeout(() => {
      showPanel(planet.data.panelId);
      state.isZooming = false;
    }, 1200);
  }

  function zoomToSun() {
    state.isZooming = true;
    state.focusedPlanet = 'sun';
    state.orbitPaused = true;
    label.classList.add('hidden');
    canvas.style.cursor = 'default';

    const camDest = new THREE.Vector3(0, 8, 18);

    state.cameraStartPos = camera.position.clone();
    state.cameraStartLook = state.cameraTarget.clone();
    state.cameraDest = camDest;
    state.cameraLookDest = new THREE.Vector3(0, 0, 0);
    state.zoomProgress = 0;

    document.getElementById('nav-hint').classList.add('hidden');

    setTimeout(() => {
      showPanel(SUN_PANEL_ID);
      state.isZooming = false;
    }, 1200);
  }

  function zoomOut() {
    if (state.isZooming) return;
    state.isZooming = true;

    // Hide all panels
    hideAllPanels();

    const camDest = new THREE.Vector3(0, 45, 70);

    state.cameraStartPos = camera.position.clone();
    state.cameraStartLook = state.cameraTarget.clone();
    state.cameraDest = camDest;
    state.cameraLookDest = new THREE.Vector3(0, 0, 0);
    state.zoomProgress = 0;

    setTimeout(() => {
      state.focusedPlanet = null;
      state.orbitPaused = false;
      state.isZooming = false;
      document.getElementById('nav-hint').classList.remove('hidden');
    }, 1200);
  }

  // ======================== PANEL MANAGEMENT ========================

  function showPanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
      panel.classList.remove('hidden');
      // Re-trigger animation
      const glass = panel.querySelector('.panel-glass');
      if (glass) {
        glass.style.animation = 'none';
        glass.offsetHeight; // force reflow
        glass.style.animation = '';
      }
    }
    document.getElementById('back-btn').classList.remove('hidden');

    // Animate skill bars if skills panel
    if (panelId === 'panel-skills') {
      animateSkillBars();
    }
  }

  function hideAllPanels() {
    document.querySelectorAll('.detail-panel').forEach(p => {
      p.classList.add('hidden');
    });
    document.getElementById('back-btn').classList.add('hidden');
  }

  function animateSkillBars() {
    const bars = document.querySelectorAll('#panel-skills .bar-fill');
    bars.forEach(bar => {
      const fill = bar.style.getPropertyValue('--fill');
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.width = fill;
        });
      });
    });
  }

  // Back button
  document.getElementById('back-btn').addEventListener('click', zoomOut);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.focusedPlanet !== null) {
      zoomOut();
    }
  });

  // ======================== SMOOTH EASING ========================

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // ======================== ANIMATION LOOP ========================

  function animate() {
    requestAnimationFrame(animate);

    const dt = 0.016; // ~60fps
    state.time += dt;

    // Update starfield twinkling
    starfield.material.uniforms.uTime.value = state.time;

    // Sun pulsation
    const sunScale = 1 + 0.04 * Math.sin(state.time * 1.5);
    sun.group.scale.set(sunScale, sunScale, sunScale);

    // Sun light flicker
    sunLight.intensity = 2.5 + 0.3 * Math.sin(state.time * 2.0);

    // Planet orbits
    planets.forEach((planet, i) => {
      // Adjust speed based on hover
      let targetSpeed = planet.data.speed;
      if (state.hoveredPlanet === i) {
        targetSpeed = planet.data.speed * 0.15; // slow down
        planet.targetScale = 1.35;
        planet.targetEmissiveIntensity = 0.6;
        planet.glowMat.opacity = 0.25;
      } else {
        planet.targetScale = 1;
        planet.targetEmissiveIntensity = 0.25;
        planet.glowMat.opacity = 0.1;
      }

      // Smooth speed
      planet.currentSpeed += (targetSpeed - planet.currentSpeed) * 0.05;

      // Smooth scale
      planet.currentScale += (planet.targetScale - planet.currentScale) * 0.08;
      planet.mesh.scale.set(planet.currentScale, planet.currentScale, planet.currentScale);

      // Smooth emissive
      const currentEI = planet.mat.emissiveIntensity;
      planet.mat.emissiveIntensity += (planet.targetEmissiveIntensity - currentEI) * 0.08;

      // Orbit
      if (!state.orbitPaused) {
        planet.angle += planet.currentSpeed * dt;
      }

      const x = Math.cos(planet.angle) * planet.data.orbitRadius;
      const z = Math.sin(planet.angle) * planet.data.orbitRadius;
      const y = Math.sin(state.time * 0.8 + i) * 0.4; // subtle bob
      planet.group.position.set(x, y, z);

      // Slow planet rotation
      planet.mesh.rotation.y += 0.005;
    });

    // Camera zoom transition
    if (state.cameraDest && state.zoomProgress < 1) {
      state.zoomProgress += dt * 0.9;
      if (state.zoomProgress > 1) state.zoomProgress = 1;
      const t = easeInOutCubic(state.zoomProgress);

      camera.position.lerpVectors(state.cameraStartPos, state.cameraDest, t);
      state.cameraTarget.lerpVectors(state.cameraStartLook, state.cameraLookDest, t);
      camera.lookAt(state.cameraTarget);

      if (state.zoomProgress >= 1) {
        state.cameraDest = null;
      }
    }

    // Subtle camera sway when not zooming
    if (!state.cameraDest && state.focusedPlanet === null) {
      const swayX = Math.sin(state.time * 0.15) * 0.8;
      const swayY = Math.cos(state.time * 0.1) * 0.4;
      camera.position.x = swayX;
      camera.position.y = 45 + swayY;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }

  // ======================== RESIZE ========================

  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);

    // Check mobile
    if (w < 768 && !state.isMobile) {
      state.isMobile = true;
      initMobile();
    }
  });

  // ======================== LOADING SCREEN ========================

  function hideLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 1300);
  }

  // Wait for everything to load, minimum 2.5 seconds
  const loadStart = Date.now();
  const MIN_LOAD_TIME = 2500;

  function onReady() {
    const elapsed = Date.now() - loadStart;
    const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);
    setTimeout(hideLoadingScreen, remaining);
  }

  // Start animation immediately, hide loader when ready
  animate();
  window.addEventListener('load', onReady);

  // ======================== CONTACT FORM ========================

  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('.submit-btn');
    const origText = btn.innerHTML;
    btn.innerHTML = '<span>✨ Message Sent!</span>';
    btn.style.background = 'linear-gradient(135deg, #81c784, #4caf50)';

    setTimeout(() => {
      btn.innerHTML = origText;
      btn.style.background = '';
      this.reset();
    }, 2500);
  });

  // ======================== MOBILE FALLBACK ========================

  function initMobile() {
    document.getElementById('mobile-fallback').classList.remove('hidden');
    canvas.style.display = 'none';
    document.getElementById('nav-hint').style.display = 'none';

    const container = document.getElementById('mobile-planets-container');
    container.innerHTML = '';

    // Sun card
    const sunCard = createMobileCard('☀️', 'Contact Me', 'Get in touch', '#ffb74d', SUN_PANEL_ID);
    container.appendChild(sunCard);

    // Planet cards
    PLANET_DATA.forEach((data) => {
      const colorHex = '#' + data.color.toString(16).padStart(6, '0');
      const card = createMobileCard(data.emoji, data.name, '', colorHex, data.panelId);
      container.appendChild(card);
    });
  }

  function createMobileCard(emoji, name, subtitle, colorHex, panelId) {
    const card = document.createElement('div');
    card.className = 'mobile-planet-card';
    card.innerHTML = `
      <div class="mobile-planet-dot" style="--dot-color: ${colorHex}; background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3), ${colorHex});"></div>
      <div class="mobile-planet-info">
        <h3>${emoji} ${name}</h3>
        ${subtitle ? `<p>${subtitle}</p>` : ''}
      </div>
    `;

    card.addEventListener('click', () => {
      showPanel(panelId);
      document.getElementById('mobile-fallback').classList.add('hidden');
    });

    return card;
  }

  // Override back button for mobile
  const backBtn = document.getElementById('back-btn');
  const origBackHandler = zoomOut;
  backBtn.addEventListener('click', function (e) {
    if (state.isMobile) {
      e.stopPropagation();
      hideAllPanels();
      document.getElementById('mobile-fallback').classList.remove('hidden');
    }
  });

})();
