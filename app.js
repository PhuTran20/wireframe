/**
 * DevOps AI Dashboard - Main Application
 * Features: Voice chat, AI responses, timeline management, build logs
 */

// ========================================
// State Management
// ========================================
const state = {
    chatHistory: [],
    currentSummary: null,
    jobs: [],
    logs: [],
    isVoiceActive: false,
    recognition: null,
    synthesis: window.speechSynthesis,
    collectedData: {}, // Data collected from user
    conversationStep: 0, // Track conversation progress
    projectAccepted: false, // Whether user accepted the quote
    estimatedQuote: null // Project quote
};

// ========================================
// Configuration
// ========================================
const config = {
    stages: ['Spec', 'Code', 'CI', 'Deploy', 'QA'],
    stageIcons: {
        'Spec': '📝',
        'Code': '💻',
        'CI': '🔧',
        'Deploy': '🚀',
        'QA': '✅'
    },
    stageDelay: 3000, // 3 seconds per stage
    storageKey: 'devops-dashboard-state',
    // BA Questions for requirements gathering
    baQuestions: [
        {
            step: 0,
            question: "Xin chào! Tôi là trợ lý AI. Vui lòng cho tôi biết bạn muốn xây dựng loại website gì? (Ví dụ: E-commerce, Blog, Booking, Portfolio...)",
            field: 'websiteType'
        },
        {
            step: 1,
            question: "Tuyệt vời! Website của bạn cần những tính năng chính nào? (Ví dụ: Đăng nhập, Thanh toán, Chat, Tìm kiếm...)",
            field: 'mainFeatures'
        },
        {
            step: 2,
            question: "Bạn dự kiến có khoảng bao nhiêu người dùng truy cập mỗi ngày?",
            field: 'expectedUsers'
        },
        {
            step: 3,
            question: "Bạn có yêu cầu đặc biệt nào về giao diện không? (Ví dụ: Màu sắc, phong cách, responsive...)",
            field: 'designRequirements'
        },
        {
            step: 4,
            question: "Thời gian dự kiến hoàn thành dự án là bao lâu?",
            field: 'timeline'
        }
    ]
};

// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initVoiceChat();
    initEventListeners();
    loadState();
    renderDemoData();
    updateClock();
    setInterval(updateClock, 1000);
});

/**
 * Initialize application
 */
function initApp() {
    console.log('🚀 DevOps Dashboard initialized');
    addLog('System started', 'success');
    
    // Hide timeline and logs initially
    document.querySelector('.timeline-panel').style.display = 'none';
    
    // Start BA conversation
    startBAConversation();
}

/**
 * Initialize Voice Chat (Web Speech API)
 */
function initVoiceChat() {
    // For demo mode, we don't need real speech recognition
    // Just show a message that we're using simulated voice
    addLog('Voice simulation mode enabled (no microphone needed)', 'info');
    return;
    
    // Original speech recognition code (commented out for demo)
    /*
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.warn('Speech Recognition not supported');
        addLog('Voice chat not supported in this browser', 'warning');
        return;
    }

    state.recognition = new SpeechRecognition();
    state.recognition.continuous = false;
    state.recognition.interimResults = false;
    state.recognition.lang = 'vi-VN'; // Vietnamese, can be changed to 'en-US'

    state.recognition.onstart = () => {
        state.isVoiceActive = true;
        document.getElementById('voiceStatus').classList.remove('hidden');
        document.getElementById('voiceBtn').classList.add('active');
        addLog('Voice recognition started', 'info');
    };

    state.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('promptInput').value = transcript;
        addLog(`Voice input: "${transcript}"`, 'info');
        
        // Auto process the voice input
        setTimeout(() => {
            processVoiceInput(transcript);
        }, 500);
    };

    state.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        addLog(`Voice error: ${event.error}`, 'error');
        stopVoiceChat();
    };

    state.recognition.onend = () => {
        stopVoiceChat();
    };
    */
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Send prompt (disabled by default, use voice instead)
    document.getElementById('sendBtn').style.display = 'none'; // Hide send button initially
    document.getElementById('promptInput').placeholder = 'Click Voice button to start...';
    document.getElementById('promptInput').disabled = true;

    // Voice chat
    document.getElementById('voiceBtn').addEventListener('click', toggleVoiceChat);

    // Summary toggle
    document.getElementById('toggleSummaryBtn').addEventListener('click', toggleSummary);

    // Clear buttons
    document.getElementById('clearChatBtn').addEventListener('click', clearChat);
    document.getElementById('clearTimelineBtn').addEventListener('click', clearTimeline);
    document.getElementById('clearLogsBtn').addEventListener('click', clearLogs);
}

