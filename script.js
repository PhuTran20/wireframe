// Application State
const appState = {
    currentStep: 1,
    isRecording: false,
    qaData: [],
    budget: 50000000, // 50 triệu VNĐ
    totalCost: 0,
    features: [],
    chatHistory: [],
    editingIndex: null // Để track câu hỏi đang được chỉnh sửa
};

// Mock LLM Responses
const mockQuestions = [
    "Bạn muốn xây dựng loại website gì? (E-commerce, Blog, Corporate, etc.)",
    "Dự án cần những tính năng chính nào?",
    "Bạn có yêu cầu gì về thiết kế và giao diện?",
    "Dự án cần tích hợp với hệ thống nào không?",
    "Bạn mong muốn thời gian hoàn thành là bao lâu?"
];

const mockAnswers = [
    "Website E-commerce bán sản phẩm thời trang dành cho giới trẻ, tập trung vào phân khúc 18-30 tuổi với phong cách hiện đại năng động",
    "Cần có giỏ hàng, thanh toán online qua VNPay và Momo, quản lý đơn hàng, tìm kiếm và lọc sản phẩm theo nhiều tiêu chí, wishlist, đánh giá sản phẩm",
    "Thiết kế",
    "Tích hợp VNPay, Momo, Facebook Pixel để tracking, Google Analytics, hệ thống email marketing Mailchimp",
    "Khoảng 6-8 tuần, chia làm 3 giai đoạn: UI/UX (2 tuần), Development (4 tuần), Testing (1-2 tuần)"
];

// Điểm đánh giá tương ứng (1=tốt nhất, 5=tệ nhất)
const mockScores = [1, 1, 4, 2, 1]; // Câu 3 có điểm 4 (Mơ hồ) để test

// Mock features với mô tả chi tiết cho người dùng
const projectFeatures = [
    { 
        icon: 'fa-shopping-cart',
        name: 'Giỏ hàng thông minh', 
        description: 'Khách hàng có thể thêm, xóa, chỉnh sửa sản phẩm trong giỏ hàng. Tự động tính tổng tiền và áp dụng mã giảm giá.',
        duration: '1 tuần',
        cost: 8000000 
    },
    { 
        icon: 'fa-credit-card',
        name: 'Thanh toán trực tuyến', 
        description: 'Hỗ trợ thanh toán qua VNPay, Momo, và thẻ ATM. An toàn, bảo mật, xử lý giao dịch nhanh chóng.',
        duration: '1 tuần',
        cost: 10000000 
    },
    { 
        icon: 'fa-clipboard-list',
        name: 'Quản lý đơn hàng', 
        description: 'Theo dõi trạng thái đơn hàng từ lúc đặt đến lúc giao. Nhận thông báo tự động qua email và SMS.',
        duration: '1.5 tuần',
        cost: 9000000 
    },
    { 
        icon: 'fa-search',
        name: 'Tìm kiếm & Lọc sản phẩm', 
        description: 'Tìm kiếm theo tên, giá, màu sắc, kích cỡ. Sắp xếp theo nhiều tiêu chí khác nhau.',
        duration: '1 tuần',
        cost: 7000000 
    },
    { 
        icon: 'fa-heart',
        name: 'Danh sách yêu thích', 
        description: 'Lưu sản phẩm yêu thích để mua sau. Nhận thông báo khi có khuyến mãi.',
        duration: '3 ngày',
        cost: 4000000 
    },
    { 
        icon: 'fa-star',
        name: 'Đánh giá sản phẩm', 
        description: 'Khách hàng có thể đánh giá, viết nhận xét về sản phẩm đã mua. Giúp người khác tham khảo.',
        duration: '4 ngày',
        cost: 5000000 
    }
];

const uiuxPages = [
    { name: 'Trang chủ', description: 'Hiển thị sản phẩm nổi bật, khuyến mãi', cost: 3000000 },
    { name: 'Trang danh mục sản phẩm', description: 'Liệt kê tất cả sản phẩm theo nhóm', cost: 2500000 },
    { name: 'Trang chi tiết sản phẩm', description: 'Thông tin chi tiết, ảnh, mô tả sản phẩm', cost: 2500000 },
    { name: 'Trang giỏ hàng', description: 'Quản lý sản phẩm trong giỏ', cost: 2000000 },
    { name: 'Trang thanh toán', description: 'Điền thông tin và thanh toán', cost: 2500000 },
    { name: 'Trang tài khoản cá nhân', description: 'Quản lý thông tin, đơn hàng', cost: 2000000 },
    { name: 'Trang đăng nhập/đăng ký', description: 'Tạo tài khoản và đăng nhập', cost: 1500000 }
];

const integrationServices = [
    { name: 'Cổng thanh toán VNPay', description: 'Thanh toán qua thẻ ATM, thẻ tín dụng', cost: 3000000 },
    { name: 'Cổng thanh toán Momo', description: 'Thanh toán qua ví điện tử Momo', cost: 3000000 },
    { name: 'Facebook Pixel', description: 'Theo dõi hành vi khách hàng, chạy quảng cáo', cost: 2000000 },
    { name: 'Google Analytics', description: 'Phân tích lưu lượng truy cập website', cost: 1500000 },
    { name: 'Email Marketing (Mailchimp)', description: 'Gửi email tự động cho khách hàng', cost: 2500000 }
];

const testingDeployment = [
    { name: 'Kiểm tra tính năng', description: 'Test toàn bộ tính năng trên nhiều thiết bị', cost: 3000000 },
    { name: 'Kiểm tra bảo mật', description: 'Đảm bảo website an toàn, không lỗ hổng', cost: 2000000 },
    { name: 'Tối ưu hiệu suất', description: 'Website tải nhanh, mượt mà', cost: 2000000 },
    { name: 'Đưa website lên internet', description: 'Deploy lên server, cấu hình domain', cost: 3000000 }
];

