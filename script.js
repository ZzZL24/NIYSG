// 调试开关 - 生产环境设为false
const DEBUG_MODE = false;
const DEBUG_LEVEL = 1; // 0=无调试, 1=关键信息, 2=详细信息

// 统一调试输出函数
function debugLog(message, level = 1) {
    if (DEBUG_MODE && DEBUG_LEVEL >= level) {
        console.log(message);
    }
}

function debugError(message) {
    if (DEBUG_MODE) {
        console.error(message);
    }
}

function debugWarn(message) {
    if (DEBUG_MODE) {
        console.warn(message);
    }
}

// 精确数值处理函数
function preciseRound(value, decimals = 1) {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
}

// 数值显示：最多三位小数，不显示多余的0
function formatUpTo3Decimals(value) {
    const num = Number(value);
    if (!isFinite(num)) return '';
    return num.toFixed(3).replace(/\.?0+$/, '');
}

// ==================== 配置管理模块 ====================
// 游戏配置数据，便于维护和扩展
const GameConfig = {
    // 技能分类配置
    skillCategories: {
        ropeDartSkills: ["鼠鼠生威", "牵绳引刃"],
        dualBladesSkills: ["白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5", "痴障"],
        allMartialSkills: ["鼠鼠生威", "牵绳引刃", "白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5", "痴障", "易水歌", "极乐泣血"],
        redBladeSkills: ["红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5"],
        bladeSkills: ["白刀A1", "白刀A2", "白刀A3", "白刀A4", "红刀A1", "红刀A2", "红刀A2(1/2)", "红刀A3", "红刀A4", "红刀A4(5/7)", "红刀A5"],
        dotSkills: ["天工火Dot", "天工毒Dot", "火·厚积薄发"]
    },
    
    // 技能特殊效果配置
    skillEffects: {
        "鼠鼠生威": {
            generalBonus: 80,
            mouseMultiplier: 1.3
        }
    },
    
    
    // 计算常量
    constants: {
        maxCriticalRate: 0.8,
        breakBambooMultiplier: 1.5,
        redBladeElementalPenetration: 10,
        bossDefenseReduction: 0.1
    }
};

// ==================== 数据验证模块 ====================
class DataValidator {
    static validatePanelData(data) {
        const errors = [];
        
        // 验证攻击值范围
        if (data.externalAttack.min > data.externalAttack.max) {
            errors.push('外功攻击最小值不能大于最大值');
        }
        if (data.breakBambooAttack.min > data.breakBambooAttack.max) {
            errors.push('破竹攻击最小值不能大于最大值');
        }
        
        // 验证概率值范围
        if (data.precisionRate < 0 || data.precisionRate > 100) {
            errors.push('精准率必须在0-100之间');
        }
        if (data.criticalRate < 0 || data.criticalRate > 100) {
            errors.push('会心率必须在0-100之间');
        }
        if (data.intentRate < 0 || data.intentRate > 100) {
            errors.push('会意率必须在0-100之间');
        }
        
        // 验证增伤值范围
        if (data.criticalDamageBonus < 0) {
            errors.push('会心伤害加成不能为负数');
        }
        if (data.intentDamageBonus < 0) {
            errors.push('会意伤害加成不能为负数');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    static validateSkillData(skill) {
        if (!skill || !skill.name || skill.name === '无') {
            return { isValid: false, errors: ['无效的技能数据'] };
        }
        
        const skillData = skillRatesData.find(s => s.name === skill.name);
        if (!skillData) {
            return { isValid: false, errors: [`未找到技能 ${skill.name} 的数据`] };
        }
        
        return { isValid: true, errors: [] };
    }
}

// ==================== 状态管理模块 ====================
class StateManager {
    constructor() {
        this.state = new Map();
        this.listeners = new Map();
    }
    
    setState(key, value) {
        const oldValue = this.state.get(key);
        this.state.set(key, value);
        
        // 通知监听器
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(callback => {
                callback(value, oldValue);
            });
        }
    }
    
    getState(key) {
        return this.state.get(key);
    }
    
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
    }
    
    unsubscribe(key, callback) {
        if (this.listeners.has(key)) {
            const callbacks = this.listeners.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
}

// 创建全局状态管理器实例
const stateManager = new StateManager();

// ==================== 性能监控模块 ====================
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            calculationTime: [],
            cacheHitRate: 0,
            totalCalculations: 0,
            averageCalculationTime: 0
        };
        this.startTime = 0;
    }
    
    startTiming() {
        this.startTime = performance.now();
    }
    
    endTiming() {
        if (this.startTime > 0) {
            const duration = performance.now() - this.startTime;
            this.metrics.calculationTime.push(duration);
            this.metrics.totalCalculations++;
            
            // 保持最近100次的计算时间
            if (this.metrics.calculationTime.length > 100) {
                this.metrics.calculationTime.shift();
            }
            
            // 计算平均时间
            this.metrics.averageCalculationTime = 
                this.metrics.calculationTime.reduce((a, b) => a + b, 0) / this.metrics.calculationTime.length;
        }
    }
    
    updateCacheStats(cacheStats) {
        this.metrics.cacheHitRate = parseFloat(cacheStats.hitRate);
    }
    
    getMetrics() {
        return {
            ...this.metrics,
            cacheStats: damageCache.getStats()
        };
    }
    
    reset() {
        this.metrics = {
            calculationTime: [],
            cacheHitRate: 0,
            totalCalculations: 0,
            averageCalculationTime: 0
        };
    }
}

// 创建性能监控实例
const performanceMonitor = new PerformanceMonitor();

// 技能倍率表数据
const skillRatesData = [
    { name: "无", externalRate: 0, fixedExternal: 0, breakBambooRate: 0, fixedBreakBamboo: 0, externalElementRate: 0, hit: 0 },
    { name: "白刀A1", externalRate: 0.4205, fixedExternal: 117, breakBambooRate: 0.4205, fixedBreakBamboo: 64, externalElementRate: 0.4205, hit: 1 },
    { name: "白刀A2", externalRate: 0.4508, fixedExternal: 126, breakBambooRate: 0.4508, fixedBreakBamboo: 68, externalElementRate: 0.4508, hit: 2 },
    { name: "白刀A3", externalRate: 0.5772, fixedExternal: 161, breakBambooRate: 0.5772, fixedBreakBamboo: 87, externalElementRate: 0.5772, hit: 2 },
    { name: "白刀A4", externalRate: 0.5082, fixedExternal: 142, breakBambooRate: 0.5082, fixedBreakBamboo: 77, externalElementRate: 0.5082, hit: 2 },
    { name: "红刀A1", externalRate: 0.6472, fixedExternal: 180, breakBambooRate: 0.6472, fixedBreakBamboo: 98, externalElementRate: 0.6472, hit: 2 },
    { name: "红刀A2", externalRate: 0.9012, fixedExternal: 250, breakBambooRate: 0.9012, fixedBreakBamboo: 136, externalElementRate: 0.9012, hit: 2 },
    { name: "红刀A2(1/2)", externalRate: 0.4506, fixedExternal: 125, breakBambooRate: 0.4506, fixedBreakBamboo: 68, externalElementRate: 0.4506, hit: 1 },
    { name: "红刀A3", externalRate: 1.4455, fixedExternal: 401, breakBambooRate: 1.4455, fixedBreakBamboo: 218, externalElementRate: 1.4455, hit: 8 },
    { name: "红刀A4", externalRate: 1.7358, fixedExternal: 481, breakBambooRate: 1.7358, fixedBreakBamboo: 262, externalElementRate: 1.7358, hit: 7 },
    { name: "红刀A4(5/7)", externalRate: 1.215, fixedExternal: 336.7, breakBambooRate: 1.215, fixedBreakBamboo: 183.4, externalElementRate: 1.215, hit: 5 },
    { name: "红刀A5", externalRate: 2.5342, fixedExternal: 702, breakBambooRate: 2.5342, fixedBreakBamboo: 382, externalElementRate: 2.5342, hit: 5 },
    { name: "痴障", externalRate: 1.3548, fixedExternal: 376, breakBambooRate: 1.3548, fixedBreakBamboo: 205, externalElementRate: 1.3548, hit: 6 },
    { name: "十字斩", externalRate: 3.3028, fixedExternal: 914, breakBambooRate: 3.3028, fixedBreakBamboo: 498, externalElementRate: 3.3028, hit: 8 },
    { name: "横斩", externalRate: 2.6351, fixedExternal: 730, breakBambooRate: 2.6351, fixedBreakBamboo: 398, externalElementRate: 2.6351, hit: 7 },
    { name: "牵绳引刃", externalRate: 0.0621, fixedExternal: 17, breakBambooRate: 0.0621, fixedBreakBamboo: 9, externalElementRate: 0.0621, hit: 1 },
    { name: "鼠鼠生威", externalRate: 0.3490, fixedExternal: 0, breakBambooRate: 0.3490, fixedBreakBamboo: 0, externalElementRate: 0.3490, hit: 1 },
    { name: "骑龙回马一段", externalRate: 3.1956, fixedExternal: 459, breakBambooRate: 3.1956, fixedBreakBamboo: 0, externalElementRate: 3.1956, hit: 1 },
    { name: "骑龙回马二段", externalRate: 3.9058, fixedExternal: 561, breakBambooRate: 3.9058, fixedBreakBamboo: 0, externalElementRate: 3.9058, hit: 1 },
    { name: "箫声千浪炸", externalRate: 3.919, fixedExternal: 830, breakBambooRate: 3.919, fixedBreakBamboo: 0, externalElementRate: 3.919, hit: 1 },
    { name: "箫声千浪(炸前)", externalRate: 1.4696, fixedExternal: 310, breakBambooRate: 1.4696, fixedBreakBamboo: 0, externalElementRate: 1.4696, hit: 1 },
    { name: "箫声千浪(炸后)", externalRate: 1.3098, fixedExternal: 0, breakBambooRate: 1.3098, fixedBreakBamboo: 0, externalElementRate: 1.3098, hit: 1 },
    { name: "清风霁月", externalRate: 0.9539, fixedExternal: 467, breakBambooRate: 0.9539, fixedBreakBamboo: 0, externalElementRate: 0.9539, hit: 1 },
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

// ==================== 数据管理类 ====================
class PanelDataManager {
    constructor() {
        this.data = this.getDefaultData();
    }
    
    getDefaultData() {
        return {
    externalAttack: { min: 1299, max: 3602 },
    breakBambooAttack: { min: 365, max: 655 },
    ringMetalAttack: { min: 0, max: 0 },
            breakRockAttack: { min: 0, max: 0 },
            pullSilkAttack: { min: 0, max: 0 },
    precisionRate: 100,
    criticalRate: 68.2,
    intentRate: 18.8,
    directCriticalRate: 4.6,
    directIntentRate: 0.0,
    criticalDamageBonus: 57.9,
    intentDamageBonus: 35.0,
    externalDamageBonus: 0.0,
    elementalDamageBonus: 9,
    externalPenetration: 44,
    elementalPenetration: 28,
    // 装备增伤
    ropeDartBonus: 6.2,
    dualBladesBonus: 0.0,
    allMartialBonus: 6.4,
    bossUnitBonus: 6.4,
    lightStrikeBonus: 0.0,
    mouseBonus: 24.0,
    // 其他增伤
    equipmentSet: '飞隼',
    foodBuff: '涮鱼',
    talisman: '真气会心帖',
    craftingBonus: '天工火',
    bossTalent: 'wooden-dummy',
    // Boss防御
    bossDefense: 405
};
    }
    
    // 从HTML表单获取数据
    getDataFromInputs() {
        const tempData = this.getDefaultData();
        
        // 安全获取输入值
        const updateValue = (elementId, targetObj, key, defaultValue = 0) => {
            try {
                const element = document.getElementById(elementId);
                if (element) {
                    const value = parseFloat(element.value) || defaultValue;
                    if (key.includes('.')) {
                        const [parentKey, childKey] = key.split('.');
                        if (!targetObj[parentKey]) targetObj[parentKey] = {};
                        targetObj[parentKey][childKey] = value;
                    } else {
                        targetObj[key] = value;
                    }
                }
            } catch (error) {
                console.warn(`获取元素 ${elementId} 的值时出错:`, error);
            }
        };
        
        // 更新战斗属性
        updateValue('external-attack-min', tempData, 'externalAttack.min');
        updateValue('external-attack-max', tempData, 'externalAttack.max');
        updateValue('precision-rate', tempData, 'precisionRate');
        updateValue('critical-rate', tempData, 'criticalRate');
        updateValue('intent-rate', tempData, 'intentRate');
        updateValue('direct-critical-rate', tempData, 'directCriticalRate');
        updateValue('direct-intent-rate', tempData, 'directIntentRate');
        
        // 更新攻击属性
        updateValue('ring-metal-attack-min', tempData, 'ringMetalAttack.min');
        updateValue('ring-metal-attack-max', tempData, 'ringMetalAttack.max');
        updateValue('break-rock-attack-min', tempData, 'breakRockAttack.min');
        updateValue('break-rock-attack-max', tempData, 'breakRockAttack.max');
        updateValue('pull-silk-attack-min', tempData, 'pullSilkAttack.min');
        updateValue('pull-silk-attack-max', tempData, 'pullSilkAttack.max');
        updateValue('break-bamboo-attack-min', tempData, 'breakBambooAttack.min');
        updateValue('break-bamboo-attack-max', tempData, 'breakBambooAttack.max');
        
        // 更新伤害加成
        updateValue('critical-damage-bonus', tempData, 'criticalDamageBonus');
        updateValue('intent-damage-bonus', tempData, 'intentDamageBonus');
        updateValue('external-damage-bonus', tempData, 'externalDamageBonus');
        updateValue('elemental-damage-bonus', tempData, 'elementalDamageBonus');
        updateValue('external-penetration', tempData, 'externalPenetration');
        updateValue('elemental-penetration', tempData, 'elementalPenetration');
        
        // 更新装备增伤
        updateValue('rope-dart-bonus', tempData, 'ropeDartBonus');
        updateValue('dual-blades-bonus', tempData, 'dualBladesBonus');
        updateValue('all-martial-bonus', tempData, 'allMartialBonus');
        updateValue('boss-unit-bonus', tempData, 'bossUnitBonus');
        updateValue('light-strike-bonus', tempData, 'lightStrikeBonus');
        updateValue('mouse-bonus', tempData, 'mouseBonus');
        
        // 更新其他设置（下拉框和选择框）
        const updateSelectValue = (elementId, targetObj, key, defaultValue = '') => {
            try {
                const element = document.getElementById(elementId);
                if (element) {
                    targetObj[key] = element.value || defaultValue;
                }
            } catch (error) {
                console.warn(`获取选择框 ${elementId} 的值时出错:`, error);
            }
        };
        
        updateSelectValue('equipment-set', tempData, 'equipmentSet', '无');
        updateSelectValue('food-buff', tempData, 'foodBuff', '无');
        updateSelectValue('talisman', tempData, 'talisman', '无');
        updateSelectValue('crafting-bonus', tempData, 'craftingBonus', '无');
        updateSelectValue('boss-talent-select', tempData, 'bossTalent', 'wooden-dummy');
        
        // 更新Boss防御 - 强制设置为96级BOSS(405)
        tempData.bossDefense = 405;
        updateValue('boss-defense', tempData, 'bossDefense', 405);
        
        // 调试：验证BOSS天赋获取
        debugLog('🔥 getDataFromInputs - BOSS天赋获取验证:', 2);
        debugLog('- 获取到的BOSS天赋: ' + tempData.bossTalent, 2);
        debugLog('- 是否试剑侠境: ' + (tempData.bossTalent === 'trial-sword'), 2);
        
        // 调试：验证天工火和涮鱼获取
        debugLog('🔥 getDataFromInputs - 天工火和涮鱼获取验证:', 2);
        debugLog('- 获取到的天工: ' + tempData.craftingBonus, 2);
        debugLog('- 是否天工火: ' + (tempData.craftingBonus === '天工火'), 2);
        debugLog('- 获取到的食物增益: ' + tempData.foodBuff, 2);
        debugLog('- 是否涮鱼: ' + (tempData.foodBuff === '涮鱼'), 2);
        
        return tempData;
    }
    
    // 验证数据
    validateData(data) {
        return DataValidator.validatePanelData(data);
    }
    
    // 更新数据
    updateData(newData) {
        this.data = { ...this.data, ...newData };
    }
    
    // 获取数据
    getData() {
        return { ...this.data };
    }
    
    // 重置为默认值
    reset() {
        this.data = this.getDefaultData();
    }
}

// 创建数据管理器实例
const panelDataManager = new PanelDataManager();

// 为了向后兼容，保留全局变量（但标记为废弃）
/** @deprecated 使用 panelDataManager.getData() 替代 */
let panelData = panelDataManager.getData();

// 排轴数据管理器 - 支持多实例
class RotationDataManager {
    constructor() {
        this.rotations = new Map();
        this.currentRotationId = 'default';
        this.originalRotations = new Map();
    }
    
    // 创建新的排轴实例
    createRotation(id, data = []) {
        this.rotations.set(id, [...data]);
        this.originalRotations.set(id, [...data]);
        return this.getRotation(id);
    }
    
    // 获取排轴数据
    getRotation(id = null) {
        const rotationId = id || this.currentRotationId;
        return this.rotations.get(rotationId) || [];
    }
    
    // 更新排轴数据
    updateRotation(id, data) {
        this.rotations.set(id, [...data]);
        return this.getRotation(id);
    }
    
    // 设置当前排轴ID
    setCurrentRotation(id) {
        this.currentRotationId = id;
    }
    
    // 获取当前排轴数据
    getCurrentRotation() {
        return this.getRotation(this.currentRotationId);
    }
    
    // 更新当前排轴数据
    updateCurrentRotation(data) {
        return this.updateRotation(this.currentRotationId, data);
    }
    
    // 获取原始排轴数据
    getOriginalRotation(id = null) {
        const rotationId = id || this.currentRotationId;
        return this.originalRotations.get(rotationId) || [];
    }
    
    // 更新原始排轴数据
    updateOriginalRotation(id, data) {
        this.originalRotations.set(id, [...data]);
    }
    
    // 删除排轴实例
    deleteRotation(id) {
        this.rotations.delete(id);
        this.originalRotations.delete(id);
    }
    
    // 获取所有排轴ID
    getAllRotationIds() {
        return Array.from(this.rotations.keys());
    }
    
    // 复制排轴数据
    copyRotation(fromId, toId) {
        const sourceData = this.getRotation(fromId);
        return this.createRotation(toId, sourceData);
    }
}

// 创建全局排轴数据管理器实例
const rotationDataManager = new RotationDataManager();

// 向后兼容的全局变量（已弃用，建议使用 rotationDataManager）
/** @deprecated 使用 rotationDataManager.getCurrentRotation() 替代 */
let rotationData = rotationDataManager.getCurrentRotation();

/** @deprecated 使用 rotationDataManager.getOriginalRotation() 替代 */
let originalRotationData = rotationDataManager.getOriginalRotation();

// 向后兼容性支持：同步全局变量与排轴数据管理器
function syncGlobalRotationData() {
    // 同步全局变量到排轴数据管理器
    if (rotationData && rotationData.length > 0) {
        rotationDataManager.updateCurrentRotation(rotationData);
    }
    
    // 同步原始排轴数据
    if (originalRotationData && originalRotationData.length > 0) {
        rotationDataManager.updateOriginalRotation(rotationDataManager.currentRotationId, originalRotationData);
    }
}

// 向后兼容性支持：更新全局变量
function updateGlobalRotationData() {
    rotationData = rotationDataManager.getCurrentRotation();
    originalRotationData = rotationDataManager.getOriginalRotation();
}

// 辅助函数：更新排轴数据并同步到管理器
function updateRotationDataItem(index, newData) {
    if (index >= 0 && index < rotationData.length) {
        rotationData[index] = newData;
        // 同步到排轴数据管理器
        rotationDataManager.updateCurrentRotation(rotationData);
    }
}

// 辅助函数：批量更新排轴数据并同步到管理器
function updateRotationDataBatch(updates) {
    let hasChanges = false;
    updates.forEach(({ index, data }) => {
        if (index >= 0 && index < rotationData.length) {
            rotationData[index] = data;
            hasChanges = true;
        }
    });
    
    if (hasChanges) {
        // 同步到排轴数据管理器
        rotationDataManager.updateCurrentRotation(rotationData);
    }
}

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

// Dot技能列表（特殊处理的技能）- 使用配置中的定义

// ==================== 优化的缓存系统 ====================
class AdvancedCache {
    constructor(maxSize = 1000, expireTime = 5 * 60 * 1000) {
        this.cache = new Map();
        this.accessOrder = new Map(); // 记录访问顺序
        this.maxSize = maxSize;
        this.expireTime = expireTime;
        this.hitCount = 0;
        this.missCount = 0;
    }
    
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            this.missCount++;
            return null;
        }
        
        // 检查是否过期
        if (Date.now() - entry.timestamp > this.expireTime) {
            this.cache.delete(key);
            this.accessOrder.delete(key);
            this.missCount++;
            return null;
        }
        
        // 更新访问顺序
        this.accessOrder.set(key, Date.now());
        this.hitCount++;
        return entry.data;
    }
    
    set(key, data) {
        // 如果缓存已满，删除最久未访问的项
        if (this.cache.size >= this.maxSize) {
            this.evictLRU();
        }
        
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
        this.accessOrder.set(key, Date.now());
    }
    
    evictLRU() {
        let oldestKey = null;
        let oldestTime = Infinity;
        
        for (const [key, time] of this.accessOrder.entries()) {
            if (time < oldestTime) {
                oldestTime = time;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.accessOrder.delete(oldestKey);
        }
    }
    
    clear() {
        this.cache.clear();
        this.accessOrder.clear();
    }
    
    getStats() {
        const total = this.hitCount + this.missCount;
        return {
            size: this.cache.size,
            hitRate: total > 0 ? (this.hitCount / total * 100).toFixed(2) + '%' : '0%',
            hitCount: this.hitCount,
            missCount: this.missCount
        };
    }
    
    cleanExpired() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.expireTime) {
                this.cache.delete(key);
                this.accessOrder.delete(key);
            }
        }
    }
}

