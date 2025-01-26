import { useState, useEffect } from "react";
import Detector, { Rect } from '@/app/detectors/Detector';

export interface RichDetection {
  coords: Rect
  style: {
    width: string
    height: string
    left: string
    top: string
  }
};

export default function useDetector(videoEl: HTMLVideoElement | null) {
  // TODO: directly update the styles, avoid using any react related state
  const [detections, setDetections] = useState<RichDetection[]>([]);
  const [detector, setDetector] = useState<Detector | null>(null)

   useEffect(() => {
    if (!videoEl || !detector) return

     let rvfcId: number;
     let isEffectCleared = false
 
     async function renderLoop() {
       let detectedBoxes: Rect[] = []

       if (!detector) throw Error('Detector changed value to null')
       if (!videoEl) throw Error('videoEl changed value to null')

       try {
        detectedBoxes = await detector.detect(videoEl)
       } catch(err) {
         console.log('On 99% Google Mediapipe - Video failed AGAIN!', err)
       }

       const width = videoEl.videoWidth
       const height = videoEl.videoHeight
       
       const enhancedDetections = detectedBoxes.map<RichDetection>((box) => ({
          coords: box,
          style: {
            left: (box.x / width) * 100 + '%',
            top: (box.y / height) * 100 + '%',
            width: (box.width / width) * 100 + '%',
            height: (box.height / height) * 100 + '%',
          }
       }))
       setDetections(enhancedDetections)
 
       if (!isEffectCleared) {
         // sometimes use effect is cleared faster then detector.detect happens
         // in those cases rvfcId is undefined because frame was not yet requested because detect still happens
         rvfcId = videoEl.requestVideoFrameCallback(renderLoop)
       }
     }
 
     renderLoop() // without requestVideoFrameCallback to re-detect when detector changes, without frame change
     videoEl.requestVideoFrameCallback(renderLoop) // useful when loads first video, to catch moment when is loaded

     return () => {
       isEffectCleared = true
       videoEl.cancelVideoFrameCallback(rvfcId)
     }
   }, [videoEl, detector])

   return {
    detections,
    setDetector
   }
}