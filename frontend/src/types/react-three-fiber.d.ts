import { Object3D, Material, BufferGeometry } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      mesh: any;
      sphereGeometry: any;
      shaderMaterial: any;
      points: any;
      pointsMaterial: any;
    }
  }
}

declare module '@react-three/fiber' {
  export interface RootState {
    clock: { getElapsedTime: () => number };
    // เพิ่ม properties อื่นๆ ตามที่จำเป็น
  }
  
  export function useFrame(callback: (state: RootState) => void): void;
  export function Canvas(props: any): JSX.Element;
}

declare module '@react-three/drei' {
  export function OrbitControls(props: any): JSX.Element;
}