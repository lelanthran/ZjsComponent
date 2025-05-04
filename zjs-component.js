/* ***************************************************************************
 * Copyright Lelanthran Manickum, 2025 (GPL v3.0). Contact me for an alternate
 * licence should the GPL v3.0 be inadequate for your purposes.
 */

class ZjsComponent extends HTMLElement {

   static _instanceCount = 0;
   static _instances = new Map();

   static send(objOrId, method, ...args) {
      const instance = (objOrId instanceof Number)
         ? ZjsComponent._instances.get(objOrId)
         : (objOrId instanceof String)
            ? document.querySelector(objOrId)
            : objOrId.closest("zjs-component");
      return instance[method](...args);
   }

   constructor() {
      super();
      this.instanceCount = ZjsComponent._instanceCount++;
      ZjsComponent._instances.set(this.instanceCount, this);
   }

   disconnectedCallback() {
      if (typeof this["onDisconnected"] === "function") {
         this["onDisconnected"]();
      }
      ZjsComponent._instances.delete(this.instanceCount);
   }

   async connectedCallback() {
      const remoteSrc = this.getAttribute("remote-src");
      if (!remoteSrc) return;

      if (this.hasAttribute("display")) {
         this.style.display = this.getAttribute("display");
      }

      let response = await fetch(remoteSrc);
      let htmlText = await response.text();

      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlText;

      this.extractAndExecuteScripts(tempDiv);

      Array.from(tempDiv.children).forEach(child => this.appendChild(child));
   }

   extractAndExecuteScripts(fragment) {
      let scripts = fragment.querySelectorAll("script");
      let scriptContent = "";

      scripts.forEach(script => {
         scriptContent += script.textContent + "\n";
         script.remove();
      });

      const myClosure = this.executeInClosure(scriptContent);
      for (let key in myClosure) {
         this[key] = myClosure[key];
      }
      if (typeof this["onConnected"] === "function") {
         this["onConnected"]();
      }
   }

   executeInClosure(scriptContent) {
      try {
         let closureFunction = new Function("exports", `
            (function () {
               try {
                  ${scriptContent}
               } catch (error) {
                  console.error("Runtime error in ZjsComponent.executeInClosure:", error);
               }
            })();
            return exports;
            //# sourceURL=zjs-component-${this.getAttribute("remote-src")}
        `);

         let closure = closureFunction({});

         if (this.hasAttribute("debug")) {
            window.__zjsDebugClosure = closure;
            console.log("Debug mode: myClosure available at window.__zjsDebugClosure");
         }

         return closure;
      } catch (error) {
         console.error("Syntax error in fragment script:", error);
         return {};
      }
   }

}

customElements.define("zjs-component", ZjsComponent);
