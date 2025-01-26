interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export default abstract class Detector {
  abstract detect(videoEl: HTMLVideoElement): Promise<Rect[]>
}