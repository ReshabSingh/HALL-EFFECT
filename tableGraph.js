const currentValuesHE = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
const voltageValues = [28.75, 43.13, 57.17, 71.89, 86.26, 100.64, 115.02, 129.04, 143.77];

const currentValuesMagnetic = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
const magneticFieldValues = [550, 1130, 1720, 2300, 2880, 3450, 4030, 4600, 5180, 5750];

const currentValues = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

// Initialize UI elements
let slider = null;
let dropdownButton = null;
let isExperimentSelected = false;
let gaussMeterText = null;
let hallEffectText = null;

// Add these variables at the top
let currentChart = null;
const collectedData = {
    MFC: { current: [], magnetic: [] },
    HE: { current: [], voltage: [] }
};

document.addEventListener("DOMContentLoaded", () => {
  slider = document.getElementById('current-range');
  dropdownButton = document.getElementById('dropdownMenuButton');
  gaussMeterText = document.getElementById('gaussMeterReading');
  hallEffectText = document.getElementById('hallVoltageReading');

  // Disable slider initially
  if (slider) {
    slider.disabled = true;
    slider.addEventListener('input', function() {
      if (!isExperimentSelected) return;

      const sliderValue = parseFloat(this.value);
      const selectedValue = dropdownButton.getAttribute('data-value') || "MFC";

      // Display current value in SVG and update graph
      if (selectedValue === 'MFC') {
        const index = Math.round((sliderValue - this.min) / 
                     (this.max - this.min) * (currentValuesMagnetic.length - 1));
        if (index >= 0 && index < currentValuesMagnetic.length) {
          gaussMeterText.textContent = magneticFieldValues[index].toFixed(0);
          // Add point to collected data if not exists
          if (!collectedData.MFC.current.includes(currentValuesMagnetic[index])) {
            collectedData.MFC.current.push(currentValuesMagnetic[index]);
            collectedData.MFC.magnetic.push(magneticFieldValues[index]);
            updateGraph('MFC'); // Update graph with new point
          }
        }
      } else if (selectedValue === 'HE') {
        const index = Math.round((sliderValue - this.min) / 
                     (this.max - this.min) * (currentValuesHE.length - 1));
        if (index >= 0 && index < currentValuesHE.length) {
          hallEffectText.textContent = voltageValues[index].toFixed(2);
          // Add point to collected data if not exists
          if (!collectedData.HE.current.includes(currentValuesHE[index])) {
            collectedData.HE.current.push(currentValuesHE[index]);
            collectedData.HE.voltage.push(voltageValues[index]);
            updateGraph('HE'); // Update graph with new point
          }
        }
      }
    });
  } else {
    console.error("Slider element not found!");
  }

  // Set default experiment
  dropdownButton.textContent = "MFC"; // Set default value

  document.getElementById("fillTableValue").addEventListener("click", (event) => {
    event.preventDefault();

    const selectedValue = dropdownButton.getAttribute('data-value') || "MFC";

    if (selectedValue === "MFC") {
      fillTable("magneticFieldTable", currentValuesMagnetic, magneticFieldValues);
    } else if (selectedValue === "HE") {
      fillTable("hallEffectTable", currentValuesHE, voltageValues);
    }
  });

  const fillTableButton = document.getElementById("fillTableValue");
  if (fillTableButton) {
    fillTableButton.disabled = true; // Disable initially
  }

  // Update dropdown click handler
  document.querySelectorAll('.dropdown-item').forEach((item) => {
    item.addEventListener('click', function() {
      const selectedValue = this.getAttribute('data-value');
      isExperimentSelected = true;

      // Enable both slider and fill table button
      if (slider) slider.disabled = false;
      if (fillTableButton) fillTableButton.disabled = false;

      // Reset table state
      currentIndex = 0;
      collectedData.MFC = { current: [], magnetic: [] };
      collectedData.HE = { current: [], voltage: [] };

      // Clear tables
      const tables = document.querySelectorAll('#magneticFieldTable, #hallEffectTable');
      tables.forEach(table => {
        const tbody = table.getElementsByTagName('tbody')[0];
        if (tbody) {
          tbody.innerHTML = '';
        }
      });

      // Reset graph
      if (currentChart) {
        currentChart.destroy();
        currentChart = null;
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Values to plot
  const currentValues = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
  const voltageValues = [28.75, 43.13, 57.17, 71.89, 86.26, 100.64, 115.02, 129.04, 143.77];

  // Modal and canvas elements
  const graphModal = document.getElementById("graphModal");
  const plotGraphButton = document.getElementById("showGraph");
  const closeModal = document.getElementById("closeModal");
  const canvas = document.getElementById("popupGraph");

  let chart; // Store the chart instance

  // Function to show the modal
  function showModal(event) {
    event.preventDefault(); // Prevent the default button behavior
    graphModal.style.display = "block";

    if (chart) chart.destroy(); // Destroy existing chart to avoid duplicates

    // Create a new chart
    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: currentValues, // X-axis labels
        datasets: [
          {
            label: "Voltage (mV) vs Current (mA)",
            data: voltageValues,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.1, // Smooth curve
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "Current (mA)",
            },
          },
          y: {
            title: {
              display: true,
              text: "Voltage (mV)",
            },
          },
        },
      },
    });
  }

  // Function to hide the modal
  function hideModal() {
    graphModal.style.display = "none";
  }

  // Event listeners
  plotGraphButton.addEventListener("click", showModal);
  closeModal.addEventListener("click", hideModal);
});

document.addEventListener("DOMContentLoaded", () => {
  // Add dropdown item event listeners
  document.querySelectorAll('.dropdown-item').forEach((item) => {
    item.addEventListener('click', function(event) {
      event.preventDefault();
      const selectedValue = this.getAttribute('data-value');
      const dropdownButton = document.getElementById('dropdownMenuButton');
      dropdownButton.textContent = this.textContent;
      dropdownButton.setAttribute('data-value', selectedValue);

      isExperimentSelected = true;
      slider.disabled = false; // Enable slider when experiment is selected

      // Reset current state
      currentIndex = 0;
      collectedData.MFC = { current: [], magnetic: [] };
      collectedData.HE = { current: [], voltage: [] };

      // Clear tables
      const tables = document.querySelectorAll('#magneticFieldTable, #hallEffectTable');
      tables.forEach(table => {
        const tbody = table.getElementsByTagName('tbody')[0];
        if (tbody) {
          tbody.innerHTML = '';
        }
      });

      // Reset graph
      if (currentChart) {
        currentChart.destroy();
        currentChart = null;
      }

      // Rest of your dropdown logic...
    });
  });

  // Initialize canvas only if it exists
  const canvas = document.getElementById("popupGraph");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("Sample Graph", 150, 150);
  }
});

