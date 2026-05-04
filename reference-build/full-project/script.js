/* ============================================================
   script.js — Full 14-Day Tab Project
   All interactivity for every tab component on the page.

   This file is organized in sections matching the phases:
     1. Utility function — moveIndicator (shared by all)
     2. Phase 1 — Main tabs (static, indicator, fade)
     3. Phase 2 — Directional slide tabs
     4. Phase 2 — Animated height tabs
     5. Phase 2 — Keyboard navigation tabs
     6. Phase 3 — Easing playground
     7. Phase 3 — Pill tabs variant
     8. Phase 3 — Vertical tabs variant
============================================================ */


/* ============================================================
   UTILITY — moveIndicator
   Reused by most components. Measures a button's position
   and width, then moves an indicator bar to match it.

   btn       → the button to align under
   indicator → the indicator element to move

   How it works:
     getBoundingClientRect() measures position on screen.
     We subtract the parent list's left position to get
     the offset relative to the list, not the screen.
     Then we apply translateX + scaleX via CSS transform.
============================================================ */
function moveIndicator(btn, indicator) {
  var btnRect  = btn.getBoundingClientRect();
  var listRect = btn.closest('[role="tablist"]').getBoundingClientRect();
  var offsetLeft = btnRect.left - listRect.left;
  var width      = btnRect.width;

  /* translateX moves it horizontally.
     scaleX stretches from its 1px base width.
     transform-origin: left in CSS makes it scale from the left edge. */
  indicator.style.transform =
    'translateX(' + offsetLeft + 'px) scaleX(' + width + ')';
}


/* ============================================================
   PHASE 1 — MAIN TABS (Days 1–5)
   Handles: class toggling, sliding indicator, fade transition.
   Component: #main-tabs
============================================================ */
(function() {

  /* Wrap in an IIFE (Immediately Invoked Function Expression).
     The parentheses wrap the function, the () at the end runs it.
     This keeps our variables private — they don't conflict with
     variables in other sections that have the same names. */

  var component = document.getElementById('main-tabs');
  if (!component) return;   /* safety check — stop if not found */

  var buttons   = component.querySelectorAll('.tab-btn');
  var panels    = component.querySelectorAll('.tab-panel');
  var indicator = document.getElementById('tab-indicator');

  /* Set indicator position on page load */
  var activeBtn = component.querySelector('.tab-btn.active');
  if (activeBtn) moveIndicator(activeBtn, indicator);

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {

      /* Clear all active states */
      buttons.forEach(function(b) { b.classList.remove('active'); });
      panels.forEach(function(p)  { p.classList.remove('active'); });

      /* Activate clicked button and its matching panel */
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');

      /* Move indicator */
      moveIndicator(btn, indicator);
    });
  });

})();


/* ============================================================
   PHASE 2 — DIRECTIONAL SLIDE TABS (Days 6–7)
   Panels slide left or right based on navigation direction.
   Component: #slide-tabs

   Direction logic:
     If new tab index > current index → user went RIGHT
       Old panel exits LEFT  (.slide-exit-left)
       New panel enters from RIGHT (.slide-enter-left)
     If new tab index < current index → user went LEFT
       Old panel exits RIGHT (.slide-exit-right)
       New panel enters from LEFT (.slide-enter-right)
============================================================ */
(function() {

  var component = document.getElementById('slide-tabs');
  if (!component) return;

  var buttons   = component.querySelectorAll('.tab-btn');
  var panels    = component.querySelectorAll('.slide-panel');
  var indicator = component.querySelector('.slide-indicator');

  /* Track which index is currently active */
  var currentIndex = 0;

  var activeBtn = component.querySelector('.tab-btn.active');
  if (activeBtn && indicator) moveIndicator(activeBtn, indicator);

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {

      var newIndex = parseInt(btn.dataset.index);

      /* Don't do anything if clicking the already-active tab */
      if (newIndex === currentIndex) return;

      /* Determine direction */
      var goingRight = newIndex > currentIndex;

      /* Find the currently active panel */
      var currentPanel = component.querySelector('.slide-panel.active');
      var newPanel      = document.getElementById(btn.dataset.tab);

      /* Apply exit class to outgoing panel */
      if (currentPanel) {
        currentPanel.classList.remove('active');
        currentPanel.classList.add(goingRight ? 'slide-exit-left' : 'slide-exit-right');
      }

      /* Apply enter class to incoming panel, then activate it */
      newPanel.classList.add(goingRight ? 'slide-enter-left' : 'slide-enter-right');

      /* requestAnimationFrame waits for the browser to paint the
         enter class (starting position) before adding .active.
         Without this pause, the browser skips straight to the
         end state and the animation doesn't play. */
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          newPanel.classList.remove('slide-enter-left', 'slide-enter-right');
          newPanel.classList.add('active');
        });
      });

      /* Clean up exit classes after animation finishes (400ms matches CSS) */
      if (currentPanel) {
        setTimeout(function() {
          currentPanel.classList.remove('slide-exit-left', 'slide-exit-right');
        }, 400);
      }

      /* Update buttons */
      buttons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      /* Move indicator */
      if (indicator) moveIndicator(btn, indicator);

      /* Update current index */
      currentIndex = newIndex;
    });
  });

})();


