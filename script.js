// ОСНОВНАЯ ПРОБЛЕМА: функция showSlide должна правильно скрывать/показывать слайды

let currentSlide = 1;
const totalSlides = 22;
let chartInstances = {};

// Инициализация - ДОЛЖНА ВЫЗЫВАТЬСЯ ПОСЛЕ ЗАГРУЗКИ DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация...');
    
    // Сначала скроем все слайды
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Покажем первый слайд
    showSlide(1);
    
    // Настройка остального функционала
    setupKeyboardNavigation();
    loadCoinGameStats();
    
    // Инициализируем формулы
    renderMathFormulas();
    
    // Инициализируем графики
    setTimeout(() => {
        renderNormalDistributionChart();
    }, 500);
    
    console.log('Инициализация завершена');
});

// Функция отображения слайда - ИСПРАВЛЕНА
function showSlide(n) {
    console.log('Показать слайд:', n);
    
    // Проверяем границы
    if (n < 1) n = 1;
    if (n > totalSlides) n = totalSlides;
    
    // Скрываем все слайды
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.display = 'none';
        slide.classList.remove('active');
    });
    
    // Показываем нужный слайд
    const slideToShow = document.getElementById(`slide${n}`);
    if (slideToShow) {
        slideToShow.style.display = 'flex';
        slideToShow.classList.add('active');
        currentSlide = n;
        
        // Обновляем навигацию
        document.getElementById('slide-number').textContent = n;
        document.getElementById('slide-selector').value = n;
        
        console.log('Слайд', n, 'показан');
        
        // Перерисовываем графики при переходе на слайд
        if (n === 11) {
            setTimeout(() => {
                renderNormalDistributionChart();
            }, 100);
        }
    } else {
        console.error('Слайд не найден:', n);
    }
}

// Простая навигация
function nextSlide() {
    console.log('Следующий слайд');
    if (currentSlide < totalSlides) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    console.log('Предыдущий слайд');
    if (currentSlide > 1) {
        showSlide(currentSlide - 1);
    }
}

function goToSlide(n) {
    const slideNum = parseInt(n);
    if (slideNum >= 1 && slideNum <= totalSlides) {
        showSlide(slideNum);
    }
}

// Управление с клавиатуры
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
            case 'PageUp':
                prevSlide();
                break;
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT') {
                    nextSlide();
                    e.preventDefault();
                }
                break;
            case 'Home':
                showSlide(1);
                break;
            case 'End':
                showSlide(totalSlides);
                break;
        }
    });
}

// Интерактивные расчеты - ПРОСТЫЕ ФУНКЦИИ
function calculateMeanInteractive() {
    const numbers = [5, 8, 3, 9, 5];
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    document.getElementById('mean-result').innerHTML = 
        `<strong>Выборка:</strong> [${numbers.join(', ')}]<br>
         <strong>Среднее:</strong> ${mean}`;
}

function calculateMedianInteractive() {
    const numbers = [5, 8, 3, 9, 5];
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? 
        (sorted[mid-1] + sorted[mid]) / 2 : sorted[mid];
    document.getElementById('median-result').innerHTML = 
        `<strong>Выборка:</strong> [${numbers.join(', ')}]<br>
         <strong>Сортировка:</strong> [${sorted.join(', ')}]<br>
         <strong>Медиана:</strong> ${median}`;
}

