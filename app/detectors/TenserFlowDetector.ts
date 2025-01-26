
import type { createDetector, Face, FaceDetector, SupportedModels } from '@tensorflow-models/face-detection';
import Detector from './Detector';

declare global {
  interface Window {
    faceDetection: {
      createDetector: typeof createDetector
    }
  }
}

const estimationConfig = {
  flipHorizontal: false
};

function loadScript(src: string) {
  const script = document.createElement('script');
  script.src = src;
  document.head.appendChild(script);

  return new Promise<void>(resolve => {
    script.addEventListener('load', () => resolve())
  })
}

export default class TenserFlowDetector implements Detector {
  private detector: null | FaceDetector = null

  constructor() {
    const initFaceDetector = async () => {

      // dependencies needs to be loaded in order
      // cannot be instaleld as npm since JS binary doesn't build correctly
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_detection")
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core")
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter")
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl")
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/face-detection")

      this.detector = await window.faceDetection.createDetector("MediaPipeFaceDetector" as unknown as SupportedModels, {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection',
        modelType: 'full'
      });
    }

    if (typeof window !== "undefined") {
      initFaceDetector()
    }
  }

  async detect(videoEl: HTMLVideoElement) {
    if (!this.detector) return []

    let faces: Face[] = []
    try {
      faces = await this.detector.estimateFaces(videoEl, estimationConfig);
    } catch(err) {
      // throws internal errors, silence to to don't mix with actionable errors
      console.log('==========THIS IS AN ERROR===========')
      console.log(err)
    }

    return faces.map(({ box }) => ({
      x: box.xMin,
      y: box.yMin,
      width: box.width,
      height: box.height
    }))
  }
}