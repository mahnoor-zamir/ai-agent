import { useState, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

const colorOptions = [
  {
    category: "Basic",
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Red', hex: '#FF0000' },
      { name: 'Green', hex: '#00FF00' },
      { name: 'Blue', hex: '#0000FF' },
      { name: 'Yellow', hex: '#FFFF00' },
      { name: 'Magenta', hex: '#FF00FF' },
      { name: 'Cyan', hex: '#00FFFF' },
    ]
  },
  {
    category: "Grayscale",
    colors: [
      { name: 'Dark Gray', hex: '#808080' },
      { name: 'Gray', hex: '#A0A0A0' },
      { name: 'Light Gray', hex: '#C0C0C0' },
      { name: 'Silver', hex: '#D3D3D3' },
    ]
  },
  {
    category: "Extended",
    colors: [
      { name: 'Navy', hex: '#000080' },
      { name: 'Dark Blue', hex: '#0000A0' },
      { name: 'Royal Blue', hex: '#4169E1' },
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Turquoise', hex: '#40E0D0' },
      { name: 'Teal', hex: '#008080' },
      { name: 'Forest Green', hex: '#228B22' },
      { name: 'Olive', hex: '#808000' },
      { name: 'Lime', hex: '#32CD32' },
      { name: 'Dark Red', hex: '#8B0000' },
      { name: 'Maroon', hex: '#800000' },
      { name: 'Brown', hex: '#A52A2A' },
      { name: 'Orange', hex: '#FFA500' },
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Purple', hex: '#800080' },
      { name: 'Indigo', hex: '#4B0082' },
      { name: 'Violet', hex: '#EE82EE' },
      { name: 'Pink', hex: '#FFC0CB' },
    ]
  },
]

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value)
  const [customHex, setCustomHex] = useState('')

  useEffect(() => {
    setColor(value)
  }, [value])

  const handleChange = (newColor: string) => {
    setColor(newColor)
    onChange(newColor)
  }

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value
    setCustomHex(hex)
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      handleChange(hex)
    }
  }

  const getColorName = (hex: string) => {
    for (const category of colorOptions) {
      const color = category.colors.find(c => c.hex.toLowerCase() === hex.toLowerCase())
      if (color) return color.name
    }
    return 'Custom'
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-sm border"
              style={{ backgroundColor: color }}
            />
            <span>{getColorName(color)}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Select onValueChange={handleChange}>
          <SelectContent>
            {colorOptions.map((category) => (
              <SelectGroup key={category.category}>
                <SelectLabel>{category.category}</SelectLabel>
                {category.colors.map((color) => (
                  <SelectItem key={color.hex} value={color.hex}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-sm border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        <div className="p-2">
          <Label htmlFor="custom-hex" className="text-xs">Custom Hex Color</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="custom-hex"
              value={customHex}
              onChange={handleCustomHexChange}
              placeholder="#RRGGBB"
              className="h-8"
            />
            <Button
              size="sm"
              onClick={() => handleChange(customHex)}
              disabled={!/^#[0-9A-Fa-f]{6}$/.test(customHex)}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

