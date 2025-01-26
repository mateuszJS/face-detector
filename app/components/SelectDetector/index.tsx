import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// TODO: lazy load all detectors, they might be expensive
import TenserFlowDetector from '@/app/detectors/TenserFlowDetector';
import NewestMediapipeDetectorVideo from '@/app/detectors/NewestMediapipeDetectorVideo';
import NewestMediapipeDetectorImage from '@/app/detectors/NewestMediapipeDetectorImage';
import TenserFlowFaceApiDetector from '@/app/detectors/TenserFlowFaceApiDetector';
import Detector from "@/app/detectors/Detector";
import { useEffect, useState } from "react";

interface DetectorOption {
  label: string
  detector: Detector
  docsLink: string
}

const detectors: Record<string, DetectorOption> = {
  'tenser_flow_face_api': {
    label: 'TenserFlow - Face API',
    detector: new TenserFlowFaceApiDetector(),
    docsLink: 'https://justadudewhohacks.github.io/face-api.js/docs/index.html'
  },
  'tenser_flow_mediapipe_runtime': {
    label: 'Tenser Flow with Mediapipe runtime',
    detector: new TenserFlowDetector(),
    docsLink: 'https://github.com/tensorflow/tfjs-models/tree/master/face-detection/src/mediapipe',
  },
  'mediapipe_video': {
    label: 'Google MediaPipe - Video',
    detector: new NewestMediapipeDetectorVideo(),
    docsLink: 'https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector',
  },
  'mediapipe_image': {
    label: 'Google MediaPipe - Image',
    detector: new NewestMediapipeDetectorImage(),
    docsLink: 'https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector',
  }
}
const defaultDetector = 'tenser_flow_mediapipe_runtime'

interface Props {
  setDetector: (detector: Detector) => void
}

export default function SelectDetector({ setDetector }: Props) {
  const [details, setDetails] = useState(detectors[defaultDetector])

  const onSelectDetector = (detectorKey: keyof typeof detectors) => {
    const newDetails = detectors[detectorKey]
    setDetails(newDetails)
  }

  useEffect(() => {
    setDetector(details.detector)
  }, [details.detector])

  return (
    <div>
      <Select onValueChange={onSelectDetector} defaultValue={defaultDetector}>
        <SelectTrigger className="w-[350px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(detectors).map(([key, props]) => (
            <SelectItem key={key} value={key}>{props.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-[0.8rem] text-muted-foreground">
        To learn more go to&nbsp;<a target="_blank" href={details.docsLink}>documentation</a>.
      </p>
    </div>
  )
}