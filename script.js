// Language definitions
const translations = {
    en: {
        title: 'Coffee Brewing Calculator',
        toggleMode: {
            toCapacity: 'Switch to Brewer Capacity Mode',
            toVolume: 'Switch to Desired Volume Mode'
        },
        labels: {
            brewVolume: 'Desired Brew Volume (L)',
            brewerCapacity: 'Brewer Capacity (L)',
            brewStrength: 'Desired Brew Strength (TDS%)',
            brewingRatio: 'Brewing Ratio',
            liquidRetained: 'Liquid Retained Ratio'
        },
        results: {
            title: 'Results',
            coffeeNeeded: 'grams of ground coffee',
            waterNeeded: 'mL/grams of room temperature water',
            totalWeight: 'This brew should weigh',
            weightUnit: 'grams on scales',
            extraction: 'Target extraction is',
            extractionUnit: '%'
        },
        extractionInfo: {
            ideal: 'Extraction between 18 to 21% is ideal',
            under: 'Below 18% is under-extracted, and likely to be sour',
            over: 'Over 21% is over-extracted, and likely to be bitter and dry'
        }
    },
    ar: {
        title: 'حاسبة تحضير القهوة',
        toggleMode: {
            toCapacity: 'التبديل إلى وضع سعة التخمير',
            toVolume: 'التبديل إلى وضع الحجم المطلوب'
        },
        labels: {
            brewVolume: 'حجم التخمير المطلوب (لتر)',
            brewerCapacity: 'سعة جهاز التخمير (لتر)',
            brewStrength: 'قوة التخمير المطلوبة (TDS%)',
            brewingRatio: 'نسبة التخمير',
            liquidRetained: 'نسبة السائل المحتجز'
        },
        results: {
            title: 'النتائج',
            coffeeNeeded: 'جرام من القهوة المطحونة',
            waterNeeded: 'مل/جرام من الماء بدرجة حرارة الغرفة',
            totalWeight: 'يجب أن يزن هذا التخمير',
            weightUnit: 'جرام على الميزان',
            extraction: 'نسبة الاستخلاص المستهدفة هي',
            extractionUnit: '%'
        },
        extractionInfo: {
            ideal: 'الاستخلاص المثالي بين 18 إلى 21%',
            under: 'أقل من 18% يعني استخلاص ضعيف، ومن المحتمل أن يكون حامضياً',
            over: 'أكثر من 21% يعني استخلاص زائد، ومن المحتمل أن يكون مراً وجافاً'
        }
    }
};

// Language state
let currentLang = 'en';

// Function to update all text content
function updateLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    
    // Update title
    document.querySelector('.calculator h1').textContent = t.title;
    
    // Update labels
    for (const [key, value] of Object.entries(t.labels)) {
        const label = document.querySelector(`label[for="${key}"]`);
        if (label) label.textContent = value;
    }
    
    // Update toggle button
    const toggleBtn = document.getElementById('toggleMode');
    toggleBtn.textContent = toggleBtn.textContent.includes('Capacity') ? 
        t.toggleMode.toCapacity : t.toggleMode.toVolume;
    
    // Update results section
    document.querySelector('.results h2').textContent = t.results.title;
    
    // Update extraction info
    const extractionInfo = document.querySelector('.extraction-info');
    extractionInfo.innerHTML = `
        <p>${t.extractionInfo.ideal}</p>
        <p>${t.extractionInfo.under}</p>
        <p>${t.extractionInfo.over}</p>
    `;
    
    // Recalculate to update result texts
    calculateRecipe(toggleMode.textContent.includes('Volume'));
}

// Modified calculateRecipe function to use translations
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

    const t = translations[currentLang];
    
    document.getElementById('coffeeNeeded').textContent = 
        `${coffeeNeeded.toFixed(1)} ${t.results.coffeeNeeded}`;
    document.getElementById('waterNeeded').textContent = 
        `${waterNeeded.toFixed(0)} ${t.results.waterNeeded}`;
    document.getElementById('totalWeight').textContent = 
        `${t.results.totalWeight} ${totalWeight.toFixed(0)} ${t.results.weightUnit}`;
    document.getElementById('extraction').textContent = 
        `${t.results.extraction} ${targetExtraction.toFixed(2)}${t.results.extractionUnit}`;
}

// Rest of the initialization code remains the same...
document.addEventListener('DOMContentLoaded', function() {
    // Previous initialization code...
    
    // Expose language switcher to window object so it can be called from outside
    window.switchCalculatorLanguage = updateLanguage;
});
