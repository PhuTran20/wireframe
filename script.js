// Application State
const appState = {
    currentStep: 1,
    isRecording: false,
    qaData: [],
    credit: 50000000, // 50 triệu VNĐ credit ban đầu
    totalCost: 0,
    features: [],
    chatHistory: [],
    editingIndex: null, // Để track câu hỏi đang được chỉnh sửa
    editingQAIndex: null, // Track câu đang edit từ editor
    summaryViewed: false, // Track if user has viewed the summary modal
    completionMessageShown: false, // Track if completion message was shown
    improvementMessageShown: false, // Track if improvement message was shown
    sessionSaved: false, // Track if session has been saved
    isPaused: false // Track if session is paused
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
    "Giỏ hàng, thanh toán, quản lý đơn hàng",
    "Thiết kế hiện đại",
    "Tích hợp VNPay, Momo",
    "Khoảng 6-8 tuần"
];

// Điểm đánh giá tương ứng (1=tốt nhất, 5=tệ nhất)
const mockScores = [1, 3, 5, 2, 1]; // Demo đầy đủ: điểm 1, 3, 5, 2, 1

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
const toggleChatBtn = document.getElementById('toggleChatBtn');
const floatingChatBtn = document.getElementById('floatingChatBtn');
const leftColumn = document.getElementById('leftColumn');

// Step 2 Functions
function loadStep2Data() {
    // 1. Load project recap from Step 1 summary
    loadProjectRecap();
    
    // 2. Load cost breakdown based on summary sections
    loadCostBreakdown();
    
    // 3. Update credit summary
    updateCreditSummary();
}