/* ============================================================
   PHASE 2 — ANIMATED HEIGHT TABS (Day 8)
   Container height animates when panels have different sizes.
   Component: #height-tabs

   How it works:
     1. Read the incoming panel's scrollHeight (its natural height).
     2. Set that value as an explicit pixel height on the container.
     3. CSS transition on the container animates the change.

   Why scrollHeight and not offsetHeight?
     scrollHeight includes the full content height even if the
     element is hidden. offsetHeight returns 0 for hidden elements.
============================================================ */
(function() {

  var component = document.getElementById('height-tabs');
  if (!component) return;

  var buttons   = component.querySelectorAll('.tab-btn');
  var panels    = component.querySelectorAll('.height-panel');
  var container = component.querySelector('.height-panels');
  var indicator = component.querySelector('.height-indicator');

  /* Set initial container height to match the active panel */
  function setHeight(panel) {
    container.style.height = panel.scrollHeight + 'px';
  }

  var activePanel = component.querySelector('.height-panel.active');
  if (activePanel) setHeight(activePanel);

  var activeBtn = component.querySelector('.tab-btn.active');
  if (activeBtn && indicator) moveIndicator(activeBtn, indicator);

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {

      buttons.forEach(function(b) { b.classList.remove('active'); });
      panels.forEach(function(p)  { p.classList.remove('active'); });

      btn.classList.add('active');

      var target = document.getElementById(btn.dataset.tab);
      target.classList.add('active');

      /* Update height to match the new panel's content */
      setHeight(target);

      if (indicator) moveIndicator(btn, indicator);
    });
  });

})();


/* ============================================================
   PHASE 2 — KEYBOARD NAVIGATION TABS (Days 9–10)
   Arrow keys navigate between tabs.
   Component: #keyboard-tabs

   New concepts:
     keydown event    → fires when any key is pressed
     event.key        → which key was pressed (e.g. "ArrowRight")
     .focus()         → programmatically moves focus to an element
     tabindex         → controls which elements are keyboard-reachable
     aria-selected    → tells screen readers which tab is active

   Wrapping logic:
     If on the last tab and pressing right → go to index 0
     If on the first tab and pressing left → go to last index
     We use the modulo operator (%) to handle this cleanly.
============================================================ */
(function() {

  var component = document.getElementById('keyboard-tabs');
  if (!component) return;

  var buttons   = Array.from(component.querySelectorAll('.tab-btn'));
  var panels    = component.querySelectorAll('.tab-panel');
  var indicator = component.querySelector('.keyboard-indicator');
  var tablist   = document.getElementById('keyboard-tablist');

  var activeBtn = component.querySelector('.tab-btn.active');
  if (activeBtn && indicator) moveIndicator(activeBtn, indicator);

  /* Activate a tab by its index */
  function activateTab(index) {
    var btn = buttons[index];

    buttons.forEach(function(b, i) {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
      /* Only the active tab is in the natural tab order.
         Others use -1 so Tab key skips them. */
      b.setAttribute('tabindex', i === index ? '0' : '-1');
    });

    panels.forEach(function(p) { p.classList.remove('active'); });

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    btn.setAttribute('tabindex', '0');

    document.getElementById(btn.dataset.tab).classList.add('active');

    if (indicator) moveIndicator(btn, indicator);
  }

  /* Click handler — works the same as other components */
  buttons.forEach(function(btn, index) {
    btn.addEventListener('click', function() {
      activateTab(index);
    });
  });

  /* Keyboard handler — listen on the tab list container */
  tablist.addEventListener('keydown', function(event) {

    /* Find which button is currently active */
    var currentIndex = buttons.findIndex(function(b) {
      return b.classList.contains('active');
    });

    var newIndex;

    if (event.key === 'ArrowRight') {
      /* % buttons.length wraps 3 back to 0 */
      newIndex = (currentIndex + 1) % buttons.length;
    } else if (event.key === 'ArrowLeft') {
      /* + buttons.length before % prevents negative numbers */
      newIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    } else {
      return;   /* any other key — do nothing */
    }

    /* Prevent the page from scrolling when arrow keys are pressed */
    event.preventDefault();

    activateTab(newIndex);

    /* Move focus to the newly activated button */
    buttons[newIndex].focus();
  });

})();