// 创建优化的缓存实例
const damageCache = new AdvancedCache(1000, 5 * 60 * 1000);

// 防抖定时器
let updateTableDebounceTimer = null;
let updateChartsDebounceTimer = null;

// 计算状态监控
let isCalculating = false;
let pendingCalculation = false;

// 生成缓存键
function generateCacheKey(skill, panelData) {
    // 只包含影响伤害计算的关键属性
    const keyData = {
        // 技能属性
        name: skill.name,
        times: skill.times,
        buffName: skill.buffName,
        setLayer: skill.setLayer,
        talismanLayer: skill.talismanLayer,
        yishuiLayer: skill.yishuiLayer,
        suohenLayer: skill.suohenLayer,
        qijie: skill.qijie,
        naisan: skill.naisan,
        yishang: skill.yishang,
        // 面板关键属性
        externalAttack: panelData.externalAttack,
        breakBambooAttack: panelData.breakBambooAttack,
        precisionRate: panelData.precisionRate,
        criticalRate: panelData.criticalRate,
        intentRate: panelData.intentRate,
        directCriticalRate: panelData.directCriticalRate,
        criticalDamageBonus: panelData.criticalDamageBonus,
        intentDamageBonus: panelData.intentDamageBonus,
        externalPenetration: panelData.externalPenetration,
        elementalPenetration: panelData.elementalPenetration,
        externalDamageBonus: panelData.externalDamageBonus,
        elementalDamageBonus: panelData.elementalDamageBonus,
        equipmentSet: panelData.equipmentSet,
        foodBuff: panelData.foodBuff,
        bossDefense: panelData.bossDefense,
        // 增伤属性
        ropeDartBonus: panelData.ropeDartBonus,
        dualBladesBonus: panelData.dualBladesBonus,
        allMartialBonus: panelData.allMartialBonus,
        bossUnitBonus: panelData.bossUnitBonus,
        lightStrikeBonus: panelData.lightStrikeBonus,
        mouseBonus: panelData.mouseBonus,
        bossTalent: panelData.bossTalent,
        isSimulationMode: isSimulationMode
    };
    
    return JSON.stringify(keyData);
}

// 缓存清理函数
// ==================== 优化的缓存管理函数 ====================
function cleanExpiredCache() {
    damageCache.cleanExpired();
}

// 获取缓存统计信息
function getCacheStats() {
    return damageCache.getStats();
}


// ==================== 调试面板 ====================
function createDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        display: none;
        max-width: 300px;
    `;
    
    const updateDebugInfo = () => {
        const metrics = performanceMonitor.getMetrics();
        debugPanel.innerHTML = `
            <div><strong>性能监控</strong></div>
            <div>总计算次数: ${metrics.totalCalculations}</div>
            <div>平均计算时间: ${metrics.averageCalculationTime.toFixed(2)}ms</div>
            <div>缓存命中率: ${metrics.cacheStats.hitRate}</div>
            <div>缓存大小: ${metrics.cacheStats.size}</div>
            <div>缓存命中: ${metrics.cacheStats.hitCount}</div>
            <div>缓存未命中: ${metrics.cacheStats.missCount}</div>
        `;
    };
    
    // 每秒更新一次
    setInterval(updateDebugInfo, 1000);
    
    document.body.appendChild(debugPanel);
    return debugPanel;
}

// 切换调试面板显示
function toggleDebugPanel() {
    let debugPanel = document.getElementById('debug-panel');
    if (!debugPanel) {
        debugPanel = createDebugPanel();
    }
    
    debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
}

// 添加键盘快捷键（Ctrl+Shift+D 切换调试面板）
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDebugPanel();
    }
});

// 防抖版本的表格更新（优化版本）
function debouncedUpdateRotationTable() {
    if (updateTableDebounceTimer) {
        clearTimeout(updateTableDebounceTimer);
    }
    
    // 设置待处理标记
    pendingCalculation = true;
    
    updateTableDebounceTimer = setTimeout(() => {
        if (isCalculating) {
            // 如果正在计算，稍后重试
            setTimeout(debouncedUpdateRotationTable, 50);
            return;
        }
        
        isCalculating = true;
        pendingCalculation = false;
        
        try {
            updateRotationTable();
        } finally {
            isCalculating = false;
            
            // 检查是否有待处理的计算
            if (pendingCalculation) {
                setTimeout(debouncedUpdateRotationTable, 10);
            }
        }
        
        updateTableDebounceTimer = null;
    }, 150); // 150ms防抖延迟
}

// 防抖版本的图表更新
function debouncedUpdateCharts() {
    if (updateChartsDebounceTimer) {
        clearTimeout(updateChartsDebounceTimer);
    }
    
    updateChartsDebounceTimer = setTimeout(() => {
        updateAllCharts();
        updateChartsDebounceTimer = null;
    }, 300); // 300ms防抖延迟
}


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
    
    // 初始化基础信息页面计算按钮
    initBasicInfoCalculateButton();
    
    // 初始化保存排轴按钮
    initSaveRotationButton();

    // 初始化导入排轴按钮
    initImportRotationButton();
    
    // 初始化模拟计算按钮
    initSimulationButton();
    
    // 初始化排轴配置管理功能
    initRotationConfigManagement();
    // 从“轴”文件夹自动加载排轴配置
    autoLoadFolderConfigs();
    
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
    
    // 确保按钮处于正确状态
    ensureButtonsEnabled();
    
    // 测试按钮功能
    setTimeout(() => {
        testButtonFunctions();
    }, 1000);
});

// 确保按钮处于正确状态
function ensureButtonsEnabled() {
    debugLog('🔧 确保按钮处于正确状态...', 2);
    
    // 检查当前是否在模拟模式
    if (isSimulationMode) {
        debugLog('⚠️ 当前处于模拟模式，按钮应该被禁用', 2);
        return;
    }
    
    // 确保排轴操作按钮可用
    const rotationButtons = ['clear-rotation-btn', 'save-rotation-btn', 'import-rotation-btn', 'simulation-btn'];
    rotationButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            debugLog(`✅ 按钮 ${btnId} 已启用`, 2);
        } else {
            debugError(`❌ 找不到按钮 ${btnId}`);
        }
    });
    
    debugLog('✅ 按钮状态检查完成', 2);
}

// 测试按钮功能
function testButtonFunctions() {
    debugLog('🧪 测试按钮功能...', 2);
    
    // 测试清空排轴按钮
    const clearBtn = document.getElementById('clear-rotation-btn');
    if (clearBtn) {
        debugLog('✅ 清空排轴按钮存在', 2);
        debugLog('- disabled: ' + clearBtn.disabled, 2);
        debugLog('- opacity: ' + clearBtn.style.opacity, 2);
        debugLog('- cursor: ' + clearBtn.style.cursor, 2);
    } else {
        debugError('❌ 找不到清空排轴按钮');
    }
    
    // 测试保存排轴按钮
    const saveBtn = document.getElementById('save-rotation-btn');
    if (saveBtn) {
        debugLog('✅ 保存排轴按钮存在', 2);
        debugLog('- disabled: ' + saveBtn.disabled, 2);
        debugLog('- opacity: ' + saveBtn.style.opacity, 2);
        debugLog('- cursor: ' + saveBtn.style.cursor, 2);
    } else {
        debugError('❌ 找不到保存排轴按钮');
    }
    
    // 检查事件监听器
    debugLog('🔍 检查事件监听器...', 2);
    debugLog('- rotationData长度: ' + (rotationData ? rotationData.length : 'undefined'), 2);
    debugLog('- 当前模拟模式: ' + isSimulationMode, 2);
}

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
            
            debugLog(`基础信息面板套装选择：${selectedSet}，已同步到表头`, 2);
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
        });
        
    } catch (error) {
        console.error('初始化联动模式开关时发生错误:', error);
    }
}

// 初始化排轴表格
function initRotationTable() {
    const tableBody = document.querySelector('#rotation-table tbody');
    
    // 清空表格内容
    tableBody.innerHTML = '';
    
    // 初始化事件委托
    initRotationTableEventDelegation();
    
    // 遍历排轴数据，添加到表格中
    updateRotationTable();
}

// 初始化排轴表格事件委托（优化版本）
function initRotationTableEventDelegation() {
    const rotationTable = document.getElementById('rotation-table');
    if (!rotationTable) {
        console.error('找不到排轴表格元素');
        return;
    }
    
    // 检查是否已经初始化过事件委托
    if (rotationTable.hasAttribute('data-event-delegated')) {
        return; // 已经初始化过，避免重复绑定
    }
    
    // 标记已经初始化
    rotationTable.setAttribute('data-event-delegated', 'true');
    
    // 使用事件委托统一处理所有事件
    rotationTable.addEventListener('change', function(e) {
        const target = e.target;
        const index = parseInt(target.getAttribute('data-index'));
        
        // 检查索引有效性
        if (isNaN(index) || index < 0 || index >= rotationData.length) {
            console.error('无效的索引:', index, '数据长度:', rotationData.length);
            return;
        }
        
        // 技能选择下拉框
        if (target.classList.contains('table-skill-select')) {
            handleSkillSelect(target, index);
        }
        // BUFF选择下拉框
        else if (target.classList.contains('table-buff-select')) {
            handleBuffSelect(target, index);
        }
        // 次数输入框
        else if (target.classList.contains('table-times-input')) {
            handleTimesInput(target, index);
        }
        // 套装层数下拉框
        else if (target.classList.contains('table-set-layer-select')) {
            handleSetLayerSelect(target, index);
        }
        // 符帖下拉框
        else if (target.classList.contains('table-talisman-select')) {
            handleTalismanSelect(target, index);
        }
        // 易水歌下拉框
        else if (target.classList.contains('table-yishui-select')) {
            handleYishuiSelect(target, index);
        }
        // 所恨年年下拉框
        else if (target.classList.contains('table-suohen-select')) {
            handleSuohenSelect(target, index);
        }
        // 气窭复选框
        else if (target.classList.contains('table-qijie-checkbox')) {
            handleQijieCheckbox(target, index);
        }
        // 奶伞复选框
        else if (target.classList.contains('table-naisan-checkbox')) {
            handleNaisanCheckbox(target, index);
        }
        // 易伤复选框
        else if (target.classList.contains('table-yishang-checkbox')) {
            handleYishangCheckbox(target, index);
        }
    });
    
    // 处理点击事件（删除按钮和插入按钮）
    rotationTable.addEventListener('click', function(e) {
        const target = e.target;
        
        // 删除按钮
        if (target.classList.contains('delete-btn')) {
            const index = parseInt(target.getAttribute('data-index'));
            if (!isNaN(index) && index >= 0 && index < rotationData.length) {
                removeSkillFromRotation(index);
            }
        }
        
        // 插入按钮
        if (target.classList.contains('insert-btn')) {
            const index = parseInt(target.getAttribute('data-index'));
            if (!isNaN(index) && index >= 0 && index <= rotationData.length) {
                insertSkillToRotation(index);
            }
        }
    });
    
}

// 处理技能选择
 function handleSkillSelect(target, index) {
    const selectedSkillName = target.value;
    
    
    if (selectedSkillName && selectedSkillName !== '') {
        // 查找选中的技能数据
        const selectedSkill = skillRatesData.find(skill => skill.name === selectedSkillName);
        
        if (selectedSkill) {
            // 保留原有的非技能数据
            const originalData = rotationData[index];
            
            // 更新排轴数据，保留原有的非技能相关属性
            const newSkillData = {
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
                yishang: originalData.yishang || '否'
            };
            
            updateRotationDataItem(index, newSkillData);
            
            // 重新渲染表格（使用防抖版本）
            debouncedUpdateRotationTable();
        } else {
            console.error('找不到技能:', selectedSkillName);
        }
    }
}

// 处理BUFF选择
function handleBuffSelect(target, index) {
    const selectedBuffName = target.value;
    
    if (selectedBuffName && selectedBuffName !== '') {
        // 查找选中的BUFF数据
        const selectedBuff = buffData.find(buff => buff.name === selectedBuffName);
        
        if (selectedBuff) {
            // 更新排轴数据
            const newBuffData = {
                ...rotationData[index],
                buffName: selectedBuff.name,
                generalBonus: selectedBuff.generalBonus,
                criticalBonus: selectedBuff.criticalBonus,
                externalPenetration: selectedBuff.externalPenetration,
                extraCriticalRate: selectedBuff.extraCriticalRate
            };
            
            updateRotationDataItem(index, newBuffData);
            
            // 更新表格（使用防抖版本）
            debouncedUpdateRotationTable();
        } else {
            console.error('找不到BUFF:', selectedBuffName);
        }
    }
}

// 处理次数输入
function handleTimesInput(target, index) {
    const times = parseFloat(target.value) || 1;
    
    // 更新排轴数据
    const newTimesData = {
        ...rotationData[index],
        times: times
    };
    
    updateRotationDataItem(index, newTimesData);
    
    // 更新表格
    updateRotationTable();
}

// 处理套装层数选择
function handleSetLayerSelect(target, index) {
    const setLayer = target.value;
    
    // 更新当前行的数据
    const newSetLayerData = {
        ...rotationData[index],
        setLayer: setLayer
    };
    
    updateRotationDataItem(index, newSetLayerData);
    
    // 检查是否启用联动模式
    if (isCascadeModeEnabled()) {
        
        // 联动选择：将该位置以下的所有套装下拉框同步为相同选择
        const updates = [];
        for (let i = index + 1; i < rotationData.length; i++) {
            updates.push({
                index: i,
                data: {
                ...rotationData[i],
                setLayer: setLayer
                }
            });
        }
        
        updateRotationDataBatch(updates);
        
    } else {
    }
    
    // 更新表格
    updateRotationTable();
}

// 处理符帖选择
function handleTalismanSelect(target, index) {
    const talismanLayer = target.value;
    
    // 更新当前行的数据
    const newTalismanData = {
        ...rotationData[index],
        talismanLayer: talismanLayer
    };
    
    updateRotationDataItem(index, newTalismanData);
    
    // 检查是否启用联动模式
    if (isCascadeModeEnabled()) {
        
        // 联动选择：将该位置以下的所有符帖下拉框同步为相同选择
        const updates = [];
        for (let i = index + 1; i < rotationData.length; i++) {
            updates.push({
                index: i,
                data: {
                ...rotationData[i],
                talismanLayer: talismanLayer
                }
            });
        }
        
        updateRotationDataBatch(updates);
        
    } else {
    }
    
    // 更新表格
    updateRotationTable();
}

// 处理易水歌选择
function handleYishuiSelect(target, index) {
    const yishuiLayer = target.value;
    
    // 更新当前行的数据
    const newYishuiData = {
        ...rotationData[index],
        yishuiLayer: yishuiLayer
    };
    
    updateRotationDataItem(index, newYishuiData);
    
    // 检查是否启用联动模式
    if (isCascadeModeEnabled()) {
        
        // 联动选择：将该位置以下的所有易水歌下拉框同步为相同选择
        const updates = [];
        for (let i = index + 1; i < rotationData.length; i++) {
            updates.push({
                index: i,
                data: {
                ...rotationData[i],
                yishuiLayer: yishuiLayer
                }
            });
        }
        
        updateRotationDataBatch(updates);
        
    } else {
    }
    
    // 更新表格
    updateRotationTable();
}

// 处理所恨年年选择
function handleSuohenSelect(target, index) {
    const suohenLayer = target.value;
    
    // 更新当前行的数据
    const newSuohenData = {
        ...rotationData[index],
        suohenLayer: suohenLayer
    };
    
    updateRotationDataItem(index, newSuohenData);
    
    // 检查是否启用联动模式
    if (isCascadeModeEnabled()) {
        
        // 联动选择：将该位置以下的所有所恨年年下拉框同步为相同选择
        const updates = [];
        for (let i = index + 1; i < rotationData.length; i++) {
            updates.push({
                index: i,
                data: {
                ...rotationData[i],
                suohenLayer: suohenLayer
                }
            });
        }
        
        updateRotationDataBatch(updates);
        
    } else {
    }
    
    // 更新表格
    updateRotationTable();
}

// 处理气窭复选框
function handleQijieCheckbox(target, index) {
    const qijie = target.checked ? '是' : '否';
    
    // 更新排轴数据
    const newQijieData = {
        ...rotationData[index],
        qijie: qijie
    };
    
    updateRotationDataItem(index, newQijieData);
    
    // 更新表格
    updateRotationTable();
}

// 处理奶伞复选框
function handleNaisanCheckbox(target, index) {
    const naisan = target.checked ? '是' : '否';
    
    // 更新排轴数据
    const newNaisanData = {
        ...rotationData[index],
        naisan: naisan
    };
    
    updateRotationDataItem(index, newNaisanData);
    
    // 更新表格
    updateRotationTable();
}

// 处理易伤复选框
function handleYishangCheckbox(target, index) {
    const yishang = target.checked ? '是' : '否';
    
    // 更新排轴数据
    const newYishangData = {
        ...rotationData[index],
        yishang: yishang
    };
    
    updateRotationDataItem(index, newYishangData);
    
    // 更新表格
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

// 计算极乐泣血的次数和层数（支持独立数据）
function calculateJileQixueTimes(rotationDataParam = null) {
    // 获取排轴数据（支持多实例）
    const currentRotationData = rotationDataParam || rotationDataManager.getCurrentRotation();
    const jileIndices = [];
    const hitSums = [];
    
    // 找到所有极乐泣血的位置
    currentRotationData.forEach((skill, index) => {
        if (skill.name === "极乐泣血") {
            jileIndices.push(index);
        }
    });
    
    // 如果没有极乐泣血，直接返回
    if (jileIndices.length === 0) {
        return currentRotationData;
    }
    
    // 如果是手动模式，不自动计算，直接返回
    if (jileCalculationMode === 'manual') {
        return currentRotationData;
    }
    
    // 计算每个极乐泣血之间的hit数总和
    for (let i = 0; i < jileIndices.length; i++) {
        const startIndex = i === 0 ? 0 : jileIndices[i - 1] + 1;
        const endIndex = jileIndices[i];
        
        let hitSum = 0;
        for (let j = startIndex; j < endIndex; j++) {
            const skill = skillRatesData.find(s => s.name === currentRotationData[j].name);
            if (skill) {
                hitSum += skill.hit * (currentRotationData[j].times || 1);
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
        currentRotationData[jileIndex] = {
            ...currentRotationData[jileIndex],
            times: Math.round(finalTimes * 100) / 100, // 保留2位小数，避免浮点数精度问题
            jileLayers: Math.round(remainingLayers * 100) / 100,
            jileHitSum: hitSum,
            jileExpectedLayers: Math.round(expectedLayers * 100) / 100
        };
    });
    
    return currentRotationData;
}

// 多面板期望伤害计算管理器
class MultiPanelCalculationManager {
    constructor() {
        this.panels = new Map();
        this.calculations = new Map();
    }
    
    // 注册面板
    registerPanel(panelId, panelData, rotationData) {
        this.panels.set(panelId, {
            panelData: { ...panelData },
            rotationData: [...rotationData],
            lastCalculated: null
        });
    }
    
    // 计算单个面板的期望伤害
    calculatePanelExpectedDamage(panelId) {
        const panel = this.panels.get(panelId);
        if (!panel) {
            console.error(`面板 ${panelId} 不存在`);
            return 0;
        }
        
        const expectedDamage = calculateExpectedDamage(panel.panelData, panel.rotationData);
        panel.lastCalculated = expectedDamage;
        return expectedDamage;
    }
    
    // 计算所有面板的期望伤害
    calculateAllPanelsExpectedDamage() {
        const results = {};
        
        this.panels.forEach((panel, panelId) => {
            results[panelId] = this.calculatePanelExpectedDamage(panelId);
        });
        
        return results;
    }
    
    // 比较两个面板的期望伤害
    comparePanels(panelId1, panelId2) {
        const damage1 = this.calculatePanelExpectedDamage(panelId1);
        const damage2 = this.calculatePanelExpectedDamage(panelId2);
        
        return {
            panel1: { id: panelId1, damage: damage1 },
            panel2: { id: panelId2, damage: damage2 },
            difference: damage1 - damage2,
            betterPanel: damage1 > damage2 ? panelId1 : panelId2
        };
    }
    
    // 获取面板信息
    getPanel(panelId) {
        return this.panels.get(panelId);
    }
    
    // 更新面板数据
    updatePanel(panelId, panelData, rotationData) {
        if (this.panels.has(panelId)) {
            this.panels.set(panelId, {
                panelData: { ...panelData },
                rotationData: [...rotationData],
                lastCalculated: null
            });
        }
    }
    
    // 删除面板
    removePanel(panelId) {
        this.panels.delete(panelId);
    }
    
    // 获取所有面板ID
    getAllPanelIds() {
        return Array.from(this.panels.keys());
    }
}

// 创建全局多面板计算管理器实例
const multiPanelCalculationManager = new MultiPanelCalculationManager();

// 多面板计算工具函数
class MultiPanelCalculationUtils {
    // 创建两个面板的对比计算
    static createDualPanelComparison(panel1Id, panel1Data, panel1Rotation, panel2Id, panel2Data, panel2Rotation) {
        // 注册两个面板
        multiPanelCalculationManager.registerPanel(panel1Id, panel1Data, panel1Rotation);
        multiPanelCalculationManager.registerPanel(panel2Id, panel2Data, panel2Rotation);
        
        // 计算对比结果
        const comparison = multiPanelCalculationManager.comparePanels(panel1Id, panel2Id);
        
        return {
            ...comparison,
            panel1Dps: comparison.panel1.damage / T,
            panel2Dps: comparison.panel2.damage / T,
            dpsDifference: (comparison.panel1.damage - comparison.panel2.damage) / T
        };
    }
    
    // 批量计算多个面板
    static calculateMultiplePanels(panels) {
        const results = {};
        
        panels.forEach(panel => {
            multiPanelCalculationManager.registerPanel(panel.id, panel.panelData, panel.rotationData);
            results[panel.id] = multiPanelCalculationManager.calculatePanelExpectedDamage(panel.id);
        });
        
        return results;
    }
    
    // 获取最佳面板
    static getBestPanel(panelIds) {
        let bestPanel = null;
        let bestDamage = 0;
        
        panelIds.forEach(panelId => {
            const damage = multiPanelCalculationManager.calculatePanelExpectedDamage(panelId);
            if (damage > bestDamage) {
                bestDamage = damage;
                bestPanel = panelId;
            }
        });
        
        return { panelId: bestPanel, damage: bestDamage };
    }
    
    // 导出面板数据
    static exportPanelData(panelId) {
        const panel = multiPanelCalculationManager.getPanel(panelId);
        if (!panel) return null;
        
        return {
            panelId,
            panelData: panel.panelData,
            rotationData: panel.rotationData,
            expectedDamage: panel.lastCalculated
        };
    }
    
// 导入面板数据
static importPanelData(panelId, panelData, rotationData) {
    multiPanelCalculationManager.registerPanel(panelId, panelData, rotationData);
    return multiPanelCalculationManager.calculatePanelExpectedDamage(panelId);
}
}

// 测试函数：验证排轴数据同步
function testRotationDataSync() {
    console.log('=== 测试排轴数据同步 ===');
    
    // 检查全局变量与排轴数据管理器是否同步
    const globalRotationData = rotationData;
    const managerRotationData = rotationDataManager.getCurrentRotation();
    
    console.log('全局rotationData长度:', globalRotationData.length);
    console.log('管理器rotationData长度:', managerRotationData.length);
    console.log('数据是否同步:', JSON.stringify(globalRotationData) === JSON.stringify(managerRotationData));
    
    // 检查排轴数据管理器状态
    console.log('当前排轴ID:', rotationDataManager.currentRotationId);
    console.log('所有排轴ID:', rotationDataManager.getAllRotationIds());
    
    return {
        globalLength: globalRotationData.length,
        managerLength: managerRotationData.length,
        isSynced: JSON.stringify(globalRotationData) === JSON.stringify(managerRotationData)
    };
}

// ==================== 多面板计算使用示例 ====================
/*
// 示例1：创建两个面板的对比计算
const panel1Data = panelDataManager.getDataFromInputs();
const panel1Rotation = rotationDataManager.getCurrentRotation();
const panel2Data = { ...panel1Data, externalAttack: { min: 1500, max: 2500 } };
const panel2Rotation = [...panel1Rotation];

const comparison = MultiPanelCalculationUtils.createDualPanelComparison(
    'panel1', panel1Data, panel1Rotation,
    'panel2', panel2Data, panel2Rotation
);

console.log('面板对比结果:', comparison);
console.log('伤害差异:', comparison.difference);
console.log('更好的面板:', comparison.betterPanel);

// 示例2：批量计算多个面板
const panels = [
    { id: 'panel1', panelData: panel1Data, rotationData: panel1Rotation },
    { id: 'panel2', panelData: panel2Data, rotationData: panel2Rotation },
    { id: 'panel3', panelData: panel3Data, rotationData: panel3Rotation }
];

const results = MultiPanelCalculationUtils.calculateMultiplePanels(panels);
console.log('多面板计算结果:', results);

// 示例3：获取最佳面板
const bestPanel = MultiPanelCalculationUtils.getBestPanel(['panel1', 'panel2', 'panel3']);
console.log('最佳面板:', bestPanel);

// 示例4：导出/导入面板数据
const exportedData = MultiPanelCalculationUtils.exportPanelData('panel1');
const importedDamage = MultiPanelCalculationUtils.importPanelData('panel4', exportedData.panelData, exportedData.rotationData);
*/

// 更新排轴表格（优化版本，支持多实例）
function updateRotationTable(rotationDataParam = null) {
    // 获取排轴数据（支持多实例）
    const currentRotationData = rotationDataParam || rotationData;
    
    debugLog('开始更新排轴表格, 当前数据长度: ' + currentRotationData.length, 2);
    
    // 获取当前面板数据（局部变量）
    const currentPanelData = panelDataManager.getDataFromInputs();
    
    // 计算极乐泣血的次数（模拟模式下跳过，因为已经分离处理）
    if (!isSimulationMode) {
        const updatedRotationData = calculateJileQixueTimes(currentRotationData);
        // 更新当前排轴数据
        rotationDataManager.updateCurrentRotation(updatedRotationData);
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
    currentRotationData.forEach((skill, index) => {
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
            let talismanElementalDamageBonus = 0; // 用于存储真气属攻帖的属攻伤害加成，对破竹伤害和外属伤害都生效
            
            // 绳镖武学增伤：仅对"鼠鼠生威"和"牵绳引刃"两个技能生效
            if (GameConfig.skillCategories.ropeDartSkills.includes(skill.name)) {
                generalBonus += panelData.ropeDartBonus;
            }
            
            // 鼠鼠生威技能额外80%通用增伤
            if (skill.name === "鼠鼠生威") {
                generalBonus += 80;
            }
            
            // 双刀武学增伤：适用于白刀技能A1至A4、红刀技能A1至A5以及痴障技能
            if (GameConfig.skillCategories.dualBladesSkills.includes(skill.name)) {
                generalBonus += panelData.dualBladesBonus;
            }
            
            // 全武学增伤：适用于绳镖武学、双刀武学、易水歌和极乐泣血技能
            if (GameConfig.skillCategories.allMartialSkills.includes(skill.name)) {
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
                        // 奇术帖只对特定技能生效
                        const qishuSkills = ['骑龙回马一段', '骑龙回马二段', '箫声千浪炸', '箫声千浪(炸前)', '箫声千浪(炸后)', '清风霁月'];
                        if (qishuSkills.includes(skill.name)) {
                            generalBonus += 15; // 15%通用增伤
                        }
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
                        talismanElementalDamageBonus += 15; // 15%属攻伤害加成，对破竹伤害和外属伤害都生效
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
            let bossTalentBonus = 0;
            if (panelData.bossTalent === 'trial-sword') {
                bossTalentBonus = 15; // 试剑/侠境增加15%通用增伤
            }
            generalBonus += bossTalentBonus;
            
            // 鼠鼠定音增伤：仅适用于鼠鼠生威技能，独立计算
            // 鼠鼠生威技能有额外独立的1.3倍全部伤害（1.24倍外功伤害已归类为额外外功伤害加成）
            const mouseGeneralBonus = skill.name === "鼠鼠生威" ? (1 + panelData.mouseBonus / 100) * 1.3 : 1;
            
            // 强效轻击增伤：仅适用于红刀A1-A5技能，独立计算
            const lightStrikeBonus = GameConfig.skillCategories.redBladeSkills.includes(skill.name) ? (1 + panelData.lightStrikeBonus / 100) : 1;
            
            // 红刀A1-A5属攻穿透+10：仅适用于红刀A1-A5技能
            const redBladeElementalPenetration = GameConfig.skillCategories.redBladeSkills.includes(skill.name) ? GameConfig.constants.redBladeElementalPenetration : 0;
            
            // 获取面板数据
            const precisionRate = panelData.precisionRate / 100; // 精准率（转换为小数）
            // 面板会心率=会心率+额外会心率（不超过80%）+直接会心率（可超出80%）（转换为小数）
            const baseCriticalRate = Math.min((panelData.criticalRate + extraCriticalRate) / 100, GameConfig.constants.maxCriticalRate);
            const directCriticalRate = panelData.directCriticalRate / 100;
            const criticalRate = baseCriticalRate + directCriticalRate;   
            const intentRate = panelData.intentRate / 100;     // 会意率（转换为小数）
            
            // 计算生效会心率、生效会意率、擦伤率和白字率
            let effectiveCriticalRate, effectiveIntentRate, grazeRate, whiteTextRate;
            
            // 检查是否为Dot技能（在任何模式下都只产生白字伤害）
            if (GameConfig.skillCategories.dotSkills.includes(skill.name)) {
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
                debugLog('🔥 涮鱼增益应用: 外功攻击+120~240', 2);
            }
            
            // 计算外功攻击值（模拟模式下使用随机值，Dot技能除外）
            let avgExternalAttack;
            if (isSimulationMode && !GameConfig.skillCategories.dotSkills.includes(skill.name)) {
                // 在最小值到最大值之间随机选取一个整数
                avgExternalAttack = Math.floor(Math.random() * (externalAttackWithFeisui.max - externalAttackWithFeisui.min + 1)) + externalAttackWithFeisui.min;
            } else {
                // 正常模式或Dot技能使用平均值
                avgExternalAttack = (externalAttackWithFeisui.min + externalAttackWithFeisui.max) / 2;
            }
            
            // 计算破竹攻击值（模拟模式下使用随机值，Dot技能除外）
            let avgBreakBambooAttack;
            if (isSimulationMode && !GameConfig.skillCategories.dotSkills.includes(skill.name)) {
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
            if (isSimulationMode && !GameConfig.skillCategories.dotSkills.includes(skill.name)) {
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
            let effectiveBossDefense = panelData.bossDefense;
            
            // 先应用技能的10%减防
            if (GameConfig.skillCategories.bladeSkills.includes(skill.name)) {
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
                                             (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * GameConfig.constants.breakBambooMultiplier * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                             (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算破竹会意伤害
            const breakBambooIntentDamage = (panelData.breakBambooAttack.max * skill.breakBambooRate + skill.fixedBreakBamboo) * 
                                            (1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200) * effectiveIntentRate * 
                                            (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * GameConfig.constants.breakBambooMultiplier * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                            (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算破竹白字伤害
            const breakBambooWhiteTextDamage = (avgBreakBambooAttack * skill.breakBambooRate + skill.fixedBreakBamboo) * 
                                               (1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200) * whiteTextRate * GameConfig.constants.breakBambooMultiplier * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                               (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算破竹擦伤伤害
            const breakBambooGrazeDamage = (panelData.breakBambooAttack.min * skill.breakBambooRate + skill.fixedBreakBamboo) * 
                                          (1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200) * grazeRate * GameConfig.constants.breakBambooMultiplier * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                          (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
            
            // 计算外属会心伤害
            const externalElementCriticalDamage = (avgRingMetalAttack * skill.externalElementRate) * 
                                                effectiveCriticalRate * (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 
                                                (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                                mouseGeneralBonus * lightStrikeBonus +
                                                (avgBreakRockAttack * skill.externalElementRate) * 
                                                effectiveCriticalRate * (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 
                                                (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                                mouseGeneralBonus * lightStrikeBonus +
                                                (avgPullSilkAttack * skill.externalElementRate) * 
                                                effectiveCriticalRate * (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 
                                                (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                                mouseGeneralBonus * lightStrikeBonus;
            
            // 计算外属会意伤害
            const externalElementIntentDamage = (panelData.ringMetalAttack.max * skill.externalElementRate) * 
                                              effectiveIntentRate * (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 
                                              (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                              mouseGeneralBonus * lightStrikeBonus +
                                              (panelData.breakRockAttack.max * skill.externalElementRate) * 
                                              effectiveIntentRate * (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 
                                              (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                              mouseGeneralBonus * lightStrikeBonus +
                                              (panelData.pullSilkAttack.max * skill.externalElementRate) * 
                                              effectiveIntentRate * (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 
                                              (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                              mouseGeneralBonus * lightStrikeBonus;
            
            // 计算外属白字伤害
            const externalElementWhiteTextDamage = (avgRingMetalAttack * skill.externalElementRate) * 
                                                whiteTextRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                                mouseGeneralBonus * lightStrikeBonus +
                                                (avgBreakRockAttack * skill.externalElementRate) * 
                                                whiteTextRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                                mouseGeneralBonus * lightStrikeBonus +
                                                (avgPullSilkAttack * skill.externalElementRate) * 
                                                whiteTextRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                                mouseGeneralBonus * lightStrikeBonus;
            
            // 计算外属擦伤伤害
            const externalElementGrazeDamage = (panelData.ringMetalAttack.min * skill.externalElementRate) * 
                                             grazeRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                             mouseGeneralBonus * lightStrikeBonus +
                                             (panelData.breakRockAttack.min * skill.externalElementRate) * 
                                             grazeRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                             mouseGeneralBonus * lightStrikeBonus +
                                             (panelData.pullSilkAttack.min * skill.externalElementRate) * 
                                             grazeRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                             mouseGeneralBonus * lightStrikeBonus;
            
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
            
            // 新增：第一面板（排轴列表）详细伤害调试信息
            if (debugMode) {
                debugLog(`\n=== 第一面板技能${index}: ${skill.name} 详细伤害类型 ===`, 2);
                debugLog('- 外功会心伤害: ' + totalExternalCriticalDamage.toFixed(2), 2);
                debugLog('- 外功会意伤害: ' + totalExternalIntentDamage.toFixed(2), 2);
                debugLog('- 外功白字伤害: ' + totalExternalWhiteTextDamage.toFixed(2), 2);
                debugLog('- 外功擦伤伤害: ' + totalExternalGrazeDamage.toFixed(2), 2);
                debugLog('- 破竹会心伤害: ' + totalBreakBambooCriticalDamage.toFixed(2), 2);
                debugLog('- 破竹会意伤害: ' + totalBreakBambooIntentDamage.toFixed(2), 2);
                debugLog('- 破竹白字伤害: ' + totalBreakBambooWhiteTextDamage.toFixed(2), 2);
                debugLog('- 破竹擦伤伤害: ' + totalBreakBambooGrazeDamage.toFixed(2), 2);
                debugLog('- 外属会心伤害: ' + totalExternalElementCriticalDamage.toFixed(2), 2);
                debugLog('- 外属会意伤害: ' + totalExternalElementIntentDamage.toFixed(2), 2);
                debugLog('- 外属白字伤害: ' + totalExternalElementWhiteTextDamage.toFixed(2), 2);
                debugLog('- 外属擦伤伤害: ' + totalExternalElementGrazeDamage.toFixed(2), 2);
                debugLog('- 总伤害: ' + totalDamage.toFixed(2), 2);
                debugLog('- 使用次数: ' + times, 2);
            }
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
                <input type="number" class="table-times-input" data-index="${index}" value="${formatUpTo3Decimals(skill.times || 1)}" min="0" step="1" style="width: 60px; text-align: center;" ${skill.name === "极乐泣血" && jileCalculationMode === 'auto' ? 'readonly' : ''}>
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
            <td>
                <button class="insert-btn" data-index="${index}" title="在此行前插入">插入</button>
                <button class="delete-btn" data-index="${index}" title="删除此行">删除</button>
            </td>
        `;
        
        fragment.appendChild(row);
    });
    
    // 一次性添加所有行到表格
    tableBody.appendChild(fragment);
    
    // 使用requestAnimationFrame优化图表更新（防抖版本）
    debouncedUpdateCharts();




    
    
    
    
    
    
    
    // 一次性添加所有行到表格
    tableBody.appendChild(fragment);
    
    // 使用requestAnimationFrame优化图表更新（防抖版本）
    debouncedUpdateCharts();

    // 更新伤害统计表格
    updateDamageStatsTable();
    
    // 更新排轴列表伤害列总和显示
    updateRotationDamageSumDisplay();
    
    // 添加套装列表头下拉框事件监听器（只初始化一次）
    const headerSelect = document.getElementById('set-layer-header-select');
    if (headerSelect && !headerSelect.hasAttribute('data-event-bound')) {
        headerSelect.setAttribute('data-event-bound', 'true');
        headerSelect.addEventListener('change', handleSetLayerHeaderChange);
    }
}