const mockFeatures = [
    { name: "Thiết kế giao diện UI/UX", duration: "2 ngày", cost: 15000000 },
    { name: "Giỏ hàng thông minh", duration: "1 ngày", cost: 8000000 },
    { name: "Thanh toán trực tuyến", duration: "1 ngày", cost: 10000000 },
    { name: "Quản lý đơn hàng", duration: "1.5 ngày", cost: 9000000 },
    { name: "Tìm kiếm & Lọc sản phẩm", duration: "1 ngày", cost: 7000000 },
    { name: "Danh sách yêu thích", duration: "0.5 ngày", cost: 4000000 },
    { name: "Đánh giá sản phẩm", duration: "0.5 ngày", cost: 5000000 },
    { name: "Tích hợp bên thứ 3", duration: "1 ngày", cost: 8000000 },
    { name: "Kiểm tra & Triển khai", duration: "1 ngày", cost: 10000000 }
];

// DOM Elements
const micBtn = document.getElementById('micBtn');
const voiceVisualizer = document.getElementById('voiceVisualizer');
const voiceStatus = document.getElementById('voiceStatus');
const chatMessages = document.getElementById('chatMessages');
const accountBtn = document.getElementById('accountBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const budgetModal = document.getElementById('budgetModal');
const addBudgetBtn = document.getElementById('addBudgetBtn');
const proceedBtn = document.getElementById('proceedBtn');
const toggleChatBtn = document.getElementById('toggleChatBtn');
const floatingChatBtn = document.getElementById('floatingChatBtn');
const leftColumn = document.getElementById('leftColumn');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeNavigation();
    loadStep1Questions();
});

// Event Listeners
function initializeEventListeners() {
    // Header
    accountBtn.addEventListener('click', toggleDropdown);
    
    // Voice Recording
    micBtn.addEventListener('click', toggleRecording);
    
    // Chat Panel Toggle
    toggleChatBtn.addEventListener('click', toggleChatPanel);
    floatingChatBtn.addEventListener('click', toggleChatPanel);
    
    // Step Navigation
    document.getElementById('nextStep1')?.addEventListener('click', () => goToStep(2));
    document.getElementById('nextStep3')?.addEventListener('click', () => goToStep(4));
    document.getElementById('nextStep4')?.addEventListener('click', () => goToStep(5));
    document.getElementById('proceedBtn')?.addEventListener('click', startConstruction);
    document.getElementById('addBudgetBtn')?.addEventListener('click', openBudgetModal);
    document.getElementById('deployBtn')?.addEventListener('click', deployWebsite);
    document.getElementById('submitCommentBtn')?.addEventListener('click', submitComment);
    
    // Step indicator clicks - allow going back to completed steps
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.addEventListener('click', () => {
            const stepNumber = index + 1;
            // Allow clicking if step is completed or is the current step
            if (stepEl.classList.contains('completed') || stepEl.classList.contains('active')) {
                goToStep(stepNumber);
            }
        });
    });
    
    // Modal
    document.querySelector('.close-modal')?.addEventListener('click', closeBudgetModal);
    document.getElementById('cancelTopup')?.addEventListener('click', closeBudgetModal);
    document.getElementById('confirmTopup')?.addEventListener('click', confirmTopup);
    
    // Preview Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchPreviewTab(e.target.dataset.tab));
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!accountBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
}

function initializeNavigation() {
    // Initially show step 1
    document.getElementById('step1').classList.add('active');
    document.querySelector('.step').classList.add('active');
}

