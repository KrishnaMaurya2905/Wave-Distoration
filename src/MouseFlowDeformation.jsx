

// import React, { useEffect } from 'react';
// import { Renderer, Vec2, Vec4, Flowmap, Geometry, Texture, Program, Mesh } from 'ogl';

// const MouseFlowmapDeformation = () => {
//     useEffect(() => {
//         let imgSize = [1600, 1200];

//         const vertex = `
//             attribute vec2 uv;
//             attribute vec2 position;
//             varying vec2 vUv;
//             void main() {
//                 vUv = uv;
//                 gl_Position = vec4(position, 0, 1);
//             }
//         `;

//         const fragment = `
//             precision highp float;
//             precision highp int;
//             uniform sampler2D tWater;
//             uniform sampler2D tFlow;
//             uniform float uTime;
//             varying vec2 vUv;
//             uniform vec4 res;

//             void main() {
//                 vec3 flow = texture2D(tFlow, vUv).rgb;
//                 vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
//                 vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
//                 myUV -= flow.xy * (0.15 * 0.5);
//                 vec3 tex = texture2D(tWater, myUV).rgb;
//                 gl_FragColor.rgb = vec3(tex.r, tex.g, tex.b);
//                 gl_FragColor.a = tex.r;
//             }
//         `;

//         const renderer = new Renderer({ dpr: 2, alpha: true });  // Set alpha: true
//         const gl = renderer.gl;
//         document.getElementById('flowmap-container').appendChild(gl.canvas);
//         gl.clearColor(0, 0, 0, 0); 
//         const isTouchCapable = "ontouchstart" in window;
//         let aspect = 1;
//         const mouse = new Vec2(-1);
//         const velocity = new Vec2();

//         const resize = () => {
//             let a1, a2;
//             var imageAspect = imgSize[1] / imgSize[0];
//             if (window.innerHeight / window.innerWidth < imageAspect) {
//                 a1 = 1;
//                 a2 = window.innerHeight / window.innerWidth / imageAspect;
//             } else {
//                 a1 = (window.innerWidth / window.innerHeight) * imageAspect;
//                 a2 = 1;
//             }
//             mesh.program.uniforms.res.value = new Vec4(window.innerWidth, window.innerHeight, a1, a2);
//             renderer.setSize(window.innerWidth, window.innerHeight);
//             aspect = window.innerWidth / window.innerHeight;
//         };

//         const flowmap = new Flowmap(gl, { falloff: 0.2, dissipation: 0.9 });

//         const geometry = new Geometry(gl, {
//             position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
//             uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
//         });
//         const textCanvas = document.createElement('canvas');
//         const textCtx = textCanvas.getContext('2d');
//         textCanvas.width = 1024;
//         textCanvas.height = 512;
//         textCtx.fillStyle = 'white';
//         textCtx.font = '500 5vw "Defused"';
//         textCtx.textAlign = 'center';
//         textCtx.textBaseline = 'middle';
//         textCtx.fillText('MONSTER', textCanvas.width / 2, textCanvas.height / 2);
//         const texture = new Texture(gl, {
//             minFilter: gl.LINEAR,
//             magFilter: gl.LINEAR,
//             premultiplyAlpha: true
//         });
//         texture.image = textCanvas;

//         let a1, a2;
//         var imageAspect = textCanvas.height / textCanvas.width;
//         if (window.innerHeight / window.innerWidth < imageAspect) {
//             a1 = 1;
//             a2 = window.innerHeight / window.innerWidth / imageAspect;
//         } else {
//             a1 = (window.innerWidth / window.innerHeight) * imageAspect;
//             a2 = 1;
//         }

//         const program = new Program(gl, {
//             vertex,
//             fragment,
//             uniforms: {
//                 uTime: { value: 0 },
//                 tWater: { value: texture },
//                 res: { value: new Vec4(window.innerWidth, window.innerHeight, a1, a2) },
//                 img: { value: new Vec2(textCanvas.width, textCanvas.height) },
//                 tFlow: flowmap.uniform
//             }
//         });

//         const mesh = new Mesh(gl, { geometry, program });

//         window.addEventListener("resize", resize, false);
//         resize();

//         const updateMouse = (e) => {
//             e.preventDefault();
//             if (e.changedTouches && e.changedTouches.length) {
//                 e.x = e.changedTouches[0].pageX;
//                 e.y = e.changedTouches[0].pageY;
//             }
//             if (e.x === undefined) {
//                 e.x = e.pageX;
//                 e.y = e.pageY;
//             }
//             mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);

