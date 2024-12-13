const resultTexts = {
    en: {
        coffee: (value) => `${value} grams of ground coffee`,
        water: (value) => `${value} mL/grams of room temperature water`,
        weight: (value) => `This brew should weigh ${value} grams on scales`,
        extraction: (value) => `Target extraction is ${value}%`
    },
    ar: {
        coffee: (value) => `${value} جرام من البن المطحون`,
        water: (value) => `${value} مل/جرام من الماء بدرجة حرارة الغرفة`,
        weight: (value) => `يجب أن يزن هذا المشروب ${value} جرام على الميزان`,
        extraction: (value) => `نسبة الاستخلاص المستهدفة هي ${value}٪`
    }
};

function calculateRecipe(isBrewerMode = false) {
    let targetBrewVolume;
    if (isBrewerMode) {
        const brewerCapacity = parseFloat(document.getElementById('brewerCapacity').value);
        targetBrewVolume = brewerCapacity;
    } else {
        targetBrewVolume = parseFloat(document.getElementById('brewVolume').value);
    }

    const brewStrength = parseFloat(document.getElementById('brewStrength').value);
    const brewingRatio = parseFloat(document.getElementById('brewingRatio').value);
    const liquidRetained = parseFloat(document.getElementById('liquidRetained').value);
    
    const volumeInMl = targetBrewVolume * 1000;
    const coffeeNeeded = volumeInMl / brewingRatio;
    const waterNeeded = volumeInMl;
    const totalWeight = waterNeeded - (coffeeNeeded * liquidRetained);
    const targetExtraction = (totalWeight / coffeeNeeded) * brewStrength;

    // Update results for both languages
    ['en', 'ar'].forEach(lang => {
        document.getElementById('coffeeNeeded').querySelector(`[data-lang="${lang}"]`).textContent = 
            resultTexts[lang].coffee(coffeeNeeded.toFixed(1));
            
        document.getElementById('waterNeeded').querySelector(`[data-lang="${lang}"]`).textContent = 
            resultTexts[lang].water(waterNeeded.toFixed(0));
            
        document.getElementById('totalWeight').querySelector(`[data-lang="${lang}"]`).textContent = 
            resultTexts[lang].weight(totalWeight.toFixed(0));
            
        document.getElementById('extraction').querySelector(`[data-lang="${lang}"]`).textContent = 
            resultTexts[lang].extraction(targetExtraction.toFixed(2));
    });
}

window.switchCalculatorLanguage = function(lang) {
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll(`[data-lang="${lang}"]`).forEach(el => {
        el.style.display = 'inline';
    });

    document.querySelector('.calculator').dir = lang === 'ar' ? 'rtl' : 'ltr';
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.stepper-input').forEach(stepper => {
        const input = stepper.querySelector('input');
        const step = parseFloat(input.getAttribute('step')) || 1;

        stepper.addEventListener('click', (e) => {
            const rect = stepper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            
            if (x < 40) {
                input.value = (parseFloat(input.value) - step).toFixed(2);
                input.dispatchEvent(new Event('input'));
            } else if (x > rect.width - 40) {
                input.value = (parseFloat(input.value) + step).toFixed(2);
                input.dispatchEvent(new Event('input'));
            }
        });
    });

    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => calculateRecipe(toggleMode.textContent.includes('Volume')));
    });

    const toggleMode = document.getElementById('toggleMode');
    toggleMode.addEventListener('click', function() {
        const volumeInput = document.getElementById('volumeInput');
        const capacityInput = document.getElementById('capacityInput');
        const isBrewerMode = toggleMode.textContent.includes('Volume');
        
        volumeInput.style.display = isBrewerMode ? 'block' : 'none';
        capacityInput.style.display = isBrewerMode ? 'none' : 'block';
        toggleMode.textContent = isBrewerMode ? 
            'Switch to Brewer Capacity Mode' : 
            'Switch to Desired Volume Mode';
        
        calculateRecipe(isBrewerMode);
    });

    calculateRecipe(false);
});

// Add message listener for language switching
window.addEventListener('message', function(event) {
    if (event.data === 'switch-to-arabic') {
        switchCalculatorLanguage('ar');
    } else if (event.data === 'switch-to-english') {
        switchCalculatorLanguage('en');
    }
});