// Step 2 Functions
function loadStep2Data() {
    // 1. Load features list
    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = '';
    
    projectFeatures.forEach(feature => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.innerHTML = `
            <div class="feature-card-header">
                <div class="feature-icon">
                    <i class="fas ${feature.icon}"></i>
                </div>
                <div class="feature-name">${feature.name}</div>
            </div>
            <div class="feature-description">${feature.description}</div>
            <div class="feature-meta">
                <span class="feature-time">
                    <i class="far fa-clock"></i> ${feature.duration}
                </span>
                <span class="feature-cost">${formatCurrency(feature.cost)}</span>
            </div>
        `;
        featuresList.appendChild(card);
    });
    
    // 2. Load UI/UX breakdown
    const uiuxItems = document.getElementById('uiuxItems');
    uiuxItems.innerHTML = '';
    let uiuxTotal = 0;
    
    uiuxPages.forEach(page => {
        const item = document.createElement('div');
        item.className = 'quote-item';
        item.innerHTML = `
            <div class="quote-item-info">
                <div class="quote-item-name">${page.name}</div>
                <div class="quote-item-desc">${page.description}</div>
            </div>
            <div class="quote-item-price">${formatCurrency(page.cost)}</div>
        `;
        uiuxItems.appendChild(item);
        uiuxTotal += page.cost;
    });
    
    // 3. Load features breakdown
    const featuresItems = document.getElementById('featuresItems');
    featuresItems.innerHTML = '';
    let featuresTotal = 0;
    
    projectFeatures.forEach(feature => {
        const item = document.createElement('div');
        item.className = 'quote-item';
        item.innerHTML = `
            <div class="quote-item-info">
                <div class="quote-item-name">${feature.name}</div>
                <div class="quote-item-desc">${feature.description}</div>
            </div>
            <div class="quote-item-price">${formatCurrency(feature.cost)}</div>
        `;
        featuresItems.appendChild(item);
        featuresTotal += feature.cost;
    });
    
    // 4. Load integration services
    const integrationItems = document.getElementById('integrationItems');
    integrationItems.innerHTML = '';
    let integrationTotal = 0;
    
    integrationServices.forEach(service => {
        const item = document.createElement('div');
        item.className = 'quote-item';
        item.innerHTML = `
            <div class="quote-item-info">
                <div class="quote-item-name">${service.name}</div>
                <div class="quote-item-desc">${service.description}</div>
            </div>
            <div class="quote-item-price">${formatCurrency(service.cost)}</div>
        `;
        integrationItems.appendChild(item);
        integrationTotal += service.cost;
    });
    
    // 5. Load testing & deployment
    const testingItems = document.getElementById('testingItems');
    testingItems.innerHTML = '';
    let testingTotal = 0;
    
    testingDeployment.forEach(item_data => {
        const item = document.createElement('div');
        item.className = 'quote-item';
        item.innerHTML = `
            <div class="quote-item-info">
                <div class="quote-item-name">${item_data.name}</div>
                <div class="quote-item-desc">${item_data.description}</div>
            </div>
            <div class="quote-item-price">${formatCurrency(item_data.cost)}</div>
        `;
        testingItems.appendChild(item);
        testingTotal += item_data.cost;
    });
    
    // 6. Calculate total cost
    appState.totalCost = uiuxTotal + featuresTotal + integrationTotal + testingTotal;
    
    // 7. Update summary
    document.getElementById('totalCost').textContent = formatCurrency(appState.totalCost);
    document.getElementById('currentBudget').textContent = formatCurrency(appState.budget);
    
    const remainingBudget = appState.budget - appState.totalCost;
    const remainingElement = document.getElementById('remainingBudget');
    const balanceRow = document.getElementById('balanceRow');
    
    remainingElement.textContent = formatCurrency(Math.abs(remainingBudget));
    
    if (remainingBudget >= 0) {
        remainingElement.classList.add('positive');
        remainingElement.classList.remove('negative');
        balanceRow.querySelector('.summary-label').textContent = 'Còn lại sau dự án:';
    } else {
        remainingElement.classList.add('negative');
        remainingElement.classList.remove('positive');
        balanceRow.querySelector('.summary-label').textContent = 'Thiếu để thực hiện dự án:';
    }
    
    // 8. Update status badge
    const budgetStatus = document.getElementById('budgetStatus');
    const statusRow = document.getElementById('statusRow');
    const proceedBtn = document.getElementById('proceedBtn');
    const addBudgetBtn = document.getElementById('addBudgetBtn');
    
    if (remainingBudget >= 0) {
        budgetStatus.innerHTML = '<i class="fas fa-check-circle"></i> Đủ ngân sách, sẵn sàng thi công';
        budgetStatus.className = 'summary-value status-badge success';
        proceedBtn.disabled = false;
        addBudgetBtn.style.display = 'none';
    } else {
        budgetStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Cần nạp thêm ngân sách';
        budgetStatus.className = 'summary-value status-badge danger';
        proceedBtn.disabled = true;
        addBudgetBtn.style.display = 'inline-flex';
    }
    
    // 9. Update timeline
    document.getElementById('estimatedTime').innerHTML = `
        <strong>3 ngày</strong>
        <span class="estimate-breakdown">
            AI thiết kế & phát triển toàn bộ website (2 ngày) → Kiểm tra & Triển khai (1 ngày)
        </span>
    `;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function openBudgetModal() {
    const budgetModal = document.getElementById('budgetModal');
    budgetModal.classList.add('show');
}

function closeBudgetModal() {
    const budgetModal = document.getElementById('budgetModal');
    budgetModal.classList.remove('show');
    const topupAmount = document.getElementById('topupAmount');
    if (topupAmount) topupAmount.value = '';
}

function confirmTopup() {
    const topupAmount = document.getElementById('topupAmount');
    const amount = parseInt(topupAmount.value);
    
    if (amount && amount > 0) {
        appState.budget += amount;
        addChatMessage(`Đã nạp thêm ${formatCurrency(amount)} vào tài khoản.`, 'bot');
        closeBudgetModal();
        loadStep2Data();
    } else {
        alert('Vui lòng nhập số tiền hợp lệ!');
    }
}

function startConstruction() {
    addChatMessage('Dự án đã bắt đầu thi công! Bạn có thể theo dõi tiến độ ở Timeline.', 'bot');
    goToStep(3);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeNavigation();
    loadStep1Questions();
});

// Event Listeners
function initializeEventListeners() {
    // Header
    accountBtn.addEventListener('click', toggleDropdown);
    
    // Voice Recording
    micBtn.addEventListener('click', toggleRecording);
    
    // Chat Panel Toggle
    toggleChatBtn.addEventListener('click', toggleChatPanel);
    floatingChatBtn.addEventListener('click', toggleChatPanel);
    
    // Step Navigation
    document.getElementById('nextStep1')?.addEventListener('click', () => goToStep(2));
    document.getElementById('nextStep3')?.addEventListener('click', () => goToStep(4));
    document.getElementById('nextStep4')?.addEventListener('click', () => goToStep(5));
    document.getElementById('proceedBtn')?.addEventListener('click', startConstruction);
    document.getElementById('addBudgetBtn')?.addEventListener('click', openBudgetModal);
    document.getElementById('deployBtn')?.addEventListener('click', deployWebsite);
    document.getElementById('submitCommentBtn')?.addEventListener('click', submitComment);
    
    // Step indicator clicks - allow going back to completed steps
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.addEventListener('click', () => {
            const stepNumber = index + 1;
            // Allow clicking if step is completed or is the current step
            if (stepEl.classList.contains('completed') || stepEl.classList.contains('active')) {
                goToStep(stepNumber);
            }
        });
    });
    
    // Modal
    document.querySelector('.close-modal')?.addEventListener('click', closeBudgetModal);
    document.getElementById('cancelTopup')?.addEventListener('click', closeBudgetModal);
    document.getElementById('confirmTopup')?.addEventListener('click', confirmTopup);
    
    // Preview Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchPreviewTab(e.target.dataset.tab));
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!accountBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
}

