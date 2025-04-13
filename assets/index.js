document.addEventListener('DOMContentLoaded', function() {
    const svgObject = document.getElementById('main-svg');
    const slider = document.getElementById('current-range');
    const hallEffectSlider = document.getElementById('hall-range');
    const dropdown = document.getElementById('effect-dropdown');

    svgObject.addEventListener('load', function() {
        setTimeout(() => { 
            const svgDoc = svgObject.contentDocument;
            if (!svgDoc) {
                console.error("SVG contentDocument is not accessible.");
                return;
            }

            // Initialize text elements
            const gaussMeterText = svgDoc.getElementById('tspan4');
            const hallEffectText = svgDoc.getElementById('tspan3');
            
            if (!gaussMeterText || !hallEffectText) {
                console.error("Required text elements not found in the SVG.");
                return;
            }

            // Set initial values
            gaussMeterText.textContent = "0.000";
            hallEffectText.textContent = "0.000";

            // Define measurement values
            const magneticFieldValues = [550, 1130, 1720, 2300, 2880, 3450, 4030, 4600, 5180, 5750];
            const hallEffectValues = [28.75, 43.13, 57.17, 71.89, 86.26, 100.64, 115.02, 129.04, 143.77];

            // Function to update Magnetic Field readings
            function updateMagneticField(sliderValue) {
                const maxSliderValue = parseFloat(slider.max);
                const minSliderValue = parseFloat(slider.min);
                const index = Math.round(((sliderValue - minSliderValue) / (maxSliderValue - minSliderValue)) * (magneticFieldValues.length - 1));
                gaussMeterText.textContent = magneticFieldValues[index].toFixed(0);
            }

            // Function to update Hall Effect readings
            function updateHallEffect(sliderValue) {
                const maxSliderValue = parseFloat(slider.max);
                const minSliderValue = parseFloat(slider.min);
                const index = Math.round(((sliderValue - minSliderValue) / (maxSliderValue - minSliderValue)) * (hallEffectValues.length - 1));
                hallEffectText.textContent = hallEffectValues[index].toFixed(2);
            }

            // Add event listener for slider
            if (slider) {
                slider.addEventListener('input', function() {
                    const sliderValue = parseFloat(this.value);
                    updateMagneticField(sliderValue);
                    updateHallEffect(sliderValue);
                });
            }

            // Handle dropdown selection to show/hide sliders
            dropdown.addEventListener('change', function() {
                if (dropdown.value === 'MagneticField') {
                    slider.style.display = 'block';
                    hallEffectSlider.style.display = 'none';
                } else if (dropdown.value === 'HallEffect') {
                    slider.style.display = 'none';
                    hallEffectSlider.style.display = 'block';
                }
            });

            // Initial visibility based on current dropdown selection
            if (dropdown.value === 'MagneticField') {
                slider.style.display = 'block';
                hallEffectSlider.style.display = 'none';
            } else if (dropdown.value === 'HallEffect') {
                slider.style.display = 'none';
                hallEffectSlider.style.display = 'block';
            }

            // Example: Change the color of an element with id 'exampleElement'
            const exampleElement = svgDoc.getElementById('exampleElement');
            if (exampleElement) {
                exampleElement.setAttribute('fill', 'red');
            }

            // Add click listeners with more interactivity
            const clickableElement = svgDoc.getElementById('your-element-id');
            if (clickableElement) {
                clickableElement.style.cursor = 'pointer';

                // Add hover effects
                clickableElement.addEventListener('mouseover', function() {
                    this.style.opacity = '0.8';
                });

                clickableElement.addEventListener('mouseout', function() {
                    this.style.opacity = '1';
                });

                // Click event with custom message
                clickableElement.addEventListener('click', function() {
                    const elementId = this.id;
                    const elementType = this.tagName;
                    alert(`Clicked ${elementType} with ID: ${elementId}`);
                });
            }
        }, 100); // Short delay to ensure loading
    });
});
