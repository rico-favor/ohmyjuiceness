/*!
 * Oh My Juiceness — Preview Interaction Layer (vanilla JS, no dependencies)
 * Entrance animations, carousel, lightbox, nav toggle, inquiry preselect.
 * Load with `defer`.
 */
(function () {
    'use strict';

    var doc = document;
    var root = doc.documentElement;

    /* ------------------------------------------------------------
       0. Reduced-motion resolution
       ------------------------------------------------------------ */
    var prefersReduced = false;
    try {
        var mm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
        var qp = new URLSearchParams(location.search).get('motion');
        prefersReduced = (mm && mm.matches) || qp === 'reduce';
    } catch (e) {
        prefersReduced = false;
    }
    if (prefersReduced) {
        root.classList.add('omj-motion-reduced');
    }

    function svgIcon(pathHtml, viewBox) {
        return '<svg viewBox="' + (viewBox || '0 0 24 24') + '" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + pathHtml + '</svg>';
    }

    /* ------------------------------------------------------------
       1. Entrance animations (IntersectionObserver)
       ------------------------------------------------------------ */
    function initAnimations() {
        var animEls = doc.querySelectorAll('.omj-anim');
        if (!animEls.length) return;

        // Stagger: parents with [data-omj-stagger] assign incremental delays
        // to their .omj-anim children (capped at 0.5s).
        var staggerParents = doc.querySelectorAll('[data-omj-stagger]');
        Array.prototype.forEach.call(staggerParents, function (parent) {
            var children = parent.querySelectorAll(':scope > .omj-anim, :scope .omj-anim');
            // Prefer direct children if present; otherwise fall back to all descendants.
            var direct = [];
            Array.prototype.forEach.call(parent.children, function (child) {
                if (child.classList && child.classList.contains('omj-anim')) direct.push(child);
            });
            var targets = direct.length ? direct : Array.prototype.slice.call(children);
            targets.forEach(function (el, i) {
                var delay = Math.min(i * 0.1, 0.5);
                el.style.setProperty('--omj-anim-delay', delay + 's');
            });
        });

        if (prefersReduced) {
            Array.prototype.forEach.call(animEls, function (el) {
                el.classList.add('is-inview');
            });
            return;
        }

        if (!('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(animEls, function (el) {
                el.classList.add('is-inview');
            });
            return;
        }

        var io = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-inview');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

        Array.prototype.forEach.call(animEls, function (el) {
            io.observe(el);
        });
    }

    /* ------------------------------------------------------------
       2. Carousels (scroll-snap, dynamically built controls)
       ------------------------------------------------------------ */
    var CHEVRON_LEFT = svgIcon('<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>');
    var CHEVRON_RIGHT = svgIcon('<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>');

    function initCarousel(carousel) {
        if (!carousel || carousel.getAttribute('data-omj-carousel-ready') === 'true') return;

        var track = carousel.querySelector('.omj-carousel__track');
        if (!track) return;

        var slides = Array.prototype.slice.call(track.querySelectorAll('.omj-carousel__slide'));
        if (!slides.length) return;
        carousel.setAttribute('data-omj-carousel-ready', 'true');

        var label = carousel.getAttribute('data-omj-carousel') || 'Carousel';
        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-roledescription', 'carousel');
        carousel.setAttribute('aria-label', label);

        slides.forEach(function (slide, i) {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);
        });

        // Build arrows
        var prevBtn = doc.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'omj-carousel__arrow omj-carousel__arrow--prev';
        prevBtn.setAttribute('aria-label', 'Previous slide');
        prevBtn.innerHTML = CHEVRON_LEFT;

        var nextBtn = doc.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'omj-carousel__arrow omj-carousel__arrow--next';
        nextBtn.setAttribute('aria-label', 'Next slide');
        nextBtn.innerHTML = CHEVRON_RIGHT;

        carousel.appendChild(prevBtn);
        carousel.appendChild(nextBtn);

        // Build dots
        var dotsWrap = doc.createElement('div');
        dotsWrap.className = 'omj-carousel__dots';
        dotsWrap.setAttribute('role', 'tablist');
        var dots = slides.map(function (slide, i) {
            var dot = doc.createElement('button');
            dot.type = 'button';
            dot.className = 'omj-carousel__dot';
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            if (i === 0) dot.setAttribute('aria-current', 'true');
            dotsWrap.appendChild(dot);
            return dot;
        });
        carousel.appendChild(dotsWrap);

        var activeIndex = 0;
        var smooth = !prefersReduced && !root.classList.contains('omj-motion-reduced');

        function scrollToIndex(i) {
            var target = slides[i];
            if (!target) return;
            track.scrollTo({
                left: target.offsetLeft - track.offsetLeft,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }

        function setActive(i) {
            activeIndex = i;
            dots.forEach(function (dot, di) {
                if (di === i) {
                    dot.setAttribute('aria-current', 'true');
                    dot.classList.add('is-active');
                } else {
                    dot.removeAttribute('aria-current');
                    dot.classList.remove('is-active');
                }
            });
        }

        prevBtn.addEventListener('click', function () {
            var next = activeIndex - 1;
            if (next < 0) next = slides.length - 1;
            scrollToIndex(next);
        });

        nextBtn.addEventListener('click', function () {
            var next = activeIndex + 1;
            if (next >= slides.length) next = 0;
            scrollToIndex(next);
        });

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                scrollToIndex(i);
            });
        });

        var ticking = false;
        track.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var trackRect = track.getBoundingClientRect();
                var trackCenter = trackRect.left + trackRect.width / 2;
                var closest = 0;
                var closestDist = Infinity;
                slides.forEach(function (slide, i) {
                    var rect = slide.getBoundingClientRect();
                    var center = rect.left + rect.width / 2;
                    var dist = Math.abs(center - trackCenter);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closest = i;
                    }
                });
                if (closest !== activeIndex) setActive(closest);
                ticking = false;
            });
        }, { passive: true });

        setActive(0);
    }

    window.OMJPreview = window.OMJPreview || {};
    window.OMJPreview.initCarousel = initCarousel;

    function initCarousels() {
        var carousels = doc.querySelectorAll('[data-omj-carousel]');
        if (!carousels.length) return;

        Array.prototype.forEach.call(carousels, initCarousel);
    }

    /* ------------------------------------------------------------
       3. Lightbox
       ------------------------------------------------------------ */
    var ICON_CLOSE = svgIcon('<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>');
    var ICON_PREV = svgIcon('<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>');
    var ICON_NEXT = svgIcon('<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>');

    function initLightbox() {
        var triggers = doc.querySelectorAll('[data-lightbox]');
        if (!triggers.length) return;

        // Group triggers by their data-lightbox value.
        var groups = {};
        Array.prototype.forEach.call(triggers, function (trigger) {
            var groupName = trigger.getAttribute('data-lightbox') || 'default';
            if (!groups[groupName]) groups[groupName] = [];
            groups[groupName].push(trigger);
        });

        // Build one overlay, appended to body.
        var overlay = doc.createElement('div');
        overlay.className = 'omj-lightbox';
        overlay.setAttribute('hidden', '');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Image viewer');

        var closeBtn = doc.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'omj-lightbox__close';
        closeBtn.setAttribute('aria-label', 'Close image viewer');
        closeBtn.innerHTML = ICON_CLOSE;

        var prevBtn = doc.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'omj-lightbox__prev';
        prevBtn.setAttribute('aria-label', 'Previous image');
        prevBtn.innerHTML = ICON_PREV;

        var nextBtn = doc.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'omj-lightbox__next';
        nextBtn.setAttribute('aria-label', 'Next image');
        nextBtn.innerHTML = ICON_NEXT;

        var figure = doc.createElement('div');
        figure.className = 'omj-lightbox__figure';

        var img = doc.createElement('img');
        img.className = 'omj-lightbox__img';

        var caption = doc.createElement('p');
        caption.className = 'omj-lightbox__caption';

        figure.appendChild(img);
        figure.appendChild(caption);
        overlay.appendChild(closeBtn);
        overlay.appendChild(prevBtn);
        overlay.appendChild(nextBtn);
        overlay.appendChild(figure);
        doc.body.appendChild(overlay);

        var currentGroup = [];
        var currentIndex = 0;
        var lastTrigger = null;

        function getItemData(trigger) {
            var innerImg = trigger.querySelector('img');
            var src = trigger.getAttribute('data-lightbox-src') ||
                (innerImg && (innerImg.currentSrc || innerImg.src)) || '';
            var cap = trigger.getAttribute('data-lightbox-caption') ||
                (innerImg && innerImg.alt) || '';
            return { src: src, caption: cap };
        }

        function render(index) {
            currentIndex = index;
            var data = getItemData(currentGroup[index]);
            img.src = data.src;
            img.alt = data.caption || '';
            caption.textContent = data.caption || '';
            overlay.setAttribute('aria-label', data.caption || 'Image viewer');
        }

        function open(groupName, index, trigger) {
            currentGroup = groups[groupName] || [trigger];
            lastTrigger = trigger;
            render(index);
            overlay.removeAttribute('hidden');
            doc.body.classList.add('omj-no-scroll');
            closeBtn.focus();
            doc.addEventListener('keydown', onKeydown);
        }

        function close() {
            overlay.setAttribute('hidden', '');
            doc.body.classList.remove('omj-no-scroll');
            doc.removeEventListener('keydown', onKeydown);
            if (lastTrigger && typeof lastTrigger.focus === 'function') {
                lastTrigger.focus();
            }
        }

        function step(delta) {
            var len = currentGroup.length;
            if (!len) return;
            var next = (currentIndex + delta + len) % len;
            render(next);
        }

        function onKeydown(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
                return;
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                step(-1);
                return;
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                step(1);
                return;
            }
            if (e.key === 'Tab') {
                var focusable = [closeBtn, prevBtn, nextBtn];
                var idx = focusable.indexOf(doc.activeElement);
                e.preventDefault();
                var nextIdx;
                if (e.shiftKey) {
                    nextIdx = idx <= 0 ? focusable.length - 1 : idx - 1;
                } else {
                    nextIdx = idx === -1 || idx === focusable.length - 1 ? 0 : idx + 1;
                }
                focusable[nextIdx].focus();
            }
        }

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) close();
        });
        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', function () { step(-1); });
        nextBtn.addEventListener('click', function () { step(1); });

        Array.prototype.forEach.call(triggers, function (trigger) {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                var groupName = trigger.getAttribute('data-lightbox') || 'default';
                var group = groups[groupName];
                var index = group.indexOf(trigger);
                open(groupName, index === -1 ? 0 : index, trigger);
            });
        });
    }

    /* ------------------------------------------------------------
       4. Nav toggle (mobile hamburger)
       ------------------------------------------------------------ */
    function initNavToggle() {
        var toggle = doc.querySelector('.omj-header__toggle');
        var header = doc.querySelector('.omj-header');
        if (!toggle || !header) return;
        var nav = header.querySelector('.omj-header__nav');
        if (!nav) return;

        toggle.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    /* ------------------------------------------------------------
       5. Inquiry preselect (contact form)
       ------------------------------------------------------------ */
    function initInquiryPreselect() {
        var param = new URLSearchParams(location.search).get('inquiry');
        if (!param) return;

        var map = {
            franchising: 'Franchising',
            rent: 'Rent',
            order: 'order',
            others: 'Others'
        };
        var mapped = map[param.toLowerCase()] || param;

        var select = doc.querySelector('form.omj-form select') ||
            doc.querySelector('form.elementor-form select[name*="inquiry" i]') ||
            doc.querySelector('.elementor-field-type-select select');
        if (!select) return;

        var needle = mapped.toLowerCase();
        Array.prototype.forEach.call(select.options, function (option) {
            if (option.text.toLowerCase().indexOf(needle) > -1) {
                select.value = option.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    /* ------------------------------------------------------------
       Boot
       ------------------------------------------------------------ */
    function boot() {
        initAnimations();
        initCarousels();
        initLightbox();
        initNavToggle();
        initInquiryPreselect();
    }

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
