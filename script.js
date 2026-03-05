document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-in').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.parallax-bg');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Simple smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- AJAX Form Submission ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const status = document.createElement('div');
            status.className = 'form-status';
            contactForm.appendChild(status);

            const data = new FormData(contactForm);
            const button = contactForm.querySelector('.submit-btn');
            button.disabled = true;
            button.innerText = '送信中...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.innerHTML = '<p class="success-msg">メッセージを送信しました。ありがとうございます！</p>';
                    contactForm.reset();
                    button.style.display = 'none'; // 成功したらボタンを隠す
                } else {
                    const result = await response.json();
                    if (Object.hasOwn(result, 'errors')) {
                        status.innerHTML = `<p class="error-msg">${result.errors.map(error => error.message).join(", ")}</p>`;
                    } else {
                        status.innerHTML = '<p class="error-msg">送信に失敗しました。後ほど再度お試しください。</p>';
                    }
                    button.disabled = false;
                    button.innerText = 'メッセージを送信';
                }
            } catch (error) {
                status.innerHTML = '<p class="error-msg">ネットワークエラーが発生しました。</p>';
                button.disabled = false;
                button.innerText = 'メッセージを送信';
            }
        });
    }
});
