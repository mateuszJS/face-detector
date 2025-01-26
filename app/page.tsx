"use client"

import { useRef, useState } from "react";
import UploadVideo from "./components/UploadVideo";
import BoundingRects from "./components/BoundingRects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// TODO: lazy load all detectors, they might be expensive
import TenserFlowDetector from './detectors/TenserFlowDetector';
import NewestMediapipeDetectorVideo from './detectors/NewestMediapipeDetectorVideo';
import NewestMediapipeDetectorImage from './detectors/NewestMediapipeDetectorImage';
import TenserFlowFaceApiDetector from './detectors/TenserFlowFaceApiDetector';
import Detector from "./detectors/Detector";

interface DetectorOption {
  label: string
  detector: Detector
  docsLink: string
}

const detectors = {
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
const defaultDetector: keyof typeof detectors = 'mediapipe_image'

export default function Home() {
  const [isVideo, setIsVideo] = useState<boolean>(false)
  const videoElRef = useRef<HTMLVideoElement | null>(null)
  const [detector, setDetector] = useState<DetectorOption>(detectors[defaultDetector])

  const onUpload = (file: File) => {
    const media = URL.createObjectURL(file);
    videoElRef.current!.src = media;

    videoElRef.current!.addEventListener('loadedmetadata', () => {
      // let's wait for the moment when size of the video is known
      // otherwise bounding rects cannot be scaled properly
      setIsVideo(true)
    })
  }

  const onSelectDetector = (detectorKey: keyof typeof detectors) => {
    setDetector(detectors[detectorKey])
  }

  return (
    <main>
      {!isVideo && <UploadVideo onUpload={onUpload} />}
      <Select onValueChange={onSelectDetector} defaultValue={defaultDetector}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(detectors).map(([key, props]) => (
            <SelectItem key={key} value={key}>{props.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-[0.8rem] text-muted-foreground">
        To learn more go to&nbsp;<a target="_blank" href={detector.docsLink}>documentation</a>.
      </p>

      <div className={`relative ${isVideo ? 'block' : 'hidden'}`}>
        <video controls ref={videoElRef} />
        {videoElRef.current && <BoundingRects videoEl={videoElRef.current} detector={detector.detector} />}
      </div>
    </main>
  );
}
