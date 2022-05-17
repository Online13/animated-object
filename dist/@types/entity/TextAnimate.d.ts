/**
 * @author RATIARIVELO Nekena Rayane
 * @description Custom element that add animation on text
 * @version 1.0.3
 *
 */
import AnimatedObject from "../model/AnimatedObject.js";
declare class TextAnimate extends AnimatedObject {
    private key_count;
    private velocity;
    constructor();
    observe(): void;
    onIntersecting(): void;
    onUnintersecting(): void;
    render(): void;
    private loop;
    private spanify;
}
export default TextAnimate;
