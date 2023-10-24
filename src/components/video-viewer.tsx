import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const VideoViewer = ({ selectedVideo }: { selectedVideo: null | File }) => {
  console.log("selected video: ", selectedVideo);
  const videoRef = useRef<HTMLVideoElement>(null);
  console.log(videoRef.current);

  const source = selectedVideo ? URL.createObjectURL(selectedVideo) : "";
  const type = selectedVideo ? selectedVideo.type : "";
  const name = selectedVideo ? selectedVideo.name : "";

  const [isMuted, setIsMuted] = useState(false);

  const onPlayPress = () => {
    // if the video is playing, pause it, otherwise play it
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const onMutePress = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted);
    }
  };

  const trackTimestamp = () => {
    let timestamp;
    const update = () => {
      if (!videoRef.current) {
        timestamp = 0;
      } else {
        timestamp = videoRef.current.currentTime;
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
    return timestamp;
  };

  useEffect(() => {
    const timestamp = trackTimestamp();
    console.log("timestamp: ", timestamp);
    return () => {
      cancelAnimationFrame(timestamp);
    };
  }, []);

  return (
    <div>
      <h2>Selected Video:</h2>
      <video key={name} controls ref={videoRef} muted={isMuted}>
        <source src={source} type={type} />
        Your browser does not support the video tag.
      </video>
      <Button onClick={onPlayPress}>Play</Button>
      <Button onClick={onMutePress}>Mute</Button>
      <p>Timestamp: {videoRef.current?.currentTime}</p>
    </div>
  );
};

export default VideoViewer;
