import TextAnimate from "./entity/TextAnimate.js";
import AnimatedObject from "./model/AnimatedObject.js";
declare global {
    interface Window {
        animateObject: any;
    }
}
export { AnimatedObject, TextAnimate };