// Header Functions
function toggleDropdown() {
    dropdownMenu.classList.toggle('show');
}

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Handle home navigation
            const section = item.getAttribute('href').replace('#', '');
            if (section === 'home') {
                if (confirm('Bạn có chắc muốn quay về trang chủ? Tiến trình hiện tại sẽ không được lưu.')) {
                    location.reload();
                }
            } else {
                console.log(`Navigate to: ${section}`);
            }
        });
    });
}

// Chat Panel Toggle
function toggleChatPanel() {
    leftColumn.classList.toggle('collapsed');
    const isCollapsed = leftColumn.classList.contains('collapsed');
    
    // Icon chevron sẽ tự động xoay qua CSS
    // Không cần thay đổi floating button vì đã ẩn
}

// Voice Recording Functions
function toggleRecording() {
    appState.isRecording = !appState.isRecording;
    
    if (appState.isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

function startRecording() {
    micBtn.classList.add('recording');
    voiceVisualizer.classList.add('active');
    voiceStatus.classList.add('recording');
    voiceStatus.textContent = '🔴 Đang ghi âm...';
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
        if (appState.isRecording) {
            stopRecording();
        }
    }, 3000);
}

function stopRecording() {
    appState.isRecording = false;
    micBtn.classList.remove('recording');
    voiceVisualizer.classList.remove('active');
    voiceStatus.classList.remove('recording');
    voiceStatus.classList.add('processing');
    voiceStatus.textContent = '⚡ Đang xử lý...';
    
    // Simulate LLM processing
    setTimeout(() => {
        processVoiceInput();
        voiceStatus.classList.remove('processing');
        voiceStatus.textContent = '✓ Sẵn sàng ghi âm';
    }, 1500);
}

function processVoiceInput() {
    // Nếu đang ở chế độ edit
    if (appState.editingIndex !== null) {
        const editIndex = appState.editingIndex;
        const qa = appState.qaData[editIndex];
        
        // Simulate recording to processing
        voiceStatus.textContent = '🎤 Đang ghi âm câu trả lời mới...';
        
        setTimeout(() => {
            voiceStatus.classList.add('processing');
            voiceStatus.textContent = '⚡ Đang xử lý...';
            
            // Generate improved answer automatically
            const improvedAnswer = generateImprovedAnswer(qa.question, qa.answer);
            
            setTimeout(() => {
                voiceStatus.classList.remove('processing');
                voiceStatus.textContent = '✓ Sẵn sàng ghi âm';
                
                // Display improved answer as user message
                addChatMessage(improvedAnswer, 'user');
                
                setTimeout(() => {
                    // Update answer
                    qa.answer = improvedAnswer;
                    
                    // Re-evaluate score - đánh giá dựa trên độ dài và chi tiết
                    const newScore = evaluateAnswer(improvedAnswer);
                    qa.score = newScore;
                    
                    const botResponse = `Tuyệt vời! Câu trả lời của bạn đã chi tiết hơn rất nhiều. Điểm mới: ${newScore}/5 - ${getScoreLabel(newScore)}`;
                    addChatMessage(botResponse, 'bot');
                    
                    // Refresh the QA list
                    refreshQAList();
                    
                    // Reset editing mode
                    appState.editingIndex = null;
                    
                    checkStep1Completion();
                }, 1000);
            }, 1500);
        }, 100);
        
        return;
    }
    
    // Logic cũ cho câu hỏi thường
    const currentStepQA = appState.qaData.length;
    
    if (currentStepQA < mockQuestions.length) {
        const userMessage = mockAnswers[currentStepQA];
        const botResponse = generateBotResponse(currentStepQA);
        
        addChatMessage(userMessage, 'user');
        
        setTimeout(() => {
            addChatMessage(botResponse, 'bot');
            
            // Add Q&A to step 1
            if (appState.currentStep === 1) {
                // Sử dụng điểm đã định nghĩa sẵn trong mockScores
                const score = mockScores[currentStepQA];
                addQAItem(mockQuestions[currentStepQA], userMessage, score);
                appState.qaData.push({ question: mockQuestions[currentStepQA], answer: userMessage, score });
                
                checkStep1Completion();
            }
        }, 1000);
    } else {
        addChatMessage('Cảm ơn bạn! Tôi đã ghi nhận đủ thông tin.', 'bot');
    }
}

// Hàm đánh giá câu trả lời
function evaluateAnswer(answer) {
    const length = answer.trim().length;
    const words = answer.trim().split(/\s+/).length;
    
    // Đánh giá dựa trên độ dài và số từ
    if (length > 100 && words > 15) {
        return 1; // Rõ ràng
    } else if (length > 60 && words > 10) {
        return 2; // Khá rõ
    } else if (length > 30 && words > 5) {
        return 3; // Mơ hồ vừa
    } else if (length > 15 && words > 3) {
        return 4; // Mơ hồ
    } else {
        return 5; // Rất mơ hồ
    }
}

// Hàm lấy label điểm
function getScoreLabel(score) {
    const labels = {
        1: 'Rõ ràng',
        2: 'Khá rõ',
        3: 'Mơ hồ vừa',
        4: 'Mơ hồ',
        5: 'Rất mơ hồ'
    };
    return labels[score] || '';
}

