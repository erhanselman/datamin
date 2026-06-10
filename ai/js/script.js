/* ============================================================
   AI EĞİTİM PLATFORMU — JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
      scrollTopBtn?.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      scrollTopBtn?.classList.remove('visible');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 2. HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  /* ── 3. SMOOTH SCROLL for nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 4. INTERSECTION OBSERVER for animations ── */
  const animElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animElements.forEach(el => observer.observe(el));

  /* ── 5. COUNTER ANIMATION ── */
  function animateCounter(el, target, suffix = '', duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = start + (target - start) * eased;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('tr-TR')) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('[data-count]');
        counters.forEach(counter => {
          const target = parseFloat(counter.dataset.count);
          const suffix = counter.dataset.suffix || '';
          animateCounter(counter, target, suffix);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) statsObserver.observe(statsSection);

  /* ── 6. SOLUTION TABS ── */
  const solutionTabs = document.querySelectorAll('.solution-tab');
  const solutionPanels = document.querySelectorAll('.solution-panel');

  solutionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      solutionTabs.forEach(t => t.classList.remove('active'));
      solutionPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) {
        panel.classList.add('active');
        panel.style.animation = 'fadeIn 0.4s ease';
      }
    });
  });

  /* ── 7. TESTIMONIALS SLIDER ── */
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.t-dot');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');

  let currentSlide = 0;
  let cardsPerView = 3;
  let totalSlides = 0;
  let autoSlideInterval = null;

  function getCardsPerView() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 1;
    return 3;
  }

  function updateSlider() {
    cardsPerView = getCardsPerView();
    totalSlides = Math.max(0, cards.length - cardsPerView);
    if (currentSlide > totalSlides) currentSlide = 0;

    const cardWidth = cards[0]?.offsetWidth + 24 || 0;
    if (track) track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = Math.max(0, Math.min(index, totalSlides));
    updateSlider();
  }

  prevBtn?.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentSlide + 1));
  dots?.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      goToSlide(currentSlide + 1 > totalSlides ? 0 : currentSlide + 1);
    }, 5000);
  }

  if (track) {
    updateSlider();
    startAutoSlide();
    track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    track.addEventListener('mouseleave', startAutoSlide);
    window.addEventListener('resize', updateSlider);
  }

  /* ── 8. PRICING TOGGLE ── */
  const toggleSwitch = document.getElementById('pricingToggle');
  const monthlyPrices = document.querySelectorAll('[data-monthly]');
  const yearlyPrices = document.querySelectorAll('[data-yearly]');
  let isYearly = false;

  toggleSwitch?.addEventListener('click', () => {
    isYearly = !isYearly;
    toggleSwitch.classList.toggle('active', isYearly);

    monthlyPrices.forEach(el => {
      el.style.display = isYearly ? 'none' : 'flex';
    });
    yearlyPrices.forEach(el => {
      el.style.display = isYearly ? 'flex' : 'none';
    });
  });

  /* ── 9. FAQ ACCORDION ── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(fi => fi.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 10. FAQ CATEGORY FILTER ── */
  const faqCatBtns = document.querySelectorAll('.faq-cat-btn');
  faqCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      faqCatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      faqItems.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.3s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ── 11. HERO TYPEWRITER ── */
  const typeTarget = document.getElementById('typewriter');
  if (typeTarget) {
    const phrases = [
      'Kurs Oluşturucu',
      'Quiz Motoru',
      'Flash Kart Sistemi',
      'Canlı Sınıf',
      'IK Platformu',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
      const current = phrases[phraseIndex];
      if (!deleting) {
        typeTarget.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        typeTarget.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 60 : 90);
    }
    type();
  }

  /* ── 12. PROGRESS BAR ANIMATION ── */
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.progress-fill, .sv-fill');
        fills.forEach(fill => {
          const width = fill.dataset.width || fill.style.width;
          fill.style.width = '0%';
          setTimeout(() => { fill.style.transition = 'width 1.2s ease'; fill.style.width = width; }, 100);
        });
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.mockup-body, .solution-visual').forEach(el => {
    progressObserver.observe(el);
  });

  /* ── 13. PARTICLES (optional decorative) ── */
  const heroSection = document.getElementById('hero');
  if (heroSection && window.innerWidth > 900) {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: rgba(0, 212, 170, ${Math.random() * 0.4 + 0.1});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float ${Math.random() * 4 + 4}s ease-in-out infinite ${Math.random() * 3}s;
        pointer-events: none;
        z-index: 0;
      `;
      heroSection.querySelector('.hero-bg')?.appendChild(particle);
    }
  }

  /* ── 14. MOBILE: close dropdown on outside click ── */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(d => {
        // already handled by CSS hover
      });
    }
  });

  /* ── 15. Copy email on click ── */
  const emailLinks = document.querySelectorAll('[data-copy-email]');
  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const email = link.dataset.copyEmail;
      navigator.clipboard?.writeText(email).then(() => {
        const originalText = link.textContent;
        link.textContent = '✓ Kopyalandı!';
        setTimeout(() => link.textContent = originalText, 2000);
      });
    });
  });

  /* ── 16. Active nav link highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active-nav', link.dataset.section === entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));

  console.log('🚀 AI Eğitim Platformu — Hazır!');
});