//             if (!lastTime) {
//                 lastTime = performance.now();
//                 lastMouse.set(e.x, e.y);
//             }

//             const deltaX = e.x - lastMouse.x;
//             const deltaY = e.y - lastMouse.y;

//             lastMouse.set(e.x, e.y);

//             let time = performance.now();
//             let delta = Math.max(10.4, time - lastTime);
//             lastTime = time;
//             velocity.x = deltaX / delta;
//             velocity.y = deltaY / delta;
//             velocity.needsUpdate = true;
//         };

//         const update = (t) => {
//             requestAnimationFrame(update);

//             if (!velocity.needsUpdate) {
//                 mouse.set(-1);
//                 velocity.set(0);
//             }
//             velocity.needsUpdate = false;

//             flowmap.aspect = aspect;
//             flowmap.mouse.copy(mouse);
//             flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
//             flowmap.update();

//             program.uniforms.uTime.value = t * 0.01;
//             renderer.render({ scene: mesh });
//         };

//         let lastTime;
//         const lastMouse = new Vec2();

//         if (isTouchCapable) {
//             window.addEventListener("touchstart", updateMouse, false);
//             window.addEventListener("touchmove", updateMouse, { passive: false });
//         } else {
//             window.addEventListener("mousemove", updateMouse, false);
//         }

//         requestAnimationFrame(update);

//         return () => {
//             window.removeEventListener("resize", resize);
//             if (isTouchCapable) {
//                 window.removeEventListener("touchstart", updateMouse);
//                 window.removeEventListener("touchmove", updateMouse);
//             } else {
//                 window.removeEventListener("mousemove", updateMouse);
//             }
//         };
//     }, []);

//     return (
//         <main id="flowmap-container" className='bg-transparent'>
//         </main>
//     );
// };

// export default MouseFlowmapDeformation;

// // // import React, { useEffect } from 'react';
// // // import { Renderer, Vec2, Vec4, Flowmap, Geometry, Texture, Program, Mesh } from 'ogl';

// // // const MouseFlowmapDeformation = () => {
// // //     useEffect(() => {
// // //         let imgSize = [1600, 1200];

// // //         const vertex = `
// // //             attribute vec2 uv;
// // //             attribute vec2 position;
// // //             varying vec2 vUv;
// // //             void main() {
// // //                 vUv = uv;
// // //                 gl_Position = vec4(position, 0, 1);
// // //             }
// // //         `;

// // //         const fragment = `
// // //             precision highp float;
// // //             precision highp int;
// // //             uniform sampler2D tImage;
// // //             uniform sampler2D tFlow;
// // //             uniform float uTime;
// // //             varying vec2 vUv;
// // //             uniform vec4 res;

// // //             void main() {
// // //                 vec3 flow = texture2D(tFlow, vUv).rgb;
// // //                 vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
// // //                 vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
// // //                 myUV -= flow.xy * (0.15 * 0.5);
// // //                 vec3 tex = texture2D(tImage, myUV).rgb;
// // //                 gl_FragColor.rgb = vec3(tex.r, tex.g, tex.b);
// // //                 gl_FragColor.a = tex.r;
// // //             }
// // //         `;

// // //         const renderer = new Renderer({ dpr: 2, alpha: true });  
// // //         const gl = renderer.gl;
// // //         document.getElementById('flowmap-container').appendChild(gl.canvas);
// // //         gl.clearColor(0, 0, 0, 0); 
// // //         const isTouchCapable = "ontouchstart" in window;
// // //         let aspect = 1;
// // //         const mouse = new Vec2(-1);
// // //         const velocity = new Vec2();

// // //         const resize = () => {
// // //             let a1, a2;
// // //             var imageAspect = imgSize[1] / imgSize[0];
// // //             if (window.innerHeight / window.innerWidth < imageAspect) {
// // //                 a1 = 1;
// // //                 a2 = window.innerHeight / window.innerWidth / imageAspect;
// // //             } else {
// // //                 a1 = (window.innerWidth / window.innerHeight) * imageAspect;
// // //                 a2 = 1;
// // //             }
// // //             mesh.program.uniforms.res.value = new Vec4(window.innerWidth, window.innerHeight, a1, a2);
// // //             renderer.setSize(window.innerWidth, window.innerHeight);
// // //             aspect = window.innerWidth / window.innerHeight;
// // //         };

// // //         const flowmap = new Flowmap(gl, { falloff: 0.2, dissipation: 0.9 });

