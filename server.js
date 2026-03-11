const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'content.js');

app.use(bodyParser.json());
// Serve static files (including the main site and the admin panel)
app.use(express.static(__dirname));

// Function to extract and parse data from content.js
function readData() {
    try {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        // Extract the JSON part from window.APP_DATA = { ... };
        const jsonMatch = fileContent.match(/window\.APP_DATA\s*=\s*(\{[\s\S]*?\})\s*;/);

        if (jsonMatch && jsonMatch[1]) {
            let data;
            const evalContent = `(${jsonMatch[1]})`;
            data = eval(evalContent);
            return data;
        }
        return { news: [] };
    } catch (error) {
        console.error('Error reading data file:', error);
        return { news: [] };
    }
}

// Function to write back data into content.js
function writeData(data) {
    try {
        const fileHeader = `/**\n * Violina Portfolio Content Data\n */\n\nwindow.APP_DATA = `;
        const jsContent = fileHeader + JSON.stringify(data, null, 4) + ';\n';
        fs.writeFileSync(DATA_FILE, jsContent, 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing data file:', error);
        return false;
    }
}

// API: Deploy to GitHub
app.post('/api/deploy', (req, res) => {
    // Ensuring UTF-8 execution
    const cmd = 'chcp 65001 > nul && git add . && git commit -m "Update news via Admin Tool" && git push origin main';
    exec(cmd, { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error('Deploy error:', error);
            if (stdout.includes('nothing to commit') || stderr.includes('nothing to commit')) {
                return res.json({ success: true, message: 'Nothing to commit' });
            }
            return res.status(500).json({ success: false, message: 'Failed to deploy to GitHub' });
        }
        res.json({ success: true, message: 'Deployment successful' });
    });
});

// API: Get current news
app.get('/api/news', (req, res) => {
    const data = readData();
    res.json(data.news || []);
});

// API: Save news
app.post('/api/news', (req, res) => {
    const newItems = req.body;
    if (!Array.isArray(newItems)) {
        return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    const fullData = readData();
    fullData.news = newItems;

    const success = writeData(fullData);
    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, message: 'Failed to write data' });
    }
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🤖 Violina Admin Server is running!`);
    console.log(`▶ Admin Panel: http://localhost:${PORT}/admin/index.html`);
    console.log(`▶ Main Site  : http://localhost:${PORT}/index.html`);
    console.log(`========================================`);
});
