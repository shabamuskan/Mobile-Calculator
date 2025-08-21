let currentInput = '0';
let previousInput = null;
let operator = null;
let waitingForNewInput = false;
let operationString = '';

const display = document.getElementById('display');
const operationDisplay = document.getElementById('operation-display');

function updateDisplay() {
    // Format large numbers
    let displayValue = currentInput;
    if (displayValue.length > 9) {
        displayValue = parseFloat(displayValue).toExponential(3);
    }
    display.textContent = displayValue;
}

function updateOperationDisplay() {
    operationDisplay.textContent = operationString;
}

function inputNumber(num) {
    if (waitingForNewInput) {
        currentInput = num;
        waitingForNewInput = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    
    clearOperatorHighlight();
    updateDisplay();
}

function inputDecimal() {
    if (waitingForNewInput) {
        currentInput = '0.';
        waitingForNewInput = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    
    clearOperatorHighlight();
    updateDisplay();
}

function setOperator(op) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === null) {
        previousInput = inputValue;
        operationString = currentInput;
    } else if (operator && !waitingForNewInput) {
        const result = performCalculation();
        currentInput = String(result);
        previousInput = result;
        operationString += currentInput;
        updateDisplay();
    }

    // Add operator to operation string
    const opSymbol = op === '*' ? '×' : op === '/' ? '÷' : op;
    operationString += opSymbol;
    updateOperationDisplay();

    waitingForNewInput = true;
    operator = op;
    
    highlightOperator(op);
}

function calculate() {
    if (operator && previousInput !== null && !waitingForNewInput) {
        operationString += currentInput + '=';
        const result = performCalculation();
        currentInput = String(result);
        operationString += result;
        updateOperationDisplay();
        
        previousInput = null;
        operator = null;
        waitingForNewInput = true;
        clearOperatorHighlight();
        updateDisplay();
    }
}

function performCalculation() {
    const prev = previousInput;
    const current = parseFloat(currentInput);
    
    switch (operator) {
        case '+':
            return prev + current;
        case '-':
            return prev - current;
        case '*':
            return prev * current;
        case '/':
            return current !== 0 ? prev / current : 0;
        default:
            return current;
    }
}

function clearAll() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    waitingForNewInput = false;
    operationString = '';
    clearOperatorHighlight();
    updateDisplay();
    updateOperationDisplay();
}

function toggleSign() {
    if (currentInput !== '0') {
        currentInput = currentInput.startsWith('-') 
            ? currentInput.slice(1) 
            : '-' + currentInput;
        updateDisplay();
    }
}

function percentage() {
    currentInput = String(parseFloat(currentInput) / 100);
    updateDisplay();
}

function highlightOperator(op) {
    clearOperatorHighlight();
    let buttonId;
    switch (op) {
        case '+': buttonId = 'add'; break;
        case '-': buttonId = 'subtract'; break;
        case '*': buttonId = 'multiply'; break;
        case '/': buttonId = 'divide'; break;
    }
    if (buttonId) {
        document.getElementById(buttonId).classList.add('active');
    }
}

function clearOperatorHighlight() {
    document.querySelectorAll('.btn-operator').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+') {
        setOperator('+');
    } else if (key === '-') {
        setOperator('-');
    } else if (key === '*') {
        setOperator('*');
    } else if (key === '/') {
        event.preventDefault();
        setOperator('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
    } else if (key === '%') {
        percentage();
    }
});

// Initialize
updateDisplay();