// ========================================
// Voice Chat Functions
// ========================================

/**
 * Toggle voice chat on/off
 */
function toggleVoiceChat() {
    // For demo without microphone, auto-fill answers
    if (state.conversationStep < config.baQuestions.length) {
        simulateVoiceAnswer();
    } else {
        addChatMessage('ai', 'Bạn đã hoàn thành tất cả câu hỏi. Vui lòng xem báo giá và nhấn Accept.');
    }
    return;
    
    // Original voice recognition code (commented out for demo)
    /*
    if (!state.recognition) {
        alert('Voice chat is not supported in your browser. Please use Chrome or Edge.');
        return;
    }

    if (state.isVoiceActive) {
        stopVoiceChat();
    } else {
        startVoiceChat();
    }
    */
}

/**
 * Simulate voice answer for demo (without mic)
 */
function simulateVoiceAnswer() {
    const demoAnswers = [
        'Tôi muốn xây dựng một website E-commerce bán quần áo thời trang',
        'Cần có tính năng đăng nhập, giỏ hàng, thanh toán online, tìm kiếm sản phẩm, và đánh giá sản phẩm',
        'Khoảng 1000-2000 người dùng mỗi ngày',
        'Giao diện hiện đại, màu sắc tươi sáng, phải responsive trên mobile',
        'Dự kiến hoàn thành trong vòng 2 tháng'
    ];
    
    const answer = demoAnswers[state.conversationStep] || 'Tôi đồng ý';
    
    // Show voice status
    document.getElementById('voiceStatus').classList.remove('hidden');
    addLog('Voice simulation started', 'info');
    
    // Simulate voice input with delay
    setTimeout(() => {
        document.getElementById('promptInput').value = answer;
        
        setTimeout(() => {
            document.getElementById('voiceStatus').classList.add('hidden');
            processVoiceInput(answer);
            document.getElementById('promptInput').value = '';
        }, 1500);
    }, 1000);
}

/**
 * Start voice recognition
 */
function startVoiceChat() {
    try {
        state.recognition.start();
    } catch (error) {
        console.error('Failed to start voice recognition:', error);
        addLog('Failed to start voice chat', 'error');
    }
}

/**
 * Stop voice recognition
 */
function stopVoiceChat() {
    state.isVoiceActive = false;
    document.getElementById('voiceStatus').classList.add('hidden');
    document.getElementById('voiceBtn').classList.remove('active');
}

/**
 * Speak text using text-to-speech
 */
function speakText(text) {
    if (!state.synthesis) {
        console.warn('Speech synthesis not supported');
        return;
    }

    // Cancel any ongoing speech
    state.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN'; // Can be changed to 'en-US'
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    state.synthesis.speak(utterance);
    addLog('AI speaking response', 'info');
}

// ========================================
// BA Conversation Flow
// ========================================

/**
 * Start BA conversation for requirements gathering
 */
function startBAConversation() {
    setTimeout(() => {
        const firstQuestion = config.baQuestions[0];
        addChatMessage('ai', firstQuestion.question);
        speakText(firstQuestion.question);
    }, 1000);
}

/**
 * Process voice input from user
 */
function processVoiceInput(transcript) {
    const currentQuestion = config.baQuestions[state.conversationStep];
    
    if (!currentQuestion) {
        addChatMessage('ai', 'Cảm ơn bạn đã cung cấp thông tin!');
        return;
    }
    
    // Add user response
    addChatMessage('user', transcript);
    
    // Store collected data
    state.collectedData[currentQuestion.field] = transcript;
    
    // Move to next step
    state.conversationStep++;
    
    // Check if all questions answered
    if (state.conversationStep >= config.baQuestions.length) {
        // All data collected, show summary and quote
        finishDataCollection();
    } else {
        // Ask next question
        setTimeout(() => {
            const nextQuestion = config.baQuestions[state.conversationStep];
            addChatMessage('ai', nextQuestion.question);
            speakText(nextQuestion.question);
        }, 1500);
    }
    
    saveState();
}

/**
 * Finish data collection and show quote
 */
function finishDataCollection() {
    // Generate summary
    generateRequirementsSummary();
    
    // Generate quote
    setTimeout(() => {
        generateProjectQuote();
    }, 2000);
}

