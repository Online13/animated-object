# Animated Object

Animate Object is a package that provide tools to create animation using custom element.

## Installation

Use the package manager [npm](npmjs.com/) to install foobar.

```bash
npm install animated-object
```

Or use cdn 

- using **jsdelivr**
```html
<script src="https://cdn.jsdelivr.net/npm/animated-object@1.1.5/dist/bundle.min.js" type="module"></script>
```
- or **unpkg**
```html
<script src="https://unpkg.com/animated-object@1.1.5/dist/bundle.min.js"></script>
```

## Usage

Make simple animation on web consist of define animation at first and at the end, and we let navigator interpolate each value between to create animation.

```html
<text-animate as="h1" animation="text-to-top" follow>
    Title that appear when we see it on the viewport.
</text-animate>
```

So, we add animation with static method `AnimatedObject.addAnimation `
on a Custom Element that extends on `AnimatedObject`.

```js
import { AnimatedObject, TextAnimate } from "animated-object";

const TEXT_ANIMATE = "text-animate";

// it is defined by default in the package,
// but I use it on this example
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
```

You can use a custom element TextAnimate that we provide on this lib,  
OR you can create your own custom element that extends on `AnimatedObject`.

`AnimatedObject` is an abstract class, so you should override these methods. 
You can check `TextAnimate` source code, if you want to understand how to use it.

- in Typescript
```ts
import { AnimatedObject } from "animated-object";

class Example extends AnimatedObject {


    constructor() {
        super();
    }

    override observe(): void {
        // for instance
        this.observer.observe(this as HTMLElement);
    }
    
    // when we see the target that we observe, it call this method
    override onIntersecting(): void {}

    // when we don't see the target that we observe, it call this method
    override onUnintersecting(): void {}

    // call at the render on this custom element
    override render(): void {}

}


export default Example;
```

## Documentation

...

## Todo

- change generation of stylesheet using **Animate API**
- make test
- create documentation
- create gif image for this README
- refactor code

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[ISC](./LICENSE.txt)