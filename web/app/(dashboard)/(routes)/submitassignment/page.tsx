'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

export default function SubmitAssignment() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle form submission here
    console.log('Assignment submitted')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Assignment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Assignment Title</label>
          <Input id="title" placeholder="Enter assignment title" required />
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium mb-1">Upload File</label>
          <div className="flex items-center space-x-2">
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="flex-grow"
              required
            />
            <Button type="button" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          {file && <p className="mt-2 text-sm text-muted-foreground">Selected file: {file.name}</p>}
        </div>
        <div>
          <label htmlFor="comments" className="block text-sm font-medium mb-1">Additional Comments (optional)</label>
          <Textarea id="comments" placeholder="Enter any additional comments" />
        </div>
        <Button type="submit" className="w-full">Submit Assignment</Button>
      </form>
    </div>
  )
}