// 精确数值处理函数
function preciseRound(value, decimals = 1) {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
}

// 技能倍率表数据
const skillRatesData = [
    { name: "无", externalRate: 0, fixedExternal: 0, breakBambooRate: 0, fixedBreakBamboo: 0, externalElementRate: 0, hit: 0 },
    { name: "白刀A1", externalRate: 0.4205, fixedExternal: 117, breakBambooRate: 0.4205, fixedBreakBamboo: 64, externalElementRate: 0.4205, hit: 1 },
    { name: "白刀A2", externalRate: 0.4508, fixedExternal: 126, breakBambooRate: 0.4508, fixedBreakBamboo: 68, externalElementRate: 0.4508, hit: 2 },
    { name: "白刀A3", externalRate: 0.5772, fixedExternal: 161, breakBambooRate: 0.5772, fixedBreakBamboo: 87, externalElementRate: 0.5772, hit: 2 },
    { name: "白刀A4", externalRate: 0.5082, fixedExternal: 142, breakBambooRate: 0.5082, fixedBreakBamboo: 77, externalElementRate: 0.5082, hit: 2 },
    { name: "红刀A1", externalRate: 0.6472, fixedExternal: 180, breakBambooRate: 0.6472, fixedBreakBamboo: 98, externalElementRate: 0.6472, hit: 2 },
    { name: "红刀A2", externalRate: 0.9012, fixedExternal: 250, breakBambooRate: 0.9012, fixedBreakBamboo: 136, externalElementRate: 0.9012, hit: 2 },
    { name: "红刀A2(1/2)", externalRate: 0.4506, fixedExternal: 120, breakBambooRate: 0.4506, fixedBreakBamboo: 68, externalElementRate: 0.4506, hit: 1 },
    { name: "红刀A3", externalRate: 1.4455, fixedExternal: 401, breakBambooRate: 1.4455, fixedBreakBamboo: 218, externalElementRate: 1.4455, hit: 8 },
    { name: "红刀A4", externalRate: 1.7358, fixedExternal: 481, breakBambooRate: 1.7358, fixedBreakBamboo: 262, externalElementRate: 1.7358, hit: 7 },
    { name: "红刀A4(5/7)", externalRate: 1.215, fixedExternal: 336.7, breakBambooRate: 1.215, fixedBreakBamboo: 183.4, externalElementRate: 1.215, hit: 5 },
    { name: "红刀A5", externalRate: 2.5342, fixedExternal: 702, breakBambooRate: 2.5342, fixedBreakBamboo: 382, externalElementRate: 2.5342, hit: 5 },
    { name: "痴障", externalRate: 1.3548, fixedExternal: 376, breakBambooRate: 1.3548, fixedBreakBamboo: 205, externalElementRate: 1.3548, hit: 6 },
    { name: "十字斩", externalRate: 3.3028, fixedExternal: 914, breakBambooRate: 3.3028, fixedBreakBamboo: 498, externalElementRate: 3.3028, hit: 8 },
    { name: "横斩", externalRate: 2.6351, fixedExternal: 730, breakBambooRate: 2.6351, fixedBreakBamboo: 398, externalElementRate: 2.6351, hit: 7 },
    { name: "牵绳引刃", externalRate: 0.0621, fixedExternal: 17, breakBambooRate: 0.0621, fixedBreakBamboo: 9, externalElementRate: 0.0621, hit: 1 },
    { name: "鼠鼠生威", externalRate: 0.3490, fixedExternal: 0, breakBambooRate: 0.3490, fixedBreakBamboo: 0, externalElementRate: 0.3490, hit: 1 },
    { name: "骑龙回马一段", externalRate: 3.1951, fixedExternal: 432, breakBambooRate: 3.1951, fixedBreakBamboo: 0, externalElementRate: 3.1951, hit: 1 },
    { name: "骑龙回马二段", externalRate: 3.9051, fixedExternal: 528, breakBambooRate: 3.9051, fixedBreakBamboo: 0, externalElementRate: 3.9051, hit: 1 },
    { name: "箫声千浪炸", externalRate: 3.897, fixedExternal: 800, breakBambooRate: 3.897, fixedBreakBamboo: 0, externalElementRate: 3.897, hit: 1 },
    { name: "箫声千浪(炸前)", externalRate: 1.4614, fixedExternal: 300, breakBambooRate: 1.4614, fixedBreakBamboo: 0, externalElementRate: 1.4614, hit: 1 },
    { name: "箫声千浪(炸后)", externalRate: 1.3128, fixedExternal: 0, breakBambooRate: 1.3128, fixedBreakBamboo: 0, externalElementRate: 1.3128, hit: 1 },
    { name: "清风霁月", externalRate: 0.8718, fixedExternal: 425, breakBambooRate: 0.8718, fixedBreakBamboo: 0, externalElementRate: 0.8718, hit: 1 },
    { name: "极乐泣血", externalRate: 2, fixedExternal: 0, breakBambooRate: 0, fixedBreakBamboo: 0, externalElementRate: 0, hit: 0 },
    { name: "易水歌", externalRate: 1, fixedExternal: 0, breakBambooRate: 0.6667, fixedBreakBamboo: 0, externalElementRate: 1, hit: 1 },
    { name: "天工火Dot", externalRate: 0.26, fixedExternal: 3, breakBambooRate: 0, fixedBreakBamboo: 0, externalElementRate: 0, hit: 0 },
    { name: "天工毒Dot", externalRate: 0.16, fixedExternal: 3, breakBambooRate: 0, fixedBreakBamboo: 0, externalElementRate: 0, hit: 0 },
    { name: "极乐Dot", externalRate: 0.0205, fixedExternal: 0, breakBambooRate: 0, fixedBreakBamboo: 0, externalElementRate: 0, hit: 0 },
    { name: "年年Dot", externalRate: 0.0205, fixedExternal: 0, breakBambooRate: 0, fixedBreakBamboo: 0, externalElementRate: 0, hit: 0 },
    { name: "火·厚积薄发", externalRate: 0.409, fixedExternal: 0, breakBambooRate: 0, fixedBreakBamboo: 0, externalElementRate: 0, hit: 0 }
];

// 增伤BUFF表数据
const buffData = [
    { name: "无", generalBonus: 0, criticalBonus: 0, externalPenetration: 0, extraCriticalRate: 0 },
    { name: "轮回", generalBonus: 10, criticalBonus: 0, externalPenetration: 0, extraCriticalRate: 0 },
    { name: "崩解", generalBonus: 0, criticalBonus: 25, externalPenetration: 25, extraCriticalRate: 0 },
    { name: "阴阳", generalBonus: 15, criticalBonus: 0, externalPenetration: 0, extraCriticalRate: 0 },
    { name: "笛子", generalBonus: 2, criticalBonus: 0, externalPenetration: 0, extraCriticalRate: 0 },
    { name: "轮回崩解", generalBonus: 10, criticalBonus: 25, externalPenetration: 25, extraCriticalRate: 0 },
    { name: "轮回阴阳", generalBonus: 25, criticalBonus: 0, externalPenetration: 0, extraCriticalRate: 0 },
    { name: "轮回笛子", generalBonus: 12, criticalBonus: 0, externalPenetration: 0, extraCriticalRate: 0 },
    { name: "崩解阴阳", generalBonus: 15, criticalBonus: 25, externalPenetration: 25, extraCriticalRate: 0 },
    { name: "崩解笛子", generalBonus: 2, criticalBonus: 25, externalPenetration: 25, extraCriticalRate: 0 },
    { name: "阴阳笛子", generalBonus: 17, criticalBonus: 0, externalPenetration: 0, extraCriticalRate: 0 },
    { name: "轮回崩解阴阳", generalBonus: 25, criticalBonus: 25, externalPenetration: 25, extraCriticalRate: 0 },
    { name: "轮回崩解笛子", generalBonus: 12, criticalBonus: 25, externalPenetration: 25, extraCriticalRate: 0 },
    { name: "轮回阴阳笛子", generalBonus: 27, criticalBonus: 0, externalPenetration: 0, extraCriticalRate: 0 },
    { name: "崩解阴阳笛子", generalBonus: 17, criticalBonus: 25, externalPenetration: 25, extraCriticalRate: 0 },
    { name: "轮回崩解阴阳笛子", generalBonus: 27, criticalBonus: 25, externalPenetration: 25, extraCriticalRate: 0 },
    { name: "嗔焰轮回", generalBonus: 10, criticalBonus: 50, externalPenetration: 0, extraCriticalRate: 10 },
    { name: "嗔焰轮回崩解", generalBonus: 10, criticalBonus: 75, externalPenetration: 25, extraCriticalRate: 10 },
    { name: "嗔焰轮回阴阳", generalBonus: 25, criticalBonus: 50, externalPenetration: 0, extraCriticalRate: 10 },
    { name: "嗔焰轮回笛子", generalBonus: 12, criticalBonus: 50, externalPenetration: 0, extraCriticalRate: 10 },
    { name: "嗔焰轮回崩解阴阳", generalBonus: 25, criticalBonus: 75, externalPenetration: 25, extraCriticalRate: 10 },
    { name: "嗔焰轮回崩解笛子", generalBonus: 12, criticalBonus: 75, externalPenetration: 25, extraCriticalRate: 10 },
    { name: "嗔焰轮回阴阳笛子", generalBonus: 27, criticalBonus: 50, externalPenetration: 0, extraCriticalRate: 10 },
    { name: "嗔焰轮回崩解阴阳笛子", generalBonus: 27, criticalBonus: 75, externalPenetration: 25, extraCriticalRate: 10 }
];

// 存储选中的增伤BUFF

// 存储面板数据
let panelData = {
    externalAttack: { min: 1299, max: 3690 },
    breakBambooAttack: { min: 365, max: 655 },
    ringMetalAttack: { min: 0, max: 0 },
    breakRockAttack: { min: 0, max: 0 },  // 修正：若最小值大于最大值，则将最大值调整为与最小值相等
    pullSilkAttack: { min: 0, max: 0 },  // 修正：若最小值大于最大值，则将最大值调整为与最小值相等
    precisionRate: 98.8,
    criticalRate: 70.9,
    intentRate: 15.8,
    directCriticalRate: 4.6,
    directIntentRate: 0.0,
    criticalDamageBonus: 57.9,
    intentDamageBonus: 35.0,
    externalDamageBonus: 0.0,
    elementalDamageBonus: 9,
    externalPenetration: 44,
    elementalPenetration: 28,
    // 装备增伤
    ropeDartBonus: 6.4,
    dualBladesBonus: 0.0,
    allMartialBonus: 6.4,
    bossUnitBonus: 6.4,
    lightStrikeBonus: 0.0,
    mouseBonus: 24.0,
    // 其他增伤
    equipmentSet: '飞隼',
    foodBuff: '涮鱼',
    talisman: '会心帖',
    craftingBonus: '天工火',
    bossTalentBonus: 0.0,
    // Boss防御
    bossDefense: 350
};

// 存储排轴数据
let rotationData = [];

// 存储原始排轴数据（用于模拟计算）
let originalRotationData = [];

// 全局变量T，用于DPS计算
let T = 60;

// 当前选择的伤害模式
let currentDamageMode = 'none';

// 存储原始概率数据（用于恢复）
let originalProbabilities = {
    effectiveCriticalRate: 0,
    effectiveIntentRate: 0,
    whiteTextRate: 0,
    grazeRate: 0
};

// 模拟计算状态
let isSimulationMode = false;

// 全局模拟概率变量
let globalSimulationProbabilities = null;

// 存储期望伤害总和
let expectedDamageTotal = 0;

// Dot技能列表（特殊处理的技能）
const dotSkills = ["天工火Dot", "天工毒Dot", "火·厚积薄发"];


