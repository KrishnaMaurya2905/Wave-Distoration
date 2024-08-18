// CanvasScrollComponent.jsx
import React, { useRef, useEffect } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@emotion/react';
// import 'locomotive-scroll/dist/locomotive-scroll.css';

const CanvasScrollComponent = () => {
  const scrollRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const locoScroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.01,
    });

    locoScroll.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scrollRef.current, {
      scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: scrollRef.current.style.transform ? 'transform' : 'fixed',
    });

    ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
    ScrollTrigger.refresh();

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const images = [];
    const imageSeq = { frame: 1 };
    const frameCount = 161;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = files(i);
      images.push(img);
    }

    gsap.to(imageSeq, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        scrub: 1.4,
        trigger: canvas,
        start: 'top top',
        end: '500% top',
        scroller: scrollRef.current,
      },
      onUpdate: render,
    });

    images[1].onload = render;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    });

    function files(index) {
      return `/src/assets/scene${String(index).padStart(5, '0')}.png`;
    }

    function render() {
      const img = images[imageSeq.frame];
      const ctx = contextRef.current;
      var hRatio = canvas.width / img.width;
      var vRatio = canvas.height / img.height;
      var ratio = Math.max(hRatio, vRatio);
      var centerShift_x = (canvas.width - img.width * ratio) / 2;
      var centerShift_y = (canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
    }

    ScrollTrigger.create({
      trigger: canvas,
      pin: true,
      scroller: scrollRef.current,
      start: 'top top',
      end: '600% top',
    });

    gsap.to('#page1', {
      scrollTrigger: {
        trigger: '#page1',
        start: 'top top',
        end: 'bottom top',
        pin: true,
        scroller: scrollRef.current,
      },
    });

    gsap.to('#page2', {
      scrollTrigger: {
        trigger: '#page2',
        start: 'top top',
        end: 'bottom top',
        pin: true,
        scroller: scrollRef.current,
      },
    });

    gsap.to('#page3', {
      scrollTrigger: {
        trigger: '#page3',
        start: 'top top',
        end: 'bottom top',
        pin: true,
        scroller: scrollRef.current,
      },
    });

    return () => {
      locoScroll.destroy();
      ScrollTrigger.kill();
      window.removeEventListener('resize', render);
    };
  }, []);

  return (
    <div id="main" ref={scrollRef} style={{ overflow: 'hidden' }}>
      <canvas ref={canvasRef}></canvas>
      <div id="page1"></div>
      <div id="page2"></div>
      <div id="page3"></div>
    </div>
  );
};

export default CanvasScrollComponent;