// // //         const geometry = new Geometry(gl, {
// // //             position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
// // //             uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
// // //         });

// // //         // Load the image as a texture
// // //         const image = new Image();
// // //         image.src = '/19745798-e40e-4c65-9254-11c27bf2d85b.webp'; // Replace with the path to your image
// // //         const texture = new Texture(gl, {
// // //             minFilter: gl.LINEAR,
// // //             magFilter: gl.LINEAR,
// // //             premultiplyAlpha: true
// // //         });
// // //         image.onload = () => {
// // //             texture.image = image;
// // //         };

// // //         let a1, a2;
// // //         var imageAspect = image.height / image.width;
// // //         if (window.innerHeight / window.innerWidth < imageAspect) {
// // //             a1 = 1;
// // //             a2 = window.innerHeight / window.innerWidth / imageAspect;
// // //         } else {
// // //             a1 = (window.innerWidth / window.innerHeight) * imageAspect;
// // //             a2 = 1;
// // //         }

// // //         const program = new Program(gl, {
// // //             vertex,
// // //             fragment,
// // //             uniforms: {
// // //                 uTime: { value: 0 },
// // //                 tImage: { value: texture },
// // //                 res: { value: new Vec4(window.innerWidth, window.innerHeight, a1, a2) },
// // //                 img: { value: new Vec2(image.width, image.height) },
// // //                 tFlow: flowmap.uniform
// // //             }
// // //         });

// // //         const mesh = new Mesh(gl, { geometry, program });

// // //         window.addEventListener("resize", resize, false);
// // //         resize();

// // //         const updateMouse = (e) => {
// // //             e.preventDefault();
// // //             if (e.changedTouches && e.changedTouches.length) {
// // //                 e.x = e.changedTouches[0].pageX;
// // //                 e.y = e.changedTouches[0].pageY;
// // //             }
// // //             if (e.x === undefined) {
// // //                 e.x = e.pageX;
// // //                 e.y = e.pageY;
// // //             }
// // //             mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);

// // //             if (!lastTime) {
// // //                 lastTime = performance.now();
// // //                 lastMouse.set(e.x, e.y);
// // //             }

// // //             const deltaX = e.x - lastMouse.x;
// // //             const deltaY = e.y - lastMouse.y;

// // //             lastMouse.set(e.x, e.y);

// // //             let time = performance.now();
// // //             let delta = Math.max(10.4, time - lastTime);
// // //             lastTime = time;
// // //             velocity.x = deltaX / delta;
// // //             velocity.y = deltaY / delta;
// // //             velocity.needsUpdate = true;
// // //         };

// // //         const update = (t) => {
// // //             requestAnimationFrame(update);

// // //             if (!velocity.needsUpdate) {
// // //                 mouse.set(-1);
// // //                 velocity.set(0);
// // //             }
// // //             velocity.needsUpdate = false;

// // //             flowmap.aspect = aspect;
// // //             flowmap.mouse.copy(mouse);
// // //             flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
// // //             flowmap.update();

// // //             program.uniforms.uTime.value = t * 0.01;
// // //             renderer.render({ scene: mesh });
// // //         };

// // //         let lastTime;
// // //         const lastMouse = new Vec2();

// // //         if (isTouchCapable) {
// // //             window.addEventListener("touchstart", updateMouse, false);
// // //             window.addEventListener("touchmove", updateMouse, { passive: false });
// // //         } else {
// // //             window.addEventListener("mousemove", updateMouse, false);
// // //         }

// // //         requestAnimationFrame(update);

// // //         return () => {
// // //             window.removeEventListener("resize", resize);
// // //             if (isTouchCapable) {
// // //                 window.removeEventListener("touchstart", updateMouse);
// // //                 window.removeEventListener("touchmove", updateMouse);
// // //             } else {
// // //                 window.removeEventListener("mousemove", updateMouse);
// // //             }
// // //         };
// // //     }, []);

// // //     return (
// // //         <main id="flowmap-container" className='bg-transparent w-[40%]'>
// // //         </main>
// // //     );
// // // };

// // // export default MouseFlowmapDeformation;
















// import React, { useEffect } from 'react';
// import { Renderer, Vec2, Vec4, Flowmap, Geometry, Texture, Program, Mesh } from 'ogl';

// const MouseFlowmapDeformation = () => {
//     useEffect(() => {
//         let imgSize = [1600, 1200];

//         const vertex = `
//             attribute vec2 uv;
//             attribute vec2 position;
//             varying vec2 vUv;
//             void main() {
//                 vUv = uv;
//                 gl_Position = vec4(position, 0, 1);
//             }
//         `;

