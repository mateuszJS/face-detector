import Detector from "@/app/detectors/Detector";
import SelectDetector from "./components/SelectDetector";
import { Button } from "@/components/ui/button"

interface Props {
  children: React.ReactNode
  setDetector: (detector: Detector) => void
  exportData: VoidFunction
}

export default function Sidebar({ children, setDetector, exportData }: Props) {
  return (
    <aside>
      <SelectDetector setDetector={setDetector} />
      <Button
        variant="outline"
        className="mt-[30px] w-full"
        onClick={exportData}
      >
        Export current frame data
      </Button>
      <p className="text-[0.8rem] text-muted-foreground mt-[5px]">See the results in devtool console.</p>
      {children}
    </aside>
  )
}