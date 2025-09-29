// 指法练习模式
const practiceModes = [
    { 
        name: '基础指法', 
        keys: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
        description: '训练基础指法键位'
    },
    { 
        name: '左手训练', 
        keys: ['Q', 'W', 'E', 'R', 'T', 'A', 'S', 'D', 'F', 'G'],
        description: '训练左手灵活性'
    },
    { 
        name: '右手训练', 
        keys: ['Y', 'U', 'I', 'O', 'P', 'H', 'J', 'K', 'L', ';'],
        description: '训练右手灵活性'
    },
    { 
        name: '小指训练', 
        keys: ['Q', 'P', 'Z', 'M'],
        description: '训练小指按键技能'
    },
    { 
        name: '数字键训练', 
        keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3'],
        description: '训练数字键指法'
    }
];

// 标准QWERTY键盘布局
const keyboardLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['Space']
];

// DOM元素
const questionElement = document.getElementById('question');
const userInputElement = document.getElementById('user-input');
const keyboardElement = document.getElementById('keyboard');
const startButton = document.getElementById('start-btn');
const resetButton = document.getElementById('reset-btn');
const accuracyElement = document.getElementById('accuracy');
const keypressCountElement = document.getElementById('keypress-count');

// 练习状态
let currentQuestion = '';
let userAnswer = '';
let correctCount = 0;
let totalCount = 0;
let isPracticing = false;
let currentMode = 0; // 当前练习模式索引
let currentKeyIndex = 0; // 当前按键索引

// 初始化键盘
function initKeyboard() {
    keyboardElement.innerHTML = '';
    
    keyboardLayout.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'keyboard-row';
        
        row.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = 'key';
            keyElement.textContent = key;
            keyElement.dataset.key = key;
            
            if (key === 'Space') {
                keyElement.classList.add('space');
                keyElement.innerHTML = '空格<br>Space';
            }
            
            // 为特殊键添加特殊样式 (ASDF JKL;行)
            if ((rowIndex === 2 && ['A', 'S', 'D', 'F', 'J', 'K', 'L'].includes(key)) || 
                (key === ';')) {
                keyElement.classList.add('special');
            }
            
            rowElement.appendChild(keyElement);
        });
        
        keyboardElement.appendChild(rowElement);
    });
}

// 生成指法练习题目
function generateQuestion() {
    const mode = practiceModes[currentMode];
    // 循环使用模式中的键位
    const key = mode.keys[currentKeyIndex % mode.keys.length];
    currentKeyIndex++;
    return key;
}

// 更新题目显示
function updateQuestion() {
    currentQuestion = generateQuestion();
    questionElement.textContent = `请按 ${currentQuestion} 键`;
    userAnswer = '';
    userInputElement.textContent = '';
    highlightKey(currentQuestion);
}

// 高亮显示需要按下的键
function highlightKey(pinyin) {
    // 移除所有高亮
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('highlight');
    });
    
    // 高亮当前拼音涉及的键
    const keys = pinyin.toUpperCase().split('');
    keys.forEach(key => {
        const keyElement = document.querySelector(`.key[data-key="${key}"]`);
        if (keyElement) {
            keyElement.classList.add('highlight');
        }
    });
    
    // 特殊处理空格键
    if (pinyin === 'ü') {
        const keyElement = document.querySelector(`.key[data-key="U"]`);
        if (keyElement) {
            keyElement.classList.add('highlight');
        }
    }
}

// 更新统计信息
function updateStats() {
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    accuracyElement.textContent = `${accuracy}%`;
    keypressCountElement.textContent = totalCount;
}

// 检查答案
function checkAnswer(key) {
    totalCount++;
    if (key.toUpperCase() === currentQuestion || 
        (key === ' ' && currentQuestion === 'Space')) {
        correctCount++;
        // 显示正确反馈
        questionElement.textContent = '正确!';
        setTimeout(() => {
            updateQuestion();
        }, 500);
    } else {
        // 显示错误反馈
        questionElement.textContent = `错误! 请按 ${currentQuestion} 键`;
        setTimeout(() => {
            updateQuestion();
        }, 1000);
    }
    updateStats();
}

// 处理按键按下
function handleKeyDown(event) {
    if (!isPracticing) return;
    
    const key = event.key;
    
    // 显示按键按下效果
    let keyElement;
    if (key === ' ') {
        keyElement = document.querySelector('.key.space');
    } else {
        keyElement = document.querySelector(`.key[data-key="${key.toUpperCase()}"]`);
    }
    
    if (keyElement) {
        keyElement.classList.add('pressed');
        setTimeout(() => {
            keyElement.classList.remove('pressed');
        }, 100);
    }
    
    // 直接检查答案，无需等待完整输入
    checkAnswer(key);
}

// 开始练习
function startPractice() {
    isPracticing = true;
    startButton.disabled = true;
    currentKeyIndex = 0; // 重置键位索引
    updateQuestion();
}

// 重置练习
function resetPractice() {
    isPracticing = false;
    startButton.disabled = false;
    currentQuestion = '';
    userAnswer = '';
    correctCount = 0;
    totalCount = 0;
    currentKeyIndex = 0; // 重置键位索引
    questionElement.textContent = '选择练习模式并开始练习';
    userInputElement.textContent = '';
    updateStats();
    
    // 移除所有高亮
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('highlight');
    });
}

// 切换练习模式
function changeMode() {
    currentMode = (currentMode + 1) % practiceModes.length;
    document.getElementById('mode-name').textContent = practiceModes[currentMode].name;
    document.getElementById('mode-description').textContent = practiceModes[currentMode].description;
    
    // 如果正在练习，重置练习
    if (isPracticing) {
        currentKeyIndex = 0;
        updateQuestion();
    }
}

// 初始化
function init() {
    initKeyboard();
    updateStats();
    
    // 设置初始模式信息
    document.getElementById('mode-name').textContent = practiceModes[currentMode].name;
    document.getElementById('mode-description').textContent = practiceModes[currentMode].description;
    
    // 事件监听
    startButton.addEventListener('click', startPractice);
    resetButton.addEventListener('click', resetPractice);
    document.getElementById('mode-btn').addEventListener('click', changeMode);
    document.addEventListener('keydown', handleKeyDown);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);