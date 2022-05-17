/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

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
var _AnimatedObject_once, _AnimatedObject_counter, _AnimatedObject_follow, _AnimatedObject_styles;
class AnimatedObject extends HTMLElement {
    constructor() {
        super();
        _AnimatedObject_once.set(this, void 0);
        _AnimatedObject_counter.set(this, void 0);
        _AnimatedObject_follow.set(this, void 0);
        _AnimatedObject_styles.set(this, void 0);
        this.target = [];
        this.props = [];
        __classPrivateFieldSet(this, _AnimatedObject_styles, "", "f");
        this.container = null;
        this.delay = 100;
        this.animation = "";
        __classPrivateFieldSet(this, _AnimatedObject_once, false, "f");
        __classPrivateFieldSet(this, _AnimatedObject_follow, false, "f");
        const options = { threshold: 0.6, rootMargin: '0px' };
        this.observer = new IntersectionObserver(this.callback.bind(this), options);
        __classPrivateFieldSet(this, _AnimatedObject_counter, 0, "f");
        // init attribute
        this.attribute();
        // bind functions
        this.onIntersecting = this.onIntersecting.bind(this);
        this.onUnintersecting = this.onUnintersecting.bind(this);
    }
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
    static addAnimation(props) {
        let animation = {
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
    connectedCallback() {
        this.prerender();
        this.styling();
        this.render();
        (__classPrivateFieldGet(this, _AnimatedObject_follow, "f")) ? this.observe() : this.onIntersecting();
    }
    /**
     * handle attribute that we define on the custom element
     */
    attribute() {
        const attrs = this.getAttributeNames();
        for (const attr of attrs) {
            let value = this.getAttribute(attr);
            switch (attr) {
                case "delay":
                    this.delay = Number(value);
                    this.delay = (isNaN(this.delay)) ? 300 : this.delay;
                    break;
                case "animation":
                    this.animation = value;
                    break;
                case "once":
                    __classPrivateFieldSet(this, _AnimatedObject_once, (value !== null), "f");
                    break;
                case "follow":
                    __classPrivateFieldSet(this, _AnimatedObject_follow, (value !== null || __classPrivateFieldGet(this, _AnimatedObject_once, "f")), "f");
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
                this.container.setAttribute(prop, this.getAttribute(prop));
        });
    }
    /**
     * create style according to defined animation on the current custom element
     */
    styling() {
        const animations = AnimatedObject.ANIMATIONS[this.tagName];
        if (animations) {
            animations.forEach((animation) => {
                const opp = AnimatedObject.DEFAULT_ANIMATION[this.tagName] || {};
                AnimatedObject.DEFAULT_ANIMATION[this.tagName] = Object.assign(Object.assign({}, opp), { [animation.name]: `default__${animation.name}` });
                __classPrivateFieldSet(this, _AnimatedObject_styles, __classPrivateFieldGet(this, _AnimatedObject_styles, "f") + `

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
                `, "f");
            });
        }
        const style = document.createElement('style');
        style.innerHTML = __classPrivateFieldGet(this, _AnimatedObject_styles, "f");
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
    callback(entries, observer) {
        entries.forEach(entry => {
            var _a;
            if (entry.isIntersecting) {
                this.onIntersecting();
            }
            else {
                if (__classPrivateFieldGet(this, _AnimatedObject_once, "f") && __classPrivateFieldGet(this, _AnimatedObject_counter, "f") < 1) {
                    this.onUnintersecting();
                    __classPrivateFieldSet(this, _AnimatedObject_counter, (_a = __classPrivateFieldGet(this, _AnimatedObject_counter, "f"), _a++, _a), "f");
                    this.observer.unobserve(entry.target);
                }
                else if (!__classPrivateFieldGet(this, _AnimatedObject_once, "f")) {
                    this.onUnintersecting();
                }
            }
        });
    }
    /**
     * if we want some specific tag to englobe or code, we can use attribute as.
     * So it create this tag, and englobe all tag in the custom element
     */
    prerender() {
        if (this.container !== null) {
            Array.from(this.childNodes).forEach(child => {
                var _a;
                this.removeChild(child);
                (_a = this.container) === null || _a === void 0 ? void 0 : _a.append(child);
            });
            this.appendChild(this.container);
        }
    }
}
_AnimatedObject_once = new WeakMap(), _AnimatedObject_counter = new WeakMap(), _AnimatedObject_follow = new WeakMap(), _AnimatedObject_styles = new WeakMap();
AnimatedObject.ANIMATIONS = {};
AnimatedObject.DEFAULT_ANIMATION = {};

/**
 * @author RATIARIVELO Nekena Rayane
 * @description Custom element that add animation on text
 * @version 1.0.3
 *
 */
class TextAnimate extends AnimatedObject {
    constructor() {
        super();
        this.velocity = 300;
        this.key_count = 0;
        this.loop = this.loop.bind(this);
        this.spanify = this.spanify.bind(this);
    }
    observe() {
        this.observer.observe(this);
    }
    onIntersecting() {
        this.target.forEach(item => {
            item.classList.add(this.animation);
        });
    }
    onUnintersecting() {
        this.target.forEach(item => {
            item.classList.remove(this.animation);
        });
    }
    render() {
        this.loop(this.container || this);
    }
    loop(parent) {
        let elements = [];
        const nodes = parent.childNodes;
        nodes.forEach((node) => {
            var _a;
            if (node.nodeType === Node.TEXT_NODE) {
                const words = (_a = node.textContent) === null || _a === void 0 ? void 0 : _a.split(' ');
                const spans = words === null || words === void 0 ? void 0 : words.map((word) => this.spanify(word, this.key_count++));
                const spans_space = spans === null || spans === void 0 ? void 0 : spans.reduce((acc, cur) => {
                    return acc.concat([cur, document.createTextNode(' ').cloneNode()]);
                }, []);
                elements = elements.concat(spans_space);
            }
            else if (node.nodeName !== "STYLE") {
                if (node.nodeName !== "BR") {
                    this.loop(node);
                }
                elements.push(node);
            }
        });
        parent.innerHTML = "";
        elements.forEach(element => {
            parent.appendChild(element);
        });
        return elements;
    }
    spanify(text, id) {
        const mask = document.createElement('span');
        Object.assign(mask.style, {
            display: "inline-block",
            overflow: "hidden",
        });
        const parent = document.createElement('span');
        parent.style.setProperty('display', "block");
        parent.style.setProperty('animation-delay', (this.delay * id + this.velocity) + "ms", "important");
        parent.classList.add(AnimatedObject.DEFAULT_ANIMATION[this.tagName][this.animation]);
        this.target.push(parent);
        parent.textContent = text;
        mask.appendChild(parent);
        return mask;
    }
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
//# sourceMappingURL=index.js.map
