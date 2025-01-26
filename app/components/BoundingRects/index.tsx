import Detector, { Rect } from '@/app/detectors/Detector';
import styles from './styles.module.css'
import { useEffect, useState } from 'react';

interface Props {
  videoEl: HTMLVideoElement
  detector: Detector
}

interface BoxStyle {
  width: string
  height: string
  left: string
  top: string
};

export default function BoundingRects({ videoEl, detector }: Props) {
  // TODO: directly update the styles, avoid using any react related state
  const [boxes, setBoxes] = useState<BoxStyle[]>([]);

  useEffect(() => {
    let rvfcId: number;
    let isEffectCleared = false
    const width = videoEl.videoWidth
    const height = videoEl.videoHeight

    async function renderLoop() {
      let boxes: Rect[] = []
      try {
        boxes = await detector.detect(videoEl)
      } catch(err) {
        console.log('On 99% Google Mediapipe - Video failed AGAIN!', err)
      }
      
      const relativeBoxes = boxes.map((box) => ({
        left: (box.x / width) * 100 + '%',
        top: (box.y / height) * 100 + '%',
        width: (box.width / width) * 100 + '%',
        height: (box.height / height) * 100 + '%',
      }))
      setBoxes(relativeBoxes)

      if (!isEffectCleared) {
        // sometimes use effect is cleared faster then detector.detect happens
        // in those cases rvfcId is undefined because frame was not yet requested because detect still happens
        rvfcId = videoEl.requestVideoFrameCallback(renderLoop)
      }
    }

    renderLoop() // without requestVideoFrameCallback to re-detect when detector changes, without frame change

    return () => {
      isEffectCleared = true
      videoEl.cancelVideoFrameCallback(rvfcId)
    }
  }, [detector])

  return (
    <>
      {boxes.map((box, index) => (
        <div className={styles.box} style={box} key={index}></div>
      ))}
    </>
  )
}