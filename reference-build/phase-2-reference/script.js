/* ============================================================
   script.js — Phase 2
   Transitions: directional slide, animated height, keyboard nav

   Three separate components, each wrapped in its own IIFE.
   An IIFE (Immediately Invoked Function Expression) runs
   immediately and keeps variables private so they don't
   conflict with variables in the other sections.

   Syntax:
     (function() {
       var x = 1;   ← x only exists inside here
     })();
============================================================ */


/* ============================================================
   UTILITY — moveIndicator
   Shared by all three components.
   Measures a button's position and width, then moves an
   indicator bar to sit underneath it using CSS transform.
============================================================ */
function moveIndicator(btn, indicator) {
  var btnRect  = btn.getBoundingClientRect();
  var listRect = btn.closest('[role="tablist"]').getBoundingClientRect();
  var offsetLeft = btnRect.left - listRect.left;
  var width      = btnRect.width;

  /* translateX moves the indicator horizontally.
     scaleX stretches it from its 1px base width.
     CSS transition on the indicator animates the change. */
  indicator.style.transform =
    'translateX(' + offsetLeft + 'px) scaleX(' + width + ')';
}


/* ============================================================
   DAYS 6–7 — DIRECTIONAL SLIDE TABS
   Component: #slide-tabs

   New concept — directional state:
   We track the currently active tab's index (0, 1, or 2).
   When a new tab is clicked, we compare old index vs new index.
   The difference tells us which direction the user navigated.

   New index > current index → user went RIGHT
     Outgoing panel gets: .slide-exit-left
     Incoming panel gets: .slide-enter-left (starts from right side)

   New index < current index → user went LEFT
     Outgoing panel gets: .slide-exit-right
     Incoming panel gets: .slide-enter-right (starts from left side)

   requestAnimationFrame — why do we use it?
   When we add the enter class (starting position) and then
   immediately add .active (end position), the browser can skip
   the starting position entirely and jump straight to the end.
   requestAnimationFrame tells the browser to wait until the
   next paint before applying .active — giving the enter class
   time to actually register as the starting point.
   We call it twice to be safe across all browsers.
============================================================ */
(function() {

  var component = document.getElementById('slide-tabs');
  if (!component) return;

  var buttons   = component.querySelectorAll('.tab-btn');
  var panels    = component.querySelectorAll('.slide-panel');
  var indicator = component.querySelector('.slide-indicator');

  /* Track which index is currently active — starts at 0 */
  var currentIndex = 0;

  /* Set initial indicator position */
  var activeBtn = component.querySelector('.tab-btn.active');
  if (activeBtn && indicator) moveIndicator(activeBtn, indicator);

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {

      var newIndex = parseInt(btn.dataset.index);

      /* Do nothing if clicking the already-active tab */
      if (newIndex === currentIndex) return;

      /* True if user went right (higher index), false if left */
      var goingRight = newIndex > currentIndex;

      /* Find the currently active panel */
      var currentPanel = component.querySelector('.slide-panel.active');
      var newPanel      = document.getElementById(btn.dataset.tab);

      /* Apply exit class to the outgoing panel */
      if (currentPanel) {
        currentPanel.classList.remove('active');
        currentPanel.classList.add(goingRight ? 'slide-exit-left' : 'slide-exit-right');
      }

      /* Apply the starting enter class to the incoming panel */
      newPanel.classList.add(goingRight ? 'slide-enter-left' : 'slide-enter-right');

      /* Wait for the browser to register the enter class (starting
         position) before activating the panel (end position).
         Without this pause, the browser skips the animation. */
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          newPanel.classList.remove('slide-enter-left', 'slide-enter-right');
          newPanel.classList.add('active');
        });
      });

      /* Remove exit classes after animation finishes (matches 0.4s in CSS) */
      if (currentPanel) {
        setTimeout(function() {
          currentPanel.classList.remove('slide-exit-left', 'slide-exit-right');
        }, 400);
      }

      /* Update active button */
      buttons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      /* Move indicator */
      if (indicator) moveIndicator(btn, indicator);

      /* Store the new index as current */
      currentIndex = newIndex;

    });
  });

})();


