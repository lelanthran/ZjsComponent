# ZjsComponent

## What is this?

*ZjsComponent* is a simple webcomponent that allows the creation of a single
object which includes both HTML snippets **and** methods. This object can be
(mostly) used directly from HTML, even though the object's methods can be
called from Javascript too.

A single object (or component, if you want to be fastidiously picky about
naming things) has two elements:

1. The HTML that would be rendered, and
2. Methods that can be invoked on the object.

Methods can be invoked the normal way from Javascript, using `myObj.method()`,
**OR** any call-site can *`send`* a message to an object asking it to invoke a
method, using `ZjsComponent.send()`.

## How to create an object
1. Write the HTML that will be rendered for the object, then
2. Define methods for the object

Here's a really simple object that provides a counter:
```html
<div>
   Counter Value: <span name=counter-value>0</span>
</div>
<div>
   <button onclick='ZjsComponent.send(this, "increment", 1)'> +1 </button>
   <button onclick='ZjsComponent.send(this, "increment", 2)'> +2 </button>
   <button onclick='ZjsComponent.send(this, "increment", 5)'> +5 </button>
</div>

<script>
   function increment(amount) {
      const el = this.querySelector("[name='counter-value']");
      el.textContent = parseInt(el.textContent) + amount;
   }

   exports.increment = increment;
</script>
```

The above snippet renders the fragment of HTML (a display and three buttons)
and defines a method on the object (The  `increment()` function).

## How to instantiate/use an object
To create an instance of the object is equally simple; just add the element to
a page as you would any other HTML tag. The `display` attribute lets you
control `inline` vs `block`, etc so you can have it displayed however you
need.

Here is how we can use the `counter` example from above:

```html
<html>
   <head>
      <script src='zjs-component.js'></script>
   </head>
   <body>
      <zjs-component remote-src=tmp.zjsc> </zjs-component>
   </body>
</html>
```

> In fact, the most common use of *ZjsComponent* is using it as a client-side
> include. There is, after all, no rule that says your object *has* to have
> methods. Having only HTML in the object is a perfectly good way to have
> headers and footers on all your pages without needing any server-side
> generation.

## About method invocation/sending messages
*Sending a message to an object* and *invoking a method on an object* are the
same thing. If you are writing your front-end in Javascript, using only
`myObj.myMethod()` is perfectly fine.

However, in the case you want to invoke a method from within HTML, the static
method `ZjsComponent.send()` invokes the specified method on the specified
object using the specified arguments. This is what enables the example above
to only need `onclick=ZjsComponent.send(this, ...)`; the closest instance of a
*ZjsComponent* ancestor is located and them method is invoked on that specific
instance.

`ZjsComponent.send()` supports a number of different ways to locate the
*ZjsComponent* instance; please read [the full reference](zjs-component.html)
for more information.

## Where to find
If you have used this component, please star [this
repo](https://github.com/lelanthran/ZjsComponent/). While not a valid
scientific way to measure usage, a thumbsuck is better than nothing.

