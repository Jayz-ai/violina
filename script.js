// --- News Data (From AIspringFES Project) ---
const APP_DATA = {
    "news": [
        {
            "id": 18,
            "date": "2026.03.08",
            "title": "📢公式サイト、プレオープンのお知らせ",
            "content": "AISpringFES 2026の公式サイトがプレオープンしました。SNS初のAI動画・音楽生成MVフェスティバルとして、最高のエンターテインメントをお届けします。最新情報を順次公開していきますので、公式X( https://x.com/AI_animeryo )のフォローもお願いいたします。",
            "status": "public"
        },
        {
            "id": 17,
            "date": "2026.03.06",
            "title": "🎉出演順及び当日の配信詳細 ",
            "content": "🌸概要\n・珠玉のAIクリエイターたちが集結する、現代最高峰のAI音楽祭\n・「誰？」が「あの人」になる日――それがAISpringFES2026です！\n\n⋱⋱ 出演順及び当日の配信詳細 ⋰⋰\n\n【日程】 3/29(日)13:00-/19:00-の二部制です！\n◢◤◢◤ 🌸 前半の部 🌸 ◢◤◢◤ \n13:00～15:45\nYouTubeプレミアリンク：\nhttps://youtu.be/4PJJGya37Wo\n\n◢◤◢◤ 🌙 後半の部 🌙 ◢◤◢◤\n後半の部：19:00～21:45\nYouTubeプレミアリンク：\nhttps://youtu.be/2palq7Q3LA8\n\n∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵\n\n🔥見どころ\n✅19名の世界が大爆発！全曲が衝撃級のクオリティ\n✅メイン出演者によるテーマ曲『軌跡の光』の１０通りの解釈\n✅AI音楽の“進化”と“未来”を肌で感じられる5時間半\n✅新しい推し・推し曲が必ず見つかる\n\nハッシュタグで投稿しよう！ 感想・推し曲・推しアーティストはぜひSNSへ→ #AISpringFES2026\n\nコメント・Xポスト大歓迎！\n\n----\nnoteでも公開しています\nhttps://note.com/maenoryo/n/n1338cc6f7155",
            "status": "public"
        },
        {
            "id": 15,
            "date": "2026.03.01",
            "title": "🎙出演者紹介記事　7th Artist. Jayzさん/水面みなさん公開！",
            "content": "出演者紹介記事 七人目はJayzさんと水面みなさん！\nぜひご覧ください！\n\nhttps://note.com/maenoryo/n/nb64ac4203244",
            "status": "public"
        }
    ]
};

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

    function loadNews(showAll = false) {
        const container = document.getElementById('news-container');
        if (!container) return;

        const publicNews = APP_DATA.news.filter(news => news.status === 'public' || !news.status);
        container.innerHTML = '';
        const displayNews = showAll ? publicNews : publicNews.slice(0, 5);

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

        if (publicNews.length > 5) {
            const toggleBtn = document.createElement('div');
            toggleBtn.className = 'news-toggle-btn';
            toggleBtn.textContent = showAll ? '▲ Show Less' : '▼ Show All News';
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                loadNews(!showAll);
                if (showAll) {
                    document.getElementById('news').scrollIntoView({ behavior: 'smooth' });
                }
            });
            container.appendChild(toggleBtn);
        }
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