const thickness = 1e-3; // Sample thickness 
const magneticField = 0.5; // Magnetic field 
const electronCharge = 1.6e-19; // Charge of an electron 

function toggleHallEffectTable() {
  const resultsDiv = document.getElementById("results");

  // Check if the table is currently hidden
  if (resultsDiv.classList.contains("hidden")) {
    // Remove the 'hidden' class to show the table
    resultsDiv.classList.remove("hidden");

    // Populate and display the results
    let hallCoefficients = [];
    let carrierConcentrations = [];

    for (let i = 0; i < currentValues.length; i++) {
      const current = currentValues[i] / 1000; // Convert mA to A
      const voltage = voltageValues[i] / 1000; // Convert mV to V

      const hallCoefficient = (voltage * thickness) / (current * magneticField);
      hallCoefficients.push(hallCoefficient);

      const carrierConcentration = 1 / (electronCharge * hallCoefficient);
      carrierConcentrations.push(carrierConcentration);
    }

    resultsDiv.innerHTML = `
      <h3>Hall Effect Results</h3>
      <table border="1">
        <tr>
          <th>Sr No.</th>
          <th>Current (mA)</th>
          <th>Hall Voltage (mV)</th>
          <th>Hall Coefficient (R<sub>H</sub>) (m<sup>3</sup>/C)</th>
          <th>Carrier Concentration (n) (m<sup>-3</sup>)</th>
        </tr>
        ${currentValues
          .map(
            (current, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${current}</td>
            <td>${voltageValues[index]}</td>
            <td>${hallCoefficients[index].toExponential(3)}</td>
            <td>${carrierConcentrations[index].toExponential(3)}</td>
          </tr>
        `
          )
          .join("")}
      </table>
    `;
  } else {
    // Add the 'hidden' class to hide the table
    resultsDiv.classList.add("hidden");
  }
}

async function downloadPDF() {
  try {
    // Create a temporary container for all content
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.backgroundColor = 'white';
    container.style.width = '800px';
    container.style.fontFamily = 'Arial, sans-serif';

    // Add title and tables first
    container.innerHTML = `
      <h2 style="text-align: center; margin-bottom: 20px;">Hall Effect Experiment Results</h2>
      
      <h3>Magnetic Field Current Readings</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 8px;">Sr No.</th>
            <th style="border: 1px solid black; padding: 8px;">Current (mA)</th>
            <th style="border: 1px solid black; padding: 8px;">Magnetic Field (Gauss)</th>
          </tr>
        </thead>
        <tbody>
          ${currentValuesMagnetic.map((current, index) => `
            <tr>
              <td style="border: 1px solid black; padding: 8px;">${index + 1}</td>
              <td style="border: 1px solid black; padding: 8px;">${current.toFixed(1)}</td>
              <td style="border: 1px solid black; padding: 8px;">${magneticFieldValues[index]}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3>Hall Effect Readings</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 8px;">Sr No.</th>
            <th style="border: 1px solid black; padding: 8px;">Current (mA)</th>
            <th style="border: 1px solid black; padding: 8px;">Hall Voltage (mV)</th>
            <th style="border: 1px solid black; padding: 8px;">Hall Coefficient (m³/C)</th>
            <th style="border: 1px solid black; padding: 8px;">Carrier Concentration (m⁻³)</th>
          </tr>
        </thead>
        <tbody>
          ${currentValuesHE.map((current, index) => {
            const voltage = voltageValues[index];
            const hallCoefficient = (voltage / 1000 * thickness) / (current / 1000 * magneticField);
            const carrierConcentration = 1 / (electronCharge * hallCoefficient);
            return `
              <tr>
                <td style="border: 1px solid black; padding: 8px;">${index + 1}</td>
                <td style="border: 1px solid black; padding: 8px;">${current.toFixed(1)}</td>
                <td style="border: 1px solid black; padding: 8px;">${voltage.toFixed(2)}</td>
                <td style="border: 1px solid black; padding: 8px;">${hallCoefficient.toExponential(3)}</td>
                <td style="border: 1px solid black; padding: 8px;">${carrierConcentration.toExponential(3)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    // Create and add graph
    const graphContainer = document.createElement('div');
    graphContainer.style.marginTop = '20px';
    graphContainer.style.textAlign = 'center';

    const heCanvas = document.createElement('canvas');
    heCanvas.width = 800;
    heCanvas.height = 400;
    graphContainer.appendChild(heCanvas);

    // Create Hall Effect Graph
    const heChart = new Chart(heCanvas.getContext('2d'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Hall Voltage vs Current',
          data: currentValuesHE.map((current, index) => ({
            x: current,
            y: voltageValues[index]
          })),
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          showLine: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'Current (mA)' }
          },
          y: {
            title: { display: true, text: 'Hall Voltage (mV)' }
          }
        }
      }
    });

    container.appendChild(graphContainer);

    // Wait for chart to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Add container to document temporarily
    document.body.appendChild(container);

    // Initialize PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Convert content to image using html2canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    // Remove temporary container
    document.body.removeChild(container);
    heChart.destroy();

    // Add content to PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // If content is too long, add new pages
    if (pdfHeight > pdf.internal.pageSize.getHeight()) {
      let remainingHeight = pdfHeight;
      let currentPage = 1;
      const pageHeight = pdf.internal.pageSize.getHeight();

      while (remainingHeight > pageHeight) {
        pdf.addPage();
        currentPage++;
        pdf.addImage(
          imgData, 
          'JPEG', 
          0, 
          -(pageHeight * (currentPage - 1)), 
          pdfWidth, 
          pdfHeight
        );
        remainingHeight -= pageHeight;
      }
    }

    // Save PDF
    pdf.save('HallEffectExperiment.pdf');

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error details: " + error.message);
  }
}

