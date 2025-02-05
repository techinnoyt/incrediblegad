/*!
 * lazy.js by Fineshop Design
 * ----------------------------
 *
 * MIT License
 *
 * Copyright (c) 2021 Fineshop Design
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
window.lazy =
  window.lazy ||
  new Promise((resolve) => {
    const LOCAL_KEY = "IS_LAZIED";
    const LOCAL_VALUE = "true";
    // Window events to be attached initially which can trigger lazy
    const WINDOW_INITIAL_EVENTS = ["scroll", "click"];
    // Window events to be attached after window is fully loaded which can trigger lazy
    const WINDOW_ONLOAD_EVENTS = [
      "keydown",
      "mouseover",
      "touchmove",
      "touchstart",
    ];
    // All window events which will be attached
    const WINDOW_EVENTS = WINDOW_INITIAL_EVENTS.concat(WINDOW_ONLOAD_EVENTS);

    function getLazied() {
      try {
        return localStorage.getItem(LOCAL_KEY) === LOCAL_VALUE;
      } catch (_) {
        return true;
      }
    }
    function setLazied(lazied = true) {
      try {
        if (lazied) {
          localStorage.setItem(LOCAL_KEY, LOCAL_VALUE);
        } else {
          localStorage.removeItem(LOCAL_KEY);
        }
      } catch (_) {
        // do nothing
      }
    }
    function execute(data) {
      setLazied(true);
      resolve({ type: data.type.toLowerCase() });
      // detach event listeners
      for (const type of WINDOW_EVENTS) {
        window.removeEventListener(type, execute);
      }
    }
    if (getLazied()) {
      resolve({ type: "local" });
    } else {
      // check if document is already scrolled
      if (
        document.documentElement.scrollTop !== 0 ||
        (document.body && document.body.scrollTop !== 0)
      ) {
        execute({ type: "scroll" });
      } else {
        // events to be attached after window is loaded
        const onLoad = () => {
          window.removeEventListener("load", onLoad);
          for (const type of WINDOW_ONLOAD_EVENTS) {
            window.addEventListener(type, execute);
          }
        };
        window.addEventListener("load", onLoad);

        // events to be attached initially
        for (const type of WINDOW_INITIAL_EVENTS) {
          window.addEventListener(type, execute);
        }
      }
    }
  });
