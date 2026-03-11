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

    // --- News Loading ---
    function linkify(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function (url) {
            return `<a href="${url}" target="_blank">${url}</a>`;
        });
    }

    function loadNews() {
        const container = document.getElementById('news-container');
        if (!container || !window.APP_DATA || !window.APP_DATA.news) return;

        // Filter out hidden news or drafts
        const publicNews = window.APP_DATA.news.filter(news => news.status !== 'hidden');
        container.innerHTML = '';
        
        // 最新5件のみ表示
        const displayNews = publicNews.slice(0, 5);

        displayNews.forEach(news => {
            const formattedContent = linkify(news.content).replace(/\n/g, '<br>');
            const li = document.createElement('li');
            li.className = 'news-item';
            li.innerHTML = `
                <div class="news-date">${news.date}</div>
                <div class="news-title">${news.title}</div>
                <div class="news-detail">${formattedContent}</div>
            `;
            li.addEventListener('click', () => {
                const detail = li.querySelector('.news-detail');
                const isOpen = detail.style.display === 'block';
                detail.style.display = isOpen ? 'none' : 'block';
            });
            container.appendChild(li);
        });
    }

    loadNews();
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


    // --- Mobile Menu Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // メニュー項目クリック時にメニューを閉じる
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });



