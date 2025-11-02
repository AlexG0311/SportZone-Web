"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import type { ChartConfig } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

export const description = "A bar chart with a label"

const chartDataMonth = [
  { month: "Enero", desktop: 186 },
  { month: "Febrero", desktop: 305 },
  { month: "Marzo", desktop: 237 },
  { month: "Abril", desktop: 73 },
  { month: "Mayo", desktop: 209 },
  { month: "Junio", desktop: 264 },
  { month: "Julio", desktop: 224 },
  { month: "Agosto", desktop: 94 },
  { month: "Septiembre", desktop: 44 },
  { month: "Octubre", desktop: 124 },
  { month: "Noviembre", desktop: 114 },
  { month: "Diciembre", desktop: 214 },

]


const chartDataDay = [
  { month: "Lunes", desktop: 186 },
  { month: "Martes", desktop: 305 },
  { month: "Miercoles", desktop: 237 },
  { month: "Jueves", desktop: 73 },
  { month: "Viernes", desktop: 209 },
  { month: "Sabado", desktop: 214 },
  { month: "Domingo", desktop: 214 },

]

const chartConfig = {
  desktop: {
    label: "Ingresos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartIngresos() {

    const [isMonth, setIsMonth] = useState(true);
    const chartData = isMonth ? chartDataMonth : chartDataDay;

  const handleToggle = () => {
    setIsMonth(!isMonth);
  };


  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Bar Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
        <Button onClick={handleToggle} className="ml-auto bg-gray-300" variant="ghost" size="sm">
          {isMonth ? "Ver por Días" : "Ver por Meses"} 
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
