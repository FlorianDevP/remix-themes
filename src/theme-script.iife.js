"use strict";
(() => {
  function k(n) {
    let e = n.toString(),
      t = "",
      c = 0,
      o,
      r;
    for (; c < e.length; )
      (o = e.charAt(c++)),
        /[\w*+\-./@]/.exec(o)
          ? (t += o)
          : ((r = o.charCodeAt(0)),
            r < 256
              ? (t += "%" + u(r, 2))
              : (t += "%u" + u(r, 4).toUpperCase()));
    return t;
  }
  function u(n, e) {
    let t = n.toString(16);
    for (; t.length < e; ) t = "0" + t;
    return t;
  }
  function A(n, e) {
    let c = n
      .split(";")
      .map((o) => o.split("=", 2))
      .find(([o]) => o.trim() === e);
    if (c) {
      let [o, r] = c;
      return r;
    }
  }
  function y(n) {
    try {
      let e = n.lastIndexOf("."),
        t = n.slice(0, e < 0 ? n.length : e);
      return JSON.parse(decodeURIComponent(k(atob(decodeURIComponent(t)))));
    } catch (e) {
      return;
    }
  }
  function p(n, e) {
    var l, m;
    let t = (l = e.parseHeaderFunc) != null ? l : A,
      c = (m = e.decodeValueFunc) != null ? m : y,
      o = t(n, e.name);
    if (!o) return;
    let r = c(o);
    if (
      typeof r == "object" &&
      r !== null &&
      "theme" in r &&
      typeof r.theme == "string"
    )
      return r.theme === "light" ? "light" : "dark";
  }
  var f = document.currentScript;
  if (!f) throw new Error("Failed to get current script");
  var g = f.dataset.cookieName;
  if (!g) throw new Error("No cookie name provided");
  var w = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark",
    h,
    i = (h = p(document.cookie, { name: g })) != null ? h : w,
    s = document.documentElement.classList,
    a = document.documentElement.dataset.theme;
  typeof a == "string"
    ? a === "light" ||
      a === "dark" ||
      (document.documentElement.dataset.theme = i)
    : s.contains("light") || s.contains("dark") || s.add(i);
  var d = document.querySelector("meta[name=color-scheme]");
  d &&
    (i === "dark"
      ? (d.content = "dark light")
      : i === "light" && (d.content = "light dark"));
})();