// Hàm generate câu trả lời cải thiện tự động
function generateImprovedAnswer(question, oldAnswer) {
    // Danh sách câu trả lời cải thiện theo từng câu hỏi
    const improvedAnswers = {
        'Bạn muốn xây dựng loại website gì? (E-commerce, Blog, Corporate, etc.)': 
            'Website E-commerce bán sản phẩm thời trang dành cho giới trẻ, tập trung vào phân khúc 18-30 tuổi với phong cách hiện đại năng động. Tôi muốn website có khả năng bán hàng trực tuyến với nhiều danh mục sản phẩm, hỗ trợ nhiều phương thức thanh toán và tích hợp với các nền tảng marketing.',
        
        'Dự án cần những tính năng chính nào?':
            'Cần có giỏ hàng thông minh, thanh toán online qua VNPay và Momo, hệ thống quản lý đơn hàng tự động, tìm kiếm và lọc sản phẩm theo nhiều tiêu chí như giá, màu sắc, kích cỡ, wishlist để lưu sản phẩm yêu thích, hệ thống đánh giá và review sản phẩm, quản lý tồn kho và thông báo khi hết hàng.',
        
        'Bạn có yêu cầu gì về thiết kế và giao diện?':
            'Thiết kế hiện đại theo phong cách minimalist, sử dụng màu chủ đạo là trắng, đen và điểm nhấn màu pastel nhẹ nhàng. Giao diện phải responsive hoàn toàn trên mọi thiết bị (mobile, tablet, desktop), có animations mượt mà, ảnh sản phẩm được trình bày theo dạng grid với khả năng zoom và xem 360 độ. Font chữ hiện đại, dễ đọc, layout clean với nhiều white space.',
        
        'Dự án cần tích hợp với hệ thống nào không?':
            'Tích hợp cổng thanh toán VNPay và Momo cho thanh toán nội địa, Facebook Pixel và Google Analytics để tracking và phân tích hành vi người dùng, hệ thống email marketing Mailchimp cho automation campaign, đồng bộ với hệ thống vận chuyển Giao Hàng Nhanh và Giao Hàng Tiết Kiệm, tích hợp chatbot Facebook Messenger để hỗ trợ khách hàng 24/7.',
        
        'Bạn mong muốn thời gian hoàn thành là bao lâu?':
            'Khoảng 6-8 tuần, được chia thành 3 giai đoạn rõ ràng: Giai đoạn 1 là thiết kế UI/UX và xác nhận mockup (2 tuần), giai đoạn 2 là phát triển frontend và backend với các tính năng core (4 tuần), giai đoạn 3 là testing toàn diện, fix bug và deployment lên production (1-2 tuần). Mỗi giai đoạn sẽ có milestone để review và feedback.'
    };
    
    // Trả về câu trả lời cải thiện nếu có, nếu không thì mở rộng câu cũ
    return improvedAnswers[question] || oldAnswer + ' - Đã bổ sung thêm chi tiết về yêu cầu, thời gian thực hiện, và các tiêu chí cụ thể cho dự án này.';
}

function generateBotResponse(questionIndex) {
    const responses = [
        'Tuyệt vời! Website E-commerce bán thời trang cho giới trẻ là một ý tưởng hay. Thông tin rất chi tiết!',
        'Các tính năng bạn liệt kê rất đầy đủ và phù hợp với E-commerce hiện đại. Tôi đã ghi nhận.',
        'Hmm, bạn có thể cho tôi biết cụ thể hơn về yêu cầu thiết kế không? Ví dụ: phong cách màu sắc, layout mong muốn?',
        'Tuyệt! Tích hợp thanh toán và tracking rất quan trọng. Thông tin khá đầy đủ.',
        'Thời gian 6-8 tuần với 3 giai đoạn rõ ràng là rất hợp lý. Chúng ta có thể bắt đầu ngay!'
    ];
    return responses[questionIndex] || 'Cảm ơn thông tin của bạn!';
}

function addChatMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    appState.chatHistory.push({ content, type });
}

// Step 1 Functions
function loadStep1Questions() {
    // Initial bot message already in HTML
}

function addQAItem(question, answer, score) {
    const qaList = document.getElementById('qaList');
    const qaItem = document.createElement('div');
    const itemId = `qa-item-${appState.qaData.length}`;
    
    // Đảo ngược thang điểm: 1 = tốt nhất, 5 = tệ nhất
    const statusClass = score <= 2 ? 'status-good' : score === 3 ? 'status-warning' : 'status-danger';
    const statusIcon = score === 1 ? 'fa-check-circle' : score === 2 ? 'fa-check' : score === 3 ? 'fa-exclamation-triangle' : score === 4 ? 'fa-exclamation-circle' : 'fa-times-circle';
    const statusText = score === 1 ? 'Rõ ràng' : score === 2 ? 'Khá rõ' : score === 3 ? 'Mơ hồ vừa' : score === 4 ? 'Mơ hồ' : 'Rất mơ hồ';
    const statusDesc = score <= 2 ? 'Thông tin đầy đủ, có thể tiếp tục' : score === 3 ? 'Cần bổ sung thêm thông tin' : 'Thiếu nhiều thông tin, cần sửa lại';
    const scoreLabel = score === 1 ? '1 - Rõ ràng' : score === 2 ? '2 - Khá rõ' : score === 3 ? '3 - Mơ hồ vừa' : score === 4 ? '4 - Mơ hồ' : '5 - Rất mơ hồ';
    
    qaItem.className = `qa-item ${statusClass}`;
    qaItem.id = itemId;
    
    qaItem.innerHTML = `
        <div class="qa-row">
            <div class="qa-col-user">
                <div class="user-label">Khách hàng</div>
            </div>
            <div class="qa-col-content">
                <div class="qa-content-text">${answer}</div>
            </div>
            <div class="qa-col-score">
                <div class="score-container">
                    <div class="score-value" title="Điểm đánh giá: ${score}/5">${score}</div>
                </div>
            </div>
            <div class="qa-col-status ${statusClass}">
                <div class="status-main">
                    <i class="fas ${statusIcon}"></i>
                    <span>${statusText}</span>
                </div>
                <div class="status-desc">${statusDesc}</div>
            </div>
            <div class="qa-col-actions">
                ${score > 2 ? `
                    <button class="btn-edit" onclick="editQAItem(${appState.qaData.length})" title="Nhấn để sửa câu trả lời">
                        <i class="fas fa-cog"></i>
                    </button>
                ` : '<span class="check-mark"><i class="fas fa-check"></i></span>'}
            </div>
        </div>
        <div class="qa-question-detail">
            <div class="question-label">
                <i class="fas fa-question-circle"></i>
                <strong>Thông tin cần cung cấp:</strong>
            </div>
            <div class="question-text">${question}</div>
        </div>
    `;
    
    qaList.appendChild(qaItem);
}

