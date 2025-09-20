// 技能倍率表数据
const skillRatesData = [
    { name: "无", externalRate: 0, fixedExternal: 0, breakBambooRate: 0, fixedBreakBamboo: 0, externalElementRate: 0, hit: 0 },
    { name: "白刀A1", externalRate: 0.42, fixedExternal: 98, breakBambooRate: 0.42, fixedBreakBamboo: 55, externalElementRate: 0.42, hit: 1 },
    { name: "白刀A2", externalRate: 0.4503, fixedExternal: 105, breakBambooRate: 0.4503, fixedBreakBamboo: 58, externalElementRate: 0.4503, hit: 2 },
    { name: "白刀A3", externalRate: 0.5767, fixedExternal: 134, breakBambooRate: 0.5767, fixedBreakBamboo: 75, externalElementRate: 0.5767, hit: 2 },
    { name: "白刀A4", externalRate: 0.5077, fixedExternal: 118, breakBambooRate: 0.5077, fixedBreakBamboo: 66, externalElementRate: 0.5077, hit: 2 },
    { name: "红刀A1", externalRate: 0.6467, fixedExternal: 150, breakBambooRate: 0.6467, fixedBreakBamboo: 84, externalElementRate: 0.6467, hit: 2 },
    { name: "红刀A2", externalRate: 0.9007, fixedExternal: 209, breakBambooRate: 0.9007, fixedBreakBamboo: 117, externalElementRate: 0.9007, hit: 2 },
    { name: "红刀A3", externalRate: 1.445, fixedExternal: 335, breakBambooRate: 1.445, fixedBreakBamboo: 187, externalElementRate: 1.445, hit: 8 },
    { name: "红刀A4(5/7)", externalRate: 1.2147, fixedExternal: 281.4, breakBambooRate: 1.2147, fixedBreakBamboo: 156.8, externalElementRate: 1.2147, hit: 5 },
    { name: "红刀A5", externalRate: 2.5337, fixedExternal: 586, breakBambooRate: 2.5337, fixedBreakBamboo: 327, externalElementRate: 2.5337, hit: 5 },
    { name: "痴障", externalRate: 1.3543, fixedExternal: 314, breakBambooRate: 1.3543, fixedBreakBamboo: 175, externalElementRate: 1.3543, hit: 6 },
    { name: "十字斩", externalRate: 3.3018, fixedExternal: 763, breakBambooRate: 3.3018, fixedBreakBamboo: 427, externalElementRate: 3.3018, hit: 8 },
    { name: "横斩", externalRate: 2.6341, fixedExternal: 609, breakBambooRate: 2.6341, fixedBreakBamboo: 341, externalElementRate: 2.6341, hit: 7 },
    { name: "牵绳引刃", externalRate: 0.062, fixedExternal: 14, breakBambooRate: 0.062, fixedBreakBamboo: 8, externalElementRate: 0.062, hit: 1 },
    { name: "鼠鼠生威", externalRate: 0.3489, fixedExternal: 0, breakBambooRate: 0.3489, fixedBreakBamboo: 0, externalElementRate: 0.3489, hit: 1 },
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
    externalAttack: { min: 1334, max: 2900 },
    breakBambooAttack: { min: 196, max: 388 },
    ringMetalAttack: { min: 69, max: 69 },
    breakRockAttack: { min: 69, max: 69 },  // 修正：若最小值大于最大值，则将最大值调整为与最小值相等
    pullSilkAttack: { min: 35, max: 35 },  // 修正：若最小值大于最大值，则将最大值调整为与最小值相等
    precisionRate: 98.2,
    criticalRate: 68.3,
    intentRate: 17.6,
    directCriticalRate: 4.6,
    directIntentRate: 0.0,
    criticalDamageBonus: 57.90,
    intentDamageBonus: 35.00,
    externalDamageBonus: 0.00,
    elementalDamageBonus: 4.00,
    externalPenetration: 34.4,
    elementalPenetration: 14,
    // 装备增伤
    ropeDartBonus: 0.00,
    dualBladesBonus: 0.00,
    allMartialBonus: 0.00,
    bossUnitBonus: 5.00,
    lightStrikeBonus: 0.00,
    mouseBonus: 19.4,
    // 其他增伤
    equipmentSet: '无',
    foodBuff: '无',
    talisman: '无帖',
    craftingBonus: '无',
    bossTalentBonus: 0.00,
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


// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化标签页切换
    initTabs();
    
    // 初始化排轴表格
    initRotationTable();
    
    // 初始化保存按钮
    initSaveButton();
    
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
    
    // 添加套装选择下拉框事件监听
    const equipmentSetSelect = document.getElementById('equipment-set');
    if (equipmentSetSelect) {
        equipmentSetSelect.addEventListener('change', (e) => {
            const selectedSet = e.target.value;
            
            // 更新套装列表头下拉框选项
            const setLayerHeaderSelect = document.getElementById('set-layer-header-select');
            if (setLayerHeaderSelect) {
                // 清空现有选项
                setLayerHeaderSelect.innerHTML = '<option value="">选择套装层数</option>';
                
                // 根据选择的套装类型添加选项
                if (selectedSet && selectedSet !== '无') {
                    const options = getSetOptions(selectedSet, '');
                    setLayerHeaderSelect.innerHTML = '<option value="">选择套装层数</option>' + options;
                }
            }
            
            // 关键修复：更新panelData中的套装值
            panelData.equipmentSet = selectedSet;
            
            // 更新表格中的套装下拉框选项
            updateRotationTable();
        });
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
            const yanguiOptions = ['10%外功增伤', '12.5%外功增伤'];
            yanguiOptions.forEach(option => {
                options += `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${option}</option>`;
            });
            break;
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
            const newYanguiOptions = ['12%通用增伤', '12%通用+10%破竹增伤'];
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
    const talismanOptions = ['无帖', '会心帖', '会意帖', '奇术帖', '承欢帖'];
    let options = '';
    
    talismanOptions.forEach(option => {
        options += `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${option}</option>`;
    });
    
    return options;
}

// 极乐泣血圆桌概率模拟计算
function simulateJileQixueLayers(hitSum) {
    let currentLayers = 0;
    let triggerCount = 0;
    
    console.log(`开始极乐泣血模拟计算，hit数: ${hitSum}`);
    
    for (let i = 0; i < hitSum; i++) {
        // 每次hit有15%概率叠加1层
        if (Math.random() < 0.15) {
            currentLayers++;
            console.log(`第${i+1}次hit触发叠加，当前层数: ${currentLayers}`);
            
            // 当叠满5层时触发
            if (currentLayers >= 5) {
                triggerCount++;
                console.log(`触发第${triggerCount}次计数，当前层数: ${currentLayers}`);
                // 随机保留1层或2层
                currentLayers = Math.random() < 0.5 ? 1 : 2;
                console.log(`触发后保留层数: ${currentLayers}`);
            }
        }
    }
    
    console.log(`极乐泣血模拟结果 - 触发次数: ${triggerCount}, 剩余层数: ${currentLayers}`);
    
    return {
        triggerCount: triggerCount,
        remainingLayers: currentLayers
    };
}

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
        
        if (isSimulationMode) {
            // 模拟模式：使用圆桌概率模型
            const simulationResult = simulateJileQixueLayers(hitSum);
            finalTimes = simulationResult.triggerCount + (simulationResult.remainingLayers / 5);
            remainingLayers = simulationResult.remainingLayers;
            expectedLayers = hitSum * 0.15; // 保留期望值用于显示
        } else {
            // 正常模式：使用期望值计算
            expectedLayers = hitSum * 0.15;
            const fullStacks = Math.floor(expectedLayers / 5);
            remainingLayers = expectedLayers % 5;
            finalTimes = 0 + fullStacks + (remainingLayers / 5);
        }
        
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
    
    // 计算极乐泣血的次数
    rotationData = calculateJileQixueTimes(rotationData);
    
    const tableBody = document.querySelector('#rotation-table tbody');
    
    if (!tableBody) {
        console.error('找不到表格体元素');
        return;
    }
    
    // 使用DocumentFragment优化DOM操作
    const fragment = document.createDocumentFragment();
    
    // 清空表格内容
    tableBody.innerHTML = '';
    
    // 更新套装列表头下拉框选项
    const setLayerHeaderSelect = document.getElementById('set-layer-header-select');
    if (setLayerHeaderSelect) {
        // 清空现有选项
        setLayerHeaderSelect.innerHTML = '<option value="">选择套装层数</option>';
        
        // 根据当前套装类型添加选项
        if (panelData.equipmentSet && panelData.equipmentSet !== '无') {
            const options = getSetOptions(panelData.equipmentSet, '');
            setLayerHeaderSelect.innerHTML = '<option value="">选择套装层数</option>' + options;
        }
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
            
            // 绳镖武学增伤：仅对"鼠鼠生威"和"牵绳引刃"两个技能生效
            if (skill.name === "鼠鼠生威" || skill.name === "牵绳引刃") {
                generalBonus += panelData.ropeDartBonus;
            }
            
            // 鼠鼠生威技能额外80%通用增伤
            if (skill.name === "鼠鼠生威") {
                generalBonus += 80;
            }
            
            // 双刀武学增伤：适用于白刀技能A1至A4、红刀技能A1至A5以及痴障技能
            const dualBladesSkills = ["白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A3", "红刀A4(5/7)", "红刀A5", "痴障"];
            if (dualBladesSkills.includes(skill.name)) {
                generalBonus += panelData.dualBladesBonus;
            }
            
            // 全武学增伤：适用于绳镖武学和双刀武学增伤的所有技能
            const allMartialSkills = ["鼠鼠生威", "牵绳引刃", "白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A3", "红刀A4(5/7)", "红刀A5", "痴障"];
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
            const redBladeSkills = ["红刀A1", "红刀A2", "红刀A3", "红刀A4(5/7)", "红刀A5"];
            const lightStrikeBonus = redBladeSkills.includes(skill.name) ? (1 + panelData.lightStrikeBonus / 100) : 1;
            
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
                const rowProbabilities = calculateRandomProbabilityForRow();
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
            const yanguiSkills = ["白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A3", "红刀A4(5/7)", "红刀A5", "鼠鼠生威"];
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
            // 新燕归套对所有技能生效
            if (panelData.equipmentSet === '新燕归' && skill.setLayer && skill.setLayer !== '无') {
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
            if (panelData.foodBuff === '山参肉丸子') {
                externalAttackWithFeisui.min += 90;
                externalAttackWithFeisui.max += 180;
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
            const bladeSkills = ["白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A3", "红刀A4(5/7)", "红刀A5"];
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
            if (panelData.equipmentSet === '新燕归' && skill.setLayer === '12%通用+10%破竹增伤') {
                newYanguiBreakBambooBonus = 10; // 10%破竹增伤
            }
            
            // 计算破竹会心伤害
            const breakBambooCriticalDamage = (avgBreakBambooAttack * skill.breakBambooRate + skill.fixedBreakBamboo) * 
                                             (1 + panelData.elementalPenetration / 200) * effectiveCriticalRate * 
                                             (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 1.5 * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus) / 100) * 
                                             (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算破竹会意伤害
            const breakBambooIntentDamage = (panelData.breakBambooAttack.max * skill.breakBambooRate + skill.fixedBreakBamboo) * 
                                            (1 + panelData.elementalPenetration / 200) * effectiveIntentRate * 
                                            (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 1.5 * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus) / 100) * 
                                            (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算破竹白字伤害
            const breakBambooWhiteTextDamage = (avgBreakBambooAttack * skill.breakBambooRate + skill.fixedBreakBamboo) * 
                                               (1 + panelData.elementalPenetration / 200) * whiteTextRate * 1.5 * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus) / 100) * 
                                               (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算破竹擦伤伤害
            const breakBambooGrazeDamage = (panelData.breakBambooAttack.min * skill.breakBambooRate + skill.fixedBreakBamboo) * 
                                          (1 + panelData.elementalPenetration / 200) * grazeRate * 1.5 * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus) / 100) * 
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
                <input type="number" class="table-times-input" data-index="${index}" value="${(skill.times || 1).toFixed(2)}" min="0" step="1" style="width: 60px; text-align: center;">
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
    
    // 添加套装层数下拉选择框事件监听
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
            
            // 更新排轴数据
            rotationData[index] = {
                ...rotationData[index],
                setLayer: setLayer
            };
            
            // 更新表格
            updateRotationTable();
        });
    });
    
    // 添加符帖下拉选择框事件监听
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
            
            // 更新排轴数据
            rotationData[index] = {
                ...rotationData[index],
                talismanLayer: talismanLayer
            };
            
            // 更新表格
            updateRotationTable();
        });
    });
    
    // 添加易水歌下拉选择框事件监听
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
            
            // 更新排轴数据
            rotationData[index] = {
                ...rotationData[index],
                yishuiLayer: yishuiLayer
            };
            
            // 更新表格
            updateRotationTable();
        });
    });
    
    // 添加所恨年年下拉选择框事件监听
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
            
            // 更新排轴数据
            rotationData[index] = {
                ...rotationData[index],
                suohenLayer: suohenLayer
            };
            
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