//         const fragment = `
//             precision highp float;
//             precision highp int;
//             uniform sampler2D tImage;
//             uniform sampler2D tFlow;
//             uniform float uTime;
//             varying vec2 vUv;
//             uniform vec4 res;

//             void main() {
//                 vec3 flow = texture2D(tFlow, vUv).rgb;
//                 vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
//                 vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
//                 myUV -= flow.xy * (0.15 * 0.5);
//                 vec3 tex = texture2D(tImage, myUV).rgb;
//                 gl_FragColor.rgb = vec3(tex.r, tex.g, tex.b);
//                 gl_FragColor.a = tex.r;
//             }
//         `;

//         const renderer = new Renderer({ dpr: 2, alpha: true });  
//         const gl = renderer.gl;
//         document.getElementById('flowmap-container').appendChild(gl.canvas);
//         gl.clearColor(0, 0, 0, 0); 
//         const isTouchCapable = "ontouchstart" in window;
//         let aspect = 1;
//         const mouse = new Vec2(-1);
//         const velocity = new Vec2();

//         const resize = () => {
//             const container = document.getElementById('flowmap-container');
//             const width = container.clientWidth;
//             const height = container.clientHeight;

//             let a1, a2;
//             var imageAspect = imgSize[1] / imgSize[0];
//             if (height / width < imageAspect) {
//                 a1 = 1;
//                 a2 = height / width / imageAspect;
//             } else {
//                 a1 = (width / height) * imageAspect;
//                 a2 = 1;
//             }
//             mesh.program.uniforms.res.value = new Vec4(width, height, a1, a2);
//             renderer.setSize(width, height);
//             aspect = width / height;
//         };

//         const flowmap = new Flowmap(gl, { falloff: 0.2, dissipation: 0.9 });

//         const geometry = new Geometry(gl, {
//             position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
//             uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
//         });

//         // Load the image as a texture
//         const image = new Image();
//         image.src = '/Adam_Yauch_1.jpg'; // Replace with the path to your image
//         const texture = new Texture(gl, {
//             minFilter: gl.LINEAR,
//             magFilter: gl.LINEAR,
//             premultiplyAlpha: true
//         });
//         image.onload = () => {
//             texture.image = image;
//             resize(); // Ensure resize happens after image is loaded
//         };

//         const program = new Program(gl, {
//             vertex,
//             fragment,
//             uniforms: {
//                 uTime: { value: 0 },
//                 tImage: { value: texture },
//                 res: { value: new Vec4(1, 1, 1, 1) },
//                 img: { value: new Vec2(image.width, image.height) },
//                 tFlow: flowmap.uniform
//             }
//         });

//         const mesh = new Mesh(gl, { geometry, program });

//         window.addEventListener("resize", resize, false);
//         resize();

//         const updateMouse = (e) => {
//             e.preventDefault();
//             if (e.changedTouches && e.changedTouches.length) {
//                 e.x = e.changedTouches[0].pageX;
//                 e.y = e.changedTouches[0].pageY;
//             }
//             if (e.x === undefined) {
//                 e.x = e.pageX;
//                 e.y = e.pageY;
//             }
//             mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);

//             if (!lastTime) {
//                 lastTime = performance.now();
//                 lastMouse.set(e.x, e.y);
//             }

//             const deltaX = e.x - lastMouse.x;
//             const deltaY = e.y - lastMouse.y;

//             lastMouse.set(e.x, e.y);

//             let time = performance.now();
//             let delta = Math.max(10.4, time - lastTime);
//             lastTime = time;
//             velocity.x = deltaX / delta;
//             velocity.y = deltaY / delta;
//             velocity.needsUpdate = true;
//         };

//         const update = (t) => {
//             requestAnimationFrame(update);

//             if (!velocity.needsUpdate) {
//                 mouse.set(-1);
//                 velocity.set(0);
//             }
//             velocity.needsUpdate = false;

//             flowmap.aspect = aspect;
//             flowmap.mouse.copy(mouse);
//             flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
//             flowmap.update();

//             program.uniforms.uTime.value = t * 0.01;
//             renderer.render({ scene: mesh });
//         };

//         let lastTime;
//         const lastMouse = new Vec2();

//         if (isTouchCapable) {
//             window.addEventListener("touchstart", updateMouse, false);
//             window.addEventListener("touchmove", updateMouse, { passive: false });
//         } else {
//             window.addEventListener("mousemove", updateMouse, false);
//         }

