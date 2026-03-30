/* ============================================================
   PORTFOLIO — main.js
   Alex Dlamini · ICT Multimedia Application Designer
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ======================================================
     1. CUSTOM CURSOR
     ====================================================== */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth ring lag
  function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursorRing);
  }
  animateCursorRing();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .project-card, .service-card, .price-card, .skill-chip, .strip-card, .filter-btn, .social-btn'
  );

  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorRing.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorRing.classList.remove('hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorRing.style.opacity = '0.6';
  });


  /* ======================================================
     2. NAVIGATION — scroll shrink + active link + hamburger
     ====================================================== */
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const sections  = document.querySelectorAll('section');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  // Shrink nav on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  });

  // Highlight active nav link based on scroll position
  function updateActiveLink() {
    let current = '';

    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu when a nav link is clicked (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });


  /* ======================================================
     3. SCROLL REVEAL (Intersection Observer)
     ====================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ======================================================
     4. AUTO-SCROLLING STRIP (Portfoliobox style)
     Smooth infinite horizontal scroll with pause on hover
     ====================================================== */
  const strip = document.getElementById('scrollStrip');

  if (strip) {
    let scrollPos  = 0;
    const speed    = 0.6;   // px per frame — adjust for faster/slower
    let isPaused   = false;
    let rafId      = null;

    // Total width of ONE set of cards (half the strip since cards are doubled)
    function getHalfWidth() {
      return strip.scrollWidth / 2;
    }

    function animateStrip() {
      if (!isPaused) {
        scrollPos += speed;
        // Reset seamlessly when we've scrolled exactly half
        if (scrollPos >= getHalfWidth()) {
          scrollPos = 0;
        }
        strip.style.transform = `translateX(-${scrollPos}px)`;
        // Override CSS animation since JS controls it now
        strip.style.animation = 'none';
      }
      rafId = requestAnimationFrame(animateStrip);
    }

    // Start after brief delay (allows layout to settle)
    setTimeout(() => {
      animateStrip();
    }, 500);

    // Pause on hover
    strip.addEventListener('mouseenter', () => { isPaused = true; });
    strip.addEventListener('mouseleave', () => { isPaused = false; });

    // Pause when tab is hidden (performance)
    document.addEventListener('visibilitychange', () => {
      isPaused = document.hidden;
    });
  }


  /* ======================================================
     5. PORTFOLIO FILTER
     ====================================================== */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cards with animation
      projectCards.forEach(card => {
        const cat = card.dataset.cat;
        const match = filter === 'all' || cat === filter;

        if (match) {
          card.style.display = '';
          // Re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity    = '1';
              card.style.transform  = 'translateY(0)';
            });
          });
        } else {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 350);
        }
      });
    });
  });


  /* ======================================================
     6. CONTACT FORM
     ====================================================== */
  const contactForm = document.getElementById('contactForm');
  const successMsg  = document.getElementById('successMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      const inputs = contactForm.querySelectorAll('[required]');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#e040fb';
          input.addEventListener('input', () => {
            input.style.borderColor = '';
          }, { once: true });
        }
      });

      if (!valid) return;

      // Simulate sending
      const submitBtn = contactForm.querySelector('.btn-primary');
      submitBtn.textContent = 'Sending…';
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        contactForm.reset();
        successMsg.style.display = 'block';
        submitBtn.textContent = 'Send Message →';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }, 1200);
    });
  }


  /* ======================================================
     7. SMOOTH SCROLL for anchor links
     ====================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ======================================================
     8. PARALLAX — subtle depth on home orbs
     ====================================================== */
  const orbs = document.querySelectorAll('.orb');

  if (orbs.length) {
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      orbs.forEach((orb, i) => {
        const depth  = (i + 1) * 8;
        const moveX  = dx * depth;
        const moveY  = dy * depth;
        orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }

  /* ======================================================
     9. KEN BURNS — cycle background slides
     Each slide zooms in over 8s, then crossfades to the next
     ====================================================== */
  const kbSlides = document.querySelectorAll('.kb-slide');

  if (kbSlides.length) {
    let currentSlide = 0;
    const slideDuration = 7000; // ms each slide is visible before crossfade

    function nextKBSlide() {
      // Fade out current
      kbSlides[currentSlide].classList.remove('active');

      // Advance index
      currentSlide = (currentSlide + 1) % kbSlides.length;

      // Reset animation by cloning the element in place
      const next = kbSlides[currentSlide];
      const clone = next.cloneNode(true);
      next.parentNode.replaceChild(clone, next);
      kbSlides[currentSlide] = clone; // keep reference fresh

      // Trigger fade + zoom
      requestAnimationFrame(() => {
        clone.classList.add('active');
      });
    }

    // Start first slide immediately
    kbSlides[0].classList.add('active');

    // Cycle slides
    setInterval(nextKBSlide, slideDuration);
  }

}); // end DOMContentLoaded
