var p = Object.defineProperty;
var m = (a, t, e) => t in a ? p(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var i = (a, t, e) => m(a, typeof t != "symbol" ? t + "" : t, e);
const b = ["click"];
class g {
  constructor(t, e = !0) {
    i(this, "button");
    i(this, "clickCallback");
    this.button = this.createButton();
    const s = document.createElement("div");
    s.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group"), s.appendChild(this.button), e || (s.style.display = "none"), t.appendChild(s);
  }
  on(t, e) {
    if (!b.includes(t))
      throw new Error(`Event type ${t} is not supported.`);
    switch (t) {
      case "click":
        this.clickCallback = e;
        break;
    }
  }
  turnOn() {
    this.button.classList.add("maplibregl-ctrl-compass-heading-active"), this.button.setAttribute("aria-pressed", "true"), this.startLoading();
  }
  turnOff() {
    this.button.classList.remove("maplibregl-ctrl-compass-heading-active"), this.button.setAttribute("aria-pressed", "false"), this.stopLoading();
  }
  disable() {
    this.button.setAttribute("title", "Compass not available"), this.button.setAttribute("aria-label", "Compass not available"), this.button.setAttribute("disabled", "disabled");
  }
  startLoading() {
    this.button.classList.add("maplibregl-ctrl-compass-heading-waiting");
  }
  stopLoading() {
    this.button.classList.remove("maplibregl-ctrl-compass-heading-waiting");
  }
  createButton() {
    const t = document.createElement("button");
    t.classList.add("maplibregl-ctrl-compass-heading"), t.setAttribute("title", "Rotate map to heading-up"), t.setAttribute("aria-label", "Rotate map to heading-up"), t.addEventListener("click", () => {
      this.clickCallback && this.clickCallback();
    });
    const e = document.createElement("span");
    return e.classList.add("maplibregl-ctrl-icon"), t.appendChild(e), t;
  }
}
class v {
  constructor(t) {
    i(this, "element");
    i(this, "eventTimestamps", []);
    this.element = document.createElement("div"), this.element.classList.add("maplibregl-ctrl"), this.element.innerHTML = `
    <dl class="maplibregl-ctrl-compass-heading-debug">
      <dt>event</dt>
      <dd class="event-type"></dd>
      <dt>heading</dt>
      <dd class="heading"></dd>
      <dt>alpha</dt>
      <dd class="alpha"></dd>
      <dt>beta</dt>
      <dd class="beta"></dd>
      <dt>gamma</dt>
      <dd class="gamma"></dd>
      <dt>count</dt>
      <dd class="count"></dd>
    </dl>
    `, t.appendChild(this.element);
  }
  update(t) {
    if (!t) {
      this.clear();
      return;
    }
    const e = Date.now();
    this.eventTimestamps.push(e), this.eventTimestamps = this.eventTimestamps.filter((u) => e - u <= 1e3);
    const s = t.originalEvent.type, n = t.heading != null ? t.heading.toFixed(4) : "", o = t.originalEvent.alpha != null ? t.originalEvent.alpha.toFixed(4) : "", r = t.originalEvent.beta != null ? t.originalEvent.beta.toFixed(4) : "", d = t.originalEvent.gamma != null ? t.originalEvent.gamma.toFixed(4) : "", h = `${this.eventTimestamps.length} events/sec`;
    this.updateField(".event-type", s), this.updateField(".heading", n), this.updateField(".alpha", o), this.updateField(".beta", r), this.updateField(".gamma", d), this.updateField(".count", h);
  }
  clear() {
    [
      ".event-type",
      ".heading",
      ".alpha",
      ".beta",
      ".gamma",
      ".count"
    ].forEach((e) => this.updateField(e, ""));
  }
  updateField(t, e) {
    const s = this.element.querySelector(t);
    s && (s.textContent = e);
  }
}
const l = class l {
  constructor() {
    i(this, "deviceOrientationCallback");
    i(this, "errorCallback");
    i(this, "isListening", !1);
    i(this, "historySize", 100);
    i(this, "headingHistory", []);
    i(this, "onDeviceOrientation", (t) => {
      t.type === "deviceorientationabsolute" && t.alpha != null ? this.removeDeviceOrientationListener() : t.type === "deviceorientation" && t.webkitCompassHeading != null && this.removeDeviceOrientationAbsoluteListener();
      const e = this.calculateCompassHeading(t);
      e != null && (this.headingHistory.push(e), this.headingHistory.length > this.historySize && this.headingHistory.shift());
      const s = this.calculateMovingAverage();
      this.deviceOrientationCallback && this.deviceOrientationCallback({
        heading: s,
        originalEvent: t
      });
    });
  }
  on(t, e) {
    if (!l.eventTypes.includes(t))
      throw new Error(`Event type ${t} is not supported.`);
    switch (t) {
      case "deviceorientation":
        this.deviceOrientationCallback = e;
        break;
      case "error":
        this.errorCallback = e;
        break;
    }
  }
  turnOn() {
    this.isListening || (this.addDeviceOrientationListener(), this.addDeviceOrientationAbsoluteListener(), this.isListening = !0);
  }
  turnOff() {
    this.removeDeviceOrientationListener(), this.removeDeviceOrientationAbsoluteListener(), this.isListening = !1;
  }
  addDeviceOrientationListener() {
    if ("requestPermission" in window.DeviceOrientationEvent) {
      window.DeviceOrientationEvent.requestPermission().then((t) => {
        if (t !== "granted") {
          this.handleError("PERMISSION_DENIED", "Permission denied");
          return;
        }
        window.addEventListener(
          "deviceorientation",
          this.onDeviceOrientation,
          !0
        );
      }).catch(() => this.handleError("PERMISSION_DENIED", "Permission denied"));
      return;
    }
    window.addEventListener("deviceorientation", this.onDeviceOrientation, !0);
  }
  removeDeviceOrientationListener() {
    window.removeEventListener(
      "deviceorientation",
      this.onDeviceOrientation,
      !0
    );
  }
  addDeviceOrientationAbsoluteListener() {
    window.addEventListener(
      "deviceorientationabsolute",
      this.onDeviceOrientation,
      !0
    );
  }
  removeDeviceOrientationAbsoluteListener() {
    window.removeEventListener(
      "deviceorientationabsolute",
      this.onDeviceOrientation,
      !0
    );
  }
  calculateCompassHeading(t) {
    if (t.webkitCompassHeading != null)
      return t.webkitCompassHeading;
    if (t.alpha == null)
      return;
    let e = 360 - t.alpha;
    return e < 0 && (e += 360), e;
  }
  calculateMovingAverage() {
    if (this.headingHistory.length === 0)
      return;
    const t = this.headingHistory.reduce(
      (o, r) => o + Math.sin(r * Math.PI / 180),
      0
    ), e = this.headingHistory.reduce(
      (o, r) => o + Math.cos(r * Math.PI / 180),
      0
    );
    let n = Math.atan2(
      t / this.headingHistory.length,
      e / this.headingHistory.length
    ) * 180 / Math.PI;
    return n < 0 && (n += 360), n;
  }
  handleError(t, e) {
    var s;
    (s = this.errorCallback) == null || s.call(this, { code: t, message: e });
  }
};
i(l, "eventTypes", ["deviceorientation", "error"]);
let c = l;
const f = {
  debug: !1,
  visible: !0,
  timeout: 3e3
  // ms
}, k = ["turnon", "turnoff", "error", "compass"];
class w {
  constructor(t) {
    i(this, "map");
    i(this, "container", document.createElement("div"));
    i(this, "compass");
    i(this, "compassButton");
    i(this, "debugView");
    i(this, "options");
    i(this, "active", !1);
    i(this, "currentEvent");
    i(this, "turnonCallback");
    i(this, "turnoffCallback");
    i(this, "errorCallback");
    i(this, "compassCallback");
    this.options = { ...f, ...t }, this.compass = new c(), this.compass.on("deviceorientation", (e) => {
      if (!this.map || e.heading === void 0)
        return;
      this.currentEvent = e, this.compassButton.stopLoading();
      const s = e.heading, n = this.map.getBearing();
      !this.map.isZooming() && Math.abs(s - n) >= 1 && this.map.setBearing(s, {
        geolocateSource: !0
        // tag this camera change so it won't cause the control to change to background state
      }), this.options.debug && this.updateDebugView(), this.compassCallback && this.compassCallback(e);
    }), this.compass.on("error", (e) => {
      this.disable(), this.errorCallback && this.errorCallback(e);
    }), this.compassButton = new g(this.container), this.compassButton.on("click", () => {
      this.active ? this.turnOff() : this.turnOn();
    }), this.options.debug && (this.debugView = new v(this.container));
  }
  onAdd(t) {
    return this.map = t, this.map.on("touchmove", () => {
      this.active && (this.turnOff(), this.active = !1);
    }), this.container;
  }
  onRemove() {
    this.map = void 0, this.turnOff();
  }
  on(t, e) {
    if (!k.includes(t))
      throw new Error(`Event type ${t} is not supported.`);
    switch (t) {
      case "turnon":
        this.turnonCallback = e;
        break;
      case "turnoff":
        this.turnoffCallback = e;
        break;
      case "error":
        this.errorCallback = e;
        break;
      case "compass":
        this.compassCallback = e;
        break;
    }
  }
  turnOn() {
    this.compass.turnOn(), this.compassButton.turnOn(), setTimeout(() => {
      var t;
      this.active && ((t = this.currentEvent) == null ? void 0 : t.heading) === void 0 && (this.disable(), this.errorCallback && this.errorCallback({ code: "TIMEOUT", message: "Timeout" }));
    }, this.options.timeout), this.turnonCallback && this.turnonCallback(), this.active = !0;
  }
  turnOff() {
    this.compass.turnOff(), this.compassButton.turnOff(), this.options.debug && this.clearDebugView(), this.turnoffCallback && this.turnoffCallback(), this.active = !1;
  }
  updateDebugView() {
    var t;
    (t = this.debugView) == null || t.update(this.currentEvent);
  }
  clearDebugView() {
    var t;
    (t = this.debugView) == null || t.update();
  }
  disable() {
    this.compassButton.disable(), this.turnOff();
  }
}
export {
  w as CompassControl
};