// 页面通知功能
function showNotification(message, type = 'success') {
    const notification = document.getElementById('page-notification');
    const messageElement = notification.querySelector('.notification-message');
    const iconElement = notification.querySelector('.notification-icon');
    
    messageElement.textContent = message;
    
    // 根据类型设置图标和颜色
    if (type === 'success') {
        iconElement.textContent = '✓';
        notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else if (type === 'error') {
        iconElement.textContent = '✗';
        notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    } else if (type === 'warning') {
        iconElement.textContent = '⚠';
        notification.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    }
    
    notification.style.display = 'block';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// 保存按钮成功效果
function showSaveButtonSuccess(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.add('save-button-success');
        
        // 2秒后移除成功效果
        setTimeout(() => {
            button.classList.remove('save-button-success');
        }, 2000);
    }
}

// 页面内确认对话框
function showConfirmDialog(message, title = '确认操作') {
    return new Promise((resolve) => {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        `;
        
        // 创建对话框
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            text-align: center;
            border: 1px solid #e5e7eb;
            animation: dialogSlideIn 0.3s ease-out;
        `;
        
        dialog.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 12px;">${title}</div>
                <div style="font-size: 14px; color: #6b7280; line-height: 1.5;">${message}</div>
            </div>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="confirm-cancel" style="
                    padding: 8px 20px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    background: white;
                    color: #374151;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                ">取消</button>
                <button id="confirm-ok" style="
                    padding: 8px 20px;
                    border: none;
                    border-radius: 6px;
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                ">确定</button>
            </div>
        `;
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes dialogSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // 绑定事件
        document.getElementById('confirm-cancel').addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.head.removeChild(style);
            resolve(false);
        });
        
        document.getElementById('confirm-ok').addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.head.removeChild(style);
            resolve(true);
        });
        
        // 点击遮罩层关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                document.head.removeChild(style);
                resolve(false);
            }
        });
    });
}

// 页面加载完成后执行

document.addEventListener('DOMContentLoaded', function() {
    // 初始化标签页切换
    initTabs();
    
    // 初始化排轴表格
    initRotationTable();
    
    // 初始化联动模式开关
    initCascadeModeToggle();
    
    // 初始化保存按钮
    initSaveButton();
    
    // 初始化键盘快捷键支持
    initKeyboardShortcuts();
    
    // 初始化清空排轴按钮
    initClearRotationButton();
    
    // 初始化保存排轴按钮
    initSaveRotationButton();

    // 初始化导入排轴按钮
    initImportRotationButton();
    
    // 初始化模拟计算按钮
    initSimulationButton();
    
    // 初始化排轴配置管理功能
    initRotationConfigManagement();
    
    // 初始化添加行按钮
    initAddRowButton();
    
    // 图表将在首次切换到伤害统计页面时初始化
    
    
    // 初始化技能倍率表
    initSkillRatesTable();
    
    // 初始化BUFF增伤表
    initBuffDataTable();
    
    // 初始化DIY界面功能
    initDiyInterface();
    
    
    // 加载已保存的配置列表
    loadSavedConfigs();
    
    // 初始化实时图表更新功能
    initRealTimeChartUpdates();
    
    // 初始化伤害统计表格
    initDamageStatsTable();
    
    // 初始化伤害模式选择下拉框
    initDamageModeSelect();
    
    // 加载基础信息默认值
    loadPanelDataDefaults();
});

// 初始化标签页切换
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // 移除所有标签页按钮的active类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加当前标签页按钮的active类
            button.classList.add('active');
            
            // 隐藏所有标签页内容
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 显示当前标签页内容
            document.getElementById(tabId).classList.add('active');
            
            // 如果切换到伤害统计页面，延迟初始化图表
            if (tabId === 'damage-stats') {
                setTimeout(() => {
                    initChartsIfNeeded();
                }, 100);
            }
        });
    });
    
    // 添加套装选择下拉框事件监听（现在只更新基础信息面板，不影响表头）
    const equipmentSetSelect = document.getElementById('equipment-set');
    if (equipmentSetSelect) {
        equipmentSetSelect.addEventListener('change', (e) => {
            const selectedSet = e.target.value;
            
            // 更新panelData中的套装值
            panelData.equipmentSet = selectedSet;
            
            // 同步更新套装表头选择
            const setLayerHeaderSelect = document.getElementById('set-layer-header-select');
            if (setLayerHeaderSelect) {
                setLayerHeaderSelect.value = selectedSet;
            }
            
            console.log(`基础信息面板套装选择：${selectedSet}，已同步到表头`);
        });
    }
}



// 检查联动模式是否启用
function isCascadeModeEnabled() {
    const toggle = document.getElementById('cascade-mode-toggle');
    return toggle ? toggle.checked : true; // 默认启用联动模式
}

// 初始化联动模式开关
function initCascadeModeToggle() {
    try {
        const toggle = document.getElementById('cascade-mode-toggle');
        if (!toggle) {
            console.error('找不到联动模式开关元素！');
            return;
        }
        
        // 从本地存储加载联动模式设置
        const savedCascadeMode = localStorage.getItem('cascadeModeEnabled');
        if (savedCascadeMode !== null) {
            toggle.checked = savedCascadeMode === 'true';
        } else {
            // 默认启用联动模式
            toggle.checked = true;
        }
        
        // 添加联动模式开关事件监听
        toggle.addEventListener('change', function() {
            const isEnabled = this.checked;
            localStorage.setItem('cascadeModeEnabled', isEnabled.toString());
            console.log(`联动模式已${isEnabled ? '启用' : '禁用'}`);
        });
        
        console.log('联动模式开关初始化完成');
    } catch (error) {
        console.error('初始化联动模式开关时发生错误:', error);
    }
}

// 初始化排轴表格
function initRotationTable() {
    const tableBody = document.querySelector('#rotation-table tbody');
    
    // 清空表格内容
    tableBody.innerHTML = '';
    
    // 遍历排轴数据，添加到表格中
    updateRotationTable();
}

// 根据套装类型生成对应的选项
function getSetOptions(equipmentSet, selectedValue) {
    if (!equipmentSet || equipmentSet === '无') {
        return '<option value="无" selected>无</option>';
    }
    
    let options = '';
    
    switch(equipmentSet) {
        case '飞隼':
            const feisuiOptions = ['0层', '1层', '2层', '3层', '4层', '满层'];
            feisuiOptions.forEach(option => {
                options += `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${option}</option>`;
            });
            break;
            
        case '燕归':
            const yanguiOptions = ['无', '10%外功增伤', '12.5%外功增伤'];
            yanguiOptions.forEach(option => {
                options += `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${option}</option>`;
            });
            break;
            
        case '时雨':
            const shiyuOptions = ['10%会心增伤', '25%会心增伤'];
            shiyuOptions.forEach(option => {
                options += `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${option}</option>`;
            });
            break;
            
        case '浣花':
            const huanhuaOptions = ['15会心增伤（5%）', '无'];
            huanhuaOptions.forEach(option => {
                options += `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${option}</option>`;
            });
            break;
            
        case '岳山':
            const yueshanOptions = ['5%通用增伤', '6%通用增伤', '7%通用增伤', '8%通用增伤', '9%通用增伤', '10%通用增伤', '无'];
            yueshanOptions.forEach(option => {
                options += `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${option}</option>`;
            });
            break;
            
        case '新燕归':
            const newYanguiOptions = ['无', '12%通用增伤', '12%通用+10%破竹增伤'];
            newYanguiOptions.forEach(option => {
                options += `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${option}</option>`;
            });
            break;
            
        default:
            options += `<option value="无" ${selectedValue === '无' ? 'selected' : ''}>无</option>`;
    }
    
    return options;
}

// 根据符帖类型生成对应的选项
function getTalismanOptions(selectedValue) {
    const talismanOptions = ['无帖', '会心帖', '会意帖', '奇术帖', '承欢帖', '真气会心帖', '真气会意帖', '真气属攻帖'];
    let options = '';
    
    talismanOptions.forEach(option => {
        options += `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${option}</option>`;
    });
    
    return options;
}


// 全局变量：极乐泣血计算模式
let jileCalculationMode = 'auto'; // 'auto' 或 'manual'

// 计算极乐泣血的次数和层数
function calculateJileQixueTimes(rotationData) {
    const jileIndices = [];
    const hitSums = [];
    
    // 找到所有极乐泣血的位置
    rotationData.forEach((skill, index) => {
        if (skill.name === "极乐泣血") {
            jileIndices.push(index);
        }
    });
    
    // 如果没有极乐泣血，直接返回
    if (jileIndices.length === 0) {
        return rotationData;
    }
    
    // 如果是手动模式，不自动计算，直接返回
    if (jileCalculationMode === 'manual') {
        return rotationData;
    }
    
    // 计算每个极乐泣血之间的hit数总和
    for (let i = 0; i < jileIndices.length; i++) {
        const startIndex = i === 0 ? 0 : jileIndices[i - 1] + 1;
        const endIndex = jileIndices[i];
        
        let hitSum = 0;
        for (let j = startIndex; j < endIndex; j++) {
            const skill = skillRatesData.find(s => s.name === rotationData[j].name);
            if (skill) {
                hitSum += skill.hit * (rotationData[j].times || 1);
            }
        }
        hitSums.push(hitSum);
    }
    
    // 为每个极乐泣血计算层数和次数
    jileIndices.forEach((jileIndex, i) => {
        const hitSum = hitSums[i];
        
        let finalTimes, remainingLayers, expectedLayers;
        
        // 统一使用期望值计算（模拟模式和正常模式都使用相同的计算方式）
        expectedLayers = hitSum * 0.15;
        const fullStacks = Math.floor(expectedLayers / 3.5);
        remainingLayers = expectedLayers % 3.5;
        finalTimes = 0 + fullStacks + remainingLayers / 3.5;
        
        // 更新排轴数据
        rotationData[jileIndex] = {
            ...rotationData[jileIndex],
            times: finalTimes,
            jileLayers: remainingLayers,
            jileHitSum: hitSum,
            jileExpectedLayers: expectedLayers
        };
    });
    
    return rotationData;
}

// 更新排轴表格（优化版本）
function updateRotationTable() {
    console.log('开始更新排轴表格, 当前数据长度:', rotationData.length);
    
    // 确保使用当前页面的面板数据进行伤害计算
    updatePanelDataFromInputs();
    
    // 计算极乐泣血的次数（模拟模式下跳过，因为已经分离处理）
    if (!isSimulationMode) {
        rotationData = calculateJileQixueTimes(rotationData);
    }
    
    const tableBody = document.querySelector('#rotation-table tbody');
    
    if (!tableBody) {
        console.error('找不到表格体元素');
        return;
    }
    
    // 使用DocumentFragment优化DOM操作
    const fragment = document.createDocumentFragment();
    
    // 清空表格内容
    tableBody.innerHTML = '';
    
    // 同步套装表头选择到当前panelData.equipmentSet
    const setLayerHeaderSelect = document.getElementById('set-layer-header-select');
    if (setLayerHeaderSelect && panelData.equipmentSet) {
        setLayerHeaderSelect.value = panelData.equipmentSet;
    }
    
    // 遍历排轴数据，添加到表格中
    rotationData.forEach((skill, index) => {
        const row = document.createElement('tr');
        
        // 创建技能选择下拉框
        let skillOptions = '<option value="">-- 请选择技能 --</option>';
        skillRatesData.forEach(skillData => {
            const selected = skillData.name === skill.name ? 'selected' : '';
            skillOptions += `<option value="${skillData.name}" ${selected}>${skillData.name}</option>`;
        });
        
        // 创建BUFF选择下拉框
        let buffOptions = '<option value="">-- 请选择BUFF --</option>';
        buffData.forEach(buffData => {
            const selected = buffData.name === (skill.buffName || '无') ? 'selected' : '';
            buffOptions += `<option value="${buffData.name}" ${selected}>${buffData.name}</option>`;
        });
        
        // 计算伤害数据
        let damageData = {
            totalDamage: '待定',
            externalCriticalDamage: '待定',
            externalIntentDamage: '待定',
            externalWhiteTextDamage: '待定',
            externalGrazeDamage: '待定',
            breakBambooCriticalDamage: '待定',
            breakBambooIntentDamage: '待定',
            breakBambooWhiteTextDamage: '待定',
            breakBambooGrazeDamage: '待定',
            externalElementCriticalDamage: '待定',
            externalElementIntentDamage: '待定',
            externalElementWhiteTextDamage: '待定',
            externalElementGrazeDamage: '待定'
        };
        
        // 如果有技能数据，计算伤害
        if (skill.name && skill.name !== '无') {
            // 使用选中的BUFF增伤表数据
            let generalBonus = skill.buffName && skill.buffName !== '无' ? skill.generalBonus : 0;
            let criticalBonus = skill.buffName && skill.buffName !== '无' ? skill.criticalBonus : 0;
            const externalPenetration = skill.buffName && skill.buffName !== '无' ? skill.externalPenetration : 0;
            const extraCriticalRate = skill.buffName && skill.buffName !== '无' ? skill.extraCriticalRate : 0;
            let talismanIntentBonus = 0; // 用于存储会意帖的增伤
            let talismanElementalDamageBonus = 0; // 用于存储真气属攻帖的属攻伤害加成
            
            // 绳镖武学增伤：仅对"鼠鼠生威"和"牵绳引刃"两个技能生效
            if (skill.name === "鼠鼠生威" || skill.name === "牵绳引刃") {
                generalBonus += panelData.ropeDartBonus;
            }
            
            // 鼠鼠生威技能额外80%通用增伤
            if (skill.name === "鼠鼠生威") {
                generalBonus += 80;
            }
            
            // 双刀武学增伤：适用于白刀技能A1至A4、红刀技能A1至A5以及痴障技能
            const dualBladesSkills = ["白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5", "痴障"];
            if (dualBladesSkills.includes(skill.name)) {
                generalBonus += panelData.dualBladesBonus;
            }
            
            // 全武学增伤：适用于绳镖武学和双刀武学增伤的所有技能
            const allMartialSkills = ["鼠鼠生威", "牵绳引刃", "白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5", "痴障"];
            if (allMartialSkills.includes(skill.name)) {
                generalBonus += panelData.allMartialBonus;
            }
            
            // 首领单位增伤：适用于技能表中所有技能
            if (skill.name && skill.name !== '无') {
                generalBonus += panelData.bossUnitBonus;
            }
            
            // 符帖增伤：当前设置为不参与伤害计算
            // 以下代码已注释掉，使符帖选择不影响伤害计算
            /*
            if (panelData.talisman === '会心帖') {
                // 会心帖：10%会心增伤
                criticalBonus += 10;
            } else if (panelData.talisman === '会意帖') {
                // 会意帖：10%会意增伤
                talismanIntentBonus = 10;
            } else if (panelData.talisman === '承欢帖') {
                // 承欢帖：20%通用增伤
                generalBonus += 20;
            } else if (panelData.talisman === '奇术帖') {
                // 奇术帖：15%通用增伤
                generalBonus += 15;
            }
            */
            
            // 技能级别符帖增伤（基于单个技能设置）
            if (skill.talismanLayer && skill.talismanLayer !== '无帖') {
                switch(skill.talismanLayer) {
                    case '会心帖':
                        criticalBonus += 10; // 10%会心增伤
                        break;
                    case '会意帖':
                        talismanIntentBonus += 10; // 10%会意增伤
                        break;
                    case '奇术帖':
                        generalBonus += 15; // 15%通用增伤
                        break;
                    case '承欢帖':
                        generalBonus += 20; // 20%通用增伤
                        break;
                    case '真气会心帖':
                        criticalBonus += 10; // 10%会心增伤
                        break;
                    case '真气会意帖':
                        talismanIntentBonus += 10; // 10%会意增伤
                        break;
                    case '真气属攻帖':
                        talismanElementalDamageBonus += 15; // 15%属攻伤害加成，仅对破竹伤害生效
                        break;
                    default:
                        break;
                }
            }
            
            // 天工增伤
            if (panelData.craftingBonus === '天工火') {
                // 天工火：1.5%通用增伤
                generalBonus += 1.5;
            } else if (panelData.craftingBonus === '天工毒') {
                // 天工毒：1%通用增伤
                generalBonus += 1;
            }
            
            // Boss天赋增伤
            generalBonus += panelData.bossTalentBonus;
            
            // 鼠鼠定音增伤：仅适用于鼠鼠生威技能，独立计算
            // 鼠鼠生威技能有额外独立的1.3倍全部伤害（1.24倍外功伤害已归类为额外外功伤害加成）
            const mouseGeneralBonus = skill.name === "鼠鼠生威" ? (1 + panelData.mouseBonus / 100) * 1.3 : 1;
            
            // 强效轻击增伤：仅适用于红刀A1-A5技能，独立计算
            const redBladeSkills = ["红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5"];
            const lightStrikeBonus = redBladeSkills.includes(skill.name) ? (1 + panelData.lightStrikeBonus / 100) : 1;
            
            // 红刀A1-A5属攻穿透+10：仅适用于红刀A1-A5技能
            const redBladeElementalPenetration = redBladeSkills.includes(skill.name) ? 10 : 0;
            
            // 获取面板数据
            const precisionRate = panelData.precisionRate / 100; // 精准率（转换为小数）
            // 面板会心率=会心率+额外会心率（不超过80%）+直接会心率（可超出80%）（转换为小数）
            const baseCriticalRate = Math.min((panelData.criticalRate + extraCriticalRate) / 100, 0.8);
            const directCriticalRate = panelData.directCriticalRate / 100;
            const criticalRate = baseCriticalRate + directCriticalRate;   
            const intentRate = panelData.intentRate / 100;     // 会意率（转换为小数）
            
            // 计算生效会心率、生效会意率、擦伤率和白字率
            let effectiveCriticalRate, effectiveIntentRate, grazeRate, whiteTextRate;
            
            // 检查是否为Dot技能（在任何模式下都只产生白字伤害）
            if (dotSkills.includes(skill.name)) {
                // Dot技能只产生白字伤害
                effectiveCriticalRate = 0;
                effectiveIntentRate = 0;
                grazeRate = 0;
                whiteTextRate = 1;
            } else if (isSimulationMode) {
                // 模拟模式下为每行独立计算随机概率
                const rowProbabilities = calculateRandomProbabilityForRow(skill);
                effectiveCriticalRate = rowProbabilities.effectiveCriticalRate;
                effectiveIntentRate = rowProbabilities.effectiveIntentRate;
                grazeRate = rowProbabilities.grazeRate;
                whiteTextRate = rowProbabilities.whiteTextRate;
            } else {
                // 正常计算概率
                if (criticalRate + intentRate < 1) {
                    // 会心 + 会意 < 100% 时
                    if (precisionRate >= 1) {
                        // 精准率 = 100%
                        effectiveCriticalRate = criticalRate;
                        effectiveIntentRate = intentRate;
                        grazeRate = 0;
                    } else {
                        // 精准率 < 100%
                        effectiveCriticalRate = precisionRate * criticalRate;
                        effectiveIntentRate = intentRate;
                        grazeRate = (1 - precisionRate) * (1 - intentRate);
                    }
                } else {
                    // 会心 + 会意 ≥ 100% 时
                    if (precisionRate >= 1) {
                        // 精准率 = 100%
                        effectiveCriticalRate = 1 - intentRate;
                        effectiveIntentRate = intentRate;
                        grazeRate = 0;
                    } else {
                        // 精准率 < 100%
                        effectiveCriticalRate = precisionRate * (1 - intentRate);
                        effectiveIntentRate = intentRate;
                        grazeRate = (1 - precisionRate) * (1 - intentRate);
                    }
                }
                
                // 计算白字率（既不触发会心/会意，也不触发擦伤的概率）
                whiteTextRate = 1 - effectiveCriticalRate - effectiveIntentRate - grazeRate;
            }
            
            // 计算飞隼套装对外功攻击的加成
            let feisuiBonus = 0;
            // 使用原始外功攻击值计算飞隼套装加成（如果存在）
            const baseExternalAttack = panelData.originalExternalAttack || panelData.externalAttack;
            
            if (panelData.equipmentSet === '飞隼' && skill.setLayer && skill.setLayer !== '无') {
                switch(skill.setLayer) {
                    case '1层':
                        feisuiBonus = 0.02; // 2%
                        break;
                    case '2层':
                        feisuiBonus = 0.04; // 4%
                        break;
                    case '3层':
                        feisuiBonus = 0.06; // 6%
                        break;
                    case '4层':
                        feisuiBonus = 0.08; // 8%
                        break;
                    case '满层':
                        feisuiBonus = 0.10; // 10%
                        break;
                    default:
                        feisuiBonus = 0;
                }
            }
            
            // 计算额外外功伤害加成（包括燕归套和鼠鼠生威）
            let extraExternalDamageBonus = 0;
            
            // 燕归套的外功增伤归类为额外外功伤害加成
            const yanguiSkills = ["白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5", "鼠鼠生威"];
            if (panelData.equipmentSet === '燕归' && skill.setLayer && skill.setLayer !== '无' && yanguiSkills.includes(skill.name)) {
                switch(skill.setLayer) {
                    case '10%外功增伤':
                        extraExternalDamageBonus += 10; // 10%额外外功伤害加成
                        break;
                    case '12.5%外功增伤':
                        extraExternalDamageBonus += 12.5; // 12.5%额外外功伤害加成
                        break;
                    default:
                        break;
                }
            }
            
            // 鼠鼠生威的1.24倍增伤归类为额外外功伤害加成（24%）
            if (skill.name === "鼠鼠生威") {
                extraExternalDamageBonus += 24; // 1.24倍 = 24%额外外功伤害加成
            }
            

            

            
            // 计算时雨套的会心增伤
            // 时雨套对所有技能生效
            if (panelData.equipmentSet === '时雨' && skill.setLayer && skill.setLayer !== '无') {
                switch(skill.setLayer) {
                    case '10%会心增伤':
                        criticalBonus += 10; // 10%
                        break;
                    case '25%会心增伤':
                        criticalBonus += 25; // 25%
                        break;
                    default:
                        break;
                }
            }
            
            // 计算岳山套的通用增伤
            // 岳山套对所有技能生效
            if (panelData.equipmentSet === '岳山' && skill.setLayer && skill.setLayer !== '无') {
                switch(skill.setLayer) {
                    case '10%通用增伤':
                        generalBonus += 10; // 10%
                        break;
                    case '9%通用增伤':
                        generalBonus += 9; // 9%
                        break;
                    case '8%通用增伤':
                        generalBonus += 8; // 8%
                        break;
                    case '7%通用增伤':
                        generalBonus += 7; // 7%
                        break;
                    case '6%通用增伤':
                        generalBonus += 6; // 6%
                        break;
                    case '5%通用增伤':
                        generalBonus += 5; // 5%
                        break;
                    default:
                        break;
                }
            }
            
            // 计算新燕归套的增伤效果
            // 新燕归套对特定技能生效（与燕归套相同的技能范围）
            if (panelData.equipmentSet === '新燕归' && skill.setLayer && skill.setLayer !== '无' && yanguiSkills.includes(skill.name)) {
                switch(skill.setLayer) {
                    case '12%通用增伤':
                        generalBonus += 12; // 12%通用增伤
                        break;
                    case '12%通用+10%破竹增伤':
                        generalBonus += 12; // 12%通用增伤
                        // 破竹增伤效果将在破竹伤害计算中单独处理
                        break;
                    default:
                        break;
                }
            }
            
            // 应用飞隼套装加成后的外功攻击值
            const externalAttackWithFeisui = {
                min: baseExternalAttack.min * (1 + feisuiBonus),
                max: baseExternalAttack.max * (1 + feisuiBonus)
            };
            
            // 如果有山参肉丸子效果，需要将其加成应用到飞隼套装加成后的值上
            if (panelData.foodBuff === '涮鱼') {
                externalAttackWithFeisui.min += 120;
                externalAttackWithFeisui.max += 240;
            }
            
            // 计算外功攻击值（模拟模式下使用随机值，Dot技能除外）
            let avgExternalAttack;
            if (isSimulationMode && !dotSkills.includes(skill.name)) {
                // 在最小值到最大值之间随机选取一个整数
                avgExternalAttack = Math.floor(Math.random() * (externalAttackWithFeisui.max - externalAttackWithFeisui.min + 1)) + externalAttackWithFeisui.min;
            } else {
                // 正常模式或Dot技能使用平均值
                avgExternalAttack = (externalAttackWithFeisui.min + externalAttackWithFeisui.max) / 2;
            }
            
            // 计算破竹攻击值（模拟模式下使用随机值，Dot技能除外）
            let avgBreakBambooAttack;
            if (isSimulationMode && !dotSkills.includes(skill.name)) {
                avgBreakBambooAttack = Math.floor(Math.random() * (panelData.breakBambooAttack.max - panelData.breakBambooAttack.min + 1)) + panelData.breakBambooAttack.min;
            } else {
                avgBreakBambooAttack = (panelData.breakBambooAttack.min + panelData.breakBambooAttack.max) / 2;
            }
            
            // 处理最小值大于最大值的情况
            if (panelData.ringMetalAttack.min > panelData.ringMetalAttack.max) {
                panelData.ringMetalAttack.max = panelData.ringMetalAttack.min;
            }
            if (panelData.breakRockAttack.min > panelData.breakRockAttack.max) {
                panelData.breakRockAttack.max = panelData.breakRockAttack.min;
            }
            if (panelData.pullSilkAttack.min > panelData.pullSilkAttack.max) {
                panelData.pullSilkAttack.max = panelData.pullSilkAttack.min;
            }
            
            // 计算各类型攻击平均值
            // 计算各类攻击值（模拟模式下使用随机值，Dot技能除外）
            let avgRingMetalAttack, avgBreakRockAttack, avgPullSilkAttack;
            if (isSimulationMode && !dotSkills.includes(skill.name)) {
                avgRingMetalAttack = Math.floor(Math.random() * (panelData.ringMetalAttack.max - panelData.ringMetalAttack.min + 1)) + panelData.ringMetalAttack.min;
                avgBreakRockAttack = Math.floor(Math.random() * (panelData.breakRockAttack.max - panelData.breakRockAttack.min + 1)) + panelData.breakRockAttack.min;
                avgPullSilkAttack = Math.floor(Math.random() * (panelData.pullSilkAttack.max - panelData.pullSilkAttack.min + 1)) + panelData.pullSilkAttack.min;
            } else {
                avgRingMetalAttack = (panelData.ringMetalAttack.min + panelData.ringMetalAttack.max) / 2;
                avgBreakRockAttack = (panelData.breakRockAttack.min + panelData.breakRockAttack.max) / 2;
                avgPullSilkAttack = (panelData.pullSilkAttack.min + panelData.pullSilkAttack.max) / 2;
            }
            
            // 计算易水歌增伤
            let yishuiGeneralBonus = 0;
            let yishuiExternalPenetration = 0;
            if (skill.yishuiLayer && skill.yishuiLayer !== '0层') {
                switch(skill.yishuiLayer) {
                    case '1层':
                        yishuiGeneralBonus = 1; // 1%通用增伤
                        yishuiExternalPenetration = 2; // 2点外功穿透
                        break;
                    case '2层':
                        yishuiGeneralBonus = 2; // 2%通用增伤
                        yishuiExternalPenetration = 4; // 4点外功穿透
                        break;
                    case '3层':
                        yishuiGeneralBonus = 3; // 3%通用增伤
                        yishuiExternalPenetration = 6; // 6点外功穿透
                        break;
                    case '4层':
                        yishuiGeneralBonus = 4; // 4%通用增伤
                        yishuiExternalPenetration = 8; // 8点外功穿透
                        break;
                    case '满层':
                        yishuiGeneralBonus = 5; // 5%通用增伤
                        yishuiExternalPenetration = 10; // 10点外功穿透
                        break;
                    default:
                        yishuiGeneralBonus = 0;
                        yishuiExternalPenetration = 0;
                }
            }
            
            // 计算所恨年年减防和增伤
            let suohenDefenseReduction = 0;
            let suohenExternalPenetration = 0;
            if (skill.suohenLayer && skill.suohenLayer !== '0层') {
                switch(skill.suohenLayer) {
                    case '1层':
                        suohenDefenseReduction = 1.2; // 1.2%BOSS防御减少
                        break;
                    case '2层':
                        suohenDefenseReduction = 2.4; // 2.4%BOSS防御减少
                        break;
                    case '3层':
                        suohenDefenseReduction = 3.6; // 3.6%BOSS防御减少
                        break;
                    case '4层':
                        suohenDefenseReduction = 4.8; // 4.8%BOSS防御减少
                        break;
                    case '满层':
                        suohenDefenseReduction = 6.0; // 6.0%BOSS防御减少
                        suohenExternalPenetration = 10; // 满层时额外增加10点外功穿透
                        break;
                    default:
                        suohenDefenseReduction = 0;
                        suohenExternalPenetration = 0;
                }
            }
            
            // 计算有效BOSS防御值（考虑技能减防和所恨年年减防）
            const bladeSkills = ["白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5"];
            let effectiveBossDefense = panelData.bossDefense;
            
            // 先应用技能的10%减防
            if (bladeSkills.includes(skill.name)) {
                effectiveBossDefense = effectiveBossDefense * 0.9;
            }
            
            // 再应用所恨年年的减防
            if (suohenDefenseReduction > 0) {
                effectiveBossDefense = effectiveBossDefense * (1 - suohenDefenseReduction / 100);
            }
            
            // 将易水歌增伤加入到通用增伤中
            generalBonus += yishuiGeneralBonus;
            
            // 计算气窭、奶伞、易伤的增伤效果
            if (skill.qijie === '是') {
                generalBonus += 10; // 气窭增加10%通用增伤
            }
            if (skill.naisan === '是') {
                generalBonus += 20; // 奶伞增加20%通用增伤
            }
            if (skill.yishang === '是') {
                generalBonus += 8; // 易伤增加8%通用增伤
            }
            
            // 计算外功会心伤害（包含所恨年年的外功穿透和外功伤害加成）
            const externalCriticalDamage = ((avgExternalAttack - effectiveBossDefense) * skill.externalRate + skill.fixedExternal) * 
                                          (1 + (panelData.externalPenetration + externalPenetration + yishuiExternalPenetration + suohenExternalPenetration) / 200) * effectiveCriticalRate * 
                                          (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 
                                          (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus *
                                          (1 + (panelData.externalDamageBonus + extraExternalDamageBonus) / 100);
            
            // 计算外功会意伤害（包含所恨年年的外功穿透和外功伤害加成）
            const externalIntentDamage = ((externalAttackWithFeisui.max - effectiveBossDefense) * skill.externalRate + skill.fixedExternal) * 
                                        (1 + (panelData.externalPenetration + externalPenetration + yishuiExternalPenetration + suohenExternalPenetration) / 200) * effectiveIntentRate * 
                                        (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 
                                        (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus *
                                        (1 + (panelData.externalDamageBonus + extraExternalDamageBonus) / 100);
            
            // 计算外功白字伤害（包含所恨年年的外功穿透和外功伤害加成）
            const externalWhiteTextDamage = ((avgExternalAttack - effectiveBossDefense) * skill.externalRate + skill.fixedExternal) * 
                                           (1 + (panelData.externalPenetration + externalPenetration + yishuiExternalPenetration + suohenExternalPenetration) / 200) * whiteTextRate * 
                                           (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus *
                                           (1 + (panelData.externalDamageBonus + extraExternalDamageBonus) / 100);
            
            // 计算外功擦伤伤害（包含所恨年年的外功穿透和外功伤害加成）
            const externalGrazeDamage = ((externalAttackWithFeisui.min - effectiveBossDefense) * skill.externalRate + skill.fixedExternal) * 
                                       (1 + (panelData.externalPenetration + externalPenetration + yishuiExternalPenetration + suohenExternalPenetration) / 200) * grazeRate * 
                                       (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus *
                                       (1 + (panelData.externalDamageBonus + extraExternalDamageBonus) / 100);
            
            // 计算新燕归套装的破竹增伤效果
            let newYanguiBreakBambooBonus = 0;
            if (panelData.equipmentSet === '新燕归' && skill.setLayer === '12%通用+10%破竹增伤' && yanguiSkills.includes(skill.name)) {
                newYanguiBreakBambooBonus = 10; // 10%破竹增伤
            }
            
            // 计算破竹会心伤害
            const breakBambooCriticalDamage = (avgBreakBambooAttack * skill.breakBambooRate + skill.fixedBreakBamboo) * 
                                             (1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200) * effectiveCriticalRate * 
                                             (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 1.5 * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                             (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算破竹会意伤害
            const breakBambooIntentDamage = (panelData.breakBambooAttack.max * skill.breakBambooRate + skill.fixedBreakBamboo) * 
                                            (1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200) * effectiveIntentRate * 
                                            (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 1.5 * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                            (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算破竹白字伤害
            const breakBambooWhiteTextDamage = (avgBreakBambooAttack * skill.breakBambooRate + skill.fixedBreakBamboo) * 
                                               (1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200) * whiteTextRate * 1.5 * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                               (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算破竹擦伤伤害
            const breakBambooGrazeDamage = (panelData.breakBambooAttack.min * skill.breakBambooRate + skill.fixedBreakBamboo) * 
                                          (1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200) * grazeRate * 1.5 * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                          (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算外属会心伤害
            const externalElementCriticalDamage = (avgRingMetalAttack * skill.externalElementRate) * 
                                                effectiveCriticalRate * (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 
                                                (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus +
                                                (avgBreakRockAttack * skill.externalElementRate) * 
                                                effectiveCriticalRate * (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 
                                                (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus +
                                                (avgPullSilkAttack * skill.externalElementRate) * 
                                                effectiveCriticalRate * (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 
                                                (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算外属会意伤害
            const externalElementIntentDamage = (panelData.ringMetalAttack.max * skill.externalElementRate) * 
                                              effectiveIntentRate * (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 
                                              (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus +
                                              (panelData.breakRockAttack.max * skill.externalElementRate) * 
                                              effectiveIntentRate * (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 
                                              (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus +
                                              (panelData.pullSilkAttack.max * skill.externalElementRate) * 
                                              effectiveIntentRate * (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 
                                              (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算外属白字伤害
            const externalElementWhiteTextDamage = (avgRingMetalAttack * skill.externalElementRate) * 
                                                whiteTextRate * (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus +
                                                (avgBreakRockAttack * skill.externalElementRate) * 
                                                whiteTextRate * (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus +
                                                (avgPullSilkAttack * skill.externalElementRate) * 
                                                whiteTextRate * (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算外属擦伤伤害
            const externalElementGrazeDamage = (panelData.ringMetalAttack.min * skill.externalElementRate) * 
                                             grazeRate * (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus +
                                             (panelData.breakRockAttack.min * skill.externalElementRate) * 
                                             grazeRate * (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus +
                                             (panelData.pullSilkAttack.min * skill.externalElementRate) * 
                                             grazeRate * (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 获取技能使用次数，默认为1
            const times = skill.times || 1;
            
            // 计算各种类型伤害（单次伤害 × 次数）
            const totalExternalCriticalDamage = externalCriticalDamage * times;
            const totalExternalIntentDamage = externalIntentDamage * times;
            const totalExternalWhiteTextDamage = externalWhiteTextDamage * times;
            const totalExternalGrazeDamage = externalGrazeDamage * times;
            const totalBreakBambooCriticalDamage = breakBambooCriticalDamage * times;
            const totalBreakBambooIntentDamage = breakBambooIntentDamage * times;
            const totalBreakBambooWhiteTextDamage = breakBambooWhiteTextDamage * times;
            const totalBreakBambooGrazeDamage = breakBambooGrazeDamage * times;
            const totalExternalElementCriticalDamage = externalElementCriticalDamage * times;
            const totalExternalElementIntentDamage = externalElementIntentDamage * times;
            const totalExternalElementWhiteTextDamage = externalElementWhiteTextDamage * times;
            const totalExternalElementGrazeDamage = externalElementGrazeDamage * times;
            
            // 计算总伤害（所有类型伤害之和）
            const totalDamage = totalExternalCriticalDamage + totalExternalIntentDamage + totalExternalWhiteTextDamage + totalExternalGrazeDamage +
                               totalBreakBambooCriticalDamage + totalBreakBambooIntentDamage + totalBreakBambooWhiteTextDamage + totalBreakBambooGrazeDamage +
                               totalExternalElementCriticalDamage + totalExternalElementIntentDamage + totalExternalElementWhiteTextDamage + totalExternalElementGrazeDamage;
            
            // 更新伤害数据
            damageData = {
                totalDamage: totalDamage.toFixed(2),
                externalCriticalDamage: totalExternalCriticalDamage.toFixed(2),
                externalIntentDamage: totalExternalIntentDamage.toFixed(2),
                externalWhiteTextDamage: totalExternalWhiteTextDamage.toFixed(2),
                externalGrazeDamage: totalExternalGrazeDamage.toFixed(2),
                breakBambooCriticalDamage: totalBreakBambooCriticalDamage.toFixed(2),
                breakBambooIntentDamage: totalBreakBambooIntentDamage.toFixed(2),
                breakBambooWhiteTextDamage: totalBreakBambooWhiteTextDamage.toFixed(2),
                breakBambooGrazeDamage: totalBreakBambooGrazeDamage.toFixed(2),
                externalElementCriticalDamage: totalExternalElementCriticalDamage.toFixed(2),
                externalElementIntentDamage: totalExternalElementIntentDamage.toFixed(2),
                externalElementWhiteTextDamage: totalExternalElementWhiteTextDamage.toFixed(2),
                externalElementGrazeDamage: totalExternalElementGrazeDamage.toFixed(2),
                effectiveCriticalRate: (effectiveCriticalRate * 100).toFixed(2) + '%',
                effectiveIntentRate: (effectiveIntentRate * 100).toFixed(2) + '%',
                whiteTextRate: (whiteTextRate * 100).toFixed(2) + '%',
                grazeRate: (grazeRate * 100).toFixed(2) + '%'
            };
        }
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <select class="table-skill-select" data-index="${index}">
                    ${skillOptions}
                </select>
            </td>
            <td>
                <select class="table-buff-select" data-index="${index}">
                    ${buffOptions}
                </select>
            </td>
            <td>
                <input type="number" class="table-times-input" data-index="${index}" value="${(skill.times || 1).toFixed(2)}" min="0" step="1" style="width: 60px; text-align: center;" ${skill.name === "极乐泣血" && jileCalculationMode === 'auto' ? 'readonly' : ''}>
            </td>
            <td>${damageData.totalDamage}</td>
            <td>
                <select class="table-set-layer-select" data-index="${index}" style="width: 120px; text-align: center;">
                    ${getSetOptions(panelData.equipmentSet, skill.setLayer)}
                </select>
            </td>
            <td>
                <select class="table-talisman-select" data-index="${index}" style="width: 80px; text-align: center;">
                    ${getTalismanOptions(skill.talismanLayer)}
                </select>
            </td>
            <td>
                <select class="table-yishui-select" data-index="${index}" style="width: 80px; text-align: center;">
                    <option value="0层" ${skill.yishuiLayer === '0层' ? 'selected' : ''}>0层</option>
                    <option value="1层" ${skill.yishuiLayer === '1层' ? 'selected' : ''}>1层</option>
                    <option value="2层" ${skill.yishuiLayer === '2层' ? 'selected' : ''}>2层</option>
                    <option value="3层" ${skill.yishuiLayer === '3层' ? 'selected' : ''}>3层</option>
                    <option value="4层" ${skill.yishuiLayer === '4层' ? 'selected' : ''}>4层</option>
                    <option value="满层" ${skill.yishuiLayer === '满层' ? 'selected' : ''}>满层</option>
                </select>
            </td>
            <td>
                <select class="table-suohen-select" data-index="${index}" style="width: 80px; text-align: center;">
                    <option value="0层" ${skill.suohenLayer === '0层' ? 'selected' : ''}>0层</option>
                    <option value="1层" ${skill.suohenLayer === '1层' ? 'selected' : ''}>1层</option>
                    <option value="2层" ${skill.suohenLayer === '2层' ? 'selected' : ''}>2层</option>
                    <option value="3层" ${skill.suohenLayer === '3层' ? 'selected' : ''}>3层</option>
                    <option value="4层" ${skill.suohenLayer === '4层' ? 'selected' : ''}>4层</option>
                    <option value="满层" ${skill.suohenLayer === '满层' ? 'selected' : ''}>满层</option>
                </select>
            </td>
            <td>
                <input type="checkbox" class="table-qijie-checkbox" data-index="${index}" ${skill.qijie === '是' ? 'checked' : ''} style="width: 20px; height: 20px;">
            </td>
            <td>
                <input type="checkbox" class="table-naisan-checkbox" data-index="${index}" ${skill.naisan === '是' ? 'checked' : ''} style="width: 20px; height: 20px;">
            </td>
            <td>
                <input type="checkbox" class="table-yishang-checkbox" data-index="${index}" ${skill.yishang === '是' ? 'checked' : ''} style="width: 20px; height: 20px;">
            </td>
            <td>${damageData.externalCriticalDamage}</td>
            <td>${damageData.externalIntentDamage}</td>
            <td>${damageData.externalWhiteTextDamage}</td>
            <td>${damageData.externalGrazeDamage}</td>
            <td>${damageData.breakBambooCriticalDamage}</td>
            <td>${damageData.breakBambooIntentDamage}</td>
            <td>${damageData.breakBambooWhiteTextDamage}</td>
            <td>${damageData.breakBambooGrazeDamage}</td>
            <td>${damageData.externalElementCriticalDamage}</td>
            <td>${damageData.externalElementIntentDamage}</td>
            <td>${damageData.externalElementWhiteTextDamage}</td>
            <td>${damageData.externalElementGrazeDamage}</td>
            <td>${damageData.effectiveCriticalRate}</td>
            <td>${damageData.effectiveIntentRate}</td>
            <td>${damageData.whiteTextRate}</td>
            <td>${damageData.grazeRate}</td>
            <td><button class="delete-btn" data-index="${index}">删除</button></td>
        `;
        
        fragment.appendChild(row);
    });
    
    // 一次性添加所有行到表格
    tableBody.appendChild(fragment);
    
    // 添加删除按钮事件监听
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            removeSkillFromRotation(index);
        });
    });
    
    // 使用requestAnimationFrame优化图表更新
    requestAnimationFrame(() => {
        updateAllCharts();
    });
    
    // 添加技能选择下拉框事件监听
    const skillSelects = document.querySelectorAll('.table-skill-select');
    skillSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const selectedSkillName = e.target.value;
            
            console.log('技能选择事件触发:', { index, selectedSkillName, rotationDataLength: rotationData.length });
            
            // 检查索引是否有效
            if (index < 0 || index >= rotationData.length) {
                console.error('无效的索引:', index, '数组长度:', rotationData.length);
                return;
            }
            
            if (selectedSkillName && selectedSkillName !== '') {
                // 查找选中的技能数据
                const selectedSkill = skillRatesData.find(skill => skill.name === selectedSkillName);
                
                console.log('找到的技能数据:', selectedSkill);
                
                if (selectedSkill) {
                    // 保留原有的非技能数据（如times、setLayer等）
                    const originalData = rotationData[index];
                    
                    console.log('原始数据:', originalData);
                    
                    // 更新排轴数据，保留原有的非技能相关属性
                    rotationData[index] = {
                        ...selectedSkill,
                        buffName: originalData.buffName || '无',
                        generalBonus: originalData.generalBonus || 0,
                        criticalBonus: originalData.criticalBonus || 0,
                        externalPenetration: originalData.externalPenetration || 0,
                        extraCriticalRate: originalData.extraCriticalRate || 0,
                        times: originalData.times || 1,
                        setLayer: originalData.setLayer || '无',
                        talismanLayer: originalData.talismanLayer || '无帖',
                        yishuiLayer: originalData.yishuiLayer || '0层',
                suohenLayer: originalData.suohenLayer || '0层',
                qijie: originalData.qijie || '否',
                naisan: originalData.naisan || '否',
                yishang: originalData.yishang || '否',
                        yishang: originalData.yishang || '否'
                    };
                    
                    console.log('更新后的数据:', rotationData[index]);
                    console.log('当前排轴数据长度:', rotationData.length);
                    
                    // 重新渲染表格
                    updateRotationTable();
                    
                    console.log('表格重新渲染完成');
                } else {
                    console.error('找不到技能:', selectedSkillName);
                }
            } else {
                // 如果选择的是空值，不做任何操作
                console.log('用户取消选择或选择了空项');
            }
        });
    });
    
    // 添加BUFF选择下拉框事件监听
    const buffSelects = document.querySelectorAll('.table-buff-select');
    buffSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const selectedBuffName = e.target.value;
            
            // 检查索引是否有效
            if (index < 0 || index >= rotationData.length) {
                console.error('无效的索引:', index);
                return;
            }
            
            if (selectedBuffName && selectedBuffName !== '') {
                // 查找选中的BUFF数据
                const selectedBuff = buffData.find(buff => buff.name === selectedBuffName);
                
                if (selectedBuff) {
                    // 更新排轴数据
                    rotationData[index] = {
                        ...rotationData[index],
                        buffName: selectedBuff.name,
                        generalBonus: selectedBuff.generalBonus,
                        criticalBonus: selectedBuff.criticalBonus,
                        externalPenetration: selectedBuff.externalPenetration,
                        extraCriticalRate: selectedBuff.extraCriticalRate
                    };
                    
                    // 更新表格
                    updateRotationTable();
                } else {
                    console.error('找不到BUFF:', selectedBuffName);
                }
            }
        });
    });
    
    // 添加次数输入框事件监听
    const timesInputs = document.querySelectorAll('.table-times-input');
    timesInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const times = parseFloat(e.target.value) || 1;
            
            // 检查索引是否有效
            if (index < 0 || index >= rotationData.length) {
                console.error('无效的索引:', index);
                return;
            }
            
            // 更新排轴数据
            rotationData[index] = {
                ...rotationData[index],
                times: times
            };
            
            // 更新表格
            updateRotationTable();
        });
    });
    
    // 添加套装层数下拉选择框事件监听（支持联动选择）
    const setLayerSelects = document.querySelectorAll('.table-set-layer-select');
    setLayerSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const setLayer = e.target.value;
            
            // 检查索引是否有效
            if (index < 0 || index >= rotationData.length) {
                console.error('无效的索引:', index);
                return;
            }
            
            // 更新当前行的数据
            rotationData[index] = {
                ...rotationData[index],
                setLayer: setLayer
            };
            
            // 检查是否启用联动模式
            if (isCascadeModeEnabled()) {
                console.log(`套装联动选择：位置${index}选择${setLayer}，开始同步后续位置`);
                
                // 联动选择：将该位置以下的所有套装下拉框同步为相同选择
                for (let i = index + 1; i < rotationData.length; i++) {
                    rotationData[i] = {
                        ...rotationData[i],
                        setLayer: setLayer
                    };
                }
                
                console.log(`联动完成：位置${index}到${rotationData.length - 1}的套装已同步为${setLayer}`);
            } else {
                console.log(`套装独立选择：位置${index}选择${setLayer}（联动模式已禁用）`);
            }
            
            // 更新表格
            updateRotationTable();
        });
    });
    
    // 添加符帖下拉选择框事件监听（支持联动选择）
    const talismanSelects = document.querySelectorAll('.table-talisman-select');
    talismanSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const talismanLayer = e.target.value;
            
            // 检查索引是否有效
            if (index < 0 || index >= rotationData.length) {
                console.error('无效的索引:', index);
                return;
            }
            
            // 更新当前行的数据
            rotationData[index] = {
                ...rotationData[index],
                talismanLayer: talismanLayer
            };
            
            // 检查是否启用联动模式
            if (isCascadeModeEnabled()) {
                console.log(`符帖联动选择：位置${index}选择${talismanLayer}，开始同步后续位置`);
                
                // 联动选择：将该位置以下的所有符帖下拉框同步为相同选择
                for (let i = index + 1; i < rotationData.length; i++) {
                    rotationData[i] = {
                        ...rotationData[i],
                        talismanLayer: talismanLayer
                    };
                }
                
                console.log(`联动完成：位置${index}到${rotationData.length - 1}的符帖已同步为${talismanLayer}`);
            } else {
                console.log(`符帖独立选择：位置${index}选择${talismanLayer}（联动模式已禁用）`);
            }
            
            // 更新表格
            updateRotationTable();
        });
    });
    
    // 添加易水歌下拉选择框事件监听（支持联动选择）
    const yishuiSelects = document.querySelectorAll('.table-yishui-select');
    yishuiSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const yishuiLayer = e.target.value;
            
            // 检查索引是否有效
            if (index < 0 || index >= rotationData.length) {
                console.error('无效的索引:', index);
                return;
            }
            
            // 更新当前行的数据
            rotationData[index] = {
                ...rotationData[index],
                yishuiLayer: yishuiLayer
            };
            
            // 检查是否启用联动模式
            if (isCascadeModeEnabled()) {
                console.log(`易水歌联动选择：位置${index}选择${yishuiLayer}，开始同步后续位置`);
                
                // 联动选择：将该位置以下的所有易水歌下拉框同步为相同选择
                for (let i = index + 1; i < rotationData.length; i++) {
                    rotationData[i] = {
                        ...rotationData[i],
                        yishuiLayer: yishuiLayer
                    };
                }
                
                console.log(`联动完成：位置${index}到${rotationData.length - 1}的易水歌已同步为${yishuiLayer}`);
            } else {
                console.log(`易水歌独立选择：位置${index}选择${yishuiLayer}（联动模式已禁用）`);
            }
            
            // 更新表格
            updateRotationTable();
        });
    });
    
    // 添加所恨年年下拉选择框事件监听（支持联动选择）
    const suohenSelects = document.querySelectorAll('.table-suohen-select');
    suohenSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const suohenLayer = e.target.value;
            
            // 检查索引是否有效
            if (index < 0 || index >= rotationData.length) {
                console.error('无效的索引:', index);
                return;
            }
            
            // 更新当前行的数据
            rotationData[index] = {
                ...rotationData[index],
                suohenLayer: suohenLayer
            };
            
            // 检查是否启用联动模式
            if (isCascadeModeEnabled()) {
                console.log(`所恨年年联动选择：位置${index}选择${suohenLayer}，开始同步后续位置`);
                
                // 联动选择：将该位置以下的所有所恨年年下拉框同步为相同选择
                for (let i = index + 1; i < rotationData.length; i++) {
                    rotationData[i] = {
                        ...rotationData[i],
                        suohenLayer: suohenLayer
                    };
                }
                
                console.log(`联动完成：位置${index}到${rotationData.length - 1}的所恨年年已同步为${suohenLayer}`);
            } else {
                console.log(`所恨年年独立选择：位置${index}选择${suohenLayer}（联动模式已禁用）`);
            }
            
            // 更新表格
            updateRotationTable();
        });
    });
    
    // 添加气窭复选框事件监听
    const qijieCheckboxes = document.querySelectorAll('.table-qijie-checkbox');
    qijieCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const qijie = e.target.checked ? '是' : '否';
            
            // 检查索引是否有效
            if (index < 0 || index >= rotationData.length) {
                console.error('无效的索引:', index);
                return;
            }
            
            // 更新排轴数据
            rotationData[index] = {
                ...rotationData[index],
                qijie: qijie
            };
            
            // 更新表格
            updateRotationTable();
        });
    });
    
    // 添加奶伞复选框事件监听
    const naisanCheckboxes = document.querySelectorAll('.table-naisan-checkbox');
    naisanCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const naisan = e.target.checked ? '是' : '否';
            
            // 检查索引是否有效
            if (index < 0 || index >= rotationData.length) {
                console.error('无效的索引:', index);
                return;
            }
            
            // 更新排轴数据
            rotationData[index] = {
                ...rotationData[index],
                naisan: naisan
            };
            
            // 更新表格
            updateRotationTable();
        });
    });
    
    // 添加易伤复选框事件监听
    const yishangCheckboxes = document.querySelectorAll('.table-yishang-checkbox');
    yishangCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            const yishang = e.target.checked ? '是' : '否';
            
            // 检查索引是否有效
            if (index < 0 || index >= rotationData.length) {
                console.error('无效的索引:', index);
                return;
            }
            
            // 更新排轴数据
            rotationData[index] = {
                ...rotationData[index],
                yishang: yishang
            };
            
            // 更新表格
            updateRotationTable();
        });
    });
    
    // 更新伤害统计表格
    updateDamageStatsTable();
    
    // 更新排轴列表伤害列总和显示
    updateRotationDamageSumDisplay();
    
    // 添加套装列表头下拉框事件监听器
    const headerSelect = document.getElementById('set-layer-header-select');
    if (headerSelect) {
        // 移除之前的事件监听器（如果有的话）
        headerSelect.removeEventListener('change', handleSetLayerHeaderChange);
        
        // 添加新的事件监听器
        headerSelect.addEventListener('change', handleSetLayerHeaderChange);
    }
}

