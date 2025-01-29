import { useState, useEffect, useRef } from "react";
import Detector, { DetectioEntry, DetectorType } from '@/app/detectors/Detector';

export interface RichDetection {
  data: DetectioEntry
  style: {
    width: string
    height: string
    left: string
    top: string
  }
};

export type TestData = Partial<Record<DetectorType, {
  small: number,
  medium: number,
  large: number,
  totalTime: number,
  avgTime: number
}>>

export default function useDetector(videoEl: HTMLVideoElement | null) {
  // TODO: directly update the styles, avoid using any react related state
  const [detections, setDetections] = useState<RichDetection[]>([]);
  const [detector, setDetector] = useState<Detector | null>(null)
  const [testData, setTestData] = useState<TestData>({})
  const samplesCount = useRef(0)

   useEffect(() => {
    if (!videoEl || !detector) return

     let rvfcId: number;
     let isEffectCleared = false
 
     async function renderLoop() {
       let detectedBoxes: DetectioEntry[] = []

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
          data: box,
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

   useEffect(() => {
    if (!videoEl || !detector || detector.type !== DetectorType.TestAll) return

    samplesCount.current++

    const newTestData = {...testData}

    detections.forEach(detection => {
      if (!(detection.data.detectorType in newTestData)) {
        newTestData[detection.data.detectorType] = {
          large: 0,
          medium: 0,
          small: 0,
          totalTime: 0,
          avgTime: 0,
        }
      }
      newTestData[detection.data.detectorType]!.totalTime += detection.data.time
      newTestData[detection.data.detectorType]!.avgTime = (
        newTestData[detection.data.detectorType]!.totalTime / samplesCount.current
      )

      const size = detection.data.height / videoEl.videoHeight
      // if (detection.data.detectorType === DetectorType.MediaPipeImage) {
      //   console.log(size, detection.data.height)
      // }
      if (size > 0.25) {
        newTestData[detection.data.detectorType]!.large++
      } else if (size > 0.1) {
        newTestData[detection.data.detectorType]!.medium++
      } else {
        newTestData[detection.data.detectorType]!.small++
      }

    })
  
    setTestData(newTestData)
   }, [detections, detector])

   return {
    detections,
    setDetector,
    testData,
    isTestData: detector?.type === DetectorType.TestAll,
   }
}