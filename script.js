// API Configuration
const API_BASE_URL = 'http://localhost:8787';

// Open Contact Email Function (Global)
function openContactEmail() {
    const subject = encodeURIComponent('Root Inside 문의');
    const body = encodeURIComponent(`안녕하세요,

Root Inside AI 프롬프트 자동화 플랫폼에 대해 문의드립니다.

[문의 내용]


[연락처]
이름: 
이메일: 
전화번호: 

감사합니다.`);
    
    window.location.href = `mailto:contact@rootinsidegroup.com?subject=${subject}&body=${body}`;
}

// Scroll to Demo Function (Global)
function scrollToDemo() {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// DOM Elements
const professionSelect = document.getElementById('profession-select');
const taskInput = document.getElementById('task-input');
const languageSelect = document.getElementById('language-select');
const generateBtn = document.getElementById('generate-btn');
const outputContent = document.getElementById('output-content');
const copyBtn = document.getElementById('copy-btn');
const loadingEl = document.getElementById('loading');

// Event Listeners
generateBtn.addEventListener('click', generatePrompt);
copyBtn.addEventListener('click', copyToClipboard);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Generate Prompt Function
async function generatePrompt() {
    const profession = professionSelect.value;
    const task = taskInput.value.trim();
    const language = languageSelect.value;

    // Validation
    if (!profession) {
        alert('직군을 선택해주세요.');
        return;
    }

    if (!task) {
        alert('구체적인 업무를 입력해주세요.');
        return;
    }

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.textContent = '생성 중...';
    loadingEl.style.display = 'flex';
    outputContent.style.display = 'none';
    copyBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                profession,
                task,
                language
            })
        });

        if (!response.ok) {
            throw new Error('프롬프트 생성에 실패했습니다. API 서버가 실행 중인지 확인해주세요.');
        }

        const data = await response.json();
        
        // Display result
        displayPrompt(data.prompt || data.text);

    } catch (error) {
        console.error('Error:', error);
        
        // Show error message
        outputContent.innerHTML = `
            <div style="color: #ef4444; padding: 2rem; text-align: center;">
                <p style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">❌ 오류 발생</p>
                <p style="margin-bottom: 1rem;">${error.message}</p>
            </div>
        `;
        copyBtn.disabled = true;
    } finally {
        // Reset button state
        generateBtn.disabled = false;
        generateBtn.textContent = '프롬프트 생성하기';
        loadingEl.style.display = 'none';
        outputContent.style.display = 'block';
    }
}

// Display Prompt
function displayPrompt(prompt) {
    outputContent.innerHTML = '';
    
    // Format the prompt for better readability
    const formattedPrompt = prompt
        .replace(/\[역할\]/g, '<strong style="color: #2563eb;">[역할]</strong>')
        .replace(/\[목표\]/g, '<strong style="color: #2563eb;">[목표]</strong>')
        .replace(/\[컨텍스트\]/g, '<strong style="color: #2563eb;">[컨텍스트]</strong>')
        .replace(/\[지시사항\]/g, '<strong style="color: #2563eb;">[지시사항]</strong>')
        .replace(/\[제약조건\]/g, '<strong style="color: #2563eb;">[제약조건]</strong>')
        .replace(/\[출력 형식\]/g, '<strong style="color: #2563eb;">[출력 형식]</strong>')
        .replace(/\[검증\]/g, '<strong style="color: #2563eb;">[검증]</strong>')
        .replace(/\[후속 액션\]/g, '<strong style="color: #2563eb;">[후속 액션]</strong>')
        .replace(/\[도메인 정보\]/g, '<strong style="color: #2563eb;">[도메인 정보]</strong>')
        .replace(/\[프롬프트 작성 원칙\]/g, '<strong style="color: #2563eb;">[프롬프트 작성 원칙]</strong>')
        .replace(/\[정확성·리스크 제어\]/g, '<strong style="color: #2563eb;">[정확성·리스크 제어]</strong>')
        .replace(/\[환각 방지\]/g, '<strong style="color: #2563eb;">[환각 방지]</strong>')
        .replace(/\[사용자 요청 Task\]/g, '<strong style="color: #2563eb;">[사용자 요청 Task]</strong>');
    
    const pre = document.createElement('pre');
    pre.innerHTML = formattedPrompt;
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.wordWrap = 'break-word';
    
    outputContent.appendChild(pre);
    copyBtn.disabled = false;
}

// Copy to Clipboard
async function copyToClipboard() {
    const text = outputContent.innerText;
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Show success feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ 복사됨';
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = 'white';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('클립보드 복사에 실패했습니다.');
    }
}

// Add hover effect to profession cards
const professionCards = document.querySelectorAll('.profession-card');
professionCards.forEach(card => {
    card.addEventListener('click', () => {
        const professionName = card.querySelector('h3').textContent;
        
        // Scroll to demo section
        const demoSection = document.getElementById('demo');
        if (demoSection) {
            demoSection.scrollIntoView({ behavior: 'smooth' });
            
            // Set profession in select (simplified mapping)
            setTimeout(() => {
                if (professionName.includes('법률')) {
                    professionSelect.value = 'lawyer';
                } else if (professionName.includes('회계')) {
                    professionSelect.value = 'accountant';
                } else if (professionName.includes('의료')) {
                    professionSelect.value = 'doctor';
                } else if (professionName.includes('컨설턴트')) {
                    professionSelect.value = 'consultant';
                } else if (professionName.includes('마케터')) {
                    professionSelect.value = 'marketer';
                } else if (professionName.includes('개발자')) {
                    professionSelect.value = 'developer';
                }
            }, 500);
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-item, .profession-card, .value-card, .step-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// CTA Button handlers
document.querySelectorAll('.cta-button-primary, .cta-button-small').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // If not in demo section, scroll to demo
        if (!btn.id || btn.id !== 'generate-btn') {
            e.preventDefault();
            const demoSection = document.getElementById('demo');
            if (demoSection) {
                demoSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Handle demo CTA button
const demoCTAButtons = document.querySelectorAll('.hero-actions .cta-button-secondary');
demoCTAButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const demoSection = document.getElementById('demo');
        if (demoSection) {
            demoSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add sample tasks for each profession
const sampleTasks = {
    'accountant': '세무 전략 수립 보고서 초안 작성',
    'lawyer': '계약서 검토 및 법률 리스크 분석',
    'consultant': '시장 진입 전략 수립 및 실행 계획',
    'marketer': '디지털 마케팅 캠페인 기획 및 콘텐츠 제작',
    'developer': '시스템 아키텍처 설계 및 기술 문서 작성',
    'doctor': '환자 케어 가이드라인 작성 및 의학 문헌 검토'
};

// Update task placeholder on profession change
professionSelect.addEventListener('change', (e) => {
    const selectedProfession = e.target.value;
    if (selectedProfession && sampleTasks[selectedProfession]) {
        taskInput.placeholder = `예: ${sampleTasks[selectedProfession]}`;
    } else {
        taskInput.placeholder = '예: 세무 전략 수립 보고서 초안 작성';
    }
});

// Add keyboard shortcut (Ctrl/Cmd + Enter to generate)
taskInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generatePrompt();
    }
});

// Console welcome message
console.log('%c⚙️ Root Inside - AI Prompt Automation', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cAPI 서버 실행: npm start', 'font-size: 14px; color: #64748b;');
console.log('%cGitHub: https://github.com/leekangyeop-cpu/ai-prompt-automation1', 'font-size: 14px; color: #64748b;');
