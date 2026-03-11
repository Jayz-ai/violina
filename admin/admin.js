let newsData = [];
let currentIndex = -1;

document.addEventListener('DOMContentLoaded', () => {
    fetchNews();

    document.getElementById('btn-new').addEventListener('click', createNew);
    document.getElementById('btn-save-draft').addEventListener('click', () => saveNews('hidden'));
    document.getElementById('btn-publish').addEventListener('click', () => saveNews('public'));

    // Preview feature
    document.getElementById('btn-preview').addEventListener('click', showPreview);
    document.getElementById('btn-close-preview').addEventListener('click', () => {
        document.getElementById('preview-modal').classList.add('hidden');
    });

    // Deploy to GitHub
    document.getElementById('btn-deploy').addEventListener('click', deployToGitHub);
});

async function deployToGitHub() {
    const isConfirm = confirm('This will deploy your changes to GitHub Pages. Continue?');
    if (!isConfirm) return;

    const statusEl = document.getElementById('deploy-status');
    statusEl.textContent = '🔄 Deploying...';
    statusEl.style.color = 'var(--primary-color)';
    statusEl.classList.remove('hidden');

    try {
        const response = await fetch('/api/deploy', { method: 'POST' });
        const result = await response.json();

        if (result.success) {
            statusEl.textContent = '✔ Success';
            statusEl.style.color = 'var(--success-color)';
        } else {
            statusEl.textContent = '❌ Error: ' + result.message;
            statusEl.style.color = 'var(--danger-color)';
        }
    } catch (e) {
        console.error(e);
        statusEl.textContent = '❌ Connection Error';
        statusEl.style.color = 'var(--danger-color)';
    }

    setTimeout(() => {
        statusEl.classList.add('hidden');
    }, 5000);
}

async function fetchNews() {
    try {
        const response = await fetch('/api/news');
        newsData = await response.json();

        // Ensure every item has a status
        newsData.forEach(item => {
            if (!item.status) item.status = 'public';
        });

        renderList();
        if (newsData.length > 0) {
            selectItem(0);
        } else {
            createNew();
        }
    } catch (e) {
        console.error('Failed to load news', e);
    }
}

function renderList() {
    const list = document.getElementById('news-list');
    list.innerHTML = '';

    newsData.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `news-list-item ${index === currentIndex ? 'selected' : ''}`;

        const displayId = String(item.id).padStart(2, '0');
        const statusClass = item.status === 'public' ? 'status-public' : 'status-hidden';
        const statusText = item.status === 'public' ? 'Public' : 'Hidden (Draft)';

        li.innerHTML = `
            <div class="item-main-info">
                <div class="item-id">ID: ${displayId} | ${item.date}</div>
                <div class="item-title">${item.title}</div>
                <div class="item-status ${statusClass}">${statusText}</div>
            </div>
            <div class="order-controls">
                <button class="btn-order btn-up" title="Move Up" ${index === 0 ? 'disabled' : ''}>▲</button>
                <button class="btn-order btn-down" title="Move Down" ${index === newsData.length - 1 ? 'disabled' : ''}>▼</button>
            </div>
        `;

        li.querySelector('.item-main-info').addEventListener('click', () => selectItem(index));

        const btnUp = li.querySelector('.btn-up');
        const btnDown = li.querySelector('.btn-down');

        if (btnUp) {
            btnUp.addEventListener('click', (e) => {
                e.stopPropagation();
                moveItem(index, index - 1);
            });
        }
        if (btnDown) {
            btnDown.addEventListener('click', (e) => {
                e.stopPropagation();
                moveItem(index, index + 1);
            });
        }

        list.appendChild(li);
    });
}

async function pushNewsDataToServer(successMsg) {
    try {
        const response = await fetch('/api/news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newsData)
        });

        const result = await response.json();
        if (result.success) {
            renderList();
            showStatusMessage(successMsg || '✔ Saved');
        } else {
            alert('Failed to save.');
        }
    } catch (e) {
        console.error(e);
        alert('Connection error occurred.');
    }
}

async function moveItem(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= newsData.length) return;

    const item = newsData.splice(fromIndex, 1)[0];
    newsData.splice(toIndex, 0, item);

    if (currentIndex === fromIndex) {
        currentIndex = toIndex;
    } else if (currentIndex === toIndex) {
        currentIndex = fromIndex;
    }

    await pushNewsDataToServer('✔ Order saved');
}

function selectItem(index) {
    currentIndex = index;
    renderList();

    const item = newsData[index];
    document.getElementById('editor-title').textContent = `Edit Article (ID: ${String(item.id).padStart(2, '0')})`;
    document.getElementById('news-id').value = index;
    document.getElementById('news-number-id').value = item.id;
    document.getElementById('news-date').value = item.date;
    document.getElementById('news-title').value = item.title;
    document.getElementById('news-content').value = item.content;

    hideStatusMessage();
}

function createNew() {
    currentIndex = -1;
    renderList();

    const maxId = newsData.reduce((max, item) => Math.max(max, item.id), 0);
    const newId = maxId + 1;

    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    document.getElementById('editor-title').textContent = `New Article (ID: ${String(newId).padStart(2, '0')})`;
    document.getElementById('news-id').value = 'new';
    document.getElementById('news-number-id').value = newId;
    document.getElementById('news-date').value = dateStr;
    document.getElementById('news-title').value = '';
    document.getElementById('news-content').value = '';

    hideStatusMessage();
}

// Helper to convert URLs to <a> tags
function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
}

function showPreview() {
    const title = document.getElementById('news-title').value;
    const date = document.getElementById('news-date').value;
    const rawContent = document.getElementById('news-content').value;

    document.getElementById('preview-title').textContent = title;
    document.getElementById('preview-date').textContent = date;

    // Convert newlines to <br> and URLs to links
    let htmlContent = linkify(rawContent).replace(/\n/g, '<br>');
    document.getElementById('preview-content').innerHTML = htmlContent;

    document.getElementById('preview-modal').classList.remove('hidden');
}

async function saveNews(targetStatus) {
    const numId = parseInt(document.getElementById('news-number-id').value);

    const isNew = document.getElementById('news-id').value === 'new';

    const newItem = {
        id: numId,
        date: document.getElementById('news-date').value,
        title: document.getElementById('news-title').value,
        content: document.getElementById('news-content').value,
        status: targetStatus
    };

    const existingIndex = newsData.findIndex(item => item.id === numId);

    if (existingIndex !== -1) {
        newsData[existingIndex] = newItem;
        currentIndex = existingIndex;
    } else {
        newsData.unshift(newItem);
        currentIndex = 0;
    }

    document.getElementById('news-id').value = currentIndex;

    document.getElementById('editor-title').textContent = `Edit Article (ID: ${String(numId).padStart(2, '0')})`;

    await pushNewsDataToServer('✔ Saved');
}

function showStatusMessage(msg) {
    const el = document.getElementById('save-status');
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(hideStatusMessage, 3000);
}

function hideStatusMessage() {
    document.getElementById('save-status').classList.add('hidden');
}
