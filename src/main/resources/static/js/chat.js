const promptInput = document.getElementById('prompt-input');
const sendBtn     = document.getElementById('send-btn');
const gptMessages = document.getElementById('gpt-messages');
const gemMessages = document.getElementById('gem-messages');

function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function removeEmpty() {
    const ge = document.getElementById('gpt-empty');
    const gg = document.getElementById('gem-empty');
    if (ge) ge.remove();
    if (gg) gg.remove();
}

function appendUserMessage(text) {
    const time = getTime();
    const html = `
        <div class="msg-group mg-user">
            <div class="bubble">${escapeHtml(text)}</div>
            <span class="msg-time">${time}</span>
        </div>`;
    gptMessages.insertAdjacentHTML('beforeend', html);
    gemMessages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
}

function appendTyping(panel, type) {
    const id = `typing-${type}`;
    const dotClass = `tdot-${type}`;
    const wrapClass = `tw-${type}`;
    const html = `
        <div id="${id}" class="typing-wrap ${wrapClass}">
            <div class="tdot ${dotClass}"></div>
            <div class="tdot ${dotClass}"></div>
            <div class="tdot ${dotClass}"></div>
        </div>`;
    panel.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
}

function removeTyping(type) {
    const el = document.getElementById(`typing-${type}`);
    if (el) el.remove();
}

function appendAiMessage(panel, text, bubbleClass, isError) {
    const cls = isError ? 'error-bubble' : bubbleClass;
    const time = getTime();
    const html = `
        <div class="msg-group mg-ai">
            <div class="bubble ${cls}">${escapeHtml(text)}</div>
            <span class="msg-time">${time}</span>
        </div>`;
    panel.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
}

function scrollToBottom() {
    gptMessages.scrollTop = gptMessages.scrollHeight;
    gemMessages.scrollTop = gemMessages.scrollHeight;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

async function sendPrompt() {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    removeEmpty();
    appendUserMessage(prompt);
    promptInput.value = '';
    promptInput.style.height = 'auto';
    sendBtn.disabled = true;

    appendTyping(gptMessages, 'gpt');
    appendTyping(gemMessages, 'gem');

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!res.ok) throw new Error('Server error: ' + res.status);

        const data = await res.json();

        removeTyping('gpt');
        removeTyping('gem');

        if (data.gptError) {
            appendAiMessage(gptMessages, data.gptError, 'gpt-bubble', true);
        } else {
            appendAiMessage(gptMessages, data.gptReply, 'gpt-bubble', false);
        }

        if (data.geminiError) {
            appendAiMessage(gemMessages, data.geminiError, 'gem-bubble', true);
        } else {
            appendAiMessage(gemMessages, data.geminiReply, 'gem-bubble', false);
        }

    } catch (err) {
        removeTyping('gpt');
        removeTyping('gem');
        appendAiMessage(gptMessages, 'Failed to reach server. Is Spring Boot running?', 'gpt-bubble', true);
        appendAiMessage(gemMessages, 'Failed to reach server. Is Spring Boot running?', 'gem-bubble', true);
    } finally {
        sendBtn.disabled = false;
        promptInput.focus();
    }
}

promptInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendPrompt();
    }
});

promptInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 140) + 'px';
});