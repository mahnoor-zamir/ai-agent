import { WordPressEditor } from "@/components/wordpress-editor"

export default function WordPressEditorPage() {
  return (
    <div className="space-y-6 content-container">
      <div>
        <h1 className="text-3xl font-bold">WordPress Editor</h1>
        <p className="text-lg text-muted-foreground">Edit your WordPress website content</p>
      </div>
      <WordPressEditor />
    </div>
  )
}