/**
 * Generate requirements summary from collected data
 */
function generateRequirementsSummary() {
    const summary = {
        title: 'Tóm tắt yêu cầu dự án',
        points: [
            `Loại website: ${state.collectedData.websiteType || 'N/A'}`,
            `Tính năng chính: ${state.collectedData.mainFeatures || 'N/A'}`,
            `Người dùng dự kiến: ${state.collectedData.expectedUsers || 'N/A'}/ngày`,
            `Yêu cầu thiết kế: ${state.collectedData.designRequirements || 'N/A'}`,
            `Thời gian: ${state.collectedData.timeline || 'N/A'}`
        ]
    };
    
    updateSummary(summary);
    
    addChatMessage('ai', 'Tuyệt vời! Tôi đã tổng hợp tất cả yêu cầu của bạn. Vui lòng xem phần Summary để kiểm tra lại thông tin.');
    speakText('Tôi đã tổng hợp yêu cầu của bạn');
}

/**
 * Generate project quote based on requirements
 */
function generateProjectQuote() {
    // Calculate estimated cost and time based on complexity
    const hasComplexFeatures = (state.collectedData.mainFeatures || '').toLowerCase().includes('thanh toán') ||
                               (state.collectedData.mainFeatures || '').toLowerCase().includes('payment');
    
    const basePrice = 50000000; // 50M VND base
    const complexityMultiplier = hasComplexFeatures ? 1.5 : 1.2;
    const estimatedPrice = Math.round(basePrice * complexityMultiplier);
    
    state.estimatedQuote = {
        price: estimatedPrice,
        duration: '4-6 tuần',
        deliverables: [
            'Website hoàn chỉnh theo yêu cầu',
            'Responsive design (Mobile, Tablet, Desktop)',
            'Admin panel quản trị',
            'Tài liệu hướng dẫn sử dụng',
            'Hỗ trợ 3 tháng sau bàn giao'
        ]
    };
    
    // Display quote in description area
    displayQuote();
    
    addChatMessage('ai', `Dựa trên yêu cầu của bạn, tôi đã chuẩn bị báo giá chi tiết. Vui lòng xem bên phải và nhấn "Accept Quote" nếu bạn đồng ý.`);
}

/**
 * Display project quote
 */
