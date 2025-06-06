"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // ../package.json
  var version;
  var init_package = __esm({
    "../package.json"() {
      version = "1.5.1";
    }
  });

  // squeezeboxrpc/js/textImage.js
  function wordwrap(str, width, opt) {
    opt = opt || {};
    const splitChars = [" ", "-", "	"];
    if (opt.wrapCamelCase) {
      str = str.replace(/([a-z])([A-Z])/gm, "$1 $2");
    }
    const words = explode(str, splitChars);
    let curLineLength = 0;
    let strBuilder = "";
    for (let i = 0; i < words.length; i += 1) {
      let word = words[i];
      if (curLineLength + word.length > width) {
        if (curLineLength > 0) {
          strBuilder += "\n";
          curLineLength = 0;
        }
        while (word.Length > width) {
          strBuilder += `${word.substring(0, width - 1)}-`;
          word = word.substring(width - 1);
          strBuilder += "\n";
        }
        word = word.trimStart();
      }
      if (curLineLength == 0 && /^\s+$/.test(word)) {
        word = word.trimStart();
      }
      strBuilder += word;
      curLineLength += word.length;
    }
    return strBuilder;
  }
  function explode(str) {
    const parts = [];
    let startIndex = 0;
    while (true) {
      const index = str.regexIndexOf(/[ |\t|-]/gm, startIndex);
      if (index == -1) {
        parts.push(str.substring(startIndex));
        return parts;
      }
      const word = str.substring(startIndex, startIndex + index - startIndex);
      const nextChar = str.substring(index, index + 1)[0];
      if (/^\s+$/.test(nextChar)) {
        parts.push(word);
        parts.push(nextChar);
      } else {
        parts.push(word + nextChar);
      }
      startIndex = index + 1;
    }
  }
  function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font.getfont();
    const metrics = context.measureText(text);
    return metrics.width;
  }
  function getGoodFontSize(lines, picWidth, font) {
    while (true) {
      const maxWidth = getMaxPixelWidth(lines, font);
      if (maxWidth > picWidth) {
        font.decFontSize();
      } else {
        return font;
      }
    }
  }
  function createCanvas(lines, font, picWidth, picHeight, lineHeight, opt) {
    opt = opt || {};
    const canvas = document.createElement("canvas");
    $("body").append(canvas);
    canvas.width = picWidth;
    canvas.height = picHeight;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = opt.style ? opt.backgroundcolor : "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = font.getfont();
    ctx.fillStyle = opt.style ? opt.style.color : "white";
    ctx.textAlign = opt.style ? opt.style.textAlign : "center";
    let x = 0;
    if (opt.style) {
      if (opt.style.direction == "ltr") {
        if (opt.style.textAlign == "start" || opt.style.textAlign == "left") {
          x = 0;
        }
        if (opt.style.textAlign == "end" || opt.style.textAlign == "right") {
          x = picWidth;
        }
        if (opt.style.textAlign == "center") {
          x = picWidth / 2;
        }
      }
      if (opt.style.direction == "rtl") {
        if (opt.style.textAlign == "end" || opt.style.textAlign == "left") {
          x = 0;
        }
        if (opt.style.textAlign == "start" || opt.style.textAlign == "right") {
          x = picWidth;
        }
        if (opt.style.textAlign == "center") {
          x = picWidth / 2;
        }
      }
    } else {
      x = picWidth / 2;
    }
    const y = font.getDescent() + Math.floor((picHeight - lines.length * lineHeight) / 2);
    ctx.textBaseline = "top";
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y + i * lineHeight);
    }
    return canvas;
  }
  function getMaxChars(lines) {
    return lines.reduce(
      function(acc, cur) {
        return Math.max(acc, cur.length);
      }.bind(this),
      0
    );
  }
  function getMaxPixelWidth(lines, font) {
    return lines.reduce(
      function(acc, cur) {
        return Math.max(acc, getTextWidth(cur.trim(), font));
      }.bind(this),
      0
    );
  }
  function createTextImage(text, font, picWidth, picHeight, opt) {
    opt = opt || {};
    font = typeof font == "string" ? new Font(font) : font;
    const lineHeight = font.getHeight();
    const charWidth = font.getWidth();
    const maxChars = picWidth / charWidth;
    let maxLines = picHeight / lineHeight - 1;
    maxLines = maxLines < 0 ? 1 : maxLines;
    let lines;
    if (picHeight >= picWidth) {
      for (let textWidth = 1; (lines = wordwrap(text, textWidth, opt).split("\n")) && maxLines + 1 < lines.length; textWidth++) {
      }
    } else {
      for (let textWidth = 1; (lines = wordwrap(text, textWidth, opt).split("\n")) && getMaxChars(lines) < maxChars && lines.length > 1; textWidth++) {
      }
    }
    const goodFont = getGoodFontSize(lines, picWidth, font);
    return createCanvas(lines, goodFont, picWidth, picHeight, lineHeight, opt);
  }
  var getTextHeight, Font;
  var init_textImage = __esm({
    "squeezeboxrpc/js/textImage.js"() {
      "use strict";
      String.prototype.regexIndexOf = function(regex, startpos) {
        const indexOf = this.substring(startpos || 0).search(regex);
        return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
      };
      getTextHeight = function(font) {
        const text = $("<span>Hg</span>").css({ font: font.getfont() });
        const block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');
        const div = $("<div></div>");
        div.append(text, block);
        const body = $("body");
        body.append(div);
        const result = {};
        try {
          block.css({ verticalAlign: "baseline" });
          result.ascent = block.offset().top - text.offset().top;
          block.css({ verticalAlign: "bottom" });
          result.height = block.offset().top - text.offset().top;
          result.descent = result.height - result.ascent;
        } finally {
          div.remove();
        }
        return result;
      };
      Font = class {
        /**
         * Creates a Font object for the given element.
         *
         * @param elem the element to get the font string from
         */
        constructor(elem) {
          this.span = document.createElement("span");
          const fontstr = this.getFontString(elem[0]);
          this.span.style.font = fontstr;
          this.measure = getTextHeight(this);
          this.measure.width = getTextWidth("M", this);
        }
        getAscent() {
          return this.measure.ascent;
        }
        getDescent() {
          return this.measure.descent;
        }
        getWidth() {
          return this.measure.width;
        }
        getHeight() {
          return this.measure.height;
        }
        /**
         * Returns the current font string for the font.
         *
         * @returns The current font string.
         */
        getfont() {
          return this.span.style.font;
        }
        /**
         * Set the font string for the font.
         *
         * @param fontstr the new font string
         * @returns The Font object, to allow chaining.
         */
        setfont(fontstr) {
          this.span.style.font = fontstr;
          return this;
        }
        /**
         * Increase the font size of the font by one pixel.
         *
         * @returns The Font object, to allow chaining.
         */
        incFontSize() {
          this.span.style.fontSize = `${parseInt(this.span.style.fontSize) + 1}px`;
          return this;
        }
        /**
         * Decrease the font size of the font by one pixel.
         *
         * @returns The Font object, to allow chaining.
         */
        decFontSize() {
          this.span.style.fontSize = `${parseInt(this.span.style.fontSize) - 1}px`;
          return this;
        }
        /**
         * Given an element, returns the CSS font string for that element.
         *
         * @param elem - The element to get the font string for.
         * @returns The CSS font string, or 'normal 12px sans-serif' if no font style is set.
         */
        getFontString(elem) {
          const style = window.getComputedStyle(elem);
          let elementFont = style.getPropertyValue("font");
          if (elementFont) {
            return elementFont;
          }
          const fontStyle = style.getPropertyValue("font-style");
          const fontVariant = style.getPropertyValue("font-variant");
          const fontWeight = style.getPropertyValue("font-weight");
          const fontSize = style.getPropertyValue("font-size");
          const fontFamily = style.getPropertyValue("font-family");
          elementFont = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`.replace(/ +/g, " ").trim();
          return elementFont ? elementFont : "normal 12px sans-serif";
        }
      };
    }
  });

  // squeezeboxrpc/js/squeezeboxrpc.js
  var require_squeezeboxrpc = __commonJS({
    "squeezeboxrpc/js/squeezeboxrpc.js"(exports) {
      "use strict";
      init_package();
      init_textImage();
      fetch("widgets/squeezeboxrpc/i18n/translations.json").then((res) => __async(exports, null, function* () {
        const i18n = yield res.json();
        $.extend(true, systemDictionary, i18n);
      }));
      vis.binds["squeezeboxrpc"] = {
        version,
        showVersion: function() {
          if (vis.binds["squeezeboxrpc"].version) {
            console.log(`Version squeezeboxrpc: ${vis.binds["squeezeboxrpc"].version}`);
            vis.binds["squeezeboxrpc"].version = null;
          }
        },
        svg: {
          stop: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m5.7393 5.4537h14.98c0.44743 0.086371 0.23662 0.63202 0.28562 0.95661v14.309c-0.08637 0.44743-0.63202 0.23662-0.95661 0.28562h-14.309c-0.44743-0.08637-0.23662-0.63202-0.28562-0.95661v-14.309c-0.00412-0.15314 0.13248-0.28973 0.28562-0.28562z"/></g></svg>',
          fwd: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path d="m5.3759 18.805c9.23e-5 -3.7545-1.846e-4 -7.509 1.385e-4 -11.263 0.13348-0.79848 1.117-1.0848 1.7334-0.63234 2.8067 1.9183 5.6203 3.8271 8.4226 5.7514 0.52184 0.44634 0.18084 1.2199-0.36377 1.4624-2.7112 1.8495-5.4224 3.6989-8.1336 5.5484-0.68912 0.29151-1.546-0.09983-1.6587-0.86625z"/><path d="m10.668 18.805c8.7e-5 -3.7545-1.73e-4 -7.509 1.3e-4 -11.263 0.13345-0.79849 1.1171-1.0848 1.7334-0.63234 2.8067 1.9183 5.6203 3.8271 8.4226 5.7514 0.52184 0.44634 0.18084 1.2199-0.36377 1.4624-2.7112 1.8495-5.4224 3.6989-8.1336 5.5484-0.68912 0.2915-1.546-0.09982-1.6587-0.86625z"/><path d="m18.876 5.3572c0.68238 0.014305 1.3705-0.02913 2.0492 0.022654 0.31228 0.23669 0.12538 0.69262 0.1764 1.0359v14.396c-0.08733 0.45287-0.63952 0.23962-0.96802 0.28916-0.45618-0.01348-0.91782 0.028-1.3703-0.02265-0.31228-0.23669-0.12538-0.69262-0.1764-1.0359v-14.396c-0.0042-0.15504 0.13412-0.29333 0.28916-0.28916z" stroke-linecap="round"/></g></svg>',
          pause: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m5.6838 5.396h5.8304c0.45073 0.086991 0.23839 0.63664 0.28773 0.96362v14.415c-0.08699 0.45073-0.63664 0.23839-0.96362 0.28773h-5.1545c-0.45073-0.08699-0.23839-0.63664-0.28773-0.96362v-14.415c-0.00415-0.15428 0.13346-0.29188 0.28773-0.28773z"/><path d="m14.944 5.396h5.8304c0.45073 0.086991 0.23839 0.63664 0.28773 0.96362v14.415c-0.08699 0.45073-0.63664 0.23839-0.96362 0.28773h-5.1545c-0.45073-0.08699-0.23839-0.63664-0.28773-0.96362v-14.415c-0.0041-0.15428 0.13346-0.29188 0.28773-0.28773z"/></g></svg>',
          play: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><g transform="translate(0 -270.54)"><path d="m5.2917 292.21c1.638e-4 -5.7717-3.275e-4 -11.543 2.455e-4 -17.315 0.26319-1.0382 1.4726-1.5611 2.4514-1.1989 0.80816 0.23695 1.4691 0.80297 2.2081 1.194 4.3854 2.6267 8.7811 5.2375 13.16 7.8742 0.79505 0.54047 0.45033 1.7439-0.34988 2.0757-4.8532 2.9006-9.7064 5.8011-14.56 8.7017-1.0328 0.36658-2.332 0.0381-2.8269-1.0022-0.045938-0.10342-0.084738-0.21463-0.083483-0.32941z"/></g></g></svg>',
          shuffle0: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m5.6162 5.4125h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01588 1.4565-0.21946 0.23741-0.60948 0.076434-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14577-0.59069-0.20276-0.87689 0.010353-0.485-0.020872-0.97413 0.015885-1.4565 0.030072-0.073761 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.813 9.8261h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01589 1.4565-0.21946 0.23741-0.60948 0.07644-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.01035-0.485-0.02087-0.97413 0.01589-1.4565 0.03007-0.073761 0.10708-0.12497 0.18688-0.12369z"/><path d="m5.6193 14.195h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01588 1.4565-0.21946 0.23741-0.60948 0.07643-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.010353-0.485-0.020872-0.97413 0.015885-1.4565 0.030072-0.07376 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.845 18.582h9.9891c0.35652 0.11121 0.14576 0.59069 0.20276 0.87689-0.01035 0.485 0.02087 0.97413-0.01589 1.4565-0.21946 0.23741-0.60948 0.07644-0.90595 0.12369h-9.27c-0.35652-0.11121-0.14576-0.59069-0.20276-0.87689 0.01035-0.485-0.02087-0.97413 0.01589-1.4565 0.03007-0.07376 0.10708-0.12497 0.18688-0.12369z"/></g></svg>',
          shuffle2: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-width=".3"><path d="m10.813 18.548c-0.35617 0.11095-0.14564 0.58998-0.20257 0.87583 0.01028 0.48528-0.02076 0.97467 0.01586 1.4573 0.21919 0.2371 0.60875 0.07634 0.90486 0.12353h2.8258c-0.05537-0.30204-0.09712-0.61075-0.07338-0.93127v-1.5254h-3.4706z"/><path d="m15.193 15.235c-0.44809 0.08695-0.23653 0.63372-0.28577 0.95902v4.5089c0.08728 0.44757 0.63383 0.23594 0.95902 0.28525h4.836c0.44765-0.08685 0.2359-0.63348 0.28525-0.95851v-4.5089c-0.08652-0.44816-0.63337-0.23649-0.95851-0.28577h-4.836zm0.56741 0.59324c1.4869 0.0118 2.9784-0.0236 4.4623 0.0177 0.25792 0.21902 0.09046 0.62233 0.13842 0.92678-0.01179 1.1608 0.02362 2.3264-0.01778 3.4843-0.21938 0.25783-0.62259 0.09051-0.92722 0.13842-1.2474-0.01185-2.4996 0.0237-3.7441-0.01778-0.25714-0.21976-0.09015-0.6226-0.13798-0.92722 0.01173-1.1608-0.02351-2.3263 0.0177-3.4842 0.03349-0.08241 0.11959-0.13946 0.20864-0.13798z"/><path d="m5.6177 5.386h9.9891c0.35637 0.11098 0.14585 0.59007 0.20276 0.87601-0.0103 0.48529 0.0208 0.97471-0.01588 1.4574-0.21917 0.23733-0.60884 0.076486-0.90501 0.12369h-9.2709c-0.35638-0.11098-0.14586-0.59007-0.20276-0.87601 0.010298-0.48529-0.020796-0.97471 0.015885-1.4574 0.030072-0.073761 0.10708-0.12497 0.18687-0.12369z"/><path d="m10.813 9.7732h9.9891c0.35637 0.11098 0.14585 0.59006 0.20276 0.87601-0.0103 0.4853 0.0208 0.97471-0.01589 1.4574-0.21917 0.23733-0.60884 0.07648-0.90501 0.12369h-9.2709c-0.35637-0.11098-0.14585-0.59006-0.20276-0.87601 0.0103-0.4853-0.0208-0.97471 0.01589-1.4574 0.03007-0.073761 0.10708-0.12497 0.18688-0.12369z"/><path d="m5.6177 14.16c-0.35682 0.11055-0.14617 0.5899-0.20309 0.87583 0.010332 0.48531-0.020862 0.97475 0.015936 1.4574 0.21915 0.23774 0.609 0.07674 0.90529 0.12397h7.9475c0.01599-0.59386-0.03233-1.1941 0.0247-1.7839 0.23585-0.33075 0.70254-0.14135 1.053-0.19167 0.34447 0.08741 0.60141-0.07206 0.38911-0.42246-0.39444-0.12791-0.84703-0.02699-1.2655-0.05916h-8.867z"/></g></svg>',
          repeat0: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path transform="scale(.26458)" d="m35.473 20.621c-8.2281 0-14.852 6.6235-14.852 14.852v29.055c0 8.2281 6.6235 14.852 14.852 14.852h29.055c8.2281 0 14.852-6.6235 14.852-14.852v-29.055c0-8.2281-6.6235-14.852-14.852-14.852h-4.0195v9.6641c0 0.05754-0.01898 0.1113-0.02344 0.16797 5.108 0.40503 9.1016 4.6456 9.1016 9.8613v19.371c0 5.4854-4.415 9.9004-9.9004 9.9004h-19.371c-5.4854 0-9.9004-4.415-9.9004-9.9004v-19.371c0-5.4854 4.415-9.9004 9.9004-9.9004h0.21094c-0.0026-0.04363-0.01758-0.08477-0.01758-0.12891v-9.6641z" fill="#fff" stroke-linecap="round"/><path d="m10.111 9.4128v-5.3598c-0.0082 0.018122-0.0021-0.17387 0.24672-0.34879 0.24874-0.17491 0.65793 0 0.65793 0l4.6078 2.7541s0.1702 0.098349 0.16971 0.29612c-4.97e-4 0.20056-0.1784 0.32361-0.1784 0.32361l-4.5991 2.7487s-0.39816 0.13052-0.65793-0.063572c-0.25976-0.19409-0.24672-0.35035-0.24672-0.35035z" /></g></svg>',
          repeat1: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-width=".3"><path transform="scale(.26458)" d="m35.471 20.607c-8.2281 0-14.852 6.6235-14.852 14.852v29.055c0 8.2281 6.6235 14.852 14.852 14.852h15.297c-0.099283-0.23342-0.20508-0.4639-0.28516-0.70898-1.0314-3.157-0.36829-6.37 1.3789-9.084h-11.549c-5.4854 0-9.9004-4.415-9.9004-9.9004v-19.371c0-5.4853 4.415-9.9004 9.9004-9.9004h0.21094c-0.0026-0.04362-0.01758-0.08476-0.01758-0.12891v-9.6641zm25.035 0v9.6641c0 0.05752-0.0189 0.11131-0.02344 0.16797 1.6304 0.12928 3.1454 0.65289 4.4551 1.4707v-4.7422h10.172l-0.17773 3.0039v0.0078c0.0017 0.81652 0.51993 2.0016 1.6992 3.5879 0.75387 1.014 1.7283 2.1484 2.7461 3.3945v-1.7031c0-8.2281-6.6235-14.852-14.852-14.852zm14.426 28.418-0.0078 23.127c0.02228 1.1774-0.15778 2.3265-0.49805 3.4277 3.0352-2.7155 4.9512-6.6543 4.9512-11.066v-4.1504c-0.56305 0.11278-1.2016 0.10116-1.877-0.18359-1.5706-0.66221-1.9257-2.0105-2.0215-2.7676-0.09574-0.75705 3e-3 -1.3469 0.18359-1.9414 0.08357-0.27565 0.31768-3.3953-0.38281-5.7285-0.08795-0.29287-0.24795-0.45038-0.34766-0.7168z" fill="#fff" stroke="#fffffb" stroke-linecap="round"/><path d="m10.111 9.4094v-5.3598c-0.0082 0.01812-0.0021-0.17387 0.24672-0.34879 0.24874-0.17491 0.65793 0 0.65793 0l4.6078 2.7541s0.1702 0.09835 0.16971 0.29612c-5.03e-4 0.20056-0.1784 0.32361-0.1784 0.32361l-4.5991 2.7487s-0.39816 0.13052-0.65793-0.06357c-0.25976-0.19409-0.24672-0.35035-0.24672-0.35035z" /><path d="m19.028 7.9826h-1.0564v9.5915c-0.58411-0.2504-1.34-0.25388-2.0856 0.04816-1.3358 0.54165-2.1316 1.8592-1.7778 2.9424 0.35402 1.0835 1.7238 1.5224 3.0594 0.98077 1.1345-0.45993 1.8767-1.4796 1.8585-2.4399l0.0018-7.8441c1.842 0.32346 1.9681 2.9181 1.7475 3.6457-0.08378 0.27574 0.06375 0.48221 0.34217 0 1.9862-3.4426-2.0896-4.9615-2.0896-6.9244z" /></g></svg>',
          rew: '<svg version="1.1" viewBox="0 0 26.458 26.458" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" stroke="#ffffff" stroke-miterlimit="4.1" stroke-width=".3"><path d="m21.082 18.805c-9.3e-5 -3.7545 1.87e-4 -7.509-1.4e-4 -11.263-0.13349-0.79848-1.117-1.0848-1.7334-0.63234-2.8067 1.9183-5.6203 3.8271-8.4226 5.7514-0.52184 0.44634-0.18084 1.2199 0.36377 1.4624 2.7112 1.8495 5.4224 3.6989 8.1336 5.5484 0.68912 0.2915 1.546-0.09983 1.6587-0.86625z"/><path d="m15.791 18.805c-8.7e-5 -3.7545 1.73e-4 -7.509-1.3e-4 -11.263-0.13345-0.79849-1.1171-1.0848-1.7334-0.63234-2.8067 1.9183-5.6203 3.8271-8.4226 5.7514-0.52184 0.44634-0.18084 1.2199 0.36377 1.4624 2.7112 1.8495 5.4224 3.6989 8.1336 5.5484 0.68912 0.2915 1.546-0.09982 1.6587-0.86625z"/><path d="m7.5828 5.3572c-0.68239 0.014305-1.3705-0.02913-2.0492 0.022654-0.31228 0.23669-0.12538 0.69262-0.1764 1.0359v14.396c0.087332 0.45287 0.63952 0.23962 0.96802 0.28916 0.45618-0.01348 0.91782 0.028 1.3703-0.02265 0.31228-0.23669 0.12538-0.69262 0.1764-1.0359v-14.396c0.00417-0.15504-0.13412-0.29333-0.28916-0.28916z" stroke-linecap="round"/></g></svg>'
        },
        playerattributes: [
          "Playername",
          "PlayerID",
          "Connected",
          "IP",
          "Power",
          "Mode",
          "Time",
          "Rate",
          "SyncSlaves",
          "SyncMaster",
          "Volume",
          "PlaylistRepeat",
          "PlaylistShuffle",
          "Remote",
          "Playlist",
          "PlaylistCurrentIndex",
          "state",
          "Duration",
          "Bitrate",
          "Album",
          "ArtworkUrl",
          "Genre",
          "Type",
          "Title",
          "Artist",
          "Albumartist",
          "Trackartist",
          "Band",
          "Url",
          "RadioName"
        ],
        favorites: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].favorites.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            data.functionname = "favorites";
            let redrawinspectwidgets = false;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = { self: this, widgetID, view, data, style };
            const key = `${ainstance[0]}.${ainstance[1]}.Favorites.*`;
            vis.conn.gettingStates = 0;
            vis.conn.getStates(
              key,
              function(err, obj) {
                let favorites = this.getFavorites(obj, ainstance);
                favorites = data.viewindexcheck = this.filterFavorites(favorites);
                const editmodehelper = data.editmodehelper;
                const picWidth = data.picWidth;
                const picHeight = data.picHeight;
                const opacity = vis.editMode && editmodehelper ? 1 : data.opacity;
                const borderwidth = data.borderwidth;
                const borderstyle = data.borderstyle;
                const bordercolornormal = data.bordercolornormal;
                const bordercoloractive = data.bordercoloractive;
                const borderradius = data.borderradius;
                const buttonmargin = data.buttonmargin || "0px";
                if (!data.viewindex || data.viewindex.trim() == "") {
                  data.viewindex = this.getViewindex(favorites).join(", ");
                }
                if (vis.editMode && data.bCount != Math.min(favorites.length, data.viewindex.split(",").length)) {
                  data.bCount = Math.min(favorites.length, data.viewindex.split(",").length);
                  redrawinspectwidgets = true;
                }
                let text = "";
                text += "<style>\n";
                text += `#${widgetID} div {
`;
                text += "     display: inline-block; \n";
                text += "}\n";
                text += `#${widgetID} div div {
`;
                text += "     position: relative; \n";
                text += `     margin: 0px ${buttonmargin} ${buttonmargin} 0px; 
`;
                text += "}\n";
                text += `#${widgetID} input[type="radio"] {
`;
                text += "    display: none;\n";
                text += "}\n";
                text += `#${widgetID} img {
`;
                text += `    opacity: ${opacity};
`;
                text += `    width: ${picWidth}px;
`;
                text += `    height: ${picHeight}px;
`;
                text += `    border: ${borderwidth} ${borderstyle} ${bordercolornormal};
`;
                text += `    border-radius: ${borderradius};
`;
                text += "}\n";
                text += `#${widgetID} canvas {
`;
                text += `    opacity: ${opacity};
`;
                text += `    width: ${picWidth}px;
`;
                text += `    height: ${picHeight}px;
`;
                text += `    border: ${borderwidth} ${borderstyle} ${bordercolornormal};
`;
                text += `    border-radius: ${borderradius};
`;
                text += "}\n";
                text += `#${widgetID} img:active {
`;
                text += "    transform: scale(0.9, 0.9);\n";
                text += "    opacity: 1;\n";
                text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
                text += `    border-radius: ${borderradius};
`;
                text += "}\n";
                text += `#${widgetID} canvas:active {
`;
                text += "    transform: scale(0.9, 0.9);\n";
                text += "    opacity: 1;\n";
                text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
                text += `    border-radius: ${borderradius};
`;
                text += "}\n";
                text += `#${widgetID} input[type="radio"]:checked + label img {
`;
                text += "    opacity: 1;\n";
                text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
                text += `    border-radius: ${borderradius};
`;
                text += "}\n";
                text += `#${widgetID} input[type="radio"]:checked + label canvas {
`;
                text += "    opacity: 1;\n";
                text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
                text += `    border-radius: ${borderradius};
`;
                text += "}\n";
                text += "</style>\n";
                text += `<div id="${widgetID}container">`;
                const viewindex = data.viewindex.split(", ");
                for (let i = 0; i < viewindex.length; i++) {
                  const favorite = this.findById(favorites, viewindex[i]);
                  text += "  <div>";
                  text += `    <input type="radio" id="${widgetID}${favorite.id}" name="${widgetID}" value="${favorite.id}" >`;
                  text += `    <label for="${widgetID}${favorite.id}">`;
                  text += "      <span>";
                  let favimage = favorite.image || "";
                  let favtext = favorite.id || "";
                  let attrimage = data[`buttonsImage${i + 1}`] || "";
                  let attrtext = data[`buttonsText${i + 1}`] || "";
                  favimage = favimage.trim();
                  favtext = favtext.trim();
                  attrimage = attrimage.trim();
                  attrtext = attrtext.trim();
                  const buttonsImage = attrimage || favimage;
                  if (!attrtext && buttonsImage) {
                    text += `        <img src="${buttonsImage}">`;
                  }
                  text += "      </span>";
                  text += "    </label>";
                  if (vis.editMode && editmodehelper) {
                    text += `<div style="position: absolute;top: 0;right: 0;background-color: black;color: white;border-width: 1px;border-color: white;border-style: solid;font-size: xx-small;padding: 1px;">${viewindex[i]}</div>`;
                  }
                  text += "  </div>";
                }
                text += "</div>";
                $(`#${widgetID}`).html(text);
                const spans = $(`#${widgetID} span`);
                const font = new Font($(`#${widgetID}`));
                const opt = {};
                opt.style = window.getComputedStyle($(`#${widgetID}`)[0], null);
                opt.backgroundcolor = data.buttonbkcolor;
                for (let i = 0; i < viewindex.length; i++) {
                  const favorite = this.findById(favorites, viewindex[i]);
                  let favimage = favorite.image || "";
                  let favtext = `${favorite.id || ""}(${i})`;
                  let attrimage = data[`buttonsImage${i + 1}`] || "";
                  let attrtext = data[`buttonsText${i + 1}`] || "";
                  favimage = favimage.trim();
                  favtext = favtext.trim();
                  attrimage = attrimage.trim();
                  attrtext = attrtext.trim();
                  const buttonsImage = attrimage || favimage;
                  const buttonsText = attrtext || favtext;
                  if (attrtext || !buttonsImage) {
                    $(spans[i]).append(createTextImage(buttonsText, font, picWidth, picHeight, opt));
                  }
                }
                const favbtns = $(`input[name=${widgetID}]`);
                favbtns.off("change.favorite").on("change.favorite", fdata, function(event) {
                  const fdata2 = event.data;
                  const data2 = fdata2.data;
                  const favorite = this.value;
                  const playername = vis.binds["squeezeboxrpc"].getPlayerName(data2.widgetPlayer);
                  const state = `${ainstance[0]}.${ainstance[1]}.Players.${playername}.cmdPlayFavorite`;
                  vis.setValue(state, favorite);
                });
                if (vis.editMode && redrawinspectwidgets) {
                  vis.binds["squeezeboxrpc"].redrawInspectWidgets(view);
                }
              }.bind(this)
            );
          },
          getFavorites: function(datapoints, ainstance) {
            const regex = new RegExp(`^${ainstance[0]}\\.${ainstance[1]}\\.Favorites`, "");
            return Object.keys(datapoints).reduce(
              function(acc, cur) {
                if (regex.test(cur)) {
                  const key = cur.split(".")[3];
                  const name = cur.split(".")[4];
                  if (!acc[key]) {
                    acc[key] = {};
                  }
                  acc[key][name] = this[cur].val;
                }
                return acc;
              }.bind(datapoints),
              []
            );
          },
          filterFavorites: function(favorites) {
            favorites = Object.values(favorites);
            return favorites.filter(function(cur) {
              return cur.isaudio === 1;
            });
          },
          findById: function(favorites, id) {
            return favorites.find(
              function(cur) {
                return cur.id.trim() == this.trim();
              }.bind(id)
            );
          },
          getViewindex: function(favorites) {
            return favorites.map((cur) => cur.id);
          },
          checkViewindexExist: function(viewindex, favorites) {
            return viewindex.map(function(item) {
              return favorites.find((el) => el.id == item) ? item : "0";
            });
          }
        },
        players: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].players.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            data.functionname = "players";
            vis.conn._socket.emit(
              "getObjects",
              function(err, obj) {
                let redrawinspectwidgets = false;
                if (data.ainstance) {
                  data.ainstance = data.ainstance.split(".").slice(0, 2).join(".");
                } else {
                  data.ainstance = "";
                }
                const ainstance = data.ainstance.split(".");
                if (!ainstance || ainstance[0] != "squeezeboxrpc") {
                  $(`#${widgetID}`).html("Please select an instance");
                  return;
                }
                const players = data.viewindexcheck = this.getPlayers(obj, ainstance);
                const editmodehelper = data.editmodehelper;
                const picWidth = data.picWidth;
                const picHeight = data.picHeight;
                const opacity = vis.editMode && editmodehelper ? 1 : data.opacity;
                const borderwidth = data.borderwidth;
                const borderstyle = data.borderstyle;
                const bordercolornormal = data.bordercolornormal;
                const bordercoloractive = data.bordercoloractive;
                const borderradius = data.borderradius;
                const buttonmargin = data.buttonmargin || "0px";
                if (!data.viewindex || data.viewindex.trim() == "") {
                  data.viewindex = this.getViewindex(players).join(", ");
                }
                data.defaultPlayer = data.defaultPlayer || Object.keys(players)[0] || "0";
                if (vis.editMode && data.bCount != Math.min(players.length, data.viewindex.split(",").length)) {
                  data.bCount = Math.min(players.length, data.viewindex.split(",").length);
                  redrawinspectwidgets = true;
                }
                const viewindex = data.viewindex.split(", ");
                if (data.formattype == "formatselect") {
                  let text = "";
                  let option = "";
                  option += '<option value=""></option>';
                  for (let i = 0; i < viewindex.length; i++) {
                    let buttonsText = data[`buttonsText${viewindex[i] + 1}`] || "";
                    buttonsText = buttonsText.trim() != "" ? buttonsText : players[viewindex[i]];
                    if (vis.editMode && editmodehelper) {
                      buttonsText += ` [${viewindex[i]}]`;
                    }
                    option += `<option value="${players[viewindex[i]]}">${buttonsText}</option>`;
                  }
                  text += `<select type="text" id="${widgetID}select">${option}</select>`;
                  $(`#${widgetID}`).html(text);
                }
                if (data.formattype == "formatbutton") {
                  let text = "";
                  text += "<style>\n";
                  text += `#${widgetID} div {
`;
                  text += "     display: inline-block; \n";
                  text += "}\n";
                  text += `#${widgetID} div div {
`;
                  text += "     position: relative; \n";
                  text += `     margin: 0px ${buttonmargin} ${buttonmargin} 0px; 
`;
                  text += "}\n";
                  text += `#${widgetID} input[type="radio"] {
`;
                  text += "    display: none;\n";
                  text += "}\n";
                  text += `#${widgetID} img {
`;
                  text += `    opacity: ${opacity};
`;
                  text += `    width: ${picWidth}px;
`;
                  text += `    height: ${picHeight}px;
`;
                  text += `    border: ${borderwidth} ${borderstyle} ${bordercolornormal};
`;
                  text += `    border-radius: ${borderradius};
`;
                  text += "}\n";
                  text += `#${widgetID} canvas {
`;
                  text += `    opacity: ${opacity};
`;
                  text += `    width: ${picWidth}px;
`;
                  text += `    height: ${picHeight}px;
`;
                  text += `    border: ${borderwidth} ${borderstyle} ${bordercolornormal};
`;
                  text += `    border-radius: ${borderradius};
`;
                  text += "}\n";
                  text += `#${widgetID} img:active {
`;
                  text += "    transform: scale(0.9, 0.9);\n";
                  text += "    opacity: 1;\n";
                  text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
                  text += `    border-radius: ${borderradius};
`;
                  text += "}\n";
                  text += `#${widgetID} canvas:active {
`;
                  text += "    transform: scale(0.9, 0.9);\n";
                  text += "    opacity: 1;\n";
                  text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
                  text += `    border-radius: ${borderradius};
`;
                  text += "}\n";
                  text += `#${widgetID} input[type="radio"]:checked + label img {
`;
                  text += "    opacity: 1;\n";
                  text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
                  text += `    border-radius: ${borderradius};
`;
                  text += "}\n";
                  text += `#${widgetID} input[type="radio"]:checked + label canvas {
`;
                  text += "    opacity: 1;\n";
                  text += `    border: ${borderwidth} ${borderstyle} ${bordercoloractive};
`;
                  text += `    border-radius: ${borderradius};
`;
                  text += "}\n";
                  text += "</style>\n";
                  text += `<div id="${widgetID}container" >`;
                  for (let i = 0; i < viewindex.length; i++) {
                    text += "  <div >";
                    text += `    <input type="radio" id="${widgetID}${players[viewindex[i]]}" name="${widgetID}" value="${players[viewindex[i]]}" ${viewindex[i] == data.defaultPlayer ? "checked" : ""}>`;
                    text += `    <label for="${widgetID}${players[viewindex[i]]}">`;
                    text += "      <span>";
                    const buttonsImage = data[`buttonsImage${parseInt(viewindex[i]) + 1}`] || "";
                    if (buttonsImage.trim() != "") {
                      text += `        <img src="${data[`buttonsImage${parseInt(viewindex[i]) + 1}`]}">`;
                    }
                    text += "      </span>";
                    text += "    </label>";
                    if (vis.editMode && editmodehelper) {
                      text += `<div style="position: absolute;top: 0;right: 0;background-color: black;color: white;border-width: 1px;border-color: white;border-style: solid;font-size: xx-small;padding: 1px;margin:0px;">${viewindex[i]}</div>`;
                    }
                    text += "  </div>";
                  }
                  text += "</div>";
                  $(`#${widgetID}`).html(text);
                  const spans = $(`#${widgetID} span`);
                  const font = new Font($(`#${widgetID}`));
                  const opt = {};
                  opt.wrapCamelCase = data.wrapcamelcase;
                  opt.style = window.getComputedStyle($(`#${widgetID}`)[0], null);
                  opt.backgroundcolor = data.buttonbkcolor;
                  for (let i = 0; i < viewindex.length; i++) {
                    const buttonsImage = data[`buttonsImage${parseInt(viewindex[i]) + 1}`] || "";
                    let buttonsText = data[`buttonsText${parseInt(viewindex[i]) + 1}`] || "";
                    buttonsText = buttonsText.trim() != "" ? buttonsText : players[viewindex[i]];
                    if (buttonsImage.trim() == "") {
                      $(spans[i]).append(createTextImage(buttonsText, font, picWidth, picHeight, opt));
                    }
                  }
                }
                if (vis.editMode && redrawinspectwidgets) {
                  vis.binds["squeezeboxrpc"].redrawInspectWidgets(view);
                }
                $(`#${widgetID}`).trigger("playerschanged");
              }.bind(this)
            );
          },
          getViewindex: function(players) {
            return Object.keys(players);
          },
          checkViewindexExist: function(viewindex, players) {
            return viewindex.map(function(item) {
              return item < players.length ? item : 0;
            });
          },
          getPlayers: function(datapoints, ainstance) {
            const regex = new RegExp(`^${ainstance[0]}\\.${ainstance[1]}\\.Players`, "gm");
            return Object.keys(datapoints).reduce(function(acc, cur) {
              if (regex.test(cur)) {
                const key = cur.split(".")[3];
                if (acc.indexOf(key) === -1) {
                  acc.push(key);
                }
              }
              return acc;
            }, []);
          }
        },
        buttonplay: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].buttonplay.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = { self: this, widgetID, view, data, style };
            vis.binds["squeezeboxrpc"].setPlayersChanged(
              $div,
              data.widgetPlayer,
              fdata,
              this.onChange.bind(fdata),
              function() {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                  boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.state`);
                }
                return boundstates;
              }
            );
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
            let text = "";
            text += "<style> \n";
            text += `#${widgetID} div {
`;
            text += "   display: inline-block; \n";
            text += "   width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} input[type="submit"] { 
`;
            text += "  display: none; \n";
            text += "} \n";
            text += `#${widgetID} img { 
`;
            text += "  width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} img:active { 
`;
            text += "  transform: scale(0.9, 0.9); \n";
            text += "} \n";
            text += `#${widgetID} svg { 
`;
            text += "  width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} svg:active { 
`;
            text += "  transform: scale(0.9, 0.9); \n";
            text += "  transform-origin: 50% 50%; \n";
            text += "} \n";
            text += "</style> \n";
            text += '<div class="btn"> \n';
            text += "  <div> \n";
            text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="" >`;
            text += "    <span> \n";
            text += '      <img src=""> \n';
            text += "    </span> \n";
            text += "  </div> \n";
            text += "</div> \n";
            $(`#${widgetID}`).html(text);
            this.setState(fdata);
          },
          onClick: function(event) {
            const data = event.data.data;
            const widgetID = event.data.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.state`;
            let state = $(`input[name=${widgetID}]`).val();
            state = state == 1 ? 0 : 1;
            vis.setValue(stateid, state);
          },
          onChange: function() {
            this.self.setState(this);
          },
          setState: function(fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const svg = vis.binds["squeezeboxrpc"].svg;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].buttonplay.setState(fdata);
              }, 100);
            }
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.state`;
            const state = vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0 ? parseInt(vis.states[`${stateid}.val`]) : 2;
            const imagepause = data.imagepause || "";
            const imageplay = data.imageplay || "";
            const imagestop = data.imagepause || "";
            const svgfill = data.fillcolor || "#ffffff";
            const svgstroke = data.strokecolor || "#ffffff";
            const svgstrokeWidth = data.strokewidth || "0.3";
            let image = "";
            if (state == 0) {
              image = imageplay || svg.play;
            }
            if (state == 1) {
              image = imagepause || svg.pause;
            }
            if (state == 2) {
              image = imagestop || svg.play;
            }
            $(`#${widgetID} input`).val(state);
            $(`#${widgetID} img`).off("click.play", this.onClick);
            $(`#${widgetID} svg`).off("click.play", this.onClick);
            if (image.startsWith("<svg")) {
              $(`#${widgetID} span`).html(image);
              const $g = $(`#${widgetID} svg > g`);
              if ($g.length) {
                $g.attr("fill", svgfill);
                $g.attr("stroke", svgstroke);
                $g.attr("stroke-width", svgstrokeWidth);
              }
            } else {
              $(`#${widgetID} img`).attr("src", image);
            }
            $(`#${widgetID} img`).on("click.play", fdata, this.onClick);
            $(`#${widgetID} svg`).on("click.play", fdata, this.onClick);
          }
        },
        buttonfwd: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].buttonfwd.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const svgfill = data.fillcolor || "#ffffff";
            const svgstroke = data.strokecolor || "#ffffff";
            const svgstrokeWidth = data.strokewidth || "0.3";
            const svg = vis.binds["squeezeboxrpc"].svg;
            let text = "";
            text += "<style> \n";
            text += `#${widgetID} div {
`;
            text += "   display: inline-block; \n";
            text += "   width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} input[type="submit"] { 
