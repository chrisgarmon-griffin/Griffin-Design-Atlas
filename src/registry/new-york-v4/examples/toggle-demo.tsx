import { BookmarkIcon } from "lucide-react"

import { Toggle } from "@/registry/new-york-v4/ui/toggle"

export default function ToggleDemo() {
  return (
    <Toggle
      aria-label="Toggle bookmark"
      size="sm"
      variant="outline"
      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-destructive data-[state=on]:*:[svg]:stroke-destructive"
    >
      <BookmarkIcon />
      Bookmark
    </Toggle>
  )
}