//         requestAnimationFrame(update);

//         return () => {
//             window.removeEventListener("resize", resize);
//             if (isTouchCapable) {
//                 window.removeEventListener("touchstart", updateMouse);
//                 window.removeEventListener("touchmove", updateMouse);
//             } else {
//                 window.removeEventListener("mousemove", updateMouse);
//             }
//         };
//     }, []);

//     return (
//         <main id="flowmap-container" className='w-full h-full'>
//         </main>
//     );
// };

// export default MouseFlowmapDeformation;


import React, { useEffect } from 'react';
import { Renderer, Vec2, Vec4, Flowmap, Geometry, Texture, Program, Mesh } from 'ogl';

const MouseFlowmapDeformation = () => {
    useEffect(() => {
        let imgSize = [1600, 1200];

        const vertex = `
            attribute vec2 uv;
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 0, 1);
            }
        `;

        const fragment = `
            precision highp float;
            precision highp int;
            uniform sampler2D tImage;
            uniform sampler2D tFlow;
            uniform float uTime;
            varying vec2 vUv;
            uniform vec4 res;

            void main() {
                vec3 flow = texture2D(tFlow, vUv).rgb;
                vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
                vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
                myUV -= flow.xy * (0.15 * 0.5);
                vec3 tex = texture2D(tImage, myUV).rgb;
                gl_FragColor.rgb = vec3(tex.r, tex.g, tex.b);
                gl_FragColor.a = tex.r;
            }
        `;

        const renderer = new Renderer({ dpr: 2, alpha: true });  
        const gl = renderer.gl;
        document.getElementById('flowmap-container').appendChild(gl.canvas);
        gl.clearColor(0, 0, 0, 0); 
        const isTouchCapable = "ontouchstart" in window;
        let aspect = 1;
        const mouse = new Vec2(-1);
        const velocity = new Vec2();

        const resize = () => {
            const container = document.getElementById('flowmap-container');
            const width = window.innerWidth;
            const height = window.innerHeight;

            let a1, a2;
            var imageAspect = imgSize[1] / imgSize[0];
            if (height / width < imageAspect) {
                a1 = 1;
                a2 = height / width / imageAspect;
            } else {
                a1 = (width / height) * imageAspect;
                a2 = 1;
            }
            mesh.program.uniforms.res.value = new Vec4(width, height, a1, a2);
            renderer.setSize(width, height);
            aspect = width / height;
        };

        const flowmap = new Flowmap(gl, { falloff: 0.2, dissipation: 0.9 });

        const geometry = new Geometry(gl, {
            position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
            uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
        });

        // Load the image as a texture
        const image = new Image();
        image.src = '/Adam_Yauch_1.jpg'; 
        const texture = new Texture(gl, {
            minFilter: gl.LINEAR,
            magFilter: gl.LINEAR,
            premultiplyAlpha: true
        });
        image.onload = () => {
            texture.image = image;
            resize(); // Ensure resize happens after image is loaded
        };

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                tImage: { value: texture },
                res: { value: new Vec4(1, 1, 1, 1) },
                img: { value: new Vec2(image.width, image.height) },
                tFlow: flowmap.uniform
            }
        });

        const mesh = new Mesh(gl, { geometry, program });

        window.addEventListener("resize", resize, false);
        resize();

        const updateMouse = (e) => {
            e.preventDefault();
            if (e.changedTouches && e.changedTouches.length) {
                e.x = e.changedTouches[0].pageX;
                e.y = e.changedTouches[0].pageY;
            }
            if (e.x === undefined) {
                e.x = e.pageX;
                e.y = e.pageY;
            }
            mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);

            if (!lastTime) {
                lastTime = performance.now();
                lastMouse.set(e.x, e.y);
            }

            const deltaX = e.x - lastMouse.x;
            const deltaY = e.y - lastMouse.y;

            lastMouse.set(e.x, e.y);

            let time = performance.now();
            let delta = Math.max(10.4, time - lastTime);
            lastTime = time;
            velocity.x = deltaX / delta;
            velocity.y = deltaY / delta;
            velocity.needsUpdate = true;
        };

        const update = (t) => {
            requestAnimationFrame(update);

            if (!velocity.needsUpdate) {
                mouse.set(-1);
                velocity.set(0);
            }
            velocity.needsUpdate = false;

            flowmap.aspect = aspect;
            flowmap.mouse.copy(mouse);
            flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
            flowmap.update();

            program.uniforms.uTime.value = t * 0.01;
            renderer.render({ scene: mesh });
        };

        let lastTime;
        const lastMouse = new Vec2();

        if (isTouchCapable) {
            window.addEventListener("touchstart", updateMouse, false);
            window.addEventListener("touchmove", updateMouse, { passive: false });
        } else {
            window.addEventListener("mousemove", updateMouse, false);
        }

        requestAnimationFrame(update);

        return () => {
            window.removeEventListener("resize", resize);
            if (isTouchCapable) {
                window.removeEventListener("touchstart", updateMouse);
                window.removeEventListener("touchmove", updateMouse);
            } else {
                window.removeEventListener("mousemove", updateMouse);
            }
        };
    }, []);

    return (
        <main id="flowmap-container" className='w-full h-screen relative bg-black'>
        </main>
    );
};

