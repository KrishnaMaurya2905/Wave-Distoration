import gsap from "gsap";
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const DescramblerText = forwardRef(
  ({ text, className, textClassName, overlayClassName }, ref) => {
    const textRef = useRef(null);
    const overlayRef = useRef(null);
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const originalText = text;

    useImperativeHandle(ref, () => ({
      triggerDescramble() {
        descrambleText();
      },
    }));

    const scrambleText = (text, index) => {
      const scrambled = text
        .split("")
        .map((char, i) =>
          i < index
            ? char
            : characters.charAt(Math.floor(Math.random() * characters.length))
        )
        .join("");
      return scrambled;
    };

    const descrambleText = () => {
      let i = 0;
      const interval = setInterval(() => {
        if (textRef.current) {
          textRef.current.innerText = scrambleText(originalText, i);
        }
        i++;
        if (i > originalText.length) {
          clearInterval(interval);
          if (textRef.current) {
            textRef.current.innerText = originalText;
          }
        }
      }, 40);
    };

    const showOverlay = () => {
      gsap.fromTo(
        overlayRef.current,
        { width: "0%", left: "0%" },
        { width: "100%", ease: "power2.out", duration: 0.7 }
      );
      descrambleText();
    };

    const hideOverlay = () => {
      gsap.fromTo(
        overlayRef.current,
        { width: "100%", left: "0%" },
        { width: "0%", left: "100%", ease: "power2.out" }
      );
    };

    useEffect(() => {
      const element = textRef.current;
      if (element) {
        element.addEventListener("mouseenter", showOverlay);
        element.addEventListener("mouseleave", hideOverlay);

        return () => {
          element.removeEventListener("mouseenter", showOverlay);
          element.removeEventListener("mouseleave", hideOverlay);
        };
      } else {
        descrambleText();
      }
    }, []);

    return (
      <div
        className={`relative inline-block overflow-hidden h-fit w-fit ${className}`}
      >
        <div
          ref={textRef}
          className={`descrambler-text uppercase w-fit h-fit text-center relative z-10 overflow-hidden ${textClassName}`}
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0% 50%)",
          }}
        >
          {text}
        </div>
        <div
          ref={overlayRef}
          className={`absolute top-0 left-0 h-full z-0 ${overlayClassName}`}
          style={{
            width: "0%",
            clipPath:
              "polygon(0 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0% 50%)",
          }}
        ></div>
      </div>
    );
  }
);

export default DescramblerText;
