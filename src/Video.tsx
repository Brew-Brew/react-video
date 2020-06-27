import classNames from "classnames";
import React, { memo, useEffect, useRef, useState } from "react";

import pauseIcon from "./assets/pause.png";
import playIcon from "./assets/play.png";
import muteIcon from "./assets/mute.png";
import volumeIcon from "./assets/volume.png";

import toTimeString from "./totimeString";
import ProgressBar from "./ProgressBar";

import styles from "./video.module.scss";

interface IProps {
  className?: string;
  src: string;
}

const Video: React.FC<IProps> = ({ className, src }) => {
  const [nowPlaying, setNowPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volumeClicked, setVolumeClicked] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [showControl, setShowControl] = useState(false);

  const ref = useRef<HTMLVideoElement>(null);

  const totalTime = (ref && ref.current && ref.current.duration) || 0;
  const videoElement = ref && ref.current;

  const classProps = classNames(styles.video, className);
  const startTimeClassProps = classNames(styles.text, styles.startTime);
  const endTimeClassProps = classNames(styles.text, styles.endTime);
  const videoSrc = src || "";

  const startTime = Math.floor(currentTime);

  const observe = () => {
    const observedVideoElement = ref && ref.current;
    if (observedVideoElement) {
      observedVideoElement.addEventListener("timeupdate", function () {
        setCurrentTime(observedVideoElement.currentTime);
        !isVisible && setVisible(true);
      });
      setNowPlaying(true);
      observedVideoElement.play();
    }
  };

  useEffect(() => {
    observe();
  }, []);

  const onProgressChange = (percent: number) => {
    if (!showControl) {
      setShowControl(true);
    }

    if (videoElement) {
      const playingTime = videoElement.duration * (percent / 100);

      setCurrentTime(playingTime);
    }
  };

  const onPlayIconClick = () => {
    if (videoElement) {
      if (nowPlaying) {
        setNowPlaying(false);
        videoElement.pause();
      } else {
        setNowPlaying(true);
        videoElement.play();
      }
    }
  };

  const onMouseDown = () => {
    if (videoElement) {
      videoElement.pause();
    }
  };

  const onMouseUp = () => {
    if (videoElement) {
      // controller를 옮긴 시점에 currentTime이 최신화 되지 않아, 이를 위해 수정
      videoElement.currentTime = currentTime;
      nowPlaying ? videoElement.play() : videoElement.pause();
    }
  };

  const playControlClassProps = classNames(styles.playWrapper, {
    [styles.fadeIn]: showControl,
  });

  const controlBarClassProps = classNames(styles.controlBar, {
    [styles.fadeIn]: showControl,
  });

  const handleControlVisible = () => {
    if (!showControl) {
      setShowControl(true);
      setTimeout(() => {
        setShowControl(false);
      }, 2000);
    }
  };

  const handleVolume = () => {
    if (volumeClicked) {
      if (videoElement) {
        videoElement.muted = true;
      }
      setVolumeClicked(false);
    } else {
      if (videoElement) {
        videoElement.muted = false;
      }
      setVolumeClicked(true);
    }
  };

  return (
    <div className={styles.default}>
      <video
        className={classProps}
        loop={true}
        muted={true}
        ref={ref}
        playsInline={true}
        onClick={handleControlVisible}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className={controlBarClassProps}>
        <span className={startTimeClassProps}>{toTimeString(startTime)}</span>
        <ProgressBar
          max={totalTime}
          value={currentTime}
          className={styles.progressBar}
          onChange={onProgressChange}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
        <span className={endTimeClassProps}>{toTimeString(totalTime)}</span>
        <img
          className={styles.volume}
          src={volumeClicked ? volumeIcon : muteIcon}
          onClick={handleVolume}
        />
      </div>
      <div className={playControlClassProps}>
        <div className={styles.playBg}>
          <img
            className={styles.playIcon}
            src={nowPlaying ? pauseIcon : playIcon}
            onClick={onPlayIconClick}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Video);