// 处理套装列表头下拉框变化事件（现在直接控制套装类型选择）
function handleSetLayerHeaderChange(e) {
    const selectedSet = e.target.value;
    
    if (!selectedSet) {
        return; // 如果没有选择值，不执行同步
    }
    
    
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
    
    
    // 重新计算并更新表格
    updateRotationTable();
}



// 统一的保存功能函数
async function performSave() {
    try {
        
        // 统一收集所有面板数据
        collectAndSavePanelData();
        
        // 更新排轴列表数据
        updateRotationTable();
        
        // 显示保存成功消息
        showNotification('基础信息保存成功！排轴列表已更新');
        showSaveButtonSuccess('save-panel-btn');
        
        // 触发词条毕业度计算
        
        // 显示加载状态
        showCalculationLoading();
        
        try {
            // 获取当前期望伤害
            const rotationDamageSum = calculateRotationDamageSum();
            let expectedDamage;
            
            if (isSimulationMode) {
                const expectedElement = document.getElementById('expected-damage');
                expectedDamage = expectedElement ? parseFloat(expectedElement.textContent) || 0 : rotationDamageSum;
            } else {
                expectedDamage = rotationDamageSum;
            }
            
            // 计算词条毕业度
            await calculateAllGraduationsAsync(expectedDamage);
            
            
        } catch (error) {
            console.error('计算词条毕业度时发生错误:', error);
            showCalculationError(error);
        } finally {
            hideCalculationLoading();
        }
        
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
        
        
        // 移除可能存在的旧事件监听器
        const newSaveButton = saveButton.cloneNode(true);
        saveButton.parentNode.replaceChild(newSaveButton, saveButton);
        
        // 绑定新的点击事件
        newSaveButton.addEventListener('click', function() {
            
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
        
    } catch (error) {
        console.error('初始化保存按钮时发生错误:', error);
    }
}

// 初始化键盘快捷键支持
function initKeyboardShortcuts() {
    try {
        
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
            bossTalent: 'boss-talent-select',
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
                        // Boss防御 - 强制设置为96级BOSS(405)
                        panelData[key] = 405;
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
            bossTalent: panelData.bossTalent || 'wooden-dummy',
            bossDefense: panelData.bossDefense || 405,
            
            // 保存时间戳
            timestamp: Date.now()
        };
        
        // 保存到localStorage
        localStorage.setItem('panelDataDefaults', JSON.stringify(defaultValues));
        
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
            return false;
        }
        
        const defaultValues = JSON.parse(savedDefaults);
        
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
        setInputValue('boss-talent-select', defaultValues.bossTalent);
        setInputValue('boss-defense', defaultValues.bossDefense);
        
        return true;
        
    } catch (error) {
        console.error('加载基础信息默认值时发生错误:', error);
        return false;
    }
}



// 初始化清空排轴按钮
function initClearRotationButton() {
    const clearButton = document.getElementById('clear-rotation-btn');
    
    if (!clearButton) {
        console.error('❌ 找不到清空排轴按钮！');
        return;
    }
    
    debugLog('✅ 找到清空排轴按钮，正在绑定事件...', 2);
    
    clearButton.addEventListener('click', async () => {
        debugLog('🖱️ 清空排轴按钮被点击', 1);
        const confirmClear = await showConfirmDialog('确定要清空排轴吗？', '清空排轴');
        if (confirmClear) {
            debugLog('✅ 用户确认清空排轴', 1);
            // 清空排轴数据
            rotationData = [];
            
            // 同步到排轴数据管理器
            rotationDataManager.updateCurrentRotation(rotationData);
            
            // 更新排轴表格
            updateRotationTable();
            debugLog('✅ 排轴已清空，表格已更新', 1);
        } else {
            debugLog('❌ 用户取消清空排轴', 1);
        }
    });
    
    debugLog('✅ 清空排轴按钮事件绑定完成', 2);
}