function generateStars(score) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= score ? '' : 'empty'}"></i>`;
    }
    return stars;
}

function checkStep1Completion() {
    const nextBtn = document.getElementById('nextStep1');
    const allQuestionsAnswered = appState.qaData.length >= mockQuestions.length;
    // Đảo ngược: điểm <= 2 là tốt (1 = Rõ ràng, 2 = Khá rõ)
    const allScoresGood = appState.qaData.every(qa => qa.score <= 2);
    
    if (allQuestionsAnswered) {
        if (allScoresGood) {
            // Show button and enable it
            nextBtn.style.display = 'inline-flex';
            nextBtn.disabled = false;
            addChatMessage('✅ Tất cả câu trả lời đều rõ ràng! Bạn có thể tiếp tục sang bước tiếp theo.', 'bot');
        } else {
            // Hide button when not all scores are good
            nextBtn.style.display = 'none';
            addChatMessage('⚠️ Một số câu trả lời chưa đủ rõ ràng. Vui lòng click vào nút bánh răng ⚙️ để chỉnh sửa các câu có điểm < 4.', 'bot');
        }
    } else {
        // Hide button when not all questions answered
        nextBtn.style.display = 'none';
    }
}

// Edit QA Item
function editQAItem(index) {
    const qa = appState.qaData[index];
    
    // Set editing mode
    appState.editingIndex = index;
    
    // Mở chat panel nếu đang đóng
    if (!leftColumn.classList.contains('expanded')) {
        toggleChatPanel();
    }
    
    // Hiển thị thông báo trong chat
    const botMessage = `Bạn muốn chỉnh sửa câu trả lời cho câu hỏi:\n\n"${qa.question}"\n\nCâu trả lời hiện tại: "${qa.answer}"\n\nHãy nhấn vào nút micro và nói lại câu trả lời chi tiết hơn nhé!`;
    addChatMessage(botMessage, 'bot');
    
    // Cuộn xuống cuối chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Highlight nút micro để người dùng chú ý
    micBtn.classList.add('pulse-animation');
    setTimeout(() => {
        micBtn.classList.remove('pulse-animation');
    }, 3000);
}

function refreshQAList() {
    const qaList = document.getElementById('qaList');
    qaList.innerHTML = '';
    
    appState.qaData.forEach((qa, index) => {
        addQAItemFromData(qa, index);
    });
}

function addQAItemFromData(qa, index) {
    const qaList = document.getElementById('qaList');
    const qaItem = document.createElement('div');
    const itemId = `qa-item-${index}`;
    
    // Đảo ngược thang điểm: 1 = tốt nhất, 5 = tệ nhất
    const statusClass = qa.score <= 2 ? 'status-good' : qa.score === 3 ? 'status-warning' : 'status-danger';
    const statusIcon = qa.score === 1 ? 'fa-check-circle' : qa.score === 2 ? 'fa-check' : qa.score === 3 ? 'fa-exclamation-triangle' : qa.score === 4 ? 'fa-exclamation-circle' : 'fa-times-circle';
    const statusText = qa.score === 1 ? 'Rõ ràng' : qa.score === 2 ? 'Khá rõ' : qa.score === 3 ? 'Mơ hồ vừa' : qa.score === 4 ? 'Mơ hồ' : 'Rất mơ hồ';
    const statusDesc = qa.score <= 2 ? 'Thông tin đầy đủ, có thể tiếp tục' : qa.score === 3 ? 'Cần bổ sung thêm thông tin' : 'Thiếu nhiều thông tin, cần sửa lại';
    const scoreLabel = qa.score === 1 ? '1 - Rõ ràng' : qa.score === 2 ? '2 - Khá rõ' : qa.score === 3 ? '3 - Mơ hồ vừa' : qa.score === 4 ? '4 - Mơ hồ' : '5 - Rất mơ hồ';
    
    qaItem.className = `qa-item ${statusClass}`;
    qaItem.id = itemId;
    
    qaItem.innerHTML = `
        <div class="qa-row">
            <div class="qa-col-user">
                <div class="user-label">Khách hàng</div>
            </div>
            <div class="qa-col-content">
                <div class="qa-content-text">${qa.answer}</div>
            </div>
            <div class="qa-col-score">
                <div class="score-container">
                    <div class="score-value" title="Điểm đánh giá: ${qa.score}/5">${qa.score}</div>
                </div>
            </div>
            <div class="qa-col-status ${statusClass}">
                <div class="status-main">
                    <i class="fas ${statusIcon}"></i>
                    <span>${statusText}</span>
                </div>
                <div class="status-desc">${statusDesc}</div>
            </div>
            <div class="qa-col-actions">
                ${qa.score > 2 ? `
                    <button class="btn-edit" onclick="editQAItem(${index})" title="Nhấn để sửa câu trả lời">
                        <i class="fas fa-cog"></i>
                    </button>
                ` : '<span class="check-mark"><i class="fas fa-check"></i></span>'}
            </div>
        </div>
        <div class="qa-question-detail">
            <div class="question-label">
                <i class="fas fa-question-circle"></i>
                <strong>Thông tin cần cung cấp:</strong>
            </div>
            <div class="question-text">${qa.question}</div>
        </div>
    `;
    
    qaList.appendChild(qaItem);
}

