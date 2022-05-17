/**
 * @author RATIARIVELO Nekena Rayane
 * @description Object that let us to create custom element easily
 * @version 1.0.0
 *
 * Make simple animation consist of define animation at first and at the end.
 *
 * So, we add animation with static method AnimatedObject.addAnimation
 * on a Custom Element that extends on AnimatedObject.
 *
 * You can use a custom element TextAnimate that we provide on this lib,
 * OR you can create your own custom element that extends on AnimatedObject.
 *
 * AnimatedObject is an abstract class, so you should define abstract method.
 * You can check TextAnimate source code, if you want to understand how to use it.
 */
declare type AnimationData = {
    name: string;
    duration: number;
    timing: string;
    keyframe: {
        from: string;
        to: string;
    };
};
declare abstract class AnimatedObject extends HTMLElement {
    #private;
    protected animation: string;
    protected target: HTMLElement[];
    protected observer: IntersectionObserver;
    protected container: HTMLElement | null;
    protected props: string[];
    protected delay: number;
    constructor();
    static ANIMATIONS: {
        [key: string]: AnimationData[];
    };
    static DEFAULT_ANIMATION: {
        [key: string]: {
            [key: string]: string;
        };
    };
    /**
     * [!] We must define animation if we want to create
     * a animate object.
     *
     * @param props
     * @param props.selector the custom element that use it
     * @param props.name name of the animation
     * @param props.duration duration in millisecond
     * @param props.from
     * @param props.keyframe
     */
    static addAnimation(props: AnimationData & {
        selector: string;
    }): void;
    /**
     * call when our custom element are load on the dom
     */
    private connectedCallback;
    /**
     * handle attribute that we define on the custom element
     */
    private attribute;
    /**
     * create style according to defined animation on the current custom element
     */
    private styling;
    /**
     * call when we observe change according to the threshold,
     *
     * @summary
     * When we observe the target elements on the viewport, we call onIntersecting.
     * Else we call once onUnintersecting if the animation is just call once, or always onUnintersecting if not.
     *
     * @param entries
     * @param observer
     */
    private callback;
    /**
     * if we want some specific tag to englobe or code, we can use attribute as.
     * So it create this tag, and englobe all tag in the custom element
     */
    private prerender;
    abstract onIntersecting(): void;
    abstract onUnintersecting(): void;
    abstract observe(): void;
    abstract render(): void;
}
export default AnimatedObject;
