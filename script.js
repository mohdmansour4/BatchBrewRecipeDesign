// Result text templates for both languages
const resultTexts = {
    en: {
        coffee: (value) => `${value} grams of ground coffee`,
        water: (value) => `${value} mL/grams of room temperature water`,
        weight: (value) => `This brew should weigh ${value} grams on scales`,
        extraction: (value) => `Target extraction is ${value}%`,
        invalidInput: "Please enter valid values",
        outOfRange: "Value out of allowed range",
        reset: "Calculator reset to default values"
    },
    ar: {
        coffee: (value) => `${value} جرام من البن `,
        water: (value) => `${value} مل/جرام من الماء بدرجة حرارة الغرفة`,
        weight: (value) => `يجب ان يكون وزن القهوة ${value} جرام على الميزان`,
        extraction: (value) => `نسبة الاستخلاص المستهدفة هي ${value}٪`,
        invalidInput: "الرجاء إدخال قيم صحيحة",
        outOfRange: "القيمة خارج النطاق المسموح به",
        reset: "تمت إعادة تعيين الحاسبة إلى القيم الافتراضية"
    }
};

let currentLang = 'en';

// Default values for the calculator
const defaultValues = {
    brewVolume: "2",
    brewStrength: "1.40",
    brewingRatio: "16.5",
    liquidRetained: "2.3"
};

// Format numbers to prevent excessive decimals
function formatNumber(value, step) {
    return step === 1 ? Math.round(value) : Number(value.toFixed(2));
}

// Show toast notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

// Reset calculator to default values
function resetCalculator() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = defaultValues[input.id] || '';
        input.closest('.stepper-input').classList.remove('invalid');
    });
    calculateRecipe();
    localStorage.removeItem('coffeeCalculatorValues');
    showToast(resultTexts[currentLang].reset);
}

// Validate input values
function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    if (isNaN(value) || value < min || (max && value > max)) {
        input.closest('.stepper-input').classList.add('invalid');
        showToast(resultTexts[currentLang].outOfRange);
        return false;
    }
    input.closest('.stepper-input').classList.remove('invalid');
    return true;
}

// Save calculator state
function saveValues() {
    const values = {};
    document.querySelectorAll('input[type="number"]').forEach(input => {
        values[input.id] = input.value;
    });
    localStorage.setItem('coffeeCalculatorValues', JSON.stringify(values));
}

// Load saved values
function loadSavedValues() {
    const saved = localStorage.getItem('coffeeCalculatorValues');
    if (saved) {
        const values = JSON.parse(saved);
        Object.entries(values).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) {
                const step = parseFloat(input.getAttribute('step')) || 1;
                input.value = formatNumber(parseFloat(value), step);
                validateInput(input);
            }
        });
    } else {
        // Load default values if no saved values exist
        Object.entries(defaultValues).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input) input.value = value;
        });
    }
    calculateRecipe();
}

// Main calculation function
function calculateRecipe() {
    const brewVolume = parseFloat(document.getElementById('brewVolume').value);
    const brewStrength = parseFloat(document.getElementById('brewStrength').value);
    const brewingRatio = parseFloat(document.getElementById('brewingRatio').value);
    const liquidRetained = parseFloat(document.getElementById('liquidRetained').value);

    // Validate all inputs
    const inputs = ['brewVolume', 'brewStrength', 'brewingRatio', 'liquidRetained'];
    if (inputs.some(id => !validateInput(document.getElementById(id)))) {
        showToast(resultTexts[currentLang].invalidInput);
        return;
    }
    
    // Calculate results
    const volumeInMl = brewVolume * 1000;
    const coffeeNeeded = formatNumber(volumeInMl / brewingRatio, 0.1);
    const waterNeeded = formatNumber(volumeInMl, 1);
    const totalWeight = formatNumber(waterNeeded - (coffeeNeeded * liquidRetained), 1);
    const targetExtraction = formatNumber((totalWeight / coffeeNeeded) * brewStrength, 0.01);

    // Update results for both languages
    ['en', 'ar'].forEach(lang => {
        // Update coffee needed
        document.getElementById('coffeeNeeded').querySelector(`[data-lang="${lang}"]`).textContent = 
            resultTexts[lang].coffee(coffeeNeeded);
            
        // Update water needed
        document.getElementById('waterNeeded').querySelector(`[data-lang="${lang}"]`).textContent = 
            resultTexts[lang].water(waterNeeded);
            
        // Update total weight
        document.getElementById('totalWeight').querySelector(`[data-lang="${lang}"]`).textContent = 
            resultTexts[lang].weight(totalWeight);
            
        // Update extraction with color
        const extractionElement = document.getElementById('extraction').querySelector(`[data-lang="${lang}"]`);
        extractionElement.textContent = resultTexts[lang].extraction(targetExtraction);
        
        // Add appropriate color class based on extraction value
        extractionElement.classList.remove('optimal', 'sub-optimal');
        extractionElement.classList.add(
            targetExtraction >= 18 && targetExtraction <= 21 ? 'optimal' : 'sub-optimal'
        );
    });

    saveValues();
}

// Setup stepper buttons
function setupStepperButtons() {
    document.querySelectorAll('.stepper-input').forEach(stepper => {
        const input = stepper.querySelector('input');
        const minusBtn = stepper.querySelector('.stepper-btn.minus');
        const plusBtn = stepper.querySelector('.stepper-btn.plus');
        
        [minusBtn, plusBtn].forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const step = parseFloat(input.getAttribute('step')) || 1;
                const currentValue = parseFloat(input.value || 0);
                const isPlus = btn.classList.contains('plus');
                
                let newValue = isPlus ? currentValue + step : currentValue - step;
                if (!input.max || newValue <= parseFloat(input.max)) {
                    if (!input.min || newValue >= parseFloat(input.min)) {
                        input.value = formatNumber(newValue, step);
                        input.dispatchEvent(new Event('input'));
                        validateInput(input);
                    }
                }
            });
        });
    });
}

// Language switching
window.switchCalculatorLanguage = function(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll(`[data-lang="${lang}"]`).forEach(el => {
        el.style.display = 'inline';
    });

    document.querySelector('.calculator').dir = lang === 'ar' ? 'rtl' : 'ltr';
};

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
    setupStepperButtons();
    loadSavedValues();

    // Setup input listeners
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', calculateRecipe);
    });
});

// Listen for language switch commands
window.addEventListener('message', function(event) {
    if (event.data === 'switch-to-arabic') {
        switchCalculatorLanguage('ar');
    } else if (event.data === 'switch-to-english') {
        switchCalculatorLanguage('en');
    }
});