// 处理套装列表头下拉框变化事件
function handleSetLayerHeaderChange(e) {
    const selectedValue = e.target.value;
    
    if (!selectedValue) {
        return; // 如果没有选择值，不执行同步
    }
    
    // 同步更新所有套装层数下拉框
    const setLayerSelects = document.querySelectorAll('.table-set-layer-select');
    setLayerSelects.forEach(select => {
        const index = parseInt(select.getAttribute('data-index'));
        
        // 检查索引是否有效
        if (index >= 0 && index < rotationData.length) {
            // 更新下拉框的值
            select.value = selectedValue;
            
            // 更新排轴数据
            rotationData[index] = {
                ...rotationData[index],
                setLayer: selectedValue
            };
        }
    });
    
    // 重新计算并更新表格
    updateRotationTable();
}



// 初始化保存按钮
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
                
                // 获取输入框的值，添加错误处理
                try {
                    panelData.externalAttack.min = parseFloat(document.getElementById('external-attack-min').value) || 0;
                    panelData.externalAttack.max = parseFloat(document.getElementById('external-attack-max').value) || 0;
                } catch (e) { console.error('外功攻击输入框错误:', e); }
                
                try {
                    panelData.breakBambooAttack.min = parseFloat(document.getElementById('break-bamboo-attack-min').value) || 0;
                    panelData.breakBambooAttack.max = parseFloat(document.getElementById('break-bamboo-attack-max').value) || 0;
                } catch (e) { console.error('破竹攻击输入框错误:', e); }
                
                try {
                    panelData.ringMetalAttack.min = parseFloat(document.getElementById('ring-metal-attack-min').value) || 0;
                    panelData.ringMetalAttack.max = parseFloat(document.getElementById('ring-metal-attack-max').value) || 0;
                } catch (e) { console.error('鸣金攻击输入框错误:', e); }
                
                try {
                    panelData.breakRockAttack.min = parseFloat(document.getElementById('break-rock-attack-min').value) || 0;
                    panelData.breakRockAttack.max = parseFloat(document.getElementById('break-rock-attack-max').value) || 0;
                } catch (e) { console.error('裂石攻击输入框错误:', e); }
                
                try {
                    panelData.pullSilkAttack.min = parseFloat(document.getElementById('pull-silk-attack-min').value) || 0;
                    panelData.pullSilkAttack.max = parseFloat(document.getElementById('pull-silk-attack-max').value) || 0;
                } catch (e) { console.error('牵丝攻击输入框错误:', e); }
                
                try {
                    // 获取三率值
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
                    panelData.equipmentSet = document.getElementById('equipment-set').value || '无';
                    panelData.foodBuff = document.getElementById('food-buff').value || '无';
                    panelData.talisman = document.getElementById('talisman').value || '无帖';
                    panelData.craftingBonus = document.getElementById('crafting-bonus').value || '无';
                    panelData.bossTalentBonus = parseFloat(document.getElementById('boss-talent-bonus').value.replace('%', '')) || 0;
                    
                    // 获取Boss防御值
                    panelData.bossDefense = parseFloat(document.getElementById('boss-defense').value) || 350;
                } catch (e) { console.error('其他输入框错误:', e); }
                
                // 注意：山参肉丸子效果将在伤害计算时处理，不修改输入框值
                // 这样可以保持输入框的独立性，用户手动输入的值不会被自动修改
                
                // 应用规则：若最小攻击值大于最大攻击值，则将最大攻击值调整为与最小攻击值相等
                if (panelData.ringMetalAttack.min > panelData.ringMetalAttack.max) {
                    panelData.ringMetalAttack.max = panelData.ringMetalAttack.min;
                }
                if (panelData.breakRockAttack.min > panelData.breakRockAttack.max) {
                    panelData.breakRockAttack.max = panelData.breakRockAttack.min;
                }
                if (panelData.pullSilkAttack.min > panelData.pullSilkAttack.max) {
                    panelData.pullSilkAttack.max = panelData.pullSilkAttack.min;
                }
                
                console.log('数据保存成功，准备更新表格');
                
                // 更新排轴表格
                try {
                    updateRotationTable();
                } catch (e) {
                    console.error('更新表格时错误:', e);
                }
                
                // 更新套装列表头下拉框选项
                try {
                    const setLayerHeaderSelect = document.getElementById('set-layer-header-select');
                    if (setLayerHeaderSelect) {
                        // 清空现有选项
                        setLayerHeaderSelect.innerHTML = '<option value="">选择套装层数</option>';
                        
                        // 根据当前套装类型添加选项
                        if (panelData.equipmentSet && panelData.equipmentSet !== '无') {
                            const options = getSetOptions(panelData.equipmentSet, '');
                            setLayerHeaderSelect.innerHTML = '<option value="">选择套装层数</option>' + options;
                        }
                    }
                } catch (e) {
                    console.error('更新套装标题时错误:', e);
                }
                

                
                // 保存基础信息默认值到本地存储
                try {
                    savePanelDataAsDefaults();
                    console.log('基础信息默认值保存成功');
                } catch (e) {
                    console.error('保存基础信息默认值时发生错误:', e);
                }
                
                // 显示保存成功消息
                alert('基础信息保存成功！');
                console.log('保存完成，数据已更新');
                
            } catch (error) {
                console.error('保存过程中发生错误:', error);
                alert('保存失败: ' + error.message);
            }
        });
        
        console.log('保存按钮事件绑定成功');
    } catch (error) {
        console.error('初始化保存按钮时发生错误:', error);
    }
}

