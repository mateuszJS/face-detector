import styles from './styles.module.css'

interface Props {
  small: boolean
}

export default function Hero({ small = false }: Props) {
  return (
    <div className="flex justify-center flex-col">
      <div className="">
        <h1 className={styles.title}>Face Detector</h1>
        {!small && (
          <>
            <p>Welcome to the state-of-the-art face detection dashboard!</p>
            <p className="sm:pb-[75px]">Go ahead, upload video, chose the detector.</p>
          </>
        )}
      </div>
    </div>
  )
}