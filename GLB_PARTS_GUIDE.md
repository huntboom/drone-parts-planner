# GLB Files and Sub-Parts Guide

## Understanding GLB Structure

**GLB (GL Transmission Format Binary)** files are binary containers that can hold:
- Multiple 3D meshes/objects
- Materials and textures
- Animations
- Scene hierarchy
- Metadata

## Your Drone GLB Files

Based on your conversion logs, each drone GLB file contains multiple named objects:

### Typical Structure:
- **Frame** - The main drone frame/body
- **Motor-Top**, **Motor-Top.001**, **Motor-Top.002**, **Motor-Top.003** - Four motors
- **PropCW-tri**, **PropCCW-tri** - Propellers (clockwise and counter-clockwise)
- Additional components depending on the drone model

## Accessing Sub-Parts Without Modifying GLB

**Yes!** You can access individual parts without modifying the GLB file. Here's how:

### 1. Load the GLB File
```javascript
import { useGLTF } from '@react-three/drei';

const { scene } = useGLTF('/path/to/drone.glb');
```

### 2. Traverse the Scene to Find Parts
```javascript
// Find all motors
scene.traverse((child) => {
  if (child.name && child.name.includes('Motor')) {
    console.log('Found motor:', child.name);
    // You can now manipulate this motor:
    child.visible = false; // Hide it
    child.material.color.setHex(0xff0000); // Change color
    child.scale.set(1.5, 1.5, 1.5); // Scale it
  }
});
```

### 3. Find Specific Parts by Name
```javascript
import { findMeshByName } from './utils/glbInspector';

const motors = findMeshByName(scene, 'Motor');
motors.forEach(motor => {
  motor.visible = true; // Show all motors
});
```

## Available Utility Functions

I've created utility functions in `src/utils/glbInspector.js`:

- `getMeshNames(scene)` - Get all mesh/object names
- `findMeshByName(scene, name)` - Find objects by name (partial match)
- `getMotors(scene)` - Get all motor objects
- `getPropellers(scene)` - Get all propeller objects
- `getFrame(scene)` - Get the frame object
- `setPartVisibility(scene, partName, visible)` - Show/hide parts
- `getDronePartsSummary(scene)` - Get summary of all parts

## Example: Hide/Show Motors

```javascript
import { setPartVisibility } from './utils/glbInspector';

// Hide all motors
setPartVisibility(scene, 'Motor', false);

// Show all motors
setPartVisibility(scene, 'Motor', true);
```

## Example: Change Motor Colors

```javascript
import { getMotors } from './utils/glbInspector';

const motors = getMotors(scene);
motors.forEach((motor, index) => {
  if (motor.material) {
    motor.material.color.setHex(0x00ff00); // Green
  }
});
```

## Example: Swap Parts Between Drones

You can't directly swap parts between GLB files, but you can:
1. Load both GLB files
2. Find the part you want in one GLB
3. Clone it
4. Add it to the other scene
5. Remove the original part

```javascript
// Load two drones
const { scene: drone1 } = useGLTF('/drone1.glb');
const { scene: drone2 } = useGLTF('/drone2.glb');

// Get motors from drone1
const motors1 = getMotors(drone1);

// Clone and add to drone2
motors1.forEach(motor => {
  const clonedMotor = motor.clone();
  drone2.add(clonedMotor);
});
```

## Benefits of This Approach

1. **No File Modification** - Original GLB files stay intact
2. **Runtime Manipulation** - Change parts dynamically
3. **Performance** - Only load what you need
4. **Flexibility** - Mix and match parts from different drones
5. **Customization** - Change colors, materials, visibility

## Limitations

- Parts must be named in the original GLB file
- You can't add new geometry without creating new GLB files
- Material changes are runtime-only (not saved to GLB)
- Complex animations might be tied to specific object names

## Next Steps for Your App

You could add features like:
- **Part Selector UI** - Let users choose which parts to show/hide
- **Color Customization** - Change colors of motors, propellers, etc.
- **Part Swapping** - Swap motors between different drone models
- **Part Details Panel** - Show information about each part
- **Export Configuration** - Save which parts are visible/hidden

The utilities I've created make all of this possible without modifying your GLB files!

