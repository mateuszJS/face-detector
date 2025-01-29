"use client"

import { useRef, useState } from "react";
import UploadVideo from "./components/UploadVideo";
import BoundingRects from "./components/BoundingRects";
import Hero from "./components/Hero";
import { cn } from "@/lib/utils";
import Sidebar from "./components/Sidebar";
import useDetector from "./hooks/useDetector";
import { DetectionsChart } from "./components/Chart";

export default function Home() {
  const [isVideo, setIsVideo] = useState<boolean>(false)
  const videoElRef = useRef<HTMLVideoElement | null>(null)
  const {detections, setDetector, testData, isTestData} = useDetector(videoElRef.current)

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
    console.table(detections.map(detection => detection.data))
  }

  const aspectRatio = videoElRef.current
    ? videoElRef.current!.videoWidth / videoElRef.current!.videoHeight
    : 1;
  // TODO: aspect ratio or styles im <main> are implementation details, shouldnt be here
  return (
    <main className={cn(
      'grid',
      'grid-rows-[auto_minmax(200px,1fr)]',
      'sm:grid-rows-none',
      'sm:grid-cols-2',
      'sm:h-full',
      'p-[20px]',
      'sm:p-[50px]',
      'max-w-[1200px]',
      'mx-auto',
      'gap-[20px]',
      'sm:gap-[50px]',
      {
        'grid-rows-[auto_70px_auto__minmax(300px,1fr)]': isVideo,
        'sm:grid-rows-[50px_minmax(300px,1fr)]': isVideo,
        'sm:grid-cols-[270px_minmax(0,1fr)]': isVideo,
        'max-w-[1500px]': isVideo,
      }
    )}>
      <Hero small={isVideo} />
      <UploadVideo onUpload={onUpload} />
      {isVideo && (
        <Sidebar setDetector={setDetector} exportData={exportData}>
          {isTestData && <DetectionsChart testData={testData} />}
      </Sidebar>
      )}
      <div
        className={cn(
          'relative',
          'place-self-start',
          'sm:place-self-center',
          'max-h-[100%]',
          isVideo ? 'flex' : 'hidden'
        )}
        // we use class "hidden" to gather reference to Video ahead of time
        style={{aspectRatio}}
      >
        <video controls ref={videoElRef} />
        <BoundingRects detections={detections} />
      </div>
    </main>
  );
}
