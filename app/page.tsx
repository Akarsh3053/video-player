"use client"

import { useState, useRef } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import VideoPlayer from '@/components/VideoPlayer';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle, Info } from "lucide-react"
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [captions, setCaptions] = useState('');
  const [parsedCaptions, setParsedCaptions] = useState<{ text: string; start: number; end: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Validate video URL
      if (!videoUrl.trim()) {
        throw new Error('Please enter a video URL');
      }

      // Parse and validate captions
      const captionLines = captions.trim().split('\n');
      if (!captionLines.length) {
        throw new Error('Please enter captions');
      }

      const parsed = captionLines.map((line, index) => {
        const [time, text] = line.split('|');
        if (!time || !text) {
          throw new Error(`Invalid caption format at line ${index + 1}`);
        }

        const [start, end] = time.split('-').map(Number);
        if (isNaN(start) || isNaN(end) || start >= end) {
          throw new Error(`Invalid time format at line ${index + 1}`);
        }

        return { text: text.trim(), start, end };
      });

      setParsedCaptions(parsed);

      // Smooth scroll to video section
      setTimeout(() => {
        videoSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);

      toast({
        title: "Video loaded successfully!",
        description: `Loaded ${parsed.length} captions`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold">Video Caption Player</h1>
          <ThemeToggle />
        </div>
      </nav>

      <main className="container mx-auto p-4 space-y-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-6 w-6" />
              Load Your Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="videoUrl" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Video URL
                </label>
                <Input
                  id="videoUrl"
                  placeholder="Enter YouTube, Google Drive, or direct video URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="captions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Captions
                </label>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                  <Info className="h-4 w-4" />
                  Format: start-end|text (e.g., 0-5|Welcome to the video)
                </div>
                <Textarea
                  id="captions"
                  placeholder="Enter your captions, one per line"
                  value={captions}
                  onChange={(e) => setCaptions(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load Video"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {videoUrl && parsedCaptions.length > 0 && (
          <div ref={videoSectionRef} className="scroll-mt-20 transition-all duration-500">
            <VideoPlayer videoUrl={videoUrl} captions={parsedCaptions} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;