export default MouseFlowmapDeformation;
 // above is correct





// import React, { useEffect } from 'react';
// import { Renderer, Vec2, Vec4, Flowmap, Geometry, Texture, Program, Mesh } from 'ogl';

// const MouseFlowmapDeformation = () => {
//     useEffect(() => {
//         const vertex = `
//             attribute vec2 uv;
//             attribute vec2 position;
//             varying vec2 vUv;
//             void main() {
//                 vUv = uv;
//                 gl_Position = vec4(position, 0, 1);
//             }
//         `;

//         const fragment = `
//             precision highp float;
//             precision highp int;
//             uniform sampler2D tImage;
//             uniform sampler2D tFlow;
//             uniform float uTime;
//             varying vec2 vUv;
//             uniform vec4 res;

//             void main() {
//                 vec3 flow = texture2D(tFlow, vUv).rgb;
//                 vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
//                 vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
//                 myUV -= flow.xy * (0.15 * 0.5);
//                 vec3 tex = texture2D(tImage, myUV).rgb;
//                 gl_FragColor.rgb = vec3(tex.r, tex.g, tex.b);
//                 gl_FragColor.a = tex.r;
//             }
//         `;

//         const renderer = new Renderer({ dpr: 2, alpha: true });  
//         const gl = renderer.gl;
//         document.getElementById('flowmap-container').appendChild(gl.canvas);
//         gl.clearColor(0, 0, 0, 0); 
//         const isTouchCapable = "ontouchstart" in window;
//         let aspect = 1;
//         const mouse = new Vec2(-1);
//         const velocity = new Vec2();

//         const resize = () => {
//             const container = document.getElementById('flowmap-container');
//             const width = container.clientWidth;
//             const height = container.clientHeight;

//             let a1, a2;
//             const videoAspect = video.videoHeight / video.videoWidth;
//             if (height / width < videoAspect) {
//                 a1 = 1;
//                 a2 = height / width / videoAspect;
//             } else {
//                 a1 = (width / height) * videoAspect;
//                 a2 = 1;
//             }
//             mesh.program.uniforms.res.value = new Vec4(width, height, a1, a2);
//             renderer.setSize(width, height);
//             aspect = width / height;
//         };

//         const flowmap = new Flowmap(gl, { falloff: 0.2, dissipation: 0.9 });

//         const geometry = new Geometry(gl, {
//             position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
//             uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
//         });

//         // Load the video as a texture
//         const video = document.createElement('video');
//         video.src = '/Beoplay EX Limited Edition with Lay Zhang.mp4'; // Replace with the path to your video
//         video.loop = true;
//         video.muted = true;
//         video.autoplay = true;
//         video.playsInline = true;
//         video.crossOrigin = "anonymous";
//         video.style.display = 'none';
//         document.body.appendChild(video);

//         const texture = new Texture(gl, {
//             minFilter: gl.LINEAR,
//             magFilter: gl.LINEAR,
//             premultiplyAlpha: true
//         });

//         video.onloadeddata = () => {
//             texture.image = video;
//             resize(); // Ensure resize happens after video metadata is loaded
//             video.play();
//         };

//         const program = new Program(gl, {
//             vertex,
//             fragment,
//             uniforms: {
//                 uTime: { value: 0 },
//                 tImage: { value: texture },
//                 res: { value: new Vec4(1, 1, 1, 1) },
//                 img: { value: new Vec2(video.videoWidth, video.videoHeight) },
//                 tFlow: flowmap.uniform
//             }
//         });

//         const mesh = new Mesh(gl, { geometry, program });

//         window.addEventListener("resize", resize, false);
//         resize();

