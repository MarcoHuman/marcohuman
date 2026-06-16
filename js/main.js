document.addEventListener('DOMContentLoaded', () => {


  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const sections  = document.querySelectorAll('section');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');


  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  });


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


  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });


  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });



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


  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;


      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');


      projectCards.forEach(card => {
        const cat   = card.dataset.cat;
        const match = filter === 'all' || cat === filter;

        if (match) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity    = '1';
              card.style.transform  = 'translateY(0)';
            });
          });
        } else {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(4px)';
          setTimeout(() => { card.style.display = 'none'; }, 280);
        }
      });
    });
  });



  const contactForm = document.getElementById('contactForm');
  const successMsg  = document.getElementById('successMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

  
      const inputs = contactForm.querySelectorAll('[required]');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#000080';
          input.addEventListener('input', () => {
            input.style.borderColor = '';
          }, { once: true });
        }
      });

      if (!valid) return;

   
      const submitBtn = contactForm.querySelector('.btn-primary');
      submitBtn.textContent = 'Sending…';
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        contactForm.reset();
        successMsg.style.display = 'block';
        submitBtn.textContent = '📨 Send Message';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }, 1200);
    });
  }


  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 40; 
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });



  function padTwo(n) { return String(n).padStart(2, '0'); }

  function updateClock() {
    const now = new Date();
    const h   = padTwo(now.getHours());
    const m   = padTwo(now.getMinutes());
    const clock = document.getElementById('taskbarClock');
    if (clock) clock.textContent = `${h}:${m}`;
  }

  const taskbar = document.getElementById('navbar');
  if (taskbar) {
    const clockEl = document.createElement('div');
    clockEl.id = 'taskbarClock';
    clockEl.style.cssText = `
      margin-left: auto;
      padding: 3px 10px;
      font-size: 11px;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      background: #c0c0c0;
      min-width: 52px;
      text-align: center;
      white-space: nowrap;
    `;
    taskbar.appendChild(clockEl);
    updateClock();
    setInterval(updateClock, 60000);
  }
}); 