function calculateModeInteractive() {
    const numbers = [5, 8, 3, 9, 5, 5];
    const freq = {};
    numbers.forEach(n => freq[n] = (freq[n] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    const mode = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
    document.getElementById('mode-result').innerHTML = 
        `<strong>Выборка:</strong> [${numbers.join(', ')}]<br>
         <strong>Мода:</strong> ${mode.join(', ')}`;
}

function calculateMinMaxInteractive() {
    const numbers = [5, 8, 3, 9, 5];
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    document.getElementById('minmax-result').innerHTML = 
        `<strong>Выборка:</strong> [${numbers.join(', ')}]<br>
         <strong>Минимум:</strong> ${min}<br>
         <strong>Максимум:</strong> ${max}`;
}

function calculateRangeInteractive() {
    const numbers = [5, 8, 3, 9, 5];
    const range = Math.max(...numbers) - Math.min(...numbers);
    document.getElementById('range-result').innerHTML = 
        `<strong>Выборка:</strong> [${numbers.join(', ')}]<br>
         <strong>Размах:</strong> ${range}`;
}

function calculateVarianceInteractive() {
    const numbers = [5, 8, 3, 9, 5];
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    document.getElementById('variance-result').innerHTML = 
        `<strong>Выборка:</strong> [${numbers.join(', ')}]<br>
         <strong>Среднее:</strong> ${mean.toFixed(2)}<br>
         <strong>Дисперсия:</strong> ${variance.toFixed(2)}`;
}

// Игра с монеткой - УПРОЩЕННАЯ ВЕРСИЯ
let coinGameStats = {
    total: 0,
    heads: 0,
    tails: 0
};

function loadCoinGameStats() {
    try {
        const savedStats = localStorage.getItem('coinGameStats');
        if (savedStats) {
            coinGameStats = JSON.parse(savedStats);
            updateCoinGameDisplay();
            updateProbability();
        }
    } catch (e) {
        console.log('Не удалось загрузить статистику игры');
    }
}

function saveCoinGameStats() {
    try {
        localStorage.setItem('coinGameStats', JSON.stringify(coinGameStats));
    } catch (e) {
        console.log('Не удалось сохранить статистику игры');
    }
}

function updateCoinGameDisplay() {
    const totalEl = document.getElementById('total-flips');
    const headsEl = document.getElementById('heads-count');
    const tailsEl = document.getElementById('tails-count');
    
    if (totalEl) totalEl.textContent = coinGameStats.total;
    if (headsEl) headsEl.textContent = coinGameStats.heads;
    if (tailsEl) tailsEl.textContent = coinGameStats.tails;
}

function updateProbability() {
    const total = coinGameStats.total;
    const heads = coinGameStats.heads;
    
    if (total > 0) {
        const probability = ((heads / total) * 100).toFixed(1);
        const heads2El = document.getElementById('heads-count2');
        const total2El = document.getElementById('total-flips2');
        const probEl = document.getElementById('probability');
        
        if (heads2El) heads2El.textContent = heads;
        if (total2El) total2El.textContent = total;
        if (probEl) probEl.textContent = probability;
    } else {
        const heads2El = document.getElementById('heads-count2');
        const total2El = document.getElementById('total-flips2');
        const probEl = document.getElementById('probability');
        
        if (heads2El) heads2El.textContent = '0';
        if (total2El) total2El.textContent = '0';
        if (probEl) probEl.textContent = '0';
    }
}

function flipCoinGame() {
    const coin = document.getElementById('coin-element');
    if (!coin) return;
    
    coin.classList.add('flipping');
    
    const isHeads = Math.random() < 0.5;
    
    setTimeout(() => {
        coinGameStats.total++;
        if (isHeads) {
            coinGameStats.heads++;
            coin.style.transform = 'rotateY(0deg)';
        } else {
            coinGameStats.tails++;
            coin.style.transform = 'rotateY(180deg)';
        }
        
        saveCoinGameStats();
        updateCoinGameDisplay();
        updateProbability();
        coin.classList.remove('flipping');
    }, 600);
}

function resetCoinStats() {
    coinGameStats = { total: 0, heads: 0, tails: 0 };
    saveCoinGameStats();
    updateCoinGameDisplay();
    updateProbability();
    const coin = document.getElementById('coin-element');
    if (coin) {
        coin.style.transform = 'rotateY(0deg)';
    }
}

// Диаграмма случайной выборки
function generateSampleChart() {
    const sampleSize = 1000;
    const minValue = 1;
    const maxValue = 100;
    
    // Генерация случайной выборки
    const sample = [];
    for (let i = 0; i < sampleSize; i++) {
        sample.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
    }
    
    // Расчет статистик
    const mean = sample.reduce((a, b) => a + b, 0) / sample.length;
    const sorted = [...sample].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 ? 
        (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2 : 
        sorted[Math.floor(sorted.length/2)];
    const variance = sample.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / sample.length;
    
    // Обновление статистик
    const meanEl = document.getElementById('chart-mean');
    const medianEl = document.getElementById('chart-median');
    const varianceEl = document.getElementById('chart-variance');
    
    if (meanEl) meanEl.textContent = mean.toFixed(2);
    if (medianEl) medianEl.textContent = median.toFixed(2);
    if (varianceEl) varianceEl.textContent = variance.toFixed(2);
    
    // Создание гистограммы
    const binCount = 10;
    const binSize = (maxValue - minValue + 1) / binCount;
    const bins = Array(binCount).fill(0);
    const binLabels = [];
    
    for (let i = 0; i < binCount; i++) {
        const start = minValue + i * binSize;
        const end = start + binSize - 1;
        binLabels.push(`${Math.floor(start)}-${Math.floor(end)}`);
    }
    
    sample.forEach(value => {
        const binIndex = Math.min(
            Math.floor((value - minValue) / binSize), 
            binCount - 1
        );
        bins[binIndex]++;
    });
    
    // Создание графика
    const canvas = document.getElementById('sample-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Уничтожаем старый график
    if (chartInstances.sampleChart) {
        chartInstances.sampleChart.destroy();
    }
    
    chartInstances.sampleChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                label: 'Количество',
                data: bins,
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Гистограмма случайной выборки (1000 элементов)',
                    font: {
                        size: 14
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Частота'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Диапазон значений'
                    }
                }
            }
        }
    });
}

// График нормального распределения
function renderNormalDistributionChart() {
    const canvas = document.getElementById('normal-distribution-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const data = [];
    for (let x = -3; x <= 3; x += 0.1) {
        data.push({
            x: x,
            y: (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x)
        });
    }
    
    if (chartInstances.normalChart) {
        chartInstances.normalChart.destroy();
    }
    
    chartInstances.normalChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Нормальное распределение',
                data: data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'f(x)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Рендеринг формул KaTeX
function renderMathFormulas() {
    if (typeof katex === 'undefined') {
        console.warn('KaTeX не загружен');
        return;
    }
    
    // Ждем немного для загрузки
    setTimeout(() => {
        try {
            // Рендерим формулы в .formula элементах
            document.querySelectorAll('.formula').forEach(el => {
                try {
                    katex.render(el.textContent.trim(), el, {
                        throwOnError: false,
                        displayMode: true
                    });
                } catch (e) {
                    console.warn('Ошибка рендеринга формулы:', e);
                }
            });
        } catch (e) {
            console.error('Ошибка в renderMathFormulas:', e);
        }
    }, 300);
}

// Экспортируем функции для отладки
window.showSlide = showSlide;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
window.flipCoinGame = flipCoinGame;
window.resetCoinStats = resetCoinStats;
window.updateProbability = updateProbability;