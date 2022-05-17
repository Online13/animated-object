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


type AnimationData = {
    name: string,
    duration: number,
    timing: string,
    keyframe: { from: string, to: string }
};

abstract class AnimatedObject extends HTMLElement {

    protected animation: string; // the class animation
    protected target: HTMLElement[]; // the target to toggle animation class
    protected observer: IntersectionObserver; 
    protected container: HTMLElement | null;
    protected props: string[];
    protected delay: number;
    #once: boolean;
    #counter: number;
    #follow: boolean;
    #styles: string;
    
    constructor() {

        super();

        this.target = [];
        this.props = [];
        this.#styles = "";
        this.container = null;

        this.delay = 100;
        this.animation = "";
        this.#once = false;
        this.#follow = false;
        
        const options = { threshold: 0.6, rootMargin: '0px' };
        this.observer = new IntersectionObserver(this.callback.bind(this), options);

        this.#counter = 0;

        // init attribute
        this.attribute();

        // bind functions
        this.onIntersecting = this.onIntersecting.bind(this);
        this.onUnintersecting = this.onUnintersecting.bind(this);
    }

    static ANIMATIONS: { [key: string]: AnimationData[] } = {}
    static DEFAULT_ANIMATION: { [key: string]: { [key: string]: string } } = {};

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
    static addAnimation(props: AnimationData & { selector: string }) {
        let animation: AnimationData = {
            name: props.name,
            timing: props.timing,
            duration: props.duration,
            keyframe: props.keyframe,
        };
        if (AnimatedObject.ANIMATIONS[props.selector])
            AnimatedObject.ANIMATIONS[props.selector].push(animation);
        else
            AnimatedObject.ANIMATIONS[props.selector] = [animation];
    }

    /**
     * call when our custom element are load on the dom
     */
    private connectedCallback() {
        this.prerender();
        this.styling();
        this.render();
        (this.#follow) ? this.observe() : this.onIntersecting();
    }

    /**
     * handle attribute that we define on the custom element
     */
    private attribute() {
        const attrs = this.getAttributeNames();
        for (const attr of attrs) {
            let value: string = this.getAttribute(attr) as string;
            switch (attr) {
                case "delay":
                    this.delay = Number(value);
                    this.delay = (isNaN(this.delay)) ? 300 : this.delay;
                    break;
                case "animation":
                    this.animation = value;
                    break;
                case "once":
                    this.#once = (value !== null);
                    break;
                case "follow":
                    this.#follow = (value !== null || this.#once);
                    break;
                case "as":
                    this.container = document.createElement(value);
                    break;
                case "class":
                    if (this.container === null)
                        this.className = value;
                    else
                        this.container.className = value;
                    break;
                default:
                    this.props.push(attr);
            }
        }

        this.props.forEach(prop => {
            if (this.container)
                this.container.setAttribute(prop, this.getAttribute(prop) as string);
        });
    }

    /**
     * create style according to defined animation on the current custom element
     */
    private styling(): void {

        const animations = AnimatedObject.ANIMATIONS[this.tagName];

        if (animations) {
            animations.forEach((animation) => {
                
                const opp = AnimatedObject.DEFAULT_ANIMATION[this.tagName] || {};
                AnimatedObject.DEFAULT_ANIMATION[this.tagName] = {
                    ...opp,
                    [animation.name]: `default__${animation.name}`
                }

                this.#styles += `

                    @keyframes ${animation.name} {
                        from {
                            ${animation.keyframe.from}
                        } to {
                            ${animation.keyframe.to}
                        }
                    }

                    @keyframes stop-${animation.name} {
                        from {
                            ${animation.keyframe.to}
                        } to {
                            ${animation.keyframe.from}
                        }
                    }

                    .${animation.name} {
                        animation: ${animation.name} ${animation.duration}ms ${animation.timing} both !important;
                    }
                    .default__${animation.name} {
                        animation: stop-${animation.name} ${animation.duration}ms ${animation.timing} both;
                    }
                `;
            })
        }
        
        const style = document.createElement('style');
        style.innerHTML = this.#styles;
        this.appendChild(style);

    }
    
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
    private callback(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.onIntersecting();
            } else {
                if (this.#once && this.#counter < 1) {
                    this.onUnintersecting();
                    this.#counter++;
                    this.observer.unobserve(entry.target);
                } else if (!this.#once) {
                    this.onUnintersecting();
                }
            }
        });
    }

    /**
     * if we want some specific tag to englobe or code, we can use attribute as.
     * So it create this tag, and englobe all tag in the custom element
     */
    private prerender() {
        if (this.container !== null) {
            Array.from(this.childNodes).forEach(child => {
                this.removeChild(child);
                this.container?.append(child);
            });
            this.appendChild(this.container);
        }
    }
    
    abstract onIntersecting(): void;
    abstract onUnintersecting(): void;
    abstract observe(): void;
    abstract render(): void;

}

export default AnimatedObject;