document.addEventListener('DOMContentLoaded', () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- Projects Scroll Animation ---
    const projectsSection = document.querySelector('#projects');
    const projectCards = projectsSection?.querySelectorAll('.project-card');

    if (projectsSection && projectCards?.length && gsap && ScrollTrigger) {
        const projectsMedia = gsap.matchMedia();

        const animateCards = (xDistance, sideY, centerY) => {
            const grid = projectsSection.querySelector('.projects-grid');
            const columnCount = grid
                ? getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length
                : 1;
            const getProjectsTop = () => {
                const documentTop = projectsSection.getBoundingClientRect().top + window.scrollY;
                const pinnedDistance = ScrollTrigger.getAll()
                    .filter(trigger => trigger.pin && trigger.start < documentTop)
                    .reduce((distance, trigger) => distance + trigger.end - trigger.start, 0);

                return documentTop + pinnedDistance;
            };

            const getStartX = (index) => {
                const column = index % columnCount;
                if (columnCount === 1) return 0;
                if (columnCount === 2) return column === 0 ? -xDistance : xDistance;
                const centerColumn = (columnCount - 1) / 2;
                return column < centerColumn ? -xDistance : column > centerColumn ? xDistance : 0;
            };
            const getStartY = (index) => {
                const column = index % columnCount;
                const row = Math.floor(index / columnCount);
                const centerColumn = columnCount >= 3 && column === Math.floor((columnCount - 1) / 2);
                return centerColumn
                    ? Math.max(0, centerY - row * 20)
                    : sideY + row * 30;
            };

            gsap.set(projectCards, {
                x: getStartX,
                y: getStartY,
                autoAlpha: 0.2,
                scale: 0.92
            });

            gsap.to(projectCards, {
                x: 0,
                y: 0,
                autoAlpha: 1,
                scale: 1,
                ease: 'none',
                stagger: 0.045,
                scrollTrigger: {
                    trigger: projectsSection,
                    start: () => getProjectsTop() - window.innerHeight * 0.85,
                    end: () => getProjectsTop() - window.innerHeight * 0.25,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        };

        projectsMedia.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
            animateCards(300, 150, 300);
        });

        projectsMedia.add('(min-width: 769px) and (max-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            animateCards(180, 110, 200);
        });

        projectsMedia.add('(max-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
            animateCards(0, 170, 170);
        });
    }

    // --- Skills Horizontal Scroll ---
    const skillsSection = document.querySelector('#skills');
    const skillsViewport = skillsSection?.querySelector('.skills-viewport');
    const skillsTrack = skillsSection?.querySelector('.skills-container');
    const skillsHeading = skillsSection?.querySelector('.section-title');

    if (skillsSection && skillsViewport && skillsTrack && skillsHeading && window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        const skillsMedia = gsap.matchMedia();
        skillsMedia.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
            skillsSection.classList.add('skills-horizontal');

            const getTravelDistance = () => Math.max(0, skillsTrack.scrollWidth - skillsViewport.clientWidth);

            gsap.fromTo(skillsHeading, { autoAlpha: 0, y: 16 }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: skillsSection,
                    start: 'top 75%',
                    once: true
                }
            });

            gsap.to(skillsTrack, {
                x: () => -getTravelDistance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: skillsSection,
                    start: 'top top',
                    end: () => `+=${getTravelDistance()}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });

            const refreshSkills = () => ScrollTrigger.refresh();
            if (document.readyState === 'complete') {
                refreshSkills();
            } else {
                window.addEventListener('load', refreshSkills, { once: true });
            }

            return () => {
                window.removeEventListener('load', refreshSkills);
                skillsSection.classList.remove('skills-horizontal');
            };
        });
    }

    // --- Scroll Animations ---
    const fadeElements = document.querySelectorAll('.fade-in:not(.project-card)');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it has faded in
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        const body = document.body;

        // Check for saved theme in localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            
            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                localStorage.setItem('theme', 'dark');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }
});
