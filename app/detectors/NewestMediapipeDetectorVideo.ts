
import { FaceDetector, FilesetResolver, FaceDetectorResult, Detection } from '@mediapipe/tasks-vision';
import Detector from './Detector';

export default class NewestMediapipeDetector implements Detector {
  private detector: null | FaceDetector = null
  private lastTime = -1

  constructor() {
    const initFaceDetector = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      this.detector = await FaceDetector.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
              delegate: "GPU"
            },
            runningMode: 'VIDEO',
            minDetectionConfidence: 0.5, // The minimum confidence score for the face detection to be considered successful.
            minSuppressionThreshold: 0.3, // The minimum non-maximum-suppression threshold for face detection to be considered overlapped.
          });
    }

    if (typeof window !== "undefined") {
      initFaceDetector()
    }
  }

  async detect(videoEl: HTMLVideoElement) {
    if (!this.detector || this.lastTime === videoEl.currentTime) return []
    this.lastTime = videoEl.currentTime

    const { detections } = await new Promise<FaceDetectorResult>(resolve => {
      resolve(this.detector!.detectForVideo(videoEl, videoEl.currentTime))
    });

    const successfulDetections = detections.filter(detection => detection.boundingBox) as Required<Detection>[]

    return successfulDetections.map(({ boundingBox }) => ({
      x: boundingBox.originX,
      y: boundingBox.originY,
      width: boundingBox.width,
      height: boundingBox.height
    }))
  }
}