//         const updateMouse = (e) => {
//             e.preventDefault();
//             if (e.changedTouches && e.changedTouches.length) {
//                 e.x = e.changedTouches[0].pageX;
//                 e.y = e.changedTouches[0].pageY;
//             }
//             if (e.x === undefined) {
//                 e.x = e.pageX;
//                 e.y = e.pageY;
//             }
//             mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);

//             if (!lastTime) {
//                 lastTime = performance.now();
//                 lastMouse.set(e.x, e.y);
//             }

//             const deltaX = e.x - lastMouse.x;
//             const deltaY = e.y - lastMouse.y;

//             lastMouse.set(e.x, e.y);

//             let time = performance.now();
//             let delta = Math.max(10.4, time - lastTime);
//             lastTime = time;
//             velocity.x = deltaX / delta;
//             velocity.y = deltaY / delta;
//             velocity.needsUpdate = true;
//         };

//         const update = (t) => {
//             requestAnimationFrame(update);

//             // Update the texture with the current video frame
//             if (video.readyState >= video.HAVE_CURRENT_DATA) {
//                 texture.image = video;
//             }

//             if (!velocity.needsUpdate) {
//                 mouse.set(-1);
//                 velocity.set(0);
//             }
//             velocity.needsUpdate = false;

//             flowmap.aspect = aspect;
//             flowmap.mouse.copy(mouse);
//             flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
//             flowmap.update();

//             program.uniforms.uTime.value = t * 0.01;
//             renderer.render({ scene: mesh });
//         };

//         let lastTime;
//         const lastMouse = new Vec2();

//         if (isTouchCapable) {
//             window.addEventListener("touchstart", updateMouse, false);
//             window.addEventListener("touchmove", updateMouse, { passive: false });
//         } else {
//             window.addEventListener("mousemove", updateMouse, false);
//         }

//         requestAnimationFrame(update);

//         return () => {
//             window.removeEventListener("resize", resize);
//             if (isTouchCapable) {
//                 window.removeEventListener("touchstart", updateMouse);
//                 window.removeEventListener("touchmove", updateMouse);
//             } else {
//                 window.removeEventListener("mousemove", updateMouse);
//             }
//             document.body.removeChild(video);
//         };
//     }, []);

//     return (
//         <main id="flowmap-container" className='w-full h-full'>
//         </main>
//     );
// };

// export default MouseFlowmapDeformation;



























// import React, { useEffect } from 'react';
// import { Renderer, Vec2, Vec4, Flowmap, Geometry, Texture, Program, Mesh } from 'ogl';

// const MouseFlowmapDeformation = () => {
//     useEffect(() => {
//         const loadFont = async (fontName, url) => {
//             const font = new FontFace(fontName, `url(${url})`);
//             await font.load();
//             document.fonts.add(font);
//         };

//         const init = async () => {
//             await loadFont('Green_Energy', '/Green_Energy.ttf');

//             let imgSize = [1600, 1200];

//             const vertex = `
//                 attribute vec2 uv;
//                 attribute vec2 position;
//                 varying vec2 vUv;
//                 void main() {
//                     vUv = uv;
//                     gl_Position = vec4(position, 0, 1);
//                 }
//             `;

//             const fragment = `
//                 precision highp float;
//                 precision highp int;
//                 uniform sampler2D tWater;
//                 uniform sampler2D tFlow;
//                 uniform float uTime;
//                 varying vec2 vUv;
//                 uniform vec4 res;

//                 void main() {
//                     vec3 flow = texture2D(tFlow, vUv).rgb;
//                     vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
//                     vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
//                     myUV -= flow.xy * (0.15 * 0.5);
//                     vec3 tex = texture2D(tWater, myUV).rgb;
//                     gl_FragColor.rgb = vec3(tex.r, tex.g, tex.b);
//                     gl_FragColor.a = tex.r;
//                 }
//             `;

//             const renderer = new Renderer({ dpr: 2, alpha: true });
//             const gl = renderer.gl;
//             document.getElementById('flowmap-container').appendChild(gl.canvas);
//             gl.clearColor(0, 0, 0, 0);
//             const isTouchCapable = 'ontouchstart' in window;
//             let aspect = 1;
//             const mouse = new Vec2(-1);
//             const velocity = new Vec2();

