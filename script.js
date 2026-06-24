<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    // Adiciona evento de clique aos botões de calculadora
    document.getElementById('personalCalculatorButton').addEventListener ('click', function() {
        document.getElementById('carbonCalculator').style.display = 'block';
        document.getElementById('businessCalculator').style.display = 'none';
    });

    document.getElementById('businessCalculatorButton').addEventListener('click', function() {
        document.getElementById('carbonCalculator').style.display = 'none';
        document.getElementById('businessCalculator').style.display = 'block';
    });

    // Mostra campos específicos para o ramo selecionado
    document.getElementById('companyBranch').addEventListener('change', function() {
        const companyBranch = document.getElementById('companyBranch').value;
        const fieldsToDisplay = document.getElementById(`${companyBranch}Fields`);

        // Oculta todos os campos relacionados a ramos
        const allFields = document.querySelectorAll('.fields');
        allFields.forEach(field => {
            field.style.display = 'none';
        });

        // Oculta todos os campos específicos para os ramos
        const allBranchFields = document.querySelectorAll('#energyFields, #transportationFields, #manufacturingFields, #constructionFields, #agricultureFields, #wasteManagementFields');
        allBranchFields.forEach(field => {
            field.style.display = 'none';
        });

        if (fieldsToDisplay) {
            fieldsToDisplay.style.display = 'block';
        }

        // Limpa os resultados ao trocar de ramo
        document.getElementById('businessCarbonFootprintResult').innerHTML = '';
        document.getElementById('businessCarbonCreditsResult').innerHTML = '';
        document.getElementById('businessResult').classList.remove('show');
    });

    // Define o ramo de energia como padrão
    document.getElementById('companyBranch').value = 'energy';
    document.getElementById('energyFields').style.display = 'block';

    // Calculadora de Créditos de Carbono
    document.getElementById('calculateCarbonFootprint').addEventListener('click', function() {
        const electricity = parseFloat(document.getElementById('electricity').value);
        const gas = parseFloat(document.getElementById('gas').value);
        const car = parseFloat(document.getElementById('car').value);
        const fuelType = document.getElementById('fuelType').value;
        const enginePower = parseFloat(document.getElementById('enginePower').value);
        const flights = parseFloat(document.getElementById('flights').value);
        const meat = parseFloat(document.getElementById('meat').value);

        const carbonFootprint = calculateCarbonFootprint(electricity, gas, car, fuelType, enginePower, flights, meat);

        const carbonFootprintResultElement = document.getElementById('carbonFootprintResult');
        carbonFootprintResultElement.innerHTML = `Sua pegada de carbono é de ${carbonFootprint.toFixed(2)} toneladas de CO₂.`;

        const resultElement = document.getElementById('result');
        resultElement.classList.add('show');
    });

    document.getElementById('calculateCarbonCredits').addEventListener('click', function() {
        const electricity = parseFloat(document.getElementById('electricity').value);
        const gas = parseFloat(document.getElementById('gas').value);
        const car = parseFloat(document.getElementById('car').value);
        const fuelType = document.getElementById('fuelType').value;
        const enginePower = parseFloat(document.getElementById('enginePower').value);
        const flights = parseFloat(document.getElementById('flights').value);
        const meat = parseFloat(document.getElementById('meat').value);

        const carbonFootprint = calculateCarbonFootprint(electricity, gas, car, fuelType, enginePower, flights, meat);
        const carbonCredits = calculateCarbonCredits(carbonFootprint);

        const carbonCreditsResultElement = document.getElementById('carbonCreditsResult');
        carbonCreditsResultElement.innerHTML = `Seus créditos de carbono são de ${carbonCredits.toFixed(2)} toneladas de CO₂.`;

        const resultElement = document.getElementById('result');
        resultElement.classList.add('show');
    });

    function calculateCarbonFootprint(electricity, gas, car, fuelType, enginePower, flights, meat) {
        const electricityFactor = 0.5; // kg CO₂ por kWh
        const gasFactor = 2.0; // kg CO₂ por m³
        const carFactor = getCarFactor(fuelType, enginePower); // kg CO₂ por km
        const flightFactor = 1000; // kg CO₂ por voo de ida e volta
        const meatFactor = 50; // kg CO₂ por kg de carne

        const totalCO2 = (
            (electricity * electricityFactor) +
            (gas * gasFactor) +
            (car * carFactor) +
            (flights * flightFactor) +
            (meat * 52 * meatFactor)
        ) / 1000; // Convertendo para toneladas

        return totalCO2;
    }

    function calculateCarbonCredits(carbonFootprint) {
        // Simula o cálculo dos créditos de carbono com base na pegada de carbono
        return carbonFootprint * 0.8;
    }

    function getCarFactor(fuelType, enginePower) {
        switch (fuelType) {
            case 'gasoline':
                return 0.2 + (enginePower * 0.01); // kg CO₂ por km
            case 'diesel':
                return 0.25 + (enginePower * 0.012); // kg CO₂ por km
            case 'ethanol':
                return 0.15 + (enginePower * 0.008); // kg CO₂ por km
            default:
                return 0; // kg CO₂ por km
        }
    }

    // Calculadora de Créditos de Carbono da Empresa
    document.getElementById('calculateBusinessCarbonFootprint').addEventListener('click', function() {
        const companySize = document.getElementById('companySize').value;
        const energyConsumption = parseFloat(document.getElementById('energyConsumptionCommon').value);
        const wasteGeneration = parseFloat(document.getElementById('wasteGenerationCommon').value);
        const companyBranch = document.getElementById('companyBranch').value;

        let companyFactor = 0; // Fator de emissão de CO₂ por empresa

        switch (companySize) {
            case 'small':
                companyFactor = 1.5; // kg CO₂ por empresa
                break;
            case 'medium':
                companyFactor = 2.5; // kg CO₂ por empresa
                break;
            case 'large':
                companyFactor = 4.0; // kg CO₂ por empresa
                break;
            default:
                companyFactor = 0; // kg CO₂ por empresa
        }

        // campos específicos para cada ramo aqui
        let branchFactor = 0; // Fator de emissão de CO₂ por ramo

        switch (companyBranch) {
            case 'energy':
                branchFactor = getEnergyFactor();
                break;
            case 'transportation':
                branchFactor = getTransportationFactor();
                break;
            case 'manufacturing':
                branchFactor = getManufacturingFactor();
                break;
            case 'construction':
                branchFactor = getConstructionFactor();
                break;
            case 'agriculture':
                branchFactor = getAgricultureFactor();
                break;
            case 'wasteManagement':
                branchFactor = getWasteManagementFactor();
                break;
            default:
                branchFactor = 0; // Fator de emissão de CO₂ por ramo
        }

        const businessCarbonFootprint = calculateBusinessCarbonFootprint(energyConsumption, wasteGeneration, companyFactor, branchFactor);

        const businessCarbonFootprintResultElement = document.getElementById('businessCarbonFootprintResult');
        businessCarbonFootprintResultElement.innerHTML = `A pegada de carbono da sua empresa é de ${businessCarbonFootprint.toFixed(2)} toneladas de CO₂.`;

        const businessResultElement = document.getElementById('businessResult');
        businessResultElement.classList.add('show');
    });

    document.getElementById('calculateBusinessCarbonCredits').addEventListener('click', function() {
        const companySize = document.getElementById('companySize').value;
        const energyConsumption = parseFloat(document.getElementById('energyConsumptionCommon').value);
        const wasteGeneration = parseFloat(document.getElementById('wasteGenerationCommon').value);
        const companyBranch = document.getElementById('companyBranch').value;

        let companyFactor = 0; // Fator de emissão de CO₂ por empresa

        switch (companySize) {
            case 'small':
                companyFactor = 1.5; // kg CO₂ por empresa
                break;
            case 'medium':
                companyFactor = 2.5; // kg CO₂ por empresa
                break;
            case 'large':
                companyFactor = 4.0; // kg CO₂ por empresa
                break;
            default:
                companyFactor = 0; // kg CO₂ por empresa
        }
        let branchFactor = 0; // Fator de emissão de CO₂ por ramo

        switch (companyBranch) {
            case 'energy':
                branchFactor = getEnergyFactor();
                break;
            case 'transportation':
                branchFactor = getTransportationFactor();
                break;
            case 'manufacturing':
                branchFactor = getManufacturingFactor();
                break;
            case 'construction':
                branchFactor = getConstructionFactor();
                break;
            case 'agriculture':
                branchFactor = getAgricultureFactor();
                break;
            case 'wasteManagement':
                branchFactor = getWasteManagementFactor();
                break;
            default:
                branchFactor = 0; // Fator de emissão de CO₂ por ramo
        }

        const businessCarbonFootprint = calculateBusinessCarbonFootprint(energyConsumption, wasteGeneration, companyFactor, branchFactor);
        const businessCarbonCredits = calculateBusinessCarbonCredits(businessCarbonFootprint);

        const businessCarbonCreditsResultElement = document.getElementById('businessCarbonCreditsResult');
        businessCarbonCreditsResultElement.innerHTML = `Os créditos de carbono da sua empresa são de ${businessCarbonCredits.toFixed(2)} toneladas de CO₂.`;

        const businessResultElement = document.getElementById('businessResult');
        businessResultElement.classList.add('show');
    });

    function calculateBusinessCarbonFootprint(energyConsumption, wasteGeneration, companyFactor, branchFactor) {
        const energyFactor = 0.5; // kg CO₂ por kWh
        const wasteFactor = 0.5; // kg CO₂ por kg de resíduos

        const totalCO2 = (
            (energyConsumption * energyFactor) +
            (wasteGeneration * wasteFactor) +
            companyFactor +
            branchFactor
        ) / 1000; // Convertendo para toneladas

        return totalCO2;
    }

    function calculateBusinessCarbonCredits(carbonFootprint) {
        // Simula o cálculo dos créditos de carbono com base na pegada de carbono
        return carbonFootprint * 0.8;
    }

    // Funções para calcular fatores de emissão de CO₂ por ramo
    function getEnergyFactor() {
        const energyProduction = parseFloat(document.getElementById('energyProduction').value);
        const energyTransmission = parseFloat(document.getElementById('energyTransmission').value);
        const fuelUse = parseFloat(document.getElementById('fuelUse').value);
        const emissions = parseFloat(document.getElementById('emissions').value);

        return (energyProduction * 0.6) + (energyTransmission * 0.4) + (fuelUse * 0.2) + (emissions * 0.1); // kg CO₂ por MWh de produção e transmissão
    }

    function getTransportationFactor() {
        const vehicleFleet = parseFloat(document.getElementById('vehicleFleet').value);
        const fuelConsumption = parseFloat(document.getElementById('fuelConsumption').value);
        const emissions = parseFloat(document.getElementById('emissions').value);

        return (vehicleFleet * 0.3) + (fuelConsumption * 0.2) + (emissions * 0.1); // kg CO₂ por veículo e litros de combustível
    }

    function getManufacturingFactor() {
        const productionVolume = parseFloat(document.getElementById('productionVolume').value);
        const materialUse = parseFloat(document.getElementById('materialUse').value);
        
        return (productionVolume * 0.5) + (materialUse * 0.3); // kg CO₂ por unidade produzida e kg de materiais
    }

    function getConstructionFactor() {
        const cementUse = parseFloat(document.getElementById('cementUse').value);
        const steelUse = parseFloat(document.getElementById('steelUse').value);
        const woodUse = parseFloat(document.getElementById('woodUse').value);

        return (cementUse * 0.8) + (steelUse * 0.5) + (woodUse * 0.3); // kg CO₂ por toneladas de cimento e aço
    }

    function getAgricultureFactor() {
        const landUse = parseFloat(document.getElementById('landUse').value);
        const fertilizerUse = parseFloat(document.getElementById('fertilizerUse').value);
        const pesticideUse = parseFloat(document.getElementById('pesticideUse').value);

        return (landUse * 0.5) + (fertilizerUse * 0.2) + (pesticideUse * 0.1); // kg CO₂ por ha e kg de fertilizantes
    }

    function getWasteManagementFactor() {
        const recyclingRate = parseFloat(document.getElementById('recyclingRate').value);

        return (recyclingRate * 0.2); // kg CO₂ por % de reciclagem
    }

    // Dados para os gráficos
    const co2Data = {
        labels: ['1960', '1970', '1980', '1990', '2000', '2010', '2020'],
        datasets: [{
            label: 'Concentração de CO₂ (ppm)',
            data: [317, 325, 339, 354, 369, 389, 412],
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
        }]
    };

    const emissionsData = {
        labels: ['Energia', 'Transporte', 'Indústria', 'Agricultura', 'Edifícios', 'Outros'],
        datasets: [{
            label: 'Emissões de CO₂ (Gt)',
            data: [13.1, 8.0, 8.1, 6.0, 3.0, 1.6],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)'
            ]
        }]
    };

    // Configuração dos gráficos
    const chartConfig = {
        type: 'line',
        data: co2Data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    };

    const emissionsChartConfig = {
        type: 'pie',
        data: emissionsData,
        options: {
            responsive: true
        }
    };

    // Esconde os gráficos ao carregar a página
    document.getElementById('co2Chart').style.display = 'none';
    document.getElementById('emissionsChart').style.display = 'none';
    document.getElementById('Emissoes').style.display= 'none';

    // Adiciona evento de clique ao botão de mostrar/ocultar gráficos
    document.getElementById('toggleCharts').addEventListener('click', function() {
        const co2Chart = document.getElementById('co2Chart');
        const emissionsChart = document.getElementById('emissionsChart');

        if (co2Chart.style.display === 'none') {
            co2Chart.style.display = 'block';
            (Emissoes.style.display === 'none') 
                Emissoes.style.display = 'block';
            emissionsChart.style.display = 'block';
            this.textContent = 'Esconder Gráficos';
        } else {
            co2Chart.style.display = 'none';
            emissionsChart.style.display = 'none';
            this.textContent = 'Mostrar Gráficos';
            Emissoes.style.display = 'none';
        }
    });

    // Criação dos gráficos
    const co2Chart = new Chart(document.getElementById('co2Chart'), chartConfig);
    const emissionsChart = new Chart(document.getElementById('emissionsChart'), emissionsChartConfig);

    // Animação de scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Botão de voltar ao topo
    const scrollToTopButton = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopButton.classList.add('show');
        } else {
            scrollToTopButton.classList.remove('show');
        }
    });

    scrollToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Animação de entrada das seções
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });