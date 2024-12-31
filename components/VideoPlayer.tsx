import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface VideoPlayerProps {
    videoUrl: string;
    captions: { text: string; start: number; end: number }[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, captions }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const isYouTubeUrl = (url: string) => {
        return url.includes('youtube.com') || url.includes('youtu.be');
    };

    const isGoogleDriveUrl = (url: string) => {
        return url.includes('drive.google.com');
    };

    const getYouTubeId = (url: string) => {
        const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const getGoogleDriveEmbedUrl = (url: string) => {
        const regExp = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//;
        const match = url.match(regExp);
        return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
    };

    const handleYouTubeStateChange = (event: any) => {
        setIsLoading(false);
        if (event.data === 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrentTime(event.target.getCurrentTime());
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            const videoElement = videoRef.current;
            const updateCurrentTime = () => setCurrentTime(videoElement.currentTime);

            videoElement.addEventListener('timeupdate', updateCurrentTime);
            videoElement.addEventListener('loadeddata', () => setIsLoading(false));

            return () => {
                videoElement.removeEventListener('timeupdate', updateCurrentTime);
            };
        }
    }, [videoRef]);

    useEffect(() => {
        if (isGoogleDriveUrl(videoUrl)) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrentTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [videoUrl]);

    const videoId = isYouTubeUrl(videoUrl) ? getYouTubeId(videoUrl) : null;
    const googleDriveEmbedUrl = isGoogleDriveUrl(videoUrl) ? getGoogleDriveEmbedUrl(videoUrl) : null;

    return (
        <Card className="w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-0 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}
                <div className="relative aspect-video">
                    {videoId ? (
                        <YouTube
                            videoId={videoId}
                            opts={{
                                width: '100%',
                                height: '100%',
                                playerVars: {
                                    autoplay: 0,
                                    modestbranding: 1,
                                    rel: 0
                                }
                            }}
                            onStateChange={handleYouTubeStateChange}
                            className="w-full h-full"
                            onReady={() => setIsLoading(false)}
                        />
                    ) : googleDriveEmbedUrl ? (
                        <iframe
                            src={googleDriveEmbedUrl}
                            width="100%"
                            height="100%"
                            allow="autoplay"
                            className="w-full h-full"
                            onLoad={() => setIsLoading(false)}
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            controls
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        {captions.map((caption, index) =>
                            currentTime >= caption.start && currentTime <= caption.end ? (
                                <div
                                    key={index}
                                    className="text-center transition-opacity duration-300"
                                >
                                    <p className="inline-block px-4 py-2 rounded-lg text-white bg-black/75 backdrop-blur-sm text-lg font-medium shadow-lg">
                                        {caption.text}
                                    </p>
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default VideoPlayer;