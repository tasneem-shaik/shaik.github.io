/* ============================================================
   CYBERPUNK EFFECTS — Tasneem Portfolio
   Features: custom cursor, particles, glitch, scroll reveal,
             3D tilt, neon glow, scanlines, magnetic hover
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR
  ---------------------------------------------------------- */
  const dot  = document.getElementById('cyber-cursor');
  const ring = document.getElementById('cyber-cursor-ring');

  if (dot && ring) {
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    // Ring lags behind with lerp
    (function loopRing() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(loopRing);
    })();

    // Hover state — enlarge ring on interactive elements
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, input, textarea, select, label, .ico-circle, .back-to-top, .mobile-nav-toggle')) {
        dot.classList.add('hov');
        ring.classList.add('hov');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, input, textarea, select, label, .ico-circle, .back-to-top, .mobile-nav-toggle')) {
        dot.classList.remove('hov');
        ring.classList.remove('hov');
      }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function () {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });
  }

  /* ----------------------------------------------------------
     2. PARTICLE BACKGROUND
  ---------------------------------------------------------- */
  var canvas = document.getElementById('particle-canvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var W, H, particles = [];
    var PARTICLE_COUNT = 110;
    var CONNECTION_DIST = 90;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function randBetween(a, b) { return a + Math.random() * (b - a); }

    function Particle() {
      this.reset = function () {
        this.x     = randBetween(0, W);
        this.y     = randBetween(0, H);
        this.vx    = randBetween(-0.35, 0.35);
        this.vy    = randBetween(-0.35, 0.35);
        this.r     = randBetween(0.4, 1.6);
        this.alpha = randBetween(0.1, 0.5);
        this.life  = randBetween(120, 280);
        this.maxL  = this.life;
        this.cyan  = Math.random() > 0.45; // true = cyan, false = magenta
      };
      this.reset();
    }

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);

      // Draw connections first
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx   = particles[a].x - particles[b].x;
          var dy   = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            var alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(0,255,255,' + alpha + ')';
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (var j = 0; j < particles.length; j++) {
        var p    = particles[j];
        var fade = p.life / p.maxL;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0 || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) {
          p.reset();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        var color = p.cyan ? '0,255,255' : '255,0,255';
        ctx.fillStyle = 'rgba(' + color + ',' + (p.alpha * fade) + ')';
        ctx.fill();
      }

      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ----------------------------------------------------------
     3. SCROLL REVEAL (IntersectionObserver)
  ---------------------------------------------------------- */
  // Auto-assign reveal classes to key sections
  function assignRevealClasses() {
    // About section columns
    var aboutLeft  = document.querySelector('.about-mf .col-md-6:first-child');
    var aboutRight = document.querySelector('.about-mf .col-md-6:last-child');
    if (aboutLeft)  { aboutLeft.classList.add('cy-reveal-left'); }
    if (aboutRight) { aboutRight.classList.add('cy-reveal-right'); }

    // About box wrapper
    var aboutBox = document.querySelector('.about-mf .box-shadow-full');
    if (aboutBox) { aboutBox.classList.add('cy-reveal'); }

    // Contact box
    var contactBox = document.querySelector('.contact-mf .box-shadow-full');
    if (contactBox) { contactBox.classList.add('cy-reveal'); }

    // Skill bars individually with stagger
    var skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(function (bar, idx) {
      bar.classList.add('cy-reveal');
      if (idx < 4) bar.classList.add('cy-delay-' + (idx + 1));
    });
  }
  assignRevealClasses();

  // Observe all cy-reveal* elements
  function setupObserver() {
    var revealEls = document.querySelectorAll('.cy-reveal, .cy-reveal-left, .cy-reveal-right');
    if (!revealEls.length || !window.IntersectionObserver) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('cy-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { obs.observe(el); });
  }
  setupObserver();

  /* ----------------------------------------------------------
     4. 3D TILT EFFECT ON CARDS
  ---------------------------------------------------------- */
  function setupTilt() {
    var cards = document.querySelectorAll('.box-shadow-full');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var cx   = rect.left + rect.width  / 2;
        var cy   = rect.top  + rect.height / 2;
        var dx   = (e.clientX - cx) / (rect.width  / 2);
        var dy   = (e.clientY - cy) / (rect.height / 2);
        var rx   = -dy * 10;
        var ry   =  dx * 10;
        card.style.transform  = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale3d(1.015,1.015,1.015)';
        card.style.boxShadow  =
          (-dx * 8) + 'px ' + (-dy * 8) + 'px 30px rgba(0,255,255,0.18),' +
          ( dx * 8) + 'px ' + ( dy * 8) + 'px 30px rgba(255,0,255,0.10)';
        card.style.borderColor = 'rgba(0,255,255,' + (0.18 + Math.abs(dx) * 0.25) + ')';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition  = 'transform .5s ease, box-shadow .5s ease, border-color .5s ease';
        card.style.transform   = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        card.style.boxShadow   = '';
        card.style.borderColor = '';
        setTimeout(function () { card.style.transition = ''; }, 520);
      });
    });
  }
  setupTilt();

  /* ----------------------------------------------------------
     5. MAGNETIC HOVER ON NAV LINKS & BUTTONS
  ---------------------------------------------------------- */
  function setupMagnetic() {
    var targets = document.querySelectorAll(
      '.navbar a, .back-to-top, .socials .ico-circle'
    );
    targets.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var cx   = rect.left + rect.width  / 2;
        var cy   = rect.top  + rect.height / 2;
        var dx   = (e.clientX - cx) * 0.38;
        var dy   = (e.clientY - cy) * 0.38;
        el.style.transition = 'transform .08s ease';
        el.style.transform  = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
        el.style.transform  = 'translate(0,0)';
      });
    });
  }
  setupMagnetic();

  /* ----------------------------------------------------------
     6. GLITCH TEXT — add data-text attribute automatically
  ---------------------------------------------------------- */
  function setupGlitch() {
    var glitchEls = document.querySelectorAll('.glitch');
    glitchEls.forEach(function (el) {
      if (!el.dataset.text) {
        el.dataset.text = el.textContent;
      }
    });
  }
  setupGlitch();

  /* ----------------------------------------------------------
     7. LOGO NEON FLICKER
  ---------------------------------------------------------- */
  function setupFlicker() {
    var logo = document.querySelector('#header .logo a');
    if (!logo) return;
    setInterval(function () {
      if (Math.random() > 0.72) {
        logo.style.animation = 'neon-flicker .18s steps(1)';
        setTimeout(function () { logo.style.animation = ''; }, 200);
      }
    }, 2800);
  }
  setupFlicker();

  /* ----------------------------------------------------------
     8. NEON GLOW PULSE on skill bars on reveal
  ---------------------------------------------------------- */
  // Progress bars animate width from 0 when revealed
  function setupProgressBars() {
    var bars = document.querySelectorAll('.progress-bar');
    var stored = [];
    bars.forEach(function (bar) {
      var w = bar.style.width;
      bar.style.width = '0%';
      stored.push({ el: bar, target: w });
    });

    if (!window.IntersectionObserver) {
      stored.forEach(function (s) { s.el.style.width = s.target; });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var info = stored.find(function (s) { return s.el === bar; });
          if (info) {
            bar.style.transition = 'width 1.2s cubic-bezier(.22,1,.36,1)';
            bar.style.width = info.target;
          }
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    stored.forEach(function (s) { obs.observe(s.el); });
  }
  setupProgressBars();

})();