function displayQuote() {
    const quote = state.estimatedQuote;
    const priceFormatted = new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(quote.price);
    
    document.getElementById('descriptionContent').innerHTML = `
        <div style="padding: 10px 0;">
            <h4 style="margin-bottom: 12px; color: var(--color-primary);">💰 Báo Giá Dự Án</h4>
            <div style="background: #f0f7ff; padding: 12px; border-radius: 6px; margin-bottom: 12px;">
                <div style="font-size: 24px; font-weight: 700; color: var(--color-primary);">${priceFormatted}</div>
                <div style="font-size: 13px; color: var(--color-text-secondary); margin-top: 4px;">Thời gian: ${quote.duration}</div>
            </div>
            <h5 style="margin-bottom: 8px; font-size: 14px;">📦 Bao gồm:</h5>
            <ul style="font-size: 13px; color: var(--color-text-secondary); margin-left: 20px;">
                ${quote.deliverables.map(item => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // Update action buttons to show Accept button
    document.querySelector('.action-buttons').innerHTML = `
        <button class="btn-action btn-accept" onclick="acceptQuote()" style="background: var(--color-success); color: white; grid-column: 1 / -1; font-size: 16px; padding: 16px;">
            ✅ Accept Quote & Start Project
        </button>
    `;
}

/**
 * Accept quote and start project
 */
function acceptQuote() {
    state.projectAccepted = true;
    
    addChatMessage('user', 'Tôi chấp nhận báo giá này');
    
    setTimeout(() => {
        addChatMessage('ai', 'Tuyệt vời! Dự án của bạn đã được khởi tạo. Vui lòng theo dõi tiến độ ở Timeline bên phải.');
        
        // Show timeline panel
        document.querySelector('.timeline-panel').style.display = 'flex';
        
        // Start project pipeline
        startProjectPipeline();
        
        // Update description
        document.getElementById('descriptionContent').innerHTML = `
            <div style="padding: 10px 0;">
                <div style="background: #e8f5e9; padding: 12px; border-radius: 6px; margin-bottom: 12px;">
                    <div style="font-weight: 600; color: var(--color-success);">✅ Dự án đã được chấp nhận</div>
                    <div style="font-size: 13px; color: var(--color-text-secondary); margin-top: 4px;">
                        Hệ thống đang tự động xử lý và triển khai dự án của bạn...
                    </div>
                </div>
                <p style="font-size: 13px; color: var(--color-text-secondary);">
                    Theo dõi tiến độ chi tiết tại Pipeline Timeline bên phải.
                </p>
            </div>
        `;
        
        // Hide action buttons
        document.querySelector('.action-buttons').style.display = 'none';
    }, 1000);
    
    saveState();
}

/**
 * Start project pipeline after acceptance
 */
function startProjectPipeline() {
    // Create main project job
    createTimelineJob(`Build: ${state.collectedData.websiteType || 'Website Project'}`);
    
    addLog('Project pipeline started', 'success');
    addLog('Analyzing requirements...', 'info');
}

// Make acceptQuote available globally
window.acceptQuote = acceptQuote;

// ========================================
// Chat Functions
// ========================================

/**
 * Handle prompt submission
 */
function handlePromptSubmit() {
    const input = document.getElementById('promptInput');
    const prompt = input.value.trim();

    if (!prompt) return;

    processVoiceInput(prompt);
    input.value = '';
}

/**
 * Add message to chat
 */
function addChatMessage(sender, text) {
    const timestamp = new Date().toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    const message = { sender, text, timestamp, id: Date.now() };
    state.chatHistory.push(message);

    renderChatMessages();
    saveState();

    // Auto scroll to bottom
    const chatMessages = document.getElementById('chatMessages');
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

/**
 * Render chat messages
 */
function renderChatMessages() {
    const container = document.getElementById('chatMessages');
    
    if (state.chatHistory.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--color-text-muted); padding: 20px;">No messages yet. Start a conversation!</p>';
        return;
    }

    container.innerHTML = state.chatHistory.map(msg => `
        <div class="chat-message ${msg.sender}">
            <div class="message-header">
                <span class="message-sender">${msg.sender === 'user' ? '👤 You' : '🤖 AI Assistant'}</span>
                <span class="message-time">${msg.timestamp}</span>
            </div>
            <div class="message-bubble">${escapeHtml(msg.text)}</div>
        </div>
    `).join('');
}

/**
 * Clear chat history
 */
function clearChat() {
    if (confirm('Clear all chat messages?')) {
        state.chatHistory = [];
        renderChatMessages();
        saveState();
        addLog('Chat history cleared', 'info');
    }
}

// ========================================
// AI Response Generation
// ========================================

/**
 * Generate mock AI response based on prompt
 */
function generateMockResponse(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    // Predefined responses
    const responses = {
        deploy: {
            message: 'I understand you want to deploy. I\'ll prepare the deployment pipeline for you.',
            summary: {
                title: 'Deployment Request',
                points: [
                    'Target environment identified',
                    'Pre-deployment checks configured',
                    'Rollback strategy prepared',
                    'Notification channels set up'
                ]
            }
        },
        spec: {
            message: 'I\'ll help you generate the specification document with all requirements.',
            summary: {
                title: 'Specification Generation',
                points: [
                    'Requirements analysis completed',
                    'Technical specifications drafted',
                    'Architecture diagram prepared',
                    'Review checklist created'
                ]
            }
        },
        ci: {
            message: 'Setting up continuous integration pipeline with automated tests.',
            summary: {
                title: 'CI Pipeline Setup',
                points: [
                    'Build configuration validated',
                    'Unit tests configured',
                    'Code quality checks enabled',
                    'Integration tests ready'
                ]
            }
        },
        test: {
            message: 'Initiating comprehensive testing suite for quality assurance.',
            summary: {
                title: 'QA Testing',
                points: [
                    'Test cases prepared',
                    'Test environment configured',
                    'Automated testing enabled',
                    'Performance benchmarks set'
                ]
            }
        },
        code: {
            message: 'I\'ll generate the code based on your specifications.',
            summary: {
                title: 'Code Generation',
                points: [
                    'Code structure analyzed',
                    'Best practices applied',
                    'Documentation included',
                    'Ready for review'
                ]
            }
        }
    };

    // Find matching response
    for (const [key, response] of Object.entries(responses)) {
        if (lowerPrompt.includes(key)) {
            return response;
        }
    }

    // Default response
    return {
        message: `I've received your request: "${prompt}". I'm analyzing it and will provide recommendations shortly.`,
        summary: {
            title: 'Request Analysis',
            points: [
                'Prompt analyzed successfully',
                'Context identified',
                'Action items extracted',
                'Ready for next steps'
            ]
        }
    };
}

// ========================================
// Summary Functions
// ========================================

/**
 * Update summary panel
 */
function updateSummary(summary) {
    state.currentSummary = summary;

    document.getElementById('summaryTitle').textContent = summary.title;
    document.getElementById('summaryPoints').innerHTML = summary.points
        .map(point => `<li>${escapeHtml(point)}</li>`)
        .join('');

    document.getElementById('descriptionContent').innerHTML = `
        <p><strong>${summary.title}</strong></p>
        <p>${summary.points.join(' • ')}</p>
    `;

    saveState();
}

/**
 * Toggle summary expand/collapse
 */
function toggleSummary() {
    const content = document.getElementById('summaryContent');
    const btn = document.getElementById('toggleSummaryBtn');
    
    content.classList.toggle('collapsed');
    btn.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
}

// ========================================
// Action Handlers
// ========================================

/**
 * Handle action button clicks
 */
function handleAction(action) {
    const actionNames = {
        spec: 'Approve Spec',
        code: 'Generate Code',
        ci: 'Run CI',
        deploy: 'Deploy',
        qa: 'QA Test'
    };

    const jobTitle = actionNames[action] || action;
    createTimelineJob(jobTitle);
    
    addLog(`Action triggered: ${jobTitle}`, 'info');
    addChatMessage('ai', `Started job: ${jobTitle}. Check the timeline for progress.`);
}

// ========================================
// Timeline Functions
// ========================================

/**
 * Create a new timeline job
 */
function createTimelineJob(title) {
    const job = {
        id: Date.now(),
        title: title,
        timestamp: new Date().toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        }),
        stages: config.stages.map(stage => ({
            name: stage,
            status: 'pending',
            icon: config.stageIcons[stage]
        })),
        currentStageIndex: 0,
        progress: 0,
        overallStatus: 'pending' // pending, in-progress, done, failed
    };

    state.jobs.unshift(job);
    renderTimeline();
    saveState();

    // Start advancing stages
    advanceStage(job.id);
    
    addLog(`[${job.timestamp}] Job created: ${title}`, 'success');
}

/**
 * Advance job to next stage
 */
function advanceStage(jobId) {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job) return;

    const currentIndex = job.currentStageIndex;
    
    if (currentIndex >= job.stages.length) {
        job.overallStatus = 'done';
        job.progress = 100;
        renderTimeline();
        saveState();
        addLog(`[${new Date().toLocaleTimeString()}] Job "${job.title}" completed ✓`, 'success');
        return;
    }

    // Set current stage to in-progress
    job.stages[currentIndex].status = 'in-progress';
    job.overallStatus = 'in-progress';
    renderTimeline();
    
    addLog(`[${new Date().toLocaleTimeString()}] Stage -> ${job.stages[currentIndex].name} (${job.title})`, 'info');

    // Complete current stage and move to next after delay
    setTimeout(() => {
        // Random chance of failure (10% for demo purposes)
        const shouldFail = Math.random() < 0.1;
        
        if (shouldFail) {
            job.stages[currentIndex].status = 'failed';
            job.overallStatus = 'failed';
            job.progress = Math.round(((currentIndex + 1) / job.stages.length) * 100);
            renderTimeline();
            saveState();
            addLog(`[${new Date().toLocaleTimeString()}] Stage ${job.stages[currentIndex].name} FAILED ✗`, 'error');
            return;
        }
        
        job.stages[currentIndex].status = 'done';
        job.currentStageIndex++;
        job.progress = Math.round((job.currentStageIndex / job.stages.length) * 100);
        renderTimeline();
        saveState();
        
        addLog(`[${new Date().toLocaleTimeString()}] Stage ${job.stages[currentIndex].name} completed ✓`, 'success');
        
        // Advance to next stage
        advanceStage(jobId);
    }, config.stageDelay);
}

/**
 * Render timeline jobs
 */
function renderTimeline() {
    const container = document.getElementById('timelineContent');
    
    if (state.jobs.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--color-text-muted); padding: 20px;">No jobs yet. Create one using action buttons!</p>';
        return;
    }

    container.innerHTML = state.jobs.map(job => {
        const progress = job.progress || 0;
        const statusText = job.overallStatus === 'done' ? 'DONE' : 
                          job.overallStatus === 'failed' ? 'FAILED' : 
                          job.overallStatus === 'in-progress' ? 'IN PROGRESS' : 'PENDING';
        const statusClass = job.overallStatus || 'pending';
        
        return `
        <div class="timeline-job">
            <div class="job-header">
                <span class="job-title">${escapeHtml(job.title)}</span>
                <span class="job-time">${job.timestamp}</span>
            </div>
            
            <!-- Progress Bar -->
            <div class="job-progress">
                <div class="progress-bar-container">
                    <div class="progress-bar ${statusClass}" style="width: ${progress}%"></div>
                </div>
                <div class="progress-info">
                    <span class="progress-percent">${progress}%</span>
                    <span class="progress-status status-${statusClass}">${statusText}</span>
                </div>
            </div>
            
            <!-- Stages -->
            <div class="job-stages">
                ${job.stages.map(stage => {
                    let stageStatusText = stage.status === 'done' ? 'Done' : 
                                         stage.status === 'failed' ? 'Failed' : 
                                         stage.status === 'in-progress' ? 'Running...' : 'Pending';
                    
                    return `
                    <div class="stage ${stage.status}" onclick="toggleStageStatus(${job.id}, '${stage.name}')">
                        <span class="stage-icon">${stage.icon}</span>
                        <span class="stage-name">${stage.name}</span>
                        <span class="stage-status-text status-${stage.status}">${stageStatusText}</span>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        `;
    }).join('');
}

/**
 * Toggle stage status manually (for demo)
 */
function toggleStageStatus(jobId, stageName) {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job) return;

    const stage = job.stages.find(s => s.name === stageName);
    if (!stage) return;

    // Cycle through statuses: pending -> in-progress -> done -> failed -> pending
    const statuses = ['pending', 'in-progress', 'done', 'failed'];
    const currentIndex = statuses.indexOf(stage.status);
    stage.status = statuses[(currentIndex + 1) % statuses.length];

    // Update job overall status and progress
    const doneStages = job.stages.filter(s => s.status === 'done').length;
    const failedStages = job.stages.filter(s => s.status === 'failed').length;
    const inProgressStages = job.stages.filter(s => s.status === 'in-progress').length;
    
    job.progress = Math.round(((doneStages + failedStages) / job.stages.length) * 100);
    
    if (failedStages > 0) {
        job.overallStatus = 'failed';
    } else if (doneStages === job.stages.length) {
        job.overallStatus = 'done';
        job.progress = 100;
    } else if (inProgressStages > 0 || doneStages > 0) {
        job.overallStatus = 'in-progress';
    } else {
        job.overallStatus = 'pending';
        job.progress = 0;
    }

    renderTimeline();
    saveState();
    
    addLog(`Stage ${stageName} status changed to: ${stage.status}`, 'info');
}