// 从排轴中移除技能
function removeSkillFromRotation(index) {
    rotationData.splice(index, 1);
    updateRotationTable();
}

// 在排轴中插入技能
function insertSkillToRotation(index) {
    let newRotationItem;
    
    // 判断是否已有行数据
    if (rotationData.length > 0) {
        // 如果有数据，复制前一行或后一行的配置
        let referenceRow;
        if (index > 0) {
            // 如果有前一行，复制前一行的配置
            referenceRow = rotationData[index - 1];
        } else {
            // 如果是插入到第一行，复制第一行的配置
            referenceRow = rotationData[0];
        }
        
        // 获取BUFF对应的数值增伤
        const buffInfo = buffData.find(buff => buff.name === referenceRow.buffName);
        
        newRotationItem = {
            // 复制参考行的所有属性
            name: "无", // 技能名称重置为"无"
            externalRate: 0,
            fixedExternal: 0,
            breakBambooRate: 0,
            fixedBreakBamboo: 0,
            externalElementRate: 0,
            buffName: referenceRow.buffName,
            generalBonus: buffInfo ? buffInfo.generalBonus : 0,
            criticalBonus: buffInfo ? buffInfo.criticalBonus : 0,
            externalPenetration: buffInfo ? buffInfo.externalPenetration : 0,
            extraCriticalRate: buffInfo ? buffInfo.extraCriticalRate : 0,
            times: referenceRow.times,
            setLayer: referenceRow.setLayer,
            talismanLayer: referenceRow.talismanLayer,
            yishuiLayer: referenceRow.yishuiLayer,
            suohenLayer: referenceRow.suohenLayer,
            qijie: referenceRow.qijie,
            naisan: referenceRow.naisan,
            yishang: referenceRow.yishang
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
        
        // 获取默认BUFF"无"的数值增伤
        const defaultBuffInfo = buffData.find(buff => buff.name === "无");
        
        newRotationItem = {
            name: "无",
            externalRate: 0,
            fixedExternal: 0,
            breakBambooRate: 0,
            fixedBreakBamboo: 0,
            externalElementRate: 0,
            buffName: "无",
            generalBonus: defaultBuffInfo ? defaultBuffInfo.generalBonus : 0,
            criticalBonus: defaultBuffInfo ? defaultBuffInfo.criticalBonus : 0,
            externalPenetration: defaultBuffInfo ? defaultBuffInfo.externalPenetration : 0,
            extraCriticalRate: defaultBuffInfo ? defaultBuffInfo.extraCriticalRate : 0,
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
    
    // 在指定位置插入新技能
    rotationData.splice(index, 0, newRotationItem);
    
    // 更新排轴表格
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

// 初始化基础信息页面计算按钮
function initBasicInfoCalculateButton() {
    const basicInfoCalculateButton = document.getElementById('save-panel-btn');
    
    if (basicInfoCalculateButton) {
        basicInfoCalculateButton.addEventListener('click', async () => {
            debugLog('🔥 基础信息页面计算按钮被点击，开始计算词条毕业度...', 1);
            
            // 显示加载状态
            showCalculationLoading();
            
            try {
                // 获取当前期望伤害
                const rotationDamageSum = calculateRotationDamageSum();
                let expectedDamage;
                
                if (isSimulationMode) {
                    const expectedElement = document.getElementById('expected-damage');
                    expectedDamage = expectedElement ? parseFloat(expectedElement.textContent) || 0 : rotationDamageSum;
                } else {
                    expectedDamage = rotationDamageSum;
                }
                
                // 计算词条毕业度
                await calculateAllGraduationsAsync(expectedDamage);
                
                debugLog('✅ 词条毕业度计算完成！', 1);
                
            } catch (error) {
                console.error('计算词条毕业度时发生错误:', error);
                showCalculationError(error);
            } finally {
                hideCalculationLoading();
            }
        });
    }
}



// 加载已保存的配置列表
function loadSavedConfigs() {
    // 兼容旧ID与新ID
    const configSelect = document.getElementById('saved-rotation-configs') || document.getElementById('saved-configs-select');
    
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
        bossTalent: 'wooden-dummy',
        bossDefense: 405
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
        document.getElementById('boss-talent-select').value = panelData.bossTalent;
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
        // 获取BUFF对应的数值增伤
        const buffInfo = buffData.find(buff => buff.name === lastRow.buffName);
        
        newRotationItem = {
            // 复制上一行的所有属性
            name: "无", // 技能名称重置为"无"
            externalRate: 0,
            fixedExternal: 0,
            breakBambooRate: 0,
            fixedBreakBamboo: 0,
            externalElementRate: 0,
            buffName: lastRow.buffName,
            generalBonus: buffInfo ? buffInfo.generalBonus : 0,
            criticalBonus: buffInfo ? buffInfo.criticalBonus : 0,
            externalPenetration: buffInfo ? buffInfo.externalPenetration : 0,
            extraCriticalRate: buffInfo ? buffInfo.extraCriticalRate : 0,
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
    
    // 移除排轴数据变化的实时计算监听器
    // 现在只有点击计算按钮时才会进行计算
    
    // 为面板数据变化添加监听器，确保期望2伤害实时更新
    setupPanelDataChangeListeners();
    
    // 验证并修正BOSS防御数据
    validateAndFixBossDefense();
    
    // 移除排轴表格变化的实时监听器
    
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
        
        // 根据选择的模式设置T值（兼容旧值与新四模式）
        if (selectedMode === 'none') {
            // "无"选项：保持默认状态，T值保持为60
            T = 60;
        } else if (selectedMode === 'custom') {
            // 自选模式：使用用户自定义的T值
            const customTValue = document.getElementById('custom-t-value');
            T = customTValue ? parseFloat(customTValue.value) || 60 : 60;
        } else if (
            selectedMode === 'yishui' ||
            selectedMode === 'feisun_yishui' ||
            selectedMode === 'yangui_yishui'
        ) {
            // 易水类模式：T值设为60
            T = 60;
        } else if (
            selectedMode === 'duanshi' ||
            selectedMode === 'feisun_duanshi' ||
            selectedMode === 'yangui_duanshi'
        ) {
            // 断石类模式：T值设为60（按最新需求统一T=60）
            T = 60;
        } else if (selectedMode === 'puwu_lao1') {
            // 普五老一模式：时间T为43
            T = 43;
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
    
    // 根据初始勾选状态同步一次全局模式与表格
    try {
        const isManualInit = jileManualToggle.checked;
        jileCalculationMode = isManualInit ? 'manual' : 'auto';
        updateRotationTable();
        showJileModeNotification(jileCalculationMode);
    } catch (e) {
        console.warn('初始化极乐泣血模式同步时出现问题:', e);
    }

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
        const graduationDamage = parseFloat(customGraduationDamage.value) || 3138065;
        const tValue = parseFloat(customTValue.value) || 60;
        
        // 更新全局变量
        T = tValue;
        
        // 更新伤害统计表格
        updateDamageStatsTable();
        
        // 显示成功提示
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

// 异步更新伤害统计表格
async function updateDamageStatsTable() {
    debugLog('🔥 updateDamageStatsTable 被调用！', 2);
    
    // 显示加载状态
    showCalculationLoading();
    
    try {
        // 使用排轴列表伤害列总和
        const rotationDamageSum = calculateRotationDamageSum();
        
        // 根据当前模式决定显示哪个数值
        let expectedDamage, simulationDamage;
        
        if (isSimulationMode) {
            // 模拟模式：期望伤害保持不变，模拟伤害使用排轴列表总和
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
        
        debugLog('✅ 基础面板计算完成！', 1);
        
    } catch (error) {
        console.error('更新伤害统计表格时发生错误:', error);
        showCalculationError(error);
    } finally {
        hideCalculationLoading();
    }
}

// 异步计算所有词条毕业度
async function calculateAllGraduationsAsync(expectedDamage) {
    debugLog('🚀 开始分两批计算...', 1);
    
    // 清空第二面板显示
    clearSecondPanelDisplay();
    
    // 第1批：基础面板计算
    debugLog('📊 第1批：基础面板计算...', 1);
    updateProgressBar(10, '计算基础面板...');
    await calculateBasePanelAsync(expectedDamage);
    
    // 第2批：所有词条毕业度面板计算
    debugLog('🔧 第2批：词条毕业度面板计算...', 1);
    updateProgressBar(30, '计算词条毕业度...');
    await calculateTraitPanelsAsync(expectedDamage);
    
    updateProgressBar(100, '计算完成！');
    debugLog('✅ 分两批计算完成！', 1);
}

// 第1批：基础面板计算
async function calculateBasePanelAsync(expectedDamage) {
    
    // 基础面板计算（这里主要是获取第一面板的期望伤害）
    // 实际上第一面板的伤害计算已经在updateDamageStatsTable中完成
    // 这里主要是为了保持批次逻辑的一致性
    
    // 让出主线程
    await new Promise(resolve => setTimeout(resolve, 10));
    
}

// 第2批：词条毕业度面板计算
async function calculateTraitPanelsAsync(expectedDamage) {
    
    const graduationTasks = [
        // 基础词条毕业度
        { name: '大外功', func: () => calculateLargeExternalGraduation(expectedDamage) },
        { name: '小外功', func: () => calculateSmallExternalGraduation(expectedDamage) },
        
        // 破竹词条毕业度
        { name: '大破竹', func: () => calculateLargeBreakBambooGraduation(expectedDamage) },
        { name: '小破竹', func: () => calculateSmallBreakBambooGraduation(expectedDamage) },
        
        // 裂石词条毕业度
        { name: '小裂石', func: () => calculateSmallBreakRockGraduation(expectedDamage) },
        
        // 属性词条毕业度
        { name: '精准率', func: () => calculatePrecisionGraduation(expectedDamage) },
        { name: '会心率', func: () => calculateCriticalGraduation(expectedDamage) },
        { name: '会意率', func: () => calculateIntentGraduation(expectedDamage) },
        
        // 基础属性词条毕业度
        { name: '劲', func: () => calculateJingGraduation(expectedDamage) },
        { name: '敏', func: () => calculateMinGraduation(expectedDamage) },
        { name: '势', func: () => calculateShiGraduation(expectedDamage) },
        
        // 条件词条毕业度
        { name: '绳镖武学', func: () => calculateShengbiaoGraduation(expectedDamage) },
        { name: '双刀武学', func: () => calculateShuangdaoGraduation(expectedDamage) },
        { name: '全武学', func: () => calculateQuanwuxueGraduation(expectedDamage) },
        { name: '首领单位', func: () => calculateShoulingGraduation(expectedDamage) }
    ];
    
    // 内部优化：将15个词条分成3小批，每批5个，避免一次性启动太多任务
    const internalBatchSize = 5;
    for (let i = 0; i < graduationTasks.length; i += internalBatchSize) {
        const batch = graduationTasks.slice(i, i + internalBatchSize);
        const batchProgress = 30 + (i / graduationTasks.length) * 60; // 30% 到 90%
        const batchNames = batch.map(task => task.name).join('、');
        
        updateProgressBar(batchProgress, `计算${batchNames}毕业度...`);
        
        await Promise.all(
            batch.map(task => calculateGraduationAsync(task.name, task.func))
        );
        
        // 让出主线程，显示进度
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // 计算完成后进行排序
    updateProgressBar(95, '排序结果...');
    sortTraitGraduationTable();
    
}

// 排序词条毕业度表格
function sortTraitGraduationTable() {
    
    const tbody = document.getElementById('trait-graduation-tbody');
    if (!tbody) {
        console.error('找不到词条毕业度表格体');
        return;
    }
    
    // 获取所有行
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // 提取每行的数据并排序
    const rowData = rows.map(row => {
        const cells = row.querySelectorAll('td');
        const traitName = cells[0].textContent.trim();
        const graduationCell = cells[1];
        const graduationText = graduationCell.textContent.trim();
        
        // 解析毕业度数值
        let graduationValue = 0;
        if (graduationText !== '-' && graduationText !== '') {
            // 提取数值部分（去掉%符号）
            const match = graduationText.match(/([+-]?\d+\.?\d*)/);
            if (match) {
                graduationValue = parseFloat(match[1]);
            }
        }
        
        return {
            row: row,
            traitName: traitName,
            graduationValue: graduationValue,
            graduationText: graduationText
        };
    });
    
    // 按毕业度从高到低排序
    rowData.sort((a, b) => b.graduationValue - a.graduationValue);
    
    // 清空表格并重新添加排序后的行
    tbody.innerHTML = '';
    rowData.forEach(item => {
        tbody.appendChild(item.row);
    });
    
}

// 异步计算单个词条毕业度
async function calculateGraduationAsync(graduationName, calculationFunction) {
    return new Promise((resolve) => {
        // 使用requestAnimationFrame让出主线程，提供更好的用户体验
        requestAnimationFrame(() => {
            setTimeout(() => {
                try {
                    calculationFunction();
                    resolve();
                } catch (error) {
                    console.error(`❌ ${graduationName}毕业度计算失败:`, error);
                    resolve(); // 即使失败也继续
                }
            }, 0); // 让出主线程
        });
    });
}

// 更新词条毕业度对比表格
function updateTraitGraduationTable(firstPanelDamage, secondPanelDamage) {
    try {
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            // 自选模式：使用用户自定义的毕业伤害
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            // 普五老一：毕业伤害为2191649
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            // 燕归断石：按需求设置毕业伤害
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            // 燕归易水：按需求设置毕业伤害
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            // 其他断石类（默认飞隼断石）
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            // 其他易水类（默认飞隼易水）
            graduationDamage = 3082418;
        } else {
            // 默认值
            graduationDamage = 3138065;
        }
        
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算大外功的毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        // 更新表格中的毕业度显示
        const graduationElement = document.getElementById('trait-graduation-damage');
        if (graduationElement) {
            if (graduationDifference > 0) {
                graduationElement.textContent = `+${graduationDifference.toFixed(2)}%`;
                graduationElement.style.color = '#28a745'; // 绿色表示正增长
            } else if (graduationDifference < 0) {
                graduationElement.textContent = `${graduationDifference.toFixed(2)}%`;
                graduationElement.style.color = '#dc3545'; // 红色表示负增长
            } else {
                graduationElement.textContent = '0.00%';
                graduationElement.style.color = '#6c757d'; // 灰色表示无变化
            }
        }
        
        
    } catch (error) {
        console.error('更新词条毕业度对比表格时发生错误:', error);
    }
}

// 计算大外功毕业度
function calculateLargeExternalGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 计算大外功第二面板期望伤害（最大外功攻击增加77.8）
        const largeExternalSecondPanelDamage = calculateLargeExternalSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新大外功毕业度显示
        updateLargeExternalGraduationDisplay(firstPanelDamage, largeExternalSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算大外功毕业度时发生错误:', error);
    }
}

// 计算大外功第二面板期望伤害（最大外功攻击增加77.8）
function calculateLargeExternalSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（最大外功攻击增加77.8）
        const modifiedPanelData = {
            ...currentPanelData,
            externalAttack: {
                min: currentPanelData.externalAttack.min,
                max: currentPanelData.externalAttack.max + 77.8
            }
        };
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算大外功第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新大外功毕业度显示
function updateLargeExternalGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage) {
    const element = document.getElementById('trait-graduation-damage');
    if (!element) {
        return;
    }
    
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算小外功毕业度
function calculateSmallExternalGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 计算小外功第二面板期望伤害（最小外功攻击增加77.8）
        const smallExternalSecondPanelDamage = calculateSmallExternalSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新小外功毕业度显示
        updateSmallExternalGraduationDisplay(firstPanelDamage, smallExternalSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算小外功毕业度时发生错误:', error);
    }
}

// 计算小外功第二面板期望伤害（最小外功攻击增加77.8）
function calculateSmallExternalSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（最小外功攻击增加77.8）
        const modifiedPanelData = {
            ...currentPanelData,
            externalAttack: {
                min: currentPanelData.externalAttack.min + 77.8,
                max: currentPanelData.externalAttack.max
            }
        };
        
        // 应用数据验证规则：当最小外功攻击>最大外功攻击时，最大外功攻击=最小外功攻击
        if (modifiedPanelData.externalAttack.min > modifiedPanelData.externalAttack.max) {
            modifiedPanelData.externalAttack.max = modifiedPanelData.externalAttack.min;
        }
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算小外功第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新小外功毕业度显示
function updateSmallExternalGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage) {
    const element = document.getElementById('trait-graduation-external-min');
    if (!element) {
        return;
    }
    
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算大破竹毕业度
function calculateLargeBreakBambooGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 计算大破竹第二面板期望伤害（最大破竹攻击增加44.2）
        const largeBreakBambooSecondPanelDamage = calculateLargeBreakBambooSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新大破竹毕业度显示
        updateLargeBreakBambooGraduationDisplay(firstPanelDamage, largeBreakBambooSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算大破竹毕业度时发生错误:', error);
    }
}

// 计算大破竹第二面板期望伤害（最大破竹攻击增加44.2）
function calculateLargeBreakBambooSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（最大破竹攻击增加44.2）
        const modifiedPanelData = {
            ...currentPanelData,
            breakBambooAttack: {
                min: currentPanelData.breakBambooAttack.min,
                max: currentPanelData.breakBambooAttack.max + 44.2
            }
        };
        
        // 应用数据验证规则：当最小破竹攻击>最大破竹攻击时，最小破竹攻击=最大破竹攻击
        if (modifiedPanelData.breakBambooAttack.min > modifiedPanelData.breakBambooAttack.max) {
            modifiedPanelData.breakBambooAttack.min = modifiedPanelData.breakBambooAttack.max;
        }
        
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算大破竹第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新大破竹毕业度显示
function updateLargeBreakBambooGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage) {
    const element = document.getElementById('trait-graduation-breakbamboo-max');
    if (!element) {
        return;
    }
    
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算小破竹毕业度
function calculateSmallBreakBambooGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 计算小破竹第二面板期望伤害（最小破竹攻击增加44.2）
        const smallBreakBambooSecondPanelDamage = calculateSmallBreakBambooSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新小破竹毕业度显示
        updateSmallBreakBambooGraduationDisplay(firstPanelDamage, smallBreakBambooSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算小破竹毕业度时发生错误:', error);
    }
}

// 计算小破竹第二面板期望伤害（最小破竹攻击增加44.2）
function calculateSmallBreakBambooSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（最小破竹攻击增加44.2）
        const modifiedPanelData = {
            ...currentPanelData,
            breakBambooAttack: {
                min: currentPanelData.breakBambooAttack.min + 44.2,
                max: currentPanelData.breakBambooAttack.max
            }
        };
        
        // 应用数据验证规则：当最小破竹攻击>最大破竹攻击时，最大破竹攻击=最小破竹攻击
        if (modifiedPanelData.breakBambooAttack.min > modifiedPanelData.breakBambooAttack.max) {
            modifiedPanelData.breakBambooAttack.max = modifiedPanelData.breakBambooAttack.min;
        }
        
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算小破竹第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新小破竹毕业度显示
function updateSmallBreakBambooGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage) {
    const element = document.getElementById('trait-graduation-breakbamboo-min');
    if (!element) {
        return;
    }
    
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算小裂石毕业度
function calculateSmallBreakRockGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 计算小裂石第二面板期望伤害（最小裂石攻击增加44.2）
        const smallBreakRockSecondPanelDamage = calculateSmallBreakRockSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新小裂石毕业度显示
        updateSmallBreakRockGraduationDisplay(firstPanelDamage, smallBreakRockSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算小裂石毕业度时发生错误:', error);
    }
}

// 计算小裂石第二面板期望伤害（最小裂石攻击增加44.2）
function calculateSmallBreakRockSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（最小裂石攻击增加44.2）
        const modifiedPanelData = {
            ...currentPanelData,
            breakRockAttack: {
                min: currentPanelData.breakRockAttack.min + 44.2,
                max: currentPanelData.breakRockAttack.max
            }
        };
        
        // 应用数据验证规则：当最小裂石攻击>最大裂石攻击时，最大裂石攻击=最小裂石攻击
        if (modifiedPanelData.breakRockAttack.min > modifiedPanelData.breakRockAttack.max) {
            modifiedPanelData.breakRockAttack.max = modifiedPanelData.breakRockAttack.min;
        }
        
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算小裂石第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新小裂石毕业度显示
function updateSmallBreakRockGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage) {
    const element = document.getElementById('trait-graduation-breakrock-min');
    if (!element) {
        return;
    }
    
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算精准率毕业度
function calculatePrecisionGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 计算精准率第二面板期望伤害（精准率增加4.84）
        const precisionSecondPanelDamage = calculatePrecisionSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新精准率毕业度显示
        updatePrecisionGraduationDisplay(firstPanelDamage, precisionSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算精准率毕业度时发生错误:', error);
    }
}

// 计算精准率第二面板期望伤害（精准率增加4.84）
function calculatePrecisionSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（精准率增加4.84）
        const modifiedPanelData = {
            ...currentPanelData,
            precisionRate: currentPanelData.precisionRate + 4.84
        };
        
        console.log('- 修改后精准率:', modifiedPanelData.precisionRate);
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算精准率第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新精准率毕业度显示
function updatePrecisionGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage) {
    const element = document.getElementById('trait-graduation-precision');
    if (!element) {
        return;
    }
    
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算会心率毕业度
function calculateCriticalGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 计算会心率第二面板期望伤害（会心率增加5.45）
        const criticalSecondPanelDamage = calculateCriticalSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新会心率毕业度显示
        updateCriticalGraduationDisplay(firstPanelDamage, criticalSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算会心率毕业度时发生错误:', error);
    }
}

// 计算会心率第二面板期望伤害（会心率增加5.45）
function calculateCriticalSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（会心率增加5.45）
        const modifiedPanelData = {
            ...currentPanelData,
            criticalRate: currentPanelData.criticalRate + 5.45
        };
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算会心率第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新会心率毕业度显示
function updateCriticalGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage) {
    const element = document.getElementById('trait-graduation-critical');
    if (!element) {
        return;
    }
    
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算会意率毕业度
function calculateIntentGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 计算会意率第二面板期望伤害（会意率增加2.67）
        const intentSecondPanelDamage = calculateIntentSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新会意率毕业度显示
        updateIntentGraduationDisplay(firstPanelDamage, intentSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算会意率毕业度时发生错误:', error);
    }
}