// 保存基础信息默认值到本地存储
function savePanelDataAsDefaults() {
    try {
        // 创建默认值对象，包含所有基础信息字段
        const defaultValues = {
            // 战斗属性
            externalAttackMin: document.getElementById('external-attack-min').value,
            externalAttackMax: document.getElementById('external-attack-max').value,
            breakBambooAttackMin: document.getElementById('break-bamboo-attack-min').value,
            breakBambooAttackMax: document.getElementById('break-bamboo-attack-max').value,
            ringMetalAttackMin: document.getElementById('ring-metal-attack-min').value,
            ringMetalAttackMax: document.getElementById('ring-metal-attack-max').value,
            breakRockAttackMin: document.getElementById('break-rock-attack-min').value,
            breakRockAttackMax: document.getElementById('break-rock-attack-max').value,
            pullSilkAttackMin: document.getElementById('pull-silk-attack-min').value,
            pullSilkAttackMax: document.getElementById('pull-silk-attack-max').value,
            precisionRate: document.getElementById('precision-rate').value,
            criticalRate: document.getElementById('critical-rate').value,
            intentRate: document.getElementById('intent-rate').value,
            directCriticalRate: document.getElementById('direct-critical-rate').value,
            directIntentRate: document.getElementById('direct-intent-rate').value,
            criticalDamageBonus: document.getElementById('critical-damage-bonus').value,
            intentDamageBonus: document.getElementById('intent-damage-bonus').value,
            externalDamageBonus: document.getElementById('external-damage-bonus').value,
            elementalDamageBonus: document.getElementById('elemental-damage-bonus').value,
            externalPenetration: document.getElementById('external-penetration').value,
            elementalPenetration: document.getElementById('elemental-penetration').value,
            
            // 装备增伤
            ropeDartBonus: document.getElementById('rope-dart-bonus').value,
            dualBladesBonus: document.getElementById('dual-blades-bonus').value,
            allMartialBonus: document.getElementById('all-martial-bonus').value,
            bossUnitBonus: document.getElementById('boss-unit-bonus').value,
            lightStrikeBonus: document.getElementById('light-strike-bonus').value,
            mouseBonus: document.getElementById('mouse-bonus').value,
            
            // 其他增伤
            equipmentSet: document.getElementById('equipment-set').value,
            foodBuff: document.getElementById('food-buff').value,
            talisman: document.getElementById('talisman').value,
            craftingBonus: document.getElementById('crafting-bonus').value,
            bossTalentBonus: document.getElementById('boss-talent-bonus').value,
            bossDefense: document.getElementById('boss-defense').value,
            
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
    
    clearButton.addEventListener('click', () => {
        if (confirm('确定要清空排轴吗？')) {
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
            alert('请先添加技能到排轴中！');
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
        
        // 根据选择的模式设置T值
        if (selectedMode === 'none') {
            // "无"选项：保持默认状态，T值保持为60
            T = 60;
        } else if (selectedMode === 'yishui') {
            T = 60;
        } else if (selectedMode === 'duanshi') {
            // 断石模式：T值设为50
            T = 50;
        }
        
        // 更新伤害统计表格
        updateDamageStatsTable();
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
        fixedGraduationDamage = 2000000;  // 断石模式：毕业伤害为200000
    } else {
        fixedGraduationDamage = 2317466; // 易水模式：毕业伤害为2317466
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
    // 毕业DPS = 2317466 / T
    const graduationDpsElement = document.getElementById('graduation-dps');
    if (graduationDpsElement) {
        graduationDpsElement.textContent = isNoneMode ? '-' : (fixedGraduationDamage / T).toFixed(0);
    }
    
    // 期望DPS = 期望伤害 / T
    const expectedDpsElement = document.getElementById('expected-dps');
    if (expectedDpsElement) {
        expectedDpsElement.textContent = isNoneMode ? '-' : (expectedDamage > 0 ? (expectedDamage / T).toFixed(0) : '-');
    }
    
    // 模拟DPS = 模拟伤害 / T
    const simulationDpsElement = document.getElementById('simulation-dps');
    if (simulationDpsElement) {
        simulationDpsElement.textContent = isNoneMode ? '-' : (simulationDamage > 0 ? (simulationDamage / T).toFixed(0) : '-');
    }
    
    // 计算并更新毕业率
    // 毕业率固定为100%
    const graduationRateElement = document.getElementById('graduation-rate');
    if (graduationRateElement) {
        graduationRateElement.textContent = isNoneMode ? '-' : '100%';
    }
    
    // 期望毕业率 = 期望伤害 / 2317466
    const expectedRateElement = document.getElementById('expected-rate');
    if (expectedRateElement) {
        if (isNoneMode) {
            expectedRateElement.textContent = '-';
        } else if (expectedDamage > 0) {
            const rate = (expectedDamage / fixedGraduationDamage * 100).toFixed(1);
            expectedRateElement.textContent = rate + '%';
        } else {
            expectedRateElement.textContent = '-';
        }
    }
    
    // 模拟毕业率 = 模拟伤害 / 2317466
    const simulationRateElement = document.getElementById('simulation-rate');
    if (simulationRateElement) {
        if (isNoneMode) {
            simulationRateElement.textContent = '-';
        } else if (simulationDamage > 0) {
            const rate = (simulationDamage / fixedGraduationDamage * 100).toFixed(1);
            simulationRateElement.textContent = rate + '%';
        } else {
            simulationRateElement.textContent = '-';
        }
    }
}

// 初始化实时图表更新功能
function initRealTimeChartUpdates() {
    // 影响伤害数值的所有输入元素ID列表（用于事件委托判断）
    const damageRelatedInputs = [
        // 攻击相关输入框
        'external-attack-min', 'external-attack-max',
        'ring-metal-attack-min', 'ring-metal-attack-max',
        'break-rock-attack-min', 'break-rock-attack-max',
        'pull-silk-attack-min', 'pull-silk-attack-max',
        'break-bamboo-attack-min', 'break-bamboo-attack-max',
        
        // 几率相关输入框
        'precision-rate', 'critical-rate', 'intent-rate',
        'direct-critical-rate', 'direct-intent-rate',
        
        // 伤害加成相关输入框
        'critical-damage-bonus', 'intent-damage-bonus',
        'external-damage-bonus', 'elemental-damage-bonus',
        
        // 穿透相关输入框
        'external-penetration', 'elemental-penetration',
        
        // 装备增伤相关输入框
        'rope-dart-bonus', 'dual-blades-bonus', 'all-martial-bonus',
        'boss-unit-bonus', 'light-strike-bonus', 'mouse-bonus',
        
        // Boss相关输入框
        'boss-talent-bonus', 'boss-defense',
        
        // 其他增伤相关下拉框
        'equipment-set', 'food-buff', 'talisman', 'crafting-bonus'
    ];

    const idSet = new Set(damageRelatedInputs);

    // 使用单一防抖定时器合并短时间内的多次变更，减少重绘与计算压力
    let debounceTimer = null;
    const scheduleUpdate = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            updatePanelDataFromInputs();
            updateRotationTable();
        }, 1000);
    };

    // 事件委托：统一监听 input 与 change 事件
    document.addEventListener('input', (e) => {
        const target = e.target;
        if (target && idSet.has(target.id)) {
            scheduleUpdate();
        }
    });

    document.addEventListener('change', (e) => {
        const target = e.target;
        if (target && idSet.has(target.id)) {
            scheduleUpdate();
        }
    });
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
            panelData.equipmentSet = document.getElementById('equipment-set').value || '无';
            panelData.foodBuff = document.getElementById('food-buff').value || '无';
            panelData.talisman = document.getElementById('talisman').value || '无帖';
            panelData.craftingBonus = document.getElementById('crafting-bonus').value || '无';
            panelData.bossTalentBonus = parseFloat(document.getElementById('boss-talent-bonus').value.replace('%', '')) || 0;
            
            // 获取Boss防御值
            panelData.bossDefense = parseFloat(document.getElementById('boss-defense').value) || 350;
        } catch (e) { console.error('其他输入框错误:', e); }
        
        // 注意：山参肉丸子效果将在伤害计算时处理，不修改输入框值
        // 这样可以保持输入框的独立性，用户手动输入的值不会被自动修改
        
        // 应用规则：若最小攻击值大于最大攻击值，则将最大攻击值调整为与最小攻击值相等
        if (panelData.ringMetalAttack.min > panelData.ringMetalAttack.max) {
            panelData.ringMetalAttack.max = panelData.ringMetalAttack.min;
        }
        if (panelData.breakRockAttack.min > panelData.breakRockAttack.max) {
            panelData.breakRockAttack.max = panelData.breakRockAttack.min;
        }
        if (panelData.pullSilkAttack.min > panelData.pullSilkAttack.max) {
            panelData.pullSilkAttack.max = panelData.pullSilkAttack.min;
        }
        if (panelData.breakBambooAttack.min > panelData.breakBambooAttack.max) {
            panelData.breakBambooAttack.max = panelData.breakBambooAttack.min;
        }
        
        // 同步更新输入框的值（当最大值被自动调整时）
        try {
            document.getElementById('external-attack-max').value = panelData.externalAttack.max;
            document.getElementById('ring-metal-attack-max').value = panelData.ringMetalAttack.max;
            document.getElementById('break-rock-attack-max').value = panelData.breakRockAttack.max;
            document.getElementById('pull-silk-attack-max').value = panelData.pullSilkAttack.max;
            document.getElementById('break-bamboo-attack-max').value = panelData.breakBambooAttack.max;
        } catch (e) {
            console.error('同步更新输入框值时发生错误:', e);
        }
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
    
    saveButton.addEventListener('click', () => {
        try {
            // 检查是否有排轴数据
            if (!rotationData || rotationData.length === 0) {
                alert('当前没有排轴数据可保存！');
            return;
        }
        
        // 保存前修复BUFF数据同步问题
        fixRotationDataBuffSync();
        
            // 获取配置名称
            const configName = prompt('请输入配置名称：');
        if (!configName || configName.trim() === '') {
            alert('配置名称不能为空！');
        return;
    }
    
            // 创建保存数据对象 - 只保存排轴数据，不保存面板数据
        const saveData = {
                name: configName.trim(),
                rotationData: [...rotationData], // 深拷贝排轴数据
                // 移除panelData，排轴配置不包含面板数据
                timestamp: Date.now(), // 添加时间戳
                lastModified: new Date().toLocaleString('zh-CN') // 添加可读的修改时间
            };
            
            // 保存到localStorage
            let savedConfigs = JSON.parse(localStorage.getItem('rotationConfigs') || '[]');
            
            // 检查是否已存在同名配置，如果存在则覆盖
            const existingIndex = savedConfigs.findIndex(config => config.name === configName.trim());
            if (existingIndex >= 0) {
                // 存在同名配置，询问用户是否覆盖
                const confirmOverwrite = confirm(`配置名称"${configName.trim()}"已存在，是否覆盖现有配置？`);
                if (!confirmOverwrite) {
                    alert('保存已取消');
                    return;
                }
                savedConfigs[existingIndex] = saveData;
                console.log(`覆盖了现有配置: ${configName.trim()}`);
            } else {
                savedConfigs.push(saveData);
                console.log(`创建了新配置: ${configName.trim()}`);
            }
            
            // 将更新后的配置数组保存到localStorage
            localStorage.setItem('rotationConfigs', JSON.stringify(savedConfigs));
            console.log('配置已保存到本地存储');
            
            // 更新配置下拉列表
            updateRotationConfigSelect();
            
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
            alert(`排轴配置${operationType}成功并已导出文件！`);
            
        } catch (error) {
            console.error('保存排轴配置时发生错误:', error);
            alert('保存失败: ' + error.message);
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
        reader.onload = (e) => {
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
                
                // 更新导入配置的时间戳
                importData.timestamp = Date.now();
                importData.lastModified = new Date().toLocaleString('zh-CN');
                
                // 检查是否已存在同名配置，如果存在则询问用户是否覆盖
                let savedConfigs = JSON.parse(localStorage.getItem('rotationConfigs') || '[]');
                const existingIndex = savedConfigs.findIndex(config => config.name === importData.name);
                
                if (existingIndex !== -1) {
                    // 存在同名配置，询问用户是否覆盖
                    const confirmOverwrite = confirm(`配置名称"${importData.name}"已存在，是否覆盖现有配置？`);
                    if (!confirmOverwrite) {
                        alert('导入已取消');
                        return;
                    }
                    savedConfigs[existingIndex] = importData;
                    console.log(`覆盖了现有配置: ${importData.name}`);
                } else {
                    savedConfigs.push(importData);
                    console.log(`导入了新配置: ${importData.name}`);
                }
                
                // 保存到localStorage
                localStorage.setItem('rotationConfigs', JSON.stringify(savedConfigs));
                
                // 更新配置下拉列表
                updateRotationConfigSelect();
                
                // 自动加载导入的排轴配置
                loadRotationConfig(importData);
                
                // 根据操作类型显示不同的成功消息
                const operationType = existingIndex !== -1 ? '覆盖' : '导入';
                alert(`排轴配置${operationType}成功并已自动加载！BUFF数据已自动修复。`);
                
        } catch (error) {
                console.error('导入排轴配置时发生错误:', error);
                alert('导入失败: ' + error.message);
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
            alert('进入模拟计算模式失败: ' + error.message);
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
        
        if (skill.name === "极乐泣血" || dotSkills.includes(skill.name) || skill.name === "极乐Dot" || skill.name === "年年Dot") {
            // 极乐泣血和Dot技能不进行分离，直接添加
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
    // 计算当前概率（这里需要从实际的概率计算中获取）
    // 为了简化，我们使用默认的概率值
    const probabilities = {
        critical: 0.77,  // 会心率
        intent: 0.151,   // 会意率
        white: 0.079,    // 白字率
        graze: 0         // 擦伤率
    };
    
    // 保存原始概率
    originalProbabilities = {
        effectiveCriticalRate: probabilities.critical,
        effectiveIntentRate: probabilities.intent,
        whiteTextRate: probabilities.white,
        grazeRate: probabilities.graze
    };
    
    // 设置全局模拟概率为null，让每行独立计算
    globalSimulationProbabilities = null;
    
    console.log('模拟计算：每行独立计算概率');
}

// 为单行数据计算随机概率
function calculateRandomProbabilityForRow() {
    // 计算当前概率（这里需要从实际的概率计算中获取）
    // 为了简化，我们使用默认的概率值
    const probabilities = {
        critical: 0.77,  // 会心率
        intent: 0.151,   // 会意率
        white: 0.079,    // 白字率
        graze: 0         // 擦伤率
    };
    
    // 创建概率权重数组
    const probabilityTypes = ['critical', 'intent', 'white', 'graze'];
    const weights = [probabilities.critical, probabilities.intent, probabilities.white, probabilities.graze];
    
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
                    alert('找不到选中的配置！');
                    return;
            }
            
                // 自动加载选中的排轴配置
                loadRotationConfig(selectedConfig);
            
        } catch (error) {
                console.error('加载配置时发生错误:', error);
                alert('加载失败: ' + error.message);
        }
    });
}

    // 初始化删除配置按钮
    const deleteButton = document.getElementById('delete-rotation-config-btn');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            const configSelect = document.getElementById('saved-rotation-configs');
            const selectedName = configSelect.value;
            
            if (!selectedName) {
                alert('请先选择一个配置！');
        return;
    }
    
            try {
                const savedConfigs = JSON.parse(localStorage.getItem('rotationConfigs') || '[]');
                const selectedConfig = savedConfigs.find(config => config.name === selectedName);
                
                if (!selectedConfig) {
                    alert('找不到选中的配置！');
                    return;
                }
                
                if (!confirm(`确定要删除配置"${selectedConfig.name}"吗？`)) {
        return;
    }
    
                // 删除配置
                const filteredConfigs = savedConfigs.filter(config => config.name !== selectedName);
                localStorage.setItem('rotationConfigs', JSON.stringify(filteredConfigs));
                
                // 更新配置下拉列表
                updateRotationConfigSelect();
                
                alert('配置删除成功！');
                
            } catch (error) {
                console.error('删除配置时发生错误:', error);
                alert('删除失败: ' + error.message);
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
        alert('加载失败: ' + error.message);
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
        configSelect.innerHTML = '<option value="">选择已保存的排轴配置</option>';
        
        // 过滤掉无效配置，按时间戳降序排序（最新的在前面）
        savedConfigs
            .filter(config => config && config.name) // 过滤掉无效配置
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)) // 按时间戳降序排序
            .forEach(config => {
                const option = document.createElement('option');
                option.value = config.name;
                // 显示配置名称和修改时间
                const timeInfo = config.lastModified ? ` (${config.lastModified})` : '';
                option.textContent = config.name + timeInfo;
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
    const dualBladesSkills = ["白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A3", "红刀A4(5/7)", "红刀A5", "痴障"];
    if (dualBladesSkills.includes(skill.name)) {
        generalBonus += panelData.dualBladesBonus;
    }
    
    // 全武学增伤
    const allMartialSkills = ["鼠鼠生威", "牵绳引刃", "白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A3", "红刀A4(5/7)", "红刀A5", "痴障"];
    if (allMartialSkills.includes(skill.name)) {
        generalBonus += panelData.allMartialBonus;
    }
    
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
    const elementalPenetrationMultiplier = 1 + panelData.elementalPenetration / 200;

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

// 图表3：技能伤害分布
function initSkillDamageChart() {
    const ctx = document.getElementById('skillDamageChart');
    if (!ctx) return;

    skillDamageChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: '伤害占比',
                data: [],
                backgroundColor: chartColors.skillDamage,
                borderColor: '#ffffff',
                borderWidth: 2
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
            }
        }
    });
}

