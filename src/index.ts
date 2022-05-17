import TextAnimate from "./entity/TextAnimate.js";
import AnimatedObject from "./model/AnimatedObject.js";
declare global {
    interface Window { animateObject: any; }
}

const TEXT_ANIMATE = "text-animate";

AnimatedObject.addAnimation({
    selector: TEXT_ANIMATE.toLocaleUpperCase(),
    name: "text-to-top",
    timing: "ease-out",
    duration: 400,
    keyframe: {
        from: `transform: translateY(200%);`,
        to: `transform: translateY(0%);`
    }
});

customElements.define(TEXT_ANIMATE, TextAnimate);

// for those that use cdn
window.animateObject = { AnimatedObject, TextAnimate };

export { AnimatedObject, TextAnimate };