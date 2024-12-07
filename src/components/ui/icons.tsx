import { Loader2, LightbulbIcon as LucideProps, Moon, SunMedium, Twitter, TypeIcon as type, type LucideIcon } from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
  logo: Twitter,
  sun: SunMedium,
  moon: Moon,
  spinner: Loader2,
}

export const Spinner = ({ ...props }: typeof LucideProps) => (
  <Icons.spinner className="h-4 w-4 animate-spin" {...props} />
)