// 处理套装列表头下拉框变化事件（现在直接控制套装类型选择）
function handleSetLayerHeaderChange(e) {
    const selectedSet = e.target.value;
    
    if (!selectedSet) {
        return; // 如果没有选择值，不执行同步
    }
    
    console.log(`套装表头选择：${selectedSet}，开始更新系统套装设置`);
    
    // 更新panelData中的套装值
    panelData.equipmentSet = selectedSet;
    
    // 同步更新基础信息面板的套装选择
    const equipmentSetSelect = document.getElementById('equipment-set');
    if (equipmentSetSelect) {
        equipmentSetSelect.value = selectedSet;
    }
    
    // 如果选择了"无"，清空所有排轴技能的套装层数设置
    if (selectedSet === '无') {
        const setLayerSelects = document.querySelectorAll('.table-set-layer-select');
        setLayerSelects.forEach(select => {
            const index = parseInt(select.getAttribute('data-index'));
            
            if (index >= 0 && index < rotationData.length) {
                select.value = '无';
                rotationData[index] = {
                    ...rotationData[index],
                    setLayer: '无'
                };
            }
        });
    } else {
        // 如果选择了具体套装，根据套装类型设置默认层数
        let defaultLayer = '无';
        switch(selectedSet) {
            case '飞隼':
                defaultLayer = '0层';
                break;
            case '燕归':
                defaultLayer = '无';
                break;
            case '时雨':
                defaultLayer = '10%会心增伤';
                break;
            case '浣花':
                defaultLayer = '15会心增伤（5%）';
                break;
            case '岳山':
                defaultLayer = '5%通用增伤';
                break;
            case '新燕归':
                defaultLayer = '无';
                break;
        }
        
        // 更新所有排轴技能的套装层数设置
        const setLayerSelects = document.querySelectorAll('.table-set-layer-select');
        setLayerSelects.forEach(select => {
            const index = parseInt(select.getAttribute('data-index'));
            
            if (index >= 0 && index < rotationData.length) {
                select.value = defaultLayer;
                rotationData[index] = {
                    ...rotationData[index],
                    setLayer: defaultLayer
                };
            }
        });
    }
    
    console.log(`套装设置完成：${selectedSet}，已同步到基础信息面板和所有排轴技能`);
    
    // 重新计算并更新表格
    updateRotationTable();
}



// 统一的保存功能函数
function performSave() {
    try {
        console.log('执行保存操作（通过按钮点击或键盘快捷键）');
        
        // 统一收集所有面板数据
        collectAndSavePanelData();
        
        // 更新排轴列表数据
        updateRotationTable();
        
        // 显示保存成功消息
        showNotification('基础信息保存成功！排轴列表已更新');
        showSaveButtonSuccess('save-panel-btn');
        console.log('保存完成，数据已更新，排轴列表已刷新');
        
    } catch (error) {
        console.error('保存过程中发生错误:', error);
        showNotification('保存失败: ' + error.message, 'error');
    }
}

// 初始化保存按钮（优化版本）
function initSaveButton() {
    try {
        const saveButton = document.getElementById('save-panel-btn');
        
        if (!saveButton) {
            console.error('找不到保存按钮元素！');
            return;
        }
        
        console.log('保存按钮已找到，准备绑定事件');
        
        // 移除可能存在的旧事件监听器
        const newSaveButton = saveButton.cloneNode(true);
        saveButton.parentNode.replaceChild(newSaveButton, saveButton);
        
        // 绑定新的点击事件
        newSaveButton.addEventListener('click', function() {
            console.log('保存按钮被点击，开始保存数据');
            
            try {
                // 保存按钮被点击时的视觉反馈
                this.style.backgroundColor = '#4CAF50';
                setTimeout(() => { this.style.backgroundColor = ''; }, 300);
                
                // 调用统一的保存功能
                performSave();
                
            } catch (error) {
                console.error('保存过程中发生错误:', error);
                showNotification('保存失败: ' + error.message, 'error');
            }
        });
        
        console.log('保存按钮事件绑定成功');
    } catch (error) {
        console.error('初始化保存按钮时发生错误:', error);
    }
}

// 初始化键盘快捷键支持
function initKeyboardShortcuts() {
    try {
        console.log('初始化键盘快捷键支持');
        
        // 检查浏览器是否支持键盘事件
        if (typeof document.addEventListener !== 'function') {
            console.warn('当前浏览器不支持addEventListener，键盘快捷键功能将被禁用');
            return;
        }
        
        // 添加全局键盘事件监听器
        document.addEventListener('keydown', function(event) {
            // 兼容性检查：支持多种空格键检测方式
            const isSpaceKey = event.code === 'Space' || 
                              event.key === ' ' || 
                              event.keyCode === 32 || 
                              event.which === 32;
            
            if (isSpaceKey) {
                // 检查是否在输入框、文本区域或其他可输入元素中
                const activeElement = document.activeElement;
                const isInputElement = activeElement && (
                    activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.tagName === 'SELECT' ||
                    activeElement.contentEditable === 'true' ||
                    activeElement.isContentEditable
                );
                
                // 如果不在输入元素中，则触发保存功能
                if (!isInputElement) {
                    // 阻止默认的空格键行为（如页面滚动）
                    if (event.preventDefault) {
                        event.preventDefault();
                    } else {
                        event.returnValue = false; // IE兼容性
                    }
                    
                    console.log('空格键被按下，触发保存功能');
                    
                    // 获取保存按钮元素，用于视觉反馈
                    const saveButton = document.getElementById('save-panel-btn');
                    if (saveButton) {
                        // 添加视觉反馈（兼容性处理）
                        const originalBg = saveButton.style.backgroundColor;
                        const originalTransform = saveButton.style.transform;
                        
                        saveButton.style.backgroundColor = '#4CAF50';
                        saveButton.style.transform = 'scale(0.95)';
                        
                        // 使用setTimeout确保动画效果
                        setTimeout(function() { 
                            saveButton.style.backgroundColor = originalBg;
                            saveButton.style.transform = originalTransform;
                        }, 300);
                    }
                    
                    // 调用统一的保存功能
                    performSave();
                }
            }
        }, false); // 使用捕获阶段，提高兼容性
        
        console.log('键盘快捷键支持初始化完成');
    } catch (error) {
        console.error('初始化键盘快捷键时发生错误:', error);
    }
}

// 统一收集和保存面板数据（优化版本）
function collectAndSavePanelData() {
    try {
        // 定义输入框映射关系，避免重复代码
        const inputMappings = {
            // 攻击属性
            externalAttack: ['external-attack-min', 'external-attack-max'],
            breakBambooAttack: ['break-bamboo-attack-min', 'break-bamboo-attack-max'],
            ringMetalAttack: ['ring-metal-attack-min', 'ring-metal-attack-max'],
            breakRockAttack: ['break-rock-attack-min', 'break-rock-attack-max'],
            pullSilkAttack: ['pull-silk-attack-min', 'pull-silk-attack-max'],
            
            // 三率和伤害加成
            precisionRate: 'precision-rate',
            criticalRate: 'critical-rate',
            intentRate: 'intent-rate',
            directCriticalRate: 'direct-critical-rate',
            directIntentRate: 'direct-intent-rate',
            criticalDamageBonus: 'critical-damage-bonus',
            intentDamageBonus: 'intent-damage-bonus',
            externalDamageBonus: 'external-damage-bonus',
            elementalDamageBonus: 'elemental-damage-bonus',
            
            // 穿透
            externalPenetration: 'external-penetration',
            elementalPenetration: 'elemental-penetration',
            
            // 装备增伤
            ropeDartBonus: 'rope-dart-bonus',
            dualBladesBonus: 'dual-blades-bonus',
            allMartialBonus: 'all-martial-bonus',
            bossUnitBonus: 'boss-unit-bonus',
            lightStrikeBonus: 'light-strike-bonus',
            mouseBonus: 'mouse-bonus',
            
            // 其他设置
            equipmentSet: 'equipment-set',
            foodBuff: 'food-buff',
            talisman: 'talisman',
            craftingBonus: 'crafting-bonus',
            bossTalentBonus: 'boss-talent-bonus',
            bossDefense: 'boss-defense'
        };
        
        // 统一收集数据
        Object.keys(inputMappings).forEach(key => {
            const mapping = inputMappings[key];
            
            if (Array.isArray(mapping)) {
                // 处理范围值（min-max）
                panelData[key] = {
                    min: parseFloat(document.getElementById(mapping[0]).value) || 0,
                    max: parseFloat(document.getElementById(mapping[1]).value) || 0
                };
            } else {
                // 处理单个值
                const element = document.getElementById(mapping);
                if (element) {
                    const value = element.value;
                    if (key.includes('Rate') || (key.includes('Bonus') && !key.includes('craftingBonus')) || key.includes('Penetration')) {
                        // 数值类型，移除%符号
                        panelData[key] = parseFloat(value.replace('%', '')) || 0;
                    } else if (key === 'bossDefense') {
                        // Boss防御
                        panelData[key] = parseFloat(value) || 350;
                    } else {
                        // 字符串类型（包括craftingBonus等下拉框）
                        panelData[key] = value || (key === 'equipmentSet' ? '无' : '');
                    }
                }
            }
        });
        
        // 应用数据验证规则：若最小攻击值大于最大攻击值，则将最大攻击值调整为与最小攻击值相等
        const attackRanges = ['ringMetalAttack', 'breakRockAttack', 'pullSilkAttack'];
        attackRanges.forEach(attackType => {
            if (panelData[attackType] && panelData[attackType].min > panelData[attackType].max) {
                panelData[attackType].max = panelData[attackType].min;
            }
        });
        
        console.log('数据收集完成，准备保存到本地存储');
        
        // 保存到本地存储（避免重复数据收集）
                    savePanelDataAsDefaults();
                
            } catch (error) {
        console.error('收集面板数据时发生错误:', error);
        throw error;
    }
}

// 保存基础信息默认值到本地存储（优化版本）
function savePanelDataAsDefaults() {
    try {
        // 直接使用已收集的panelData，避免重复DOM查询
        const defaultValues = {
            // 战斗属性
            externalAttackMin: panelData.externalAttack?.min || 0,
            externalAttackMax: panelData.externalAttack?.max || 0,
            breakBambooAttackMin: panelData.breakBambooAttack?.min || 0,
            breakBambooAttackMax: panelData.breakBambooAttack?.max || 0,
            ringMetalAttackMin: panelData.ringMetalAttack?.min || 0,
            ringMetalAttackMax: panelData.ringMetalAttack?.max || 0,
            breakRockAttackMin: panelData.breakRockAttack?.min || 0,
            breakRockAttackMax: panelData.breakRockAttack?.max || 0,
            pullSilkAttackMin: panelData.pullSilkAttack?.min || 0,
            pullSilkAttackMax: panelData.pullSilkAttack?.max || 0,
            precisionRate: panelData.precisionRate || 0,
            criticalRate: panelData.criticalRate || 0,
            intentRate: panelData.intentRate || 0,
            directCriticalRate: panelData.directCriticalRate || 0,
            directIntentRate: panelData.directIntentRate || 0,
            criticalDamageBonus: panelData.criticalDamageBonus || 0,
            intentDamageBonus: panelData.intentDamageBonus || 0,
            externalDamageBonus: panelData.externalDamageBonus || 0,
            elementalDamageBonus: panelData.elementalDamageBonus || 0,
            externalPenetration: panelData.externalPenetration || 0,
            elementalPenetration: panelData.elementalPenetration || 0,
            
            // 装备增伤
            ropeDartBonus: panelData.ropeDartBonus || 0,
            dualBladesBonus: panelData.dualBladesBonus || 0,
            allMartialBonus: panelData.allMartialBonus || 0,
            bossUnitBonus: panelData.bossUnitBonus || 0,
            lightStrikeBonus: panelData.lightStrikeBonus || 0,
            mouseBonus: panelData.mouseBonus || 0,
            
            // 其他增伤
            equipmentSet: panelData.equipmentSet || '无',
            foodBuff: panelData.foodBuff || '无',
            talisman: panelData.talisman || '无',
            craftingBonus: panelData.craftingBonus || '无',
            bossTalentBonus: panelData.bossTalentBonus || 0,
            bossDefense: panelData.bossDefense || 350,
            
            // 保存时间戳
            timestamp: Date.now()
        };
        
        // 保存到localStorage
        localStorage.setItem('panelDataDefaults', JSON.stringify(defaultValues));
        console.log('基础信息默认值已保存到本地存储');
        
    } catch (error) {
        console.error('保存基础信息默认值时发生错误:', error);
        throw error;
    }
}

// 从本地存储加载基础信息默认值
function loadPanelDataDefaults() {
    try {
        const savedDefaults = localStorage.getItem('panelDataDefaults');
        if (!savedDefaults) {
            console.log('未找到保存的基础信息默认值');
            return false;
        }
        
        const defaultValues = JSON.parse(savedDefaults);
        console.log('开始加载基础信息默认值:', defaultValues);
        
        // 填充战斗属性
        const setInputValue = (id, value) => {
            const element = document.getElementById(id);
            if (element && value !== undefined && value !== null) {
                element.value = value;
            }
        };
        
        // 战斗属性
        setInputValue('external-attack-min', defaultValues.externalAttackMin);
        setInputValue('external-attack-max', defaultValues.externalAttackMax);
        setInputValue('break-bamboo-attack-min', defaultValues.breakBambooAttackMin);
        setInputValue('break-bamboo-attack-max', defaultValues.breakBambooAttackMax);
        setInputValue('ring-metal-attack-min', defaultValues.ringMetalAttackMin);
        setInputValue('ring-metal-attack-max', defaultValues.ringMetalAttackMax);
        setInputValue('break-rock-attack-min', defaultValues.breakRockAttackMin);
        setInputValue('break-rock-attack-max', defaultValues.breakRockAttackMax);
        setInputValue('pull-silk-attack-min', defaultValues.pullSilkAttackMin);
        setInputValue('pull-silk-attack-max', defaultValues.pullSilkAttackMax);
        setInputValue('precision-rate', defaultValues.precisionRate);
        setInputValue('critical-rate', defaultValues.criticalRate);
        setInputValue('intent-rate', defaultValues.intentRate);
        setInputValue('direct-critical-rate', defaultValues.directCriticalRate);
        setInputValue('direct-intent-rate', defaultValues.directIntentRate);
        setInputValue('critical-damage-bonus', defaultValues.criticalDamageBonus);
        setInputValue('intent-damage-bonus', defaultValues.intentDamageBonus);
        setInputValue('external-damage-bonus', defaultValues.externalDamageBonus);
        setInputValue('elemental-damage-bonus', defaultValues.elementalDamageBonus);
        setInputValue('external-penetration', defaultValues.externalPenetration);
        setInputValue('elemental-penetration', defaultValues.elementalPenetration);
        
        // 装备增伤
        setInputValue('rope-dart-bonus', defaultValues.ropeDartBonus);
        setInputValue('dual-blades-bonus', defaultValues.dualBladesBonus);
        setInputValue('all-martial-bonus', defaultValues.allMartialBonus);
        setInputValue('boss-unit-bonus', defaultValues.bossUnitBonus);
        setInputValue('light-strike-bonus', defaultValues.lightStrikeBonus);
        setInputValue('mouse-bonus', defaultValues.mouseBonus);
        
        // 其他增伤
        setInputValue('equipment-set', defaultValues.equipmentSet);
        setInputValue('food-buff', defaultValues.foodBuff);
        setInputValue('talisman', defaultValues.talisman);
        setInputValue('crafting-bonus', defaultValues.craftingBonus);
        setInputValue('boss-talent-bonus', defaultValues.bossTalentBonus);
        setInputValue('boss-defense', defaultValues.bossDefense);
        
        console.log('基础信息默认值加载完成');
        return true;
        
    } catch (error) {
        console.error('加载基础信息默认值时发生错误:', error);
        return false;
    }
}



// 初始化清空排轴按钮
function initClearRotationButton() {
    const clearButton = document.getElementById('clear-rotation-btn');
    
    clearButton.addEventListener('click', async () => {
        const confirmClear = await showConfirmDialog('确定要清空排轴吗？', '清空排轴');
        if (confirmClear) {
            // 清空排轴数据
            rotationData = [];
            
            // 更新排轴表格
            updateRotationTable();
        }
    });
}

// 从排轴中移除技能
function removeSkillFromRotation(index) {
    rotationData.splice(index, 1);
    updateRotationTable();
}

// 初始化计算伤害按钮
function initCalculateDamageButton() {
    const calculateButton = document.getElementById('calculate-damage-btn');
    
    calculateButton.addEventListener('click', () => {
        if (rotationData.length === 0) {
            showNotification('请先添加技能到排轴中！', 'warning');
            return;
        }
        
        // 计算伤害
        const damageResult = calculateDamage();
        
        // 显示伤害计算结果
        displayDamageResult(damageResult);
    });
}



// 加载已保存的配置列表
function loadSavedConfigs() {
    const configSelect = document.getElementById('saved-configs-select');
    
    if (!configSelect) {
        console.error('找不到配置选择下拉框！');
        return;
    }
    
    try {
        // 获取已保存的配置列表
        let savedConfigs = JSON.parse(localStorage.getItem('rotationConfigs') || '[]');
        
        // 确保savedConfigs是数组
        if (!Array.isArray(savedConfigs)) {
            savedConfigs = [];
        }
        
        // 清空并重新填充下拉框
        configSelect.innerHTML = '<option value="">选择已保存的配置</option>';
        
        // 按时间戳降序排序（最新的在前面），并过滤掉无效配置
        savedConfigs
            .filter(config => config && config.timestamp && config.name) // 过滤掉无效配置
            .sort((a, b) => b.timestamp - a.timestamp)
            .forEach(config => {
                const option = document.createElement('option');
                option.value = config.timestamp;
                const date = new Date(config.timestamp);
                // 显示版本信息（如果有）
                const versionText = config.version ? ` v${config.version}` : '';
                option.textContent = `${config.name}${versionText} (${date.toLocaleString()})`;
                configSelect.appendChild(option);
            });
    } catch (error) {
        console.error('加载已保存配置列表时发生错误：', error);
        // 发生错误时清空下拉框，避免显示错误数据
        configSelect.innerHTML = '<option value="">选择已保存的配置</option>';
    }
}

// 获取默认面板数据（用于兼容性处理）
function getDefaultPanelData() {
    return {
        externalAttack: { min: 0, max: 0 },
        criticalRate: 0,
        intentRate: 0,
        criticalDamageBonus: 0,
        intentDamageBonus: 0,
        externalDamageBonus: 0,
        elementalDamageBonus: 0,
        externalPenetration: 0,
        elementalPenetration: 0,
        ropeDartBonus: 0,
        dualBladesBonus: 0,
        allMartialBonus: 0,
        bossUnitBonus: 0,
        lightStrikeBonus: 0,
        mouseBonus: 0,
        equipmentSet: '无',
        foodBuff: '无',
        talisman: '无帖',
        craftingBonus: '无',
        bossTalentBonus: 0,
        bossDefense: 350
    };
}

// 更新面板输入框的值
function updatePanelInputs() {
    try {
        // 更新战斗属性输入框
        document.getElementById('external-attack-min').value = panelData.externalAttack.min;
        document.getElementById('external-attack-max').value = panelData.externalAttack.max;
        document.getElementById('precision-rate').value = panelData.precisionRate;
        document.getElementById('critical-rate').value = panelData.criticalRate;
        document.getElementById('intent-rate').value = panelData.intentRate;
        document.getElementById('direct-critical-rate').value = panelData.directCriticalRate;
        document.getElementById('direct-intent-rate').value = panelData.directIntentRate;
        document.getElementById('ring-metal-attack-min').value = panelData.ringMetalAttack.min;
        document.getElementById('ring-metal-attack-max').value = panelData.ringMetalAttack.max;
        document.getElementById('break-rock-attack-min').value = panelData.breakRockAttack.min;
        document.getElementById('break-rock-attack-max').value = panelData.breakRockAttack.max;
        document.getElementById('pull-silk-attack-min').value = panelData.pullSilkAttack.min;
        document.getElementById('pull-silk-attack-max').value = panelData.pullSilkAttack.max;
        document.getElementById('break-bamboo-attack-min').value = panelData.breakBambooAttack.min;
        document.getElementById('break-bamboo-attack-max').value = panelData.breakBambooAttack.max;
        document.getElementById('critical-damage-bonus').value = panelData.criticalDamageBonus;
        document.getElementById('intent-damage-bonus').value = panelData.intentDamageBonus;
        document.getElementById('external-penetration').value = panelData.externalPenetration;
        document.getElementById('elemental-penetration').value = panelData.elementalPenetration;
        document.getElementById('external-damage-bonus').value = panelData.externalDamageBonus;
        document.getElementById('elemental-damage-bonus').value = panelData.elementalDamageBonus;
        
        // 更新装备增伤输入框
        document.getElementById('rope-dart-bonus').value = panelData.ropeDartBonus;
        document.getElementById('dual-blades-bonus').value = panelData.dualBladesBonus;
        document.getElementById('all-martial-bonus').value = panelData.allMartialBonus;
        document.getElementById('boss-unit-bonus').value = panelData.bossUnitBonus;
        document.getElementById('light-strike-bonus').value = panelData.lightStrikeBonus;
        document.getElementById('mouse-bonus').value = panelData.mouseBonus;
        
        // 更新其他增伤下拉框
        document.getElementById('equipment-set').value = panelData.equipmentSet;
        document.getElementById('food-buff').value = panelData.foodBuff;
        document.getElementById('talisman').value = panelData.talisman;
        document.getElementById('crafting-bonus').value = panelData.craftingBonus;
        
        // 更新BOSS相关输入框
        document.getElementById('boss-talent-bonus').value = panelData.bossTalentBonus;
        document.getElementById('boss-defense').value = panelData.bossDefense;
    } catch (error) {
        console.error('更新面板输入框时发生错误：', error);
    }
}

// 初始化添加行按钮
function initAddRowButton() {
    const addRowButton = document.getElementById('add-row-btn');
    
    addRowButton.addEventListener('click', () => {
        let newRotationItem;
        
        // 判断是否已有行数据
        if (rotationData.length > 0) {
            // 如果已有行数据，复制上一行的所有选择项配置
            const lastRow = rotationData[rotationData.length - 1];
            newRotationItem = {
                // 复制上一行的所有属性
                name: "无", // 技能名称重置为"无"
                externalRate: 0,
                fixedExternal: 0,
                breakBambooRate: 0,
                fixedBreakBamboo: 0,
                externalElementRate: 0,
                buffName: lastRow.buffName,
                generalBonus: 0,
                criticalBonus: 0,
                externalPenetration: 0,
                extraCriticalRate: 0,
                times: lastRow.times,
                setLayer: lastRow.setLayer,
                talismanLayer: lastRow.talismanLayer,
                yishuiLayer: lastRow.yishuiLayer,
                suohenLayer: lastRow.suohenLayer,
                qijie: lastRow.qijie,
                naisan: lastRow.naisan,
                yishang: lastRow.yishang
            };
                } else {
            // 如果是第一行，使用默认配置
            // 根据当前选择的套装设置默认值
            let defaultSetLayer = "无";
            if (panelData.equipmentSet === "飞隼") {
                defaultSetLayer = "满层";
            } else if (panelData.equipmentSet === "岳山") {
                defaultSetLayer = "10%通用增伤";
            }
            
            newRotationItem = {
                name: "无",
                externalRate: 0,
                fixedExternal: 0,
                breakBambooRate: 0,
                fixedBreakBamboo: 0,
                externalElementRate: 0,
                buffName: "无",
                generalBonus: 0,
                criticalBonus: 0,
                externalPenetration: 0,
                extraCriticalRate: 0,
                times: 1,
                setLayer: defaultSetLayer,
                talismanLayer: '无帖',
                yishuiLayer: "0层",
                suohenLayer: "0层",
                qijie: "否",
                naisan: "否",
                yishang: "否"
            };
        }
        
        // 添加到排轴数据中
        rotationData.push(newRotationItem);
        
        // 更新排轴表格
        updateRotationTable();
    });
}