// Sample code to draw a graph in the canvas (to simulate dynamic graph rendering)
const ctx = document.getElementById("popupGraph").getContext("2d");
ctx.fillStyle = "lightblue";
ctx.fillRect(0, 0, 400, 300); // Draw background
ctx.fillStyle = "black";
ctx.font = "16px Arial";
ctx.fillText("Sample Graph", 150, 150); // Add text for demonstration

document.querySelectorAll('.dropdown-item').forEach((item) => {
  item.addEventListener('click', function (event) {
    event.preventDefault();

    const selectedValue = this.getAttribute('data-value');
    const dropdownButton = document.getElementById('dropdownMenuButton');
    const objectElement = document.getElementById('main-svg');

    // Update dropdown button label
    dropdownButton.textContent = this.textContent;

    // ✅ Update the SVG source based on the selected value
    if (selectedValue === 'MFC') {
      objectElement.setAttribute('data', 'assets/Hall_Effect_1.svg');
    } else if (selectedValue === 'HE') {
      objectElement.setAttribute('data', 'assets/Hall_Effect_2.svg');
    }

    // ✅ Show/Hide .hallEffect elements
    if (selectedValue === 'MFC') {
      document.querySelectorAll('.hallEffect').forEach(el => el.style.display = "none");
    } else {
      document.querySelectorAll('.hallEffect').forEach(el => el.style.display = "");
    }

    // ✅ Toggle between tables if you have them
    const magneticFieldTable = document.getElementById('magneticFieldTable');
    const hallEffectTable = document.getElementById('hallEffectTable');

    if (magneticFieldTable && hallEffectTable) {
      if (selectedValue === 'MFC') {
        magneticFieldTable.style.display = 'table';
        hallEffectTable.style.display = 'none';
      } else if (selectedValue === 'HE') {
        magneticFieldTable.style.display = 'none';
        hallEffectTable.style.display = 'table';
      }
    }
  });
});

