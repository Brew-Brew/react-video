import { useEffect, useState } from "react";

// useIntersection hook
// viewport 상에 특정영역이 들어왔을때 특정 function 실행
// refElement, onObserve, threshold를 받는다.

const useIntersection = (
  refElement: React.RefObject<Element>,
  onObserve?: () => void,
  threshold = 0.5
) => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const options = {
      threshold,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // intersection 함수 실행
        !isIntersecting && setIntersecting(true);
        onObserve && onObserve();
      } else {
        setIntersecting(false);
      }
    }, options);
    if (refElement.current) {
      observer.observe(refElement.current);
    }
  }, [refElement]);

  return { refElement, isIntersecting };
};

export default useIntersection;