`;
            text += "  display: none; \n";
            text += "} \n";
            text += `#${widgetID} img { 
`;
            text += "  width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} img:active { 
`;
            text += "  transform: scale(0.9, 0.9); \n";
            text += "} \n";
            text += `#${widgetID} svg { 
`;
            text += "  width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} svg:active { 
`;
            text += "  transform: scale(0.9, 0.9); \n";
            text += "  transform-origin: 50% 50%; \n";
            text += "} \n";
            text += "</style> \n";
            text += '<div class="btn"> \n';
            text += "  <div> \n";
            text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="fwd" >`;
            text += "    <span> \n";
            text += '      <img src="widgets/squeezeboxrpc/img/fwd.png"> \n';
            text += "    </span> \n";
            text += "  </div> \n";
            text += "</div> \n";
            $(`#${widgetID}`).html(text);
            const image = data.imagefwd || svg.fwd;
            if (image.startsWith("<svg")) {
              $(`#${widgetID} span`).html(image);
              const $g = $(`#${widgetID} svg > g`);
              if ($g.length) {
                $g.attr("fill", svgfill);
                $g.attr("stroke", svgstroke);
                $g.attr("stroke-width", svgstrokeWidth);
              }
            } else {
              $(`#${widgetID} img`).attr("src", image);
            }
            $(`#${widgetID} img`).on(
              "click",
              { self: this, widgetID, view, data, style },
              this.onClick
            );
            $(`#${widgetID} svg`).on(
              "click",
              { self: this, widgetID, view, data, style },
              this.onClick
            );
          },
          onClick: function(event) {
            const data = event.data.data;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.btnForward`;
            const state = true;
            vis.setValue(stateid, state);
          }
        },
        buttonrew: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].buttonrew.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const svgfill = data.fillcolor || "#ffffff";
            const svgstroke = data.strokecolor || "#ffffff";
            const svgstrokeWidth = data.strokewidth || "0.3";
            const svg = vis.binds["squeezeboxrpc"].svg;
            let text = "";
            text += "<style> \n";
            text += `#${widgetID} div {
`;
            text += "   display: inline-block; \n";
            text += "   width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} input[type="submit"] { 
`;
            text += "  display: none; \n";
            text += "} \n";
            text += `#${widgetID} img { 
`;
            text += "  width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} img:active { 
`;
            text += "  transform: scale(0.9, 0.9); \n";
            text += "} \n";
            text += `#${widgetID} svg { 
`;
            text += "  width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} svg:active { 
`;
            text += "  transform: scale(0.9, 0.9); \n";
            text += "  transform-origin: 50% 50%; \n";
            text += "} \n";
            text += "</style> \n";
            text += '<div class="btn"> \n';
            text += "  <div> \n";
            text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="rew" >`;
            text += "    <span> \n";
            text += '      <img src="widgets/squeezeboxrpc/img/rew.svg"> \n';
            text += "    </span> \n";
            text += "  </div> \n";
            text += "</div> \n";
            $(`#${widgetID}`).html(text);
            const image = data.imagerew || svg.rew;
            if (image.startsWith("<svg")) {
              $(`#${widgetID} span`).html(image);
              const $g = $(`#${widgetID} svg > g`);
              if ($g.length) {
                $g.attr("fill", svgfill);
                $g.attr("stroke", svgstroke);
                $g.attr("stroke-width", svgstrokeWidth);
              }
            } else {
              $(`#${widgetID} img`).attr("src", image);
            }
            $(`#${widgetID} img`).on(
              "click",
              { self: this, widgetID, view, data, style },
              this.onClick
            );
            $(`#${widgetID} svg`).on(
              "click",
              { self: this, widgetID, view, data, style },
              this.onClick
            );
          },
          onClick: function(event) {
            const data = event.data.data;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.btnRewind`;
            const state = true;
            vis.setValue(stateid, state);
          }
        },
        buttonrepeat: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].buttonrepeat.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = { self: this, widgetID, view, data, style };
            vis.binds["squeezeboxrpc"].setPlayersChanged(
              $div,
              data.widgetPlayer,
              fdata,
              this.onChange.bind(fdata),
              function() {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                  boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.PlaylistRepeat`);
                }
                return boundstates;
              }
            );
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
            let text = "";
            text += "<style> \n";
            text += `#${widgetID} div {
`;
            text += "   display: inline-block; \n";
            text += "   width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} input[type="submit"] { 
