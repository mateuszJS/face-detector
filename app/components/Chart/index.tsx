"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TestData } from "@/app/hooks/useDetector"
import { DetectorType } from "@/app/detectors/Detector"
import styles from './styles.module.css'

const sizefacesChartConfig = {
  large: {
    label: "Large",
  },
  medium: {
    label: "Medium",
  },
  small: {
    label: "Small",
  },
} satisfies ChartConfig

const timeChartConfig = {
  avgTime: {
    label: "Avg Time",
  },
} satisfies ChartConfig

interface Props {
  testData: TestData
}

const mapDetectorTypeToName = {
  [DetectorType.FaceAPI]: 'Face API',
  [DetectorType.MediaPipeImage]: 'Mediapipe Image',
  [DetectorType.MediaPipeVideo]: 'Don\'t even try',
  [DetectorType.TenserFlow]: 'Tenser Flow',
  [DetectorType.TestAll]: 'Shouldn\t exist',
}

export function DetectionsChart({ testData }: Props) {
  const chartData = Object.entries(testData).map(([detectorType, detectorData]) => ({
    name: mapDetectorTypeToName[detectorType as DetectorType],
    ...detectorData,
  }))

  return (
    <div className={styles.panel}>
      <h2>Size of faces</h2>
      <ChartContainer config={sizefacesChartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 15)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="large" fill="#F5BB00" radius={4} />
          <Bar dataKey="medium" fill="#F57900" radius={4} />
          <Bar dataKey="small" fill="#F54E00" radius={4} />
        </BarChart>
      </ChartContainer>
      <h2 className="mt-[20px]">Average Time</h2>
      <ChartContainer config={timeChartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 15)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="avgTime" fill="#3DC7F5" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>

  )
}
