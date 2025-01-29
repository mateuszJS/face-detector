import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import Detector from "@/app/detectors/Detector";
import detectors from "./detectors";

const defaultDetector = 'tenser_flow_mediapipe_runtime'

interface Props {
  setDetector(detector: Detector): void
}

export default function SelectDetector({ setDetector }: Props) {
  const [details, setDetails] = useState(detectors[defaultDetector])

  const onSelectDetector = (detectorKey: keyof typeof detectors) => {
    const newDetails = detectors[detectorKey]
    setDetails(newDetails)
  }

  useEffect(() => {
    // keep parent updated with current detector
    setDetector(details.detector)
  }, [details.detector, setDetector])

  return (
    <div>
      <p>Detector</p>
      <Select onValueChange={onSelectDetector} defaultValue={defaultDetector}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(detectors).map(([key, props]) => (
            <SelectItem key={key} value={key}>{props.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-[0.8rem] text-muted-foreground">
        To learn more go to&nbsp;<a target="_blank" href={details.docsLink}>documentation</a>.
      </p>
      {details.warning && <p className="text-[0.8rem] text-muted-foreground mt-[20px]">
        {details.warning}
      </p>}
    </div>
  )
}