// 计算会意率第二面板期望伤害（会意率增加2.67）
function calculateIntentSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（会意率增加2.67）
        const modifiedPanelData = {
            ...currentPanelData,
            intentRate: currentPanelData.intentRate + 2.67
        };
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算会意率第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新会意率毕业度显示
function updateIntentGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage) {
    const element = document.getElementById('trait-graduation-intent');
    if (!element) {
        return;
    }
    
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算劲毕业度
function calculateJingGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 计算劲第二面板期望伤害（外功攻击最小值+11.1，最大值+67.2）
        const jingSecondPanelDamage = calculateJingSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新劲毕业度显示
        updateJingGraduationDisplay(firstPanelDamage, jingSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算劲毕业度时发生错误:', error);
    }
}

// 计算劲第二面板期望伤害（外功攻击最小值+11.1，最大值+67.2）
function calculateJingSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（外功攻击最小值+11.1，最大值+67.2）
        const modifiedPanelData = {
            ...currentPanelData,
            externalAttack: {
                min: currentPanelData.externalAttack.min + 11.1,
                max: currentPanelData.externalAttack.max + 67.2
            }
        };
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算劲第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新劲毕业度显示
function updateJingGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage) {
    const element = document.getElementById('trait-graduation-jing');
    if (!element) {
        return;
    }
    
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算敏毕业度
function calculateMinGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 计算敏第二面板期望伤害（外功攻击最小值+44.5，会心率+2.28）
        const minSecondPanelDamage = calculateMinSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新敏毕业度显示
        updateMinGraduationDisplay(firstPanelDamage, minSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算敏毕业度时发生错误:', error);
    }
}

// 计算敏第二面板期望伤害（外功攻击最小值+44.5，会心率+2.28）
function calculateMinSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（外功攻击最小值+44.5，会心率+2.28）
        const modifiedPanelData = {
            ...currentPanelData,
            externalAttack: {
                min: currentPanelData.externalAttack.min + 44.5,
                max: currentPanelData.externalAttack.max
            },
            criticalRate: currentPanelData.criticalRate + 2.28
        };
        
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算敏第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新敏毕业度显示
function updateMinGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage) {
    const element = document.getElementById('trait-graduation-min');
    if (!element) {
        return;
    }
    
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算势毕业度
function calculateShiGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 计算势第二面板期望伤害（外功攻击最大值+44.5，会意率+1.14）
        const shiSecondPanelDamage = calculateShiSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新势毕业度显示
        updateShiGraduationDisplay(firstPanelDamage, shiSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算势毕业度时发生错误:', error);
    }
}

// 计算势第二面板期望伤害（外功攻击最大值+44.5，会意率+1.14）
function calculateShiSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（外功攻击最大值+44.5，会意率+1.14）
        const modifiedPanelData = {
            ...currentPanelData,
            externalAttack: {
                min: currentPanelData.externalAttack.min,
                max: currentPanelData.externalAttack.max + 44.5
            },
            intentRate: currentPanelData.intentRate + 1.14
        };
        
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算势第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新势毕业度显示
function updateShiGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage) {
    const element = document.getElementById('trait-graduation-shi');
    if (!element) {
        return;
    }
    
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算绳镖武学毕业度
function calculateShengbiaoGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 检查当前绳镖武学增伤是否为0
        const currentRopeDartBonus = currentPanelData.ropeDartBonus || 0;
        
        if (currentRopeDartBonus !== 0) {
            updateShengbiaoGraduationDisplay(firstPanelDamage, firstPanelDamage, graduationDamage, '条件不满足');
            return;
        }
        
        // 计算绳镖武学第二面板期望伤害（绳镖武学增伤+6.2）
        const shengbiaoSecondPanelDamage = calculateShengbiaoSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新绳镖武学毕业度显示
        updateShengbiaoGraduationDisplay(firstPanelDamage, shengbiaoSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算绳镖武学毕业度时发生错误:', error);
    }
}

// 计算绳镖武学第二面板期望伤害（绳镖武学增伤+6.2）
function calculateShengbiaoSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（绳镖武学增伤+6.2）
        const modifiedPanelData = {
            ...currentPanelData,
            ropeDartBonus: (currentPanelData.ropeDartBonus || 0) + 6.2
        };
        
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算绳镖武学第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新绳镖武学毕业度显示
function updateShengbiaoGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage, reason = null) {
    const element = document.getElementById('trait-graduation-shengbiao');
    if (!element) {
        return;
    }
    
    
    if (reason) {
        console.log('- 原因:', reason);
        element.textContent = '-';
        element.style.color = '#6c757d';
        return;
    }
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算双刀武学毕业度
function calculateShuangdaoGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 检查当前双刀武学增伤是否为0
        const currentDualBladesBonus = currentPanelData.dualBladesBonus || 0;
        
        if (currentDualBladesBonus !== 0) {
            updateShuangdaoGraduationDisplay(firstPanelDamage, firstPanelDamage, graduationDamage, '条件不满足');
            return;
        }
        
        // 计算双刀武学第二面板期望伤害（双刀武学增伤+6.2）
        const shuangdaoSecondPanelDamage = calculateShuangdaoSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新双刀武学毕业度显示
        updateShuangdaoGraduationDisplay(firstPanelDamage, shuangdaoSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算双刀武学毕业度时发生错误:', error);
    }
}

// 计算双刀武学第二面板期望伤害（双刀武学增伤+6.2）
function calculateShuangdaoSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（双刀武学增伤+6.2）
        const modifiedPanelData = {
            ...currentPanelData,
            dualBladesBonus: (currentPanelData.dualBladesBonus || 0) + 6.2
        };
        
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算双刀武学第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新双刀武学毕业度显示
function updateShuangdaoGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage, reason = null) {
    const element = document.getElementById('trait-graduation-shuangdao');
    if (!element) {
        return;
    }
    
    
    if (reason) {
        console.log('- 原因:', reason);
        element.textContent = '-';
        element.style.color = '#6c757d';
        return;
    }
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算全武学毕业度
function calculateQuanwuxueGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 检查当前全武学增伤是否<=3.2
        const currentAllMartialBonus = currentPanelData.allMartialBonus || 0;
        
        if (currentAllMartialBonus > 3.2) {
            updateQuanwuxueGraduationDisplay(firstPanelDamage, firstPanelDamage, graduationDamage, '条件不满足');
            return;
        }
        
        // 计算全武学第二面板期望伤害（全武学增伤+3.2）
        const quanwuxueSecondPanelDamage = calculateQuanwuxueSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新全武学毕业度显示
        updateQuanwuxueGraduationDisplay(firstPanelDamage, quanwuxueSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算全武学毕业度时发生错误:', error);
    }
}

// 计算全武学第二面板期望伤害（全武学增伤+3.2）
function calculateQuanwuxueSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（全武学增伤+3.2）
        const modifiedPanelData = {
            ...currentPanelData,
            allMartialBonus: (currentPanelData.allMartialBonus || 0) + 3.2
        };
        
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算全武学第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新全武学毕业度显示
function updateQuanwuxueGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage, reason = null) {
    const element = document.getElementById('trait-graduation-quanwuxue');
    if (!element) {
        return;
    }
    
    
    if (reason) {
        console.log('- 原因:', reason);
        element.textContent = '-';
        element.style.color = '#6c757d';
        return;
    }
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算首领单位毕业度
function calculateShoulingGraduation(firstPanelDamage) {
    try {
        
        // 获取毕业伤害值 - 使用与计算界面相同的逻辑
        let graduationDamage;
        if (currentDamageMode === 'custom') {
            graduationDamage = parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
        } else if (currentDamageMode === 'puwu_lao1') {
            graduationDamage = 2191649;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
            graduationDamage = 3080124;
        } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
            graduationDamage = 3018586;
        } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
            graduationDamage = 3138065;
        } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
            graduationDamage = 3082418;
        } else {
            graduationDamage = 3138065;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return;
        }
        
        // 检查当前首领单位增伤是否<=3.2
        const currentBossUnitBonus = currentPanelData.bossUnitBonus || 0;
        
        if (currentBossUnitBonus > 3.2) {
            updateShoulingGraduationDisplay(firstPanelDamage, firstPanelDamage, graduationDamage, '条件不满足');
            return;
        }
        
        // 计算首领单位第二面板期望伤害（首领单位增伤+3.2）
        const shoulingSecondPanelDamage = calculateShoulingSecondPanelDamage(currentPanelData, currentRotationData);
        
        
        // 更新首领单位毕业度显示
        updateShoulingGraduationDisplay(firstPanelDamage, shoulingSecondPanelDamage, graduationDamage);
        
    } catch (error) {
        console.error('计算首领单位毕业度时发生错误:', error);
    }
}

// 计算首领单位第二面板期望伤害（首领单位增伤+3.2）
function calculateShoulingSecondPanelDamage(currentPanelData, currentRotationData) {
    try {
        
        // 创建修改后的面板数据（首领单位增伤+3.2）
        const modifiedPanelData = {
            ...currentPanelData,
            bossUnitBonus: (currentPanelData.bossUnitBonus || 0) + 3.2
        };
        
        
        // 计算修改后的期望伤害
        const secondPanelDamage = calculateExpectedDamage(modifiedPanelData, currentRotationData);
        
        return secondPanelDamage;
        
    } catch (error) {
        console.error('计算首领单位第二面板期望伤害时发生错误:', error);
        return 0;
    }
}

// 更新首领单位毕业度显示
function updateShoulingGraduationDisplay(firstPanelDamage, secondPanelDamage, graduationDamage, reason = null) {
    const element = document.getElementById('trait-graduation-shouling');
    if (!element) {
        return;
    }
    
    
    if (reason) {
        console.log('- 原因:', reason);
        element.textContent = '-';
        element.style.color = '#6c757d';
        return;
    }
    
    if (firstPanelDamage > 0 && secondPanelDamage > 0) {
        // 计算第一面板和第二面板的期望毕业度
        const firstPanelGraduation = (firstPanelDamage / graduationDamage) * 100;
        const secondPanelGraduation = (secondPanelDamage / graduationDamage) * 100;
        
        // 计算毕业度差值（第二面板期望毕业度 - 第一面板期望毕业度）
        const graduationDifference = secondPanelGraduation - firstPanelGraduation;
        
        
        if (graduationDifference > 0) {
            element.textContent = `+${graduationDifference.toFixed(2)}%`;
            element.style.color = '#28a745'; // 绿色表示正增长
        } else if (graduationDifference < 0) {
            element.textContent = `${graduationDifference.toFixed(2)}%`;
            element.style.color = '#dc3545'; // 红色表示负增长
        } else {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    } else {
        console.log('- 伤害数据无效，显示为"0.00%"');
        element.textContent = '0.00%';
        element.style.color = '#6c757d';
    }
}

// 计算期望总伤害（基于当前页面参数）
function calculateExpectedDamage(panelData = null, rotationDataParam = null) {
    // 获取排轴数据（支持多实例）
    const currentRotationData = rotationDataParam || rotationDataManager.getCurrentRotation();
    
    
    if (!currentRotationData || currentRotationData.length === 0) {
        return 0;
    }
    
    // 获取面板数据（局部变量优先）
    const currentPanelData = panelData || panelDataManager.getDataFromInputs();
    
    
    // 检查排轴数据是否已经包含极乐泣血计算
    
    // 如果排轴数据已经包含极乐泣血计算，直接使用；否则重新计算
    let rotationDataToUse = currentRotationData;
    const hasJileCalculation = currentRotationData.some(skill => skill.name === '极乐泣血' && skill.jileExpectedLayers !== undefined);
    
    if (!isSimulationMode && !hasJileCalculation) {
        rotationDataToUse = calculateJileQixueTimes([...currentRotationData]);
    }
    
    let totalDamage = 0;
    
    rotationDataToUse.forEach(skill => {
        if (skill.name && skill.name !== '无') {
            const damageData = calculateDamage(skill, currentPanelData);
            if (damageData && damageData.totalDamage) {
                const times = skill.times || 1;
                const skillDamage = parseFloat(damageData.totalDamage) * times;
                totalDamage += skillDamage;
            }
        }
    });
    
    
    return totalDamage;
}

// 计算第二面板期望伤害（最大外功攻击额外增加77.8）
function calculateSecondPanelExpectedDamage() {
    try {
        // 获取当前排轴数据
        const currentRotationData = rotationDataManager.getCurrentRotation();
        
        if (!currentRotationData || currentRotationData.length === 0) {
            return 0;
        }
        
        // 获取当前面板数据
        const currentPanelData = panelDataManager.getDataFromInputs();
        
        // 创建第二面板数据（最大外功攻击额外增加77.8，其他增伤条件保持不变）
        const secondPanelData = {
            ...currentPanelData,
            externalAttack: {
                min: currentPanelData.externalAttack.min,
                max: currentPanelData.externalAttack.max + 77.8
            }
            // 注意：其他所有增伤条件（BUFF、易水歌、符帖、食物等）都保持不变
        };
        
        // 确保第二面板包含所有必要的属性（从默认数据中补充缺失的属性）
        const defaultData = panelDataManager.getDefaultData();
        Object.keys(defaultData).forEach(key => {
            if (secondPanelData[key] === undefined) {
                secondPanelData[key] = defaultData[key];
            }
        });
        
        // 检查排轴数据是否已经包含极乐泣血计算
        
        // 如果排轴数据已经包含极乐泣血计算，直接使用；否则重新计算
        let rotationDataToUse = currentRotationData;
        const hasJileCalculation = currentRotationData.some(skill => skill.name === '极乐泣血' && skill.jileExpectedLayers !== undefined);
        
        if (!isSimulationMode && !hasJileCalculation) {
            rotationDataToUse = calculateJileQixueTimes([...currentRotationData]);
        }
        
        let totalDamage = 0;
        let firstPanelTotalDamage = 0; // 新增：第一面板总伤害
        
        console.log('=== 第二面板详细调试信息 ===');
        console.log('第一面板外功攻击:', currentPanelData.externalAttack);
        console.log('第二面板外功攻击:', secondPanelData.externalAttack);
        console.log('外功攻击差值:', secondPanelData.externalAttack.max - currentPanelData.externalAttack.max);
        
        // 新增：第一面板和第二面板的详细属性对比
        console.log('\n=== 第一面板详细属性 ===');
        console.log('- 外功攻击:', currentPanelData.externalAttack);
        console.log('- 外功穿透:', currentPanelData.externalPenetration);
        console.log('- 属攻穿透:', currentPanelData.elementalPenetration);
        console.log('- 破竹攻击:', currentPanelData.breakBambooAttack);
        console.log('- 外功伤害加成:', currentPanelData.externalDamageBonus);
        console.log('- 属攻伤害加成:', currentPanelData.elementalDamageBonus);
        console.log('- 会心率:', currentPanelData.criticalRate);
        console.log('- 会意率:', currentPanelData.intentRate);
        console.log('- 精准率:', currentPanelData.precisionRate);
        console.log('- 会心增伤:', currentPanelData.criticalDamageBonus);
        console.log('- 会意增伤:', currentPanelData.intentDamageBonus);
        
        console.log('\n=== 第二面板详细属性 ===');
        console.log('- 外功攻击:', secondPanelData.externalAttack);
        console.log('- 外功穿透:', secondPanelData.externalPenetration);
        console.log('- 属攻穿透:', secondPanelData.elementalPenetration);
        console.log('- 破竹攻击:', secondPanelData.breakBambooAttack);
        console.log('- 外功伤害加成:', secondPanelData.externalDamageBonus);
        console.log('- 属攻伤害加成:', secondPanelData.elementalDamageBonus);
        console.log('- 会心率:', secondPanelData.criticalRate);
        console.log('- 会意率:', secondPanelData.intentRate);
        console.log('- 精准率:', secondPanelData.precisionRate);
        console.log('- 会心增伤:', secondPanelData.criticalDamageBonus);
        console.log('- 会意增伤:', secondPanelData.intentDamageBonus);
        
        // 对比排轴列表使用的面板数据
        console.log('\n=== 排轴列表面板数据对比 ===');
        const rotationTablePanelData = panelDataManager.getDataFromInputs();
        console.log('排轴列表使用的面板数据:');
        console.log('- 外功攻击:', rotationTablePanelData.externalAttack);
        console.log('- 外功穿透:', rotationTablePanelData.externalPenetration);
        console.log('- 属功穿透:', rotationTablePanelData.elementalPenetration);
        console.log('- 破竹攻击:', rotationTablePanelData.breakBambooAttack);
        console.log('- 全武学增伤:', rotationTablePanelData.allMartialBonus);
        console.log('- 外功增伤:', rotationTablePanelData.externalDamageBonus);
        console.log('- 属功增伤:', rotationTablePanelData.elementalDamageBonus);
        console.log('- 装备套装:', rotationTablePanelData.equipmentSet);
        console.log('- 食物BUFF:', rotationTablePanelData.foodBuff);
        console.log('- 符帖:', rotationTablePanelData.talisman);
        console.log('- 制作加成:', rotationTablePanelData.craftingBonus);
        console.log('- Boss天赋:', rotationTablePanelData.bossTalent);
        console.log('- Boss防御:', rotationTablePanelData.bossDefense);
        
        console.log('\n=== 数据一致性检查 ===');
        console.log('外功攻击是否一致:', JSON.stringify(currentPanelData.externalAttack) === JSON.stringify(rotationTablePanelData.externalAttack));
        console.log('外功穿透是否一致:', currentPanelData.externalPenetration === rotationTablePanelData.externalPenetration);
        console.log('属功穿透是否一致:', currentPanelData.elementalPenetration === rotationTablePanelData.elementalPenetration);
        console.log('破竹攻击是否一致:', JSON.stringify(currentPanelData.breakBambooAttack) === JSON.stringify(rotationTablePanelData.breakBambooAttack));
        console.log('全武学增伤是否一致:', currentPanelData.allMartialBonus === rotationTablePanelData.allMartialBonus);
        console.log('外功增伤是否一致:', currentPanelData.externalDamageBonus === rotationTablePanelData.externalDamageBonus);
        console.log('属功增伤是否一致:', currentPanelData.elementalDamageBonus === rotationTablePanelData.elementalDamageBonus);
        console.log('装备套装是否一致:', currentPanelData.equipmentSet === rotationTablePanelData.equipmentSet);
        console.log('食物BUFF是否一致:', currentPanelData.foodBuff === rotationTablePanelData.foodBuff);
        console.log('符帖是否一致:', currentPanelData.talisman === rotationTablePanelData.talisman);
        console.log('制作加成是否一致:', currentPanelData.craftingBonus === rotationTablePanelData.craftingBonus);
        console.log('Boss天赋是否一致:', currentPanelData.bossTalent === rotationTablePanelData.bossTalent);
        console.log('Boss防御是否一致:', currentPanelData.bossDefense === rotationTablePanelData.bossDefense);
        console.log('第二面板其他属性:');
        console.log('- 外功穿透:', secondPanelData.externalPenetration);
        console.log('- 属功穿透:', secondPanelData.elementalPenetration);
        console.log('- 破竹攻击:', secondPanelData.breakBambooAttack);
        console.log('- 全武学增伤:', secondPanelData.allMartialBonus);
        console.log('- 外功增伤:', secondPanelData.externalDamageBonus);
        console.log('- 属功增伤:', secondPanelData.elementalDamageBonus);
        console.log('- 装备套装:', secondPanelData.equipmentSet);
        console.log('- 食物BUFF:', secondPanelData.foodBuff);
        console.log('- 符帖:', secondPanelData.talisman);
        console.log('- 制作加成:', secondPanelData.craftingBonus);
        console.log('- Boss天赋:', secondPanelData.bossTalent);
        console.log('- Boss防御:', secondPanelData.bossDefense);
        
        rotationDataToUse.forEach((skill, index) => {
            if (skill.name && skill.name !== '无') {
                console.log(`\n--- 技能${index}: ${skill.name} ---`);
                console.log('技能属性:');
                console.log('- BUFF名称:', skill.buffName);
                console.log('- 套装层数:', skill.setLayer);
                console.log('- 符帖层数:', skill.talismanLayer);
                console.log('- 易水歌层数:', skill.yishuiLayer);
                console.log('- 所恨年年层数:', skill.suohenLayer);
                console.log('- 气窭:', skill.qijie);
                console.log('- 奶伞:', skill.naisan);
                console.log('- 易伤:', skill.yishang);
                console.log('- 使用次数:', skill.times);
                
                // 计算第一面板的伤害
                const firstPanelDamage = calculateDamage(skill, currentPanelData);
                console.log('第一面板伤害:', firstPanelDamage.totalDamage);
                
                // 计算第二面板的伤害
                const secondPanelDamage = calculateDamage(skill, secondPanelData);
                console.log('第二面板伤害:', secondPanelDamage.totalDamage);
                console.log('伤害差值:', secondPanelDamage.totalDamage - firstPanelDamage.totalDamage);
                
                // 计算第一面板总伤害（考虑技能使用次数）
                if (firstPanelDamage && firstPanelDamage.totalDamage) {
                    const times = skill.times || 1;
                    const firstPanelSkillDamage = parseFloat(firstPanelDamage.totalDamage) * times;
                    firstPanelTotalDamage += firstPanelSkillDamage;
                    console.log(`第一面板技能${index} 总伤害: ${firstPanelSkillDamage} (单次: ${firstPanelDamage.totalDamage} × 次数: ${times})`);
                }
                
                // 新增：详细的伤害类型对比
                if (debugMode) {
                    console.log('\n--- 第一面板详细伤害类型 ---');
                    console.log('- 外功会心伤害:', firstPanelDamage.externalCriticalDamage);
                    console.log('- 外功会意伤害:', firstPanelDamage.externalIntentDamage);
                    console.log('- 外功白字伤害:', firstPanelDamage.externalWhiteTextDamage);
                    console.log('- 外功擦伤伤害:', firstPanelDamage.externalGrazeDamage);
                    console.log('- 破竹会心伤害:', firstPanelDamage.breakBambooCriticalDamage);
                    console.log('- 破竹会意伤害:', firstPanelDamage.breakBambooIntentDamage);
                    console.log('- 破竹白字伤害:', firstPanelDamage.breakBambooWhiteTextDamage);
                    console.log('- 破竹擦伤伤害:', firstPanelDamage.breakBambooGrazeDamage);
                    console.log('- 外属会心伤害:', firstPanelDamage.externalElementCriticalDamage);
                    console.log('- 外属会意伤害:', firstPanelDamage.externalElementIntentDamage);
                    console.log('- 外属白字伤害:', firstPanelDamage.externalElementWhiteTextDamage);
                    console.log('- 外属擦伤伤害:', firstPanelDamage.externalElementGrazeDamage);
                    
                    console.log('\n--- 第二面板详细伤害类型 ---');
                    console.log('- 外功会心伤害:', secondPanelDamage.externalCriticalDamage);
                    console.log('- 外功会意伤害:', secondPanelDamage.externalIntentDamage);
                    console.log('- 外功白字伤害:', secondPanelDamage.externalWhiteTextDamage);
                    console.log('- 外功擦伤伤害:', secondPanelDamage.externalGrazeDamage);
                    console.log('- 破竹会心伤害:', secondPanelDamage.breakBambooCriticalDamage);
                    console.log('- 破竹会意伤害:', secondPanelDamage.breakBambooIntentDamage);
                    console.log('- 破竹白字伤害:', secondPanelDamage.breakBambooWhiteTextDamage);
                    console.log('- 破竹擦伤伤害:', secondPanelDamage.breakBambooGrazeDamage);
                    console.log('- 外属会心伤害:', secondPanelDamage.externalElementCriticalDamage);
                    console.log('- 外属会意伤害:', secondPanelDamage.externalElementIntentDamage);
                    console.log('- 外属白字伤害:', secondPanelDamage.externalElementWhiteTextDamage);
                    console.log('- 外属擦伤伤害:', secondPanelDamage.externalElementGrazeDamage);
                    
                    // 新增：伤害类型差值对比
                    console.log('\n--- 伤害类型差值对比 ---');
                    console.log('- 外功会心伤害差值:', secondPanelDamage.externalCriticalDamage - firstPanelDamage.externalCriticalDamage);
                    console.log('- 外功会意伤害差值:', secondPanelDamage.externalIntentDamage - firstPanelDamage.externalIntentDamage);
                    console.log('- 外功白字伤害差值:', secondPanelDamage.externalWhiteTextDamage - firstPanelDamage.externalWhiteTextDamage);
                    console.log('- 外功擦伤伤害差值:', secondPanelDamage.externalGrazeDamage - firstPanelDamage.externalGrazeDamage);
                    console.log('- 破竹会心伤害差值:', secondPanelDamage.breakBambooCriticalDamage - firstPanelDamage.breakBambooCriticalDamage);
                    console.log('- 破竹会意伤害差值:', secondPanelDamage.breakBambooIntentDamage - firstPanelDamage.breakBambooIntentDamage);
                    console.log('- 破竹白字伤害差值:', secondPanelDamage.breakBambooWhiteTextDamage - firstPanelDamage.breakBambooWhiteTextDamage);
                    console.log('- 破竹擦伤伤害差值:', secondPanelDamage.breakBambooGrazeDamage - firstPanelDamage.breakBambooGrazeDamage);
                    console.log('- 外属会心伤害差值:', secondPanelDamage.externalElementCriticalDamage - firstPanelDamage.externalElementCriticalDamage);
                    console.log('- 外属会意伤害差值:', secondPanelDamage.externalElementIntentDamage - firstPanelDamage.externalElementIntentDamage);
                    console.log('- 外属白字伤害差值:', secondPanelDamage.externalElementWhiteTextDamage - firstPanelDamage.externalElementWhiteTextDamage);
                    console.log('- 外属擦伤伤害差值:', secondPanelDamage.externalElementGrazeDamage - firstPanelDamage.externalElementGrazeDamage);
                }
                
                if (secondPanelDamage && secondPanelDamage.totalDamage) {
                    // 获取技能使用次数，默认为1
                    const times = skill.times || 1;
                    const skillDamage = parseFloat(secondPanelDamage.totalDamage) * times;
                    totalDamage += skillDamage;
                    console.log(`技能${index} 总伤害: ${skillDamage} (单次: ${secondPanelDamage.totalDamage} × 次数: ${times})`);
                    console.log(`累计总伤害: ${totalDamage}`);
                } else {
                    console.log(`技能${index} 伤害数据无效:`, secondPanelDamage);
                }
            }
        });
        
        console.log('\n=== 总伤害对比 ===');
        console.log('第一面板总伤害:', firstPanelTotalDamage);
        console.log('第二面板总伤害:', totalDamage);
        console.log('总伤害差值:', totalDamage - firstPanelTotalDamage);
        return totalDamage;
        
    } catch (error) {
        console.error('计算第二面板期望伤害时发生错误:', error);
        return 0;
    }
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
    }
}