function loadProjectRecap() {
    const recapContent = document.getElementById('recapContent');
    const naturalSummary = generateNaturalLanguageSummary();
    
    recapContent.innerHTML = `
        <div class="recap-intro">
            <p>${naturalSummary.intro}</p>
        </div>
        <div class="recap-highlights">
            ${naturalSummary.sections.slice(0, 2).map(section => `
                <div class="recap-item">
                    <i class="${section.icon}"></i>
                    <div class="recap-item-content">
                        <strong>${section.title}</strong>
                        <p>${section.content}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function loadCostBreakdown() {
    const costSections = document.getElementById('costSections');
    const qaData = appState.qaData;
    
    // Generate cost items based on user's answers
    const websiteType = qaData[0]?.answer || 'website';
    const features = qaData[1]?.answer || 'các tính năng cơ bản';
    const design = qaData[2]?.answer || 'giao diện đẹp mắt';
    const integration = qaData[3]?.answer || 'các hệ thống cần thiết';
    
    // Parse features to estimate cost
    const featuresList = features.split(',').map(f => f.trim().toLowerCase());
    
    const costData = [
        {
            icon: 'fas fa-lightbulb',
            title: 'Lập kế hoạch & Phân tích',
            description: `Chúng tôi sẽ phân tích yêu cầu cho ${websiteType}, lên kế hoạch chi tiết và thiết kế kiến trúc hệ thống phù hợp.`,
            items: [
                { name: 'Phân tích yêu cầu dự án', cost: 2000000 },
                { name: 'Thiết kế kiến trúc hệ thống', cost: 3000000 },
                { name: 'Lập kế hoạch phát triển', cost: 1500000 }
            ]
        },
        {
            icon: 'fas fa-paint-brush',
            title: 'Thiết kế giao diện',
            description: `Tạo giao diện ${design} với trải nghiệm người dùng tối ưu trên mọi thiết bị.`,
            items: generateDesignCosts(websiteType)
        },
        {
            icon: 'fas fa-cogs',
            title: 'Phát triển tính năng',
            description: `Xây dựng các tính năng: ${features.substring(0, 100)}${features.length > 100 ? '...' : ''}.`,
            items: generateFeatureCosts(featuresList)
        },
        {
            icon: 'fas fa-plug',
            title: 'Tích hợp hệ thống',
            description: `Kết nối website với ${integration} để hệ thống hoạt động trơn tru.`,
            items: generateIntegrationCosts(integration)
        },
        {
            icon: 'fas fa-check-double',
            title: 'Kiểm tra & Triển khai',
            description: 'Đảm bảo website hoạt động ổn định, bảo mật và đưa lên internet để mọi người truy cập.',
            items: [
                { name: 'Kiểm tra chức năng toàn diện', cost: 3000000 },
                { name: 'Kiểm tra bảo mật', cost: 2000000 },
                { name: 'Tối ưu hiệu suất', cost: 2000000 },
                { name: 'Triển khai lên server', cost: 3000000 }
            ]
        }
    ];
    
    let totalCost = 0;
    
    costSections.innerHTML = costData.map(section => {
        const sectionTotal = section.items.reduce((sum, item) => sum + item.cost, 0);
        totalCost += sectionTotal;
        
        return `
            <div class="cost-section-natural">
                <div class="cost-section-header-simple">
                    <div class="cost-section-icon">
                        <i class="${section.icon}"></i>
                    </div>
                    <div class="cost-section-info">
                        <h4>${section.title}</h4>
                        <p>${section.description}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    appState.totalCost = totalCost;
}

function generateDesignCosts(websiteType) {
    const isEcommerce = websiteType.toLowerCase().includes('commerce') || 
                        websiteType.toLowerCase().includes('bán hàng');
    
    const baseCosts = [
        { name: 'Thiết kế trang chủ', cost: 3000000 },
        { name: 'Thiết kế các trang nội dung', cost: 2500000 },
        { name: 'Thiết kế responsive (mobile, tablet)', cost: 2000000 }
    ];
    
    if (isEcommerce) {
        baseCosts.push(
            { name: 'Thiết kế trang sản phẩm', cost: 2500000 },
            { name: 'Thiết kế giỏ hàng & thanh toán', cost: 3000000 }
        );
    }
    
    return baseCosts;
}

function generateFeatureCosts(featuresList) {
    const costs = [];
    const featureText = featuresList.join(' ');
    
    // Check for common features and add costs
    if (featureText.includes('giỏ hàng') || featureText.includes('cart')) {
        costs.push({ name: 'Giỏ hàng thông minh', cost: 8000000 });
    }
    
    if (featureText.includes('thanh toán') || featureText.includes('payment')) {
        costs.push({ name: 'Hệ thống thanh toán online', cost: 10000000 });
    }
    
    if (featureText.includes('đơn hàng') || featureText.includes('order')) {
        costs.push({ name: 'Quản lý đơn hàng', cost: 9000000 });
    }
    
    if (featureText.includes('tìm kiếm') || featureText.includes('search')) {
        costs.push({ name: 'Tìm kiếm & lọc sản phẩm', cost: 7000000 });
    }
    
    if (featureText.includes('đánh giá') || featureText.includes('review')) {
        costs.push({ name: 'Hệ thống đánh giá', cost: 5000000 });
    }
    
    if (featureText.includes('yêu thích') || featureText.includes('wishlist')) {
        costs.push({ name: 'Danh sách yêu thích', cost: 4000000 });
    }
    
    // Add default if no features detected
    if (costs.length === 0) {
        costs.push(
            { name: 'Các tính năng cơ bản', cost: 15000000 },
            { name: 'Quản lý nội dung', cost: 8000000 }
        );
    }
    
    return costs;
}

function generateIntegrationCosts(integration) {
    const costs = [];
    const integrationText = integration.toLowerCase();
    
    if (integrationText.includes('vnpay')) {
        costs.push({ name: 'Tích hợp VNPay', cost: 3000000 });
    }
    
    if (integrationText.includes('momo')) {
        costs.push({ name: 'Tích hợp Momo', cost: 3000000 });
    }
    
    if (integrationText.includes('facebook') || integrationText.includes('pixel')) {
        costs.push({ name: 'Facebook Pixel & Marketing', cost: 2000000 });
    }
    
    if (integrationText.includes('google') || integrationText.includes('analytics')) {
        costs.push({ name: 'Google Analytics', cost: 1500000 });
    }
    
    if (integrationText.includes('email') || integrationText.includes('mailchimp')) {
        costs.push({ name: 'Email Marketing', cost: 2500000 });
    }
    
    // Add default if no integrations detected
    if (costs.length === 0) {
        costs.push({ name: 'Tích hợp cơ bản', cost: 5000000 });
    }
    
    return costs;
}

function updateCreditSummary() {
    const freeCredit = appState.credit; // Credit miễn phí ban đầu
    const projectCost = appState.totalCost;
    const amountToPay = Math.max(0, projectCost - freeCredit); // Số tiền cần trả
    
    const paymentDisplay = document.getElementById('paymentDisplay');
    const budgetStatus = document.getElementById('budgetStatus');
    const proceedBtn = document.getElementById('proceedBtn');
    const addCreditBtn = document.getElementById('addCreditBtn');
    
    // Hiển thị số tiền cần trả hoặc miễn phí
    if (amountToPay === 0) {
        // Dự án nằm trong gói miễn phí
        paymentDisplay.innerHTML = `
            <div class="payment-free">
                <i class="fas fa-gift"></i>
                <div class="payment-free-text">
                    <div class="free-label">Miễn phí</div>
                    <div class="free-desc">Dự án này nằm trong gói miễn phí của bạn</div>
                </div>
            </div>
        `;
        
        budgetStatus.innerHTML = '<i class="fas fa-check-circle"></i> Sẵn sàng thi công ngay';
        budgetStatus.className = 'payment-status success';
        proceedBtn.disabled = false;
        addCreditBtn.style.display = 'none';
    } else {
        // Cần thanh toán thêm
        paymentDisplay.innerHTML = `
            <div class="payment-required">
                <div class="payment-label">Số tiền cần thanh toán</div>
                <div class="payment-amount">${formatCurrency(amountToPay)}</div>
                <div class="payment-note"></div>
            </div>
        `;
        
        budgetStatus.innerHTML = '<i class="fas fa-credit-card"></i> Vui lòng thanh toán để bắt đầu';
        budgetStatus.className = 'payment-status warning';
        proceedBtn.disabled = true;
        addCreditBtn.style.display = 'inline-flex';
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function openCreditModal() {
    const creditModal = document.getElementById('creditModal');
    const freeCredit = appState.credit;
    const projectCost = appState.totalCost;
    const amountToPay = Math.max(0, projectCost - freeCredit);
    
    // Update the amount to pay
    const creditNeededEl = document.getElementById('creditNeeded');
    if (creditNeededEl) {
        creditNeededEl.textContent = formatCurrency(amountToPay);
    }
    
    creditModal.classList.add('show');
}

function closeCreditModal() {
    const creditModal = document.getElementById('creditModal');
    creditModal.classList.remove('show');
}

function confirmTopup() {
    // Simulate payment success
    const freeCredit = appState.credit;
    const projectCost = appState.totalCost;
    const amountToPay = Math.max(0, projectCost - freeCredit);
    
    addChatMessage(`Đã thanh toán thành công ${formatCurrency(amountToPay)}. Dự án sẵn sàng thi công!`, 'bot');
    
    // Increase credit to cover the project
    appState.credit = projectCost;
    
    closeCreditModal();
    loadStep2Data();
}

function startConstruction() {
    addChatMessage('Dự án đã bắt đầu thi công! Bạn có thể theo dõi tiến độ ở Timeline.', 'bot');
    goToStep(3);
    loadStep3Progress();
}

// Step 3 Functions - Progress & Preview
function loadStep3Progress() {
    const workProgressList = document.getElementById('workProgressList');
    
    // Get work sections from Step 2
    const workSections = [
        {
            title: 'Lập kế hoạch & Phân tích',
            icon: 'fas fa-lightbulb',
            tasks: ['Phân tích yêu cầu dự án', 'Thiết kế kiến trúc hệ thống', 'Lập kế hoạch phát triển']
        },
        {
            title: 'Thiết kế giao diện',
            icon: 'fas fa-paint-brush',
            tasks: ['Thiết kế trang chủ', 'Thiết kế các trang nội dung', 'Thiết kế responsive']
        },
        {
            title: 'Phát triển tính năng',
            icon: 'fas fa-cogs',
            tasks: ['Giỏ hàng thông minh', 'Hệ thống thanh toán online', 'Quản lý đơn hàng']
        },
        {
            title: 'Tích hợp hệ thống',
            icon: 'fas fa-plug',
            tasks: ['Tích hợp VNPay', 'Tích hợp Momo', 'Facebook Pixel & Marketing']
        },
        {
            title: 'Kiểm tra & Triển khai',
            icon: 'fas fa-check-double',
            tasks: ['Kiểm tra chức năng toàn diện', 'Kiểm tra bảo mật', 'Tối ưu hiệu suất', 'Triển khai lên server']
        }
    ];
    
    workProgressList.innerHTML = workSections.map((section, index) => `
        <div class="work-progress-item" data-section="${index}">
            <div class="work-progress-header">
                <div class="work-progress-icon">
                    <i class="${section.icon}"></i>
                </div>
                <div class="work-progress-info">
                    <h4>${section.title}</h4>
                    <div class="work-progress-meta">
                        <span class="progress-status" id="status-${index}">Chưa bắt đầu</span>
                        <span class="progress-percent" id="percent-${index}">0%</span>
                    </div>
                </div>
            </div>
            <div class="work-progress-bar">
                <div class="progress-fill" id="progress-${index}" style="width: 0%"></div>
            </div>
        </div>
    `).join('');
    
    // Start progress simulation
    simulateProgress(workSections);
}

function simulateProgress(workSections) {
    let currentSection = 0;
    
    const progressInterval = setInterval(() => {
        if (currentSection >= workSections.length) {
            clearInterval(progressInterval);
            onProgressComplete();
            return;
        }
        
        const section = workSections[currentSection];
        const totalTasks = section.tasks.length;
        
        // Animate progress from 0 to 100 for current section
        let currentProgress = 0;
        const progressStep = 100 / totalTasks;
        
        const sectionInterval = setInterval(() => {
            if (currentProgress >= 100) {
                clearInterval(sectionInterval);
                document.getElementById(`status-${currentSection}`).textContent = 'Hoàn thành';
                document.getElementById(`status-${currentSection}`).className = 'progress-status completed';
                currentSection++;
                return;
            }
            
            currentProgress += progressStep;
            if (currentProgress > 100) currentProgress = 100;
            
            document.getElementById(`progress-${currentSection}`).style.width = `${currentProgress}%`;
            document.getElementById(`percent-${currentSection}`).textContent = `${Math.round(currentProgress)}%`;
            document.getElementById(`status-${currentSection}`).textContent = 'Đang thực hiện';
            document.getElementById(`status-${currentSection}`).className = 'progress-status active';
        }, 800 / totalTasks);
        
    }, 3000); // 3 seconds per section
}

function onProgressComplete() {
    // Show preview section
    document.getElementById('previewSection').style.display = 'block';
    
    // Enable next button
    document.getElementById('nextStep3').disabled = false;
    
    // Scroll to preview
    document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    addChatMessage('Website đã hoàn thành! Hãy xem thử và gửi ý kiến nếu cần chỉnh sửa.', 'bot');
}

// Session Management Functions
function saveSession() {
    // Lưu appState vào localStorage
    const sessionData = {
        qaData: appState.qaData,
        chatHistory: appState.chatHistory,
        credit: appState.credit,
        totalCost: appState.totalCost,
        currentStep: appState.currentStep,
        summaryViewed: appState.summaryViewed,
        completionMessageShown: appState.completionMessageShown,
        improvementMessageShown: appState.improvementMessageShown,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('wireframeSession', JSON.stringify(sessionData));
    appState.sessionSaved = true;
}

function loadSavedSession() {
    // Kiểm tra xem có phiên làm việc đã lưu không
    const savedSession = localStorage.getItem('wireframeSession');
    
    if (savedSession) {
        try {
            const sessionData = JSON.parse(savedSession);
            
            // Khôi phục dữ liệu
            appState.qaData = sessionData.qaData || [];
            appState.chatHistory = sessionData.chatHistory || [];
            appState.credit = sessionData.credit || 50000000;
            appState.totalCost = sessionData.totalCost || 0;
            appState.currentStep = sessionData.currentStep || 1;
            appState.summaryViewed = sessionData.summaryViewed || false;
            appState.completionMessageShown = sessionData.completionMessageShown || false;
            appState.improvementMessageShown = sessionData.improvementMessageShown || false;
            appState.sessionSaved = true;
            
            // Nếu có QA data, cập nhật UI
            if (appState.qaData.length > 0) {
                // Refresh QA list
                setTimeout(() => {
                    refreshQAList();
                    checkStep1Completion();
                    
                    // Hiển thị thông báo
                    addChatMessage('✓ Đã tải lại phiên làm việc trước đó của bạn. Bạn có thể tiếp tục bằng cách nhấn nút micro.', 'bot');
                }, 500);
            }
        } catch (e) {
            console.error('Lỗi tải phiên làm việc:', e);
        }
    }
}

function clearSession() {
    // Xóa phiên làm việc đã lưu
    localStorage.removeItem('wireframeSession');
    appState.sessionSaved = false;
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra và tải lại phiên làm việc đã lưu
    loadSavedSession();
    
    initializeEventListeners();
    initializeNavigation();
    loadStep1Questions();
    
    // Close popovers when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.qa-sentence')) {
            document.querySelectorAll('.sentence-popover').forEach(popover => {
                popover.classList.remove('active');
            });
            document.querySelectorAll('.qa-sentence').forEach(sentence => {
                sentence.classList.remove('active');
            });
        }
    });
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
    document.getElementById('summaryBtn')?.addEventListener('click', openSummaryModal);
    document.getElementById('endChatBtn')?.addEventListener('click', openEndChatModal);
    document.getElementById('pauseBtn')?.addEventListener('click', pauseSession);
    document.getElementById('nextStep3')?.addEventListener('click', () => goToStep(4));
    document.getElementById('proceedBtn')?.addEventListener('click', startConstruction);
    document.getElementById('addCreditBtn')?.addEventListener('click', openCreditModal);
    document.getElementById('deployBtn')?.addEventListener('click', deployWebsite);
    document.getElementById('submitCommentBtn')?.addEventListener('click', submitComment);
    
    // Step indicator clicks - allow going back to completed steps
    document.querySelectorAll('.step').forEach((stepEl) => {
        stepEl.addEventListener('click', () => {
            const stepDataAttr = stepEl.getAttribute('data-step');
            const stepNumber = parseInt(stepDataAttr);
            // Allow clicking if step is completed or is the current step
            if (stepEl.classList.contains('completed') || stepEl.classList.contains('active')) {
                goToStep(stepNumber);
            }
        });
    });
    
    // Modal - Credit topup
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
    document.getElementById('cancelTopup')?.addEventListener('click', closeCreditModal);
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
    voiceStatus.innerHTML = '<span class="status-dot recording"></span>Đang ghi âm...';
    
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
    voiceStatus.innerHTML = '<span class="status-dot processing"></span>Đang xử lý...';
    
    // Simulate LLM processing
    setTimeout(() => {
        processVoiceInput();
        voiceStatus.classList.remove('processing');
        voiceStatus.innerHTML = '<span class="status-dot ready"></span>Sẵn sàng ghi âm';
    }, 1500);
}

function processVoiceInput() {
    // Nếu đang ở chế độ edit (check both editingIndex and editingQAIndex)
    if (appState.editingIndex !== null || appState.editingQAIndex !== null) {
        const editIndex = appState.editingIndex !== null ? appState.editingIndex : appState.editingQAIndex;
        const qa = appState.qaData[editIndex];
        
        // Simulate recording to processing
        voiceStatus.innerHTML = '<span class="status-dot recording"></span>Đang ghi âm câu trả lời mới...';
        
        setTimeout(() => {
            voiceStatus.classList.add('processing');
            voiceStatus.innerHTML = '<span class="status-dot processing"></span>Đang xử lý...';
            
            // Generate improved answer automatically
            const improvedAnswer = generateImprovedAnswer(qa.question, qa.answer);
            
            setTimeout(() => {
                voiceStatus.classList.remove('processing');
                voiceStatus.innerHTML = '<span class="status-dot ready"></span>Sẵn sàng ghi âm';
                
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
                    appState.editingQAIndex = null;
                    
                    // Remove active editing highlight
                    document.querySelectorAll('.qa-sentence').forEach(s => s.classList.remove('active-editing'));
                    
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
                
                // Push to data FIRST
                appState.qaData.push({ question: mockQuestions[currentStepQA], answer: userMessage, score });
                
                // Then update UI
                addQAItem(mockQuestions[currentStepQA], userMessage, score);
                
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
            'Tích hợp cổng thanh toán VNPay và Momo cho thanh toán nội địa, Facebook Pixel và Google Analytics để tracking và phân tích hành vi người dùng, hệ thống email marketing Mailchimp cho automation campaign, đồng bộ với hệ thống vận chuyển như Giao Hàng Nhanh, tích hợp chatbot Facebook Messenger để hỗ trợ khách hàng 24/7.',
        
        'Bạn mong muốn thời gian hoàn thành là bao lâu?':
            'Khoảng 6-8 tuần, được chia thành 3 giai đoạn rõ ràng: Giai đoạn 1 là thiết kế UI/UX và xác nhận mockup (2 tuần), giai đoạn 2 là phát triển frontend và backend với các tính năng core (4 tuần), giai đoạn 3 là testing toàn diện, fix bug và deployment lên production (1-2 tuần). Mỗi giai đoạn sẽ có milestone để review và feedback.'
    };
    
    // Trả về câu trả lời cải thiện nếu có, nếu không thì mở rộng câu cũ
    return improvedAnswers[question] || oldAnswer + ' - Đã bổ sung thêm chi tiết về yêu cầu, thời gian thực hiện, và các tiêu chí cụ thể cho dự án này.';
}

function generateBotResponse(questionIndex) {
    const responses = [
        'Tuyệt vời! Website E-commerce bán thời trang cho giới trẻ là một ý tưởng hay. Thông tin rất chi tiết!',
        'Hmm, bạn có thể cho tôi biết cụ thể hơn về các tính năng không? Ví dụ: thanh toán qua kênh nào, có wishlist không?',
        'Ồ, thông tin về thiết kế hơi ngắn. Bạn có thể mô tả rõ hơn về phong cách, màu sắc, layout mong muốn không?',
        'Tuyệt! Tích hợp VNPay và Momo rất phù hợp cho thị trường Việt Nam.',
        'Thời gian 6-8 tuần là hợp lý. Tôi đã ghi nhận!'
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
    const qaTextEditor = document.getElementById('qaTextEditor');
    
    // Index should be current length - 1 (the item we just pushed)
    const currentIndex = appState.qaData.length - 1;
    const itemId = `qa-item-${currentIndex}`;
    
    // Đảo ngược thang điểm: 1 = tốt nhất, 5 = tệ nhất
    const statusClass = score <= 2 ? 'status-good' : score === 3 ? 'status-warning' : 'status-danger';
    const statusIcon = score === 1 ? 'fa-check-circle' : score === 2 ? 'fa-check' : score === 3 ? 'fa-exclamation-triangle' : score === 4 ? 'fa-exclamation-circle' : 'fa-times-circle';
    const statusText = score === 1 ? 'Rõ ràng' : score === 2 ? 'Khá rõ' : score === 3 ? 'Mơ hồ vừa' : score === 4 ? 'Mơ hồ' : 'Rất mơ hồ';
    const statusDesc = score <= 2 ? 'Thông tin đầy đủ, có thể tiếp tục' : score === 3 ? 'Cần bổ sung thêm thông tin' : 'Thiếu nhiều thông tin, cần sửa lại';
    
    // Add to hidden list (for backward compatibility)
    const qaItem = document.createElement('div');
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
                    <button class="btn-edit" onclick="editQAItem(${currentIndex})" title="Nhấn để sửa câu trả lời">
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
    
    // Update text editor view
    updateTextEditor();
}

function updateTextEditor() {
    const qaTextEditor = document.getElementById('qaTextEditor');
    
    if (appState.qaData.length === 0) {
        qaTextEditor.innerHTML = `
            <p class="editor-placeholder">
                Câu trả lời của bạn sẽ được hiển thị ở đây dưới dạng đoạn văn.
                Những phần được tô màu là những câu cần bổ sung thêm thông tin.
                Click vào để xem chi tiết và chỉnh sửa.
            </p>
        `;
        return;
    }
    
    // Build paragraph from all answers - các câu văn sẽ hiển thị liền nhau
    const sentences = appState.qaData.map((qa, index) => {
        const scoreClass = qa.score <= 2 ? 'score-good' : qa.score === 3 ? 'score-warning' : 'score-danger';
        const popoverClass = qa.score <= 2 ? 'popover-good' : qa.score === 3 ? 'popover-warning' : 'popover-danger';
        
        // Icon for score 3, 4, 5
        let scoreIcon = '';
        if (qa.score === 3) {
            scoreIcon = '<i class="fas fa-exclamation-triangle qa-sentence-icon"></i>';
        } else if (qa.score >= 4) {
            scoreIcon = '<i class="fas fa-times-circle qa-sentence-icon"></i>';
        }
        
        // Popover for all sentences
        let popoverHtml = '';
        const headerIcon = qa.score <= 2 ? 'fa-check-circle' : qa.score === 3 ? 'fa-exclamation-triangle' : 'fa-times-circle';
        const scoreLabel = qa.score <= 2 ? 'Rõ ràng' : qa.score === 3 ? 'Mơ hồ - Cần bổ sung' : 'Cần chỉnh sửa';
        const hint = getHintForQuestion(qa.question, qa.score);
        
        popoverHtml = `
            <div class="sentence-popover ${popoverClass}" data-popover-index="${index}">
                <div class="popover-header">
                    <i class="fas ${headerIcon}"></i>
                    <div class="popover-question">${scoreLabel}</div>
                </div>
                <div class="popover-content">
                    <div class="popover-original-question">
                        <strong>Thông tin cần cung cấp:</strong>
                        <p>${qa.question}</p>
                    </div>
                    <div class="popover-hint">
                        <strong>Phản hồi:</strong>
                        <p>${hint}</p>
                    </div>
                </div>
                <div class="popover-actions">
                    <button class="popover-btn btn-voice" onclick="event.stopPropagation(); editQAFromPopover(${index});">
                        <i class="fas fa-microphone"></i>
                        <span>Sửa bằng voice</span>
                    </button>
                    <button class="popover-btn btn-delete" onclick="event.stopPropagation(); deleteQAItem(${index});">
                        <i class="fas fa-trash"></i>
                        <span>Xóa</span>
                    </button>
                </div>
            </div>
        `;
        
        return `<span class="qa-sentence ${scoreClass} editable" data-qa-index="${index}" onclick="event.stopPropagation(); toggleQAPopover(${index});">
            ${qa.answer}${scoreIcon}${popoverHtml}
        </span>`;
    }).join(' ');
    
    qaTextEditor.innerHTML = sentences;
}

// Popover functions
function toggleQAPopover(index) {
    // Close all other popovers and remove active class from sentences
    document.querySelectorAll('.sentence-popover').forEach(popover => {
        if (popover.getAttribute('data-popover-index') !== String(index)) {
            popover.classList.remove('active');
        }
    });
    document.querySelectorAll('.qa-sentence').forEach(sentence => {
        if (sentence.getAttribute('data-qa-index') !== String(index)) {
            sentence.classList.remove('active');
        }
    });
    
    // Toggle current popover and sentence active state
    const popover = document.querySelector(`[data-popover-index="${index}"]`);
    const sentence = document.querySelector(`.qa-sentence[data-qa-index="${index}"]`);
    
    if (popover) {
        const isActive = popover.classList.toggle('active');
        if (sentence) {
            if (isActive) {
                sentence.classList.add('active');
            } else {
                sentence.classList.remove('active');
            }
        }
    }
}

function editQAFromPopover(index) {
    // Close popover
    const popover = document.querySelector(`[data-popover-index="${index}"]`);
    if (popover) {
        popover.classList.remove('active');
    }
    
    // Call existing edit function
    editQAFromEditor(index);
    
    // Auto start recording
    setTimeout(() => {
        if (!appState.isRecording) {
            toggleRecording();
        }
    }, 500);
}

function deleteQAItem(index) {
    // Close popover
    const popover = document.querySelector(`[data-popover-index="${index}"]`);
    if (popover) {
        popover.classList.remove('active');
    }
    
    // Confirm deletion
    if (confirm('Bạn có chắc muốn xóa câu trả lời này?')) {
        // Remove from data
        const deletedQA = appState.qaData[index];
        appState.qaData.splice(index, 1);
        
        // Add chat message
        addChatMessage(`Đã xóa câu trả lời: "${deletedQA.answer}"`, 'bot');
        addChatMessage('Bạn có thể trả lời lại câu hỏi này bằng cách nhấn nút micro.', 'bot');
        
        // Refresh UI
        refreshQAList();
        checkStep1Completion();
    }
}

function getTooltipText(question, score) {
    if (score === 3) {
        return `<i class="fas fa-exclamation-triangle"></i> Cần bổ sung: ${question}`;
    } else if (score >= 4) {
        return `<i class="fas fa-times-circle"></i> Cần trả lời lại: ${question}`;
    }
    return '';
}

function getHintForQuestion(question, score) {
    const hints = {
        "Bạn muốn xây dựng loại website gì? (E-commerce, Blog, Corporate, etc.)": {
            good: "Câu trả lời rất chi tiết! Bạn đã mô tả rõ loại website, đối tượng khách hàng và phong cách thiết kế.",
            medium: "Hãy bổ sung thêm: Bạn muốn xây dựng cho ai? Mục đích chính là gì? Phong cách nào phù hợp với thương hiệu?",
            poor: "Vui lòng cung cấp chi tiết về: loại website (E-commerce/Blog/Corporate), đối tượng khách hàng, mục đích, và phong cách thiết kế mong muốn."
        },
        "Dự án cần những tính năng chính nào?": {
            good: "Tuyệt vời! Bạn đã liệt kê rõ các tính năng chính cần có.",
            medium: "Hãy bổ sung thêm: Những tính năng ưu tiên nhất? Có tính năng đặc biệt nào không? Cần quản lý gì?",
            poor: "Vui lòng nêu cụ thể các tính năng như: giỏ hàng, thanh toán, tìm kiếm, đánh giá sản phẩm, v.v."
        },
        "Bạn có yêu cầu gì về thiết kế và giao diện?": {
            good: "Rất tốt! Bạn đã mô tả rõ về phong cách, màu sắc và trải nghiệm người dùng.",
            medium: "Hãy bổ sung: Phong cách nào (hiện đại, cổ điển, tối giản)? Màu sắc chủ đạo? Cảm giác nào cho người dùng?",
            poor: "Vui lòng cho biết: Phong cách thiết kế, màu sắc chủ đạo, layout, và cảm giác mong muốn trên các thiết bị khác nhau."
        },
        "Dự án cần tích hợp với hệ thống nào không?": {
            good: "Tuyệt vời! Bạn đã nêu rõ các hệ thống cần tích hợp.",
            medium: "Hãy bổ sung: Có nền tảng thanh toán nào khác không? Cần kết nối CRM hay email marketing không?",
            poor: "Vui lòng nêu các hệ thống cần tích hợp như: thanh toán (VNPay, Momo), analytics, email marketing, CRM, v.v."
        },
        "Bạn mong muốn thời gian hoàn thành là bao lâu?": {
            good: "Rất tốt! Bạn đã đưa ra thời gian hợp lý với timeline cụ thể.",
            medium: "Hãy bổ sung: Giai đoạn nào quan trọng nhất? Có deadline cụ thể không? Có thể linh hoạt về thời gian?",
            poor: "Vui lòng cho biết: Thời gian mong muốn (vài tuần/tháng), giai đoạn quan trọng, và deadline cụ thể nếu có."
        }
    };
    
    const questionHints = hints[question];
    if (!questionHints) {
        return "Vui lòng cung cấp thêm chi tiết về câu hỏi này.";
    }
    
    if (score <= 2) {
        return questionHints.good;
    } else if (score === 3) {
        return questionHints.medium;
    } else {
        return questionHints.poor;
    }
}

function editQAFromEditor(index) {
    const qa = appState.qaData[index];
    
    // Highlight the sentence being edited
    document.querySelectorAll('.qa-sentence').forEach(s => s.classList.remove('active-editing'));
    const sentence = document.querySelector(`[data-qa-index="${index}"]`);
    if (sentence) {
        sentence.classList.add('active-editing');
    }
    
    // Add message to chat
    addChatMessage(`Bạn muốn chỉnh sửa câu: "${qa.answer}". Hãy nói lại câu trả lời mới.`, 'bot');
    addChatMessage(`📌 Câu hỏi: ${qa.question}`, 'bot');
    
    // Set editing state
    appState.editingQAIndex = index;
    
    // Scroll to chat
    const leftColumn = document.getElementById('leftColumn');
    if (leftColumn.style.display === 'none') {
        document.getElementById('floatingChatBtn').click();
    }
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
    const endChatBtn = document.getElementById('endChatBtn');
    const allQuestionsAnswered = appState.qaData.length >= mockQuestions.length;
    // Đảo ngược: điểm <= 2 là tốt (1 = Rõ ràng, 2 = Khá rõ)
    const allScoresGood = appState.qaData.every(qa => qa.score <= 2);
    
    // Always show "End Chat" button if at least one question is answered
    if (appState.qaData.length > 0) {
        endChatBtn.style.display = 'inline-flex';
        // Update button text based on pause state
        if (appState.isPaused) {
            endChatBtn.innerHTML = '<i class="fas fa-play-circle"></i> Tiếp tục trò chuyện';
        } else {
            endChatBtn.innerHTML = '<i class="fas fa-times-circle"></i> Kết thúc trò chuyện';
        }
    } else {
        endChatBtn.style.display = 'none';
    }
    
    // Show "Next" button only when all questions answered AND all scores are good
    if (allQuestionsAnswered && allScoresGood) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.disabled = false;
        
        // Show message once when all conditions are met
        if (!appState.completionMessageShown) {
            addChatMessage('✅ Tất cả câu trả lời đều rõ ràng! Bạn có thể chuyển sang bước tiếp theo.', 'bot');
            appState.completionMessageShown = true;
        }
    } else {
        nextBtn.style.display = 'none';
        
        // Show improvement message if all questions answered but scores not good
        if (allQuestionsAnswered && !allScoresGood && !appState.improvementMessageShown) {
            addChatMessage('⚠️ Một số câu trả lời chưa đủ rõ ràng. Vui lòng click vào các câu được tô màu để chỉnh sửa.', 'bot');
            appState.improvementMessageShown = true;
        }
    }
}

function openSummaryModal() {
    const modal = document.getElementById('summaryModal');
    
    // Populate summary data
    const typeAnswer = appState.qaData[0]?.answer || 'Website E-commerce';
    const featuresAnswer = appState.qaData[1]?.answer || 'Giỏ hàng, Thanh toán';
    const designAnswer = appState.qaData[2]?.answer || 'Thiết kế hiện đại, Responsive';
    const integrationAnswer = appState.qaData[3]?.answer || 'VNPay, Momo';
    const timelineAnswer = appState.qaData[4]?.answer || '6-8 tuần';
    
    // Update summary cards
    document.getElementById('modalSummaryType').textContent = typeAnswer;
    
    // Parse features list
    const featuresList = featuresAnswer.split(',').map(f => f.trim());
    const featuresHtml = featuresList.map(f => `<li>${f}</li>`).join('');
    document.getElementById('modalSummaryFeatures').innerHTML = featuresHtml;
    
    document.getElementById('modalSummaryDesign').textContent = designAnswer;
    document.getElementById('modalSummaryIntegration').textContent = integrationAnswer;
    document.getElementById('modalSummaryTimeline').textContent = timelineAnswer;
    
    // Populate Q&A list
    const qaListHtml = appState.qaData.map((qa, index) => {
        const scoreLabel = getScoreLabel(qa.score);
        const statusClass = qa.score <= 2 ? 'completed' : 'needs-improvement';
        const statusIcon = qa.score <= 2 ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        return `
            <div class="summary-qa-item ${statusClass}">
                <div class="qa-item-number">${index + 1}</div>
                <div class="qa-item-content">
                    <div class="qa-item-question">${qa.question}</div>
                    <div class="qa-item-answer">${qa.answer}</div>
                    <div class="qa-item-score">
                        <i class="fas ${statusIcon}"></i>
                        <span>${scoreLabel} (${qa.score}/5)</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('modalQAList').innerHTML = qaListHtml;
    
    modal.style.display = 'flex';
}

function closeSummaryModal() {
    document.getElementById('summaryModal').style.display = 'none';
}

// Edit QA Item
function editQAItem(index) {
    const qa = appState.qaData[index];
    
    // Set editing mode
    appState.editingIndex = index;
    appState.editingQAIndex = index;
    
    // Highlight in editor
    document.querySelectorAll('.qa-sentence').forEach(s => s.classList.remove('active-editing'));
    const sentence = document.querySelector(`[data-qa-index="${index}"]`);
    if (sentence) {
        sentence.classList.add('active-editing');
    }
    
    // Mở chat panel nếu đang đóng
    const leftColumn = document.getElementById('leftColumn');
    if (!leftColumn.classList.contains('expanded')) {
        toggleChatPanel();
    }
    
    // Hiển thị thông báo trong chat
    const botMessage = `Bạn muốn chỉnh sửa câu trả lời cho câu hỏi:\n\n"${qa.question}"\n\nCâu trả lời hiện tại: "${qa.answer}"\n\nHãy nhấn vào nút micro và nói lại câu trả lời chi tiết hơn nhé!`;
    addChatMessage(botMessage, 'bot');
    
    // Cuộn xuống cuối chat
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Highlight nút micro để người dùng chú ý
    const micBtn = document.getElementById('micBtn');
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
    
    // Update editor
    updateTextEditor();
    
    // Reset message flags when list is refreshed (after editing)
    appState.completionMessageShown = false;
    appState.improvementMessageShown = false;
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

// Step 4 Functions (Preview)
// Step 3 Helper Functions
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

// Step 4 Functions (Deploy)
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
    const steps = document.querySelectorAll('.step');
    steps.forEach((step) => {
        const stepData = step.getAttribute('data-step');
        const stepNum = parseInt(stepData);
        
        step.classList.remove('active');
        step.classList.remove('completed');
        
        if (stepNum < stepNumber) {
            step.classList.add('completed');
        }
        if (stepNum === stepNumber) {
            step.classList.add('active');
        }
    });
    
    // Update step panels
    document.querySelectorAll('.step-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    const panelId = `step${stepNumber}`;
    document.getElementById(panelId).classList.add('active');
    
    // Load step data
    switch(stepNumber) {
        case 2:
            loadStep2Data();
            break;
        case 3:
            loadStep3Progress();
            break;
    }
    
    // Scroll to top - use setTimeout to ensure DOM is updated first
    setTimeout(() => {
        const rightColumn = document.querySelector('.right-column');
        rightColumn.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 100);
}

// Utility function to simulate typing effect

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

// ============================================
// END CHAT MODAL FUNCTIONS
// ============================================

function openEndChatModal() {
    const modal = document.getElementById('endChatModal');
    const allQuestionsAnswered = appState.qaData.length >= mockQuestions.length;
    const allScoresGood = appState.qaData.every(qa => qa.score <= 2);
    
    if (allScoresGood && allQuestionsAnswered) {
        // Case 1: All information is sufficient - Show natural language summary directly
        showSufficientSummary();
        modal.style.display = 'flex';
        
        // Add animation class
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
    } else {
        // Case 2: Need more information
        showInsufficientSummary();
        modal.style.display = 'flex';
        
        // Add animation class
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
    }
}

function openSummaryModal() {
    // This function now also uses the natural language summary
    openEndChatModal();
}

function closeEndChatModal() {
    const modal = document.getElementById('endChatModal');
    modal.style.display = 'none';
    
    // Reset isPaused state when closing modal normally (not pausing)
    appState.isPaused = false;
    
    // Update button text back to normal
    const endChatBtn = document.getElementById('endChatBtn');
    endChatBtn.innerHTML = '<i class="fas fa-times-circle"></i> Kết thúc trò chuyện';
    
    // Check if all data is sufficient and mark summary as viewed
    const allQuestionsAnswered = appState.qaData.length >= mockQuestions.length;
    const allScoresGood = appState.qaData.every(qa => qa.score <= 2);
    
    if (allScoresGood && allQuestionsAnswered) {
        // Mark summary as viewed
        appState.summaryViewed = true;
        
        // Show the next button now with highlight animation
        const nextBtn = document.getElementById('nextStep1');
        nextBtn.style.display = 'inline-flex';
        nextBtn.disabled = false;
        nextBtn.classList.add('highlight');
        
        // Remove highlight class after animation
        setTimeout(() => {
            nextBtn.classList.remove('highlight');
        }, 2000);
        
        // Add a friendly message
        addChatMessage('🎉 Tuyệt vời! Bạn có thể nhấn "Bước tiếp theo" để xem báo giá chi tiết cho dự án của mình.', 'bot');
        
        // Scroll to show the button
        setTimeout(() => {
            const stepActions = document.querySelector('.step-actions');
            if (stepActions) {
                stepActions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 300);
    }
}

function saveAndEndChat() {
    // Lưu phiên làm việc
    saveSession();
    
    // Đóng modal
    const modal = document.getElementById('endChatModal');
    modal.style.display = 'none';
    
    // Hiển thị thông báo
    addChatMessage('💾 Phiên làm việc đã được lưu! Khi bạn vào lại, bấm vào nút micro để tiếp tục trò chuyện.', 'bot');
}

function pauseSession() {
    // Lưu phiên làm việc
    saveSession();
    
    // Hiển thị thông báo
    addChatMessage('⏸️ Phiên làm việc đã được tạm dừng và lưu lại. Khi bạn vào lại, bấm vào nút micro để tiếp tục trò chuyện từ chỗ bạn dừng.', 'bot');
}

function pauseAndCloseModal() {
    // Đóng modal
    const modal = document.getElementById('endChatModal');
    modal.style.display = 'none';
    
    // Đánh dấu là đang tạm dừng
    appState.isPaused = true;
    
    // Đổi text button
    const endChatBtn = document.getElementById('endChatBtn');
    endChatBtn.innerHTML = '<i class="fas fa-play-circle"></i> Tiếp tục trò chuyện';
    
    // Lưu phiên làm việc
    saveSession();
    
    // Hiển thị thông báo
    addChatMessage('⏸️ Phiên làm việc đã được tạm dừng và lưu lại. Bạn có thể quay lại bất cứ lúc nào để tiếp tục!', 'bot');
}

function showSufficientSummary() {
    document.getElementById('endChatContentSufficient').style.display = 'block';
    document.getElementById('endChatContentInsufficient').style.display = 'none';
    
    const summaryContent = document.getElementById('endChatSummaryContent');
    const naturalSummary = generateNaturalLanguageSummary();
    
    summaryContent.innerHTML = `
        <div class="natural-summary">
            <div class="summary-intro">
                <div class="intro-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="intro-text">
                    <h3>Tuyệt vời! Chúng tôi đã hiểu rõ dự án của bạn</h3>
                    <p>${naturalSummary.intro}</p>
                </div>
            </div>
            
            <div class="summary-sections">
                ${naturalSummary.sections.map(section => `
                    <div class="summary-section-item">
                        <div class="section-header">
                            <div class="section-icon">
                                <i class="${section.icon}"></i>
                            </div>
                            <h4>${section.title}</h4>
                        </div>
                        <div class="section-content">
                            <p>${section.content}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="summary-next-steps">
                <div class="next-steps-icon">
                    <i class="fas fa-rocket"></i>
                </div>
                <div class="next-steps-content">
                    <h4>Bước tiếp theo - Xem báo giá</h4>
                    <p>${naturalSummary.nextSteps}</p>
                </div>
            </div>
        </div>
    `;
}

function showInsufficientSummary() {
    document.getElementById('endChatContentSufficient').style.display = 'none';
    document.getElementById('endChatContentInsufficient').style.display = 'block';
    
    // Show what has been provided
    const providedInfo = document.getElementById('providedInfoSummary');
    const providedSummary = generateProvidedInfoSummary();
    providedInfo.innerHTML = providedSummary;
    
    // Show missing questions
    const missingList = document.getElementById('missingQuestionsList');
    const missingQuestions = getMissingOrPoorQuestions();
    
    missingList.innerHTML = missingQuestions.map((item, index) => `
        <div class="missing-question-item">
            <div class="missing-q-number">${index + 1}</div>
            <div class="missing-q-content">
                <div class="missing-q-text">
                    <i class="fas fa-question-circle"></i>
                    <strong>${item.question}</strong>
                </div>
                <div class="missing-q-hint">
                    <i class="fas fa-info-circle"></i>
                    ${item.hint}
                </div>
                ${item.currentAnswer ? `
                    <div class="missing-q-current">
                        <strong>Câu trả lời hiện tại:</strong> ${item.currentAnswer}
                        <br><strong>Vấn đề:</strong> ${item.issue}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function generateNaturalLanguageSummary() {
    const qaData = appState.qaData;
    
    // Extract information from answers
    const websiteType = qaData[0]?.answer || 'website của bạn';
    const features = qaData[1]?.answer || 'các tính năng cơ bản';
    const design = qaData[2]?.answer || 'giao diện đẹp mắt';
    const integration = qaData[3]?.answer || 'các hệ thống cần thiết';
    const timeline = qaData[4]?.answer || 'thời gian phù hợp';
    
    // Parse features to create a more natural description
    const featuresList = features.split(',').map(f => f.trim()).slice(0, 3);
    const featuresText = featuresList.length > 0 
        ? featuresList.join(', ') 
        : 'các tính năng theo yêu cầu của bạn';
    
    return {
        intro: `Sau khi trao đổi với bạn, chúng tôi hiểu rằng bạn cần một ${websiteType}. Đây là một dự án thú vị và chúng tôi hoàn toàn có thể giúp bạn biến ý tưởng thành hiện thực!`,
        sections: [
            {
                icon: 'fas fa-lightbulb',
                title: 'Mục đích của website',
                content: `Bạn muốn xây dựng ${websiteType}. Website này sẽ giúp bạn tiếp cận khách hàng, tăng doanh số và phát triển kinh doanh online một cách chuyên nghiệp.`
            },
            {
                icon: 'fas fa-tools',
                title: 'Những gì website sẽ làm được',
                content: `Website sẽ có đầy đủ các tính năng như ${featuresText}. Tất cả đều được thiết kế để người dùng dễ sử dụng, giúp bạn quản lý dễ dàng và tăng hiệu quả kinh doanh.`
            },
            {
                icon: 'fas fa-palette',
                title: 'Thiết kế và trải nghiệm',
                content: `${design}. Chúng tôi sẽ tạo ra một website vừa đẹp mắt, vừa dễ sử dụng. Website sẽ hoạt động mượt mà trên mọi thiết bị: điện thoại, máy tính bảng và laptop.`
            },
            {
                icon: 'fas fa-link',
                title: 'Kết nối với các dịch vụ khác',
                content: `Website sẽ được kết nối với ${integration}. Nhờ đó, bạn có thể quản lý mọi thứ tập trung hơn, khách hàng thanh toán dễ dàng hơn, và bạn có thể theo dõi hiệu quả kinh doanh một cách rõ ràng.`
            },
            {
                icon: 'fas fa-calendar-check',
                title: 'Thời gian và quy trình làm việc',
                content: `Dự án sẽ hoàn thành trong khoảng ${timeline}. Chúng tôi sẽ làm việc từng bước: thiết kế → phát triển → kiểm tra → bàn giao. Bạn sẽ được xem và góp ý ở mỗi bước để đảm bảo mọi thứ đúng như mong muốn.`
            }
        ],
        nextSteps: 'Ở bước tiếp theo, chúng tôi sẽ tính toán chi phí cụ thể cho dự án này. Bạn sẽ thấy chi tiết từng phần chi phí, tổng tiền cần đầu tư, và thời gian hoàn thành chính xác. Sau đó bạn có thể quyết định có tiếp tục hay không.'
    };
}

function generateProvidedInfoSummary() {
    const qaData = appState.qaData;
    
    if (qaData.length === 0) {
        return '<p class="no-info">Bạn chưa cung cấp thông tin nào. Hãy bắt đầu bằng cách nhấn nút micro và nói về dự án của bạn.</p>';
    }
    
    const goodAnswers = qaData.filter(qa => qa.score <= 2);
    
    return `
        <div class="provided-summary-text">
            <p>Bạn đã trả lời <strong>${qaData.length}</strong> trong số <strong>${mockQuestions.length}</strong> câu hỏi.</p>
            <p>Trong đó, có <strong>${goodAnswers.length}</strong> câu trả lời rõ ràng và đầy đủ thông tin.</p>
        </div>
        ${goodAnswers.length > 0 ? `
            <div class="good-answers-list">
                <h4><i class="fas fa-check-circle"></i> Những thông tin tốt bạn đã cung cấp:</h4>
                ${goodAnswers.map(qa => `
                    <div class="good-answer-item">
                        <div class="good-answer-q"><strong>Câu hỏi:</strong> ${qa.question}</div>
                        <div class="good-answer-a"><strong>Trả lời:</strong> ${qa.answer}</div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;
}

function getMissingOrPoorQuestions() {
    const result = [];
    
    // Check all questions
    for (let i = 0; i < mockQuestions.length; i++) {
        const question = mockQuestions[i];
        const qa = appState.qaData[i];
        
        if (!qa) {
            // Not answered yet
            result.push({
                question: question,
                hint: getQuestionHint(i),
                currentAnswer: null,
                issue: null
            });
        } else if (qa.score > 2) {
            // Poor answer
            result.push({
                question: question,
                hint: getQuestionHint(i),
                currentAnswer: qa.answer,
                issue: getIssueDescription(qa.score)
            });
        }
    }
    
    return result;
}

function getQuestionHint(questionIndex) {
    const hints = [
        'Ví dụ: "Tôi muốn làm website bán hàng online cho shop quần áo" hoặc "Website giới thiệu công ty xây dựng"',
        'Ví dụ: "Cần có giỏ hàng, thanh toán online, quản lý đơn hàng" hoặc "Form liên hệ, gallery ảnh dự án, trang tin tức"',
        'Ví dụ: "Thiết kế hiện đại, màu xanh lá chủ đạo, phù hợp với giới trẻ" hoặc "Giao diện chuyên nghiệp, đơn giản, dễ đọc"',
        'Ví dụ: "Kết nối với VNPay và Momo để thanh toán" hoặc "Tích hợp Facebook, Google Maps, email marketing"',
        'Ví dụ: "Cần xong trong 2 tháng" hoặc "Không gấp, khoảng 3-4 tháng là được"'
    ];
    return hints[questionIndex] || 'Hãy trả lời chi tiết nhất có thể.';
}

function getIssueDescription(score) {
    const issues = {
        3: 'Câu trả lời hơi ngắn, cần thêm chi tiết để chúng tôi hiểu rõ hơn về yêu cầu của bạn.',
        4: 'Câu trả lời chưa đủ thông tin. Vui lòng cung cấp thêm chi tiết cụ thể.',
        5: 'Câu trả lời quá chung chung. Chúng tôi cần thông tin cụ thể hơn để có thể hỗ trợ bạn tốt nhất.'
    };
    return issues[score] || 'Cần cải thiện câu trả lời.';
}

function proceedFromEndChat() {
    const modal = document.getElementById('endChatModal');
    modal.style.display = 'none';
    
    // Mark summary as viewed
    appState.summaryViewed = true;
    
    // Show the next button
    const nextBtn = document.getElementById('nextStep1');
    nextBtn.style.display = 'inline-flex';
    nextBtn.disabled = false;
    
    // Add a friendly message and go to next step
    addChatMessage('🎉 Tuyệt vời! Chuyển sang bước xem báo giá...', 'bot');
    
    // Auto navigate to step 2 after a short delay
    setTimeout(() => {
        goToStep(2);
    }, 1000);
}