// Mock pages for each feature
const featurePages = {
    'Thiết kế giao diện UI/UX': [
        'Trang chủ',
        'Trang danh mục sản phẩm',
        'Trang chi tiết sản phẩm',
        'Trang giỏ hàng',
        'Trang thanh toán',
        'Trang tài khoản',
        'Trang đăng nhập'
    ],
    'Giỏ hàng thông minh': [
        'Thêm sản phẩm vào giỏ',
        'Xóa sản phẩm',
        'Chỉnh sửa số lượng',
        'Tính tổng tiền',
        'Áp dụng mã giảm giá',
        'Lưu giỏ hàng'
    ],
    'Thanh toán trực tuyến': [
        'VNPay Integration',
        'Momo Integration',
        'Xác nhận giao dịch',
        'Lưu thông tin thanh toán',
        'Gửi email xác nhận',
        'Cập nhật trạng thái đơn'
    ],
    'Quản lý đơn hàng': [
        'Tạo đơn hàng',
        'Theo dõi trạng thái',
        'Gửi thông báo',
        'Cập nhật vận chuyển',
        'Xác nhận nhận hàng',
        'Lịch sử đơn hàng'
    ],
    'Tìm kiếm & Lọc sản phẩm': [
        'Tìm kiếm theo tên',
        'Lọc theo giá',
        'Lọc theo danh mục',
        'Sắp xếp kết quả',
        'Hiển thị số lượng',
        'Pagination'
    ],
    'Danh sách yêu thích': [
        'Lưu sản phẩm yêu thích',
        'Xóa khỏi wishlist',
        'Hiển thị danh sách',
        'Thông báo khuyến mãi',
        'Chia sẻ wishlist',
        'So sánh sản phẩm'
    ],
    'Đánh giá sản phẩm': [
        'Gửi đánh giá',
        'Viết nhận xét',
        'Đính kèm ảnh',
        'Hiển thị xếp hạng',
        'Sắp xếp review',
        'Hữu ích/Không hữu ích'
    ],
    'Tích hợp bên thứ 3': [
        'Kết nối VNPay',
        'Kết nối Momo',
        'Facebook Pixel',
        'Google Analytics',
        'Mailchimp Email',
        'SMS Notification'
    ],
    'Kiểm tra & Triển khai': [
        'Test tính năng',
        'Kiểm tra bảo mật',
        'Tối ưu tốc độ',
        'Backup dữ liệu',
        'Deploy lên server',
        'Setup domain'
    ]
};

// Step 3 Functions
function loadStep3Data() {
    const featurePipeline = document.getElementById('featurePipeline');
    featurePipeline.innerHTML = '';
    
    appState.features = mockFeatures.map((feature, index) => ({
        ...feature,
        status: 'pending',
        progress: 0,
        pages: featurePages[feature.name] || []
    }));
    
    appState.features.forEach((feature, index) => {
        const item = document.createElement('div');
        item.className = 'feature-item';
        item.id = `feature-${index}`;
        
        const pagesHTML = feature.pages.map((page, pageIndex) => `
            <div class="page-item">
                <div class="page-status-icon pending" id="page-status-${index}-${pageIndex}">
                    <i class="fas fa-circle"></i>
                </div>
                <span class="page-name">${page}</span>
                <span class="page-status-label" id="page-label-${index}-${pageIndex}">Chưa làm</span>
            </div>
        `).join('');
        
        item.innerHTML = `
            <div class="feature-header">
                <span class="feature-name">${feature.name}</span>
                <span class="feature-status pending" id="status-${index}">Chưa thực hiện</span>
            </div>
            <div class="feature-pages">
                ${pagesHTML}
            </div>
        `;
        featurePipeline.appendChild(item);
    });
    
    // Load progress summary
    updateProgressSummary();
    
    // Start simulating progress
    simulateProgress();
}

function updateProgressSummary() {
    const progressSummary = document.getElementById('progressSummary');
    const totalPages = appState.features.reduce((sum, f) => sum + f.pages.length, 0);
    const totalProgress = appState.features.reduce((sum, f) => sum + f.progress, 0);
    const avgProgress = Math.round(totalProgress / (appState.features.length * 100) * 100);
    
    const completedFeatures = appState.features.filter(f => f.status === 'completed').length;
    const inProgressFeatures = appState.features.filter(f => f.status === 'in-progress').length;
    const pendingFeatures = appState.features.filter(f => f.status === 'pending').length;
    
    progressSummary.innerHTML = `
        <div class="progress-stat">
            <div class="progress-stat-label">Tiến độ chung</div>
            <div class="progress-stat-value">${avgProgress}%</div>
        </div>
        
        <div class="progress-bar-container">
            <div class="progress-bar-label">
                <span>Tiến trình:</span>
                <span>${appState.features.filter(f => f.status === 'completed').length}/${appState.features.length} features</span>
            </div>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${avgProgress}%"></div>
            </div>
        </div>
        
        <div class="progress-status-card">
            <div class="progress-status-item">
                <div class="progress-status-icon completed">
                    <i class="fas fa-check-circle"></i>
                </div>
                <span class="progress-status-text">Hoàn thành: <strong>${completedFeatures}</strong></span>
            </div>
            <div class="progress-status-item">
                <div class="progress-status-icon in-progress">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <span class="progress-status-text">Đang làm: <strong>${inProgressFeatures}</strong></span>
            </div>
            <div class="progress-status-item">
                <div class="progress-status-icon pending">
                    <i class="fas fa-circle"></i>
                </div>
                <span class="progress-status-text">Chưa làm: <strong>${pendingFeatures}</strong></span>
            </div>
        </div>
    `;
}

