// ===== DOM Elements =====
const header = document.querySelector('.header');
const mainNav = document.querySelector('.main-nav');

// ===== Header Scroll Effect =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (mainNav) {
        if (scrolled > 150) {
            mainNav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            mainNav.style.background = 'rgba(255,255,255,0.98)';
        } else {
            mainNav.style.boxShadow = 'none';
            mainNav.style.background = 'var(--white)';
        }
    }
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = mainNav ? mainNav.offsetHeight : 0;
            const offset = navHeight + 20;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Form Handling =====
function handleFormSubmit(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        const originalHTML = submitBtn.innerHTML;

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10"/>
            </svg>
            Отправка...
        `;

        setTimeout(() => {
            // Success state
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                </svg>
                Отправлено!
            `;
            submitBtn.style.background = 'linear-gradient(90deg, #22C55E 0%, #16A34A 100%)';

            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                form.reset();
            }, 2500);
        }, 1500);
    });
}

// Apply to all forms
document.querySelectorAll('form').forEach(handleFormSubmit);

// ===== Animation Styles =====
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-in { animation: fadeInUp 0.5s ease forwards; }
`;
document.head.appendChild(style);

// ===== Intersection Observer for Animations =====
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.classList.add('animate-in');
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .advantage-card, .feature-item, .course-card, .profession-card, .license-card').forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
    animateOnScroll.observe(el);
});

// ===== Accordion =====
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

        // Open clicked if wasn't open
        if (!isOpen) {
            item.classList.add('open');
        }
    });
});

// Open first accordion item by default
const firstAccordion = document.querySelector('.accordion-item');
if (firstAccordion) firstAccordion.classList.add('open');

// ===== Filter Buttons =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter items
        document.querySelectorAll('.profession-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== Lightbox =====
function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        closeSearchModal();
    }
});

// ===== Search Modal =====
function openSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        document.getElementById('modalSearchInput')?.focus();
    }
}

function closeSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Search from navigation
const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.search-box .search-btn');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = searchInput?.value.trim();
        if (query) {
            performSearch(query);
        } else {
            openSearchModal();
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
}

function performSearch(query) {
    // Simple search - in production this would search actual content
    const searchResults = [
        { title: 'Охрана труда', url: 'safety.html', description: 'Программы обучения по охране труда' },
        { title: 'Профессиональное обучение', url: 'professions.html', description: 'Обучение рабочим профессиям' },
        { title: 'Контакты', url: 'contacts.html', description: 'Контактная информация' },
        { title: 'Лицензии', url: 'licenses.html', description: 'Лицензии и аккредитации' },
    ];

    const filtered = searchResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length > 0) {
        alert(`Найдено ${filtered.length} результат(ов) по запросу "${query}"\n\n` +
            filtered.map(item => `• ${item.title}`).join('\n'));
    } else {
        alert(`По запросу "${query}" ничего не найдено`);
    }
}

// ===== CTA Button Effects =====
document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        // Ripple effect
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(rippleStyle);

// ===== Scroll to hash on page load =====
if (window.location.hash) {
    setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
            const navHeight = mainNav ? mainNav.offsetHeight : 0;
            window.scrollTo({
                top: target.offsetTop - navHeight - 20,
                behavior: 'smooth'
            });

            // Open accordion if target is in one
            const accordionItem = target.closest('.accordion-item');
            if (accordionItem) {
                accordionItem.classList.add('open');
            }
        }
    }, 100);
}

// ===== License Button Effect =====
const licenseBtn = document.querySelector('.license-btn');
if (licenseBtn) {
    licenseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        licenseBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            licenseBtn.style.transform = 'scale(1)';
            window.location.href = 'licenses.html';
        }, 150);
    });
}

console.log('ВЕком - Сайт загружен успешно! v3.0');
