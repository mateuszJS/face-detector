"use client"

import { useRef, useState } from "react";
import UploadVideo from "./components/UploadVideo";

export default function Home() {
  const [isVideo, setIsVideo] = useState<boolean>(false)
  const videoElRef = useRef<HTMLVideoElement | null>(null)

  const onUpload = (file: File) => {
    const media = URL.createObjectURL(file);
    videoElRef.current!.src = media;
    setIsVideo(true)
  }

  return (
    <main>
      <UploadVideo onUpload={onUpload} />
      <div className={`relative ${isVideo ? 'visible' : 'invisible'}`}>
        <video id="video" controls ref={videoElRef}></video>
      </div>
    </main>
  );
}
