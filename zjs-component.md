# ZjsComponent

**ZjsComponent** is a lightweight, zero-dependency Web Component for building
modular, reusable front-end UI components. It allows dynamic loading of
HTML+JS fragments with local script scoping, simple lifecycle hooks, and
isolated DOM composition without needing a full framework.

A single component is simply a fragment of valid HTML that s downloaded and
inserted into the DOM. Scripts in that fragment are scoped to that fragment
alone. An instance of a **ZjsComponent** is created for that fragment which
will have specific functions (identified by the component author) created as
methods on that instance.

To insert a component, which can be a full and rich component containing
complex sub-DOM and methods on the object, do this:
```html
   <zjs-component remote-src=somefile.zjsc> </zjs-component>
```

A single component is a fragment of valid HTML that contains:

1. Zero or more HTML elements,
2. Zero or more `<script>` elements.

The component can have any number of methods, all defined within `<script>`
elements. Methods can be called the usual way using a reference to the JS
element, or via the `ZjsComponent.send()` static method that will find the
closest **ZjsComponent** ancestor and execute the method on that instance.

At it's minimal usage, **ZjsComponent** can simply be used for client-side
includes of HTML. With full leverage of all it's features, **ZjsComponent**
can be used to create reusable HTML web components in the simplest way
possible while allowing the component developer to:

1. Scope access to DOM elements to only those in the HTML fragment that is
   loaded.
2. Scope access to Javascript to only that **ZjsComponent** instance
   represented by the fragment of HTML.

> **NOTE** Not scoping the CSS is a deliberate decision. CSS within the
> fragment *is not scoped*, to allow usage of site-wide and global theming by
> the site author. This dual-cutting sword also means that `<style>` elements
> within a fragment will interfere with the global CSS scopes.

The example below shows how this can be used within plain HTML to let a
`button` element call a method on the containing **ZjsComponent** instance.

---

## 🔧 Installation

Add the script to your webpage before using any `<zjs-component>` tags:

```html
<script src="/path/to/zjs-component.js"></script>
```

You can load it from your server or bundle it with your app.

---

## 🧩 Usage

To use a `zjs-component`, place the custom tag in your HTML and set the
`remote-src` attribute to point to an external `.zjsc` HTML fragment.
All attributes are passed to the fragment script as component attributes.

> The `display=...` attribute is special: it is used to set the
> `style.display` of the element, allowing the caller/user of the component to
> set the display to `inline`, `block`, `inline-block`, `none`, etc.


```html
<zjs-component remote-src="components/hello.zjsc"
               greeting="Hello"
               name="World">
</zjs-component>
```

> **Note** To ease development, change your editor/IDE settings to treat
> `.zjsc` files exactly the same as it does `.html` files. You definitely want
> this so that your editor/IDE does all the correct syntax highlighting,
> autocompletion and code-formatting for `.zjsc` files that it does for
> `.html` files.

---

## 📦 Fragment Structure (`.zjsc` file)

Each remote fragment may contain:

- Any HTML content
- Multiple `<script>` elements defining component methods and lifecycle hooks
- The scripts executes in isolation and may export functions to bind to the
  component

Example `hello.zjsc` component:

```html
<div>
   <input name="name-input" placeholder="Enter your name here">
   <button onclick="ZjsComponent.send(this, 'updateGreeting')">Greet</button>
   <p name="greeting-display"></p>
</div>

<script>

   // Method automatically called when the component is connected to the DOM
   function onConnected() {
      this.greeting = this.getAttribute("greeting") || "Hi";
      this.name = this.getAttribute("name") || "there";
   }

   // Normal method; the `this` keyword works here too.
   function updateGreeting() {
      const el = this.querySelector("[name='name-input']");
      this.name = el.value;
      // No special reason for deferring the call. I just wanted to
      // demonstrate that the methods can be called at any time
      // even outside of the current stack frame.
      setTimeout(() => this.displayGreeting());
   }

   // Another method, this one won't be exported.
   function displayGreeting() {
      const el = this.querySelector("[name='greeting-display']");
      el.innerText = this.name;
   }

   // All public methods *must* be exported like this. If they are not
   // exported, they are private to the current invocation of this script
   // element and cannot be called from outside of this current environment.
   exports.onConnected = onConnected;
   exports.updateGreeting = updateGreeting;
   exports.displayGreeting = displayGreeting;
</script>
```

Example usage of above component:

```
<zjs-component remote-src=zjsc/hello.zjsc
               greeting=Hello
               name=world>
</zjs-component>
```

---

## 🧠 Lifecycle Hooks

The following optional functions can be defined in the fragment script:

- **`onConnected()`** called after the fragment loads and scripts are bound
- **`onDisconnected()`** called when the component is removed from the DOM

These functions, like all functions defined in the script element within a
`.zjsc` page,  have `this` bound to the `zjs-component` instance.

---

## 📡 Calling Component Methods

Use the global `ZjsComponent.send()` function to call exported methods from
within the fragment:

```html
<button onclick="ZjsComponent.send(this, 'someMethod')">Click</button>
```

You can also invoke methods from outside the component:

```js
ZjsComponent.send("#my-component", "someMethod", arg1, arg2);
```

Where:
- First argument: selector, DOM node, or internal instance ID
- Second argument: name of the exported method
- Remaining arguments: passed to the method

Within methods the `this` variable works as you would expect, referencing the
current instance of the component.

---

## 🔍 Debugging

If the component has a `debug` attribute, its internal script `exports` object
will be accessible as `window.__zjsDebugClosure` in the console.

```html
<zjs-component remote-src="components/debug.zjsc" debug></zjs-component>
```

---

## 🔐 Security Note

ZjsComponent uses `new Function()` to execute remote scripts, so only load
fragments from **trusted sources**. Avoid including user-generated content.

---

## ✅ Features Summary

- ✅ Load reusable HTML+JS fragments into any page
- ✅ DOM isolation (children stay inside component tag)
- ✅ Lifecycle hooks (`onConnected`, `onDisconnected`)
- ✅ Method calling via `ZjsComponent.send()`
- ✅ Script scoping per fragment
- ✅ Pass attributes as parameters

---

## 🚫 Limitations

- No reactive state (manual DOM updates)
- No Shadow DOM or scoped styles (yet)
- Breakpoints in DevTools may behave oddly due to dynamic script loading

---

## 📄 License

[MIT4H License](../LICENSE)


