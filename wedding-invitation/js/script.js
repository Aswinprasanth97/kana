/* ═══════════════════════════════════════════════════════════════
   Arjun & Sandra — wedding invitation
   Vanilla JS. No dependencies, no build step, no backend.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var WEDDING = {
    title: "The Wedding of Arjun & Sandra",
    venue: "City Palace Auditorium, Beypore, Kozhikode, Kerala",
    // 10:30–11:30 IST (UTC+05:30) on 30 August 2026
    startUTC: "20260830T050000Z",
    endUTC: "20260830T060000Z",
    startLocal: "20260830T103000",
    endLocal: "20260830T113000",
    timezone: "Asia/Kolkata",
    description:
      "Together with our families, we joyfully invite you to celebrate the beginning of our forever.",
  };

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ─────────────────────────────────────────────────────────────
     1. Scroll reveal — a tiny AOS-compatible engine.
        Honours data-aos + data-aos-delay; no external library.
     ───────────────────────────────────────────────────────────── */
  function initReveal() {
    var items = $$("[data-aos]");
    if (!items.length) return;

    if (REDUCED || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("aos-in");
      });
      return;
    }

    items.forEach(function (el) {
      var delay = el.getAttribute("data-aos-delay");
      if (delay) el.style.setProperty("--aos-delay", delay + "ms");
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("aos-in");
          io.unobserve(entry.target); // reveal once, then stop watching
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    items.forEach(function (el) {
      // Anything already on screen (the whole hero) animates in straight away —
      // the observer's negative bottom margin would otherwise leave elements low
      // in the first viewport stuck at opacity 0 until the guest scrolls.
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add("aos-in");
      } else {
        io.observe(el);
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     2. Navigation — reveal on scroll, scrollspy, mobile menu
     ───────────────────────────────────────────────────────────── */
  function initNav() {
    var nav = $("[data-nav]");
    var toggle = $("#menu-toggle");
    var menu = $("#mobile-menu");
    if (!nav) return;

    var onScroll = function () {
      nav.classList.toggle(
        "is-visible",
        window.scrollY > window.innerHeight * 0.55,
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // mobile menu
    if (toggle && menu) {
      var setMenu = function (open) {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        menu.hidden = !open;
      };
      toggle.addEventListener("click", function () {
        setMenu(toggle.getAttribute("aria-expanded") !== "true");
      });
      $$("a", menu).forEach(function (a) {
        a.addEventListener("click", function () {
          setMenu(false);
        });
      });
      document.addEventListener("keydown", function (e) {
        if (
          e.key === "Escape" &&
          toggle.getAttribute("aria-expanded") === "true"
        )
          setMenu(false);
      });
    }

    // scrollspy for the desktop links
    var links = $$(".nav-link");
    var sections = links
      .map(function (l) {
        return $(l.getAttribute("href"));
      })
      .filter(Boolean);

    if (sections.length && "IntersectionObserver" in window) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (l) {
              l.classList.toggle(
                "is-active",
                l.getAttribute("href") === "#" + entry.target.id,
              );
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" },
      );
      sections.forEach(function (s) {
        spy.observe(s);
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────
     3. Smooth scrolling for buttons (anchors use CSS scroll-smooth)
     ───────────────────────────────────────────────────────────── */
  function initScrollTo() {
    $$("[data-scroll-to]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = $(btn.getAttribute("data-scroll-to"));
        if (!target) return;
        target.scrollIntoView({
          behavior: REDUCED ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     4. Countdown
     ───────────────────────────────────────────────────────────── */
  function initCountdown() {
    var root = $("[data-countdown]");
    if (!root) return;

    var done = $("[data-countdown-done]");
    var target = new Date(root.getAttribute("data-countdown")).getTime();
    if (isNaN(target)) return;

    var cells = {
      days: $('[data-count="days"]', root),
      hours: $('[data-count="hours"]', root),
      minutes: $('[data-count="minutes"]', root),
      seconds: $('[data-count="seconds"]', root),
    };

    var pad = function (n, width) {
      return String(n).padStart(width || 2, "0");
    };

    var write = function (cell, next) {
      if (!cell || cell.textContent === next) return;
      cell.textContent = next;
      if (REDUCED) return;
      cell.classList.remove("is-ticking");
      void cell.offsetWidth; // restart the animation
      cell.classList.add("is-ticking");
    };

    var tick = function () {
      var diff = target - Date.now();

      if (diff <= 0) {
        Object.keys(cells).forEach(function (k) {
          write(cells[k], "00");
        });
        if (done) done.hidden = false;
        clearInterval(timer);
        return;
      }

      var s = Math.floor(diff / 1000);
      write(cells.days, pad(Math.floor(s / 86400), 2));
      write(cells.hours, pad(Math.floor(s / 3600) % 24));
      write(cells.minutes, pad(Math.floor(s / 60) % 60));
      write(cells.seconds, pad(s % 60));
    };

    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ─────────────────────────────────────────────────────────────
     5. RSVP — conditional fields, validation, Google Sheets + LocalStorage
     ───────────────────────────────────────────────────────────── */
  var RSVP_KEY = "arjun-sandra-rsvp";
  // Paste your Google Apps Script web app URL here (ends with /exec).
  // See google-sheets/README.md for setup. Leave empty to save locally only.
  var RSVP_SHEETS_URL =
    "https://script.google.com/macros/s/AKfycbyIqOcbr0ws2yEFTw1bSsM4uXwBxFAsdiC1ZGdE5ZIsqRiJY6CYGvoJqL758F7633vhUQ/exec";

  function submitRsvpToSheets(data) {
    return fetch(RSVP_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    }).then(function (res) {
      return res.text().then(function (text) {
        var json;
        try {
          json = JSON.parse(text);
        } catch (err) {
          throw new Error("bad response");
        }
        if (!json.success) throw new Error(json.error || "submit failed");
        return json;
      });
    });
  }

  function initRsvp() {
    var form = $("#rsvp-form");
    var thanks = $("#rsvp-thanks");
    var thanksNote = $("#rsvp-thanks-note");
    var submit = $("#rsvp-submit");
    var hint = $(".rsvp-hint");
    var editBtn = $("#rsvp-edit");
    var rsvpError = $("#rsvp-error");
    var yes = $("#fields-yes");
    var no = $("#fields-no");
    if (!form || !thanks) return;

    var radios = $$('input[name="attending"]', form);

    var showPanel = function (panel) {
      [yes, no].forEach(function (p) {
        if (!p) return;
        if (p === panel) {
          p.hidden = false;
          p.classList.remove("is-entering");
          void p.offsetWidth;
          if (!REDUCED) p.classList.add("is-entering");
        } else {
          p.hidden = true;
        }
      });
    };

    radios.forEach(function (r) {
      r.addEventListener("change", function () {
        showPanel(r.value === "yes" ? yes : no);
        if (submit) submit.disabled = false;
        if (hint) hint.hidden = true;
      });
    });

    /* ── validation ── */
    var setError = function (input, message) {
      var msg = $('[data-err-for="' + input.id + '"]', form);
      if (message) {
        input.setAttribute("aria-invalid", "true");
        if (msg) {
          msg.textContent = message;
          msg.hidden = false;
        }
      } else {
        input.removeAttribute("aria-invalid");
        if (msg) {
          msg.textContent = "";
          msg.hidden = true;
        }
      }
      return !message;
    };

    var validate = function (attending) {
      var ok = true;
      var firstBad = null;

      var check = function (input, message) {
        var valid = setError(input, message);
        if (!valid) {
          ok = false;
          if (!firstBad) firstBad = input;
        }
      };

      if (attending === "yes") {
        var name = $("#y-name"),
          mobile = $("#y-mobile"),
          email = $("#y-email");
        var adults = $("#y-adults"),
          children = $("#y-children");

        check(name, name.value.trim() ? "" : "Please tell us your name.");

        var digits = mobile.value.replace(/[^\d]/g, "");
        check(
          mobile,
          digits.length >= 7 && digits.length <= 15
            ? ""
            : "Please enter a valid mobile number.",
        );

        check(
          email,
          !email.value.trim() ||
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
            ? ""
            : "Please enter a valid email address.",
        );

        var a = parseInt(adults.value, 10);
        check(
          adults,
          !isNaN(a) && a >= 1 && a <= 20 ? "" : "At least 1 adult (max 20).",
        );

        var c = parseInt(children.value, 10);
        check(
          children,
          !isNaN(c) && c >= 0 && c <= 20 ? "" : "Enter 0 or more (max 20).",
        );
      } else {
        var nName = $("#n-name");
        check(nName, nName.value.trim() ? "" : "Please tell us your name.");
      }

      if (firstBad) firstBad.focus();
      return ok;
    };

    /* ── success state ── */
    var renderThanks = function (data) {
      form.hidden = true;
      thanks.hidden = false;

      if (thanksNote) {
        thanksNote.textContent =
          data.attending === "yes"
            ? "We can’t wait to see you, " +
              data.name +
              ". We have you down for " +
              data.adults +
              " " +
              (data.adults === 1 ? "adult" : "adults") +
              (data.children > 0
                ? " and " +
                  data.children +
                  " " +
                  (data.children === 1 ? "child" : "children")
                : "") +
              " on 30 August 2026."
            : "Thank you for your wishes, " +
              data.name +
              ". You will be missed on our special day.";
      }
      thanks.scrollIntoView({
        behavior: REDUCED ? "auto" : "smooth",
        block: "center",
      });
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // never reload

      var picked = radios.filter(function (r) {
        return r.checked;
      })[0];
      if (!picked) {
        if (hint) hint.hidden = false;
        return;
      }
      if (!validate(picked.value)) return;

      var data =
        picked.value === "yes"
          ? {
              attending: "yes",
              name: $("#y-name").value.trim(),
              mobile: $("#y-mobile").value.trim(),
              email: $("#y-email").value.trim(),
              adults: parseInt($("#y-adults").value, 10),
              children: parseInt($("#y-children").value, 10),
              message: $("#y-message").value.trim(),
              submittedAt: new Date().toISOString(),
            }
          : {
              attending: "no",
              name: $("#n-name").value.trim(),
              wishes: $("#n-wishes").value.trim(),
              submittedAt: new Date().toISOString(),
            };

      var clearError = function () {
        if (rsvpError) {
          rsvpError.textContent = "";
          rsvpError.hidden = true;
        }
      };

      var resetSubmit = function () {
        if (submit) {
          submit.disabled = false;
          submit.textContent = "Send RSVP";
        }
      };

      var complete = function () {
        try {
          localStorage.setItem(RSVP_KEY, JSON.stringify(data));
        } catch (err) {
          // private mode / storage full — the thank-you still stands
        }
        renderThanks(data);
        resetSubmit();
      };

      clearError();

      if (!RSVP_SHEETS_URL) {
        complete();
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending…";
      }

      submitRsvpToSheets(data)
        .then(complete)
        .catch(function () {
          if (rsvpError) {
            rsvpError.textContent =
              "Something went wrong sending your RSVP. Please try again or message us directly.";
            rsvpError.hidden = false;
          }
          resetSubmit();
        });
    });

    /* ── restore a previous response ── */
    var saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(RSVP_KEY) || "null");
    } catch (err) {
      saved = null;
    }
    if (saved && saved.attending) renderThanks(saved);

    /* ── let a guest amend their answer ── */
    if (editBtn) {
      editBtn.addEventListener("click", function () {
        try {
          localStorage.removeItem(RSVP_KEY);
        } catch (err) {
          /* ignore */
        }

        thanks.hidden = true;
        form.hidden = false;
        form.reset();
        showPanel(null);
        if (submit) submit.disabled = true;
        if (hint) hint.hidden = false;
        $$("[data-err-for]", form).forEach(function (m) {
          m.hidden = true;
        });
        $$("[aria-invalid]", form).forEach(function (i) {
          i.removeAttribute("aria-invalid");
        });
        form.scrollIntoView({
          behavior: REDUCED ? "auto" : "smooth",
          block: "center",
        });
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────
     6. Garland curtain — pointer on desktop, gyro / tilt on mobile
        Each strand is a damped pendulum spring-coupled to its neighbours.
        Desktop: strands part around the cursor. Mobile: phone tilt leans
        the whole curtain (DeviceOrientation, with iOS permission on tap).
     ───────────────────────────────────────────────────────────── */
  function initGarlandCurtain() {
    var row = $("[data-curtain]");
    var hero = $("#hero");
    if (!row || !hero || REDUCED) return;

    var usePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    var useOrientation =
      !usePointer && "DeviceOrientationEvent" in window;

    if (!usePointer && !useOrientation) return;

    var STIFFNESS = 26;
    var DAMPING = 1.6;
    var COUPLING = 48;
    var CURSOR_K = useOrientation ? 95 : 115;
    var RADIUS = 170;
    var MAX_ROT = useOrientation ? 22 : 24;
    var SWIPE = useOrientation ? 0.85 : 0.9;
    var MAX_STEP = 1 / 60;

    var strands = [];
    var pointer = { x: 0, y: 0, vx: 0, active: false };
    var frame = null;
    var last = 0;
    var smoothGamma = 0;
    var prevSmoothGamma = 0;
    var orientationLive = false;
    var permissionAsked = false;

    function measure() {
      var visible = $$(".garland", row).filter(function (el) {
        return el.offsetParent !== null;
      });
      var longest = 1;
      visible.forEach(function (el) {
        longest = Math.max(longest, el.getBoundingClientRect().height);
      });

      strands = visible.map(function (el) {
        var box = el.getBoundingClientRect();
        return {
          img: $("img", el),
          cx: box.left + box.width / 2 + window.scrollX,
          bottom: box.top + box.height + window.scrollY,
          len: Math.max(0.45, box.height / longest),
          a: 0,
          v: 0,
        };
      });
    }

    function step(dt) {
      var n = strands.length;
      var i, s;

      for (i = 0; i < n; i++) {
        s = strands[i];
        var force = 0;

        if (pointer.active) {
          if (useOrientation) {
            /* Lean the whole curtain with the phone — each strand gets a
               slightly different target so the wave still travels. */
            var spread = (i / Math.max(1, n - 1) - 0.5) * 2.8;
            var target = smoothGamma * 0.48 + spread * smoothGamma * 0.08;
            force += CURSOR_K * (target - s.a);
            force += pointer.vx * SWIPE;
          } else {
            var dx = s.cx - pointer.x;
            var dist = Math.abs(dx);
            if (dist < RADIUS) {
              var f = 1 - dist / RADIUS;
              f = f * f * (3 - 2 * f);

              var below = pointer.y - s.bottom;
              var vf = below <= 0 ? 1 : Math.max(0, 1 - below / 220);

              var dir = dx >= 0 ? 1 : -1;
              var hold = dir * f * vf * MAX_ROT;
              force += CURSOR_K * (hold - s.a);
              force += pointer.vx * SWIPE * f * vf;
            }
          }
        }

        force += (-STIFFNESS / s.len) * s.a;

        var left = i > 0 ? strands[i - 1].a : s.a;
        var right = i < n - 1 ? strands[i + 1].a : s.a;
        force += COUPLING * (left - s.a + (right - s.a));

        force += -DAMPING * s.v;

        s.v += force * dt;
      }

      for (i = 0; i < n; i++) strands[i].a += strands[i].v * dt;
    }

    function render() {
      var settled = true;

      for (var i = 0; i < strands.length; i++) {
        var s = strands[i];
        if (Math.abs(s.a) > 0.05 || Math.abs(s.v) > 0.5) settled = false;

        var lag = Math.max(-7, Math.min(7, -s.v * 0.045));

        s.img.style.transform =
          "rotate(" + s.a.toFixed(2) + "deg) skewX(" + lag.toFixed(2) + "deg)";
      }
      return settled;
    }

    function tick(now) {
      var dt = last ? (now - last) / 1000 : MAX_STEP;
      last = now;
      if (dt > 0.05) dt = 0.05;

      var steps = Math.max(1, Math.ceil(dt / MAX_STEP));
      var h = dt / steps;
      for (var k = 0; k < steps; k++) step(h);

      pointer.vx *= useOrientation ? 0.75 : 0.82;

      var settled = render();
      var tiltIdle =
        useOrientation &&
        Math.abs(smoothGamma) < 0.25 &&
        Math.abs(pointer.vx) < 0.05;
      var moving =
        !settled ||
        (pointer.active && !tiltIdle) ||
        (useOrientation && orientationLive && !tiltIdle);

      if (moving) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = null;
        last = 0;
        if (useOrientation) pointer.active = false;
      }
    }

    function wake() {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    }

    function applyTilt(raw) {
      smoothGamma += (raw - smoothGamma) * 0.16;
      pointer.vx = (smoothGamma - prevSmoothGamma) * 6;
      prevSmoothGamma = smoothGamma;
      pointer.active = true;
      wake();
    }

    function onOrientation(e) {
      if (e.gamma != null && !isNaN(e.gamma)) {
        applyTilt(e.gamma);
        return;
      }
      /* Some devices only report beta in portrait. */
      if (e.beta != null && !isNaN(e.beta)) {
        applyTilt((e.beta - 90) * 0.65);
      }
    }

    function onMotion(e) {
      var acc = e.accelerationIncludingGravity;
      if (!acc) return;
      var tilt = acc.x;
      if (Math.abs(tilt) < 0.08) return;
      applyTilt(tilt * 3.2);
    }

    function startOrientation() {
      if (orientationLive) return;
      orientationLive = true;
      hero.classList.add("hero--tilt");
      window.addEventListener("deviceorientation", onOrientation, {
        passive: true,
      });
      window.addEventListener("devicemotion", onMotion, { passive: true });
      measure();
      wake();
    }

    function requestOrientationAccess() {
      if (permissionAsked) return;
      permissionAsked = true;

      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission()
          .then(function (state) {
            if (state === "granted") startOrientation();
          })
          .catch(function () { /* guest declined */ });
        return;
      }
      startOrientation();
    }

    if (usePointer) {
      hero.addEventListener(
        "pointermove",
        function (e) {
          if (pointer.active) pointer.vx = e.pageX - pointer.x;
          pointer.x = e.pageX;
          pointer.y = e.pageY;
          pointer.active = true;
          wake();
        },
        { passive: true },
      );

      hero.addEventListener("pointerleave", function () {
        pointer.active = false;
        wake();
      });
    } else {
      var needsMotionPermission =
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function";

      if (needsMotionPermission) {
        /* iOS requires a user gesture — any tap on the page counts. */
        document.addEventListener(
          "touchstart",
          requestOrientationAccess,
          { once: true, passive: true },
        );
      } else {
        requestOrientationAccess();
      }
    }

    measure();
    window.addEventListener(
      "resize",
      function () {
        measure();
        wake();
      },
      { passive: true },
    );
  }

  /* ─────────────────────────────────────────────────────────────
     7. Share — WhatsApp, copy link, .ics calendar file
     ───────────────────────────────────────────────────────────── */
  function initShare() {
    var status = $("#share-status");
    var url = window.location.href.split("#")[0];

    var say = function (message) {
      if (!status) return;
      status.textContent = message;
      setTimeout(function () {
        status.textContent = "";
      }, 3200);
    };

    // WhatsApp
    var wa = $("#share-whatsapp");
    if (wa) {
      var text =
        "Arjun & Sandra are getting married! 💐\n" +
        "Sunday, 30 August 2026 · 10:30 AM\n" +
        WEDDING.venue +
        "\n\n" +
        url;
      wa.href = "https://wa.me/?text=" + encodeURIComponent(text);
    }

    // Copy link
    var copy = $("#copy-link");
    if (copy) {
      var label = $("[data-copy-label]", copy);
      copy.addEventListener("click", function () {
        var restore = function () {
          if (label) label.textContent = "Copied!";
          say("Invitation link copied to your clipboard.");
          setTimeout(function () {
            if (label) label.textContent = "Copy Invitation Link";
          }, 2400);
        };

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard
            .writeText(url)
            .then(restore)
            .catch(function () {
              fallbackCopy(url, restore);
            });
        } else {
          fallbackCopy(url, restore);
        }
      });
    }

    function fallbackCopy(value, done) {
      var ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        done();
      } catch (err) {
        say("Copy failed — please copy the address bar.");
      }
      document.body.removeChild(ta);
    }

    // Add to calendar — Google Calendar on mobile, .ics download on desktop
    var cal = $("#add-calendar");
    if (cal) {
      cal.addEventListener("click", function () {
        var mode = addToCalendar();
        say(calendarFeedback(mode));
      });
    }
  }

  function isAndroid() {
    return /android/i.test(navigator.userAgent);
  }

  function calendarFeedback(mode) {
    if (mode === "ics") return "Calendar invite downloaded.";
    return "Opening Google Calendar — tap Notifications, then Save ❤";
  }

  /* Shared by the share section and the floating button, so the event details
     can never drift apart between the two. */
  function isMobileView() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function getGoogleCalendarUrl() {
    var details =
      WEDDING.description +
      "\n\nBefore saving, tap Notifications and add reminders " +
      "(e.g. 1 day before and 2 hours before) so you do not miss the wedding.";

    return (
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" +
      encodeURIComponent(WEDDING.title) +
      "&dates=" +
      WEDDING.startLocal +
      "/" +
      WEDDING.endLocal +
      "&ctz=" +
      encodeURIComponent(WEDDING.timezone) +
      "&details=" +
      encodeURIComponent(details) +
      "&location=" +
      encodeURIComponent(WEDDING.venue)
    );
  }

  function openGoogleCalendarApp() {
    var url = getGoogleCalendarUrl();
    var query = url.replace(/^https?:\/\/[^?]+\?/, "");

    if (isAndroid()) {
      window.location.href =
        "intent://calendar.google.com/calendar/render?" +
        query +
        "#Intent;scheme=https;package=com.google.android.calendar;S.browser_fallback_url=" +
        encodeURIComponent(url) +
        ";end";
      return;
    }

    window.location.href = url;
  }

  function buildIcsString() {
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Arjun and Sandra//Wedding Invitation//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:arjun-sandra-wedding-2026@invitation",
      "DTSTAMP:" +
        new Date().toISOString().replace(/[-:]/g, "").split(".")[0] +
        "Z",
      "DTSTART;TZID=Asia/Kolkata:" + WEDDING.startLocal,
      "DTEND;TZID=Asia/Kolkata:" + WEDDING.endLocal,
      "SUMMARY:" + WEDDING.title,
      "DESCRIPTION:" + WEDDING.description.replace(/,/g, "\\,"),
      "LOCATION:" + WEDDING.venue.replace(/,/g, "\\,"),
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Arjun & Sandra wedding is tomorrow!",
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-PT2H",
      "ACTION:DISPLAY",
      "DESCRIPTION:Arjun & Sandra wedding starts in 2 hours!",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
  }

  function addToCalendar() {
    if (isMobileView()) {
      openGoogleCalendarApp();
      return "google";
    }
    downloadIcs();
    return "ics";
  }

  function downloadIcs() {
    var ics = buildIcsString();

    var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "arjun-and-sandra-wedding.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () {
      URL.revokeObjectURL(link.href);
    }, 1000);
  }

  /* ─────────────────────────────────────────────────────────────
     8. Floating buttons — calendar (left) and back to top (right)
     ───────────────────────────────────────────────────────────── */
  function initFabs() {
    var cal = $("#fab-calendar");
    var top = $("#fab-top");
    var toast = $("#fab-toast");
    var fabs = [cal, top].filter(Boolean);
    if (!fabs.length) return;

    // Reveal them once the hero is behind you — same trigger as the nav, so the
    // opening view stays uncluttered.
    var onScroll = function () {
      var show = window.scrollY > window.innerHeight * 0.55;
      fabs.forEach(function (el) {
        el.classList.toggle("is-visible", show);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toastTimer = null;
    var announce = function (msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.hidden = false;
      void toast.offsetWidth;
      toast.classList.add("is-on");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toast.classList.remove("is-on");
        setTimeout(function () {
          toast.hidden = true;
        }, 400);
      }, 2600);
    };

    if (cal) {
      cal.addEventListener("click", function () {
        var mode = addToCalendar();
        announce(calendarFeedback(mode));
      });
    }

    if (top) {
      top.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
      });
    }
  }

  /* ─────────────────────────────────────────────────────────────
     9. Music — never autoplays; the guest opts in and we remember.

     Plays assets/audio/wedding-song.mp3 if you drop one in. If that file
     isn't there, it falls back to a soft generative ambience synthesised in
     the browser (Web Audio) — so the button always does something, costs no
     bandwidth, and carries no licensing problem.
     ───────────────────────────────────────────────────────────── */
  var MUSIC_KEY = "arjun-sandra-music";
  var MUSIC_SRC = "assets/audio/wedding-song.mp3";

  // Set by initMusic; called from the entrance overlay's click handler so the
  // browser sees a real user gesture and allows sound. This is how music starts
  // the instant the invitation is opened.
  var startMusicFromGesture = null;

  // Set by initShakePetals; called from a user gesture (the entrance tap) so we
  // can ask iOS for motion permission, which is only grantable from a gesture.
  var enableShakeFromGesture = null;

  function initMusic() {
    var btn = $("#fab-music");
    if (!btn) return;

    var playing = false;
    var audio = null; // the <audio> path
    var synth = null; // the generated-ambience path
    var fadeFrame = null;

    /* ── fade helper (works for either path) ── */
    function fade(get, set, to, ms, done) {
      cancelAnimationFrame(fadeFrame);
      var from = get();
      var start = performance.now();
      (function step(now) {
        var t = Math.min(1, (now - start) / ms);
        set(from + (to - from) * t);
        if (t < 1) fadeFrame = requestAnimationFrame(step);
        else if (done) done();
      })(start);
    }

    /* ── generative ambience: a drone plus slow plucked notes ── */
    function makeSynth() {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;

      var ctx = new Ctx();
      var master = ctx.createGain();
      master.gain.value = 0;

      // a little space, so the notes bloom instead of clicking
      var delay = ctx.createDelay(1.2);
      delay.delayTime.value = 0.42;
      var feedback = ctx.createGain();
      feedback.gain.value = 0.34;
      var tone = ctx.createBiquadFilter();
      tone.type = "lowpass";
      tone.frequency.value = 1800;

      master.connect(tone);
      tone.connect(ctx.destination);
      master.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(tone);

      // Mohanam — the pentatonic that most Kerala temple music lives in
      var scale = [
        261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25,
      ];
      var timer = null;

      function pluck(freq, when, level) {
        var osc = ctx.createOscillator();
        var env = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;

        env.gain.setValueAtTime(0, when);
        env.gain.linearRampToValueAtTime(level, when + 0.06); // soft attack
        env.gain.exponentialRampToValueAtTime(0.0001, when + 3.4);

        osc.connect(env);
        env.connect(master);
        osc.start(when);
        osc.stop(when + 3.5);
      }

      // the tanpura-ish drone underneath it all
      var droneOsc = [],
        droneGain = ctx.createGain();
      droneGain.gain.value = 0.05;
      droneGain.connect(master);
      [130.81, 196.0].forEach(function (f) {
        var o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        o.detune.value = (Math.random() - 0.5) * 8; // gentle beating
        o.connect(droneGain);
        o.start();
        droneOsc.push(o);
      });

      function schedule() {
        var n = scale[Math.floor(Math.random() * scale.length)];
        pluck(n, ctx.currentTime + 0.02, 0.16);
        if (Math.random() < 0.45) {
          // an occasional companion note
          pluck(
            scale[Math.floor(Math.random() * scale.length)] * 2,
            ctx.currentTime + 0.55,
            0.07,
          );
        }
        timer = setTimeout(schedule, 1600 + Math.random() * 1800);
      }

      return {
        /* Reports whether it actually started. A blocked AudioContext leaves
           resume() pending forever rather than rejecting, so we can't await it
           — we kick it and then read ctx.state a moment later. */
        start: function (cb) {
          var settle = function () {
            var running = ctx.state === "running";
            if (running) {
              schedule();
              fade(
                function () {
                  return master.gain.value;
                },
                function (v) {
                  master.gain.value = v;
                },
                0.85,
                1600,
              );
            }
            if (cb) cb(running);
          };

          if (ctx.state === "suspended") {
            try {
              ctx.resume();
            } catch (e) {
              /* blocked until a gesture */
            }
            setTimeout(settle, 260);
          } else {
            settle();
          }
        },
        stop: function (done) {
          clearTimeout(timer);
          fade(
            function () {
              return master.gain.value;
            },
            function (v) {
              master.gain.value = v;
            },
            0,
            700,
            function () {
              if (ctx.state === "running") ctx.suspend();
              if (done) done();
            },
          );
        },
      };
    }

    /* ── start / stop ──
       start() reports back: ok() if sound is actually playing, blocked() if the
       browser refused for want of a user gesture. Those need opposite responses
       — a refusal means "wait for the first interaction", not "give up". */
    function start(ok, blocked) {
      if (audio) {
        audio.muted = false;
        audio.volume = 0;
        var p = audio.play();

        if (!p || !p.then) {
          // ancient browser: assume it went
          fadeInAudio();
          if (ok) ok();
          return;
        }

        p.then(function () {
          fadeInAudio();
          if (ok) ok();
        }).catch(function (err) {
          // NotAllowedError = autoplay policy. Anything else = the file is
          // unusable, so drop to the synth instead of failing silently.
          if (err && err.name === "NotAllowedError") {
            primeMuted();
            if (blocked) blocked();
          } else {
            audio = null;
            startSynth(ok, blocked);
          }
        });
        return;
      }
      startSynth(ok, blocked);
    }

    /* Muted playback IS permitted without a gesture. So when we're refused, we
       still get the track rolling silently — then the first interaction only has
       to unmute it, which is instant. Without this the guest waits for a fresh
       play() + buffer before hearing anything. */
    function primeMuted() {
      if (!audio) return;
      try {
        audio.muted = true;
        var p = audio.play();
        if (p && p.catch)
          p.catch(function () {
            /* even muted was refused; fine */
          });
      } catch (e) {
        /* no-op */
      }
    }

    function fadeInAudio() {
      fade(
        function () {
          return audio.volume;
        },
        function (v) {
          audio.volume = Math.max(0, Math.min(1, v));
        },
        0.7,
        1600,
      );
    }

    function startSynth(ok, blocked) {
      if (!synth) synth = makeSynth();
      if (!synth) {
        if (blocked) blocked();
        return;
      }
      synth.start(function (running) {
        if (running) {
          if (ok) ok();
        } else if (blocked) blocked();
      });
    }

    function stop() {
      if (audio) {
        fade(
          function () {
            return audio.volume;
          },
          function (v) {
            audio.volume = Math.max(0, Math.min(1, v));
          },
          0,
          600,
          function () {
            audio.pause();
          },
        );
      } else if (synth) {
        synth.stop();
      }
    }

    // `persist` is false for autoplay, so a browser block never gets written
    // down as "this guest wants music off".
    function setState(on, persist) {
      playing = on;
      btn.classList.toggle("is-playing", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("data-tip", on ? "Pause music" : "Play music");
      btn.setAttribute("aria-label", on ? "Pause the music" : "Play the music");
      if (persist !== false) {
        try {
          localStorage.setItem(MUSIC_KEY, on ? "on" : "off");
        } catch (e) {
          /* private mode */
        }
      }
    }

    setState(false, false);

    btn.addEventListener("click", function () {
      if (playing) {
        stop();
        setState(false);
      } else {
        start(function () {
          setState(true);
        });
      }
    });

    /* ── autoplay ──────────────────────────────────────────────
       Every major browser refuses to play audio before the guest has
       interacted with the page — there is no flag that turns that off. So:
       try immediately on load, and if we're refused, arm the very first
       interaction (a click, key, tap, scroll or even a mouse move) to start
       the music. For nearly every visitor that means it comes on by itself
       without them ever touching the button.
       ──────────────────────────────────────────────────────────── */
    var armed = false;
    /* ONLY discrete gestures unlock audio. A scroll, wheel or mouse-move does
       NOT count as user activation in any browser, so retrying play() on those
       can never succeed — and the old code cleared the cue and disarmed on them
       anyway, which is exactly why music never started. */
    var GESTURES = ["pointerdown", "mousedown", "touchstart", "keydown", "click"];

    function armFirstGesture() {
      if (armed) return;
      armed = true;

      // let the guest know music is waiting on them
      btn.classList.add("is-waiting");

      var disarm = function () {
        GESTURES.forEach(function (ev) {
          window.removeEventListener(ev, go, true);
        });
      };

      var go = function () {
        // Attempt to start, but only commit (clear cue, remove listeners) if it
        // ACTUALLY plays. If this gesture didn't grant permission, stay armed
        // for the next one instead of silently giving up.
        start(
          function () {
            armed = true;
            disarm();
            btn.classList.remove("is-waiting");
            setState(true);
          },
          function () {
            /* still blocked — leave the listeners in place and try again on the
               next gesture */
          },
        );
      };

      GESTURES.forEach(function (ev) {
        window.addEventListener(ev, go, { capture: true, passive: true });
      });
    }

    function autoplay() {
      var wanted = null;
      try {
        wanted = localStorage.getItem(MUSIC_KEY);
      } catch (e) {
        wanted = null;
      }

      // if they deliberately turned it off before, leave it off
      if (wanted === "off") return;

      start(
        function () {
          setState(true, false);
        }, // the browser allowed it
        armFirstGesture, // blocked — wait for a gesture
      );
    }

    /* Decide which source we have, then autoplay. The probe tells us whether
       the mp3 exists; we autoplay as soon as it answers either way (or after a
       short grace period, in case it answers neither). */
    var decided = false;
    function decide() {
      if (decided) return;
      decided = true;
      autoplay();
    }

    var probe = new Audio();
    probe.preload = "auto"; // it's about to play, so let it buffer
    probe.loop = true;
    probe.src = MUSIC_SRC;
    probe.addEventListener("canplay", function () {
      audio = probe;
      decide();
    });
    probe.addEventListener("error", function () {
      audio = null;
      decide();
    });
    probe.load();
    setTimeout(decide, 1200); // no mp3 and no error event: fall through to the synth

    /* The entrance overlay calls this from inside its click handler. A click is
       a real user gesture, so this play() is always allowed — this is what makes
       music begin the moment the invitation is opened. */
    startMusicFromGesture = function () {
      var wanted = null;
      try {
        wanted = localStorage.getItem(MUSIC_KEY);
      } catch (e) {
        wanted = null;
      }
      if (wanted === "off") return; // they turned it off before — respect that
      if (playing) return;
      btn.classList.remove("is-waiting");
      start(function () {
        setState(true);
      });
    };
  }

  /* ─────────────────────────────────────────────────────────────
     10. Shake the phone → a shower of petals falls from the top

     Uses the accelerometer (DeviceMotionEvent). On iOS 13+ motion access
     needs explicit permission that can ONLY be requested from a user gesture,
     so we ask when the invitation is opened. Needs a secure context (https) on
     the deployed site; on http/file it simply stays dormant.
     ───────────────────────────────────────────────────────────── */
  var PETALS = [
    "assets/images/decorations/petal.svg",
    "assets/images/decorations/petal-lotus.svg",
  ];

  function initShakePetals() {
    var shower = $("#petal-shower");
    if (!shower) return;

    // motion nobody asked for if they've turned motion down, and pointless
    // where there's no accelerometer
    if (REDUCED) return;
    var hasMotion =
      "DeviceMotionEvent" in window || "ondevicemotion" in window;
    if (!hasMotion) return;

    var listening = false;
    var lastBurst = 0;
    var have = false;
    var px = 0,
      py = 0,
      pz = 0;

    var SHAKE_DELTA = 26; // summed accel change that counts as a shake
    var COOLDOWN = 1100; // ms between showers, so a long shake isn't a blizzard

    function onMotion(e) {
      var a =
        e.accelerationIncludingGravity || e.acceleration || null;
      if (!a || a.x == null) return;

      if (have) {
        var delta =
          Math.abs(a.x - px) + Math.abs(a.y - py) + Math.abs(a.z - pz);
        var now = Date.now();
        if (delta > SHAKE_DELTA && now - lastBurst > COOLDOWN) {
          lastBurst = now;
          shed();
        }
      }
      px = a.x;
      py = a.y;
      pz = a.z;
      have = true;
    }

    // one shower of petals
    function shed() {
      var count = 16 + Math.floor(Math.random() * 8); // 16–23
      var frag = document.createDocumentFragment();

      for (var i = 0; i < count; i++) {
        var span = document.createElement("span");
        span.className = "shower-petal";

        var dur = 3.4 + Math.random() * 2.6; // 3.4–6s to reach the bottom
        var delay = Math.random() * 0.5;
        span.style.setProperty("--x", (Math.random() * 100).toFixed(2) + "%");
        span.style.setProperty("--s", dur.toFixed(2) + "s");
        span.style.setProperty("--d", delay.toFixed(2) + "s");
        span.style.setProperty("--sc", (0.5 + Math.random() * 0.7).toFixed(2));

        var img = document.createElement("img");
        img.src = PETALS[Math.floor(Math.random() * PETALS.length)];
        img.alt = "";
        span.appendChild(img);

        // remove it once it has fallen — animationend, plus a safety timeout
        (function (el, ttl) {
          var kill = function () {
            if (el.parentNode) el.parentNode.removeChild(el);
          };
          el.addEventListener("animationend", function (ev) {
            if (ev.animationName === "petal-fall") kill();
          });
          setTimeout(kill, ttl);
        })(span, (dur + delay + 0.6) * 1000);

        frag.appendChild(span);
      }

      shower.appendChild(frag);
    }

    function attach() {
      if (listening) return;
      listening = true;
      window.addEventListener("devicemotion", onMotion, { passive: true });
    }

    // Called from the entrance tap (a user gesture). On iOS this is the only
    // moment we can ask for motion access.
    enableShakeFromGesture = function () {
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function"
      ) {
        DeviceMotionEvent.requestPermission()
          .then(function (state) {
            if (state === "granted") attach();
          })
          .catch(function () {
            /* denied or dismissed — no shake, no harm */
          });
      } else {
        // Android / older iOS: no permission prompt, just listen
        attach();
      }
    };

    // Fallback: if the entrance was removed, arm on the first touch (also a
    // gesture, so iOS permission still works).
    var armOnTouch = function () {
      document.removeEventListener("touchend", armOnTouch);
      if (!listening && enableShakeFromGesture) enableShakeFromGesture();
    };
    document.addEventListener("touchend", armOnTouch, { once: true });
  }

  /* ─────────────────────────────────────────────────────────────
     11. Entrance overlay — "tap to open"

     A page cannot legally play sound on a cold load; the browser blocks it
     until the guest interacts. So the invitation opens behind a single
     "Open Invitation" screen. Tapping it is that first interaction — the
     content reveals AND the music starts together, which is the effect of
     music "playing when the page opens".
     ───────────────────────────────────────────────────────────── */
  function initEntrance() {
    var overlay = $("#entrance");
    if (!overlay) return;

    var openBtn = $("#entrance-open", overlay);
    var opened = false;

    // don't let the page scroll behind the gate
    document.body.classList.add("is-gated");

    // move focus to the open button so keyboard/AT users land on it
    if (openBtn) {
      try {
        openBtn.focus({ preventScroll: true });
      } catch (e) {
        openBtn.focus();
      }
    }

    function open() {
      if (opened) return;
      opened = true;

      // start music AND unlock motion from within this gesture — iOS grants
      // both only in response to a user action, and this tap is it
      if (startMusicFromGesture) startMusicFromGesture();
      if (enableShakeFromGesture) enableShakeFromGesture();

      overlay.classList.add("is-leaving");
      document.body.classList.remove("is-gated");

      var done = function () {
        overlay.hidden = true;
        overlay.removeEventListener("transitionend", done);
      };
      overlay.addEventListener("transitionend", done);
      // fallback in case the transition doesn't fire (reduced motion, etc.)
      setTimeout(done, 900);
    }

    overlay.addEventListener("click", open);
    overlay.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        open();
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     Boot
     ───────────────────────────────────────────────────────────── */
  function boot() {
    document.documentElement.classList.remove("no-js");
    initReveal();
    initNav();
    initScrollTo();
    initCountdown();
    initRsvp();
    initGarlandCurtain();
    initShare();
    initFabs();
    initMusic();
    initShakePetals(); // sets the shake hook…
    initEntrance(); // …which the entrance tap then fires
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
