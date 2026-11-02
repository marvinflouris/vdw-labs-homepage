/**
 * VdW Labs — Interactive Core Engine & Motion Systems
 * Brand: VdW Labs
 * Powered by GSAP 3 + ScrollTrigger + HTML5 Canvas
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 01. Initial Setup & GSAP Registration
  // --------------------------------------------------------------------------
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.replace('no-js', 'js');

  // --------------------------------------------------------------------------
  // 02. Generative Neural Canvas (Interactive Knowledge Topology)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('neuralCanvas');
  let ctx = canvas ? canvas.getContext('2d') : null;
  let animationFrameId = null;
  let nodes = [];
  const nodeCount = window.innerWidth < 768 ? 28 : 56;
  const maxDistance = 140;

  class NeuralNode {
    constructor(w, h) {
      this.reset(w, h);
    }

    reset(w, h) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1.2;
      this.baseAlpha = Math.random() * 0.45 + 0.15;
      this.alpha = this.baseAlpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(w, h, time) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = w;
      if (this.x > w) this.x = 0;
      if (this.y < 0) this.y = h;
      if (this.y > h) this.y = 0;

      this.alpha = this.baseAlpha + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.12;
    }

    draw(context) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      // Sage Green tone for nodes
      context.fillStyle = `rgba(191, 201, 216, ${Math.max(0.05, this.alpha)})`;
      context.fill();
    }
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    if (nodes.length === 0) {
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new NeuralNode(w, h));
      }
    }
  }

  function renderCanvas(timestamp) {
    if (!canvas || !ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    const time = timestamp * 0.05;

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update(w, h, time);
      nodes[i].draw(ctx);

      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const lineAlpha = (1 - dist / maxDistance) * 0.2;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(191, 201, 216, ${lineAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(renderCanvas);
  }

  if (canvas) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(renderCanvas);
    }
  }

  // --------------------------------------------------------------------------
  // 02b. Sparse Shooting Stars in the Home Cover
  // --------------------------------------------------------------------------
  const starsCanvas = document.getElementById('shootingStarsCanvas');
  const starsContext = starsCanvas ? starsCanvas.getContext('2d') : null;
  const homeCover = document.getElementById('home');

  if (starsCanvas && starsContext && homeCover && !prefersReducedMotion) {
    const shootingStars = [];
    let starsWidth = 0;
    let starsHeight = 0;
    let starsFrameId = null;
    let starsTimerId = null;
    let starsLastFrame = 0;
    let isHomeCoverVisible = true;

    const resizeShootingStars = () => {
      const bounds = homeCover.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      starsWidth = bounds.width;
      starsHeight = bounds.height;
      starsCanvas.width = Math.round(starsWidth * dpr);
      starsCanvas.height = Math.round(starsHeight * dpr);
      starsContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createShootingStar = () => {
      const angle = 0.35 + Math.random() * 0.25;
      const speed = 420 + Math.random() * 180;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const lifetime = 0.75 + Math.random() * 0.5;

      shootingStars.push({
        x: Math.random() * starsWidth * 0.78 + starsWidth * 0.08,
        y: Math.random() * starsHeight * 0.46 + starsHeight * 0.08,
        vx,
        vy,
        length: 42 + Math.random() * 38,
        lifetime,
        age: 0
      });
    };

    const renderShootingStars = (timestamp) => {
      const delta = starsLastFrame ? Math.min((timestamp - starsLastFrame) / 1000, 0.05) : 0;
      starsLastFrame = timestamp;
      starsContext.clearRect(0, 0, starsWidth, starsHeight);

      for (let index = shootingStars.length - 1; index >= 0; index--) {
        const star = shootingStars[index];
        star.age += delta;
        star.x += star.vx * delta;
        star.y += star.vy * delta;

        if (star.age >= star.lifetime || star.x > starsWidth + star.length || star.y > starsHeight + star.length) {
          shootingStars.splice(index, 1);
          continue;
        }

        const progress = star.age / star.lifetime;
        const fadeIn = Math.min(progress * 5, 1);
        const fadeOut = Math.min((1 - progress) * 4, 1);
        const opacity = Math.min(fadeIn, fadeOut) * 0.72;
        const speed = Math.hypot(star.vx, star.vy);
        const tailX = star.x - (star.vx / speed) * star.length;
        const tailY = star.y - (star.vy / speed) * star.length;
        const trail = starsContext.createLinearGradient(tailX, tailY, star.x, star.y);
        trail.addColorStop(0, 'rgba(225, 229, 235, 0)');
        trail.addColorStop(0.72, `rgba(225, 229, 235, ${opacity * 0.35})`);
        trail.addColorStop(1, `rgba(210, 246, 255, ${opacity})`);

        starsContext.beginPath();
        starsContext.moveTo(tailX, tailY);
        starsContext.lineTo(star.x, star.y);
        starsContext.strokeStyle = trail;
        starsContext.lineWidth = 1.4;
        starsContext.stroke();

        starsContext.beginPath();
        starsContext.arc(star.x, star.y, 1.2, 0, Math.PI * 2);
        starsContext.fillStyle = `rgba(245, 241, 232, ${opacity})`;
        starsContext.fill();
      }

      starsFrameId = requestAnimationFrame(renderShootingStars);
    };

    const scheduleShootingStar = () => {
      if (!isHomeCoverVisible || starsTimerId !== null) return;
      starsTimerId = window.setTimeout(() => {
        starsTimerId = null;
        if (shootingStars.length < 2) createShootingStar();
        scheduleShootingStar();
      }, 1200 + Math.random() * 1800);
    };

    const setShootingStarsActive = (active) => {
      isHomeCoverVisible = active;
      if (active) {
        if (starsFrameId === null) {
          starsLastFrame = 0;
          starsFrameId = requestAnimationFrame(renderShootingStars);
        }
        scheduleShootingStar();
        return;
      }

      if (starsFrameId !== null) {
        cancelAnimationFrame(starsFrameId);
        starsFrameId = null;
      }
      if (starsTimerId !== null) {
        window.clearTimeout(starsTimerId);
        starsTimerId = null;
      }
      shootingStars.length = 0;
      starsContext.clearRect(0, 0, starsWidth, starsHeight);
    };

    resizeShootingStars();
    window.addEventListener('resize', resizeShootingStars, { passive: true });

    if ('IntersectionObserver' in window) {
      const starsObserver = new IntersectionObserver(([entry]) => {
        setShootingStarsActive(entry.isIntersecting);
      });
      starsObserver.observe(homeCover);
    } else {
      setShootingStarsActive(true);
    }
  }

  // --------------------------------------------------------------------------
  // 03. 3D Tilt on Principle Cards
  // --------------------------------------------------------------------------
  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (!prefersReducedMotion && supportsFinePointer && typeof gsap !== 'undefined') {
    tiltCards.forEach((card) => {
      gsap.set(card, {
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center'
      });

      const rotateX = gsap.quickTo(card, 'rotationX', {
        duration: 0.35,
        ease: 'power2.out'
      });
      const rotateY = gsap.quickTo(card, 'rotationY', {
        duration: 0.35,
        ease: 'power2.out'
      });

      card.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateXValue = ((y - rect.height / 2) / (rect.height / 2)) * -5;
        const rotateYValue = ((x - rect.width / 2) / (rect.width / 2)) * 5;

        rotateX(rotateXValue);
        rotateY(rotateYValue);
      });

      card.addEventListener('pointerleave', () => {
        rotateX(0);
        rotateY(0);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 04. GSAP Entrance & Scroll-Linked Reveals
  // --------------------------------------------------------------------------
  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    // Initial page load timeline
    const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    loadTl
      .from('.site-header', {
        y: -30,
        opacity: 0,
        duration: 0.9
      });

    // --------------------------------------------------------------------------
    // Continuous Infinite Slow Motion from Left to Right (What Guides Us)
    // --------------------------------------------------------------------------
    const marqueeTrack = document.getElementById('principlesMarqueeTrack');
    const marqueeContainer = document.getElementById('principlesMarqueeContainer');

    if (marqueeTrack && !prefersReducedMotion) {
      const cardsPerSet = marqueeTrack.children.length / 2;
      let marqueeSetWidth = marqueeTrack.children[cardsPerSet].offsetLeft - marqueeTrack.children[0].offsetLeft;
      let isGestureCooldown = false;
      let resumeTimer = null;
      let settleTween = null;
      let dragState = null;
      let wrapMarqueeX = gsap.utils.wrap(-marqueeSetWidth, 0);

      let marqueeTween = gsap.fromTo(
        marqueeTrack,
        { x: () => -marqueeSetWidth },
        {
          x: 0,
          duration: 32,
          ease: 'none',
          repeat: -1,
          paused: true
        }
      );

      const updateMarqueePlayback = () => {
        if (!isGestureCooldown && !dragState) {
          marqueeTween.play();
        } else {
          marqueeTween.pause();
        }
      };
      updateMarqueePlayback();

      const glideMarquee = (direction, distance) => {
        window.clearTimeout(resumeTimer);
        settleTween?.kill();
        const currentX = Number(gsap.getProperty(marqueeTrack, 'x')) || 0;
        const settleTargetX = currentX + direction * distance;
        isGestureCooldown = true;
        updateMarqueePlayback();

        settleTween = gsap.to(marqueeTrack, {
          x: settleTargetX,
          duration: 0.45,
          ease: 'power3.out',
          onComplete: () => gsap.set(marqueeTrack, { x: wrapMarqueeX(settleTargetX) })
        });
        resumeTimer = window.setTimeout(() => {
          const currentPosition = Number(gsap.getProperty(marqueeTrack, 'x')) || 0;
          marqueeTween.progress(wrapMarqueeX(currentPosition) / marqueeSetWidth + 1);
          isGestureCooldown = false;
          updateMarqueePlayback();
        }, 3000);
      };

      window.addEventListener('resize', () => {
        marqueeSetWidth = marqueeTrack.children[cardsPerSet].offsetLeft - marqueeTrack.children[0].offsetLeft;
        wrapMarqueeX = gsap.utils.wrap(-marqueeSetWidth, 0);
        marqueeTween.pause();
        marqueeTween.invalidate();
        if (!isGestureCooldown && !dragState) {
          marqueeTween.progress(0).play();
        }
      }, { passive: true });

      if (marqueeContainer) {
        marqueeContainer.addEventListener('pointerdown', (event) => {
          if (event.button !== 0 && event.pointerType === 'mouse') return;

          window.clearTimeout(resumeTimer);
          settleTween?.kill();
          settleTween = null;
          isGestureCooldown = false;
          dragState = {
            pointerId: event.pointerId,
            startX: event.clientX,
            lastX: event.clientX,
            trackX: Number(gsap.getProperty(marqueeTrack, 'x')) || 0,
            hasMoved: false
          };
          marqueeTween.pause();
          marqueeContainer.setPointerCapture(event.pointerId);
          marqueeContainer.classList.add('is-dragging');
        });

        marqueeContainer.addEventListener('pointermove', (event) => {
          if (!dragState || dragState.pointerId !== event.pointerId) return;

          const deltaX = event.clientX - dragState.startX;
          dragState.lastX = event.clientX;
          if (Math.abs(deltaX) > 4) {
            dragState.hasMoved = true;
          }
          if (!dragState.hasMoved) return;

          event.preventDefault();
          gsap.set(marqueeTrack, { x: wrapMarqueeX(dragState.trackX + deltaX) });
        });

        const finishMarqueeDrag = (event) => {
          if (!dragState || dragState.pointerId !== event.pointerId) return;

          const completedDrag = dragState;
          dragState = null;
          marqueeContainer.classList.remove('is-dragging');
          if (completedDrag.hasMoved) {
            marqueeTrack.dataset.dragged = 'true';
          }

          if (marqueeContainer.hasPointerCapture(event.pointerId)) {
            marqueeContainer.releasePointerCapture(event.pointerId);
          }

          if (!completedDrag.hasMoved) {
            updateMarqueePlayback();
            return;
          }

          const dragDirection = Math.sign(completedDrag.lastX - completedDrag.startX);
          const glideDistance = Math.min(120, Math.max(42, Math.abs(completedDrag.lastX - completedDrag.startX) * 0.3));
          glideMarquee(dragDirection, glideDistance);
        };

        marqueeContainer.addEventListener('pointerup', finishMarqueeDrag);
        marqueeContainer.addEventListener('keydown', (event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

          event.preventDefault();
          glideMarquee(event.key === 'ArrowLeft' ? -1 : 1, 120);
        });
        const cancelMarqueeDrag = (event) => {
          if (!dragState || dragState.pointerId !== event.pointerId) return;

          dragState = null;
          marqueeContainer.classList.remove('is-dragging');
          updateMarqueePlayback();
        };

        marqueeContainer.addEventListener('pointercancel', cancelMarqueeDrag);
        marqueeContainer.addEventListener('lostpointercapture', cancelMarqueeDrag);
      }

      if (marqueeContainer) {
        marqueeContainer.addEventListener('click', (event) => {
          if (marqueeTrack.dataset.dragged === 'true') {
            event.preventDefault();
            marqueeTrack.dataset.dragged = 'false';
          }
        }, true);
      }
    }

    // --------------------------------------------------------------------------
    // Fluid Landing Page Section Reveals
    // --------------------------------------------------------------------------
    const contentSections = document.querySelectorAll(
      '.section-vision, .section-principles, .section-forward, .section-founder, .site-footer'
    );

    contentSections.forEach((sec) => {
      const textItems = sec.querySelectorAll(
        '.section-eyebrow, .section-title, .section-lead, .vision-headline, .vision-subtext, .founder-name, .founder-role, .founder-statement, .forward-body-text > p:not(:first-child)'
      );
      const visualItems = sec.querySelectorAll(
        '.vision-context-grid, .forward-timeline-pills, .code-terminal-card, .founder-meta-row, .founder-links, .footer-top-grid'
      );

      if (textItems.length === 0 && visualItems.length === 0) return;

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      textItems.forEach((item) => {
        if (item.matches('.section-eyebrow')) {
          revealTl.fromTo(item, {
            clipPath: 'inset(0 100% 0 0)',
            x: -12,
            opacity: 0,
            immediateRender: false
          }, {
            clipPath: 'inset(0 0% 0 0)',
            x: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out'
          }, '>-0.12');
          return;
        }

        if (item.matches('.section-title, .vision-headline, .founder-name')) {
          const words = [];
          const textWalker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);
          const textNodes = [];

          while (textWalker.nextNode()) {
            if (/\S/.test(textWalker.currentNode.nodeValue || '')) {
              textNodes.push(textWalker.currentNode);
            }
          }

          textNodes.forEach((textNode) => {
            const fragment = document.createDocumentFragment();
            const parts = (textNode.nodeValue || '').match(/\s+|\S+/g) || [];

            parts.forEach((part) => {
              if (/^\s+$/.test(part)) {
                fragment.appendChild(document.createTextNode(part));
                return;
              }

              const word = document.createElement('span');
              word.className = 'text-reveal-word';
              word.textContent = part;
              words.push(word);
              fragment.appendChild(word);
            });

            textNode.parentNode?.replaceChild(fragment, textNode);
          });

          if (words.length > 0) {
            revealTl.fromTo(words, {
              yPercent: 110,
              opacity: 0,
              filter: 'blur(7px)',
              immediateRender: false
            }, {
              yPercent: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.7,
              stagger: 0.035,
              ease: 'power3.out'
            }, '>-0.12');
          }
          return;
        }

        revealTl.fromTo(item, {
          clipPath: 'inset(0 0 100% 0)',
          y: 18,
          opacity: 0,
          immediateRender: false
        }, {
          clipPath: 'inset(0 0 0% 0)',
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out'
        }, '>-0.12');
      });

      if (visualItems.length > 0) {
        revealTl.from(visualItems, {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out'
        }, '>-0.12');
      }

    });

    // Smooth anchor navigation auto-glide
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const offset = targetId === '#home' ? 0 : 70;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = targetEl.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // General scroll reveals
    const revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach((el) => {
      if (el.closest('.section-home-cover') || el.closest('.section-view')) return;
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        duration: 0.85,
        ease: 'power2.out'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 06. Clipboard & Footer Contact Form Handlers
  // --------------------------------------------------------------------------
  const toastAlert = document.getElementById('toastAlert');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(msg) {
    if (!toastAlert || !toastMessage) return;
    toastMessage.textContent = msg;
    toastAlert.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastAlert.classList.remove('show');
    }, 3200);
  }

  const friendsSignupForm = document.getElementById('friendsSignupForm');
  if (friendsSignupForm) {
    friendsSignupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('friendsSignupStatus');
      if (status) {
        status.textContent = 'Thanks for your interest. Email signup is a demo and is not connected yet.';
      }
    });
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileNavPanel = document.getElementById('mobileNavPanel');

  if (mobileToggle && mobileNavPanel) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNavPanel.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileNavPanel.setAttribute('aria-hidden', String(!isOpen));
    });

    const mobileLinks = mobileNavPanel.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNavPanel.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileNavPanel.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Current year auto update
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
