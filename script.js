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

    // --- Optimized AJAX Form Submission (Based on Formspree Example) ---
    const form = document.querySelector('.contact-form');
    if (form) {
        async function handleSubmit(event) {
            event.preventDefault();
            const status = document.createElement('div');
            status.className = 'form-status';
            
            // 既存のステータスメッセージがあれば削除
            const oldStatus = form.querySelector('.form-status');
            if (oldStatus) oldStatus.remove();
            
            form.appendChild(status);
            const data = new FormData(event.target);
            const button = form.querySelector('.submit-btn');
            button.disabled = true;
            button.innerText = '送信中...';

            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = '<p class="success-msg">Thanks for your submission!</p>';
                    form.reset();
                    button.style.display = 'none';
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = `<p class="error-msg">${data["errors"].map(error => error["message"]).join(", ")}</p>`;
                        } else {
                            status.innerHTML = '<p class="error-msg">Oops! There was a problem submitting your form</p>';
                        }
                        button.disabled = false;
                        button.innerText = 'メッセージを送信';
                    })
                }
            }).catch(error => {
                status.innerHTML = '<p class="error-msg">Oops! There was a problem submitting your form</p>';
                button.disabled = false;
                button.innerText = 'メッセージを送信';
            });
        }
        form.addEventListener("submit", handleSubmit);
    }
});