/* ============================================================
   PHASE 3 — EASING PLAYGROUND (Days 11–12)
   Two separate pieces:
     1. The easing selector buttons — change data-easing on the component
     2. The tabs inside the component — work like Phase 1
============================================================ */
(function() {

  /* ── Easing selector ── */
  var easingBtns    = document.querySelectorAll('.easing-btn');
  var easingComponent = document.getElementById('easing-tabs');

  easingBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      easingBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      /* Set the data-easing attribute on the component.
         CSS attribute selectors in style.css read this value
         and apply the matching transition-timing-function. */
      if (easingComponent) {
        easingComponent.setAttribute('data-easing', btn.dataset.easing);
      }
    });
  });

  /* ── Easing tabs ── */
  var component = document.getElementById('easing-tabs');
  if (!component) return;

  var buttons   = component.querySelectorAll('.tab-btn');
  var panels    = component.querySelectorAll('.tab-panel');
  var indicator = document.getElementById('easing-indicator');

  var activeBtn = component.querySelector('.tab-btn.active');
  if (activeBtn && indicator) moveIndicator(activeBtn, indicator);

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      buttons.forEach(function(b) { b.classList.remove('active'); });
      panels.forEach(function(p)  { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
      if (indicator) moveIndicator(btn, indicator);
    });
  });

})();


/* ============================================================
   PHASE 3 — PILL TABS VARIANT (Day 14)
   The pill indicator slides BEHIND the button text.
   Component: #pill-tabs

   The moveIndicator function works the same way.
   The difference is entirely in the CSS — the indicator
   is styled as a filled rounded rectangle instead of a line.
============================================================ */
(function() {

  var component = document.getElementById('pill-tabs');
  if (!component) return;

  var buttons   = component.querySelectorAll('.pill-btn');
  var panels    = component.querySelectorAll('.tab-panel');
  var indicator = document.getElementById('pill-indicator');

  /* movePillIndicator works like moveIndicator but reads the
     pill-list as the reference container (not a [role="tablist"]). */
  function movePillIndicator(btn) {
    var btnRect  = btn.getBoundingClientRect();
    var listRect = component.querySelector('.pill-list').getBoundingClientRect();
    var offsetLeft = btnRect.left - listRect.left;
    var width      = btnRect.width;
    indicator.style.transform =
      'translateX(' + offsetLeft + 'px) scaleX(' + width + ')';
  }

  var activeBtn = component.querySelector('.pill-btn.active');
  if (activeBtn && indicator) movePillIndicator(activeBtn);

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      buttons.forEach(function(b) { b.classList.remove('active'); });
      panels.forEach(function(p)  { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
      movePillIndicator(btn);
    });
  });

})();


/* ============================================================
   PHASE 3 — VERTICAL TABS VARIANT (Day 14)
   Tabs on the left, content on the right.
   Component: #vertical-tabs

   The JavaScript is identical to Phase 1.
   No indicator to move — the active state is just a border-right
   on the button, handled purely by CSS with .active.
============================================================ */
(function() {

  var component = document.getElementById('vertical-tabs');
  if (!component) return;

  var buttons = component.querySelectorAll('.vertical-tab-btn');
  var panels  = component.querySelectorAll('.tab-panel');

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      buttons.forEach(function(b) { b.classList.remove('active'); });
      panels.forEach(function(p)  { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

})();