/**
 * Clear timeline
 */
function clearTimeline() {
    if (confirm('Clear all timeline jobs?')) {
        state.jobs = [];
        renderTimeline();
        saveState();
        addLog('Timeline cleared', 'info');
    }
}

// ========================================
// Logs Functions
// ========================================

/**
 * Add log entry
 */
function addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const log = {
        timestamp,
        message,
        type,
        id: Date.now()
    };

    state.logs.push(log);
    
    // Keep only last 100 logs
    if (state.logs.length > 100) {
        state.logs = state.logs.slice(-100);
    }

    renderLogs();
    saveState();
}

/**
 * Render logs
 */
function renderLogs() {
    const container = document.getElementById('logsContent');
    
    if (state.logs.length === 0) {
        container.innerHTML = '<div class="log-entry info">No logs yet...</div>';
        return;
    }

    container.innerHTML = state.logs
        .slice(-50) // Show last 50 logs
        .map(log => `
            <div class="log-entry ${log.type}">
                [${log.timestamp}] ${escapeHtml(log.message)}
            </div>
        `).join('');

    // Auto scroll to bottom
    container.scrollTop = container.scrollHeight;
}

/**
 * Clear logs
 */
function clearLogs() {
    if (confirm('Clear all logs?')) {
        state.logs = [];
        renderLogs();
        saveState();
    }
}

