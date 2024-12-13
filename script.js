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

    document.getElementById('coffeeNeeded').textContent = 
        `${coffeeNeeded.toFixed(1)} grams of ground coffee`;
    document.getElementById('waterNeeded').textContent = 
        `${waterNeeded.toFixed(0)} mL/grams of room temperature water`;
    document.getElementById('totalWeight').textContent = 
        `This brew should weigh ${totalWeight.toFixed(0)} grams on scales`;
    document.getElementById('extraction').textContent = 
        `Target extraction is ${targetExtraction.toFixed(2)}%`;
}

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
