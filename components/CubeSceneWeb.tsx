import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; overflow: hidden; background: transparent; }
    canvas { display: block; background: transparent; }
    #loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #666;
      font-family: Arial;
    }
  </style>
</head>
<body>
  <div id="loading">Loading 3D model...</div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js"></script>
  <script>
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Fond transparent
    renderer.shadowMap.enabled = false; // Désactiver les ombres pour éviter les artefacts
    renderer.toneMapping = THREE.LinearToneMapping; // Moins saturé que ACES
    renderer.toneMappingExposure = 0.8; // Exposition réduite (1.2 → 0.8)
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    // Soft lighting setup (reduced saturation)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Réduit (0.6 → 0.4)
    scene.add(ambientLight);
    
    // Main light with reduced intensity
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.6); // Réduit (0.8 → 0.6)
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = false;
    scene.add(mainLight);
    
    // Very soft fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.2); // Réduit (0.3 → 0.2)
    fillLight.position.set(-3, 2, -3);
    fillLight.castShadow = false;
    scene.add(fillLight);
    
    // Environment transparent
    scene.background = null; // Pas de background

    camera.position.z = 1; // Caméra très proche (2 → 1)

    let model = null;
    let touchX = 0;
    let touchY = 0;

    // GLTF Loader with DRACO
    const loader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);

    // Try to load GLB model, fallback to cube
    const modelPaths = [
      'https://raw.githubusercontent.com/carldouch/zkorp3DModel/main/logozkorp.glb', // Ton logo ZKorp
      'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf', // Fallback
      './assets/models/logozkorp.glb' // Local (won't work)
    ];

    let loadAttempts = 0;
    function tryLoadModel() {
      if (loadAttempts >= modelPaths.length) {
        // Fallback to cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xff6b00 });
        model = new THREE.Mesh(geometry, material);
        scene.add(model);
        document.getElementById('loading').style.display = 'none';
        return;
      }

      loader.load(
        modelPaths[loadAttempts],
        (gltf) => {
          const loadedModel = gltf.scene;
          
          // Calculate center of loaded model
          const box = new THREE.Box3().setFromObject(loadedModel);
          const center = box.getCenter(new THREE.Vector3());
          
          // Create a parent group at origin (0,0,0)
          model = new THREE.Group();
          
          // Add loaded model to group and offset it to center
          loadedModel.position.set(-center.x, -center.y, -center.z);
          model.add(loadedModel);
          
          // Clean materials (no shadows)
          loadedModel.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = false;
              child.receiveShadow = false;
              
              // Keep original materials clean
              if (child.material && child.material.isMeshStandardMaterial) {
                child.material.envMapIntensity = 0.5;
              }
            }
          });
          
          scene.add(model);
          document.getElementById('loading').style.display = 'none';
        },
        (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          document.getElementById('loading').textContent = 'Loading: ' + percent + '%';
        },
        (error) => {
          loadAttempts++;
          tryLoadModel();
        }
      );
    }

    tryLoadModel();

    // Touch controls (fixed Y direction)
    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
      touchX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      touchY = (e.touches[0].clientY / window.innerHeight) * 2 - 1; // Supprimé le - pour corriger
    });

    function animate() {
      requestAnimationFrame(animate);
      
      if (model) {
        model.rotation.y += 0.005; // Auto-rotation autour de Y (plus naturel)
        
        // Touch rotation with higher sensitivity
        model.rotation.x += touchY * 0.05; // Plus sensible (0.02 → 0.05)
        model.rotation.y += touchX * 0.05; // Plus sensible (0.02 → 0.05)
        
        // Limit X rotation
        model.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, model.rotation.x));
      }
      
      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
`;

export default function CubeSceneWeb() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});