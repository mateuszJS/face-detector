export interface DetectioEntry {
  detectorType: DetectorType
  x: number
  y: number
  width: number
  height: number
  time: number
}

export default abstract class Detector {
  abstract type: DetectorType
  abstract detect(videoEl: HTMLVideoElement): Promise<DetectioEntry[]>
}

export enum DetectorType {
  FaceAPI = 'tenser_flow_face_api',
  TenserFlow = 'tenser_flow_mediapipe_runtime',
  MediaPipeVideo = 'mediapipe_video',
  MediaPipeImage = 'mediapipe_image',
  TestAll = 'test_all'
}