// ========================================
// State Persistence
// ========================================

/**
 * Save state to localStorage
 */
function saveState() {
    try {
        const stateToSave = {
            chatHistory: state.chatHistory,
            currentSummary: state.currentSummary,
            jobs: state.jobs,
            logs: state.logs,
            collectedData: state.collectedData,
            conversationStep: state.conversationStep,
            projectAccepted: state.projectAccepted,
            estimatedQuote: state.estimatedQuote
        };
        localStorage.setItem(config.storageKey, JSON.stringify(stateToSave));
    } catch (error) {
        console.error('Failed to save state:', error);
    }
}

/**
 * Load state from localStorage
 */
function loadState() {
    try {
        const saved = localStorage.getItem(config.storageKey);
        if (saved) {
            const loaded = JSON.parse(saved);
            state.chatHistory = loaded.chatHistory || [];
            state.currentSummary = loaded.currentSummary || null;
            state.jobs = loaded.jobs || [];
            state.logs = loaded.logs || [];
            state.collectedData = loaded.collectedData || {};
            state.conversationStep = loaded.conversationStep || 0;
            state.projectAccepted = loaded.projectAccepted || false;
            state.estimatedQuote = loaded.estimatedQuote || null;

            renderChatMessages();
            renderTimeline();
            renderLogs();
            
            if (state.currentSummary) {
                updateSummary(state.currentSummary);
            }
            
            // Restore UI state
            if (state.estimatedQuote) {
                displayQuote();
            }
            
            if (state.projectAccepted) {
                document.querySelector('.timeline-panel').style.display = 'flex';
                document.querySelector('.action-buttons').style.display = 'none';
            }

            addLog('Previous state restored', 'success');
        }
    } catch (error) {
        console.error('Failed to load state:', error);
    }
}

