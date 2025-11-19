import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ReputationControlProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function ReputationControl({ value, onChange, className }: ReputationControlProps) {
  const getLabel = (val: number) => {
    if (val === -5) return "Mauvaise (-5)"
    if (val === 5) return "Bonne (+5)"
    if (val === 0) return "Neutre (0)"
    return val > 0 ? `+${val}` : `${val}`
  }

  const getColor = (val: number) => {
    if (val < 0) return "text-red-500"
    if (val > 0) return "text-green-500"
    return "text-muted-foreground"
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">Réputation</Label>
        <span className={cn("text-sm font-bold font-mono", getColor(value))}>
          {getLabel(value)}
        </span>
      </div>
      <Slider
        defaultValue={[0]}
        value={[value]}
        min={-5}
        max={5}
        step={1}
        onValueChange={(vals) => onChange(vals[0])}
        className="py-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>Mauvais</span>
        <span>Bon</span>
      </div>
    </div>
  )
}