// 初始化技能倍率表
function initSkillRatesTable() {
    const tableBody = document.querySelector('#skill-rates-table tbody');
    
    // 清空表格内容
    tableBody.innerHTML = '';
    
    // 遍历技能倍率数据，添加到表格中
    skillRatesData.forEach(skill => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${skill.name}</td>
            <td>${(skill.externalRate * 100).toFixed(2)}%</td>
            <td>${skill.fixedExternal}</td>
            <td>${(skill.breakBambooRate * 100).toFixed(2)}%</td>
            <td>${skill.fixedBreakBamboo}</td>
            <td>${(skill.externalElementRate * 100).toFixed(2)}%</td>
            <td>${skill.hit}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// 初始化BUFF增伤表
function initBuffDataTable() {
    const tableBody = document.querySelector('#buff-data-table tbody');
    
    // 清空表格内容
    tableBody.innerHTML = '';
    
    // 遍历BUFF增伤数据，添加到表格中
    buffData.forEach(buff => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${buff.name}</td>
            <td>${buff.generalBonus}%</td>
            <td>${buff.criticalBonus}%</td>
            <td>${buff.externalPenetration}</td>
            <td>${buff.extraCriticalRate}%</td>
        `;
        
        tableBody.appendChild(row);
    });
}


// 初始化伤害统计表格
function initDamageStatsTable() {
    // 初始化表格数据
    updateDamageStatsTable();
    
    // 监听排轴数据变化
    const observer = new MutationObserver(() => {
        updateDamageStatsTable();
        // 同时更新排轴列表伤害列总和
        updateRotationDamageSumDisplay();
    });
    
    // 监听排轴表格的变化
    const rotationTable = document.getElementById('rotation-table');
    if (rotationTable) {
        observer.observe(rotationTable, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }
    
    // 添加排轴表格伤害列的实时监听
    setupRotationDamageColumnListener();
}

// 初始化伤害模式选择下拉框
function initDamageModeSelect() {
    const damageModeSelect = document.getElementById('damage-mode-select');
    if (!damageModeSelect) return;
    
    // 监听下拉框变化
    damageModeSelect.addEventListener('change', function(e) {
        const selectedMode = e.target.value;
        
        // 更新全局变量
        currentDamageMode = selectedMode;
        
        // 显示或隐藏自选模式配置区域
        const customConfig = document.getElementById('custom-mode-config');
        if (customConfig) {
            if (selectedMode === 'custom') {
                customConfig.classList.add('show');
            } else {
                customConfig.classList.remove('show');
            }
        }
        
        // 根据选择的模式设置T值
        if (selectedMode === 'none') {
            // "无"选项：保持默认状态，T值保持为60
            T = 60;
        } else if (selectedMode === 'yishui') {
            T = 60;
        } else if (selectedMode === 'duanshi') {
            // 断石模式：T值设为50
            T = 50;
        } else if (selectedMode === 'custom') {
            // 自选模式：使用用户自定义的T值
            const customTValue = document.getElementById('custom-t-value');
            T = customTValue ? parseFloat(customTValue.value) || 60 : 60;
        }
        
        // 更新伤害统计表格
        updateDamageStatsTable();
    });
    
    // 初始化自选模式配置按钮
    initCustomModeConfig();
    
    // 初始化极乐泣血计算模式选择
    initJileCalculationMode();
}

// 初始化极乐泣血计算模式选择
function initJileCalculationMode() {
    const jileManualToggle = document.getElementById('jile-manual-mode-toggle');
    if (!jileManualToggle) return;
    
    // 监听复选框变化
    jileManualToggle.addEventListener('change', function(e) {
        const isManual = e.target.checked;
        
        // 更新全局变量
        jileCalculationMode = isManual ? 'manual' : 'auto';
        
        // 更新排轴表格以反映模式变化
        updateRotationTable();
        
        // 显示模式切换提示
        showJileModeNotification(jileCalculationMode);
    });
}

// 显示极乐泣血模式切换通知
function showJileModeNotification(mode) {
    const notification = document.getElementById('page-notification');
    const message = document.querySelector('.notification-message');
    
    if (notification && message) {
        const modeText = mode === 'auto' ? '自动计算' : '手动输入';
        message.textContent = `极乐泣血模式已切换为：${modeText}`;
        notification.style.display = 'block';
        
        // 3秒后隐藏通知
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// 初始化自选模式配置
function initCustomModeConfig() {
    const applyBtn = document.getElementById('apply-custom-config');
    if (!applyBtn) return;
    
    applyBtn.addEventListener('click', function() {
        const customGraduationDamage = document.getElementById('custom-graduation-damage');
        const customTValue = document.getElementById('custom-t-value');
        
        if (!customGraduationDamage || !customTValue) return;
        
        // 获取用户输入的值
        const graduationDamage = parseFloat(customGraduationDamage.value) || 2000000;
        const tValue = parseFloat(customTValue.value) || 60;
        
        // 更新全局变量
        T = tValue;
        
        // 更新伤害统计表格
        updateDamageStatsTable();
        
        // 显示成功提示
        console.log(`自选模式配置已应用 - 毕业伤害: ${graduationDamage.toLocaleString()}, T值: ${tValue}`);
    });
}

// 设置排轴表格伤害列的实时监听
function setupRotationDamageColumnListener() {
    // 监听排轴表格中伤害列的变化
    const rotationTable = document.getElementById('rotation-table');
    if (!rotationTable) return;
    
    // 使用MutationObserver监听表格内容变化
    const damageObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        
        mutations.forEach((mutation) => {
            // 检查是否是伤害列（第5列）的内容变化
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const target = mutation.target;
                if (target.nodeType === Node.TEXT_NODE) {
                    const cell = target.parentElement;
                    if (cell && cell.cellIndex === 4) { // 第5列（索引4）
                        shouldUpdate = true;
                    }
                }
            }
        });
        
        if (shouldUpdate) {
            // 延迟更新，避免频繁计算
            setTimeout(() => {
                updateRotationDamageSumDisplay();
            }, 100);
        }
    });
    
    // 开始监听
    damageObserver.observe(rotationTable, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

// 更新伤害统计表格
function updateDamageStatsTable() {
    try {
        // 使用排轴列表伤害列总和
        const rotationDamageSum = calculateRotationDamageSum();
        
        // 根据当前模式决定显示哪个数值
        let expectedDamage, simulationDamage;
        
        if (isSimulationMode) {
            // 模拟模式：期望伤害保持不变，模拟伤害使用排轴列表总和
            // 获取当前期望伤害的值，保持不变
            const expectedElement = document.getElementById('expected-damage');
            expectedDamage = expectedElement ? parseFloat(expectedElement.textContent) || 0 : rotationDamageSum;
            simulationDamage = rotationDamageSum;
        } else {
            // 正常模式：期望伤害使用排轴列表总和，模拟伤害为0
            expectedDamage = rotationDamageSum;
            simulationDamage = 0;
        }
        
        // 更新表格显示
        updateDamageStatsDisplay(0, expectedDamage, simulationDamage, currentDamageMode);
        
    } catch (error) {
        console.error('更新伤害统计表格时发生错误:', error);
    }
}


// 计算期望总伤害（基于当前页面参数）
function calculateExpectedDamage() {
    if (!rotationData || rotationData.length === 0) {
        return 0;
    }
    
    let totalDamage = 0;
    
    rotationData.forEach(skill => {
        if (skill.name && skill.name !== '无') {
            const damageData = calculateDamage(skill);
            if (damageData && damageData.totalDamage) {
                totalDamage += parseFloat(damageData.totalDamage);
            }
        }
    });
    
    return totalDamage;
}

// 计算模拟总伤害（基于当前页面参数）
function calculateSimulationDamage() {
    if (!rotationData || rotationData.length === 0) {
        return 0;
    }
    
    let totalDamage = 0;
    
    // 使用模拟概率计算伤害
    if (globalSimulationProbabilities) {
        rotationData.forEach(skill => {
            if (skill.name && skill.name !== '无') {
                const damageData = calculateDamageWithSimulation(skill);
                if (damageData && damageData.totalDamage) {
                    totalDamage += parseFloat(damageData.totalDamage);
                }
            }
        });
    } else {
        // 如果没有模拟概率，使用期望伤害
        return calculateExpectedDamage();
    }
    
    return totalDamage;
}


// 使用模拟概率计算伤害
function calculateDamageWithSimulation(skill) {
    // 这里需要根据模拟概率重新计算伤害
    // 暂时返回基于当前参数的伤害
    return calculateDamage(skill);
}


// 计算排轴列表内伤害列的总和
function calculateRotationDamageSum() {
    let totalDamage = 0;
    
    // 获取排轴表格中所有伤害列的值
    const damageCells = document.querySelectorAll('#rotation-table tbody tr td:nth-child(5)');
    
    damageCells.forEach(cell => {
        const damageValue = parseFloat(cell.textContent) || 0;
        totalDamage += damageValue;
    });
    
    console.log('排轴列表伤害列总和:', totalDamage);
    return totalDamage;
}

// 禁用排轴列表中的所有参数
function disableRotationTableInputs() {
    const rotationTable = document.getElementById('rotation-table');
    if (!rotationTable) return;
    
    // 添加禁用状态的CSS类
    rotationTable.classList.add('rotation-table-disabled');
    
    // 禁用所有输入元素
    const inputs = rotationTable.querySelectorAll('input, select, button');
    inputs.forEach(input => {
        input.disabled = true;
        input.style.opacity = '0.6';
        input.style.cursor = 'not-allowed';
    });
    
    // 禁用添加行按钮
    const addRowBtn = document.getElementById('add-row-btn');
    if (addRowBtn) {
        addRowBtn.disabled = true;
        addRowBtn.style.opacity = '0.6';
        addRowBtn.style.cursor = 'not-allowed';
    }
    
    // 禁用排轴操作按钮
    const rotationButtons = ['clear-rotation-btn', 'save-rotation-btn', 'import-rotation-btn'];
    rotationButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        }
    });
    
    console.log('排轴列表参数已禁用');
}

// 启用排轴列表中的所有参数
function enableRotationTableInputs() {
    const rotationTable = document.getElementById('rotation-table');
    if (!rotationTable) return;
    
    // 移除禁用状态的CSS类
    rotationTable.classList.remove('rotation-table-disabled');
    
    // 启用所有输入元素
    const inputs = rotationTable.querySelectorAll('input, select, button');
    inputs.forEach(input => {
        input.disabled = false;
        input.style.opacity = '1';
        input.style.cursor = 'default';
    });
    
    // 启用添加行按钮
    const addRowBtn = document.getElementById('add-row-btn');
    if (addRowBtn) {
        addRowBtn.disabled = false;
        addRowBtn.style.opacity = '1';
        addRowBtn.style.cursor = 'pointer';
    }
    
    // 启用排轴操作按钮
    const rotationButtons = ['clear-rotation-btn', 'save-rotation-btn', 'import-rotation-btn'];
    rotationButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    });
    
    console.log('排轴列表参数已启用');
}

// 更新排轴列表伤害列总和显示
function updateRotationDamageSumDisplay() {
    const totalSum = calculateRotationDamageSum();
    
    // 更新伤害表格中的对应数值
    if (isSimulationMode) {
        // 模拟模式：只更新模拟伤害，期望伤害保持不变
        const simulationElement = document.getElementById('simulation-damage');
        if (simulationElement) {
            simulationElement.textContent = totalSum > 0 ? totalSum.toFixed(0) : '-';
        }
        console.log(`模拟模式：更新模拟伤害为 ${totalSum.toFixed(0)}`);
    } else {
        // 正常模式：更新期望伤害
        const expectedElement = document.getElementById('expected-damage');
        if (expectedElement) {
            expectedElement.textContent = totalSum > 0 ? totalSum.toFixed(0) : '-';
        }
        console.log(`正常模式：更新期望伤害为 ${totalSum.toFixed(0)}`);
    }
}

// 更新伤害统计表格显示
function updateDamageStatsDisplay(graduationDamage, expectedDamage, simulationDamage, mode = 'none') {
    // 根据模式设置毕业伤害
    let fixedGraduationDamage;
    if (mode === 'duanshi') {
        fixedGraduationDamage = 2000000;  // 断石模式：毕业伤害为2000000
    } else if (mode === 'custom') {
        // 自选模式：使用用户自定义的毕业伤害
        const customGraduationDamage = document.getElementById('custom-graduation-damage');
        fixedGraduationDamage = customGraduationDamage ? parseFloat(customGraduationDamage.value) || 2000000 : 2000000;
    } else {
        fixedGraduationDamage = 3017306; // 易水模式：毕业伤害为3017306
    }
    
    // 当选择"无"时，除了期望伤害和模拟伤害，其余单元格显示为"-"
    const isNoneMode = mode === 'none';
    
    // 更新毕业总伤害
    const graduationElement = document.getElementById('graduation-damage');
    if (graduationElement) {
        graduationElement.textContent = isNoneMode ? '-' : fixedGraduationDamage.toFixed(0);
    }
    
    // 更新期望总伤害
    const expectedElement = document.getElementById('expected-damage');
    if (expectedElement) {
        expectedElement.textContent = expectedDamage > 0 ? expectedDamage.toFixed(0) : '-';
    }
    
    // 更新模拟总伤害
    const simulationElement = document.getElementById('simulation-damage');
    if (simulationElement) {
        simulationElement.textContent = simulationDamage > 0 ? simulationDamage.toFixed(0) : '-';
    }
    
    // 计算并更新DPS
    // 毕业DPS = 3017306 / T
    const graduationDpsElement = document.getElementById('graduation-dps');
    if (graduationDpsElement) {
        graduationDpsElement.textContent = isNoneMode ? '-' : (fixedGraduationDamage / T).toFixed(2);
    }
    
    // 期望DPS = 期望伤害 / T
    const expectedDpsElement = document.getElementById('expected-dps');
    if (expectedDpsElement) {
        expectedDpsElement.textContent = isNoneMode ? '-' : (expectedDamage > 0 ? (expectedDamage / T).toFixed(2) : '-');
    }
    
    // 模拟DPS = 模拟伤害 / T
    const simulationDpsElement = document.getElementById('simulation-dps');
    if (simulationDpsElement) {
        simulationDpsElement.textContent = isNoneMode ? '-' : (simulationDamage > 0 ? (simulationDamage / T).toFixed(2) : '-');
    }
    
    // 计算并更新毕业率
    // 毕业率固定为100%
    const graduationRateElement = document.getElementById('graduation-rate');
    if (graduationRateElement) {
        graduationRateElement.textContent = isNoneMode ? '-' : '100.00%';
    }
    
    // 期望毕业率 = 期望伤害 / 3017306
    const expectedRateElement = document.getElementById('expected-rate');
    if (expectedRateElement) {
        if (isNoneMode) {
            expectedRateElement.textContent = '-';
        } else if (expectedDamage > 0) {
            const rate = (expectedDamage / fixedGraduationDamage * 100).toFixed(2);
            expectedRateElement.textContent = rate + '%';
        } else {
            expectedRateElement.textContent = '-';
        }
    }
    
    // 模拟毕业率 = 模拟伤害 / 3017306
    const simulationRateElement = document.getElementById('simulation-rate');
    if (simulationRateElement) {
        if (isNoneMode) {
            simulationRateElement.textContent = '-';
        } else if (simulationDamage > 0) {
            const rate = (simulationDamage / fixedGraduationDamage * 100).toFixed(2);
            simulationRateElement.textContent = rate + '%';
        } else {
            simulationRateElement.textContent = '-';
        }
    }
}

// 初始化实时图表更新功能（已禁用实时更新，改为保存按钮触发）
function initRealTimeChartUpdates() {
    // 注意：实时更新功能已被禁用
    // 现在只有保存按钮点击时才会更新排轴列表数据
    // 套装选择仍然保持实时更新，因为它需要立即更新下拉框选项
    
    console.log('实时更新功能已禁用，数据更新将在保存按钮点击时触发');
}

// 从输入框更新panelData数据
function updatePanelDataFromInputs() {
    try {
        // 获取输入框的值，添加错误处理
        try {
            panelData.externalAttack.min = parseFloat(document.getElementById('external-attack-min').value) || 0;
            panelData.externalAttack.max = parseFloat(document.getElementById('external-attack-max').value) || 0;
        } catch (e) { console.error('外功攻击输入框错误:', e); }
        
        try {
            panelData.ringMetalAttack.min = parseFloat(document.getElementById('ring-metal-attack-min').value) || 0;
            panelData.ringMetalAttack.max = parseFloat(document.getElementById('ring-metal-attack-max').value) || 0;
            panelData.breakRockAttack.min = parseFloat(document.getElementById('break-rock-attack-min').value) || 0;
            panelData.breakRockAttack.max = parseFloat(document.getElementById('break-rock-attack-max').value) || 0;
            panelData.pullSilkAttack.min = parseFloat(document.getElementById('pull-silk-attack-min').value) || 0;
            panelData.pullSilkAttack.max = parseFloat(document.getElementById('pull-silk-attack-max').value) || 0;
            panelData.breakBambooAttack.min = parseFloat(document.getElementById('break-bamboo-attack-min').value) || 0;
            panelData.breakBambooAttack.max = parseFloat(document.getElementById('break-bamboo-attack-max').value) || 0;
            
            panelData.precisionRate = parseFloat(document.getElementById('precision-rate').value.replace('%', '')) || 0;
            panelData.criticalRate = parseFloat(document.getElementById('critical-rate').value.replace('%', '')) || 0;
            panelData.intentRate = parseFloat(document.getElementById('intent-rate').value.replace('%', '')) || 0;
            panelData.directCriticalRate = parseFloat(document.getElementById('direct-critical-rate').value.replace('%', '')) || 0;
            panelData.directIntentRate = parseFloat(document.getElementById('direct-intent-rate').value.replace('%', '')) || 0;
            
            // 获取伤害加成值
            panelData.criticalDamageBonus = parseFloat(document.getElementById('critical-damage-bonus').value.replace('%', '')) || 0;
            panelData.intentDamageBonus = parseFloat(document.getElementById('intent-damage-bonus').value.replace('%', '')) || 0;
            panelData.externalDamageBonus = parseFloat(document.getElementById('external-damage-bonus').value.replace('%', '')) || 0;
            panelData.elementalDamageBonus = parseFloat(document.getElementById('elemental-damage-bonus').value.replace('%', '')) || 0;
            
            // 获取穿透值
            panelData.externalPenetration = parseFloat(document.getElementById('external-penetration').value) || 0;
            panelData.elementalPenetration = parseFloat(document.getElementById('elemental-penetration').value) || 0;
            
            // 获取装备增伤值
            panelData.ropeDartBonus = parseFloat(document.getElementById('rope-dart-bonus').value.replace('%', '')) || 0;
            panelData.dualBladesBonus = parseFloat(document.getElementById('dual-blades-bonus').value.replace('%', '')) || 0;
            panelData.allMartialBonus = parseFloat(document.getElementById('all-martial-bonus').value.replace('%', '')) || 0;
            panelData.bossUnitBonus = parseFloat(document.getElementById('boss-unit-bonus').value.replace('%', '')) || 0;
            panelData.lightStrikeBonus = parseFloat(document.getElementById('light-strike-bonus').value.replace('%', '')) || 0;
            panelData.mouseBonus = parseFloat(document.getElementById('mouse-bonus').value.replace('%', '')) || 0;
            
            // 获取其他增伤值
            // 优先从DIY页面读取装备选择，如果不存在则从基础面板读取
            const diyEquipmentSelect = document.getElementById('diy-equipment-select');
            const basicEquipmentSelect = document.getElementById('equipment-set');
            if (diyEquipmentSelect) {
                panelData.equipmentSet = diyEquipmentSelect.value || '无';
            } else if (basicEquipmentSelect) {
                panelData.equipmentSet = basicEquipmentSelect.value || '无';
            } else {
                panelData.equipmentSet = '无';
            }
            panelData.foodBuff = document.getElementById('food-buff').value || '无';
            panelData.talisman = document.getElementById('talisman').value || '无帖';
            panelData.craftingBonus = document.getElementById('crafting-bonus').value || '无';
            panelData.bossTalentBonus = parseFloat(document.getElementById('boss-talent-bonus').value.replace('%', '')) || 0;
            
            // 获取Boss防御值
            panelData.bossDefense = parseFloat(document.getElementById('boss-defense').value) || 350;
        } catch (e) { console.error('其他输入框错误:', e); }
        
        // 注意：山参肉丸子效果将在伤害计算时处理，不修改输入框值
        // 这样可以保持输入框的独立性，用户手动输入的值不会被自动修改
        
    } catch (error) {
        console.error('更新panelData时发生错误:', error);
    }
}

// 修复排轴数据中的BUFF数据同步问题
function fixRotationDataBuffSync() {
    console.log('开始修复排轴数据中的BUFF数据同步...');
    
    rotationData.forEach((skill, index) => {
        if (skill.buffName && skill.buffName !== '无') {
            // 查找对应的BUFF数据
            const buffInfo = buffData.find(buff => buff.name === skill.buffName);
            
            if (buffInfo) {
                // 检查BUFF数据是否一致
                const needsUpdate = (
                    skill.generalBonus !== buffInfo.generalBonus ||
                    skill.criticalBonus !== buffInfo.criticalBonus ||
                    skill.externalPenetration !== buffInfo.externalPenetration ||
                    skill.extraCriticalRate !== buffInfo.extraCriticalRate
                );
                
                if (needsUpdate) {
                    console.log(`修复技能 ${skill.name} 的BUFF数据:`, {
                        buffName: skill.buffName,
                        old: {
                            generalBonus: skill.generalBonus,
                            criticalBonus: skill.criticalBonus,
                            externalPenetration: skill.externalPenetration,
                            extraCriticalRate: skill.extraCriticalRate
                        },
                        new: {
                            generalBonus: buffInfo.generalBonus,
                            criticalBonus: buffInfo.criticalBonus,
                            externalPenetration: buffInfo.externalPenetration,
                            extraCriticalRate: buffInfo.extraCriticalRate
                        }
                    });
                    
                    // 更新BUFF数据
                    rotationData[index] = {
                        ...skill,
                        generalBonus: buffInfo.generalBonus,
                        criticalBonus: buffInfo.criticalBonus,
                        externalPenetration: buffInfo.externalPenetration,
                        extraCriticalRate: buffInfo.extraCriticalRate
                    };
                }
            } else {
                console.warn(`找不到BUFF数据: ${skill.buffName}`);
            }
        }
    });
    
    console.log('BUFF数据同步修复完成');
}

// 初始化保存排轴按钮
function initSaveRotationButton() {
    const saveButton = document.getElementById('save-rotation-btn');
    
    if (!saveButton) {
        console.error('找不到保存排轴按钮！');
        return;
    }
    
    saveButton.addEventListener('click', async () => {
        try {
            // 检查是否有排轴数据
            if (!rotationData || rotationData.length === 0) {
                showNotification('当前没有排轴数据可保存！', 'warning');
            return;
        }
        
        // 保存前修复BUFF数据同步问题
        fixRotationDataBuffSync();
        
            // 获取配置名称
            const configName = prompt('请输入配置名称：');
        if (!configName || configName.trim() === '') {
            showNotification('配置名称不能为空！', 'warning');
        return;
    }
    
            // 创建保存数据对象 - 只保存排轴数据，不保存面板数据
        const saveData = {
                name: configName.trim(),
                rotationData: [...rotationData] // 深拷贝排轴数据
                // 移除panelData，排轴配置不包含面板数据
                // 移除时间信息，不保存时间戳和修改时间
            };
            
            // 保存到localStorage
            let savedConfigs = JSON.parse(localStorage.getItem('rotationConfigs') || '[]');
            
            // 检查是否已存在同名配置，如果存在则覆盖
            const existingIndex = savedConfigs.findIndex(config => config.name === configName.trim());
            if (existingIndex >= 0) {
                // 存在同名配置，询问用户是否覆盖
                const confirmOverwrite = await showConfirmDialog(`配置名称"${configName.trim()}"已存在，是否覆盖现有配置？`, '覆盖配置');
                if (!confirmOverwrite) {
                    showNotification('保存已取消', 'warning');
                    return;
                }
                savedConfigs[existingIndex] = saveData;
                console.log(`覆盖了现有配置: ${configName.trim()}`);
            } else {
                // 检查配置数量限制（最多10个）
                if (savedConfigs.length >= 10) {
                    showNotification('配置数量已达上限（10个），无法保存新配置！请先删除其他配置或覆盖现有配置。', 'warning');
                    return;
                }
                savedConfigs.push(saveData);
                console.log(`创建了新配置: ${configName.trim()}`);
            }
            
            // 将更新后的配置数组保存到localStorage
            localStorage.setItem('rotationConfigs', JSON.stringify(savedConfigs));
            console.log('配置已保存到本地存储');
            
            // 更新配置下拉列表
            updateRotationConfigSelect();
            
            // 更新保存按钮显示
            updateSaveButtonDisplay();
            
            // 导出JSON文件
            const jsonString = JSON.stringify(saveData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${configName.trim()}_排轴配置.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // 根据操作类型显示不同的成功消息
            const operationType = existingIndex >= 0 ? '覆盖' : '保存';
            showNotification(`排轴配置${operationType}成功并已导出文件！`, 'success');
            
        } catch (error) {
            console.error('保存排轴配置时发生错误:', error);
            showNotification('保存失败: ' + error.message, 'error');
        }
    });
}

// 初始化导入排轴按钮
function initImportRotationButton() {
    const importButton = document.getElementById('import-rotation-btn');
    const fileInput = document.getElementById('rotation-file-input');
    
    if (!importButton || !fileInput) {
        console.error('找不到导入排轴按钮或文件输入元素！');
        return;
    }
    
    importButton.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                // 验证数据格式 - 兼容新旧格式
                if (!importData.name || !importData.rotationData) {
                    throw new Error('文件格式不正确，缺少必要的数据字段！');
                }
                
                // 兼容性处理：如果包含panelData，则移除它（新格式不保存面板数据）
                if (importData.panelData) {
                    console.log('检测到旧格式配置，移除面板数据以使用当前页面面板');
                    delete importData.panelData;
                }
                
                // 处理导入数据，移除版本号并更新时间戳
                if (importData.version) {
                    delete importData.version;
                }
                
                // 移除时间信息，不保存时间戳和修改时间
                
                // 检查是否已存在同名配置，如果存在则询问用户是否覆盖
                let savedConfigs = JSON.parse(localStorage.getItem('rotationConfigs') || '[]');
                const existingIndex = savedConfigs.findIndex(config => config.name === importData.name);
                
                if (existingIndex !== -1) {
                    // 存在同名配置，询问用户是否覆盖
                    const confirmOverwrite = await showConfirmDialog(`配置名称"${importData.name}"已存在，是否覆盖现有配置？`, '覆盖配置');
                    if (!confirmOverwrite) {
                        showNotification('导入已取消', 'warning');
                        return;
                    }
                    savedConfigs[existingIndex] = importData;
                    console.log(`覆盖了现有配置: ${importData.name}`);
                } else {
                    // 检查配置数量限制（最多10个）
                    if (savedConfigs.length >= 10) {
                        showNotification('配置数量已达上限（10个），无法导入新配置！请先删除其他配置或覆盖现有配置。', 'warning');
                        return;
                    }
                    savedConfigs.push(importData);
                    console.log(`导入了新配置: ${importData.name}`);
                }
                
                // 保存到localStorage
                localStorage.setItem('rotationConfigs', JSON.stringify(savedConfigs));
                
                // 更新配置下拉列表
                updateRotationConfigSelect();
                
                // 更新保存按钮显示
                updateSaveButtonDisplay();
                
                // 自动加载导入的排轴配置
                loadRotationConfig(importData);
                
                // 根据操作类型显示不同的成功消息
                const operationType = existingIndex !== -1 ? '覆盖' : '导入';
                showNotification(`排轴配置${operationType}成功并已自动加载！BUFF数据已自动修复。`, 'success');
                
        } catch (error) {
                console.error('导入排轴配置时发生错误:', error);
                showNotification('导入失败: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
        
        // 清空文件输入，允许重复选择同一文件
        event.target.value = '';
    });
}

// 初始化模拟计算按钮
function initSimulationButton() {
    const simulationBtn = document.getElementById('simulation-btn');
    
    if (!simulationBtn) {
        console.error('找不到模拟计算按钮！');
        return;
    }
    
    simulationBtn.addEventListener('click', () => {
        if (!isSimulationMode) {
            // 进入模拟计算模式
            enterSimulationMode();
        } else {
            // 退出模拟计算模式
            exitSimulationMode();
        }
    });
}

// 进入模拟计算模式
function enterSimulationMode() {
    console.log('进入模拟计算模式');
    
    // 显示加载指示器
    showSimulationLoadingIndicator();
    
    // 使用异步处理避免阻塞UI
    setTimeout(() => {
        try {
            // 保存原始数据（优化深拷贝）
            originalRotationData = [...rotationData.map(skill => ({...skill}))];
            
            // 先计算期望伤害总和（使用正常模式）
            isSimulationMode = false;
            
            // 计算期望伤害总和（优化：直接计算，不更新表格）
            expectedDamageTotal = calculateExpectedDamageTotal();
            console.log(`期望伤害总和: ${expectedDamageTotal}`);
            
            // 处理排轴列表
            processRotationForSimulation();
            
            // 处理概率模型
            processProbabilityModel();
            
            // 更新按钮状态
            const simulationBtn = document.getElementById('simulation-btn');
            simulationBtn.textContent = '期望计算';
            simulationBtn.classList.add('expectation-mode');
            isSimulationMode = true;
            
            // 禁用排轴列表中的所有参数
            disableRotationTableInputs();
            
            // 只更新一次表格
            updateRotationTable();
            
            // 更新排轴列表伤害列总和显示
            updateRotationDamageSumDisplay();
            
        } catch (error) {
            console.error('进入模拟计算模式时发生错误:', error);
            showNotification('进入模拟计算模式失败: ' + error.message, 'error');
        } finally {
            // 隐藏加载指示器
            hideSimulationLoadingIndicator();
        }
    }, 50); // 短暂延迟，让UI有时间显示加载状态
}

// 计算期望伤害总和（优化版本，不更新表格）
function calculateExpectedDamageTotal() {
    let totalDamage = 0;
    
    // 确保使用当前页面的面板数据进行伤害计算
    updatePanelDataFromInputs();
    
    // 计算极乐泣血的次数
    const tempRotationData = calculateJileQixueTimes([...rotationData]);
    
    // 直接计算每个技能的伤害，不更新DOM
    tempRotationData.forEach(skill => {
        if (skill.name && skill.name !== '无') {
            const damageData = calculateDamage(skill);
            if (damageData && damageData.totalDamage) {
                totalDamage += parseFloat(damageData.totalDamage);
            }
        }
    });
    
    return totalDamage;
}

// 显示模拟计算加载指示器
function showSimulationLoadingIndicator() {
    const simulationBtn = document.getElementById('simulation-btn');
    if (simulationBtn) {
        simulationBtn.textContent = '计算中...';
        simulationBtn.disabled = true;
        simulationBtn.style.opacity = '0.7';
    }
}

// 隐藏模拟计算加载指示器
function hideSimulationLoadingIndicator() {
    const simulationBtn = document.getElementById('simulation-btn');
    if (simulationBtn) {
        simulationBtn.disabled = false;
        simulationBtn.style.opacity = '1';
    }
}

// 退出模拟计算模式
function exitSimulationMode() {
    console.log('退出模拟计算模式');
    
    // 恢复原始数据（优化深拷贝）
    rotationData = [...originalRotationData.map(skill => ({...skill}))];
    
    // 恢复原始概率
    restoreOriginalProbabilities();
    
    // 更新按钮状态
    const simulationBtn = document.getElementById('simulation-btn');
    simulationBtn.textContent = '模拟计算';
    simulationBtn.classList.remove('expectation-mode');
    isSimulationMode = false;
    
    // 启用排轴列表中的所有参数
    enableRotationTableInputs();
    
    // 重新计算并更新表格
    updateRotationTable();
    
    // 更新排轴列表伤害列总和显示
    updateRotationDamageSumDisplay();
}

// 处理排轴列表（复制插入次数>=N的技能）
function processRotationForSimulation() {
    const newRotationData = [];
    
    for (let i = 0; i < rotationData.length; i++) {
        const skill = rotationData[i];
        const times = skill.times || 1;
        
        if (dotSkills.includes(skill.name) || skill.name === "极乐Dot" || skill.name === "年年Dot") {
            // Dot技能不进行分离，直接添加
            newRotationData.push(skill);
        } else if (times >= 1) {
            // 处理其他技能：复制插入N次
            const integerTimes = Math.floor(times);
            for (let j = 0; j < integerTimes; j++) {
                newRotationData.push({
                    ...skill,
                    times: 1
                });
            }
            
            // 如果有小数部分，添加一个带小数次数的技能
            const decimalPart = times - integerTimes;
            if (decimalPart > 0) {
                newRotationData.push({
                    ...skill,
                    times: decimalPart
                });
            }
        } else {
            // 次数小于1的技能直接添加
            newRotationData.push(skill);
        }
    }
    
    rotationData = newRotationData;
}

// 处理概率模型（为每行独立计算概率）
function processProbabilityModel() {
    // 设置全局模拟概率为null，让每行独立计算
    globalSimulationProbabilities = null;
    
    console.log('模拟计算：每行独立计算概率，使用实际面板属性');
}

// 计算实际概率（与期望值计算使用相同的逻辑）
function calculateActualProbabilities(skill) {
    // 获取面板数据
    const precisionRate = panelData.precisionRate / 100; // 精准率（转换为小数）
    
    // 计算额外会心率（从技能BUFF中获取）
    let extraCriticalRate = 0;
    if (skill.criticalBonus) {
        extraCriticalRate = skill.criticalBonus;
    }
    
    // 面板会心率=会心率+额外会心率（不超过80%）+直接会心率（可超出80%）（转换为小数）
    const baseCriticalRate = Math.min((panelData.criticalRate + extraCriticalRate) / 100, 0.8);
    const directCriticalRate = panelData.directCriticalRate / 100;
    const criticalRate = baseCriticalRate + directCriticalRate;   
    const intentRate = panelData.intentRate / 100;     // 会意率（转换为小数）
    
    let effectiveCriticalRate, effectiveIntentRate, grazeRate, whiteTextRate;
    
    // 检查是否为Dot技能（在任何模式下都只产生白字伤害）
    if (dotSkills.includes(skill.name)) {
        // Dot技能只产生白字伤害
        effectiveCriticalRate = 0;
        effectiveIntentRate = 0;
        grazeRate = 0;
        whiteTextRate = 1;
    } else {
        // 使用与期望值相同的概率计算逻辑
        if (criticalRate + intentRate < 1) {
            // 会心 + 会意 < 100% 时
            if (precisionRate >= 1) {
                // 精准率 = 100%
                effectiveCriticalRate = criticalRate;
                effectiveIntentRate = intentRate;
                grazeRate = 0;
            } else {
                // 精准率 < 100%
                effectiveCriticalRate = precisionRate * criticalRate;
                effectiveIntentRate = intentRate;
                grazeRate = (1 - precisionRate) * (1 - intentRate);
            }
        } else {
            // 会心 + 会意 ≥ 100% 时
            if (precisionRate >= 1) {
                // 精准率 = 100%
                effectiveCriticalRate = 1 - intentRate;
                effectiveIntentRate = intentRate;
                grazeRate = 0;
            } else {
                // 精准率 < 100%
                effectiveCriticalRate = precisionRate * (1 - intentRate);
                effectiveIntentRate = intentRate;
                grazeRate = (1 - precisionRate) * (1 - intentRate);
            }
        }
        
        // 计算白字率（既不触发会心/会意，也不触发擦伤的概率）
        whiteTextRate = 1 - effectiveCriticalRate - effectiveIntentRate - grazeRate;
    }
    
    return {
        effectiveCriticalRate,
        effectiveIntentRate,
        grazeRate,
        whiteTextRate
    };
}

// 为单行数据计算随机概率
function calculateRandomProbabilityForRow(skill) {
    // 使用实际概率计算，而不是硬编码值
    const actualProbabilities = calculateActualProbabilities(skill);
    
    // 创建概率权重数组
    const probabilityTypes = ['critical', 'intent', 'white', 'graze'];
    const weights = [
        actualProbabilities.effectiveCriticalRate,
        actualProbabilities.effectiveIntentRate,
        actualProbabilities.whiteTextRate,
        actualProbabilities.grazeRate
    ];
    
    // 随机抽取一个概率项
    const randomValue = Math.random();
    let cumulativeWeight = 0;
    let selectedType = 'critical';
    
    for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        if (randomValue <= cumulativeWeight) {
            selectedType = probabilityTypes[i];
            break;
        }
    }
    
    // 返回该行的模拟概率
    return {
        effectiveCriticalRate: selectedType === 'critical' ? 1 : 0,
        effectiveIntentRate: selectedType === 'intent' ? 1 : 0,
        whiteTextRate: selectedType === 'white' ? 1 : 0,
        grazeRate: selectedType === 'graze' ? 1 : 0
    };
}

// 恢复原始概率
function restoreOriginalProbabilities() {
    globalSimulationProbabilities = null;
}


// 初始化排轴配置管理功能
function initRotationConfigManagement() {
    // 初始化配置下拉列表
    updateRotationConfigSelect();
    
    // 初始化保存按钮显示
    updateSaveButtonDisplay();
    
    // 初始化下拉选择框的自动加载功能
    const configSelect = document.getElementById('saved-rotation-configs');
    if (configSelect) {
        configSelect.addEventListener('change', () => {
            const selectedName = configSelect.value;
            
            if (!selectedName) {
                return; // 没有选择任何配置
            }
            
            try {
                const savedConfigs = JSON.parse(localStorage.getItem('rotationConfigs') || '[]');
                const selectedConfig = savedConfigs.find(config => config.name === selectedName);
                
                if (!selectedConfig) {
                    showNotification('找不到选中的配置！', 'error');
                    return;
            }
            
                // 自动加载选中的排轴配置
                loadRotationConfig(selectedConfig);
            
        } catch (error) {
                console.error('加载配置时发生错误:', error);
                showNotification('加载失败: ' + error.message, 'error');
        }
    });
}

    // 初始化删除配置按钮
    const deleteButton = document.getElementById('delete-rotation-config-btn');
    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            const configSelect = document.getElementById('saved-rotation-configs');
            const selectedName = configSelect.value;
            
            if (!selectedName) {
                showNotification('请先选择一个配置！', 'warning');
        return;
    }
    
            try {
                const savedConfigs = JSON.parse(localStorage.getItem('rotationConfigs') || '[]');
                const selectedConfig = savedConfigs.find(config => config.name === selectedName);
                
                if (!selectedConfig) {
                    showNotification('找不到选中的配置！', 'error');
                    return;
                }
                
                const confirmDelete = await showConfirmDialog(`确定要删除配置"${selectedConfig.name}"吗？`, '删除配置');
                if (!confirmDelete) {
        return;
    }
    
                // 删除配置
                const filteredConfigs = savedConfigs.filter(config => config.name !== selectedName);
                localStorage.setItem('rotationConfigs', JSON.stringify(filteredConfigs));
                
                // 更新配置下拉列表
                updateRotationConfigSelect();
                
                // 更新保存按钮显示
                updateSaveButtonDisplay();
                
                showNotification('配置删除成功！', 'success');
                
            } catch (error) {
                console.error('删除配置时发生错误:', error);
                showNotification('删除失败: ' + error.message, 'error');
            }
        });
    }
}

// 加载排轴配置的通用函数
function loadRotationConfig(config) {
    try {
        // 只加载排轴数据，不加载面板数据
        rotationData = [...config.rotationData];
        
        // 加载后修复BUFF数据同步问题
        fixRotationDataBuffSync();
        
        // 不再加载面板数据，伤害计算将基于当前页面的面板数据
        // Object.assign(panelData, config.panelData); // 已移除
        
        // 更新界面 - 只更新排轴表格，不更新面板输入
        // updatePanelInputs(); // 已移除，不更新面板输入
        updateRotationTable();
        
        console.log(`配置"${config.name}"加载成功！排轴数据已加载，伤害计算将基于当前面板数据。`);
        
        } catch (error) {
        console.error('加载配置时发生错误:', error);
        showNotification('加载失败: ' + error.message, 'error');
    }
}

// 更新保存按钮显示（显示配置数量）
function updateSaveButtonDisplay() {
    const saveButton = document.getElementById('save-rotation-btn');
    if (!saveButton) return;
    
    try {
        // 获取已保存的配置列表
        let savedConfigs = JSON.parse(localStorage.getItem('rotationConfigs') || '[]');
        const validConfigs = savedConfigs.filter(config => config && config.name);
        const configCount = validConfigs.length;
        const maxConfigs = 10;
        const remainingSlots = maxConfigs - configCount;
        
        // 更新按钮文本
        if (remainingSlots > 0) {
            saveButton.textContent = `保存排轴 (${configCount}/${maxConfigs})`;
            saveButton.style.opacity = '1';
        } else {
            saveButton.textContent = `保存排轴 (已满)`;
            saveButton.style.opacity = '0.7';
        }
    } catch (error) {
        console.error('更新保存按钮显示时发生错误：', error);
    }
}

// 更新排轴配置下拉列表
function updateRotationConfigSelect() {
    const configSelect = document.getElementById('saved-rotation-configs');
    
    if (!configSelect) {
        console.error('找不到配置选择下拉框！');
        return;
    }
    
    try {
        // 获取已保存的配置列表
        let savedConfigs = JSON.parse(localStorage.getItem('rotationConfigs') || '[]');
        
        // 确保savedConfigs是数组
        if (!Array.isArray(savedConfigs)) {
            savedConfigs = [];
        }
        
        // 清空并重新填充下拉框
        const validConfigs = savedConfigs.filter(config => config && config.name);
        const configCount = validConfigs.length;
        const maxConfigs = 10;
        
        configSelect.innerHTML = `<option value="">选择已保存的排轴配置 (${configCount}/${maxConfigs})</option>`;
        
        // 过滤掉无效配置，按配置名称排序
        validConfigs
            .sort((a, b) => a.name.localeCompare(b.name)) // 按配置名称排序
            .forEach(config => {
                const option = document.createElement('option');
                option.value = config.name;
                // 只显示配置名称，不显示时间信息
                option.textContent = config.name;
                configSelect.appendChild(option);
            });
    } catch (error) {
        console.error('更新排轴配置列表时发生错误：', error);
        // 发生错误时清空下拉框，避免显示错误数据
        configSelect.innerHTML = '<option value="">选择已保存的排轴配置</option>';
    }
}

// 计算单个技能的伤害数据
function calculateDamage(skill) {
    if (!skill || !skill.name || skill.name === '无') {
        return {
            totalDamage: 0,
            externalDamage: 0,
            breakBambooDamage: 0,
            externalElementDamage: 0,
            externalCriticalDamage: 0,
            externalIntentDamage: 0,
            externalWhiteTextDamage: 0,
            externalGrazeDamage: 0,
            breakBambooCriticalDamage: 0,
            breakBambooIntentDamage: 0,
            breakBambooWhiteTextDamage: 0,
            breakBambooGrazeDamage: 0,
            externalElementCriticalDamage: 0,
            externalElementIntentDamage: 0,
            externalElementWhiteTextDamage: 0,
            externalElementGrazeDamage: 0
        };
    }

    // 获取技能倍率数据
    const skillData = skillRatesData.find(s => s.name === skill.name);
    if (!skillData) {
        return {
            totalDamage: 0,
            externalDamage: 0,
            breakBambooDamage: 0,
            externalElementDamage: 0,
            externalCriticalDamage: 0,
            externalIntentDamage: 0,
            externalWhiteTextDamage: 0,
            externalGrazeDamage: 0,
            breakBambooCriticalDamage: 0,
            breakBambooIntentDamage: 0,
            breakBambooWhiteTextDamage: 0,
            breakBambooGrazeDamage: 0,
            externalElementCriticalDamage: 0,
            externalElementIntentDamage: 0,
            externalElementWhiteTextDamage: 0,
            externalElementGrazeDamage: 0
        };
    }

    // 获取BUFF数据
    const buffInfo = buffData.find(b => b.name === (skill.buffName || '无'));
    let generalBonus = buffInfo ? buffInfo.generalBonus : 0;
    let criticalBonus = buffInfo ? buffInfo.criticalBonus : 0;
    const externalPenetration = buffInfo ? buffInfo.externalPenetration : 0;
    const extraCriticalRate = buffInfo ? buffInfo.extraCriticalRate : 0;

    // 应用各种增伤效果（简化版本，只包含主要逻辑）
    // 绳镖武学增伤
    if (skill.name === "鼠鼠生威" || skill.name === "牵绳引刃") {
        generalBonus += panelData.ropeDartBonus;
    }
    
    // 鼠鼠生威技能额外80%通用增伤
    if (skill.name === "鼠鼠生威") {
        generalBonus += 80;
    }
    
    // 双刀武学增伤
    const dualBladesSkills = ["白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5", "痴障"];
    if (dualBladesSkills.includes(skill.name)) {
        generalBonus += panelData.dualBladesBonus;
    }
    
    // 全武学增伤
    const allMartialSkills = ["鼠鼠生威", "牵绳引刃", "白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5", "痴障"];
    if (allMartialSkills.includes(skill.name)) {
        generalBonus += panelData.allMartialBonus;
    }
    
    // 红刀A1-A5属攻穿透+10：仅适用于红刀A1-A5技能
    const redBladeSkills = ["红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5"];
    const redBladeElementalPenetration = redBladeSkills.includes(skill.name) ? 10 : 0;
    
    // 首领单位增伤
    generalBonus += panelData.bossUnitBonus;

    // 计算基础攻击值
    const externalAttack = (panelData.externalAttack.min + panelData.externalAttack.max) / 2;
    const breakBambooAttack = (panelData.breakBambooAttack.min + panelData.breakBambooAttack.max) / 2;
    // 外属攻击 = 鸣金攻击 + 裂石攻击 + 牵丝攻击
    const ringMetalAttack = (panelData.ringMetalAttack.min + panelData.ringMetalAttack.max) / 2;
    const breakRockAttack = (panelData.breakRockAttack.min + panelData.breakRockAttack.max) / 2;
    const pullSilkAttack = (panelData.pullSilkAttack.min + panelData.pullSilkAttack.max) / 2;
    const externalElementAttack = ringMetalAttack + breakRockAttack + pullSilkAttack;

    // 计算基础伤害
    const baseExternalDamage = (externalAttack - panelData.bossDefense) * skillData.externalRate + skillData.fixedExternal;
    const baseBreakBambooDamage = breakBambooAttack * skillData.breakBambooRate + skillData.fixedBreakBamboo;
    const baseExternalElementDamage = externalElementAttack * skillData.externalElementRate;

    // 计算增伤系数
    const generalMultiplier = 1 + generalBonus / 100;
    const criticalMultiplier = 1 + criticalBonus / 100;
    const externalPenetrationMultiplier = 1 + externalPenetration / 200;
    const elementalPenetrationMultiplier = 1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200;

    // 计算最终伤害
    const externalDamage = baseExternalDamage * generalMultiplier * externalPenetrationMultiplier;
    const breakBambooDamage = baseBreakBambooDamage * generalMultiplier * elementalPenetrationMultiplier * 1.5;
    const externalElementDamage = baseExternalElementDamage * generalMultiplier * elementalPenetrationMultiplier;

    // 计算总伤害
    const totalDamage = externalDamage + breakBambooDamage + externalElementDamage;

    // 计算各种类型的伤害（简化版本）
    const criticalRate = Math.min((panelData.criticalRate + extraCriticalRate) / 100, 0.8) + panelData.directCriticalRate / 100;
    const intentRate = panelData.intentRate / 100;
    const precisionRate = panelData.precisionRate / 100;

    // 计算有效概率
        let effectiveCriticalRate, effectiveIntentRate, grazeRate, whiteTextRate;
        
        if (criticalRate + intentRate < 1) {
            if (precisionRate >= 1) {
                effectiveCriticalRate = criticalRate;
                effectiveIntentRate = intentRate;
                grazeRate = 0;
            } else {
                effectiveCriticalRate = precisionRate * criticalRate;
                effectiveIntentRate = intentRate;
                grazeRate = (1 - precisionRate) * (1 - intentRate);
            }
        } else {
            if (precisionRate >= 1) {
                effectiveCriticalRate = 1 - intentRate;
                effectiveIntentRate = intentRate;
                grazeRate = 0;
            } else {
                effectiveCriticalRate = precisionRate * (1 - intentRate);
                effectiveIntentRate = intentRate;
                grazeRate = (1 - precisionRate) * (1 - intentRate);
            }
        }
        
        whiteTextRate = 1 - effectiveCriticalRate - effectiveIntentRate - grazeRate;
        
    // 计算各类型伤害
    const externalCriticalDamage = externalDamage * effectiveCriticalRate * criticalMultiplier;
    const externalIntentDamage = externalDamage * effectiveIntentRate * criticalMultiplier;
    const externalWhiteTextDamage = externalDamage * whiteTextRate;
    const externalGrazeDamage = externalDamage * grazeRate;

    const breakBambooCriticalDamage = breakBambooDamage * effectiveCriticalRate * criticalMultiplier;
    const breakBambooIntentDamage = breakBambooDamage * effectiveIntentRate * criticalMultiplier;
    const breakBambooWhiteTextDamage = breakBambooDamage * whiteTextRate;
    const breakBambooGrazeDamage = breakBambooDamage * grazeRate;

    const externalElementCriticalDamage = externalElementDamage * effectiveCriticalRate * criticalMultiplier;
    const externalElementIntentDamage = externalElementDamage * effectiveIntentRate * criticalMultiplier;
    const externalElementWhiteTextDamage = externalElementDamage * whiteTextRate;
    const externalElementGrazeDamage = externalElementDamage * grazeRate;
    
    return {
        totalDamage: totalDamage,
        externalDamage: externalDamage,
        breakBambooDamage: breakBambooDamage,
        externalElementDamage: externalElementDamage,
        externalCriticalDamage: externalCriticalDamage,
        externalIntentDamage: externalIntentDamage,
        externalWhiteTextDamage: externalWhiteTextDamage,
        externalGrazeDamage: externalGrazeDamage,
        breakBambooCriticalDamage: breakBambooCriticalDamage,
        breakBambooIntentDamage: breakBambooIntentDamage,
        breakBambooWhiteTextDamage: breakBambooWhiteTextDamage,
        breakBambooGrazeDamage: breakBambooGrazeDamage,
        externalElementCriticalDamage: externalElementCriticalDamage,
        externalElementIntentDamage: externalElementIntentDamage,
        externalElementWhiteTextDamage: externalElementWhiteTextDamage,
        externalElementGrazeDamage: externalElementGrazeDamage
    };
}

// 图表相关变量
let damageTypeChart = null;
let critTypeChart = null;
let skillDamageChart = null;
let statusDamageChart = null;

// 图表颜色配置
const chartColors = {
    damageType: {
        external: '#3B82F6',      // 外功伤害 - 蓝色
        breakBamboo: '#EF4444',   // 破竹伤害 - 红色
        externalElement: '#10B981' // 外属伤害 - 绿色
    },
    critType: {
        critical: '#F59E0B',      // 会心伤害 - 橙色
        intent: '#8B5CF6',        // 会意伤害 - 紫色
        whiteText: '#6B7280',     // 白字伤害 - 灰色
        graze: '#F97316'          // 擦伤伤害 - 深橙色
    },
    skillDamage: [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
        '#F43F5E', '#06B6D4', '#8B5CF6', '#F59E0B', '#10B981',
        '#F97316', '#EC4899', '#14B8A6', '#F59E0B', '#8B5CF6',
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
        '#F43F5E', '#06B6D4', '#8B5CF6', '#F59E0B', '#10B981',
        '#F97316', '#EC4899', '#14B8A6', '#F59E0B', '#8B5CF6'
    ],
    statusDamage: {
        chenyan: '#DC2626',      // 嗔焰状态 - 深红色
        normal: '#6B7280'        // 普通状态 - 灰色
    }
};

// 初始化图表
function initCharts() {
    initDamageTypeChart();
    initCritTypeChart();
    initSkillDamageChart();
    initStatusDamageChart();
}

// 延迟初始化图表（仅在需要时）
function initChartsIfNeeded() {
    // 检查图表是否已经初始化
    if (!damageTypeChart || !critTypeChart || !skillDamageChart || !statusDamageChart) {
        console.log('初始化图表...');
        initCharts();
        // 初始化后立即更新图表数据
        setTimeout(() => {
            updateAllCharts();
        }, 50);
    } else {
        // 如果图表已存在，直接更新数据
        updateAllCharts();
    }
}

// 图表1：伤害类型分布
function initDamageTypeChart() {
    const ctx = document.getElementById('damageTypeChart');
    if (!ctx) return;

    damageTypeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['外功伤害', '破竹伤害', '外属伤害'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    chartColors.damageType.external,
                    chartColors.damageType.breakBamboo,
                    chartColors.damageType.externalElement
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value.toFixed(1)}%`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// 图表2：会心类型分布
function initCritTypeChart() {
    const ctx = document.getElementById('critTypeChart');
    if (!ctx) return;

    critTypeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['会心伤害', '会意伤害', '白字伤害', '擦伤伤害'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: [
                    chartColors.critType.critical,
                    chartColors.critType.intent,
                    chartColors.critType.whiteText,
                    chartColors.critType.graze
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value.toFixed(1)}%`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// 图表3：技能伤害分布 - 动态水平条形图
function initSkillDamageChart() {
    const ctx = document.getElementById('skillDamageChart');
    if (!ctx) return;

    skillDamageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '伤害占比',
                data: [],
                backgroundColor: chartColors.skillDamage,
                borderColor: '#ffffff',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y', // 水平条形图
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#ffffff',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        title: function(context) {
                            return context[0].label || '技能信息';
                        },
                        label: function(context) {
                            const label = context.label || '';
                            // 对于水平条形图，从数据集中获取正确的百分比值
                            const dataset = context.dataset;
                            const dataIndex = context.dataIndex;
                            const value = parseFloat(dataset.data[dataIndex]) || 0;
                            const actualDamage = getSkillActualDamage(label);
                            
                            return [
                                `技能: ${label}`,
                                `占比: ${value.toFixed(2)}%`,
                                `伤害: ${actualDamage}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        color: '#6B7280',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#374151',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            animation: false,
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 图表4：状态伤害分布 - 双柱状图
function initStatusDamageChart() {
    const ctx = document.getElementById('statusDamageChart');
    if (!ctx) return;

    statusDamageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['嗔焰状态', '普通状态'],
            datasets: [{
                label: '伤害占比',
                data: [0, 0],
                backgroundColor: [
                    chartColors.statusDamage.chenyan,
                    chartColors.statusDamage.normal
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#ffffff',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        title: function(context) {
                            return context[0].label || '状态信息';
                        },
                        label: function(context) {
                            const label = context.label || '';
                            const dataset = context.dataset;
                            const dataIndex = context.dataIndex;
                            const value = parseFloat(dataset.data[dataIndex]) || 0;
                            const actualDamage = getStatusActualDamage(label);
                            return [
                                `状态: ${label}`,
                                `占比: ${value.toFixed(2)}%`,
                                `伤害: ${actualDamage}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#374151',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        color: '#6B7280',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    }
                }
            },
            animation: false,
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 获取状态实际伤害的辅助函数
function getStatusActualDamage(statusName) {
    try {
        // 从排轴表格中读取数据
        const tableRows = document.querySelectorAll('#rotation-table tbody tr');
        if (tableRows.length === 0) return '0.00';
        
        // 定义嗔焰状态的BUFF名称
        const chenyanBuffs = [
            '嗔焰轮回',
            '嗔焰轮回崩解',
            '嗔焰轮回阴阳',
            '嗔焰轮回笛子',
            '嗔焰轮回崩解阴阳',
            '嗔焰轮回崩解笛子',
            '嗔焰轮回阴阳笛子',
            '嗔焰轮回崩解阴阳笛子'
        ];
        
        let chenyanDamage = 0;
        let normalDamage = 0;

        tableRows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                const skillDamage = parseFloat(cells[4].textContent) || 0;
                
                const buffSelect = cells[2].querySelector('select');
                const buffName = buffSelect ? buffSelect.value : '无';
                
                if (chenyanBuffs.includes(buffName)) {
                    chenyanDamage += skillDamage;
                } else {
                    normalDamage += skillDamage;
                }
            }
        });

        let damage = 0;
        if (statusName === '嗔焰状态') {
            damage = chenyanDamage;
        } else if (statusName === '普通状态') {
            damage = normalDamage;
        }
        
        const numericDamage = parseFloat(damage) || 0;
        console.log(`状态 ${statusName} 的伤害: ${numericDamage}`);
        return numericDamage.toFixed(2);
    } catch (error) {
        console.error('获取状态伤害时出错:', error);
        return '0.00';
    }
}

// 更新状态伤害分布图表
function updateStatusDamageChart() {
    if (!statusDamageChart) return;
    
    // 如果没有排轴数据，显示默认状态
    if (!rotationData || rotationData.length === 0) {
        statusDamageChart.data.labels = ['嗔焰状态', '普通状态'];
        statusDamageChart.data.datasets[0].data = [0, 0];
        statusDamageChart.data.datasets[0].backgroundColor = [
            chartColors.statusDamage.chenyan,
            chartColors.statusDamage.normal
        ];
        statusDamageChart.update('none');
        updateStatusDamageLegend(0, 0);
        return;
    }
    
    // 定义嗔焰状态的BUFF名称
    const chenyanBuffs = [
        '嗔焰轮回',
        '嗔焰轮回崩解',
        '嗔焰轮回阴阳',
        '嗔焰轮回笛子',
        '嗔焰轮回崩解阴阳',
        '嗔焰轮回崩解笛子',
        '嗔焰轮回阴阳笛子',
        '嗔焰轮回崩解阴阳笛子'
    ];
    
    let chenyanDamage = 0;
    let normalDamage = 0;
    let totalDamage = 0;

    // 直接从排轴表格中读取已计算好的数值
    const tableRows = document.querySelectorAll('#rotation-table tbody tr');
    tableRows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) { // 确保行有足够的列
            // 从第5列（索引4）读取总伤害
            const skillDamage = parseFloat(cells[4].textContent) || 0;
            totalDamage += skillDamage;
            
            // 从第3列（索引2）的BUFF选择框中获取BUFF名称
            const buffSelect = cells[2].querySelector('select');
            const buffName = buffSelect ? buffSelect.value : '无';
            
            // 根据BUFF名称分类伤害
            if (chenyanBuffs.includes(buffName)) {
                chenyanDamage += skillDamage;
            } else {
                normalDamage += skillDamage;
            }
        }
    });

    // 如果没有有效伤害数据，显示默认状态
    if (totalDamage <= 0) {
        statusDamageChart.data.labels = ['嗔焰状态', '普通状态'];
        statusDamageChart.data.datasets[0].data = [0, 0];
        statusDamageChart.data.datasets[0].backgroundColor = [
            chartColors.statusDamage.chenyan,
            chartColors.statusDamage.normal
        ];
        statusDamageChart.update('none');
        updateStatusDamageLegend(0, 0);
        return;
    }

    // 计算百分比
    const chenyanPercentage = (chenyanDamage / totalDamage) * 100;
    const normalPercentage = (normalDamage / totalDamage) * 100;

    // 更新图表数据 - 双柱状图格式
    statusDamageChart.data.labels = ['嗔焰状态', '普通状态'];
    statusDamageChart.data.datasets[0].data = [chenyanPercentage, normalPercentage];
    statusDamageChart.data.datasets[0].backgroundColor = [
        chartColors.statusDamage.chenyan,
        chartColors.statusDamage.normal
    ];

    statusDamageChart.update('none');
    updateStatusDamageLegend(chenyanDamage, normalDamage);
}

// 更新状态伤害图例
function updateStatusDamageLegend(chenyanDamage = 0, normalDamage = 0) {
    const legendContainer = document.getElementById('statusDamageLegend');
    if (!legendContainer) return;

    const totalDamage = chenyanDamage + normalDamage;
    
    if (totalDamage <= 0) {
        legendContainer.innerHTML = '<div class="legend-item">暂无数据</div>';
        return;
    }

    const chenyanPercentage = (chenyanDamage / totalDamage * 100).toFixed(2);
    const normalPercentage = (normalDamage / totalDamage * 100).toFixed(2);

    let legendHTML = '';
    
    if (chenyanDamage > 0) {
        legendHTML += `
            <div class="legend-item">
                <span class="legend-color" style="background-color: ${chartColors.statusDamage.chenyan}"></span>
                <span class="legend-label">嗔焰状态: ${chenyanPercentage}% (${chenyanDamage.toFixed(2)})</span>
            </div>
        `;
    }
    
    if (normalDamage > 0) {
        legendHTML += `
            <div class="legend-item">
                <span class="legend-color" style="background-color: ${chartColors.statusDamage.normal}"></span>
                <span class="legend-label">普通状态: ${normalPercentage}% (${normalDamage.toFixed(2)})</span>
            </div>
        `;
    }

    legendContainer.innerHTML = legendHTML;
}

// 更新所有图表
function updateAllCharts() {
    updateDamageTypeChart();
    updateCritTypeChart();
    updateSkillDamageChart();
    updateStatusDamageChart();
}

// 更新伤害类型图表
function updateDamageTypeChart() {
    if (!damageTypeChart) return;
    
    // 如果没有排轴数据，显示默认状态
    if (!rotationData || rotationData.length === 0) {
        damageTypeChart.data.datasets[0].data = [0, 0, 0];
        damageTypeChart.update();
        updateDamageTypeLegend(0, 0, 0);
        return;
    }
    
    let totalExternalDamage = 0;
    let totalBreakBambooDamage = 0;
    let totalExternalElementDamage = 0;

    // 直接从排轴表格中读取已计算好的数值
    const tableRows = document.querySelectorAll('#rotation-table tbody tr');
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 24) { // 确保行有足够的列
            // 外功伤害 = 外功会心 + 外功会意 + 外功白字 + 外功擦伤
            const externalCritical = parseFloat(cells[12].textContent) || 0;   // 外功会心
            const externalIntent = parseFloat(cells[13].textContent) || 0;     // 外功会意
            const externalWhiteText = parseFloat(cells[14].textContent) || 0;  // 外功白字
            const externalGraze = parseFloat(cells[15].textContent) || 0;      // 外功擦伤
            totalExternalDamage += externalCritical + externalIntent + externalWhiteText + externalGraze;
            
            // 破竹伤害 = 破竹会心 + 破竹会意 + 破竹白字 + 破竹擦伤
            const breakBambooCritical = parseFloat(cells[16].textContent) || 0;   // 破竹会心
            const breakBambooIntent = parseFloat(cells[17].textContent) || 0;     // 破竹会意
            const breakBambooWhiteText = parseFloat(cells[18].textContent) || 0;  // 破竹白字
            const breakBambooGraze = parseFloat(cells[19].textContent) || 0;      // 破竹擦伤
            totalBreakBambooDamage += breakBambooCritical + breakBambooIntent + breakBambooWhiteText + breakBambooGraze;
            
            // 外属伤害 = 外属会心 + 外属会意 + 外属白字 + 外属擦伤
            const externalElementCritical = parseFloat(cells[20].textContent) || 0;   // 外属会心
            const externalElementIntent = parseFloat(cells[21].textContent) || 0;     // 外属会意
            const externalElementWhiteText = parseFloat(cells[22].textContent) || 0;  // 外属白字
            const externalElementGraze = parseFloat(cells[23].textContent) || 0;      // 外属擦伤
            totalExternalElementDamage += externalElementCritical + externalElementIntent + externalElementWhiteText + externalElementGraze;
        }
    });

    const totalDamage = totalExternalDamage + totalBreakBambooDamage + totalExternalElementDamage;
    
    if (totalDamage === 0) {
        damageTypeChart.data.datasets[0].data = [0, 0, 0];
    } else {
        damageTypeChart.data.datasets[0].data = [
            (totalExternalDamage / totalDamage * 100),
            (totalBreakBambooDamage / totalDamage * 100),
            (totalExternalElementDamage / totalDamage * 100)
        ];
    }

    damageTypeChart.update();
    updateDamageTypeLegend(totalExternalDamage, totalBreakBambooDamage, totalExternalElementDamage);
}

// 更新会心类型图表
function updateCritTypeChart() {
    if (!critTypeChart) return;
    
    // 如果没有排轴数据，显示默认状态
    if (!rotationData || rotationData.length === 0) {
        critTypeChart.data.datasets[0].data = [0, 0, 0, 0];
        critTypeChart.update();
        updateCritTypeLegend(0, 0, 0, 0);
        return;
    }
    
    let totalCriticalDamage = 0;
    let totalIntentDamage = 0;
    let totalWhiteTextDamage = 0;
    let totalGrazeDamage = 0;

    // 直接从排轴表格中读取已计算好的数值
    const tableRows = document.querySelectorAll('#rotation-table tbody tr');
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 24) { // 确保行有足够的列
            // 会心伤害 = 外功会心 + 破竹会心 + 外属会心
            const externalCritical = parseFloat(cells[12].textContent) || 0;   // 外功会心
            const breakBambooCritical = parseFloat(cells[16].textContent) || 0;   // 破竹会心
            const externalElementCritical = parseFloat(cells[20].textContent) || 0;   // 外属会心
            totalCriticalDamage += externalCritical + breakBambooCritical + externalElementCritical;
            
            // 会意伤害 = 外功会意 + 破竹会意 + 外属会意
            const externalIntent = parseFloat(cells[13].textContent) || 0;     // 外功会意
            const breakBambooIntent = parseFloat(cells[17].textContent) || 0;     // 破竹会意
            const externalElementIntent = parseFloat(cells[21].textContent) || 0;     // 外属会意
            totalIntentDamage += externalIntent + breakBambooIntent + externalElementIntent;
            
            // 白字伤害 = 外功白字 + 破竹白字 + 外属白字
            const externalWhiteText = parseFloat(cells[14].textContent) || 0;  // 外功白字
            const breakBambooWhiteText = parseFloat(cells[18].textContent) || 0;  // 破竹白字
            const externalElementWhiteText = parseFloat(cells[22].textContent) || 0;  // 外属白字
            totalWhiteTextDamage += externalWhiteText + breakBambooWhiteText + externalElementWhiteText;
            
            // 擦伤伤害 = 外功擦伤 + 破竹擦伤 + 外属擦伤
            const externalGraze = parseFloat(cells[15].textContent) || 0;      // 外功擦伤
            const breakBambooGraze = parseFloat(cells[19].textContent) || 0;      // 破竹擦伤
            const externalElementGraze = parseFloat(cells[23].textContent) || 0;      // 外属擦伤
            totalGrazeDamage += externalGraze + breakBambooGraze + externalElementGraze;
        }
    });

    const totalDamage = totalCriticalDamage + totalIntentDamage + totalWhiteTextDamage + totalGrazeDamage;
    
    if (totalDamage === 0) {
        critTypeChart.data.datasets[0].data = [0, 0, 0, 0];
    } else {
        critTypeChart.data.datasets[0].data = [
            (totalCriticalDamage / totalDamage * 100),
            (totalIntentDamage / totalDamage * 100),
            (totalWhiteTextDamage / totalDamage * 100),
            (totalGrazeDamage / totalDamage * 100)
        ];
    }

    critTypeChart.update();
    updateCritTypeLegend(totalCriticalDamage, totalIntentDamage, totalWhiteTextDamage, totalGrazeDamage);
}

// 获取技能实际伤害的辅助函数
function getSkillActualDamage(skillName) {
    try {
        // 从排轴表格中读取数据
        const tableRows = document.querySelectorAll('#rotation-table tbody tr');
        if (tableRows.length === 0) return '0.00';
        
        const skillDamageMap = new Map();

        // 技能名称合并映射函数
        function mergeSkillName(originalSkillName) {
            if (originalSkillName.match(/^红刀A[1-5]/) || originalSkillName === '红刀A2(1/2)' || originalSkillName === '红刀A4(5/7)') {
                return '红刀';
            }
            if (originalSkillName.match(/^白刀A[1-4]/)) {
                return '白刀';
            }
            return originalSkillName;
        }

        tableRows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                const skillDamage = parseFloat(cells[4].textContent) || 0;
                
                const skillSelect = cells[1].querySelector('select');
                const originalSkillName = skillSelect ? skillSelect.value : '未知技能';
                const mergedSkillName = mergeSkillName(originalSkillName);
                
                if (skillDamageMap.has(mergedSkillName)) {
                    skillDamageMap.set(mergedSkillName, skillDamageMap.get(mergedSkillName) + skillDamage);
                } else {
                    skillDamageMap.set(mergedSkillName, skillDamage);
                }
            }
        });

        const damage = skillDamageMap.get(skillName) || 0;
        const numericDamage = parseFloat(damage) || 0;
        console.log(`技能 ${skillName} 的伤害: ${numericDamage}`); // 调试信息
        return numericDamage.toFixed(2);
    } catch (error) {
        console.error('获取技能伤害时出错:', error);
        return '0.00';
    }
}

// 更新技能伤害图表 - 动态水平条形图版本
function updateSkillDamageChart() {
    if (!skillDamageChart) return;
    
    // 如果没有排轴数据，显示默认状态
    if (!rotationData || rotationData.length === 0) {
        skillDamageChart.data.labels = ['暂无数据'];
        skillDamageChart.data.datasets[0].data = [100];
        skillDamageChart.data.datasets[0].backgroundColor = ['#E5E7EB'];
        skillDamageChart.update('none'); // 无动画更新
        updateSkillDamageLegend([]);
        return;
    }
                
    const skillDamageMap = new Map();
    let totalDamage = 0;

    // 技能名称合并映射函数
    function mergeSkillName(skillName) {
        // 红刀A1-A5合并为"红刀"
        if (skillName.match(/^红刀A[1-5]/) || skillName === '红刀A2(1/2)' || skillName === '红刀A4(5/7)') {
            return '红刀';
        }
        // 白刀A1-A4合并为"白刀"
        if (skillName.match(/^白刀A[1-4]/)) {
            return '白刀';
        }
        // 其他技能保持原名
        return skillName;
    }

    // 直接从排轴表格中读取已计算好的数值
    const tableRows = document.querySelectorAll('#rotation-table tbody tr');
    tableRows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) { // 确保行有足够的列
            // 从第5列（索引4）读取总伤害
            const skillDamage = parseFloat(cells[4].textContent) || 0;
            totalDamage += skillDamage;
            
            // 从第2列（索引1）的技能选择框中获取技能名称
            const skillSelect = cells[1].querySelector('select');
            const originalSkillName = skillSelect ? skillSelect.value : '未知技能';
            
            // 应用技能名称合并逻辑
            const mergedSkillName = mergeSkillName(originalSkillName);
            
            if (skillDamageMap.has(mergedSkillName)) {
                skillDamageMap.set(mergedSkillName, skillDamageMap.get(mergedSkillName) + skillDamage);
            } else {
                skillDamageMap.set(mergedSkillName, skillDamage);
            }
        }
    });

    // 过滤掉伤害为0或"无"技能的数据，并按伤害值排序
    const sortedSkills = Array.from(skillDamageMap.entries())
        .filter(([skillName, damage]) => skillName !== '无' && damage > 0)
        .sort((a, b) => b[1] - a[1]);

    // 如果没有有效技能数据，显示默认状态
    if (sortedSkills.length === 0) {
        skillDamageChart.data.labels = ['暂无有效数据'];
        skillDamageChart.data.datasets[0].data = [100];
        skillDamageChart.data.datasets[0].backgroundColor = ['#E5E7EB'];
        skillDamageChart.update('none'); // 无动画更新
        updateSkillDamageLegend([]);
        return;
    }

    const labels = sortedSkills.map(([skillName]) => skillName);
    const data = sortedSkills.map(([, damage]) => totalDamage > 0 ? (damage / totalDamage * 100) : 0);

    // 为所有技能分配颜色，如果技能数量超过颜色数组长度，则循环使用颜色
    const colors = [];
    for (let i = 0; i < labels.length; i++) {
        colors.push(chartColors.skillDamage[i % chartColors.skillDamage.length]);
    }

    // 更新图表数据
    skillDamageChart.data.labels = labels;
    skillDamageChart.data.datasets[0].data = data;
    skillDamageChart.data.datasets[0].backgroundColor = colors;

    // 更新图表（无动画）
    skillDamageChart.update('none');
    updateSkillDamageLegend(sortedSkills);
}

// 更新伤害类型图例
function updateDamageTypeLegend(externalDamage = 0, breakBambooDamage = 0, externalElementDamage = 0) {
    const legend = document.getElementById('damageTypeLegend');
    if (!legend || !damageTypeChart) return;

    const data = damageTypeChart.data;
    const actualValues = [externalDamage, breakBambooDamage, externalElementDamage];
    legend.innerHTML = '';

    data.labels.forEach((label, index) => {
        const percentage = data.datasets[0].data[index];
        const actualValue = actualValues[index];
        const color = data.datasets[0].backgroundColor[index];
        
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${color}"></div>
            <span class="legend-label">${label}</span>
            <span class="legend-value">${percentage.toFixed(2)}%</span>
            <span class="legend-actual">(${actualValue.toFixed(2)})</span>
        `;
        legend.appendChild(legendItem);
    });
}

// 更新会心类型图例
function updateCritTypeLegend(criticalDamage = 0, intentDamage = 0, whiteTextDamage = 0, grazeDamage = 0) {
    const legend = document.getElementById('critTypeLegend');
    if (!legend || !critTypeChart) return;

    const data = critTypeChart.data;
    const actualValues = [criticalDamage, intentDamage, whiteTextDamage, grazeDamage];
    legend.innerHTML = '';

    data.labels.forEach((label, index) => {
        const percentage = data.datasets[0].data[index];
        const actualValue = actualValues[index];
        const color = data.datasets[0].backgroundColor[index];
        
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${color}"></div>
            <span class="legend-label">${label}</span>
            <span class="legend-value">${percentage.toFixed(2)}%</span>
            <span class="legend-actual">(${actualValue.toFixed(2)})</span>
        `;
        legend.appendChild(legendItem);
    });
}

// 更新技能伤害图例
function updateSkillDamageLegend(sortedSkills = []) {
    const legend = document.getElementById('skillDamageLegend');
    if (!legend || !skillDamageChart) return;

    const data = skillDamageChart.data;
    legend.innerHTML = '';

    data.labels.forEach((label, index) => {
        const percentage = data.datasets[0].data[index];
        const color = data.datasets[0].backgroundColor[index];
        
        // 获取实际伤害值
        const actualDamage = sortedSkills[index] ? sortedSkills[index][1] : 0;
        
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${color}"></div>
            <span class="legend-label">${label}</span>
            <span class="legend-value">${percentage.toFixed(2)}%</span>
            <span class="legend-actual">(${actualDamage.toFixed(2)})</span>
        `;
        legend.appendChild(legendItem);
    });
}

// ==================== DIY界面功能 ====================

// 字段映射关系表 - DIY界面到基础信息界面的映射
const diyFieldMapping = {
    // 战斗属性映射
    'diy-external-attack-min': 'external-attack-min',
    'diy-external-attack-max': 'external-attack-max',
    'diy-precision-rate': 'precision-rate',
    'diy-critical-rate': 'critical-rate',
    'diy-intent-rate': 'intent-rate',
    'diy-direct-critical-rate': 'direct-critical-rate',
    'diy-direct-intent-rate': 'direct-intent-rate',
    'diy-ring-metal-attack-min': 'ring-metal-attack-min',
    'diy-ring-metal-attack-max': 'ring-metal-attack-max',
    'diy-break-rock-attack-min': 'break-rock-attack-min',
    'diy-break-rock-attack-max': 'break-rock-attack-max',
    'diy-pull-silk-attack-min': 'pull-silk-attack-min',
    'diy-pull-silk-attack-max': 'pull-silk-attack-max',
    'diy-break-bamboo-attack-min': 'break-bamboo-attack-min',
    'diy-break-bamboo-attack-max': 'break-bamboo-attack-max',
    'diy-critical-damage-bonus': 'critical-damage-bonus',
    'diy-intent-damage-bonus': 'intent-damage-bonus',
    'diy-external-penetration': 'external-penetration',
    'diy-elemental-penetration': 'elemental-penetration',
    'diy-external-damage-bonus': 'external-damage-bonus',
    'diy-elemental-damage-bonus': 'elemental-damage-bonus',
    
    // 伤害增益映射
    'diy-rope-dart-bonus': 'rope-dart-bonus',
    'diy-dual-blades-bonus': 'dual-blades-bonus',
    'diy-all-martial-bonus': 'all-martial-bonus',
    'diy-boss-unit-bonus': 'boss-unit-bonus',
    'diy-light-strike-bonus': 'light-strike-bonus',
    'diy-mouse-bonus': 'mouse-bonus'
};

// 初始化DIY界面功能
function initDiyInterface() {
    console.log('初始化DIY界面功能');
    
    // 初始化DIY导入到基础信息按钮
    initDiyImportToBasicButton();
    
    // 初始化DIY快速输入功能
    initDiyQuickInput();
    
    // 初始化复选框功能
    initCheckboxFunctions();

    // 初始化DIY最小破竹联动（仅限DIY页）
    // 初始化属攻穿透和属攻伤害加成计算
    const breakBambooMinInput = document.getElementById('diy-break-bamboo-attack-min');
    if (breakBambooMinInput) {
        breakBambooMinInput.addEventListener('input', updateElementalStatsFromBreakBamboo);
    }

    // 初始化DIY敏模块联动（仅限DIY页）
    initDiyMinModuleLinkage();
    
    // 触发初始计算，确保默认值生效
    setTimeout(() => {
        updateExternalAttackFromAllSources();
        console.log('DIY页面默认值初始计算完成');
    }, 100);
}

// 更新属攻穿透和属攻伤害加成（基于最小破竹攻击值）
function updateElementalStatsFromBreakBamboo() {
    const breakBambooMinInput = document.getElementById('diy-break-bamboo-attack-min');
    const elementalPenetrationInput = document.getElementById('diy-elemental-penetration');
    const elementalDamageInput = document.getElementById('diy-elemental-damage-bonus');
    
    if (!breakBambooMinInput || !elementalPenetrationInput || !elementalDamageInput) {
        console.error('找不到破竹攻击或属攻穿透/伤害加成输入框！');
        return;
    }
    
    const breakBambooMinValue = parseFloat(breakBambooMinInput.value) || 0;
    
    // 计算属攻穿透：最小破竹攻击值 * 0.0673，最大值为22
    const elementalPenetrationFromBreakBamboo = Math.min(breakBambooMinValue * 0.0673, 22);
    
    // 计算属攻伤害加成：最小破竹攻击值 * 0.0337，最大值为9
    const elementalDamageFromBreakBamboo = Math.min(breakBambooMinValue * 0.0337, 9);
    
    // 计算泥鱼心法加成
    const niyuCheckbox = document.getElementById('diy-niyu');
    const niyuBonus = (niyuCheckbox && niyuCheckbox.checked) ? 6 : 0;
    
    // 计算最终属攻穿透：破竹攻击加成 + 泥鱼心法加成 + 技能特殊加成（红刀A1-A5+10）
    const redBladeSkills = ["红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5"];
    const skillBonus = 0; // 这里需要根据当前技能判断，暂时设为0
    const finalElementalPenetration = elementalPenetrationFromBreakBamboo + niyuBonus + skillBonus;
    
    // 更新属攻穿透和属攻伤害加成
    elementalPenetrationInput.value = preciseRound(finalElementalPenetration, 1);
    elementalDamageInput.value = preciseRound(elementalDamageFromBreakBamboo, 1);
    
    // 触发输入事件
    elementalPenetrationInput.dispatchEvent(new Event('input', { bubbles: true }));
    elementalDamageInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    console.log(`属攻计算: 破竹攻击${breakBambooMinValue} → 属穿${elementalPenetrationFromBreakBamboo.toFixed(1)}(最大22) + 泥鱼${niyuBonus} = ${finalElementalPenetration.toFixed(1)}, 属伤${elementalDamageFromBreakBamboo.toFixed(1)}(最大9)`);
}

// DIY页联动：敏模块第一个文本框每+1 → 最小外功+0.264，会心率+0.0305；仅在[0,127]有效，下降回退
function initDiyMinModuleLinkage() {
    const calculated1Input = document.getElementById('diy-min-calculated-1');
    const extMinInput = document.getElementById('diy-external-attack-min');
    const critRateInput = document.getElementById('diy-critical-rate');
    if (!calculated1Input || !extMinInput || !critRateInput) {
        console.error('找不到DIY敏模块第一个计算结果或最小外功/会心率输入框！');
        return;
    }
    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    const num = (el) => {
        const v = parseFloat(el.value);
        return isNaN(v) ? 0 : v;
    };
    const toSteps = (calc1) => clamp(calc1, 0, 127);
    const EXT_STEP = 0.264;
    const CRIT_STEP = 0.0305;

    // 初始化已应用步数，依据当前第一个计算结果的数值
    if (!calculated1Input.dataset.minModuleAppliedSteps) {
        const initialCalc1 = parseFloat(calculated1Input.value) || 0;
        calculated1Input.dataset.minModuleAppliedSteps = String(toSteps(initialCalc1));
    }

    calculated1Input.addEventListener('input', () => {
        const calc1 = parseFloat(calculated1Input.value) || 0;
        const newSteps = toSteps(calc1);
        const prevSteps = parseFloat(calculated1Input.dataset.minModuleAppliedSteps || '0') || 0;
        const delta = newSteps - prevSteps;
        if (delta === 0) return;

        calculated1Input.dataset.minModuleAppliedSteps = String(newSteps);
        console.log(`DIY联动：敏模块Δ=${delta}，已交由综合计算函数处理（不直接写入最小外功/会心率，避免撤销时数值漂移）`);
        return;
    });
}





// 初始化DIY导入到基础信息按钮
function initDiyImportToBasicButton() {
    const importButton = document.getElementById('diy-import-to-basic-btn');
    
    if (!importButton) {
        console.error('找不到DIY导入按钮元素！');
        return;
    }
    
    importButton.addEventListener('click', async function() {
        console.log('DIY导入到基础信息按钮被点击');
        
        try {
            // 确认操作
            const confirmImport = await showConfirmDialog('确定要将DIY配置导入到基础信息页面吗？这将覆盖当前的基础信息配置。', '导入DIY配置');
            if (!confirmImport) {
                return;
            }
            
            // 执行导入
            importDiyToBasic();
            
            showNotification('DIY配置已成功导入到基础信息页面！', 'success');
            console.log('DIY配置导入完成');
            
        } catch (error) {
            console.error('导入DIY配置时发生错误:', error);
            showNotification('导入失败: ' + error.message, 'error');
        }
    });
}

// 将DIY配置导入到基础信息页面
function importDiyToBasic() {
    try {
        // 遍历字段映射关系，将DIY界面的值复制到基础信息界面
        Object.keys(diyFieldMapping).forEach(diyId => {
            const basicId = diyFieldMapping[diyId];
            const diyElement = document.getElementById(diyId);
            const basicElement = document.getElementById(basicId);
            
            if (diyElement && basicElement) {
                basicElement.value = diyElement.value;
            }
        });
        
        // 更新panelData对象
        updatePanelDataFromInputs();
        
        // 更新排轴表格
        updateRotationTable();
        
        console.log('DIY配置导入到基础信息完成');
        
    } catch (error) {
        console.error('导入DIY配置到基础信息时发生错误:', error);
        throw error;
    }
}





// 更新panelData对象（从输入框获取值）
function updatePanelDataFromInputs() {
    try {
        // 更新战斗属性
        panelData.externalAttack.min = parseFloat(document.getElementById('external-attack-min').value) || 0;
        panelData.externalAttack.max = parseFloat(document.getElementById('external-attack-max').value) || 0;
        panelData.precisionRate = parseFloat(document.getElementById('precision-rate').value) || 0;
        panelData.criticalRate = parseFloat(document.getElementById('critical-rate').value) || 0;
        panelData.intentRate = parseFloat(document.getElementById('intent-rate').value) || 0;
        panelData.directCriticalRate = parseFloat(document.getElementById('direct-critical-rate').value) || 0;
        panelData.directIntentRate = parseFloat(document.getElementById('direct-intent-rate').value) || 0;
        
        // 更新攻击属性
        panelData.ringMetalAttack.min = parseFloat(document.getElementById('ring-metal-attack-min').value) || 0;
        panelData.ringMetalAttack.max = parseFloat(document.getElementById('ring-metal-attack-max').value) || 0;
        panelData.breakRockAttack.min = parseFloat(document.getElementById('break-rock-attack-min').value) || 0;
        panelData.breakRockAttack.max = parseFloat(document.getElementById('break-rock-attack-max').value) || 0;
        panelData.pullSilkAttack.min = parseFloat(document.getElementById('pull-silk-attack-min').value) || 0;
        panelData.pullSilkAttack.max = parseFloat(document.getElementById('pull-silk-attack-max').value) || 0;
        panelData.breakBambooAttack.min = parseFloat(document.getElementById('break-bamboo-attack-min').value) || 0;
        panelData.breakBambooAttack.max = parseFloat(document.getElementById('break-bamboo-attack-max').value) || 0;
        
        // 更新伤害加成
        panelData.criticalDamageBonus = parseFloat(document.getElementById('critical-damage-bonus').value) || 0;
        panelData.intentDamageBonus = parseFloat(document.getElementById('intent-damage-bonus').value) || 0;
        panelData.externalDamageBonus = parseFloat(document.getElementById('external-damage-bonus').value) || 0;
        panelData.elementalDamageBonus = parseFloat(document.getElementById('elemental-damage-bonus').value) || 0;
        panelData.externalPenetration = parseFloat(document.getElementById('external-penetration').value) || 0;
        panelData.elementalPenetration = parseFloat(document.getElementById('elemental-penetration').value) || 0;
        
        // 更新装备增伤
        panelData.ropeDartBonus = parseFloat(document.getElementById('rope-dart-bonus').value) || 0;
        panelData.dualBladesBonus = parseFloat(document.getElementById('dual-blades-bonus').value) || 0;
        panelData.allMartialBonus = parseFloat(document.getElementById('all-martial-bonus').value) || 0;
        panelData.bossUnitBonus = parseFloat(document.getElementById('boss-unit-bonus').value) || 0;
        panelData.lightStrikeBonus = parseFloat(document.getElementById('light-strike-bonus').value) || 0;
        panelData.mouseBonus = parseFloat(document.getElementById('mouse-bonus').value) || 0;
        
        
        console.log('panelData对象已更新');
        
    } catch (error) {
        console.error('更新panelData对象时发生错误:', error);
        throw error;
    }
}

// 初始化DIY快速输入功能
function initDiyQuickInput() {
    console.log('初始化DIY快速输入功能');
    
    const quickMinInput = document.getElementById('diy-quick-external-min');
    const quickMaxInput = document.getElementById('diy-quick-external-max');
    
    if (!quickMinInput || !quickMaxInput) {
        console.error('找不到DIY快速输入元素！');
        return;
    }
    
    // 为两个输入框添加实时监听事件
    quickMinInput.addEventListener('input', updateExternalAttackFromQuickInput);
    quickMaxInput.addEventListener('input', updateExternalAttackFromQuickInput);
    
    // 初始化装备基础输入功能
    const equipmentMinInput = document.getElementById('diy-equipment-basic-min');
    const equipmentMaxInput = document.getElementById('diy-equipment-basic-max');
    
    if (equipmentMinInput && equipmentMaxInput) {
        equipmentMinInput.addEventListener('input', updateExternalAttackFromEquipmentBasic);
        equipmentMaxInput.addEventListener('input', updateExternalAttackFromEquipmentBasic);
    }
    
    // 初始化武库选择功能
    const wukuSelect = document.getElementById('diy-wuku-select');
    if (wukuSelect) {
        wukuSelect.addEventListener('change', updateExternalAttackFromAllSources);
    }
    
    // 初始化大外功能
    const dawaiDisplay = document.getElementById('diy-dawai-display');
    if (dawaiDisplay) {
        dawaiDisplay.addEventListener('input', updateDawaiCalculation);
    }
    
    // 初始化大外第一个计算结果功能
    const dawaiCalculated = document.getElementById('diy-dawai-calculated');
    if (dawaiCalculated) {
        dawaiCalculated.addEventListener('input', updateDawaiCalculated);
    }
    
    // 初始化小外功能
    const xiaowaiDisplay = document.getElementById('diy-xiaowai-display');
    if (xiaowaiDisplay) {
        xiaowaiDisplay.addEventListener('input', updateXiaowaiCalculation);
    }
    
    // 初始化小外第一个计算结果功能
    const xiaowaiCalculated = document.getElementById('diy-xiaowai-calculated');
    if (xiaowaiCalculated) {
        xiaowaiCalculated.addEventListener('input', updateXiaowaiCalculated);
    }
    
    // 初始化大破功能
    const dapoDisplay = document.getElementById('diy-dapo-display');
    if (dapoDisplay) {
        dapoDisplay.addEventListener('input', updateDapoCalculation);
    }
    
    // 初始化大破第一个计算结果功能
    const dapoCalculated = document.getElementById('diy-dapo-calculated');
    if (dapoCalculated) {
        dapoCalculated.addEventListener('input', updateDapoCalculated);
    }
    
    // 初始化小破功能
    const xiaopoDisplay = document.getElementById('diy-xiaopo-display');
    if (xiaopoDisplay) {
        xiaopoDisplay.addEventListener('input', updateXiaopoCalculation);
    }
    
    // 初始化小破第一个计算结果功能
    const xiaopoCalculated = document.getElementById('diy-xiaopo-calculated');
    if (xiaopoCalculated) {
        xiaopoCalculated.addEventListener('input', updateXiaopoCalculated);
    }
    
    // 初始化小裂功能
    const xiaolieDisplay = document.getElementById('diy-xiaolie-display');
    if (xiaolieDisplay) {
        xiaolieDisplay.addEventListener('input', updateXiaolieCalculation);
    }
    
    // 初始化小裂第一个计算结果功能
    const xiaolieCalculated = document.getElementById('diy-xiaolie-calculated');
    if (xiaolieCalculated) {
        xiaolieCalculated.addEventListener('input', updateXiaolieCalculated);
    }
    
    // 初始化精准功能
    const precisionDisplay = document.getElementById('diy-precision-display');
    if (precisionDisplay) {
        precisionDisplay.addEventListener('input', updatePrecisionCalculation);
    }
    
    // 初始化精准第一个计算结果功能
    const precisionCalculated = document.getElementById('diy-precision-calculated');
    if (precisionCalculated) {
        precisionCalculated.addEventListener('input', updatePrecisionCalculated);
    }
    
    // 初始化会心功能
    const critDisplay = document.getElementById('diy-crit-display');
    if (critDisplay) {
        critDisplay.addEventListener('input', updateCritCalculation);
    }
    
    // 初始化会心第一个计算结果功能
    const critCalculated = document.getElementById('diy-crit-calculated');
    if (critCalculated) {
        critCalculated.addEventListener('input', updateCritCalculated);
    }
    
    // 初始化会意功能
    const intentDisplay = document.getElementById('diy-intent-display');
    if (intentDisplay) {
        intentDisplay.addEventListener('input', updateIntentCalculation);
    }
    
    // 初始化会意第一个计算结果功能
    const intentCalculated = document.getElementById('diy-intent-calculated');
    if (intentCalculated) {
        intentCalculated.addEventListener('input', updateIntentCalculated);
    }
    
    // 初始化敏功能
    const minDisplay = document.getElementById('diy-min-display');
    if (minDisplay) {
        minDisplay.addEventListener('input', updateMinCalculation);
    }
    
    // 初始化敏第一个计算结果功能
    const minCalculated1 = document.getElementById('diy-min-calculated-1');
    if (minCalculated1) {
        minCalculated1.addEventListener('input', updateMinCalculated1);
    }
    
    // 初始化劲功能
    const jinDisplay = document.getElementById('diy-jin-display');
    if (jinDisplay) {
        jinDisplay.addEventListener('input', updateJinCalculation);
    }
    
    // 初始化劲第一个计算结果功能
    const jinCalculated1 = document.getElementById('diy-jin-calculated-1');
    if (jinCalculated1) {
        jinCalculated1.addEventListener('input', updateJinCalculated1);
    }
    
    // 初始化势功能
    const shiDisplay = document.getElementById('diy-shi-display');
    if (shiDisplay) {
        shiDisplay.addEventListener('input', updateShiCalculation);
    }
    
    // 初始化势第一个计算结果功能
    const shiCalculated1 = document.getElementById('diy-shi-calculated-1');
    if (shiCalculated1) {
        shiCalculated1.addEventListener('input', updateShiCalculated1);
    }
    
    // 初始化装备选择功能
    const equipmentSelect = document.getElementById('diy-equipment-select');
    if (equipmentSelect) {
        equipmentSelect.addEventListener('change', updateEquipmentBonus);
    }
    
    // 初始化弓箭选择功能
    const bowSelect = document.getElementById('diy-bow-select');
    if (bowSelect) {
        bowSelect.addEventListener('change', updateBowBonus);
    }
    
    console.log('DIY快速输入功能初始化完成');
}

// 更新外功攻击值（基于快速输入）
function updateExternalAttackFromQuickInput() {
    updateExternalAttackFromAllSources();
}

// 更新外功攻击值（基于装备基础输入）
function updateExternalAttackFromEquipmentBasic() {
    updateExternalAttackFromAllSources();
}

// 更新大外计算
function updateDawaiCalculation() {
    try {
        const dawaiDisplay = document.getElementById('diy-dawai-display');
        const dawaiCalculated = document.getElementById('diy-dawai-calculated');
        
        if (!dawaiDisplay || !dawaiCalculated) {
            console.error('找不到大外输入元素！');
            return;
        }
        
        // 获取显示框的数值
        const displayValue = parseFloat(dawaiDisplay.value) || 0;
        
        // 计算文本框的数值（显示框数值 × 77.8）
        const calculatedValue = displayValue * 77.8;
        
        // 更新计算结果文本框
        dawaiCalculated.value = preciseRound(calculatedValue, 1);
        
        console.log(`大外计算: ${displayValue} × 77.8 = ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将大外计算结果纳入外功攻击计算
        updateExternalAttackFromAllSources();
        
    } catch (error) {
        console.error('更新大外计算时发生错误:', error);
    }
}

// 更新大外第一个计算结果
function updateDawaiCalculated() {
    try {
        const dawaiCalculated = document.getElementById('diy-dawai-calculated');
        
        if (!dawaiCalculated) {
            console.error('找不到大外计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue = parseFloat(dawaiCalculated.value) || 0;
        
        console.log(`大外第一个计算结果更新: ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将大外计算结果纳入外功攻击计算
        updateExternalAttackFromAllSources();
        
    } catch (error) {
        console.error('更新大外第一个计算结果时发生错误:', error);
    }
}

// 更新小外计算
function updateXiaowaiCalculation() {
    try {
        const xiaowaiDisplay = document.getElementById('diy-xiaowai-display');
        const xiaowaiCalculated = document.getElementById('diy-xiaowai-calculated');
        
        if (!xiaowaiDisplay || !xiaowaiCalculated) {
            console.error('找不到小外输入元素！');
            return;
        }
        
        // 获取显示框的数值
        const displayValue = parseFloat(xiaowaiDisplay.value) || 0;
        
        // 计算文本框的数值（显示框数值 × 77.8）
        const calculatedValue = displayValue * 77.8;
        
        // 更新计算结果文本框
        xiaowaiCalculated.value = preciseRound(calculatedValue, 1);
        
        console.log(`小外计算: ${displayValue} × 77.8 = ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将小外计算结果纳入外功攻击计算
        updateExternalAttackFromAllSources();
        
    } catch (error) {
        console.error('更新小外计算时发生错误:', error);
    }
}

// 更新小外第一个计算结果
function updateXiaowaiCalculated() {
    try {
        const xiaowaiCalculated = document.getElementById('diy-xiaowai-calculated');
        
        if (!xiaowaiCalculated) {
            console.error('找不到小外计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue = parseFloat(xiaowaiCalculated.value) || 0;
        
        console.log(`小外第一个计算结果更新: ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将小外计算结果纳入外功攻击计算
        updateExternalAttackFromAllSources();
        
    } catch (error) {
        console.error('更新小外第一个计算结果时发生错误:', error);
    }
}

// 更新大破计算
function updateDapoCalculation() {
    try {
        const dapoDisplay = document.getElementById('diy-dapo-display');
        const dapoCalculated = document.getElementById('diy-dapo-calculated');
        
        if (!dapoDisplay || !dapoCalculated) {
            console.error('找不到大破输入元素！');
            return;
        }
        
        // 获取显示框的数值
        const displayValue = parseFloat(dapoDisplay.value) || 0;
        
        // 计算文本框的数值（显示框数值 × 44.2）
        const calculatedValue = displayValue * 44.2;
        
        // 更新计算结果文本框
        dapoCalculated.value = preciseRound(calculatedValue, 1);
        
        console.log(`大破计算: ${displayValue} × 44.2 = ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将大破计算结果纳入破竹攻击计算
        updateBreakBambooAttackFromAllSources();
        
    } catch (error) {
        console.error('更新大破计算时发生错误:', error);
    }
}

// 更新大破第一个计算结果
function updateDapoCalculated() {
    try {
        const dapoCalculated = document.getElementById('diy-dapo-calculated');
        
        if (!dapoCalculated) {
            console.error('找不到大破计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue = parseFloat(dapoCalculated.value) || 0;
        
        console.log(`大破第一个计算结果更新: ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将大破计算结果纳入破竹攻击计算
        updateBreakBambooAttackFromAllSources();
        
    } catch (error) {
        console.error('更新大破第一个计算结果时发生错误:', error);
    }
}

// 更新小破计算
function updateXiaopoCalculation() {
    try {
        const xiaopoDisplay = document.getElementById('diy-xiaopo-display');
        const xiaopoCalculated = document.getElementById('diy-xiaopo-calculated');
        
        if (!xiaopoDisplay || !xiaopoCalculated) {
            console.error('找不到小破输入元素！');
            return;
        }
        
        // 获取显示框的数值
        const displayValue = parseFloat(xiaopoDisplay.value) || 0;
        
        // 计算文本框的数值（显示框数值 × 44.2）
        const calculatedValue = displayValue * 44.2;
        
        // 更新计算结果文本框
        xiaopoCalculated.value = preciseRound(calculatedValue, 1);
        
        console.log(`小破计算: ${displayValue} × 44.2 = ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将小破计算结果纳入破竹攻击计算
        updateBreakBambooAttackFromAllSources();
        
    } catch (error) {
        console.error('更新小破计算时发生错误:', error);
    }
}

// 更新小破第一个计算结果
function updateXiaopoCalculated() {
    try {
        const xiaopoCalculated = document.getElementById('diy-xiaopo-calculated');
        
        if (!xiaopoCalculated) {
            console.error('找不到小破计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue = parseFloat(xiaopoCalculated.value) || 0;
        
        console.log(`小破第一个计算结果更新: ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将小破计算结果纳入破竹攻击计算
        updateBreakBambooAttackFromAllSources();
        
    } catch (error) {
        console.error('更新小破第一个计算结果时发生错误:', error);
    }
}

// 更新小裂计算
function updateXiaolieCalculation() {
    try {
        const xiaolieDisplay = document.getElementById('diy-xiaolie-display');
        const xiaolieCalculated = document.getElementById('diy-xiaolie-calculated');
        
        if (!xiaolieDisplay || !xiaolieCalculated) {
            console.error('找不到小裂输入元素！');
            return;
        }
        
        // 获取显示框的数值
        const displayValue = parseFloat(xiaolieDisplay.value) || 0;
        
        // 计算文本框的数值（显示框数值 × 44.2）
        const calculatedValue = displayValue * 44.2;
        
        // 更新计算结果文本框
        xiaolieCalculated.value = preciseRound(calculatedValue, 1);
        
        console.log(`小裂计算: ${displayValue} × 44.2 = ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将小裂计算结果纳入裂石攻击计算
        updateBreakRockAttackFromAllSources();
        
    } catch (error) {
        console.error('更新小裂计算时发生错误:', error);
    }
}

// 更新小裂第一个计算结果
function updateXiaolieCalculated() {
    try {
        const xiaolieCalculated = document.getElementById('diy-xiaolie-calculated');
        
        if (!xiaolieCalculated) {
            console.error('找不到小裂计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue = parseFloat(xiaolieCalculated.value) || 0;
        
        console.log(`小裂第一个计算结果更新: ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将小裂计算结果纳入裂石攻击计算
        updateBreakRockAttackFromAllSources();
        
    } catch (error) {
        console.error('更新小裂第一个计算结果时发生错误:', error);
    }
}

// 更新精准计算
function updatePrecisionCalculation() {
    try {
        const precisionDisplay = document.getElementById('diy-precision-display');
        const precisionCalculated = document.getElementById('diy-precision-calculated');
        
        if (!precisionDisplay || !precisionCalculated) {
            console.error('找不到精准输入元素！');
            return;
        }
        
        // 获取显示框的数值
        const displayValue = parseFloat(precisionDisplay.value) || 0;
        
        // 计算文本框的数值（显示框数值 × 8）
        const calculatedValue = displayValue * 8;
        
        // 更新计算结果文本框
        precisionCalculated.value = preciseRound(calculatedValue, 1);
        
        console.log(`精准计算: ${displayValue} × 8 = ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将精准计算结果纳入精准率计算
        updatePrecisionRateFromAllSources();
        
    } catch (error) {
        console.error('更新精准计算时发生错误:', error);
    }
}

// 更新精准第一个计算结果
function updatePrecisionCalculated() {
    try {
        const precisionCalculated = document.getElementById('diy-precision-calculated');
        
        if (!precisionCalculated) {
            console.error('找不到精准计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue = parseFloat(precisionCalculated.value) || 0;
        
        console.log(`精准第一个计算结果更新: ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将精准计算结果纳入精准率计算
        updatePrecisionRateFromAllSources();
        
    } catch (error) {
        console.error('更新精准第一个计算结果时发生错误:', error);
    }
}

// 更新会心计算
function updateCritCalculation() {
    try {
        const critDisplay = document.getElementById('diy-crit-display');
        const critCalculated = document.getElementById('diy-crit-calculated');
        
        if (!critDisplay || !critCalculated) {
            console.error('找不到会心输入元素！');
            return;
        }
        
        // 获取显示框的数值
        const displayValue = parseFloat(critDisplay.value) || 0;
        
        // 计算文本框的数值（显示框数值 × 9）
        const calculatedValue = displayValue * 9;
        
        // 更新计算结果文本框
        critCalculated.value = preciseRound(calculatedValue, 1);
        
        console.log(`会心计算: ${displayValue} × 9 = ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将会心计算结果纳入会心率计算
        updateCritRateFromAllSources();
        
    } catch (error) {
        console.error('更新会心计算时发生错误:', error);
    }
}

// 更新会心第一个计算结果
function updateCritCalculated() {
    try {
        const critCalculated = document.getElementById('diy-crit-calculated');
        
        if (!critCalculated) {
            console.error('找不到会心计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue = parseFloat(critCalculated.value) || 0;
        
        console.log(`会心第一个计算结果更新: ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将会心计算结果纳入会心率计算
        updateCritRateFromAllSources();
        
    } catch (error) {
        console.error('更新会心第一个计算结果时发生错误:', error);
    }
}

// 更新会意计算
function updateIntentCalculation() {
    try {
        const intentDisplay = document.getElementById('diy-intent-display');
        const intentCalculated = document.getElementById('diy-intent-calculated');
        
        if (!intentDisplay || !intentCalculated) {
            console.error('找不到会意输入元素！');
            return;
        }
        
        // 获取显示框的数值
        const displayValue = parseFloat(intentDisplay.value) || 0;
        
        // 计算文本框的数值（显示框数值 × 4.4）
        const calculatedValue = displayValue * 4.4;
        
        // 更新计算结果文本框
        intentCalculated.value = preciseRound(calculatedValue, 1);
        
        console.log(`会意计算: ${displayValue} × 4.4 = ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将会意计算结果纳入会意率计算
        updateIntentRateFromAllSources();
        
    } catch (error) {
        console.error('更新会意计算时发生错误:', error);
    }
}

// 更新会意第一个计算结果
function updateIntentCalculated() {
    try {
        const intentCalculated = document.getElementById('diy-intent-calculated');
        
        if (!intentCalculated) {
            console.error('找不到会意计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue = parseFloat(intentCalculated.value) || 0;
        
        console.log(`会意第一个计算结果更新: ${calculatedValue.toFixed(1)}`);
        
        // 触发综合更新，将会意计算结果纳入会意率计算
        updateIntentRateFromAllSources();
        
    } catch (error) {
        console.error('更新会意第一个计算结果时发生错误:', error);
    }
}

// 更新敏计算
function updateMinCalculation() {
    try {
        const minDisplay = document.getElementById('diy-min-display');
        const minCalculated1 = document.getElementById('diy-min-calculated-1');
        const minCalculated2 = document.getElementById('diy-min-calculated-2');
        const minCalculated3 = document.getElementById('diy-min-calculated-3');
        
        if (!minDisplay || !minCalculated1 || !minCalculated2 || !minCalculated3) {
            console.error('找不到敏输入元素！');
            return;
        }
        
        // 获取显示框的数值
        const displayValue = parseFloat(minDisplay.value) || 0;
        
        // 计算第一个文本框的数值（显示框数值 × 49.4）
        const calculatedValue1 = displayValue * 49.4;
        
        // 更新第一个计算结果文本框
        minCalculated1.value = preciseRound(calculatedValue1, 1);
        
        // 基于第一个计算结果更新第二、三个计算结果
        updateMinCalculated2And3();
        
        console.log(`敏计算: ${displayValue} × 49.4 = ${calculatedValue1.toFixed(1)}`);
        
        // 触发综合更新，将敏计算结果纳入外功攻击和会心率计算
        updateExternalAttackFromAllSources();
        updateCritRateFromAllSources();
        
    } catch (error) {
        console.error('更新敏计算时发生错误:', error);
    }
}

// 更新敏第一个计算结果
function updateMinCalculated1() {
    try {
        const minCalculated1 = document.getElementById('diy-min-calculated-1');
        const minCalculated2 = document.getElementById('diy-min-calculated-2');
        const minCalculated3 = document.getElementById('diy-min-calculated-3');
        
        if (!minCalculated1 || !minCalculated2 || !minCalculated3) {
            console.error('找不到敏计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue1 = parseFloat(minCalculated1.value) || 0;
        
        // 基于第一个计算结果更新第二、三个计算结果
        updateMinCalculated2And3();
        
        console.log(`敏第一个计算结果更新: ${calculatedValue1.toFixed(1)}`);
        
        // 触发综合更新，将敏计算结果纳入外功攻击和会心率计算
        updateExternalAttackFromAllSources();
        updateCritRateFromAllSources();
        
    } catch (error) {
        console.error('更新敏第一个计算结果时发生错误:', error);
    }
}

// 更新敏第二、三个计算结果
function updateMinCalculated2And3() {
    try {
        const minCalculated1 = document.getElementById('diy-min-calculated-1');
        const minCalculated2 = document.getElementById('diy-min-calculated-2');
        const minCalculated3 = document.getElementById('diy-min-calculated-3');
        
        if (!minCalculated1 || !minCalculated2 || !minCalculated3) {
            console.error('找不到敏计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue1 = parseFloat(minCalculated1.value) || 0;
        
        // 计算第二个文本框的数值（第一个文本框 × 0.9）
        const calculatedValue2 = calculatedValue1 * 0.9;
        
        // 计算第三个文本框的数值（第一个文本框 × 0.076）
        const calculatedValue3 = calculatedValue1 * 0.076;
        
        // 更新计算结果文本框
        minCalculated2.value = preciseRound(calculatedValue2, 1);
        minCalculated3.value = preciseRound(calculatedValue3, 1);
        
        console.log(`敏第二、三个计算结果更新: 第一个结果 × 0.9 = ${calculatedValue2.toFixed(1)}, 第一个结果 × 0.076 = ${calculatedValue3.toFixed(1)}`);
        
    } catch (error) {
        console.error('更新敏第二、三个计算结果时发生错误:', error);
    }
}

// 更新劲计算
function updateJinCalculation() {
    try {
        const jinDisplay = document.getElementById('diy-jin-display');
        const jinCalculated1 = document.getElementById('diy-jin-calculated-1');
        const jinCalculated2 = document.getElementById('diy-jin-calculated-2');
        const jinCalculated3 = document.getElementById('diy-jin-calculated-3');
        
        if (!jinDisplay || !jinCalculated1 || !jinCalculated2 || !jinCalculated3) {
            console.error('找不到劲输入元素！');
            return;
        }
        
        // 获取显示框的数值
        const displayValue = parseFloat(jinDisplay.value) || 0;
        
        // 计算第一个文本框的数值（显示框数值 × 49.4）
        const calculatedValue1 = displayValue * 49.4;
        
        // 更新第一个计算结果文本框
        jinCalculated1.value = preciseRound(calculatedValue1, 1);
        
        // 基于第一个计算结果更新第二、三个计算结果
        updateJinCalculated2And3();
        
        console.log(`劲计算: ${displayValue} × 49.4 = ${calculatedValue1.toFixed(1)}`);
        
        // 触发综合更新，将劲计算结果纳入外功攻击计算
        updateExternalAttackFromAllSources();
        
    } catch (error) {
        console.error('更新劲计算时发生错误:', error);
    }
}

// 更新劲第一个计算结果
function updateJinCalculated1() {
    try {
        const jinCalculated1 = document.getElementById('diy-jin-calculated-1');
        const jinCalculated2 = document.getElementById('diy-jin-calculated-2');
        const jinCalculated3 = document.getElementById('diy-jin-calculated-3');
        
        if (!jinCalculated1 || !jinCalculated2 || !jinCalculated3) {
            console.error('找不到劲计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue1 = parseFloat(jinCalculated1.value) || 0;
        
        // 基于第一个计算结果更新第二、三个计算结果
        updateJinCalculated2And3();
        
        console.log(`劲第一个计算结果更新: ${calculatedValue1.toFixed(1)}`);
        
        // 触发综合更新，将劲计算结果纳入外功攻击计算
        updateExternalAttackFromAllSources();
        
    } catch (error) {
        console.error('更新劲第一个计算结果时发生错误:', error);
    }
}

// 更新劲第二、三个计算结果
function updateJinCalculated2And3() {
    try {
        const jinCalculated1 = document.getElementById('diy-jin-calculated-1');
        const jinCalculated2 = document.getElementById('diy-jin-calculated-2');
        const jinCalculated3 = document.getElementById('diy-jin-calculated-3');
        
        if (!jinCalculated1 || !jinCalculated2 || !jinCalculated3) {
            console.error('找不到劲计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue1 = parseFloat(jinCalculated1.value) || 0;
        
        // 计算第二个文本框的数值（第一个文本框 × 0.225）
        const calculatedValue2 = calculatedValue1 * 0.225;
        
        // 计算第三个文本框的数值（第一个文本框 × 1.36）
        const calculatedValue3 = calculatedValue1 * 1.36;
        
        // 更新计算结果文本框
        jinCalculated2.value = preciseRound(calculatedValue2, 1);
        jinCalculated3.value = preciseRound(calculatedValue3, 1);
        
        console.log(`劲第二、三个计算结果更新: 第一个结果 × 0.225 = ${calculatedValue2.toFixed(1)}, 第一个结果 × 1.36 = ${calculatedValue3.toFixed(1)}`);
        
    } catch (error) {
        console.error('更新劲第二、三个计算结果时发生错误:', error);
    }
}

// 更新势计算
function updateShiCalculation() {
    try {
        const shiDisplay = document.getElementById('diy-shi-display');
        const shiCalculated1 = document.getElementById('diy-shi-calculated-1');
        const shiCalculated2 = document.getElementById('diy-shi-calculated-2');
        const shiCalculated3 = document.getElementById('diy-shi-calculated-3');
        
        if (!shiDisplay || !shiCalculated1 || !shiCalculated2 || !shiCalculated3) {
            console.error('找不到势输入元素！');
            return;
        }
        
        // 获取显示框的数值
        const displayValue = parseFloat(shiDisplay.value) || 0;
        
        // 计算第一个文本框的数值（显示框数值 × 49.4）
        const calculatedValue1 = displayValue * 49.4;
        
        // 更新第一个计算结果文本框
        shiCalculated1.value = preciseRound(calculatedValue1, 1);
        
        // 基于第一个计算结果更新第二、三个计算结果
        updateShiCalculated2And3();
        
        console.log(`势计算: ${displayValue} × 49.4 = ${calculatedValue1.toFixed(1)}`);
        
        // 触发综合更新，将势计算结果纳入外功攻击和会意率计算
        updateExternalAttackFromAllSources();
        updateIntentRateFromAllSources();
        
    } catch (error) {
        console.error('更新势计算时发生错误:', error);
    }
}

// 更新势第一个计算结果
function updateShiCalculated1() {
    try {
        const shiCalculated1 = document.getElementById('diy-shi-calculated-1');
        const shiCalculated2 = document.getElementById('diy-shi-calculated-2');
        const shiCalculated3 = document.getElementById('diy-shi-calculated-3');
        
        if (!shiCalculated1 || !shiCalculated2 || !shiCalculated3) {
            console.error('找不到势计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue1 = parseFloat(shiCalculated1.value) || 0;
        
        // 基于第一个计算结果更新第二、三个计算结果
        updateShiCalculated2And3();
        
        console.log(`势第一个计算结果更新: ${calculatedValue1.toFixed(1)}`);
        
        // 触发综合更新，将势计算结果纳入外功攻击和会意率计算
        updateExternalAttackFromAllSources();
        updateIntentRateFromAllSources();
        
    } catch (error) {
        console.error('更新势第一个计算结果时发生错误:', error);
    }
}

// 更新势第二、三个计算结果
function updateShiCalculated2And3() {
    try {
        const shiCalculated1 = document.getElementById('diy-shi-calculated-1');
        const shiCalculated2 = document.getElementById('diy-shi-calculated-2');
        const shiCalculated3 = document.getElementById('diy-shi-calculated-3');
        
        if (!shiCalculated1 || !shiCalculated2 || !shiCalculated3) {
            console.error('找不到势计算结果元素！');
            return;
        }
        
        // 获取第一个计算结果的数值
        const calculatedValue1 = parseFloat(shiCalculated1.value) || 0;
        
        // 计算第二个文本框的数值（第一个文本框 × 0.9）
        const calculatedValue2 = calculatedValue1 * 0.9;
        
        // 计算第三个文本框的数值（第一个文本框 × 0.038）
        const calculatedValue3 = calculatedValue1 * 0.038;
        
        // 更新计算结果文本框
        shiCalculated2.value = preciseRound(calculatedValue2, 1);
        shiCalculated3.value = preciseRound(calculatedValue3, 1);
        
        console.log(`势第二、三个计算结果更新: 第一个结果 × 0.9 = ${calculatedValue2.toFixed(1)}, 第一个结果 × 0.038 = ${calculatedValue3.toFixed(1)}`);
        
    } catch (error) {
        console.error('更新势第二、三个计算结果时发生错误:', error);
    }
}

// 更新装备加成
function updateEquipmentBonus() {
    try {
        const equipmentSelect = document.getElementById('diy-equipment-select');
        const equipmentValue = equipmentSelect?.value || '无';
        
        console.log(`装备选择: ${equipmentValue}`);
        
        // 重要：更新panelData中的装备套装值，这样伤害计算时装备套装效果才能正确应用
        panelData.equipmentSet = equipmentValue;
        
        // 首先清除所有装备加成
        clearEquipmentBonus();
        
        // 装备加成现在通过综合更新函数处理，不需要单独处理
        
        // 触发综合更新，确保所有相关数值重新计算
        updateExternalAttackFromAllSources();
        updatePrecisionRateFromAllSources();
        updateCritRateFromAllSources();
        updateIntentRateFromAllSources();
        
        // 同时更新面板数据，确保其他模块能获取到最新的装备选择
        updatePanelDataFromInputs();
        
    } catch (error) {
        console.error('更新装备加成时发生错误:', error);
    }
}

// 这些函数已被综合更新函数替代，不再需要单独处理装备加成

// 清除装备加成
function clearEquipmentBonus() {
    try {
        console.log('清除所有装备加成');
        
        // 不直接修改最终值，而是通过重新计算来清除装备加成
        // 这样不会影响其他模块的累加值
        
    } catch (error) {
        console.error('清除装备加成时发生错误:', error);
    }
}

// 更新弓箭加成
function updateBowBonus() {
    try {
        const bowSelect = document.getElementById('diy-bow-select');
        const bowValue = bowSelect?.value || '无';
        
        console.log(`弓箭选择: ${bowValue}`);
        
        // 首先清除所有弓箭加成
        clearBowBonus();
        
        // 弓箭加成现在通过综合更新函数处理，不需要单独处理
        
        // 触发综合更新，确保所有相关数值重新计算
        updatePrecisionRateFromAllSources();
        updateCritRateFromAllSources();
        updateIntentRateFromAllSources();
        
    } catch (error) {
        console.error('更新弓箭加成时发生错误:', error);
    }
}

// 这些函数已被综合更新函数替代，不再需要单独处理弓箭加成

// 清除弓箭加成
function clearBowBonus() {
    try {
        console.log('清除所有弓箭加成');
        
        // 不直接修改最终值，而是通过重新计算来清除弓箭加成
        // 这样不会影响其他模块的累加值
        
    } catch (error) {
        console.error('清除弓箭加成时发生错误:', error);
    }
}

// 综合更新外功攻击值（处理所有累加源）
function updateExternalAttackFromAllSources() {
    try {
        const quickMinInput = document.getElementById('diy-quick-external-min');
        const quickMaxInput = document.getElementById('diy-quick-external-max');
        const equipmentMinInput = document.getElementById('diy-equipment-basic-min');
        const equipmentMaxInput = document.getElementById('diy-equipment-basic-max');
        const wukuSelect = document.getElementById('diy-wuku-select');
        const dawaiCalculated = document.getElementById('diy-dawai-calculated');
        const xiaowaiCalculated = document.getElementById('diy-xiaowai-calculated');
        const minCalculated2 = document.getElementById('diy-min-calculated-2');
        const jinCalculated2 = document.getElementById('diy-jin-calculated-2');
        const jinCalculated3 = document.getElementById('diy-jin-calculated-3');
        const shiCalculated2 = document.getElementById('diy-shi-calculated-2');
        const externalMinInput = document.getElementById('diy-external-attack-min');
        const externalMaxInput = document.getElementById('diy-external-attack-max');
        const breakBambooMinInput = document.getElementById('diy-break-bamboo-attack-min');
        const breakBambooMaxInput = document.getElementById('diy-break-bamboo-attack-max');
        
        if (!externalMinInput || !externalMaxInput) {
            console.error('找不到外功攻击输入元素！');
            return;
        }
        
        // 获取基础值
        const baseMinValue = 616; // 基础最小值
        const baseMaxValue = 1024; // 基础最大值
        const baseBreakBambooMinValue = 196; // 破竹攻击基础最小值
        const baseBreakBambooMaxValue = 392; // 破竹攻击基础最大值
        
        // 获取叠音输入的值
        const quickMinValue = parseFloat(quickMinInput?.value) || 0;
        const quickMaxValue = parseFloat(quickMaxInput?.value) || 0;
        
        // 获取装备基础输入的值
        const equipmentMinValue = parseFloat(equipmentMinInput?.value) || 0;
        const equipmentMaxValue = parseFloat(equipmentMaxInput?.value) || 0;
        
        // 获取大外计算结果的值
        const dawaiValue = parseFloat(dawaiCalculated?.value) || 0;
        
        // 获取小外计算结果的值
        const xiaowaiValue = parseFloat(xiaowaiCalculated?.value) || 0;
        
        // 获取敏第二个计算结果的值
        const minValue2 = parseFloat(minCalculated2?.value) || 0;
        
        // 获取劲第二个和第三个计算结果的值
        const jinValue2 = parseFloat(jinCalculated2?.value) || 0;
        const jinValue3 = parseFloat(jinCalculated3?.value) || 0;
        
        // 获取势第二个计算结果的值
        const shiValue2 = parseFloat(shiCalculated2?.value) || 0;
        
        // 获取武库选择的值
        const wukuValue = wukuSelect?.value || '无';
        
        // 计算武库加成
        let wukuMinBonus = 0;
        let wukuMaxBonus = 0;
        let breakBambooMinBonus = 0;
        let breakBambooMaxBonus = 0;
        
        if (wukuValue === '通用') {
            wukuMinBonus = 131; // 通用武库外功攻击最小值加成
            wukuMaxBonus = 263; // 通用武库外功攻击最大值加成
        } else if (wukuValue === '破竹') {
            // 破竹武库对破竹攻击的加成（这里需要根据具体需求设置数值）
            breakBambooMinBonus = 131; // 破竹武库破竹攻击最小值加成（示例值）
            breakBambooMaxBonus = 263; // 破竹武库破竹攻击最大值加成（示例值）
        }
        
        // 计算装备加成
        let equipmentMinBonus = 0;
        const equipmentSelect = document.getElementById('diy-equipment-select');
        const equipmentValue = equipmentSelect?.value || '无';
        if (equipmentValue === '燕归' || equipmentValue === '岳山') {
            equipmentMinBonus = 78; // 燕归和岳山装备外功攻击最小值加成
        }
        
        // 计算心法加成
        let heartMethodMinBonus = 0;
        let heartMethodMaxBonus = 0;
        
        // 征人心法加成
        const zhengrenCheckbox = document.getElementById('diy-zhengren');
        if (zhengrenCheckbox && zhengrenCheckbox.checked) {
            heartMethodMinBonus += 66.9; // 征人心法外功攻击最小值加成
        }
        
        // 易水心法加成
        const yishuiCheckbox = document.getElementById('diy-yishui');
        if (yishuiCheckbox && yishuiCheckbox.checked) {
            heartMethodMinBonus += 24.8; // 易水心法外功攻击最小值加成
            heartMethodMaxBonus += 49.6; // 易水心法外功攻击最大值加成
        }
        
        // 极乐心法加成
        const jileCheckbox = document.getElementById('diy-jile');
        if (jileCheckbox && jileCheckbox.checked) {
            heartMethodMaxBonus += 59.5; // 极乐心法外功攻击最大值加成
        }
        
        // 计算敏模块联动最小外功加成
        let minModuleLinkageBonus = 0;
        const minCalculated1 = document.getElementById('diy-min-calculated-1');
        if (minCalculated1) {
            const minCalc1 = parseFloat(minCalculated1.value) || 0;
            const minSteps = Math.min(Math.max(minCalc1, 0), 127);
            minModuleLinkageBonus = minSteps * 0.264; // 敏模块联动最小外功加成
        }
        
        // 计算新的外功攻击值（基础值 + 叠音值 + 装备基础值 + 武库加成 + 装备加成 + 心法加成 + 大外计算结果 + 小外计算结果 + 敏第二个计算结果 + 劲第二个计算结果 + 势第二个计算结果 + 敏模块联动加成）
        const newMinValue = baseMinValue + quickMinValue + equipmentMinValue + wukuMinBonus + equipmentMinBonus + heartMethodMinBonus + xiaowaiValue + minValue2 + jinValue2 + minModuleLinkageBonus;
        const newMaxValue = baseMaxValue + quickMaxValue + equipmentMaxValue + wukuMaxBonus + heartMethodMaxBonus + dawaiValue + jinValue3 + shiValue2;
        
        // 更新外功攻击输入框的值（保留整数）
        externalMinInput.value = Math.round(newMinValue);
        externalMaxInput.value = Math.round(newMaxValue);
        
        // 更新破竹攻击（如果有破竹武库加成）
        if (breakBambooMinInput && breakBambooMaxInput) {
            // 调用破竹攻击综合计算函数
            updateBreakBambooAttackFromAllSources();
        }
        
        console.log(`综合更新: 外功攻击=${newMinValue}-${newMaxValue} (基础${baseMinValue}-${baseMaxValue} + 叠音${quickMinValue}-${quickMaxValue} + 装备${equipmentMinValue}-${equipmentMaxValue} + 武库${wukuMinBonus}-${wukuMaxBonus} + 心法${heartMethodMinBonus}-${heartMethodMaxBonus} + 大外${dawaiValue} + 小外${xiaowaiValue} + 敏2${minValue2} + 劲2${jinValue2} + 劲3${jinValue3} + 势2${shiValue2} + 敏联动${minModuleLinkageBonus.toFixed(1)}), 武库选择=${wukuValue}`);
        
        // 触发输入事件，确保其他监听器也能响应
        externalMinInput.dispatchEvent(new Event('input', { bubbles: true }));
        externalMaxInput.dispatchEvent(new Event('input', { bubbles: true }));
        
    } catch (error) {
        console.error('更新外功攻击值时发生错误:', error);
    }
}

// 综合更新破竹攻击值（处理所有累加源）
function updateBreakBambooAttackFromAllSources() {
    try {
        const wukuSelect = document.getElementById('diy-wuku-select');
        const dapoCalculated = document.getElementById('diy-dapo-calculated');
        const xiaopoCalculated = document.getElementById('diy-xiaopo-calculated');
        const breakBambooMinInput = document.getElementById('diy-break-bamboo-attack-min');
        const breakBambooMaxInput = document.getElementById('diy-break-bamboo-attack-max');
        
        if (!breakBambooMinInput || !breakBambooMaxInput) {
            console.error('找不到破竹攻击输入元素！');
            return;
        }
        
        // 获取基础值
        const baseBreakBambooMinValue = 196; // 破竹攻击基础最小值
        const baseBreakBambooMaxValue = 392; // 破竹攻击基础最大值
        
        // 获取大破计算结果的值
        const dapoValue = parseFloat(dapoCalculated?.value) || 0;
        
        // 获取小破计算结果的值
        const xiaopoValue = parseFloat(xiaopoCalculated?.value) || 0;
        
        // 获取武库选择的值
        const wukuValue = wukuSelect?.value || '无';
        
        // 计算武库加成
        let breakBambooMinBonus = 0;
        let breakBambooMaxBonus = 0;
        
        if (wukuValue === '破竹') {
            breakBambooMinBonus = 131; // 破竹武库破竹攻击最小值加成
            breakBambooMaxBonus = 263; // 破竹武库破竹攻击最大值加成
        }
        
        // 计算心法加成
        let heartMethodBreakBambooMinBonus = 0;
        const niyuCheckbox = document.getElementById('diy-niyu');
        if (niyuCheckbox && niyuCheckbox.checked) {
            heartMethodBreakBambooMinBonus += 38; // 泥鱼心法破竹攻击最小值加成
        }
        
        // 计算新的破竹攻击值（基础值 + 武库加成 + 心法加成 + 大破计算结果 + 小破计算结果）
        const newBreakBambooMinValue = baseBreakBambooMinValue + breakBambooMinBonus + heartMethodBreakBambooMinBonus + xiaopoValue;
        const newBreakBambooMaxValue = baseBreakBambooMaxValue + breakBambooMaxBonus + dapoValue;
        
        // 更新破竹攻击输入框的值（保留整数）
        breakBambooMinInput.value = Math.round(newBreakBambooMinValue);
        breakBambooMaxInput.value = Math.round(newBreakBambooMaxValue);
        
        console.log(`破竹攻击综合更新: 破竹攻击=${newBreakBambooMinValue}-${newBreakBambooMaxValue} (基础${baseBreakBambooMinValue}-${baseBreakBambooMaxValue} + 武库${breakBambooMinBonus}-${breakBambooMaxBonus} + 大破${dapoValue} + 小破${xiaopoValue}), 武库选择=${wukuValue}`);
        
        // 触发输入事件，确保其他监听器也能响应
        breakBambooMinInput.dispatchEvent(new Event('input', { bubbles: true }));
        breakBambooMaxInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // 更新属攻穿透和属攻伤害加成
        updateElementalStatsFromBreakBamboo();
        
    } catch (error) {
        console.error('更新破竹攻击值时发生错误:', error);
    }
}

// 综合更新裂石攻击值（处理所有累加源）
function updateBreakRockAttackFromAllSources() {
    try {
        const xiaolieCalculated = document.getElementById('diy-xiaolie-calculated');
        const breakRockMinInput = document.getElementById('diy-break-rock-attack-min');
        const breakRockMaxInput = document.getElementById('diy-break-rock-attack-max');
        
        if (!breakRockMinInput || !breakRockMaxInput) {
            console.error('找不到裂石攻击输入元素！');
            return;
        }
        
        // 获取基础值
        const baseBreakRockMinValue = 0; // 裂石攻击基础最小值
        const baseBreakRockMaxValue = 0; // 裂石攻击基础最大值
        
        // 获取小裂计算结果的值
        const xiaolieValue = parseFloat(xiaolieCalculated?.value) || 0;
        
        // 计算新的裂石攻击值（基础值 + 小裂计算结果）
        const newBreakRockMinValue = baseBreakRockMinValue + xiaolieValue;
        const newBreakRockMaxValue = baseBreakRockMaxValue + xiaolieValue;
        
        // 更新裂石攻击输入框的值（保留整数）
        breakRockMinInput.value = Math.round(newBreakRockMinValue);
        breakRockMaxInput.value = Math.round(newBreakRockMaxValue);
        
        console.log(`裂石攻击综合更新: 裂石攻击=${newBreakRockMinValue}-${newBreakRockMaxValue} (基础${baseBreakRockMinValue}-${baseBreakRockMaxValue} + 小裂${xiaolieValue})`);
        
        // 触发输入事件，确保其他监听器也能响应
        breakRockMinInput.dispatchEvent(new Event('input', { bubbles: true }));
        breakRockMaxInput.dispatchEvent(new Event('input', { bubbles: true }));
        
    } catch (error) {
        console.error('更新裂石攻击值时发生错误:', error);
    }
}

// 综合更新精准率（处理所有累加源）
function updatePrecisionRateFromAllSources() {
    try {
        const precisionCalculated = document.getElementById('diy-precision-calculated');
        const precisionRateInput = document.getElementById('diy-precision-rate');
        const equipmentSelect = document.getElementById('diy-equipment-select');
        const bowSelect = document.getElementById('diy-bow-select');
        
        if (!precisionRateInput) {
            console.error('找不到精准率输入元素！');
            return;
        }
        
        // 获取基础精准率值
        const basePrecisionRate = 65; // 基础精准率
        
        // 获取精准计算结果的值
        const precisionValue = parseFloat(precisionCalculated?.value) || 0;
        
        // 已有精准值
        const existingPrecisionValue = 31.8;
        
        // 计算装备加成
        let equipmentBonus = 0;
        const equipmentValue = equipmentSelect?.value || '无';
        if (equipmentValue === '时雨') {
            equipmentBonus = 8; // 时雨装备加成
        }
        
        // 计算弓箭加成
        let bowBonus = 0;
        const bowValue = bowSelect?.value || '无';
        if (bowValue === '精准') {
            bowBonus = 4; // 精准弓箭加成
        }
        
        // 计算心法加成
        let heartMethodBonus = 0;
        const duanshiCheckbox = document.getElementById('diy-duanshi');
        if (duanshiCheckbox && duanshiCheckbox.checked) {
            heartMethodBonus += 6.9; // 断石心法精准率加成
        }
        
        // 计算新的精准率值（基础值 + 精准计算结果 + 装备加成 + 弓箭加成 + 心法加成）
        const newPrecisionRate = basePrecisionRate + precisionValue + equipmentBonus + bowBonus + heartMethodBonus;
        
        // 精准值=基础值+（已有精准值+其他参数之和）/1.65
        const otherParamsSum = existingPrecisionValue + precisionValue + equipmentBonus + bowBonus + heartMethodBonus;
        const displayPrecisionValue = basePrecisionRate + (otherParamsSum / 1.65);
        
        // 更新精准率输入框的值
        precisionRateInput.value = preciseRound(displayPrecisionValue, 1);
        
        console.log(`精准率综合更新: 计算值=${newPrecisionRate.toFixed(1)}, 显示值=${displayPrecisionValue.toFixed(1)} (基础${basePrecisionRate} + 已有精准${existingPrecisionValue} + 精准${precisionValue} + 装备${equipmentBonus.toFixed(1)} + 弓箭${bowBonus.toFixed(1)} + 心法${heartMethodBonus.toFixed(1)})`);
        
        // 触发输入事件，确保其他监听器也能响应
        precisionRateInput.dispatchEvent(new Event('input', { bubbles: true }));
        
    } catch (error) {
        console.error('更新精准率值时发生错误:', error);
    }
}

// 综合更新会心率（处理所有累加源）
function updateCritRateFromAllSources() {
    try {
        const critCalculated = document.getElementById('diy-crit-calculated');
        const minCalculated3 = document.getElementById('diy-min-calculated-3');
        const critRateInput = document.getElementById('diy-critical-rate');
        const equipmentSelect = document.getElementById('diy-equipment-select');
        const bowSelect = document.getElementById('diy-bow-select');
        
        if (!critRateInput) {
            console.error('找不到会心率输入元素！');
            return;
        }
        
        // 获取基础会心率值
        const baseCritRate = 40.3; // 基础会心率
        
        // 获取会心计算结果的值
        const critValue = parseFloat(critCalculated?.value) || 0;
        
        // 获取敏第三个计算结果的值
        const minValue3 = parseFloat(minCalculated3?.value) || 0;
        
        // 计算装备加成
        let equipmentBonus = 0;
        const equipmentValue = equipmentSelect?.value || '无';
        if (equipmentValue === '浣花') {
            equipmentBonus = 9; // 浣花装备加成
        }
        
        // 计算弓箭加成
        let bowBonus = 0;
        const bowValue = bowSelect?.value || '无';
        if (bowValue === '会心') {
            bowBonus = 4.5; // 会心弓箭加成
        }
        
        // 计算心法加成
        let heartMethodBonus = 0;
        const wangchuanCheckbox = document.getElementById('diy-wangchuan');
        if (wangchuanCheckbox && wangchuanCheckbox.checked) {
            heartMethodBonus += 8.6; // 忘川心法会心率加成
        }
        
        // 计算敏模块联动会心率加成
        let minModuleLinkageBonus = 0;
        const minCalculated1 = document.getElementById('diy-min-calculated-1');
        if (minCalculated1) {
            const minCalc1 = parseFloat(minCalculated1.value) || 0;
            const minSteps = Math.min(Math.max(minCalc1, 0), 127);
            minModuleLinkageBonus = Math.min(minSteps * 0.0305, 2.1); // 敏模块联动会心率加成，最大值为2.1
        }
        
        // 计算新的会心率值（基础值 + 会心计算结果 + 敏第三个计算结果 + 装备加成 + 弓箭加成 + 心法加成 + 敏模块联动加成）
        const newCritRate = baseCritRate + critValue + minValue3 + equipmentBonus + bowBonus + heartMethodBonus + minModuleLinkageBonus;
        
        // 将计算的会心值除以1.45后再显示在会心率文本框
        const displayCritRate = newCritRate / 1.65;
        
        // 更新会心率输入框的值
        critRateInput.value = preciseRound(displayCritRate, 1);
        
        console.log(`会心率综合更新: 计算值=${newCritRate.toFixed(1)}, 显示值=${displayCritRate.toFixed(1)} (基础${baseCritRate} + 会心${critValue} + 敏3${minValue3} + 装备${equipmentBonus.toFixed(1)} + 弓箭${bowBonus.toFixed(1)} + 心法${heartMethodBonus.toFixed(1)} + 敏联动${minModuleLinkageBonus.toFixed(1)})`);
        
        // 触发输入事件，确保其他监听器也能响应
        critRateInput.dispatchEvent(new Event('input', { bubbles: true }));
        
    } catch (error) {
        console.error('更新会心率值时发生错误:', error);
    }
}

// 综合更新会意率（处理所有累加源）
function updateIntentRateFromAllSources() {
    try {
        const intentCalculated = document.getElementById('diy-intent-calculated');
        const shiCalculated3 = document.getElementById('diy-shi-calculated-3');
        const intentRateInput = document.getElementById('diy-intent-rate');
        const equipmentSelect = document.getElementById('diy-equipment-select');
        const bowSelect = document.getElementById('diy-bow-select');
        
        if (!intentRateInput) {
            console.error('找不到会意率输入元素！');
            return;
        }
        
        // 获取基础会意率值
        const baseIntentRate = 17.8; // 基础会意率
        
        // 获取会意计算结果的值
        const intentValue = parseFloat(intentCalculated?.value) || 0;
        
        // 获取势第三个计算结果的值
        const shiValue3 = parseFloat(shiCalculated3?.value) || 0;
        
        // 计算装备加成
        let equipmentBonus = 0;
        const equipmentValue = equipmentSelect?.value || '无';
        if (equipmentValue === '飞隼') {
            equipmentBonus = 4.5; // 飞隼装备加成
        }
        
        // 计算弓箭加成
        let bowBonus = 0;
        const bowValue = bowSelect?.value || '无';
        if (bowValue === '会意') {
            bowBonus = 2.2; // 会意弓箭加成
        }
        
        // 计算新的会意率值（基础值 + 会意计算结果 + 势第三个计算结果 + 装备加成 + 弓箭加成）
        const newIntentRate = baseIntentRate + intentValue + shiValue3 + equipmentBonus + bowBonus;
        
        // 将计算的会意值除以1.45后再显示在会意率文本框
        const displayIntentRate = newIntentRate / 1.65;
        
        // 更新会意率输入框的值
        intentRateInput.value = preciseRound(displayIntentRate, 1);
        
        console.log(`会意率综合更新: 计算值=${newIntentRate.toFixed(1)}, 显示值=${displayIntentRate.toFixed(1)} (基础${baseIntentRate} + 会意${intentValue} + 势3${shiValue3} + 装备${equipmentBonus.toFixed(1)} + 弓箭${bowBonus.toFixed(1)})`);
        
        // 触发输入事件，确保其他监听器也能响应
        intentRateInput.dispatchEvent(new Event('input', { bubbles: true }));
        
    } catch (error) {
        console.error('更新会意率值时发生错误:', error);
    }
}

// 初始化复选框功能
function initCheckboxFunctions() {
    try {
        // 绳镖武学复选框
        const ropeDartCheckbox = document.getElementById('diy-rope-dart-martial');
        if (ropeDartCheckbox) {
            ropeDartCheckbox.addEventListener('change', updateRopeDartBonus);
        }
        
        // 双刀武学复选框
        const dualBladeCheckbox = document.getElementById('diy-dual-blade-martial');
        if (dualBladeCheckbox) {
            dualBladeCheckbox.addEventListener('change', updateDualBladeBonus);
        }
        
        // 首领单位复选框
        const bossUnitCheckbox1 = document.getElementById('diy-boss-unit-1');
        const bossUnitCheckbox2 = document.getElementById('diy-boss-unit-2');
        if (bossUnitCheckbox1) {
            bossUnitCheckbox1.addEventListener('change', updateBossUnitBonus);
        }
        if (bossUnitCheckbox2) {
            bossUnitCheckbox2.addEventListener('change', updateBossUnitBonus);
        }
        
        // 全武学复选框
        const allMartialCheckbox1 = document.getElementById('diy-all-martial-1');
        const allMartialCheckbox2 = document.getElementById('diy-all-martial-2');
        if (allMartialCheckbox1) {
            allMartialCheckbox1.addEventListener('change', updateAllMartialBonus);
        }
        if (allMartialCheckbox2) {
            allMartialCheckbox2.addEventListener('change', updateAllMartialBonus);
        }
        
        // 心法选择复选框
        const wangchuanCheckbox = document.getElementById('diy-wangchuan');
        const niyuCheckbox = document.getElementById('diy-niyu');
        const yishuiCheckbox = document.getElementById('diy-yishui');
        const duanshiCheckbox = document.getElementById('diy-duanshi');
        const jileCheckbox = document.getElementById('diy-jile');
        const zhengrenCheckbox = document.getElementById('diy-zhengren');
        
        if (wangchuanCheckbox) {
            wangchuanCheckbox.addEventListener('change', updateWangchuanBonus);
        }
        if (niyuCheckbox) {
            niyuCheckbox.addEventListener('change', updateNiyuBonus);
        }
        if (yishuiCheckbox) {
            yishuiCheckbox.addEventListener('change', updateYishuiBonus);
        }
        if (duanshiCheckbox) {
            duanshiCheckbox.addEventListener('change', updateDuanshiBonus);
        }
        if (jileCheckbox) {
            jileCheckbox.addEventListener('change', updateJileBonus);
        }
        if (zhengrenCheckbox) {
            zhengrenCheckbox.addEventListener('change', updateZhengrenBonus);
        }
        
        console.log('复选框功能初始化完成');
        
        // 初始化心法选择限制
        limitXinfaSelection();
        
    } catch (error) {
        console.error('初始化复选框功能时发生错误:', error);
    }
}

// 更新绳镖武学增伤
function updateRopeDartBonus() {
    try {
        const checkbox = document.getElementById('diy-rope-dart-martial');
        const bonusInput = document.getElementById('diy-rope-dart-bonus');
        
        if (!checkbox || !bonusInput) {
            console.error('找不到绳镖武学相关元素！');
            return;
        }
        
        const currentValue = parseFloat(bonusInput.value) || 0;
        const bonusValue = checkbox.checked ? 6.4 : -6.4;
        const newValue = Math.max(0, currentValue + bonusValue);
        
        bonusInput.value = preciseRound(newValue, 1);
        
        console.log(`绳镖武学增伤更新: ${checkbox.checked ? '+' : '-'}6.4, 新值: ${newValue.toFixed(1)}`);
        
        // 触发输入事件
        bonusInput.dispatchEvent(new Event('input', { bubbles: true }));
        
    } catch (error) {
        console.error('更新绳镖武学增伤时发生错误:', error);
    }
}

// 更新双刀武学增伤
function updateDualBladeBonus() {
    try {
        const checkbox = document.getElementById('diy-dual-blade-martial');
        const bonusInput = document.getElementById('diy-dual-blades-bonus');
        
        if (!checkbox || !bonusInput) {
            console.error('找不到双刀武学相关元素！');
            return;
        }
        
        const currentValue = parseFloat(bonusInput.value) || 0;
        const bonusValue = checkbox.checked ? 6.4 : -6.4;
        const newValue = Math.max(0, currentValue + bonusValue);
        
        bonusInput.value = preciseRound(newValue, 1);
        
        console.log(`双刀武学增伤更新: ${checkbox.checked ? '+' : '-'}6.4, 新值: ${newValue.toFixed(1)}`);
        
        // 触发输入事件
        bonusInput.dispatchEvent(new Event('input', { bubbles: true }));
        
    } catch (error) {
        console.error('更新双刀武学增伤时发生错误:', error);
    }
}

// 更新首领单位增伤
function updateBossUnitBonus() {
    try {
        const checkbox1 = document.getElementById('diy-boss-unit-1');
        const checkbox2 = document.getElementById('diy-boss-unit-2');
        const bonusInput = document.getElementById('diy-boss-unit-bonus');
        
        if (!checkbox1 || !checkbox2 || !bonusInput) {
            console.error('找不到首领单位相关元素！');
            return;
        }
        
        const currentValue = parseFloat(bonusInput.value) || 0;
        
        // 计算当前应该的增伤值
        let targetValue = 0;
        if (checkbox1.checked) targetValue += 3.2;
        if (checkbox2.checked) targetValue += 3.2;
        
        bonusInput.value = preciseRound(targetValue, 1);
        
        console.log(`首领单位增伤更新: 复选框1=${checkbox1.checked}, 复选框2=${checkbox2.checked}, 新值: ${targetValue.toFixed(1)}`);
        
        // 触发输入事件
        bonusInput.dispatchEvent(new Event('input', { bubbles: true }));
        
    } catch (error) {
        console.error('更新首领单位增伤时发生错误:', error);
    }
}

// 更新全武学增伤
function updateAllMartialBonus() {
    try {
        const checkbox1 = document.getElementById('diy-all-martial-1');
        const checkbox2 = document.getElementById('diy-all-martial-2');
        const bonusInput = document.getElementById('diy-all-martial-bonus');
        
        if (!checkbox1 || !checkbox2 || !bonusInput) {
            console.error('找不到全武学相关元素！');
            return;
        }
        
        const currentValue = parseFloat(bonusInput.value) || 0;
        
        // 计算当前应该的增伤值
        let targetValue = 0;
        if (checkbox1.checked) targetValue += 3.2;
        if (checkbox2.checked) targetValue += 3.2;
        
        bonusInput.value = preciseRound(targetValue, 1);
        
        console.log(`全武学增伤更新: 复选框1=${checkbox1.checked}, 复选框2=${checkbox2.checked}, 新值: ${targetValue.toFixed(1)}`);
        
        // 触发输入事件
        bonusInput.dispatchEvent(new Event('input', { bubbles: true }));
        
    } catch (error) {
        console.error('更新全武学增伤时发生错误:', error);
    }
}

// 心法选择限制函数 - 最多选择4个心法
function limitXinfaSelection() {
    try {
        // 获取所有心法复选框
        const xinfaCheckboxes = [
            document.getElementById('diy-wangchuan'),
            document.getElementById('diy-niyu'),
            document.getElementById('diy-yishui'),
            document.getElementById('diy-duanshi'),
            document.getElementById('diy-jile'),
            document.getElementById('diy-zhengren')
        ].filter(checkbox => checkbox !== null);
        
        // 计算当前选中的心法数量
        const selectedCount = xinfaCheckboxes.filter(checkbox => checkbox.checked).length;
        
        // 如果选中数量达到4个，禁用未选中的复选框
        if (selectedCount >= 4) {
            xinfaCheckboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.disabled = true;
                }
            });
        } else {
            // 如果选中数量少于4个，启用所有复选框
            xinfaCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
        }
        
        // 更新心法选择计数显示
        updateXinfaSelectionCount(selectedCount);
        
        console.log(`心法选择限制更新: 已选中${selectedCount}个心法`);
        
    } catch (error) {
        console.error('心法选择限制函数执行错误:', error);
    }
}

// 更新心法选择计数显示
function updateXinfaSelectionCount(count) {
    try {
        // 查找心法选择标题
        const xinfaTitle = document.querySelector('h4');
        if (xinfaTitle && xinfaTitle.textContent.includes('心法选择')) {
            // 更新标题显示当前选择数量
            const baseTitle = '心法选择';
            const countText = ` (${count}/4)`;
            xinfaTitle.textContent = baseTitle + countText;
            
            // 如果超过4个，添加警告样式
            if (count >= 4) {
                xinfaTitle.classList.add('over-limit');
            } else {
                xinfaTitle.classList.remove('over-limit');
            }
        }
    } catch (error) {
        console.error('更新心法选择计数显示时发生错误:', error);
    }
}

// 更新忘川心法加成
function updateWangchuanBonus() {
    try {
        const checkbox = document.getElementById('diy-wangchuan');
        
        if (!checkbox) {
            console.error('找不到忘川心法相关元素！');
            return;
        }
        
        console.log(`忘川心法${checkbox.checked ? '启用' : '禁用'}: 会心率${checkbox.checked ? '+' : '-'}8.6, 会心伤害加成${checkbox.checked ? '+' : '-'}4.4`);
        
        // 触发综合更新，让综合更新函数处理心法加成
        updateCritRateFromAllSources();
        
        // 会心伤害加成需要单独处理，因为它不在综合更新函数中
        const critDamageBonusInput = document.getElementById('diy-critical-damage-bonus');
        if (critDamageBonusInput) {
            const currentCritDamageBonus = parseFloat(critDamageBonusInput.value) || 0;
            const critDamageBonus = checkbox.checked ? 4.4 : -4.4;
            const newCritDamageBonus = Math.max(0, currentCritDamageBonus + critDamageBonus);
            critDamageBonusInput.value = preciseRound(newCritDamageBonus, 1);
            critDamageBonusInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // 调用心法选择限制函数
        limitXinfaSelection();
        
    } catch (error) {
        console.error('更新忘川心法加成时发生错误:', error);
    }
}

// 更新泥鱼心法加成
function updateNiyuBonus() {
    try {
        const checkbox = document.getElementById('diy-niyu');
        
        if (!checkbox) {
            console.error('找不到泥鱼心法相关元素！');
            return;
        }
        
        console.log(`泥鱼心法${checkbox.checked ? '启用' : '禁用'}: 破竹最小攻击${checkbox.checked ? '+' : '-'}38, 属攻穿透${checkbox.checked ? '+' : '-'}6`);
        
        // 触发综合更新，让综合更新函数处理心法加成
        updateBreakBambooAttackFromAllSources();
        
        // 更新属攻穿透和属攻伤害加成
        updateElementalStatsFromBreakBamboo();
        
        // 调用心法选择限制函数
        limitXinfaSelection();
        
    } catch (error) {
        console.error('更新泥鱼心法加成时发生错误:', error);
    }
}

// 更新易水心法加成
function updateYishuiBonus() {
    try {
        const checkbox = document.getElementById('diy-yishui');
        
        if (!checkbox) {
            console.error('找不到易水心法相关元素！');
            return;
        }
        
        console.log(`易水心法${checkbox.checked ? '启用' : '禁用'}: 外功最小值${checkbox.checked ? '+' : '-'}24.8, 外功最大值${checkbox.checked ? '+' : '-'}49.6, 直接会心率${checkbox.checked ? '+' : '-'}4.6`);
        
        // 使用综合更新函数，而不是直接修改输入框
        updateExternalAttackFromAllSources();
        
        // 直接会心率需要单独处理，因为它不在综合更新函数中
        const directCritRateInput = document.getElementById('diy-direct-critical-rate');
        if (directCritRateInput) {
            const currentDirectCritRate = parseFloat(directCritRateInput.value) || 0;
            const directCritRateBonus = checkbox.checked ? 4.6 : -4.6;
            const newDirectCritRate = Math.max(0, currentDirectCritRate + directCritRateBonus);
            directCritRateInput.value = preciseRound(newDirectCritRate, 1);
            directCritRateInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // 调用心法选择限制函数
        limitXinfaSelection();
        
    } catch (error) {
        console.error('更新易水心法加成时发生错误:', error);
    }
}

// 更新断石心法加成
function updateDuanshiBonus() {
    try {
        const checkbox = document.getElementById('diy-duanshi');
        
        if (!checkbox) {
            console.error('找不到断石心法相关元素！');
            return;
        }
        
        console.log(`断石心法${checkbox.checked ? '启用' : '禁用'}: 精准率${checkbox.checked ? '+' : '-'}6.9, 直接会心率${checkbox.checked ? '+' : '-'}4.1`);
        
        // 触发综合更新，让综合更新函数处理心法加成
        updatePrecisionRateFromAllSources();
        
        // 直接会心率需要单独处理，因为它不在综合更新函数中
        const directCritRateInput = document.getElementById('diy-direct-critical-rate');
        if (directCritRateInput) {
            const currentDirectCritRate = parseFloat(directCritRateInput.value) || 0;
            const directCritRateBonus = checkbox.checked ? 4.1 : -4.1;
            const newDirectCritRate = Math.max(0, currentDirectCritRate + directCritRateBonus);
            directCritRateInput.value = preciseRound(newDirectCritRate, 1);
            directCritRateInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // 调用心法选择限制函数
        limitXinfaSelection();
        
    } catch (error) {
        console.error('更新断石心法加成时发生错误:', error);
    }
}

// 更新极乐心法加成
function updateJileBonus() {
    try {
        const checkbox = document.getElementById('diy-jile');
        
        if (!checkbox) {
            console.error('找不到极乐心法相关元素！');
            return;
        }
        
        console.log(`极乐心法${checkbox.checked ? '启用' : '禁用'}: 外功最大值${checkbox.checked ? '+' : '-'}59.5, 会心伤害加成${checkbox.checked ? '+' : '-'}3.5`);
        
        // 触发综合更新，让综合更新函数处理心法加成
        updateExternalAttackFromAllSources();
        
        // 会心伤害加成需要单独处理，因为它不在综合更新函数中
        const critDamageBonusInput = document.getElementById('diy-critical-damage-bonus');
        if (critDamageBonusInput) {
            const currentCritDamageBonus = parseFloat(critDamageBonusInput.value) || 0;
            const critDamageBonus = checkbox.checked ? 3.5 : -3.5;
            const newCritDamageBonus = Math.max(0, currentCritDamageBonus + critDamageBonus);
            critDamageBonusInput.value = preciseRound(newCritDamageBonus, 1);
            critDamageBonusInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // 调用心法选择限制函数
        limitXinfaSelection();
        
    } catch (error) {
        console.error('更新极乐心法加成时发生错误:', error);
    }
}

// 更新征人心法加成
function updateZhengrenBonus() {
    try {
        const checkbox = document.getElementById('diy-zhengren');
        
        if (!checkbox) {
            console.error('找不到征人心法相关元素！');
            return;
        }
        
        console.log(`征人心法${checkbox.checked ? '启用' : '禁用'}: 外功最小值${checkbox.checked ? '+' : '-'}66.9, 外功穿透${checkbox.checked ? '+' : '-'}5.1`);
        
        // 触发综合更新，让综合更新函数处理心法加成
        updateExternalAttackFromAllSources();
        
        // 外功穿透需要单独处理，因为它不在综合更新函数中
        const externalPenetrationInput = document.getElementById('diy-external-penetration');
        if (externalPenetrationInput) {
            const currentExternalPenetration = parseFloat(externalPenetrationInput.value) || 0;
            const externalPenetrationBonus = checkbox.checked ? 5.1 : -5.1;
            const newExternalPenetration = Math.max(0, currentExternalPenetration + externalPenetrationBonus);
            externalPenetrationInput.value = preciseRound(newExternalPenetration, 1);
            externalPenetrationInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // 调用心法选择限制函数
        limitXinfaSelection();
        
    } catch (error) {
        console.error('更新征人心法加成时发生错误:', error);
    }
}

// 数值格式化函数 - 确保显示1位小数
function formatToOneDecimal(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.0';
    return num.toFixed(1);
}

// 为所有数值输入框添加格式化事件监听器
function addNumberFormatListeners() {
    // 获取所有step为1的整数输入框
    const integerInputs = document.querySelectorAll('input[type="number"][step="1"]');
    
    integerInputs.forEach(input => {
        // 当输入框失去焦点时确保为整数
        input.addEventListener('blur', function() {
            if (this.value !== '') {
                this.value = Math.floor(parseFloat(this.value) || 0);
            }
        });
        
        // 当输入框值改变时也确保为整数
        input.addEventListener('change', function() {
            if (this.value !== '') {
                this.value = Math.floor(parseFloat(this.value) || 0);
            }
        });
        
        // 阻止输入小数点
        input.addEventListener('keypress', function(e) {
            if (e.key === '.' || e.key === ',') {
                e.preventDefault();
            }
        });
    });
}

// 页面加载完成后添加格式化监听器

// DIY数量计算函数
function calculateDiyCount() {
    try {
        let totalCount = 0;
        
        // 统计所有DIY模块的文本框数值（非只读的输入框）
        const diyInputs = [
            'diy-dawai-display',
            'diy-xiaowai-display', 
            'diy-dapo-display',
            'diy-xiaopo-display',
            'diy-xiaolie-display',
            'diy-precision-display',
            'diy-crit-display',
            'diy-intent-display',
            'diy-min-display',
            'diy-jin-display',
            'diy-shi-display'
        ];
        
        // 计算文本框数值总和
        diyInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                const value = parseFloat(input.value) || 0;
                totalCount += value;
            }
        });
        
        // 统计DIY模块的复选框数量（仅包括武学增伤，不包括心法选择）
        const diyCheckboxes = [
            // 武学增伤复选框
            'diy-rope-dart-martial',
            'diy-boss-unit-1',
            'diy-boss-unit-2',
            'diy-dual-blade-martial',
            'diy-all-martial-1',
            'diy-all-martial-2'
        ];
        
        // 计算选中的复选框数量
        diyCheckboxes.forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox && checkbox.checked) {
                totalCount += 1;
            }
        });
        
        // 更新显示
        updateDiyCountDisplay(totalCount);
        
        console.log(`DIY计数更新: 当前总数为${totalCount}`);
        
    } catch (error) {
        console.error('计算DIY数量时发生错误:', error);
    }
}

// 更新DIY计数显示
function updateDiyCountDisplay(count) {
    try {
        const displayElement = document.getElementById('diy-count-display');
        if (displayElement) {
            displayElement.textContent = `(${count})`;
            
            // 根据数量添加不同的样式
            if (count > 40) {
                displayElement.style.color = '#dc2626'; // 红色，表示超过40
                displayElement.style.fontWeight = '700';
            } else if (count === 40) {
                displayElement.style.color = '#f59e0b'; // 橙色，表示正好40
                displayElement.style.fontWeight = '600';
            } else {
                displayElement.style.color = '#3b82f6'; // 蓝色，正常状态（0-39）
                displayElement.style.fontWeight = '600';
            }
        }
    } catch (error) {
        console.error('更新DIY计数显示时发生错误:', error);
    }
}

// 为DIY模块添加事件监听器
function addDiyCountListeners() {
    try {
        // 为所有DIY输入框添加事件监听器
        const diyInputs = [
            'diy-dawai-display',
            'diy-xiaowai-display', 
            'diy-dapo-display',
            'diy-xiaopo-display',
            'diy-xiaolie-display',
            'diy-precision-display',
            'diy-crit-display',
            'diy-intent-display',
            'diy-min-display',
            'diy-jin-display',
            'diy-shi-display'
        ];
        
        diyInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                // 监听输入值变化
                input.addEventListener('input', calculateDiyCount);
                input.addEventListener('change', calculateDiyCount);
                console.log(`为输入框 ${inputId} 添加了DIY计数监听器`);
            } else {
                console.warn(`未找到输入框: ${inputId}`);
            }
        });
        
        // 为精准率输入框添加100的上限验证
        const precisionRateInput = document.getElementById('diy-precision-rate');
        if (precisionRateInput) {
            precisionRateInput.addEventListener('input', function() {
                const value = parseFloat(this.value);
                if (value > 100) {
                    this.value = 100;
                }
            });
            precisionRateInput.addEventListener('change', function() {
                const value = parseFloat(this.value);
                if (value > 100) {
                    this.value = 100;
                }
            });
            console.log('为精准率输入框添加了100的上限验证');
        }
        
        // 为会心率输入框添加80的上限验证
        const criticalRateInput = document.getElementById('diy-critical-rate');
        if (criticalRateInput) {
            criticalRateInput.addEventListener('input', function() {
                const value = parseFloat(this.value);
                if (value > 80) {
                    this.value = 80;
                }
            });
            criticalRateInput.addEventListener('change', function() {
                const value = parseFloat(this.value);
                if (value > 80) {
                    this.value = 80;
                }
            });
            console.log('为会心率输入框添加了80的上限验证');
        }
        
        // 为DIY复选框添加事件监听器（仅包括武学增伤，不包括心法选择）
        const diyCheckboxes = [
            // 武学增伤复选框
            'diy-rope-dart-martial',
            'diy-boss-unit-1',
            'diy-boss-unit-2',
            'diy-dual-blade-martial',
            'diy-all-martial-1',
            'diy-all-martial-2'
        ];
        
        diyCheckboxes.forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                // 监听复选框状态变化
                checkbox.addEventListener('change', calculateDiyCount);
                console.log(`为复选框 ${checkboxId} 添加了DIY计数监听器`);
            } else {
                console.warn(`未找到复选框: ${checkboxId}`);
            }
        });
        
        console.log('DIY计数事件监听器添加完成');
        
    } catch (error) {
        console.error('添加DIY计数事件监听器时发生错误:', error);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    addNumberFormatListeners();
    
    // 添加DIY计数事件监听器
    addDiyCountListeners();
    
    // 初始化DIY计数显示
    calculateDiyCount();
    
    // 初始化攻击输入框验证
    initAttackInputValidation();
    
});

// 初始化攻击输入框验证功能
function initAttackInputValidation() {
    try {
        // 攻击输入框配置
        const attackInputs = [
            {
                minId: 'ring-metal-attack-min',
                maxId: 'ring-metal-attack-max',
                name: '鸣金攻击'
            },
            {
                minId: 'break-rock-attack-min',
                maxId: 'break-rock-attack-max',
                name: '裂石攻击'
            },
            {
                minId: 'pull-silk-attack-min',
                maxId: 'pull-silk-attack-max',
                name: '牵丝攻击'
            },
            {
                minId: 'break-bamboo-attack-min',
                maxId: 'break-bamboo-attack-max',
                name: '破竹攻击'
            }
        ];

        // 为每个攻击输入框添加验证
        attackInputs.forEach(attack => {
            const minInput = document.getElementById(attack.minId);
            const maxInput = document.getElementById(attack.maxId);
            
            if (minInput && maxInput) {
                // 为最小值和最大值输入框添加输入事件监听器
                minInput.addEventListener('input', createValidationHandler(attack.name, minInput, maxInput));
                maxInput.addEventListener('input', createValidationHandler(attack.name, minInput, maxInput));
                
                console.log(`已为${attack.name}添加输入验证`);
            } else {
                console.warn(`找不到${attack.name}的输入框元素`);
            }
        });
        
        console.log('攻击输入框验证功能初始化完成');
    } catch (error) {
        console.error('初始化攻击输入框验证时发生错误:', error);
    }
}

// 创建验证处理函数（带1秒延迟）
function createValidationHandler(attackName, minInput, maxInput) {
    let timeoutId = null;
    
    return function() {
        // 清除之前的延迟
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        // 设置1秒延迟
        timeoutId = setTimeout(() => {
            try {
                const minValue = parseFloat(minInput.value) || 0;
                const maxValue = parseFloat(maxInput.value) || 0;
                
                // 检查最小值是否大于最大值
                if (minValue > maxValue) {
                    // 将最大值设置为最小值
                    maxInput.value = minValue;
                    console.log(`${attackName}: 最小值(${minValue}) > 最大值(${maxValue})，已将最大值调整为${minValue}`);
                }
            } catch (error) {
                console.error(`${attackName}验证处理时发生错误:`, error);
            }
        }, 1000); // 1秒延迟
    };
}