// Add these at the top with other variables
const addedValues = {
    MFC: new Set(),
    HE: new Set()
};

// Add these new functions for table and graph updates
function updateMFCTableAndGraph(sliderValue) {
    const index = Math.floor(sliderValue - 1);
    if (index < 0 || index >= currentValuesMagnetic.length) return;

    // Update table
    const table = document.getElementById("magneticFieldTable");
    const tbody = table.getElementsByTagName('tbody')[0];
    
    // Check if row already exists
    let row = tbody.children[index];
    if (!row) {
        row = tbody.insertRow(-1);
        row.innerHTML = `
            <td class="table-input">${index + 1}</td>
            <td class="table-input">${currentValuesMagnetic[index].toFixed(1)}</td>
            <td class="table-input">${magneticFieldValues[index]}</td>
        `;
    }

    // Store data for graph
    if (!collectedData.MFC.current.includes(currentValuesMagnetic[index])) {
        collectedData.MFC.current.push(currentValuesMagnetic[index]);
        collectedData.MFC.magnetic.push(magneticFieldValues[index]);
    }

    // Update graph
    updateGraph('MFC');
}

function updateHETableAndGraph(sliderValue) {
    const index = Math.floor(sliderValue - 1);
    if (index < 0 || index >= currentValuesHE.length) return;

    // Calculate Hall Effect parameters
    const hallCoefficient = (voltageValues[index] / 1000 * thickness) / 
                          (currentValuesHE[index] / 1000 * magneticField);
    const carrierConcentration = 1 / (electronCharge * hallCoefficient);

    // Update table
    const table = document.getElementById("hallEffectTable");
    const tbody = table.getElementsByTagName('tbody')[0];
    
    // Check if row already exists
    let row = tbody.children[index];
    if (!row) {
        row = tbody.insertRow(-1);
        row.innerHTML = `
            <td class="table-input">${index + 1}</td>
            <td class="table-input">${currentValuesHE[index].toFixed(1)}</td>
            <td class="table-input">${voltageValues[index].toFixed(2)}</td>
            <td class="table-input">${hallCoefficient.toExponential(3)}</td>
            <td class="table-input">${carrierConcentration.toExponential(3)}</td>
        `;
    }

    // Store data for graph
    if (!collectedData.HE.current.includes(currentValuesHE[index])) {
        collectedData.HE.current.push(currentValuesHE[index]);
        collectedData.HE.voltage.push(voltageValues[index]);
    }

    // Update graph
    updateGraph('HE');
}

function updateGraph(type) {
    const canvas = document.getElementById("popupGraph");
    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (currentChart) {
        currentChart.destroy();
    }

    // Create new chart based on experiment type
    if (type === 'MFC') {
        currentChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Magnetic Field vs Current',
                    data: collectedData.MFC.current.map((current, index) => ({
                        x: current,
                        y: collectedData.MFC.magnetic[index]
                    })),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    showLine: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                animation: false, // Disable animation for immediate updates
                scales: {
                    x: {
                        title: { display: true, text: 'Current (mA)' }
                    },
                    y: {
                        title: { display: true, text: 'Magnetic Field (Gauss)' }
                    }
                }
            }
        });
    } else if (type === 'HE') {
        currentChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Hall Voltage vs Current',
                    data: collectedData.HE.current.map((current, index) => ({
                        x: current,
                        y: collectedData.HE.voltage[index]
                    })),
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    showLine: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                animation: false, // Disable animation for immediate updates
                scales: {
                    x: {
                        title: { display: true, text: 'Current (mA)' }
                    },
                    y: {
                        title: { display: true, text: 'Hall Voltage (mV)' }
                    }
                }
            }
        });
    }
}

