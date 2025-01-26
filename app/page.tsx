"use client"

import { useRef, useState } from "react";
import UploadVideo from "./components/UploadVideo";
import BoundingRects from "./components/BoundingRects";
import Detector from "./detectors/Detector";
import SelectDetector from "./components/SelectDetector";
import Hero from "./components/Hero";

export default function Home() {
  const [isVideo, setIsVideo] = useState<boolean>(false)
  const [detector, setDetector] = useState<Detector | null>(null)
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
    <main className="grid grid-cols-2 h-full p-[50px] max-w-[1200px] mx-auto">
      <Hero />
      <UploadVideo onUpload={onUpload} />
      {isVideo && <SelectDetector setDetector={setDetector} />}
      <div className={`relative ${isVideo ? 'block' : 'hidden'}`}>
        <video controls ref={videoElRef} />
        {(isVideo && videoElRef.current && detector) && <BoundingRects
          videoEl={videoElRef.current}
          detector={detector}
        />}
      </div>
    </main>
  );
}