// 更新伤害统计表格显示
function updateDamageStatsDisplay(graduationDamage, expectedDamage, simulationDamage, mode = 'none') {
    // 根据模式设置毕业伤害
    let fixedGraduationDamage;
    if (mode === 'custom') {
        // 自选模式：使用用户自定义的毕业伤害
        const customGraduationDamage = document.getElementById('custom-graduation-damage');
        fixedGraduationDamage = customGraduationDamage ? parseFloat(customGraduationDamage.value) || 3138065 : 3138065;
    } else if (mode === 'puwu_lao1') {
        // 普五老一：毕业伤害为2191649
        fixedGraduationDamage = 2191649;
    } else if (mode && mode.indexOf('yangui_duanshi') !== -1) {
        // 燕归断石：按需求设置毕业伤害
        fixedGraduationDamage = 3080124;
    } else if (mode && mode.indexOf('yangui_yishui') !== -1) {
        // 燕归易水：按需求设置毕业伤害
        fixedGraduationDamage = 3018586;
    } else if (mode && mode.indexOf('duanshi') !== -1) {
        // 其他断石类（默认飞隼断石）
        fixedGraduationDamage = 3138065;
    } else if (mode && mode.indexOf('yishui') !== -1) {
        // 其他易水类（默认飞隼易水）
        fixedGraduationDamage = 3082418;
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
    // 毕业DPS = 3082418 / T
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
    
    // 期望毕业率 = 期望伤害 / 3082418
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
    
    // 模拟毕业率 = 模拟伤害 / 3082418
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
    
    // 同步到排轴数据管理器
    rotationDataManager.updateCurrentRotation(rotationData);
    
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
        console.log('🖱️ 保存排轴按钮被点击');
        try {
            // 检查是否有排轴数据
            if (!rotationData || rotationData.length === 0) {
                console.log('⚠️ 没有排轴数据可保存');
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
    
            // 读取当前套装类型（优先表头选择，其次面板值）
            const headerSelect = document.getElementById('set-layer-header-select');
            const currentEquipmentSet = (headerSelect && headerSelect.value) || panelData.equipmentSet || '无';

            // 创建保存数据对象 - 只保存排轴数据，不保存面板数据
        const saveData = {
                name: configName.trim(),
                rotationData: [...rotationData], // 深拷贝排轴数据
                equipmentSet: currentEquipmentSet
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
function calculateExpectedDamageTotal(panelData = null, rotationDataParam = null) {
    let totalDamage = 0;
    
    // 获取面板数据（局部变量优先）
    const currentPanelData = panelData || panelDataManager.getDataFromInputs();
    
    // 获取排轴数据（支持多实例）
    const currentRotationData = rotationDataParam || rotationDataManager.getCurrentRotation();
    
    // 计算极乐泣血的次数（支持独立数据，与排轴表格保持一致）
    let tempRotationData = currentRotationData;
    if (!isSimulationMode) {
        tempRotationData = calculateJileQixueTimes([...currentRotationData]);
    }
    
    // 直接计算每个技能的伤害，不更新DOM
    tempRotationData.forEach(skill => {
        if (skill.name && skill.name !== '无') {
            const damageData = calculateDamage(skill, currentPanelData);
            if (damageData && damageData.totalDamage) {
                const times = skill.times || 1;
                const skillDamage = parseFloat(damageData.totalDamage) * times;
                totalDamage += skillDamage;
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
    
    // 确保按钮处于正确状态
    ensureButtonsEnabled();
    
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
        
        if (GameConfig.skillCategories.dotSkills.includes(skill.name) || skill.name === "极乐Dot" || skill.name === "年年Dot") {
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
    const baseCriticalRate = Math.min((panelData.criticalRate + extraCriticalRate) / 100, GameConfig.constants.maxCriticalRate);
    const directCriticalRate = panelData.directCriticalRate / 100;
    const criticalRate = baseCriticalRate + directCriticalRate;   
    const intentRate = panelData.intentRate / 100;     // 会意率（转换为小数）
    
    let effectiveCriticalRate, effectiveIntentRate, grazeRate, whiteTextRate;
    
    // 检查是否为Dot技能（在任何模式下都只产生白字伤害）
    if (GameConfig.skillCategories.dotSkills.includes(skill.name)) {
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
        
        // 同步到排轴数据管理器
        rotationDataManager.updateCurrentRotation(rotationData);
        
        // 加载后修复BUFF数据同步问题
        fixRotationDataBuffSync();
        
        // 根据配置名称自动切换毕业DPS模式（支持飞隼/燕归 + 易水/断石）
        const damageSelect = document.getElementById('damage-mode-select');
        if (damageSelect && config.name) {
            const name = config.name || '';
            let modeToSet = null;
            if (name.includes('断石')) {
                if (name.includes('飞隼')) modeToSet = 'feisun_duanshi';
                else if (name.includes('燕归')) modeToSet = 'yangui_duanshi';
                else modeToSet = 'feisun_duanshi'; // 兼容旧配置，默认断石归入飞隼断石
                console.log('检测到断石配置，自动切换到断石类模式');
            } else if (name.includes('易水')) {
                if (name.includes('飞隼')) modeToSet = 'feisun_yishui';
                else if (name.includes('燕归')) modeToSet = 'yangui_yishui';
                else modeToSet = 'feisun_yishui'; // 兼容旧配置，默认易水归入飞隼易水
                console.log('检测到易水配置，自动切换到易水类模式');
            } else if (name.includes('普五') || name.includes('老一')) {
                // 普通五人本·老一配置：联动到“普五老一”毕业模式
                modeToSet = 'puwu_lao1';
                console.log('检测到普五老一配置，自动切换到普五老一模式');
            }
            
            if (modeToSet) {
                damageSelect.value = modeToSet;
                // 触发change事件以更新相关计算
                const changeEvent = new Event('change', { bubbles: true });
                damageSelect.dispatchEvent(changeEvent);
            }
        }

        // 同步当前排轴的套装类型到表头与面板（优先使用配置中记录的值）
        try {
            const headerSelect = document.getElementById('set-layer-header-select');
            const equipmentSetSelect = document.getElementById('equipment-set');
            let equipmentSetToApply = config.equipmentSet;
            if (!equipmentSetToApply) {
                equipmentSetToApply = inferEquipmentSetFromRotation(rotationData);
            }
            panelData.equipmentSet = equipmentSetToApply || '无';
            if (headerSelect) headerSelect.value = panelData.equipmentSet;
            if (equipmentSetSelect) equipmentSetSelect.value = panelData.equipmentSet;
            console.log(`已同步套装类型为：${panelData.equipmentSet}`);
        } catch (e) {
            console.warn('同步套装类型到表头与面板时出现问题：', e);
        }
        
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

// 根据排轴数据推断套装类型（用于旧配置未记录套装类型时）
function inferEquipmentSetFromRotation(rotationItems) {
    const layers = (rotationItems || []).map(item => item && item.setLayer).filter(Boolean);
    const hasFeisui = layers.some(l => ['0层','1层','2层','3层','4层','满层'].includes(l));
    const hasYangui = layers.some(l => /外功增伤/.test(l));
    const hasShiyu = layers.some(l => /会心增伤/.test(l));
    const hasYueshan = layers.some(l => /通用增伤/.test(l));
    const hasXinYangui = layers.some(l => /破竹/.test(l) || /通用\+10%破竹增伤/.test(l));
    if (hasXinYangui) return '新燕归';
    if (hasYangui) return '燕归';
    if (hasShiyu) return '时雨';
    if (hasYueshan) return '岳山';
    if (hasFeisui) return '飞隼';
    return '无';
}

// 自动从“轴”文件夹加载排轴配置
async function autoLoadFolderConfigs() {
    try {
        // 如果通过文件协议打开页面，浏览器会阻止读取本地JSON文件
        // 这里直接给出友好提示并退出，避免产生 CORS/ERR_FAILED 报错
        const isHttp = location.protocol === 'http:' || location.protocol === 'https:';
        if (!isHttp) {
            console.warn('检测到通过 file:// 打开页面，自动加载轴配置被禁用');
            alert('自动加载轴配置需要通过本地服务器访问（http/https）。\n请在项目目录运行：py -3 -m http.server 8000\n然后使用：http://localhost:8000/ 打开本页面。');
            return;
        }

        // 读取清单文件：先尝试根目录，其次尝试 轴/ 目录（避免缓存导致 304）
        const manifestCandidates = ['rotation-manifest.json', '轴/rotation-manifest.json'];
        let files = null;
        for (const path of manifestCandidates) {
            try {
                let resp = await fetch(path, { cache: 'no-store' });
                if (!resp.ok) {
                    if (resp.status === 304) {
                        resp = await fetch(path, { cache: 'reload' });
                    } else {
                        continue;
                    }
                }
                const json = await resp.json();
                if (Array.isArray(json)) {
                    files = json;
                    break;
                }
            } catch (_) {
                // 忽略，尝试下一个候选路径
            }
        }
        if (!files) {
            console.warn('未找到 rotation-manifest.json（根目录或 轴/ 目录）');
            return;
        }
        if (!Array.isArray(files) || files.length === 0) {
            console.warn('清单内容为空或格式不正确');
            return;
        }

        // 读取现有本地配置
        let savedConfigs = [];
        try {
            savedConfigs = JSON.parse(localStorage.getItem('rotationConfigs') || '[]');
        } catch (_) {
            savedConfigs = [];
        }

        let loadedCount = 0;
        let firstLoadedCfg = null;
        for (const fileName of files) {
            try {
                // 读取轴文件：支持根目录或 轴/ 目录（避免缓存导致 304）
                const fileCandidates = (
                    fileName.includes('/') ? [fileName] : [fileName, `轴/${fileName}`]
                );
                let cfg = null;
                for (const fp of fileCandidates) {
                    try {
                        let resp = await fetch(fp, { cache: 'no-store' });
                        if (!resp.ok) {
                            if (resp.status === 304) {
                                resp = await fetch(fp, { cache: 'reload' });
                            } else {
                                continue;
                            }
                        }
                        const json = await resp.json();
                        if (json && json.name && json.rotationData) {
                            cfg = json;
                            break;
                        }
                    } catch (_) {
                        // 尝试下一个候选路径
                    }
                }
                if (!cfg) {
                    console.warn(`无法获取或解析轴文件：${fileName}`);
                    continue;
                }
                if (!cfg || !cfg.name || !cfg.rotationData) {
                    console.warn(`轴文件格式不正确：${fileName}`);
                    continue;
                }

                const existingIndex = savedConfigs.findIndex(c => c && c.name === cfg.name);
                if (existingIndex !== -1) {
                    savedConfigs[existingIndex] = cfg; // 覆盖同名配置
                } else if (savedConfigs.length < 10) {
                    savedConfigs.push(cfg);
                }
                if (!firstLoadedCfg) {
                    firstLoadedCfg = cfg; // 记录清单中首个成功加载的配置
                }
                loadedCount++;
            } catch (e) {
                console.error(`加载轴文件失败：${fileName}`, e);
            }
        }

        localStorage.setItem('rotationConfigs', JSON.stringify(savedConfigs));

        // 更新界面上的配置列表和按钮
        updateRotationConfigSelect();
        updateSaveButtonDisplay();

        // 自动加载"易水一分钟打桩轴"配置

        if (loadedCount > 0) {
            // 查找并自动加载：飞隼易水木桩轴-dy高育良
            const defaultConfig = savedConfigs.find(config => 
                config && config.name && config.name.includes('飞隼易水木桩轴-dy高育良')
            );

            if (defaultConfig) {
                // 自动加载指定默认配置
                loadRotationConfig(defaultConfig);

                // 更新下拉选择框的选中状态
                const configSelect = document.getElementById('saved-rotation-configs');
                if (configSelect) {
                    configSelect.value = defaultConfig.name;
                }

                console.log('已自动加载：飞隼易水木桩轴-dy高育良');
                showNotification(`已从"轴"文件夹加载${loadedCount}个配置，并自动加载飞隼易水木桩轴-dy高育良`, 'success');
            } else {
                showNotification(`已从"轴"文件夹加载${loadedCount}个配置`, 'success');
            }
        }
    } catch (err) {
        console.warn('自动加载轴文件夹配置失败：', err);
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

// 计算单个技能的伤害数据（优化版本，带缓存）
// ==================== 重构后的伤害计算函数 ====================
// ==================== 重构后的伤害计算函数 ====================
function calculateDamage(skill, panelData = null) {
    // 开始性能监控
    performanceMonitor.startTiming();
    
    // 输入验证
    const validation = DataValidator.validateSkillData(skill);
    if (!validation.isValid) {
        console.warn('技能数据验证失败:', validation.errors);
        performanceMonitor.endTiming();
        return createEmptyDamageResult();
    }
    
    // 获取面板数据（局部变量优先）
    const currentPanelData = panelData || panelDataManager.getDataFromInputs();
    
    
    // 缓存检查
    const cacheKey = generateCacheKey(skill, currentPanelData);
    const cachedResult = damageCache.get(cacheKey);
    if (cachedResult) {
        performanceMonitor.endTiming();
        performanceMonitor.updateCacheStats(damageCache.getStats());
        return cachedResult;
    }
    
    // 清理过期缓存（偶尔执行）
    if (Math.random() < 0.01) {
        cleanExpiredCache();
    }

    // 获取技能数据
    const skillData = skillRatesData.find(s => s.name === skill.name);
    if (!skillData) {
        return createEmptyDamageResult();
    }

    // 使用与第一面板完全相同的计算逻辑
    const damageResult = calculateDamageWithOriginalLogic(skill, currentPanelData, skillData);
    
    // 保存到缓存
    damageCache.set(cacheKey, damageResult);
    
    // 结束性能监控
    performanceMonitor.endTiming();
    performanceMonitor.updateCacheStats(damageCache.getStats());
    
    return damageResult;
}

// ==================== 伤害计算子函数 ====================
function createEmptyDamageResult() {
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

// 使用与第一面板完全相同的计算逻辑
function calculateDamageWithOriginalLogic(skill, panelData, skillData) {
    
    // 使用选中的BUFF增伤表数据
    let generalBonus = skill.buffName && skill.buffName !== '无' ? skill.generalBonus : 0;
    let criticalBonus = skill.buffName && skill.buffName !== '无' ? skill.criticalBonus : 0;
    const externalPenetration = skill.buffName && skill.buffName !== '无' ? skill.externalPenetration : 0;
    const extraCriticalRate = skill.buffName && skill.buffName !== '无' ? skill.extraCriticalRate : 0;
    let talismanIntentBonus = 0; // 用于存储会意帖的增伤
    let talismanElementalDamageBonus = 0; // 用于存储真气属攻帖的属攻伤害加成，对破竹伤害和外属伤害都生效
    
    // 绳镖武学增伤：仅对"鼠鼠生威"和"牵绳引刃"两个技能生效
    if (GameConfig.skillCategories.ropeDartSkills.includes(skill.name)) {
        generalBonus += panelData.ropeDartBonus;
    }
    
    // 鼠鼠生威技能额外80%通用增伤
    if (skill.name === "鼠鼠生威") {
        generalBonus += 80;
    }
    
    // 双刀武学增伤：适用于白刀技能A1至A4、红刀技能A1至A5以及痴障技能
    if (GameConfig.skillCategories.dualBladesSkills.includes(skill.name)) {
        generalBonus += panelData.dualBladesBonus;
    }
    
    // 全武学增伤：适用于绳镖武学、双刀武学、易水歌和极乐泣血技能
    if (GameConfig.skillCategories.allMartialSkills.includes(skill.name)) {
        generalBonus += panelData.allMartialBonus;
    }
    
    // 首领单位增伤：适用于技能表中所有技能
    if (skill.name && skill.name !== '无') {
        generalBonus += panelData.bossUnitBonus;
    }
    
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
                // 奇术帖只对特定技能生效
                const qishuSkills = ['骑龙回马一段', '骑龙回马二段', '箫声千浪炸', '箫声千浪(炸前)', '箫声千浪(炸后)', '清风霁月'];
                if (qishuSkills.includes(skill.name)) {
                    generalBonus += 15; // 15%通用增伤
                }
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
                talismanElementalDamageBonus += 15; // 15%属攻伤害加成，对破竹伤害和外属伤害都生效
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
    let bossTalentBonus = 0;
    if (panelData.bossTalent === 'trial-sword') {
        bossTalentBonus = 15; // 试剑/侠境增加15%通用增伤
    }
    generalBonus += bossTalentBonus;
    
    // 鼠鼠定音增伤：仅适用于鼠鼠生威技能，独立计算
    // 鼠鼠生威技能有额外独立的1.3倍全部伤害（1.24倍外功伤害已归类为额外外功伤害加成）
    const mouseGeneralBonus = skill.name === "鼠鼠生威" ? (1 + panelData.mouseBonus / 100) * 1.3 : 1;
    
    // 强效轻击增伤：仅适用于红刀A1-A5技能，独立计算
    const lightStrikeBonus = GameConfig.skillCategories.redBladeSkills.includes(skill.name) ? (1 + panelData.lightStrikeBonus / 100) : 1;
    
    // 红刀A1-A5属攻穿透+10：仅适用于红刀A1-A5技能
    const redBladeElementalPenetration = GameConfig.skillCategories.redBladeSkills.includes(skill.name) ? GameConfig.constants.redBladeElementalPenetration : 0;
    
    // 获取面板数据
    const precisionRate = panelData.precisionRate / 100; // 精准率（转换为小数）
    // 面板会心率=会心率+额外会心率（不超过80%）+直接会心率（可超出80%）（转换为小数）
    const baseCriticalRate = Math.min((panelData.criticalRate + extraCriticalRate) / 100, GameConfig.constants.maxCriticalRate);
    const directCriticalRate = panelData.directCriticalRate / 100;
    const criticalRate = baseCriticalRate + directCriticalRate;   
    const intentRate = panelData.intentRate / 100;     // 会意率（转换为小数）
    
    // 计算生效会心率、生效会意率、擦伤率和白字率
    let effectiveCriticalRate, effectiveIntentRate, grazeRate, whiteTextRate;
    
    // 检查是否为Dot技能（在任何模式下都只产生白字伤害）
    if (GameConfig.skillCategories.dotSkills.includes(skill.name)) {
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
    let newYanguiBreakBambooBonus = 0; // 新燕归套装破竹增伤
    if (panelData.equipmentSet === '新燕归' && skill.setLayer && skill.setLayer !== '无' && yanguiSkills.includes(skill.name)) {
        switch(skill.setLayer) {
            case '12%通用增伤':
                generalBonus += 12; // 12%通用增伤
                break;
            case '12%通用+10%破竹增伤':
                generalBonus += 12; // 12%通用增伤
                newYanguiBreakBambooBonus = 10; // 10%破竹增伤
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
    if (isSimulationMode && !GameConfig.skillCategories.dotSkills.includes(skill.name)) {
        // 在最小值到最大值之间随机选取一个整数
        avgExternalAttack = Math.floor(Math.random() * (externalAttackWithFeisui.max - externalAttackWithFeisui.min + 1)) + externalAttackWithFeisui.min;
    } else {
        // 正常模式下使用平均值
        avgExternalAttack = (externalAttackWithFeisui.min + externalAttackWithFeisui.max) / 2;
    }
    
    // 计算破竹攻击值
    let avgBreakBambooAttack;
    if (isSimulationMode && !GameConfig.skillCategories.dotSkills.includes(skill.name)) {
        // 在最小值到最大值之间随机选取一个整数
        avgBreakBambooAttack = Math.floor(Math.random() * (panelData.breakBambooAttack.max - panelData.breakBambooAttack.min + 1)) + panelData.breakBambooAttack.min;
    } else {
        // 正常模式下使用平均值
        avgBreakBambooAttack = (panelData.breakBambooAttack.min + panelData.breakBambooAttack.max) / 2;
    }
    
    // 计算外属攻击值（鸣金、裂石、牵丝）
    let avgRingMetalAttack, avgBreakRockAttack, avgPullSilkAttack;
    if (isSimulationMode && !GameConfig.skillCategories.dotSkills.includes(skill.name)) {
        // 在最小值到最大值之间随机选取一个整数
        avgRingMetalAttack = Math.floor(Math.random() * (panelData.ringMetalAttack.max - panelData.ringMetalAttack.min + 1)) + panelData.ringMetalAttack.min;
        avgBreakRockAttack = Math.floor(Math.random() * (panelData.breakRockAttack.max - panelData.breakRockAttack.min + 1)) + panelData.breakRockAttack.min;
        avgPullSilkAttack = Math.floor(Math.random() * (panelData.pullSilkAttack.max - panelData.pullSilkAttack.min + 1)) + panelData.pullSilkAttack.min;
    } else {
        // 正常模式下使用平均值
        avgRingMetalAttack = (panelData.ringMetalAttack.min + panelData.ringMetalAttack.max) / 2;
        avgBreakRockAttack = (panelData.breakRockAttack.min + panelData.breakRockAttack.max) / 2;
        avgPullSilkAttack = (panelData.pullSilkAttack.min + panelData.pullSilkAttack.max) / 2;
    }
    
    // 计算所恨年年的减防和增伤效果
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
        }
    }
    
    // 计算Boss防御值
    let effectiveBossDefense = panelData.bossDefense;
    
    // 先应用技能的10%减防（刀法技能）
    if (GameConfig.skillCategories.bladeSkills.includes(skill.name)) {
        effectiveBossDefense = effectiveBossDefense * 0.9;
    }
    
    // 再应用所恨年年的减防效果
    if (suohenDefenseReduction > 0) {
        effectiveBossDefense = effectiveBossDefense * (1 - suohenDefenseReduction / 100);
    }
    
    // 计算易水歌的增伤效果
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
        }
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

    const externalCriticalDamage = ((avgExternalAttack - effectiveBossDefense) * skillData.externalRate + skillData.fixedExternal) * 
                                  (1 + (panelData.externalPenetration + externalPenetration + yishuiExternalPenetration + suohenExternalPenetration) / 200) * effectiveCriticalRate * 
                                  (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * (1 + (panelData.externalDamageBonus + extraExternalDamageBonus) / 100) * 
                                  (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
    
    // 计算外功会意伤害（使用飞隼套装加成后的最大值，与排轴列表保持一致）
    const externalIntentDamage = ((externalAttackWithFeisui.max - effectiveBossDefense) * skillData.externalRate + skillData.fixedExternal) * 
                                (1 + (panelData.externalPenetration + externalPenetration + yishuiExternalPenetration + suohenExternalPenetration) / 200) * effectiveIntentRate * 
                                (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * (1 + (panelData.externalDamageBonus + extraExternalDamageBonus) / 100) * 
                                (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
    
    // 计算外功白字伤害
    const externalWhiteTextDamage = ((avgExternalAttack - effectiveBossDefense) * skillData.externalRate + skillData.fixedExternal) * 
                                   (1 + (panelData.externalPenetration + externalPenetration + yishuiExternalPenetration + suohenExternalPenetration) / 200) * whiteTextRate * 
                                   (1 + (panelData.externalDamageBonus + extraExternalDamageBonus) / 100) * 
                                   (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
    
    // 计算外功擦伤伤害
    const externalGrazeDamage = ((avgExternalAttack - effectiveBossDefense) * skillData.externalRate + skillData.fixedExternal) * 
                               (1 + (panelData.externalPenetration + externalPenetration + yishuiExternalPenetration + suohenExternalPenetration) / 200) * grazeRate * 
                               (1 + (panelData.externalDamageBonus + extraExternalDamageBonus) / 100) * 
                               (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
    
    // 计算破竹会心伤害
    const breakBambooCriticalDamage = (avgBreakBambooAttack * skillData.breakBambooRate + skillData.fixedBreakBamboo) * 
                                     (1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200) * effectiveCriticalRate * 
                                     (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * GameConfig.constants.breakBambooMultiplier * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                     (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
    
    // 计算破竹会意伤害（使用最大值，与排轴列表保持一致）
    const breakBambooIntentDamage = (panelData.breakBambooAttack.max * skillData.breakBambooRate + skillData.fixedBreakBamboo) * 
                                   (1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200) * effectiveIntentRate * 
                                   (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * GameConfig.constants.breakBambooMultiplier * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                   (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
    
    // 计算破竹白字伤害
    const breakBambooWhiteTextDamage = (avgBreakBambooAttack * skillData.breakBambooRate + skillData.fixedBreakBamboo) * 
                                      (1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200) * whiteTextRate * GameConfig.constants.breakBambooMultiplier * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                      (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
    
    // 计算破竹擦伤伤害
    const breakBambooGrazeDamage = (avgBreakBambooAttack * skillData.breakBambooRate + skillData.fixedBreakBamboo) * 
                                  (1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200) * grazeRate * GameConfig.constants.breakBambooMultiplier * (1 + (panelData.elementalDamageBonus + newYanguiBreakBambooBonus + talismanElementalDamageBonus) / 100) * 
                                  (1 + generalBonus / 100) * mouseGeneralBonus * lightStrikeBonus;
    
    // 计算外属会心伤害（使用平均值，与排轴列表保持一致）
    const externalElementCriticalDamage = (avgRingMetalAttack * skillData.externalElementRate) * 
                                        effectiveCriticalRate * (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 
                                        (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                        mouseGeneralBonus * lightStrikeBonus +
                                        (avgBreakRockAttack * skillData.externalElementRate) * 
                                        effectiveCriticalRate * (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 
                                        (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                        mouseGeneralBonus * lightStrikeBonus +
                                        (avgPullSilkAttack * skillData.externalElementRate) * 
                                        effectiveCriticalRate * (1 + (panelData.criticalDamageBonus + criticalBonus) / 100) * 
                                        (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                        mouseGeneralBonus * lightStrikeBonus;
    
    // 计算外属会意伤害（使用最大值，与排轴列表保持一致）
    const externalElementIntentDamage = (panelData.ringMetalAttack.max * skillData.externalElementRate) * 
                                       effectiveIntentRate * (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 
                                       (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                       mouseGeneralBonus * lightStrikeBonus +
                                       (panelData.breakRockAttack.max * skillData.externalElementRate) * 
                                       effectiveIntentRate * (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 
                                       (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                       mouseGeneralBonus * lightStrikeBonus +
                                       (panelData.pullSilkAttack.max * skillData.externalElementRate) * 
                                       effectiveIntentRate * (1 + (panelData.intentDamageBonus + talismanIntentBonus) / 100) * 
                                       (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                       mouseGeneralBonus * lightStrikeBonus;
    
    // 计算外属白字伤害（使用平均值，与排轴列表保持一致）
    const externalElementWhiteTextDamage = (avgRingMetalAttack * skillData.externalElementRate) * 
                                         whiteTextRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                         mouseGeneralBonus * lightStrikeBonus +
                                         (avgBreakRockAttack * skillData.externalElementRate) * 
                                         whiteTextRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                         mouseGeneralBonus * lightStrikeBonus +
                                         (avgPullSilkAttack * skillData.externalElementRate) * 
                                         whiteTextRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                         mouseGeneralBonus * lightStrikeBonus;
    
    // 计算外属擦伤伤害（使用最小值，与排轴列表保持一致）
    const externalElementGrazeDamage = (panelData.ringMetalAttack.min * skillData.externalElementRate) * 
                                      grazeRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                      mouseGeneralBonus * lightStrikeBonus +
                                      (panelData.breakRockAttack.min * skillData.externalElementRate) * 
                                      grazeRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                      mouseGeneralBonus * lightStrikeBonus +
                                      (panelData.pullSilkAttack.min * skillData.externalElementRate) * 
                                      grazeRate * (1 + generalBonus / 100) * (1 + talismanElementalDamageBonus / 100) * 
                                      mouseGeneralBonus * lightStrikeBonus;
    
    // 计算总伤害（所有类型伤害之和）
    const totalDamage = externalCriticalDamage + externalIntentDamage + externalWhiteTextDamage + externalGrazeDamage +
                       breakBambooCriticalDamage + breakBambooIntentDamage + breakBambooWhiteTextDamage + breakBambooGrazeDamage +
                       externalElementCriticalDamage + externalElementIntentDamage + externalElementWhiteTextDamage + externalElementGrazeDamage;
    
    // 调试信息：显示详细计算过程
    
    return {
        totalDamage: totalDamage,
        externalDamage: (avgExternalAttack - effectiveBossDefense) * skillData.externalRate + skillData.fixedExternal,
        breakBambooDamage: avgBreakBambooAttack * skillData.breakBambooRate + skillData.fixedBreakBamboo,
        externalElementDamage: avgRingMetalAttack * skillData.externalElementRate,
        externalCriticalDamage,
        externalIntentDamage,
        externalWhiteTextDamage,
        externalGrazeDamage,
        breakBambooCriticalDamage,
        breakBambooIntentDamage,
        breakBambooWhiteTextDamage,
        breakBambooGrazeDamage,
        externalElementCriticalDamage,
        externalElementIntentDamage,
        externalElementWhiteTextDamage,
        externalElementGrazeDamage,
        effectiveCriticalRate,
        effectiveIntentRate,
        whiteTextRate,
        grazeRate
    };
}

function calculateBaseData(skill, skillData) {
    return {
        skillName: skill.name,
        skillData: skillData,
        buffName: skill.buffName || '无',
        skillSetLayer: skill.setLayer || '无',
        skillTalismanLayer: skill.talismanLayer || '无帖',
        skillYishui: skill.yishui || '未设置',
        skillSuohen: skill.suohen || '未设置',
        skillQijie: skill.qijie || '否',
        skillNaisan: skill.naisan || '否',
        skillYishang: skill.yishang || '否'
    };
}

function calculateBuffData(skill) {
    const buffInfo = buffData.find(b => b.name === (skill.buffName || '无'));
    return {
        generalBonus: buffInfo ? buffInfo.generalBonus : 0,
        criticalBonus: buffInfo ? buffInfo.criticalBonus : 0,
        externalPenetration: buffInfo ? buffInfo.externalPenetration : 0,
        extraCriticalRate: buffInfo ? buffInfo.extraCriticalRate : 0
    };
}

function calculateAttackValues(panelData) {
    return {
        externalAttack: (panelData.externalAttack.min + panelData.externalAttack.max) / 2,
        breakBambooAttack: (panelData.breakBambooAttack.min + panelData.breakBambooAttack.max) / 2,
        ringMetalAttack: (panelData.ringMetalAttack.min + panelData.ringMetalAttack.max) / 2,
        breakRockAttack: (panelData.breakRockAttack.min + panelData.breakRockAttack.max) / 2,
        pullSilkAttack: (panelData.pullSilkAttack.min + panelData.pullSilkAttack.max) / 2,
        externalElementAttack: 0 // 将在下面计算
    };
}

function calculateBaseDamage(baseData, attackValues, skillData, panelData) {
    // 计算外属攻击
    attackValues.externalElementAttack = attackValues.ringMetalAttack + attackValues.breakRockAttack + attackValues.pullSilkAttack;
    
    return {
        external: (attackValues.externalAttack - panelData.bossDefense) * skillData.externalRate + skillData.fixedExternal,
        breakBamboo: attackValues.breakBambooAttack * skillData.breakBambooRate + skillData.fixedBreakBamboo,
        externalElement: attackValues.externalElementAttack * skillData.externalElementRate
    };
}

function calculateMultipliers(baseData, buffData, panelData) {
    // 计算各种增伤效果
    let generalBonus = buffData.generalBonus;
    
    // 应用技能特殊效果
    const skillEffects = GameConfig.skillEffects[baseData.skillName];
    if (skillEffects) {
        generalBonus += skillEffects.generalBonus;
    }
    
    // 鼠鼠生威技能额外80%通用增伤
    if (baseData.skillName === "鼠鼠生威") {
        generalBonus += 80;
    }
    
    // 应用装备增伤
    if (GameConfig.skillCategories.ropeDartSkills.includes(baseData.skillName)) {
        generalBonus += panelData.ropeDartBonus;
    }
    
    if (GameConfig.skillCategories.dualBladesSkills.includes(baseData.skillName)) {
        generalBonus += panelData.dualBladesBonus;
    }
    
    if (GameConfig.skillCategories.allMartialSkills.includes(baseData.skillName)) {
        generalBonus += panelData.allMartialBonus;
    }
    
    // 红刀技能特殊效果
    const redBladeElementalPenetration = GameConfig.skillCategories.redBladeSkills.includes(baseData.skillName) ? 
        GameConfig.constants.redBladeElementalPenetration : 0;
    
    // 首领单位增伤
    generalBonus += panelData.bossUnitBonus;

    // 强效轻击增伤
    generalBonus += panelData.lightStrikeBonus;
    
    // 鼠鼠定音增伤
    generalBonus += panelData.mouseBonus;
    
    // 符帖增伤
    if (baseData.skillTalismanLayer && baseData.skillTalismanLayer !== '无帖') {
        switch(baseData.skillTalismanLayer) {
            case '奇术帖':
                const qishuSkills = ['骑龙回马一段', '骑龙回马二段', '箫声千浪炸', '箫声千浪(炸前)', '箫声千浪(炸后)', '清风霁月'];
                if (qishuSkills.includes(baseData.skillName)) {
                    generalBonus += 15; // 15%通用增伤
                }
                break;
            case '承欢帖':
                generalBonus += 20; // 20%通用增伤
                break;
        }
    }
    
    // 天工增伤
    if (panelData.craftingBonus === '天工火') {
        generalBonus += 1.5; // 1.5%通用增伤
    } else if (panelData.craftingBonus === '天工毒') {
        generalBonus += 1; // 1%通用增伤
    }
    
    // Boss天赋增伤
    if (panelData.bossTalent === 'trial-sword') {
        generalBonus += 15; // 试剑/侠境增加15%通用增伤
    }
    
    // 套装增伤
    if (panelData.equipmentSet === '岳山' && baseData.skillSetLayer && baseData.skillSetLayer !== '无') {
        switch(baseData.skillSetLayer) {
            case '10%通用增伤': generalBonus += 10; break;
            case '9%通用增伤': generalBonus += 9; break;
            case '8%通用增伤': generalBonus += 8; break;
            case '7%通用增伤': generalBonus += 7; break;
            case '6%通用增伤': generalBonus += 6; break;
            case '5%通用增伤': generalBonus += 5; break;
        }
    }
    
    if (panelData.equipmentSet === '新燕归' && baseData.skillSetLayer && baseData.skillSetLayer !== '无') {
        switch(baseData.skillSetLayer) {
            case '12%通用增伤': generalBonus += 12; break;
            case '12%通用+10%破竹增伤': generalBonus += 12; break;
        }
    }
    
    // 易水歌增伤
    if (baseData.skillYishui === '满层') {
        generalBonus += 20; // 易水歌满层增加20%通用增伤
    }
    
    // 所恨年年增伤
    if (baseData.skillSuohen === '满层') {
        generalBonus += 15; // 所恨年年满层增加15%通用增伤
    }
    
    // 气竭、奶伞、易伤增伤
    if (baseData.skillQijie === '是') {
        generalBonus += 10; // 气竭增加10%通用增伤
    }
    if (baseData.skillNaisan === '是') {
        generalBonus += 20; // 奶伞增加20%通用增伤
    }
    if (baseData.skillYishang === '是') {
        generalBonus += 8; // 易伤增加8%通用增伤
    }

    return {
        general: 1 + generalBonus / 100,
        critical: 1 + buffData.criticalBonus / 100,
        externalPenetration: 1 + buffData.externalPenetration / 200,
        elementalPenetration: 1 + (panelData.elementalPenetration + redBladeElementalPenetration) / 200
    };
}

function calculateFinalDamage(baseDamage, multipliers, panelData) {
    // 应用外功伤害加成和属攻伤害加成
    const externalDamageMultiplier = 1 + panelData.externalDamageBonus / 100;
    const elementalDamageMultiplier = 1 + panelData.elementalDamageBonus / 100;
    
    return {
        external: baseDamage.external * multipliers.general * multipliers.externalPenetration * externalDamageMultiplier,
        breakBamboo: baseDamage.breakBamboo * multipliers.general * multipliers.elementalPenetration * GameConfig.constants.breakBambooMultiplier * elementalDamageMultiplier,
        externalElement: baseDamage.externalElement * multipliers.general * multipliers.elementalPenetration * elementalDamageMultiplier
    };
}

function calculateProbabilityData(buffData, panelData) {
    const criticalRate = Math.min((panelData.criticalRate + buffData.extraCriticalRate) / 100, GameConfig.constants.maxCriticalRate) + panelData.directCriticalRate / 100;
    const intentRate = panelData.intentRate / 100;
    const precisionRate = panelData.precisionRate / 100;
    
    return { criticalRate, intentRate, precisionRate };
}

function calculateExpectedDamageFromFinalDamage(finalDamage, probabilityData, multipliers) {
    const { criticalRate, intentRate, precisionRate } = probabilityData;

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
    const externalCriticalDamage = finalDamage.external * effectiveCriticalRate * multipliers.critical;
    const externalIntentDamage = finalDamage.external * effectiveIntentRate * multipliers.critical;
    const externalWhiteTextDamage = finalDamage.external * whiteTextRate;
    const externalGrazeDamage = finalDamage.external * grazeRate;

    const breakBambooCriticalDamage = finalDamage.breakBamboo * effectiveCriticalRate * multipliers.critical;
    const breakBambooIntentDamage = finalDamage.breakBamboo * effectiveIntentRate * multipliers.critical;
    const breakBambooWhiteTextDamage = finalDamage.breakBamboo * whiteTextRate;
    const breakBambooGrazeDamage = finalDamage.breakBamboo * grazeRate;

    const externalElementCriticalDamage = finalDamage.externalElement * effectiveCriticalRate * multipliers.critical;
    const externalElementIntentDamage = finalDamage.externalElement * effectiveIntentRate * multipliers.critical;
    const externalElementWhiteTextDamage = finalDamage.externalElement * whiteTextRate;
    const externalElementGrazeDamage = finalDamage.externalElement * grazeRate;
    
    // 计算期望总伤害（各种概率下的伤害加权平均）
    const totalExpectedDamage = 
        externalCriticalDamage + externalIntentDamage + externalWhiteTextDamage + externalGrazeDamage +
        breakBambooCriticalDamage + breakBambooIntentDamage + breakBambooWhiteTextDamage + breakBambooGrazeDamage +
        externalElementCriticalDamage + externalElementIntentDamage + externalElementWhiteTextDamage + externalElementGrazeDamage;
    
    return {
        totalDamage: totalExpectedDamage,
        externalDamage: finalDamage.external,
        breakBambooDamage: finalDamage.breakBamboo,
        externalElementDamage: finalDamage.externalElement,
        externalCriticalDamage,
        externalIntentDamage,
        externalWhiteTextDamage,
        externalGrazeDamage,
        breakBambooCriticalDamage,
        breakBambooIntentDamage,
        breakBambooWhiteTextDamage,
        breakBambooGrazeDamage,
        externalElementCriticalDamage,
        externalElementIntentDamage,
        externalElementWhiteTextDamage,
        externalElementGrazeDamage
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
    const skillHitMap = new Map(); // 新增：存储技能Hit总数
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
            
            // 从第4列（索引3）读取技能次数 - 优先从输入框读取，如果没有输入框则从文本内容读取
            let skillTimes = 0;
            const timesInput = cells[3].querySelector('input');
            if (timesInput) {
                skillTimes = parseFloat(timesInput.value) || 0;
            } else {
                skillTimes = parseFloat(cells[3].textContent) || 0;
            }
            
            // 获取技能Hit数
            const skillData = skillRatesData.find(s => s.name === originalSkillName);
            const skillHit = skillData ? skillData.hit : 0;
            
            // 特殊处理：极乐泣血显示技能次数累加，其他技能显示Hit数累加
            let totalHit;
            if (originalSkillName === '极乐泣血') {
                totalHit = Math.round(skillTimes * 100) / 100; // 极乐泣血显示技能次数，保留2位小数
            } else {
                totalHit = Math.round(skillHit * skillTimes * 100) / 100; // 其他技能显示Hit数，保留2位小数避免浮点数精度问题
            }
            
            // 调试信息
            if (originalSkillName !== '无' && originalSkillName !== '未知技能') {
                const hitType = originalSkillName === '极乐泣血' ? '次数' : 'Hit数';
                console.log(`技能: ${originalSkillName}, 次数: ${skillTimes}, ${hitType}: ${originalSkillName === '极乐泣血' ? skillTimes : skillHit}, 总${hitType}: ${totalHit}`);
                console.log('技能数据:', skillData);
                console.log('第3列内容:', cells[3].textContent);
                console.log('第3列输入框:', timesInput ? timesInput.value : '无输入框');
            }
            
            // 应用技能名称合并逻辑
            const mergedSkillName = mergeSkillName(originalSkillName);
            
            // 累积伤害
            if (skillDamageMap.has(mergedSkillName)) {
                skillDamageMap.set(mergedSkillName, skillDamageMap.get(mergedSkillName) + skillDamage);
            } else {
                skillDamageMap.set(mergedSkillName, skillDamage);
            }
            
            // 累积Hit数
            if (skillHitMap.has(mergedSkillName)) {
                skillHitMap.set(mergedSkillName, skillHitMap.get(mergedSkillName) + totalHit);
            } else {
                skillHitMap.set(mergedSkillName, totalHit);
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

    // 调试信息：输出Hit数统计
    console.log('Hit数统计:', Array.from(skillHitMap.entries()));
    
    // 更新图表（无动画）
    skillDamageChart.update('none');
    updateSkillDamageLegend(sortedSkills, skillHitMap);
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
function updateSkillDamageLegend(sortedSkills = [], skillHitMap = new Map()) {
    const legend = document.getElementById('skillDamageLegend');
    if (!legend || !skillDamageChart) return;

    const data = skillDamageChart.data;
    legend.innerHTML = '';

    data.labels.forEach((label, index) => {
        const percentage = data.datasets[0].data[index];
        const color = data.datasets[0].backgroundColor[index];
        
        // 获取实际伤害值
        const actualDamage = sortedSkills[index] ? sortedSkills[index][1] : 0;
        
        // 获取Hit总数
        const totalHits = skillHitMap.get(label) || 0;
        
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        // 极乐泣血显示次数，其他技能显示Hit数
        const hitDisplay = label === '极乐泣血' ? `${Math.round(totalHits * 100) / 100}次` : `${totalHits}Hit`;
        
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${color}"></div>
            <span class="legend-label">${label}</span>
            <span class="legend-value">${percentage.toFixed(2)}%</span>
            <span class="legend-actual">(${actualDamage.toFixed(2)})</span>
            <span class="legend-hits">[${hitDisplay}]</span>
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
    
    importButton.addEventListener('click', function() {
        console.log('DIY导入到基础信息按钮被点击');
        
        try {
            // 直接执行导入，无需用户确认
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
        
        // 攻击值逻辑判定：当最小值>最大值时，使最大值=最小值
        
        // 外功攻击判定
        const externalAttackMin = document.getElementById('external-attack-min');
        const externalAttackMax = document.getElementById('external-attack-max');
        if (externalAttackMin && externalAttackMax) {
            const minValue = parseFloat(externalAttackMin.value) || 0;
            const maxValue = parseFloat(externalAttackMax.value) || 0;
            if (minValue > maxValue) {
                externalAttackMax.value = minValue.toString();
                console.log(`外功攻击最大值已调整为最小值: ${minValue}`);
            }
        }
        
        // 破竹攻击判定
        const breakBambooMin = document.getElementById('break-bamboo-attack-min');
        const breakBambooMax = document.getElementById('break-bamboo-attack-max');
        if (breakBambooMin && breakBambooMax) {
            const minValue = parseFloat(breakBambooMin.value) || 0;
            const maxValue = parseFloat(breakBambooMax.value) || 0;
            if (minValue > maxValue) {
                breakBambooMax.value = minValue.toString();
                console.log(`破竹攻击最大值已调整为最小值: ${minValue}`);
            }
        }
        
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





// ==================== 废弃的全局数据更新函数 ====================
/** @deprecated 使用 panelDataManager.getDataFromInputs() 替代 */
function updatePanelDataFromInputs() {
    console.warn('updatePanelDataFromInputs() 已废弃，请使用 panelDataManager.getDataFromInputs()');
    // 为了向后兼容，保留基本功能
    const data = panelDataManager.getDataFromInputs();
    panelDataManager.updateData(data);
    return data;
}

// ==================== 辅助函数 ====================
function showValidationErrors(errors) {
    // 创建错误提示元素
    const errorContainer = document.getElementById('validation-errors') || createErrorContainer();
    errorContainer.innerHTML = errors.map(error => `<div class="error-message">${error}</div>`).join('');
    errorContainer.style.display = 'block';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 3000);
}

function showErrorMessage(message) {
    // 创建通用错误提示
    const errorContainer = document.getElementById('validation-errors') || createErrorContainer();
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    errorContainer.style.display = 'block';
    
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 3000);
}

function createErrorContainer() {
    const container = document.createElement('div');
    container.id = 'validation-errors';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 10000;
        display: none;
    `;
    document.body.appendChild(container);
    return container;
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
        if (equipmentValue === '新燕归' || equipmentValue === '岳山') {
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
        const bonusValue = checkbox.checked ? 6.2 : -6.2;
        const newValue = Math.max(0, currentValue + bonusValue);
        
        bonusInput.value = preciseRound(newValue, 1);
        
        console.log(`绳镖武学增伤更新: ${checkbox.checked ? '+' : '-'}6.2, 新值: ${newValue.toFixed(1)}`);
        
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
        const bonusValue = checkbox.checked ? 6.2 : -6.2;
        const newValue = Math.max(0, currentValue + bonusValue);
        
        bonusInput.value = preciseRound(newValue, 1);
        
        console.log(`双刀武学增伤更新: ${checkbox.checked ? '+' : '-'}6.2, 新值: ${newValue.toFixed(1)}`);
        
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

// 强制设置BOSS防御为96级BOSS(405)
function validateAndFixBossDefense() {
    try {
        const bossDefenseSelect = document.getElementById('boss-defense');
        if (bossDefenseSelect) {
            bossDefenseSelect.value = '405';
        }
    } catch (error) {
        console.error('设置BOSS防御时发生错误:', error);
    }
}

// 为面板数据变化添加监听器，确保期望2伤害实时更新
function setupPanelDataChangeListeners() {
    try {
        console.log('开始设置面板数据变化监听器...');
        
        // 定义所有面板数据相关的输入框ID
        const panelInputIds = [
            // 战斗属性
            'external-attack-min',
            'external-attack-max',
            'precision-rate',
            'critical-rate',
            'intent-rate',
            'direct-critical-rate',
            'direct-intent-rate',
            
            // 攻击属性
            'ring-metal-attack-min',
            'ring-metal-attack-max',
            'break-rock-attack-min',
            'break-rock-attack-max',
            'pull-silk-attack-min',
            'pull-silk-attack-max',
            'break-bamboo-attack-min',
            'break-bamboo-attack-max',
            
            // 伤害加成
            'critical-damage-bonus',
            'intent-damage-bonus',
            'external-penetration',
            'elemental-penetration',
            'external-damage-bonus',
            'elemental-damage-bonus',
            
            // 武学增伤
            'rope-dart-bonus',
            'dual-blades-bonus',
            'all-martial-bonus',
            'boss-unit-bonus',
            'light-strike-bonus',
            'mouse-bonus',
            
            // 装备和BUFF
            'equipment-set',
            'food-buff',
            'talisman',
            'crafting-bonus',
            'boss-talent',
            'boss-defense'
        ];
        
        // 移除面板输入框的实时计算监听器
        // 现在只有点击计算按钮时才会进行计算
        console.log('面板输入框实时计算已禁用，只有点击计算按钮时才会进行计算');
        
        // 移除特殊输入框的调试监听器
        console.log('特殊输入框调试监听器已移除');
        
        console.log('面板数据变化监听器设置完成');
        
    } catch (error) {
        console.error('设置面板数据变化监听器时发生错误:', error);
    }
}

// 高级缓存管理器
class AdvancedCacheManager {
    constructor() {
        this.cache = new Map();
        this.maxSize = 1000; // 最大缓存条目数
        this.accessCount = new Map(); // 访问次数统计
    }
    
    // 生成缓存键
    generateKey(panelData, rotationData, calculationType) {
        const panelKey = JSON.stringify({
            externalAttack: panelData.externalAttack,
            externalPenetration: panelData.externalPenetration,
            elementalPenetration: panelData.elementalPenetration,
            breakBambooAttack: panelData.breakBambooAttack,
            externalDamageBonus: panelData.externalDamageBonus,
            elementalDamageBonus: panelData.elementalDamageBonus,
            criticalRate: panelData.criticalRate,
            intentRate: panelData.intentRate,
            precisionRate: panelData.precisionRate
        });
        
        const rotationKey = JSON.stringify(rotationData.map(skill => ({
            name: skill.name,
            times: skill.times,
            buffName: skill.buffName,
            setLayer: skill.setLayer
        })));
        
        return `${calculationType}_${panelKey}_${rotationKey}`;
    }
    
    // 获取缓存
    get(key) {
        if (this.cache.has(key)) {
            // 更新访问次数
            this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1);
            return this.cache.get(key);
        }
        return null;
    }
    
    // 设置缓存
    set(key, value) {
        // 如果缓存已满，删除最少访问的条目
        if (this.cache.size >= this.maxSize) {
            this.evictLeastUsed();
        }
        
        this.cache.set(key, value);
        this.accessCount.set(key, 1);
    }
    
    // 删除最少访问的条目
    evictLeastUsed() {
        let leastUsedKey = null;
        let minAccess = Infinity;
        
        for (const [key, access] of this.accessCount) {
            if (access < minAccess) {
                minAccess = access;
                leastUsedKey = key;
            }
        }
        
        if (leastUsedKey) {
            this.cache.delete(leastUsedKey);
            this.accessCount.delete(leastUsedKey);
        }
    }
    
    // 清除缓存
    clear() {
        this.cache.clear();
        this.accessCount.clear();
    }
    
    // 获取缓存统计
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            hitRate: this.calculateHitRate()
        };
    }
    
    calculateHitRate() {
        // 简化的命中率计算
        return this.cache.size > 0 ? 0.8 : 0; // 假设80%命中率
    }
}

// 创建全局缓存管理器
const advancedCacheManager = new AdvancedCacheManager();

// 防抖的伤害统计更新函数（已禁用实时计算）
let damageStatsUpdateTimeout;
function debouncedUpdateDamageStats() {
    
    // 清除缓存，确保使用最新的面板数据
    damageCache.clear();
    advancedCacheManager.clear();
    
    // 注意：实时计算已禁用，这里不再执行计算
}

// UI加载状态管理
function showCalculationLoading() {
    // 显示加载状态
    const loadingElement = document.getElementById('calculation-loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    // 禁用所有计算按钮
    const simulationBtn = document.getElementById('simulation-btn');
    if (simulationBtn) {
        simulationBtn.disabled = true;
        simulationBtn.textContent = '计算中...';
    }
    
    const basicInfoBtn = document.getElementById('save-panel-btn');
    if (basicInfoBtn) {
        basicInfoBtn.disabled = true;
        basicInfoBtn.innerHTML = `
            <span class="button-text">计算中...</span>
        `;
        basicInfoBtn.style.opacity = '0.6';
        basicInfoBtn.style.cursor = 'not-allowed';
    }
    
    // 显示进度条
    showProgressBar();
}

function hideCalculationLoading() {
    // 隐藏加载状态
    const loadingElement = document.getElementById('calculation-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // 启用所有计算按钮
    const simulationBtn = document.getElementById('simulation-btn');
    if (simulationBtn) {
        simulationBtn.disabled = false;
        simulationBtn.textContent = '模拟\n计算';
    }
    
    const basicInfoBtn = document.getElementById('save-panel-btn');
    if (basicInfoBtn) {
        basicInfoBtn.disabled = false;
        basicInfoBtn.innerHTML = `
            <span class="button-text">计算</span>
            <span class="keyboard-hint">
                <span class="keyboard-icon">⌨</span>
                <span class="keyboard-text">空格</span>
            </span>
        `;
        basicInfoBtn.style.opacity = '1';
        basicInfoBtn.style.cursor = 'pointer';
    }
    
    // 隐藏进度条
    hideProgressBar();
}

function showCalculationError(error) {
    console.error('计算错误:', error);
    
    // 显示错误信息
    const errorElement = document.getElementById('calculation-error');
    if (errorElement) {
        errorElement.textContent = `计算失败: ${error.message}`;
        errorElement.style.display = 'block';
        
        // 3秒后自动隐藏错误信息
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
}

// 进度条管理
function showProgressBar() {
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'block';
        updateProgressBar(0, '准备计算...');
    }
}

function hideProgressBar() {
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
}

function updateProgressBar(percentage, text) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) {
        progressBar.style.width = Math.min(100, Math.max(0, percentage)) + '%';
    }
    
    if (progressText) {
        progressText.textContent = text || `${Math.round(percentage)}%`;
    }
}

// 清空第二面板显示
function clearSecondPanelDisplay() {
    const graduationElements = [
        'trait-graduation-damage',
        'trait-graduation-external-min',
        'trait-graduation-breakbamboo-max',
        'trait-graduation-breakbamboo-min',
        'trait-graduation-breakrock-min',
        'trait-graduation-precision',
        'trait-graduation-critical',
        'trait-graduation-intent',
        'trait-graduation-jing',
        'trait-graduation-min',
        'trait-graduation-shi',
        'trait-graduation-shengbiao',
        'trait-graduation-shuangdao',
        'trait-graduation-quanwuxue',
        'trait-graduation-shouling'
    ];
    
    graduationElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = '0.00%';
            element.style.color = '#6c757d'; // 灰色表示无变化
        }
    });
}

// 获取毕业伤害值
function getGraduationDamage() {
    if (currentDamageMode === 'custom') {
        return parseFloat(document.getElementById('custom-graduation-damage')?.value) || 3138065;
    } else if (currentDamageMode === 'puwu_lao1') {
        return 2191649;
    } else if (currentDamageMode && currentDamageMode.indexOf('yangui_duanshi') !== -1) {
        return 3080124;
    } else if (currentDamageMode && currentDamageMode.indexOf('yangui_yishui') !== -1) {
        return 3018586;
    } else if (currentDamageMode && currentDamageMode.indexOf('duanshi') !== -1) {
        return 3138065;
    } else if (currentDamageMode && currentDamageMode.indexOf('yishui') !== -1) {
        return 3082418;
    } else {
        return 3138065;
    }
}

// 强制更新期望2伤害（用于调试）
function forceUpdateExpected2() {
    try {
        updateDamageStatsTable();
    } catch (error) {
        console.error('强制更新期望2伤害时发生错误:', error);
    }
}

// 暴露到全局作用域，方便调试
window.forceUpdateExpected2 = forceUpdateExpected2;

// 调试缓存键生成
function debugCacheKey(skill, panelData) {
    const cacheKey = generateCacheKey(skill, panelData);
    console.log('- 属攻穿透:', panelData.elementalPenetration);
    console.log('- 外功伤害加成:', panelData.externalDamageBonus);
    console.log('- 属攻伤害加成:', panelData.elementalDamageBonus);
    console.log('- 生成的缓存键:', cacheKey);
    return cacheKey;
}

window.debugCacheKey = debugCacheKey;

// 调试开关
let debugMode = false;
function toggleDebugMode() {
    debugMode = !debugMode;
    return debugMode;
}

window.toggleDebugMode = toggleDebugMode;
window.debugMode = debugMode;

// 排序功能已删除


