import { RichDetection } from '@/app/hooks/useDetector';
import styles from './styles.module.css'

interface Props {
  detections: RichDetection[]
}

export default function BoundingRects({ detections }: Props) {
  return (
    <>
      {detections.map((detection, index) => (
        <div className={styles.box} style={detection.style} key={index}></div>
      ))}
    </>
  )
}