import Detector from '@/app/detectors/Detector';
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
  const [boxes, setBoxes] = useState<BoxStyle[]>([]);

  useEffect(() => {
    let rvfcId: number;
    const width = videoEl.videoWidth;
    const height = videoEl.videoHeight;

    async function renderLoop() {
      const boxes = await detector.detect(videoEl)

      const relativeBoxes = boxes.map((box) => ({
        left: (box.x / width) * 100 + '%',
        top: (box.y / height) * 100 + '%',
        width: (box.width / width) * 100 + '%',
        height: (box.height / height) * 100 + '%',
      }))
      setBoxes(relativeBoxes);

      rvfcId = videoEl.requestVideoFrameCallback( renderLoop );
    }

    videoEl.requestVideoFrameCallback( renderLoop );

    return () => {
      videoEl.cancelVideoFrameCallback(rvfcId)
    }
  }, [])

  return (
    <>
      {boxes.map((box, index) => (
        <div className={styles.box} style={box} key={index}></div>
      ))}
    </>
  )
}