//             const resize = () => {
//                 let a1, a2;
//                 var imageAspect = imgSize[1] / imgSize[0];
//                 if (window.innerHeight / window.innerWidth < imageAspect) {
//                     a1 = 1;
//                     a2 = window.innerHeight / window.innerWidth / imageAspect;
//                 } else {
//                     a1 = (window.innerWidth / window.innerHeight) * imageAspect;
//                     a2 = 1;
//                 }
//                 mesh.program.uniforms.res.value = new Vec4(window.innerWidth, window.innerHeight, a1, a2);
//                 renderer.setSize(window.innerWidth, window.innerHeight);
//                 aspect = window.innerWidth / window.innerHeight;
//             };

//             const flowmap = new Flowmap(gl, { falloff: 0.2, dissipation: 0.9 });

//             const geometry = new Geometry(gl, {
//                 position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
//                 uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
//             });

//             const textCanvas = document.createElement('canvas');
//             const textCtx = textCanvas.getContext('2d');
//             textCanvas.width = 1024;
//             textCanvas.height = 512;
//             textCtx.fillStyle = 'white';
//             textCtx.font = '500 5vw "Green_Energy"';
//             textCtx.textAlign = 'center';
//             textCtx.textBaseline = 'middle';
//             textCtx.fillText('MONSTER', textCanvas.width / 2, textCanvas.height / 2);

//             const texture = new Texture(gl, {
//                 minFilter: gl.LINEAR,
//                 magFilter: gl.LINEAR,
//                 premultiplyAlpha: true
//             });
//             texture.image = textCanvas;

//             let a1, a2;
//             var imageAspect = textCanvas.height / textCanvas.width;
//             if (window.innerHeight / window.innerWidth < imageAspect) {
//                 a1 = 1;
//                 a2 = window.innerHeight / window.innerWidth / imageAspect;
//             } else {
//                 a1 = (window.innerWidth / window.innerHeight) * imageAspect;
//                 a2 = 1;
//             }

//             const program = new Program(gl, {
//                 vertex,
//                 fragment,
//                 uniforms: {
//                     uTime: { value: 0 },
//                     tWater: { value: texture },
//                     res: { value: new Vec4(window.innerWidth, window.innerHeight, a1, a2) },
//                     img: { value: new Vec2(textCanvas.width, textCanvas.height) },
//                     tFlow: flowmap.uniform
//                 }
//             });

//             const mesh = new Mesh(gl, { geometry, program });

//             window.addEventListener('resize', resize, false);
//             resize();

//             const updateMouse = (e) => {
//                 e.preventDefault();
//                 if (e.changedTouches && e.changedTouches.length) {
//                     e.x = e.changedTouches[0].pageX;
//                     e.y = e.changedTouches[0].pageY;
//                 }
//                 if (e.x === undefined) {
//                     e.x = e.pageX;
//                     e.y = e.pageY;
//                 }
//                 mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);

//                 if (!lastTime) {
//                     lastTime = performance.now();
//                     lastMouse.set(e.x, e.y);
//                 }

//                 const deltaX = e.x - lastMouse.x;
//                 const deltaY = e.y - lastMouse.y;

//                 lastMouse.set(e.x, e.y);

//                 let time = performance.now();
//                 let delta = Math.max(10.4, time - lastTime);
//                 lastTime = time;
//                 velocity.x = deltaX / delta;
//                 velocity.y = deltaY / delta;
//                 velocity.needsUpdate = true;
//             };

//             const update = (t) => {
//                 requestAnimationFrame(update);

//                 if (!velocity.needsUpdate) {
//                     mouse.set(-1);
//                     velocity.set(0);
//                 }
//                 velocity.needsUpdate = false;

//                 flowmap.aspect = aspect;
//                 flowmap.mouse.copy(mouse);
//                 flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
//                 flowmap.update();

//                 program.uniforms.uTime.value = t * 0.01;
//                 renderer.render({ scene: mesh });
//             };

//             let lastTime;
//             const lastMouse = new Vec2();

//             if (isTouchCapable) {
//                 window.addEventListener('touchstart', updateMouse, false);
//                 window.addEventListener('touchmove', updateMouse, { passive: false });
//             } else {
//                 window.addEventListener('mousemove', updateMouse, false);
//             }

//             requestAnimationFrame(update);
//         };

//         init();

//         return () => {
//             window.removeEventListener('resize', resize);
//             if (isTouchCapable) {
//                 window.removeEventListener('touchstart', updateMouse);
//                 window.removeEventListener('touchmove', updateMouse);
//             } else {
//                 window.removeEventListener('mousemove', updateMouse);
//             }
//         };
//     }, []);

//     return (
//         <main id="flowmap-container" className='bg-transparent'>
//         </main>
//     );
// };

// export default MouseFlowmapDeformation;