`;
            text += "  display: none; \n";
            text += "} \n";
            text += `#${widgetID} img { 
`;
            text += "  width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} img:active { 
`;
            text += "  transform: scale(0.9, 0.9); \n";
            text += "} \n";
            text += `#${widgetID} svg { 
`;
            text += "  width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} svg:active { 
`;
            text += "  transform: scale(0.9, 0.9); \n";
            text += "  transform-origin: 50% 50%; \n";
            text += "} \n";
            text += "</style> \n";
            text += '<div class="btn"> \n';
            text += "  <div> \n";
            text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="" >`;
            text += "    <span> \n";
            text += '      <img src=""> \n';
            text += "    </span> \n";
            text += "  </div> \n";
            text += "</div> \n";
            $(`#${widgetID}`).html(text);
            this.setState({ self: this, widgetID, view, data, style });
          },
          onClick: function(event) {
            const data = event.data.data;
            const widgetID = event.data.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.PlaylistRepeat`;
            let state = $(`input[name=${widgetID}]`).val();
            state = state > 1 ? 0 : parseInt(state) + 1;
            vis.setValue(stateid, state);
          },
          onChange: function() {
            this.self.setState(this);
          },
          setState: function(fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const svg = vis.binds["squeezeboxrpc"].svg;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].buttonrepeat.setState(fdata);
              }, 100);
            }
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.PlaylistRepeat`;
            const state = vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0 ? parseInt(vis.states[`${stateid}.val`]) : 0;
            const imagerepeat0 = data.imagerepeat0 || "";
            const imagerepeat1 = data.imagerepeat1 || "";
            const imagerepeat2 = data.imagerepeat2 || "";
            const svgfill = data.fillcolor || "#ffffff";
            const svgstroke = data.strokecolor || "#ffffff";
            const svgstrokeWidth = data.strokewidth || "0.3";
            let image = "";
            if (state == 0) {
              image = imagerepeat0 || svg.repeat0;
            }
            if (state == 1) {
              image = imagerepeat1 || svg.repeat1;
            }
            if (state == 2) {
              image = imagerepeat2 || svg.repeat0;
            }
            $(`#${widgetID} input`).val(state);
            $(`#${widgetID} img`).off("click.repeat", this.onClick);
            $(`#${widgetID} svg`).off("click.repeat", this.onClick);
            if (image.startsWith("<svg")) {
              $(`#${widgetID} span`).html(image);
              const $g = $(`#${widgetID} svg > g`);
              if ($g.length) {
                $g.attr("fill", svgfill);
                $g.attr("stroke", svgstroke);
                $g.attr("stroke-width", svgstrokeWidth);
                if (state === 0) {
                  $g.attr("opacity", ".5");
                } else {
                  $g.attr("opacity", "1");
                }
              }
            } else {
              $(`#${widgetID} img`).attr("src", image);
            }
            $(`#${widgetID} img`).on("click.repeat", fdata, this.onClick);
            $(`#${widgetID} svg`).on("click.repeat", fdata, this.onClick);
          }
        },
        buttonshuffle: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].buttonshuffle.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            let text = "";
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = { self: this, widgetID, view, data, style };
            vis.binds["squeezeboxrpc"].setPlayersChanged(
              $div,
              data.widgetPlayer,
              fdata,
              this.onChange.bind(fdata),
              function() {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                  boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.PlaylistShuffle`);
                }
                return boundstates;
              }
            );
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
            text += "<style> \n";
            text += `#${widgetID} div {
`;
            text += "   display: inline-block; \n";
            text += "   width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} input[type="submit"] { 
`;
            text += "  display: none; \n";
            text += "} \n";
            text += `#${widgetID} img { 
`;
            text += "  width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} img:active { 
`;
            text += "  transform: scale(0.9, 0.9); \n";
            text += "} \n";
            text += `#${widgetID} svg { 
`;
            text += "  width:  100%; \n";
            text += "} \n";
            text += `#${widgetID} svg:active { 
`;
            text += "  transform: scale(0.9, 0.9); \n";
            text += "  transform-origin: 50% 50%; \n";
            text += "} \n";
            text += "</style> \n";
            text += '<div class="btn"> \n';
            text += "  <div> \n";
            text += `    <input type="submit" id="${widgetID}button" name="${widgetID}" value="" >`;
            text += "    <span> \n";
            text += '      <img src=""> \n';
            text += "    </span> \n";
            text += "  </div> \n";
            text += "</div> \n";
            $(`#${widgetID}`).html(text);
            this.setState({ self: this, widgetID, view, data, style });
          },
          onClick: function(event) {
            const data = event.data.data;
            const widgetID = event.data.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.PlaylistShuffle`;
            let state = $(`input[name=${widgetID}]`).val();
            state = state > 1 ? 0 : parseInt(state) + 1;
            vis.setValue(stateid, state);
          },
          onChange: function() {
            this.self.setState(this);
          },
          setState: function(fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const svg = vis.binds["squeezeboxrpc"].svg;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].buttonshuffle.setState(fdata);
              }, 100);
            }
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.PlaylistShuffle`;
            const state = vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0 ? parseInt(vis.states[`${stateid}.val`]) : 0;
            const imageshuffle0 = data.imageshuffle0 || "";
            const imageshuffle1 = data.imageshuffle1 || "";
            const imageshuffle2 = data.imageshuffle2 || "";
            const svgfill = data.fillcolor || "#ffffff";
            const svgstroke = data.strokecolor || "#ffffff";
            const svgstrokeWidth = data.strokewidth || "0.3";
            let image = "";
            if (state == 0) {
              image = imageshuffle0 || svg.shuffle0;
            }
            if (state == 1) {
              image = imageshuffle1 || svg.shuffle0;
            }
            if (state == 2) {
              image = imageshuffle2 || svg.shuffle2;
            }
            $(`#${widgetID} input`).val(state);
            $(`#${widgetID} img`).off("click.shuffle", this.onClick);
            $(`#${widgetID} svg`).off("click.shuffle", this.onClick);
            if (image.startsWith("<svg")) {
              $(`#${widgetID} span`).html(image);
              const $g = $(`#${widgetID} svg > g`);
              if ($g.length) {
                $g.attr("fill", svgfill);
                $g.attr("stroke", svgstroke);
                $g.attr("stroke-width", svgstrokeWidth);
                if (state === 0) {
                  $g.attr("opacity", ".5");
                } else {
                  $g.attr("opacity", "1");
                }
              }
            } else {
              $(`#${widgetID} img`).attr("src", image);
            }
            $(`#${widgetID} img`).on("click.shuffle", fdata, this.onClick);
            $(`#${widgetID} svg`).on("click.shuffle", fdata, this.onClick);
          }
        },
        volumebar: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].volumebar.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = {
              self: this,
              widgetID,
              view,
              data,
              style,
              ainstance
            };
            vis.binds["squeezeboxrpc"].setPlayersChanged(
              $div,
              data.widgetPlayer,
              fdata,
              this.onChange.bind(fdata),
              function() {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                  boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.Volume`);
                }
                return boundstates;
              }
            );
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
            const calctype = data.calctype || "segstep";
            const segments = data.segments || 11;
            const position = data.position || "vertical";
            let segheight, segwidth;
            if (position == "vertical") {
              segheight = data.segheight || "100%";
              segwidth = data.segwidth || "100%";
            } else {
              segheight = data.segheight || "100%";
              segwidth = data.segwidth || "20px";
            }
            const borderwidth = data.borderwidth || "1px";
            const bordercolornormal = data.bordercolornormal || "#909090";
            const bordercoloractive = data.bordercoloractive || "#87ceeb";
            const fillcolornormal = data.fillcolornormal || "#005000";
            const fillcoloractive = data.fillcoloractive || "#00ff00";
            const reverse = data.reverse || false;
            const margin = data.margin || "1px";
            data.calctype = calctype;
            data.segments = segments;
            data.position = position;
            data.segheight = segheight;
            data.segwidth = segwidth;
            data.borderwidth = borderwidth;
            data.bordercolornormal = bordercolornormal;
            data.bordercoloractive = bordercoloractive;
            data.fillcolornormal = fillcolornormal;
            data.fillcoloractive = fillcoloractive;
            data.reverse = reverse;
            data.margin = margin;
            let text = "";
            text += "<style> \n";
            text += `    #${widgetID} .volume { 
`;
            text += "        box-sizing: border-box; \n";
            text += "        display: inline-block; \n";
            text += "        font-size:0px; \n";
            text += "        width: 100%; \n";
            text += "        height: 100%; \n";
            text += "        overflow: visible; \n";
            if (position == "horizontal") {
              text += "        white-space: nowrap; \n";
            }
            text += "    } \n";
            text += `    #${widgetID} .level { 
`;
            text += "        box-sizing: border-box; \n";
            text += "        display: inline-block; \n";
            text += `        outline: ${borderwidth} solid ${bordercolornormal}; 
`;
            if (position == "horizontal") {
              text += `        height: calc(100% - ( 2 * ${margin} )); 
`;
              text += `        width: calc((100% / ${segments}) - ( 2 * ${margin} )); 
`;
            }
            if (position == "vertical") {
              text += `        height: calc((100% / ${segments}) - ( 2 * ${margin} )); 
`;
              text += `        width: calc(100% - ( 2 * ${margin} )); 
`;
            }
            text += `        background-color: ${fillcolornormal}; 
`;
            text += `        margin: ${margin};         
`;
            text += "    } \n";
            text += `    #${widgetID} .active { 
`;
            text += `        border-color: ${bordercoloractive}; 
`;
            text += `        background-color: ${fillcoloractive}; 
`;
            text += "    } \n";
            text += "</style> \n";
            text += '<div class="volume"> \n';
            for (let i = 0; i < segments; i++) {
              text += `    <div class="level" value="${i}"></div> 
`;
            }
            text += "</div> \n";
            $(`#${widgetID}`).html(text);
            $(`#${widgetID} div.volume`).on("click.volume", fdata, this.onClick);
            if (vis.editMode) {
              this.setState(fdata);
            }
            if (vis.editMode) {
              vis.inspectWidgets(view, view);
            }
          },
          onClick: function(event) {
            const offset = $(this).offset();
            const x = event.pageX - offset.left;
            const y = event.pageY - offset.top;
            const data = event.data.data;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.Volume`;
            let pos;
            let high;
            let segstep;
            let state;
            data.position == "horizontal" ? pos = x : pos = y;
            data.position == "horizontal" ? high = this.scrollWidth : high = this.scrollHeight;
            if (data.reverse) {
              pos = high - pos;
            }
            if (data.calctype == "exact") {
              segstep = high / data.segments;
              pos = pos - segstep < 0 ? 0 : pos - segstep;
              state = pos * 100 / (high - segstep);
            }
            if (data.calctype == "segstep") {
              const level = Math.floor(pos / (high / data.segments));
              state = Math.floor(100 / (data.segments - 1) * level);
            }
            vis.setValue(stateid, state);
          },
          onChange: function() {
            this.self.setState(this);
          },
          setState: function(fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const reverse = data.reverse;
            let level;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].volumebar.setState(fdata);
              }, 100);
            }
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.Volume`;
            let state = vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0 ? vis.states[`${stateid}.val`] : 0;
            if (vis.editMode) {
              state = 50;
            }
            if (data.calctype == "exact") {
              level = Math.ceil(state / (100 / (data.segments - 1))) + 1;
            }
            if (data.calctype == "segstep") {
              level = Math.round(state / (100 / (data.segments - 1))) + 1;
            }
            const selector = reverse ? `#${widgetID} div.volume > div.level:nth-last-child(-n+${level})` : `#${widgetID} div.volume > div.level:nth-child(-n+${level})`;
            $(`#${widgetID} div.volume > div.level`).removeClass("active");
            $(selector).addClass("active");
          }
        },
        syncgroup: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = { self: this, widgetID, view, data, style };
            vis.binds["squeezeboxrpc"].setPlayersChanged(
              $div,
              data.widgetPlayer,
              fdata,
              this.onChange.bind(fdata),
              function(fdata2) {
                const widgetID2 = fdata2.widgetID;
                const view2 = fdata2.view;
                const data2 = fdata2.data;
                const style2 = fdata2.style;
                const boundstates = [];
                const players2 = vis.binds["squeezeboxrpc"].getPlayerValues(data2.widgetPlayer);
                for (let i = 0; i < players2.length; i++) {
                  boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.PlayerID`);
                  boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.SyncMaster`);
                  boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players2[i]}.SyncSlaves`);
                }
                setTimeout(function() {
                  vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID2, view2, data2, style2);
                }, 100);
                return boundstates;
              }
            );
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
            if (vis.binds["squeezeboxrpc"].getPlayerWidgetType(view, data.widgetPlayer) == "formatselect") {
              $div.html("Only Player formattype button is supported");
              return false;
            }
            const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
            const dataplayer = vis.views[view].widgets[data.widgetPlayer].data;
            const picWidth = dataplayer.picWidth;
            const picHeight = dataplayer.picHeight;
            const borderwidth = data.borderwidth;
            const borderstyle = data.borderstyle;
            const bordercolornogroup = data.bordercolornogroup;
            const bordercolorowngroup = data.bordercolorowngroup;
            const bordercolorothergroup = data.bordercolorothergroup;
            const borderradius = data.borderradius;
            const buttonmargin = data.buttonmargin || "0px";
            let text = "";
            text += "<style>\n";
            text += `#${widgetID} div {
`;
            text += "     display: inline-block; \n";
            text += "}\n";
            text += `#${widgetID} div div {
`;
            text += "     position: relative; \n";
            text += `     margin: 0px ${buttonmargin} ${buttonmargin} 0px; 
`;
            text += "}\n";
            text += `#${widgetID} input[type="checkbox"] {
`;
            text += "    display: none;\n";
            text += "}\n";
            text += `#${widgetID} canvas {
`;
            text += "    opacity: 1;\n";
            text += `    width: ${picWidth}px;
`;
            text += `    height: ${picHeight}px;
`;
            text += `    border: ${borderwidth} ${borderstyle} ${bordercolornogroup};
`;
            text += `    border-radius: ${borderradius};
`;
            text += "}\n";
            text += `#${widgetID} canvas:active {
`;
            text += "    transform: scale(0.9, 0.9);\n";
            text += "    opacity: 1;\n";
            text += `    border: ${borderwidth} ${borderstyle} ${bordercolorowngroup};
`;
            text += `    border-radius: ${borderradius};
`;
            text += "}\n";
            text += `#${widgetID} input[type="checkbox"]:checked + label img {
`;
            text += "    opacity: 1;\n";
            text += `    border: ${borderwidth} ${borderstyle} ${bordercolorowngroup};
`;
            text += `    border-radius: ${borderradius};
`;
            text += "}\n";
            text += `#${widgetID} input[type="checkbox"]:checked + label canvas {
`;
            text += "    opacity: 1;\n";
            text += `    border: ${borderwidth} ${borderstyle} ${bordercolorowngroup};
`;
            text += `    border-radius: ${borderradius};
`;
            text += "}\n";
            text += `#${widgetID} input[type="checkbox"][othergroup="true"] + label img {
`;
            text += "    opacity: 1;\n";
            text += `    border: ${borderwidth} ${borderstyle} ${bordercolorothergroup};
`;
            text += `    border-radius: ${borderradius};
`;
            text += "}\n";
            text += `#${widgetID} input[type="checkbox"][othergroup="true"] + label canvas {
`;
            text += "    opacity: 1;\n";
            text += `    border: ${borderwidth} ${borderstyle} ${bordercolorothergroup};
`;
            text += `    border-radius: ${borderradius};
`;
            text += "}\n";
            text += "</style>\n";
            text += `<div id="${widgetID}container" >`;
            let valid = false;
            for (let i = 0; i < players.length; i++) {
              const stateid = `${data.ainstance.join(".")}.Players.${players[i]}.PlayerID`;
              const playerid = vis.states[`${stateid}.val`] || vis.states[`${stateid}.val`] === 0 ? vis.states[`${stateid}.val`] : "";
              valid = valid || playerid;
              text += "  <div>";
              text += `    <input type="checkbox" id="${widgetID}${players[i]}" name="${widgetID}" playername="${players[i]}" value="${playerid}" disabled>`;
              text += `    <label for="${widgetID}${players[i]}">`;
              text += "      <span>";
              text += "      <canvas></canvas>";
              text += "      </span>";
              text += "    </label>";
              text += "  </div>";
            }
            if (!valid) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].syncgroup.createWidget(widgetID, view, data, style);
              }, 100);
            }
            text += "</div>";
            $(`#${widgetID}`).html(text);
            for (let i = 0; i < players.length; i++) {
              const elemp = $(`#${data.widgetPlayer} input[value="${players[i]}"]  + label span :first-child`);
              const elems = $(`#${widgetID}${players[i]} + label span canvas`);
              elems[0].height = elemp.height();
              elems[0].width = elemp.width();
              const destCtx = elems[0].getContext("2d");
              destCtx.drawImage(elemp[0], 0, 0, elemp.width(), elemp.height());
            }
            const syncgroupbtns = $(`input[name=${widgetID}]`);
            syncgroupbtns.off("change.syncgroup").on("change.syncgroup", fdata, function(event) {
              const fdata2 = event.data;
              const data2 = fdata2.data;
              const self = fdata2.self;
              const syncplayer = this.value;
              const playername = vis.binds["squeezeboxrpc"].getPlayerName(data2.widgetPlayer);
              const syncplayername = $(this).attr("playername");
              let stateid;
              if (syncplayer) {
                if (!$(this).prop("checked")) {
                  stateid = `${ainstance[0]}.${ainstance[1]}.Players.${syncplayername}.cmdGeneral`;
                  vis.setValue(stateid, '"sync","-"');
                } else {
                  stateid = `${ainstance[0]}.${ainstance[1]}.Players.${playername}.cmdGeneral`;
                  vis.setValue(stateid, `"sync","${syncplayer}"`);
                }
              }
              self.setState(fdata2);
            });
          },
          onChange: function(e, newVal, oldVal) {
            console.log(`${e.type}: ${newVal}, ${oldVal}`);
            this.self.setState(this);
          },
          setState: function(fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
            const syncgroups = [];
            for (let ip = 0; ip < players.length; ip++) {
              const playername2 = players[ip];
              const stateid12 = `${data.ainstance.join(".")}.Players.${playername2}.SyncMaster`;
              const stateid22 = `${data.ainstance.join(".")}.Players.${playername2}.SyncSlaves`;
              const state12 = vis.states[`${stateid12}.val`] || vis.states[`${stateid12}.val`] === 0 ? vis.states[`${stateid12}.val`] : "";
              const state22 = vis.states[`${stateid22}.val`] || vis.states[`${stateid22}.val`] === 0 ? vis.states[`${stateid22}.val`] : "";
              let state4 = state12.split(",").concat(state22.split(","));
              state4 = state4.filter((item) => item != "");
              if (Array.isArray(state4)) {
                if (!syncgroups.reduce(function(acc, val) {
                  return state4[0] == "" || state4.length == 0 || acc || val.includes(state4[0]);
                }, false)) {
                  syncgroups.push(state4);
                }
              }
            }
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].syncgroup.setState(fdata);
              }, 100);
            }
            const stateid1 = `${data.ainstance.join(".")}.Players.${playername}.SyncMaster`;
            const stateid2 = `${data.ainstance.join(".")}.Players.${playername}.SyncSlaves`;
            const stateid3 = `${data.ainstance.join(".")}.Players.${playername}.PlayerID`;
            const state1 = vis.states[`${stateid1}.val`] || vis.states[`${stateid1}.val`] === 0 ? vis.states[`${stateid1}.val`] : "";
            const state2 = vis.states[`${stateid2}.val`] || vis.states[`${stateid2}.val`] === 0 ? vis.states[`${stateid2}.val`] : "";
            const state3 = vis.states[`${stateid3}.val`] || vis.states[`${stateid3}.val`] === 0 ? vis.states[`${stateid3}.val`] : "";
            let owngroup = null;
            for (let i = 0; i < syncgroups.length; i++) {
              if (syncgroups[i].includes(state3)) {
                owngroup = i;
                break;
              }
            }
            let state = state1.split(",").concat(state2.split(","));
            state = state.filter((item) => item != "");
            for (let ip = 0; ip < players.length; ip++) {
              const playerbutton = players[ip];
              const playerstateid = `${data.ainstance.join(".")}.Players.${playerbutton}.PlayerID`;
              const playerid = vis.states[`${playerstateid}.val`] || vis.states[`${playerstateid}.val`] === 0 ? vis.states[`${playerstateid}.val`] : "";
              let playergroup = null;
              for (let is = 0; is < syncgroups.length; is++) {
                if (syncgroups[is].includes(playerid)) {
                  playergroup = is;
                  break;
                }
              }
              const $btn = $(`input[id=${widgetID}${playerbutton}]`);
              if (state.includes(playerid) && playerid !== state3) {
                $btn.prop("checked", true);
              } else {
                $btn.prop("checked", false);
              }
              if (playerid == state3) {
                $btn.prop("disabled", true);
              } else {
                $btn.prop("disabled", false);
              }
              if (playergroup != null && playergroup != owngroup) {
                $btn.attr("othergroup", true);
              } else {
                $btn.attr("othergroup", false);
              }
            }
          }
        },
        playtime: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].playtime.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = { self: this, widgetID, view, data, style };
            vis.binds["squeezeboxrpc"].setPlayersChanged(
              $div,
              data.widgetPlayer,
              fdata,
              this.onChange.bind(fdata),
              function() {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                  boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.Duration`);
                  boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.Time`);
                  boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.state`);
                  boundstates.push(`${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.cmdGoTime`);
                }
                return boundstates;
              }
            );
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
            const mainbarcolor = data.mainbarcolor;
            const playtimebarcolor = data.playtimebarcolor;
            const borderwidth = data.borderwidth;
            const borderstyle = data.borderstyle;
            const bordercolor = data.bordercolor;
            const borderradius = data.borderradius;
            let text = "";
            text += "<style> \n";
            text += `#${widgetID} .playtimemain {
`;
            text += "    width: 100%;\n";
            text += "    height: 100%;\n";
            text += `    background-color: ${mainbarcolor};
`;
            text += `    border: ${bordercolor} ${borderwidth} ${borderstyle};
`;
            text += `    border-radius: ${borderradius};
`;
            text += "    overflow: hidden;\n";
            text += "}";
            text += `#${widgetID} .playtimebar {
`;
            text += "  height: 100%;\n";
            text += `  background-color: ${playtimebarcolor};
`;
            text += "}\n";
            text += "</style> \n";
            text += '<div class="playtimemain">\n';
            text += '    <div class="playtimebar"></div>\n';
            text += "</div>\n";
            $(`#${widgetID}`).html(text);
            $(`#${widgetID} div.playtimemain`).on("click.playtime", fdata, this.onClick);
            this.setState(fdata);
          },
          onClick: function(event) {
            const data = event.data.data;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            const stateid_duration = `${data.ainstance.join(".")}.Players.${playername}.Duration`;
            const stateid_gotime = `${data.ainstance.join(".")}.Players.${playername}.cmdGoTime`;
            const state_duration = vis.states[`${stateid_duration}.val`] || vis.states[`${stateid_duration}.val`] === 0 ? parseInt(vis.states[`${stateid_duration}.val`]) : 0;
            const clickx = event.offsetX;
            const width = $(this).width();
            const time = clickx / width * state_duration;
            if (time > state_duration) {
              return;
            }
            vis.setValue(stateid_gotime, time.toString());
          },
          onChange: function() {
            this.self.setState(this);
          },
          setState: function(fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].playtime.setState(fdata);
              }, 100);
            }
            const stateid_duration = `${data.ainstance.join(".")}.Players.${playername}.Duration`;
            const stateid_state = `${data.ainstance.join(".")}.Players.${playername}.state`;
            const stateid_time = `${data.ainstance.join(".")}.Players.${playername}.Time`;
            const state_duration = vis.states[`${stateid_duration}.val`] || vis.states[`${stateid_duration}.val`] === 0 ? parseInt(vis.states[`${stateid_duration}.val`]) : 0;
            const state_state = vis.states[`${stateid_state}.val`] || vis.states[`${stateid_state}.val`] === 0 ? parseInt(vis.states[`${stateid_state}.val`]) : 0;
            const state_time = vis.states[`${stateid_time}.val`] || vis.states[`${stateid_time}.val`] === 0 ? parseInt(vis.states[`${stateid_time}.val`]) : 0;
            let width = state_duration == 0 ? 0 : $(`#${widgetID} div.playtimebar`).width();
            if (state_state == 2) {
              width = 0;
            }
            if (vis.editMode) {
              width = 50;
            } else {
              width = Math.floor(state_time / state_duration * 100);
            }
            $(`#${widgetID} div.playtimebar`).width(`${width}%`);
          }
        },
        string: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].string.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = { self: this, widgetID, view, data, style };
            vis.binds["squeezeboxrpc"].setPlayersChanged(
              $div,
              data.widgetPlayer,
              fdata,
              this.onChange.bind(fdata),
              function() {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                  boundstates.push(
                    `${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.${data.playerattribute}`
                  );
                }
                return boundstates;
              }
            );
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
            this.setState(fdata);
          },
          onChange: function() {
            this.self.setState(this);
          },
          setState: function(fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].string.setState(fdata);
              }, 100);
            }
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.${data.playerattribute}`;
            const state = vis.states[`${stateid}.val`] ? vis.states[`${stateid}.val`] : "";
            const html_prepend = data.html_prepend || "";
            const html_append = data.html_append || "";
            $(`#${widgetID}`).html(html_prepend + state + html_append);
          }
        },
        playlist: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].playlist.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = { self: this, widgetID, view, data, style };
            this.setState(fdata);
          },
          onChange: function() {
            this.self.setState(this);
          },
          setState: function(fdata) {
            return __async(this, null, function* () {
              const data = fdata.data;
              const widgetID = fdata.widgetID;
              const $div = $(`#${widgetID}`);
              const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
              if (!playername) {
                return setTimeout(function() {
                  vis.binds["squeezeboxrpc"].playlist.setState(fdata);
                }, 100);
              }
              const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
              let result = yield vis.binds["squeezeboxrpc"].getPlaylistData(ainstance.join("."));
              let playlist = result.result.playlists_loop;
              let text = "";
              text += `
            <style>
            #${widgetID} ul.plcontainer {
                list-style-type: none;
                padding-left: 0px;
                margin: 0px;
            }
            #${widgetID} li.plentry {
                cursor: pointer;
                height: 1em;
                margin: 5px 0px;
            }
            #${widgetID} li.plentry div {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            #${widgetID} li.plrefresh {
                width: 1em;
                height: 1em;
                margin: 5px 0px;
            }
            </style>
            `;
              text += '<ul class="plcontainer">';
              text += '<li class="plrefresh"><div><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RefreshIcon"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"></path></svg></div></li>';
              for (let i = 0; i < playlist.length; i++) {
                let pl = playlist[i];
                text += `<li class="plentry"><div class="pltext" data-plid="${pl.id}" data-pln="${playername}" data-ins="${ainstance.join(".")}" onclick="vis.binds.squeezeboxrpc.playlist.onclickplaylist(this,event)">${pl.playlist}</div></li>`;
              }
              text += "</ul>";
              $(`#${widgetID}`).html(text);
              $(`#${widgetID} li.refresh`).click(
                function(fdata2) {
                  vis.binds.squeezeboxrpc.playlist.setState(fdata2);
                }.bind(this, fdata)
              );
            });
          },
          onclickplaylist: function(el) {
            const playlistid = el.dataset.plid || "";
            const playername = el.dataset.pln || "";
            const instance = el.dataset.ins || "";
            const stateid = `${instance}.Players.${playername}.cmdGeneral`;
            vis.setValue(stateid, `"playlistcontrol","cmd:load","playlist_id:${playlistid}"`);
          },
          onclickrefresh: function(el) {
            const playlistid = el.dataset.plid || "";
            const playername = el.dataset.pln || "";
            const instance = el.dataset.ins || "";
            const stateid = `${instance}.Players.${playername}.cmdGeneral`;
            vis.setValue(stateid, `"playlistcontrol","cmd:load","playlist_id:${playlistid}"`);
          }
        },
        number: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].number.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = { self: this, widgetID, view, data, style };
            vis.binds["squeezeboxrpc"].setPlayersChanged(
              $div,
              data.widgetPlayer,
              fdata,
              this.onChange.bind(fdata),
              function() {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                  boundstates.push(
                    `${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.${data.playerattribute}`
                  );
                }
                return boundstates;
              }
            );
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
            this.setState(fdata);
          },
          onChange: function() {
            this.self.setState(this);
          },
          setState: function(fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].number.setState(fdata);
              }, 100);
            }
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.${data.playerattribute}`;
            let state = vis.states[`${stateid}.val`] ? vis.states[`${stateid}.val`] : "";
            state = parseFloat(state);
            if (state === void 0 || state === null || isNaN(state)) {
              state = 0;
            }
            if (data.digits || data.digits !== "") {
              state = state.toFixed(parseFloat(data.digits, 10));
            }
            if (data.is_tdp && data.is_tdp !== "") {
              state = state.toString().split(".");
              state[0] = state[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
              state = state.join(".");
            }
            if (data.is_comma && data.is_comma !== "") {
              state = state.split(".").map((e) => e.replace(/,/g, ".")).join(",");
            }
            const html_prepend = data.html_prepend || "";
            const html_append = data.html_append || "";
            $(`#${widgetID}`).html(html_prepend + state + html_append);
          }
        },
        datetime: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].datetime.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = { self: this, widgetID, view, data, style };
            vis.binds["squeezeboxrpc"].setPlayersChanged(
              $div,
              data.widgetPlayer,
              fdata,
              this.onChange.bind(fdata),
              function() {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                  boundstates.push(
                    `${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.${data.playerattribute}`
                  );
                }
                return boundstates;
              }
            );
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
            this.setState(fdata);
          },
          onChange: function() {
            this.self.setState(this);
          },
          setState: function(fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].number.setState(fdata);
              }, 100);
            }
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.${data.playerattribute}`;
            let state = vis.states[`${stateid}.val`] ? vis.states[`${stateid}.val`] : "";
            if (data.factor && data.factor !== "") {
              state = state * data.factor;
            }
            const offset = 1e3 * 60 * (/* @__PURE__ */ new Date(0)).getTimezoneOffset();
            state = new Date(offset + state);
            if (isNaN(state)) {
              state = "";
            }
            if (state instanceof Date) {
              state = state.format(data.format);
            }
            const html_prepend = data.html_prepend || "";
            const html_append = data.html_append || "";
            $(`#${widgetID}`).html(html_prepend + state + html_append);
          }
        },
        image: {
          createWidget: function(widgetID, view, data, style) {
            const $div = $(`#${widgetID}`);
            if (!$div.length) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].image.createWidget(widgetID, view, data, style);
              }, 100);
            }
            data = vis.views[view].widgets[widgetID].data;
            style = vis.views[view].widgets[widgetID].style;
            const ainstance = data.ainstance = vis.binds["squeezeboxrpc"].checkAttributes($div, data.widgetPlayer);
            if (!ainstance) {
              return;
            }
            const fdata = { self: this, widgetID, view, data, style };
            vis.binds["squeezeboxrpc"].setPlayersChanged(
              $div,
              data.widgetPlayer,
              fdata,
              this.onChange.bind(fdata),
              function() {
                const boundstates = [];
                const players = vis.binds["squeezeboxrpc"].getPlayerValues(data.widgetPlayer);
                for (let i = 0; i < players.length; i++) {
                  boundstates.push(
                    `${ainstance[0]}.${ainstance[1]}.Players.${players[i]}.${data.playerattribute}`
                  );
                }
                return boundstates;
              }
            );
            vis.binds["squeezeboxrpc"].setChanged(data.widgetPlayer, fdata, this.setState.bind(fdata));
            let imgstyle = "width:100%;";
            if (data.stretch) {
              imgstyle += "height:100%;";
            }
            let text = "";
            text += data.html_prepend || "";
            text += `<img style="${imgstyle}"></img> 
`;
            text += data.html_append || "";
            $(`#${widgetID}`).html(text);
            this.setState(fdata);
          },
          onChange: function() {
            this.self.setState(this);
          },
          setState: function(fdata) {
            const data = fdata.data;
            const widgetID = fdata.widgetID;
            const playername = vis.binds["squeezeboxrpc"].getPlayerName(data.widgetPlayer);
            if (!playername) {
              return setTimeout(function() {
                vis.binds["squeezeboxrpc"].image.setState(fdata);
              }, 100);
            }
            const stateid = `${data.ainstance.join(".")}.Players.${playername}.${data.playerattribute}`;
            const state = vis.states[`${stateid}.val`] ? vis.states[`${stateid}.val`] : "";
            $(`#${widgetID} img`).attr("src", state);
          }
        },
        redrawInspectWidgets: function(view) {
          let $edit, id, start, end, sel;
          if (window.Selection) {
            if (window.getSelection()) {
              sel = window.getSelection();
            }
            if (sel.anchorNode) {
              $edit = $(sel.anchorNode).find("input, textarea").first();
              id = $edit.attr("id");
              start = $edit.prop("selectionStart");
              end = $edit.prop("selectionEnd");
            }
          }
          vis.inspectWidgets(view, view);
          $edit = $(`#${id}`);
          if ($edit) {
            $edit.focus();
            $edit.prop({
              selectionStart: start,
              selectionEnd: end
            });
          }
        },
        checkViewIndex: function(widgetID, view, viewindex) {
          let $edit;
          const data = vis.views[view].widgets[widgetID].data;
          const viewindexcheck = data.viewindexcheck;
          if (!viewindex || viewindex.trim() == "") {
            viewindex = vis.binds["squeezeboxrpc"][data.functionname].getViewindex(viewindexcheck).join(", ");
          }
          viewindex = viewindex.split(",").map(function(item) {
            return item.trim();
          });
          viewindex = vis.binds["squeezeboxrpc"][data.functionname].checkViewindexExist(viewindex, viewindexcheck);
          if (viewindex.length > viewindexcheck.length) {
            viewindex = viewindex.slice(0, viewindexcheck.length);
          }
          data.viewindex = viewindex.join(", ");
          $edit = $("#inspect_viewindex");
          let start = $edit.prop("selectionStart");
          let end = $edit.prop("selectionEnd");
          if (start > data.viewindex.length) {
            start = data.viewindex.length;
          }
          if (end > data.viewindex.length) {
            end = data.viewindex.length;
          }
          $edit.val(data.viewindex);
          $edit = $("#inspect_viewindex");
          if ($edit) {
            $edit.focus();
            $edit.prop({
              selectionStart: start,
              selectionEnd: end
            });
          }
          return false;
        },
        getPlayerWidgetType: function(view, playerWidgetID) {
          return vis.views[view].widgets[playerWidgetID].data.formattype || "";
        },
        checkAttributes: function($div, widgetPlayer) {
          if (!widgetPlayer) {
            $div.html("Please select a player widget");
            return false;
          }
          if (!vis.widgets[widgetPlayer].data.ainstance) {
            $div.html("Please select an instance at the playerwidget");
            return false;
          }
          const ainstance = vis.widgets[widgetPlayer].data.ainstance.split(".");
          if (!ainstance || ainstance[0] != "squeezeboxrpc") {
            $div.html("Please select an instance at the playerwidget");
            return false;
          }
          return ainstance;
        },
        setChanged: function(widgetPlayer, fdata) {
          $(".vis-view").off(`change.${fdata.widgetID}`).on(`change.${fdata.widgetID}`, `#${widgetPlayer}`, fdata, function() {
            const self = fdata.self;
            self.setState(fdata);
          });
        },
        setPlayersChanged: function($div, widgetPlayer, fdata, onChange_callback, boundstates_callback) {
          $(".vis-view").off(`playerschanged.${fdata.widgetID}`).on(
            `playerschanged.${fdata.widgetID}`,
            `#${widgetPlayer}`,
            fdata,
            function(event) {
              const fdata2 = event.data;
              const boundstates = boundstates_callback.apply(this, [fdata2]);
              if (boundstates) {
                vis.binds["squeezeboxrpc"].bindStates($div, boundstates, onChange_callback, fdata2);
              }
            }.bind(this)
          );
        },
        bindStates: function(elem, bound, change_callback, fdata) {
          const $div = $(elem);
          const boundstates = $div.data("bound");
          if (boundstates) {
            for (let i = 0; i < boundstates.length; i++) {
              vis.states.unbind(boundstates[i], change_callback);
            }
          }
          $div.data("bound", null);
          $div.data("bindHandler", null);
          vis.conn.gettingStates = 0;
          vis.conn.getStates(
            bound,
            function(error, states) {
              vis.updateStates(states);
              vis.conn.subscribe(bound);
              for (let i = 0; i < bound.length; i++) {
                bound[i] = `${bound[i]}.val`;
                vis.states.bind(bound[i], change_callback);
              }
              $div.data("bound", bound);
              $div.data("bindHandler", change_callback);
            }.bind({ fdata, change_callback })
          );
        },
        attrSelect: function(wid_attr, options) {
          if (wid_attr === "widgetPlayer") {
            options = this.findPlayerWidgets();
          }
          if (wid_attr === "widgetFavorites") {
            options = this.findFavoritesWidgets();
          }
          let html = "";
          for (let i = 0; i < options.length; i++) {
            html += `<option value="${options[i]}">${options[i]}</option>`;
          }
          const line = {
            input: `<select type="text" id="inspect_${wid_attr}">${html}</select>`
          };
          return line;
        },
        playerAttrSelect: function(wid_attr) {
          let html = "";
          const playerattributes = vis.binds["squeezeboxrpc"].playerattributes.sort();
          for (let i = 0; i < playerattributes.length; i++) {
            html += `<option value="${playerattributes[i]}">${playerattributes[i]}</option>`;
          }
          const line = {
            input: `<select type="text" id="inspect_${wid_attr}">${html}</select>`
          };
          return line;
        },
        findPlayerWidgets: function() {
          const widgets = vis.views[vis.activeView].widgets;
          const keys = Object.keys(widgets);
          const result = [];
          for (let i = 0; i < keys.length; i++) {
            if (widgets[keys[i]].tpl == "tplSqueezeboxrpcPlayer") {
              result.push(keys[i]);
            }
          }
          return result;
        },
        findFavoritesWidgets: function() {
          const widgets = vis.views[vis.activeView].widgets;
          const keys = Object.keys(widgets);
          const result = [];
          for (let i = 0; i < keys.length; i++) {
            if (widgets[keys[i]].tpl == "tplSqueezeboxrpcFavorites") {
              result.push(keys[i]);
            }
          }
          return result;
        },
        getPlayerValues: function(widgetPlayer) {
          return $(`input[name=${widgetPlayer}], #${widgetPlayer} option`).toArray().reduce(function(acc, cur) {
            if ($(cur).val()) {
              acc.push($(cur).val());
            }
            return acc;
          }, []);
        },
        getPlayerName: function(widgetPlayer) {
          return $(`input[name=${widgetPlayer}]:checked, #${widgetPlayer} option:checked`).val();
        },
        onHorizChange: function(widgetID, view, newId) {
          const data = vis.views[view].widgets[widgetID].data;
          if (newId == "vertical") {
            data.segheight = "100%";
            data.segwidth = "100%";
          } else {
            data.segheight = "20px";
            data.segwidth = "20px";
          }
          return true;
        },
        editDimension: function(widgetID, view, newId, attr) {
          if (newId && typeof newId !== "object") {
            const e = newId.substring(newId.length - 2);
            if (e !== "px" && e !== "em" && newId[newId.length - 1] !== "%") {
              vis.views[view].widgets[widgetID].data[attr] = `${newId}px`;
            }
          }
        },
        sendToAsync: function(instance, command, sendData) {
          return __async(this, null, function* () {
            console.log(`sendToAsync ${command} ${sendData}`);
            return new Promise((resolve, reject) => {
              try {
                vis.conn.sendTo(instance, command, sendData, function(receiveData) {
                  resolve(receiveData);
                });
              } catch (error) {
                reject(error);
              }
            });
          });
        },
        getPlaylistData: function(instance) {
          return __async(this, null, function* () {
            console.log(`getPlaylistData`);
            const data = {
              playerid: "",
              cmdArray: ["playlists", "0", "999", "tags:us"]
            };
            return yield this.sendToAsync(instance, "cmdGeneral", data);
          });
        }
      };
      vis.binds["squeezeboxrpc"].showVersion();
    }
  });

  // squeezeboxrpc/js/date.format.js
  var require_date_format = __commonJS({
    "squeezeboxrpc/js/date.format.js"(exports) {
      "use strict";
      (function() {
        Date.shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        Date.longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        Date.shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        Date.longDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const replaceChars = {
          // Day
          d: function() {
            const d = this.getDate();
            return (d < 10 ? "0" : "") + d;
          },
          D: function() {
            return Date.shortDays[this.getDay()];
          },
          j: function() {
            return this.getDate();
          },
          l: function() {
            return Date.longDays[this.getDay()];
          },
          N: function() {
            const N = this.getDay();
            return N === 0 ? 7 : N;
          },
          S: function() {
            const S = this.getDate();
            return S % 10 === 1 && S !== 11 ? "st" : S % 10 === 2 && S !== 12 ? "nd" : S % 10 === 3 && S !== 13 ? "rd" : "th";
          },
          w: function() {
            return this.getDay();
          },
          z: function() {
            const d = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((this - d) / 864e5);
          },
          // Week
          W: function() {
            const target = new Date(this.valueOf());
            const dayNr = (this.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            const firstThursday = target.valueOf();
            target.setMonth(0, 1);
            if (target.getDay() !== 4) {
              target.setMonth(0, 1 + (4 - target.getDay() + 7) % 7);
            }
            const retVal = 1 + Math.ceil((firstThursday - target) / 6048e5);
            return retVal < 10 ? "0" + retVal : retVal;
          },
          // Month
          F: function() {
            return Date.longMonths[this.getMonth()];
          },
          m: function() {
            const m = this.getMonth();
            return (m < 9 ? "0" : "") + (m + 1);
          },
          M: function() {
            return Date.shortMonths[this.getMonth()];
          },
          n: function() {
            return this.getMonth() + 1;
          },
          t: function() {
            let year = this.getFullYear();
            let nextMonth = this.getMonth() + 1;
            if (nextMonth === 12) {
              year = year++;
              nextMonth = 0;
            }
            return new Date(year, nextMonth, 0).getDate();
          },
          // Year
          L: function() {
            const L = this.getFullYear();
            return L % 400 === 0 || L % 100 !== 0 && L % 4 === 0;
          },
          o: function() {
            const d = new Date(this.valueOf());
            d.setDate(d.getDate() - (this.getDay() + 6) % 7 + 3);
            return d.getFullYear();
          },
          Y: function() {
            return this.getFullYear();
          },
          y: function() {
            return ("" + this.getFullYear()).substr(2);
          },
          // Time
          a: function() {
            return this.getHours() < 12 ? "am" : "pm";
          },
          A: function() {
            return this.getHours() < 12 ? "AM" : "PM";
          },
          B: function() {
            return Math.floor(((this.getUTCHours() + 1) % 24 + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1e3 / 24);
          },
          g: function() {
            return this.getHours() % 12 || 12;
          },
          G: function() {
            return this.getHours();
          },
          h: function() {
            const h = this.getHours();
            return ((h % 12 || 12) < 10 ? "0" : "") + (h % 12 || 12);
          },
          H: function() {
            const H = this.getHours();
            return (H < 10 ? "0" : "") + H;
          },
          i: function() {
            const i = this.getMinutes();
            return (i < 10 ? "0" : "") + i;
          },
          s: function() {
            const s = this.getSeconds();
            return (s < 10 ? "0" : "") + s;
          },
          v: function() {
            const v = this.getMilliseconds();
            return (v < 10 ? "00" : v < 100 ? "0" : "") + v;
          },
          // Timezone
          e: function() {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
          },
          I: function() {
            let DST = null;
            for (let i = 0; i < 12; ++i) {
              const d = new Date(this.getFullYear(), i, 1);
              const offset = d.getTimezoneOffset();
              if (DST === null)
                DST = offset;
              else if (offset < DST) {
                DST = offset;
                break;
              } else if (offset > DST)
                break;
            }
            return this.getTimezoneOffset() === DST | 0;
          },
          O: function() {
            const O = this.getTimezoneOffset();
            return (-O < 0 ? "-" : "+") + (Math.abs(O / 60) < 10 ? "0" : "") + Math.floor(Math.abs(O / 60)) + (Math.abs(O % 60) === 0 ? "00" : (Math.abs(O % 60) < 10 ? "0" : "") + Math.abs(O % 60));
          },
          P: function() {
            const P = this.getTimezoneOffset();
            return (-P < 0 ? "-" : "+") + (Math.abs(P / 60) < 10 ? "0" : "") + Math.floor(Math.abs(P / 60)) + ":" + (Math.abs(P % 60) === 0 ? "00" : (Math.abs(P % 60) < 10 ? "0" : "") + Math.abs(P % 60));
          },
          T: function() {
            const tz = this.toLocaleTimeString(navigator.language, { timeZoneName: "short" }).split(" ");
            return tz[tz.length - 1];
          },
          Z: function() {
            return -this.getTimezoneOffset() * 60;
          },
          // Full Date/Time
          c: function() {
            return this.format("Y-m-d\\TH:i:sP");
          },
          r: function() {
            return this.toString();
          },
          U: function() {
            return Math.floor(this.getTime() / 1e3);
          }
        };
        Date.prototype.format = function(format) {
          const date = this;
          return format.replace(/(\\?)(.)/g, function(_, esc, chr) {
            return esc === "" && replaceChars[chr] ? replaceChars[chr].call(date) : chr;
          });
        };
      }).call(exports);
    }
  });

  // squeezeboxrpc/js/bundle.js
  var import_squeezeboxrpc = __toESM(require_squeezeboxrpc());
  var import_date_format = __toESM(require_date_format());
  init_textImage();
})();
//# sourceMappingURL=squeezeboxrpc-dist.js.map
