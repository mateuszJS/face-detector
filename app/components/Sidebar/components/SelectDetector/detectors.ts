// TODO: lazy load all detectors, they are pretty expensive
import TenserFlowDetector from '@/app/detectors/TenserFlowDetector';
import NewestMediapipeDetectorVideo from '@/app/detectors/NewestMediapipeDetectorVideo';
import NewestMediapipeDetectorImage from '@/app/detectors/NewestMediapipeDetectorImage';
import TenserFlowFaceApiDetector from '@/app/detectors/TenserFlowFaceApiDetector';
import Detector, { DetectorType } from '@/app/detectors/Detector';

interface DetectorOption {
  label: string
  detector: Detector
  docsLink: string
  warning?: string
}

const tenserFlowFaceApi = new TenserFlowFaceApiDetector()
const tenserFlow = new TenserFlowDetector()
const newestMediaPipeImage = new NewestMediapipeDetectorImage()

class TestDetector extends Detector {
  type = DetectorType.TestAll

  async detect(videoEl: HTMLVideoElement) {
    const [faceApiResults, tenserFlowResults, MediaPipeImageResults ] = await Promise.all([
      tenserFlowFaceApi.detect(videoEl),
      tenserFlow.detect(videoEl),
      newestMediaPipeImage.detect(videoEl),
    ])

    return [
      ...faceApiResults,
      ...tenserFlowResults,
      ...MediaPipeImageResults,
    ]
  }
}

const detectors: Record<string, DetectorOption> = {
  'tenser_flow_face_api': {
    label: 'TenserFlow - Face API',
    detector: tenserFlowFaceApi,
    docsLink: 'https://justadudewhohacks.github.io/face-api.js/docs/index.html'
  },
  'tenser_flow_mediapipe_runtime': {
    label: 'Tenser Flow with Mediapipe runtime',
    detector: tenserFlow,
    docsLink: 'https://github.com/tensorflow/tfjs-models/tree/master/face-detection/src/mediapipe',
  },
  'mediapipe_video': {
    label: 'Google MediaPipe - Video',
    detector: new NewestMediapipeDetectorVideo(),
    docsLink: 'https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector',
    warning: '⚠️ Works like a life stream - can only analyze frames which are played frame by frame. Throws errors if asked for timestamp from the past. Does not return results if a frame was ommited(when you seek).'
  },
  'mediapipe_image': {
    label: 'Google MediaPipe - Image',
    detector: newestMediaPipeImage,
    docsLink: 'https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector',
  },
  'test_all': {
    label: 'Test them all! 📊',
    detector: new TestDetector(),
    docsLink: ''
  }
}

export default detectors