function fillTable(tableId, currentList, secondaryList) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Table with id ${tableId} not found`);
        return;
    }

    // Get current slider value and calculate index
    const sliderValue = parseFloat(slider.value);
    const index = Math.round((sliderValue - slider.min) / 
                 (slider.max - slider.min) * (currentList.length - 1));

    // Validate index
    if (index < 0 || index >= currentList.length) return;

    const experimentType = tableId === 'magneticFieldTable' ? 'MFC' : 'HE';
    
    // Check if this value has already been added
    if (addedValues[experimentType].has(index)) {
        console.warn('This value has already been added to the table');
        return;
    }

    // Add the current index to tracking set
    addedValues[experimentType].add(index);

    // Get tbody and update table
    let tbody = table.getElementsByTagName('tbody')[0];
    if (!tbody) {
        tbody = document.createElement('tbody');
        table.appendChild(tbody);
    }

    if (experimentType === 'MFC') {
        updateMFCRow(index);
    } else {
        updateHERow(index);
    }

    // Update graph with current data points
    updateGraph(experimentType);

    // Check if all values have been added
    if (addedValues[experimentType].size === currentList.length) {
        document.getElementById("fillTableValue").disabled = true;
    }
}

// Add reset functionality when switching experiments
document.querySelectorAll('.dropdown-item').forEach((item) => {
    item.addEventListener('click', function() {
        // Clear collected data
        collectedData.MFC = { current: [], magnetic: [] };
        collectedData.HE = { current: [], voltage: [] };
        
        // Clear tables
        const tables = document.querySelectorAll('#magneticFieldTable, #hallEffectTable');
        tables.forEach(table => {
            const rows = table.getElementsByTagName('tr');
            while (rows.length > 1) {
                table.deleteRow(1);
            }
        });

        // Reset graph
        if (currentChart) {
            currentChart.destroy();
            currentChart = null;
        }

        // Reset tracking sets
        addedValues.MFC.clear();
        addedValues.HE.clear();
    });
});

// Add this at the top with other variables
let currentIndex = 0;

function updateMFCRow(index) {
    const table = document.getElementById("magneticFieldTable");
    const tbody = table.getElementsByTagName('tbody')[0];
    
    // Insert row at the end instead of specific index
    let row = tbody.insertRow(-1);
    
    row.innerHTML = `
        <td class="table-input">${index + 1}</td>
        <td class="table-input">${currentValuesMagnetic[index].toFixed(1)}</td>
        <td class="table-input">${magneticFieldValues[index]}</td>
    `;

    // Update collected data if not already present
    if (!collectedData.MFC.current.includes(currentValuesMagnetic[index])) {
        collectedData.MFC.current.push(currentValuesMagnetic[index]);
        collectedData.MFC.magnetic.push(magneticFieldValues[index]);
    }
}

function updateHERow(index) {
    const table = document.getElementById("hallEffectTable");
    const tbody = table.getElementsByTagName('tbody')[0];
    
    const hallCoefficient = (voltageValues[index] / 1000 * thickness) / 
                          (currentValuesHE[index] / 1000 * magneticField);
    const carrierConcentration = 1 / (electronCharge * hallCoefficient);
    
    // Insert row at the end
    let row = tbody.insertRow(-1);
    
    row.innerHTML = `
        <td class="table-input">${index + 1}</td>
        <td class="table-input">${currentValuesHE[index].toFixed(1)}</td>
        <td class="table-input">${voltageValues[index].toFixed(2)}</td>
        <td class="table-input">${hallCoefficient.toExponential(3)}</td>
        <td class="table-input">${carrierConcentration.toExponential(3)}</td>
    `;

    // Update collected data if not already present
    if (!collectedData.HE.current.includes(currentValuesHE[index])) {
        collectedData.HE.current.push(currentValuesHE[index]);
        collectedData.HE.voltage.push(voltageValues[index]);
    }
}


