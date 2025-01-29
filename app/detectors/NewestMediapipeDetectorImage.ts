
import { FaceDetector, FilesetResolver, Detection } from '@mediapipe/tasks-vision';
import Detector, { DetectorType } from './Detector';


function captureVideo(video: HTMLVideoElement) {
  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d")!;
  if (!canvasContext) throw Error('Canvas failed ot obtain context 2d!')

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  if (!canvasContext) throw Error('Canvas failed ot obtain context 2d!')
  canvasContext.drawImage(video, 0, 0);

  return new Promise<HTMLCanvasElement>(resolve => {
    resolve(canvas)
  })
}

export default class NewestMediapipeDetector implements Detector {
  private detector: null | FaceDetector = null
  public type = DetectorType.MediaPipeImage

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
            runningMode: 'IMAGE',
            minDetectionConfidence: 0.5, // The minimum confidence score for the face detection to be considered successful.
            minSuppressionThreshold: 0.3, // The minimum non-maximum-suppression threshold for face detection to be considered overlapped.
          });
    }

    if (typeof window !== "undefined") {
      initFaceDetector()
    }
  }

  async detect(videoEl: HTMLVideoElement) {
    if (!this.detector) return []
    const now = performance.now()
    const canvas = await captureVideo(videoEl)
    const { detections } = this.detector!.detect(canvas)
    const successfulDetections = detections.filter(detection => detection.boundingBox) as Required<Detection>[]

    return successfulDetections.map(({ boundingBox }) => ({
      detectorType: this.type,
      x: boundingBox.originX,
      y: boundingBox.originY,
      width: boundingBox.width,
      height: boundingBox.height,
      time: performance.now() - now,
    }))
  }
}