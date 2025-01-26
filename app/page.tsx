"use client"

import { useRef, useState } from "react";
import UploadVideo from "./components/UploadVideo";
import BoundingRects from "./components/BoundingRects";

// TODO: lazy load all detectors, they might be expensive
import TenserFlowDetector from './detectors/TenserFlowDetector';
import NewestMediapipeDetectorVideo from './detectors/NewestMediapipeDetectorVideo';
import NewestMediapipeDetectorImage from './detectors/NewestMediapipeDetectorImage';
import TenserFlowFaceApiDetector from './detectors/TenserFlowFaceApiDetector';


const detector = new TenserFlowFaceApiDetector()
// const detector = new TenserFlowDetector()
// const detector = new NewestMediapipeDetectorVideo()
// const detector = new NewestMediapipeDetectorImage()

export default function Home() {
  const [isVideo, setIsVideo] = useState<boolean>(false)
  const videoElRef = useRef<HTMLVideoElement | null>(null)

  const onUpload = (file: File) => {
    const media = URL.createObjectURL(file);
    videoElRef.current!.src = media;

    videoElRef.current!.addEventListener('loadedmetadata', () => {
      // let's wait for the moment when size of the video is known
      // otherwise bounding rects cannot be scaled properly
      setIsVideo(true)
    })
  }

  return (
    <main>
      {!isVideo && <UploadVideo onUpload={onUpload} />}
      <div className={`relative ${isVideo ? 'block' : 'hidden'}`}>
        <video controls ref={videoElRef} />
        {videoElRef.current && <BoundingRects videoEl={videoElRef.current} detector={detector} />}
      </div>
    </main>
  );
}
