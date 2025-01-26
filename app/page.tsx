"use client"

import { useRef, useState } from "react";
import UploadVideo from "./components/UploadVideo";
import BoundingRects from "./components/BoundingRects";
import Hero from "./components/Hero";
import { cn } from "@/lib/utils";
import Sidebar from "./components/Sidebar";
import useDetector from "./hooks/useDetector";

export default function Home() {
  const [isVideo, setIsVideo] = useState<boolean>(false)
  const videoElRef = useRef<HTMLVideoElement | null>(null)
  const {detections, setDetector} = useDetector(videoElRef.current)

  const onUpload = (file: File) => {
    // there is an error when createObjectURL receives something different than File
    console.log(file)

    const media = URL.createObjectURL(file);
    videoElRef.current!.src = media;

    videoElRef.current!.addEventListener('loadedmetadata', () => {
      // let's wait for the moment when size of the video is known
      // otherwise bounding rects cannot be scaled properly
      setIsVideo(true)
    })
  }

  const exportData = () => {
    console.log(`Data for video at: ${videoElRef.current!.currentTime.toFixed(3)} sec`)
    console.table(detections.map(detection => detection.coords))
  }

  const aspectRatio = videoElRef.current
    ? videoElRef.current!.videoWidth / videoElRef.current!.videoHeight
    : 1;
  // TODO: aspect ratio or styles im <main> are implementation details, shouldnt be here
  return (
    <main className={cn(
      'grid',
      'grid-cols-2',
      'h-full',
      'p-[50px]',
      'max-w-[1200px]',
      'mx-auto',
      'gap-[50px]',
      {
        'grid-rows-[50px_minmax(300px,1fr)]': isVideo,
        'grid-cols-[270px_minmax(0,1fr)]': isVideo,
        'max-w-[1500px]': isVideo,
      }
    )}>
      <Hero small={isVideo} />
      <UploadVideo onUpload={onUpload} />
      {isVideo && <Sidebar setDetector={setDetector} exportData={exportData} />}
      <div
        className={cn('relative', 'place-self-center', 'max-h-[100%]', isVideo ? 'flex' : 'hidden')}
        // we use class "hidden" to gather reference to Video ahead of time
        style={{aspectRatio}}
      >
        <video controls ref={videoElRef} />
        <BoundingRects detections={detections} />
      </div>
    </main>
  );
}