// ========================================
// Demo Data
// ========================================

/**
 * Render demo data on first load
 */
function renderDemoData() {
    // Skip auto demo if using manual voice simulation
    // User will click voice button to proceed
    return;
    
    /*
    // Only add demo data if no existing data
    if (state.chatHistory.length === 0 && !localStorage.getItem(config.storageKey)) {
        // Auto-simulate BA conversation for demo
        simulateDemoConversation();
    }
    */
}

/**
 * Create a demo job with some stages completed
 */
function createDemoJob(title, completedStages) {
    const job = {
        id: Date.now(),
        title: title,
        timestamp: new Date().toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        }),
        stages: config.stages.map((stage, index) => ({
            name: stage,
            status: index < completedStages ? 'done' : 'pending',
            icon: config.stageIcons[stage]
        })),
        currentStageIndex: completedStages,
        progress: Math.round((completedStages / config.stages.length) * 100),
        overallStatus: completedStages === config.stages.length ? 'done' : 
                      completedStages > 0 ? 'in-progress' : 'pending'
    };

    state.jobs.unshift(job);
    renderTimeline();
    saveState();
}

/**
 * Simulate demo conversation for wireframe
 */
function simulateDemoConversation() {
    let delay = 2000;
    
    // Simulate all Q&A
    const demoAnswers = [
        'Tôi muốn xây dựng một website E-commerce bán quần áo thời trang',
        'Cần có tính năng đăng nhập, giỏ hàng, thanh toán online, tìm kiếm sản phẩm, và đánh giá sản phẩm',
        'Khoảng 1000-2000 người dùng mỗi ngày',
        'Giao diện hiện đại, màu sắc tươi sáng, phải responsive trên mobile',
        'Dự kiến hoàn thành trong vòng 2 tháng'
    ];
    
    config.baQuestions.forEach((question, index) => {
        setTimeout(() => {
            addChatMessage('ai', question.question);
        }, delay);
        delay += 2000;
        
        setTimeout(() => {
            addChatMessage('user', demoAnswers[index]);
            state.collectedData[question.field] = demoAnswers[index];
            state.conversationStep = index + 1;
        }, delay);
        delay += 2000;
    });
    
    // After all questions, show summary and quote
    setTimeout(() => {
        finishDataCollection();
    }, delay);
}

// ========================================
// Utility Functions
// ========================================

/**
 * Update clock in header
 */
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('vi-VN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    document.getElementById('currentTime').textContent = `${dateString} ${timeString}`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make toggleStageStatus available globally
window.toggleStageStatus = toggleStageStatus;

// ========================================
// Service Worker (optional for offline)
// ========================================
if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(() => console.log('Service Worker registered'))
    //     .catch(err => console.log('Service Worker registration failed:', err));
}

console.log('✅ DevOps Dashboard loaded successfully');
