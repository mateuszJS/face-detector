
import * as faceapi from 'face-api.js'
import Detector, { DetectorType } from './Detector';

function captureVideo(video: HTMLVideoElement) {
  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d")!;
  if (!canvasContext) throw Error('Canvas failed ot obtain context 2d!')

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvasContext.drawImage(video, 0, 0);
  return canvas
}

export default class TenserFlowDetector implements Detector {
  public type = DetectorType.FaceAPI

  constructor() {
    const initFaceDetector = async () => {
      // await faceapi.nets.tinyFaceDetector.loadFromUri('/models') // left for testing puroses
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    }

    if (typeof window !== "undefined") {
      initFaceDetector()
    }
  }

  async detect(videoEl: HTMLVideoElement) {
    const now = performance.now()

    const faces = await faceapi.detectAllFaces(
      captureVideo(videoEl),
      new faceapi.SsdMobilenetv1Options()
    ).run()
    // await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions()) // left for testing purposes

    return faces.map(({ box }) => ({
      detectorType: this.type,
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      time: performance.now() - now
    }))
  }
}