// 图表4：状态伤害分布
function initStatusDamageChart() {
    const ctx = document.getElementById('statusDamageChart');
    if (!ctx) return;

    statusDamageChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: '伤害占比',
                data: [],
                backgroundColor: [chartColors.statusDamage.chenyan, chartColors.statusDamage.normal],
                borderColor: '#ffffff',
                borderWidth: 2
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
            }
        }
    });
}

// 更新状态伤害分布图表
function updateStatusDamageChart() {
    if (!statusDamageChart) return;
    
    // 如果没有排轴数据，显示默认状态
    if (!rotationData || rotationData.length === 0) {
        statusDamageChart.data.labels = ['暂无数据'];
        statusDamageChart.data.datasets[0].data = [100];
        statusDamageChart.data.datasets[0].backgroundColor = ['#E5E7EB'];
        statusDamageChart.update();
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
        statusDamageChart.data.labels = ['暂无有效数据'];
        statusDamageChart.data.datasets[0].data = [100];
        statusDamageChart.data.datasets[0].backgroundColor = ['#E5E7EB'];
        statusDamageChart.update();
        updateStatusDamageLegend(0, 0);
        return;
    }

    // 计算百分比
    const chenyanPercentage = (chenyanDamage / totalDamage) * 100;
    const normalPercentage = (normalDamage / totalDamage) * 100;

    // 更新图表数据
    const labels = [];
    const data = [];
    const colors = [];

    if (chenyanDamage > 0) {
        labels.push('嗔焰状态');
        data.push(chenyanPercentage);
        colors.push(chartColors.statusDamage.chenyan);
    }

    if (normalDamage > 0) {
        labels.push('普通状态');
        data.push(normalPercentage);
        colors.push(chartColors.statusDamage.normal);
    }

    // 如果没有任何状态数据，显示默认状态
    if (labels.length === 0) {
        statusDamageChart.data.labels = ['暂无状态数据'];
        statusDamageChart.data.datasets[0].data = [100];
        statusDamageChart.data.datasets[0].backgroundColor = ['#E5E7EB'];
        statusDamageChart.update();
        updateStatusDamageLegend(0, 0);
        return;
    }

    statusDamageChart.data.labels = labels;
    statusDamageChart.data.datasets[0].data = data;
    statusDamageChart.data.datasets[0].backgroundColor = colors;

    statusDamageChart.update();
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

// 更新技能伤害图表
function updateSkillDamageChart() {
    if (!skillDamageChart) return;
    
    // 如果没有排轴数据，显示默认状态
    if (!rotationData || rotationData.length === 0) {
        skillDamageChart.data.labels = ['暂无数据'];
        skillDamageChart.data.datasets[0].data = [100];
        skillDamageChart.data.datasets[0].backgroundColor = ['#E5E7EB'];
        skillDamageChart.update();
        updateSkillDamageLegend([]);
        return;
    }
                
    const skillDamageMap = new Map();
    let totalDamage = 0;

    // 技能名称合并映射函数
    function mergeSkillName(skillName) {
        // 红刀A1-A5合并为"红刀"
        if (skillName.match(/^红刀A[1-5]/) || skillName === '红刀A4(5/7)') {
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
        skillDamageChart.update();
        updateSkillDamageLegend([]);
        return;
    }

    const labels = sortedSkills.map(([skillName]) => skillName);
    const data = sortedSkills.map(([, damage]) => totalDamage > 0 ? (damage / totalDamage * 100) : 0);

    skillDamageChart.data.labels = labels;
    skillDamageChart.data.datasets[0].data = data;
    // 为所有技能分配颜色，如果技能数量超过颜色数组长度，则循环使用颜色
    const colors = [];
    for (let i = 0; i < labels.length; i++) {
        colors.push(chartColors.skillDamage[i % chartColors.skillDamage.length]);
    }
    skillDamageChart.data.datasets[0].backgroundColor = colors;

    skillDamageChart.update();
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
