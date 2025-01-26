import styles from './styles.module.css'

export default function Hero() {
  return (
    <div className="flex justify-center flex-col">
      <div className="">
        <h1 className={styles.title}>Face Detection</h1>
        <p>Upload video, chose the detector and became a spy!</p>
      </div>
    </div>
  )
}