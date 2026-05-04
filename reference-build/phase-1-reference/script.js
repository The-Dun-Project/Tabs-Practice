/* ============================================================
   script.js — Phase 1
   Foundation: static tabs, sliding indicator, fade transition

   This file is linked at the BOTTOM of index.html, just before
   </body>. That means all the HTML elements have already loaded
   by the time this code runs — so we can safely find and
   interact with them.
============================================================ */


/* ============================================================
   STEP 1 — GRAB THE ELEMENTS
   We find the elements we need from the HTML and store them
   in variables so we can reference them throughout this file.

   querySelectorAll() finds EVERY element matching a CSS selector.
   Returns a NodeList — works like an array.

   getElementById() finds the ONE element with that exact id.
============================================================ */
var tabButtons = document.querySelectorAll('.tab-btn');
var tabPanels  = document.querySelectorAll('.tab-panel');
var indicator  = document.getElementById('tab-indicator');


/* ============================================================
   STEP 2 — THE moveIndicator FUNCTION
   A function is a reusable block of code. Define it once,
   call it whenever you need it.

   It takes one argument: btn — the button we want the
   indicator bar to sit underneath.

   It measures where that button is on screen, then updates
   the indicator's CSS transform to match that position and size.
============================================================ */
function moveIndicator(btn) {

  /* getBoundingClientRect() measures an element's size and
     position relative to the viewport (the visible browser window).
     Returns: { top, left, right, bottom, width, height } */
  var btnRect  = btn.getBoundingClientRect();

  /* btn.closest('.tab-list') walks UP the DOM from the button
     and returns the nearest parent matching '.tab-list'.
     We measure it to calculate a position relative to the list,
     not relative to the screen edge. */
  var listRect = btn.closest('.tab-list').getBoundingClientRect();

  /* Subtract the list's left from the button's left to get
     how far the button is from the list's own left edge.

     Example:
       listRect.left = 40   (the list starts 40px from screen left)
       btnRect.left  = 160  (the button starts 160px from screen left)
       offsetLeft    = 120  (the button is 120px inside the list) */
  var offsetLeft = btnRect.left - listRect.left;

  /* The button's width — the indicator must match it */
  var width = btnRect.width;

  /* Apply both values as a CSS transform on the indicator.
     The indicator is 1px wide in CSS.

       translateX(offsetLeft) → slides it to the button's position
       scaleX(width)          → stretches it from 1px to the button's width

     The CSS transition property on .tab-indicator automatically
     animates between the old transform value and the new one.
     We just set the new value — CSS handles the smooth movement. */
  indicator.style.transform =
    'translateX(' + offsetLeft + 'px) scaleX(' + width + ')';
}


/* ============================================================
   STEP 3 — SET THE INITIAL INDICATOR POSITION
   On page load the first tab already has .active in the HTML.
   We need to position the indicator under it immediately —
   otherwise it would start stuck at the top-left corner.

   querySelector() (no "All") returns only the FIRST match.
============================================================ */
var firstActiveBtn = document.querySelector('.tab-btn.active');
moveIndicator(firstActiveBtn);


/* ============================================================
   STEP 4 — ATTACH CLICK LISTENERS TO EVERY BUTTON
   forEach() loops over every item in the NodeList.
   For each button, addEventListener says:
   "when this button is clicked, run this function."
============================================================ */
tabButtons.forEach(function(btn) {

  btn.addEventListener('click', function() {

    /* ── CLEAR EVERYTHING FIRST ──────────────────────────────
       The pattern: wipe the slate clean, then set only
       what you want. Safer than tracking the previous active
       element and only updating that one.

       We loop ALL buttons → remove .active from each.
       We loop ALL panels  → remove .active from each.
    ──────────────────────────────────────────────────────── */
    tabButtons.forEach(function(b) {
      b.classList.remove('active');
    });

    tabPanels.forEach(function(p) {
      p.classList.remove('active');
    });

    /* ── ACTIVATE THE CLICKED BUTTON ─────────────────────────
       btn is the specific button that was clicked.
       We add .active back to just this one.
    ──────────────────────────────────────────────────────── */
    btn.classList.add('active');

    /* ── ACTIVATE THE MATCHING PANEL ─────────────────────────
       btn.dataset.tab reads the data-tab="..." attribute.
       For example: data-tab="process" → dataset.tab = "process"

       We pass that string to getElementById() to find the
       panel with id="process", then add .active to show it.

       Full flow example:
         User clicks <button data-tab="process">Process</button>
         btn.dataset.tab → "process"
         getElementById("process") → <div id="process" class="tab-panel">
         .classList.add('active') → panel fades in via CSS transition
    ──────────────────────────────────────────────────────── */
    var targetId    = btn.dataset.tab;
    var targetPanel = document.getElementById(targetId);
    targetPanel.classList.add('active');

    /* ── MOVE THE INDICATOR ──────────────────────────────────
       Pass the clicked button to our function.
       It measures the button and updates the transform.
       The CSS transition on .tab-indicator does the slide.
    ──────────────────────────────────────────────────────── */
    moveIndicator(btn);

  }); /* end click listener */

}); /* end forEach */