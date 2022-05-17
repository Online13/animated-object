/**
 * @author RATIARIVELO Nekena Rayane 
 * @description Custom element that add animation on text
 * @version 1.0.3
 * 
 */
import AnimatedObject from "../model/AnimatedObject.js";

class TextAnimate extends AnimatedObject {

    private key_count: number;
    private velocity: number;

    constructor() {
        super();
        this.velocity = 300;
        this.key_count = 0;
        this.loop = this.loop.bind(this);
        this.spanify = this.spanify.bind(this);
    }

    override observe() {
        this.observer.observe(this as HTMLElement);
    }

    override onIntersecting() {
        this.target.forEach(item => {
            item.classList.add(this.animation);
        });
    }

    override onUnintersecting() {
        this.target.forEach(item => {
            item.classList.remove(this.animation);
        });
    }

    override render() {
        this.loop(this.container || this);
    }

    private loop(parent: ChildNode) {
        let elements: any[] = [];
        const nodes = parent.childNodes;
        nodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent?.split(' ');
                const spans = words?.map((word) => this.spanify(word, this.key_count++));
                const spans_space: any = spans?.reduce((acc: any, cur: any) => {
                    return acc.concat([cur, document.createTextNode(' ').cloneNode()]);
                }, []);
                elements = elements.concat(spans_space);
            } else if (node.nodeName !== "STYLE") {
                if (node.nodeName !== "BR") {
                    this.loop(node)
                }
                elements.push(node);
            }
        });

        (parent as HTMLElement).innerHTML = "";
        elements.forEach(element => {
            parent.appendChild(element);
        });

        return elements;
    }

    private spanify(text: string, id: number): HTMLSpanElement {

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


export default TextAnimate;