function simulateProgress() {
    let currentFeature = 0;
    let currentPageInFeature = 0;
    
    const interval = setInterval(() => {
        if (currentFeature >= appState.features.length) {
            clearInterval(interval);
            updateProgressSummary();
            document.getElementById('nextStep3').disabled = false;
            addChatMessage('Tất cả tính năng đã hoàn thành! Bạn có thể xem kết quả.', 'bot');
            return;
        }
        
        const feature = appState.features[currentFeature];
        const featureElement = document.getElementById(`feature-${currentFeature}`);
        const statusElement = featureElement.querySelector('.feature-status');
        
        // Mark feature as in-progress
        if (feature.status === 'pending') {
            feature.status = 'in-progress';
            featureElement.classList.add('in-progress');
            statusElement.textContent = 'Đang thực hiện';
            statusElement.className = 'feature-status in-progress';
            currentPageInFeature = 0;
        }
        
        // Update page status
        if (currentPageInFeature < feature.pages.length) {
            const pageStatusIcon = document.getElementById(`page-status-${currentFeature}-${currentPageInFeature}`);
            const pageLabel = document.getElementById(`page-label-${currentFeature}-${currentPageInFeature}`);
            
            pageStatusIcon.className = 'page-status-icon in-progress';
            pageStatusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            pageLabel.textContent = 'Đang làm';
            
            // Simulate page completion after 500ms
            setTimeout(() => {
                pageStatusIcon.className = 'page-status-icon completed';
                pageStatusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                pageLabel.textContent = 'Hoàn thành';
            }, 500);
            
            feature.progress += Math.round(100 / feature.pages.length);
            currentPageInFeature++;
        } else {
            // All pages done, mark feature as completed
            feature.status = 'completed';
            featureElement.classList.remove('in-progress');
            featureElement.classList.add('completed');
            statusElement.textContent = 'Hoàn thành';
            statusElement.className = 'feature-status completed';
            feature.progress = 100;
            currentFeature++;
            currentPageInFeature = 0;
        }
        
        updateProgressSummary();
    }, 1000);
}

// Step 4 Functions (Preview)
function loadStep4Data() {
    // Load preview content
    const previewFrame = document.getElementById('previewFrame');
    previewFrame.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
            <h1 style="color: var(--primary-color); margin-bottom: 1rem;">Fashion Store</h1>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">Website E-commerce của bạn</p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                ${[1, 2, 3, 4, 5, 6].map(i => `
                    <div style="background: var(--light-bg); padding: 1rem; border-radius: 8px;">
                        <div style="width: 100%; height: 150px; background: var(--border-color); border-radius: 8px; margin-bottom: 0.5rem;"></div>
                        <p style="font-weight: 600;">Sản phẩm ${i}</p>
                        <p style="color: var(--primary-color);">1,000,000 VNĐ</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Enable next button
    const nextBtn = document.getElementById('nextStep4');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

// Step 5 Functions (Deploy)
function loadStep5Data() {
    addChatMessage('Bạn đã sẵn sàng đưa website lên internet! Hãy nhấn nút Deploy khi sẵn sàng.', 'bot');
}

function switchPreviewTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // In a real app, this would load different preview content
    addChatMessage(`Đã chuyển sang giao diện ${tab === 'admin' ? 'Admin' : 'Client'}`, 'bot');
}

function submitComment() {
    const comment = document.getElementById('commentInput').value.trim();
    
    if (comment) {
        addChatMessage(`Góp ý: ${comment}`, 'user');
        setTimeout(() => {
            addChatMessage('Cảm ơn góp ý của bạn! Chúng tôi sẽ xem xét và cập nhật.', 'bot');
        }, 1000);
        document.getElementById('commentInput').value = '';
    }
}

function deployWebsite() {
    const deployBtn = document.getElementById('deployBtn');
    const deployStatus = document.getElementById('deployStatus');
    const websiteUrl = document.getElementById('websiteUrl');
    
    deployBtn.disabled = true;
    deployBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đưa lên internet...';
    deployStatus.textContent = 'Đang xử lý...';
    
    setTimeout(() => {
        const deployResult = document.getElementById('deployResult');
        const deployLink = document.getElementById('deployLink');
        
        const randomDomain = `fashion-store-${Math.random().toString(36).substr(2, 9)}.vercel.app`;
        const fullUrl = `https://${randomDomain}`;
        
        deployLink.href = fullUrl;
        websiteUrl.textContent = randomDomain;
        deployStatus.textContent = 'Đã hoàn thành';
        
        deployResult.style.display = 'block';
        deployBtn.style.display = 'none';
        
        addChatMessage(`🎉 Chúc mừng! Website đã được đưa lên internet tại: ${randomDomain}`, 'bot');
    }, 3000);
}

// Navigation Functions
function goToStep(stepNumber) {
    // Update state
    appState.currentStep = stepNumber;
    
    // Update step indicator
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active');
        step.classList.remove('completed');
        
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
        }
        if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });
    
    // Update step panels
    document.querySelectorAll('.step-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Load step data
    switch(stepNumber) {
        case 2:
            loadStep2Data();
            break;
        case 3:
            loadStep3Data();
            break;
        case 4:
            loadStep4Data();
            break;
        case 5:
            loadStep5Data();
            break;
    }
    
    // Scroll to top
    document.querySelector('.right-column').scrollTop = 0;
}

// Utility function to simulate typing effect
function typeMessage(element, text, speed = 30) {
    let i = 0;
    element.textContent = '';
    
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, speed);
}

console.log('🚀 AI Website Builder initialized!');