/* ============================================================
   DAY 8 — ANIMATED HEIGHT TABS
   Component: #height-tabs

   New concept — reading scrollHeight:
   scrollHeight is the full content height of an element,
   even when it is hidden (opacity: 0, visibility: hidden).
   offsetHeight would return 0 for hidden elements — useless here.

   The flow on every tab click:
     1. Hide current panel (remove .active)
     2. Show new panel (add .active)
     3. Read new panel's scrollHeight
     4. Set that value as explicit pixel height on the container
     5. CSS transition animates the container height change
============================================================ */
(function() {

  var component = document.getElementById('height-tabs');
  if (!component) return;

  var buttons   = component.querySelectorAll('.tab-btn');
  var panels    = component.querySelectorAll('.height-panel');
  var container = component.querySelector('.height-panels');
  var indicator = component.querySelector('.height-indicator');

  /* Sets the container's height to match a given panel's content */
  function setHeight(panel) {
    /* scrollHeight = full content height regardless of visibility */
    container.style.height = panel.scrollHeight + 'px';
  }

  /* Set initial height to match the active panel on load */
  var activePanel = component.querySelector('.height-panel.active');
  if (activePanel) setHeight(activePanel);

  /* Set initial indicator position */
  var activeBtn = component.querySelector('.tab-btn.active');
  if (activeBtn && indicator) moveIndicator(activeBtn, indicator);

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {

      /* Clear all active states */
      buttons.forEach(function(b) { b.classList.remove('active'); });
      panels.forEach(function(p)  { p.classList.remove('active'); });

      /* Activate clicked button and its panel */
      btn.classList.add('active');
      var target = document.getElementById(btn.dataset.tab);
      target.classList.add('active');

      /* Update the container height to match the new panel.
         CSS transition on .height-panels animates this change. */
      setHeight(target);

      /* Move indicator */
      if (indicator) moveIndicator(btn, indicator);

    });
  });

})();


/* ============================================================
   DAYS 9–10 — KEYBOARD NAVIGATION TABS
   Component: #keyboard-tabs

   New concepts:

   tabindex="0"  → element is part of the natural tab order.
                   The Tab key will reach it.
   tabindex="-1" → element is removed from the natural tab order.
                   The Tab key skips it, but JavaScript can still
                   call .focus() on it directly.

   We use the "roving tabindex" pattern:
     Only the active button has tabindex="0".
     All others have tabindex="-1".
     When a new tab is activated, we update tabindex accordingly.
   This means one Tab press focuses the component, then arrow
   keys navigate within it — standard accessible tab behavior.

   aria-selected → tells screen readers which tab is currently
   active. "true" on the active tab, "false" on all others.

   Wrapping with modulo (%):
     (currentIndex + 1) % total  → wraps 2 → 0 when going right
     (currentIndex - 1 + total) % total → wraps 0 → 2 going left
     The + total before % prevents negative numbers.
============================================================ */
(function() {

  var component = document.getElementById('keyboard-tabs');
  if (!component) return;

  /* Array.from converts NodeList to a real Array.
     We need a real Array to use .findIndex() later. */
  var buttons   = Array.from(component.querySelectorAll('.tab-btn'));
  var panels    = component.querySelectorAll('.tab-panel');
  var indicator = component.querySelector('.keyboard-indicator');
  var tablist   = document.getElementById('keyboard-tablist');

  /* Set initial indicator position */
  var activeBtn = component.querySelector('.tab-btn.active');
  if (activeBtn && indicator) moveIndicator(activeBtn, indicator);

  /* activateTab — centralizes all the logic for switching tabs.
     Called both by click and by keyboard navigation. */
  function activateTab(index) {
    var btn = buttons[index];

    /* Update all buttons */
    buttons.forEach(function(b, i) {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
      /* Roving tabindex: only the active button is in tab order */
      b.setAttribute('tabindex', i === index ? '0' : '-1');
    });

    /* Update all panels */
    panels.forEach(function(p) { p.classList.remove('active'); });

    /* Activate the target button and its panel */
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById(btn.dataset.tab).classList.add('active');

    /* Move indicator */
    if (indicator) moveIndicator(btn, indicator);
  }

  /* Click handler — calls activateTab with the button's index */
  buttons.forEach(function(btn, index) {
    btn.addEventListener('click', function() {
      activateTab(index);
    });
  });

  /* Keyboard handler — listens on the tab list container */
  tablist.addEventListener('keydown', function(event) {

    /* Find the index of the currently active button */
    var currentIndex = buttons.findIndex(function(b) {
      return b.classList.contains('active');
    });

    var newIndex;

    if (event.key === 'ArrowRight') {
      /* % buttons.length wraps the last index back to 0 */
      newIndex = (currentIndex + 1) % buttons.length;

    } else if (event.key === 'ArrowLeft') {
      /* + buttons.length before % stops the result going negative */
      newIndex = (currentIndex - 1 + buttons.length) % buttons.length;

    } else {
      return;   /* any other key — ignore it, don't interfere */
    }

    /* Prevent the page from scrolling when arrow keys are pressed */
    event.preventDefault();

    /* Activate the new tab */
    activateTab(newIndex);

    /* Move browser focus to the newly activated button */
    buttons[newIndex].focus();

  });

})();