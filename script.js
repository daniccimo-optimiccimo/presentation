// ============= ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =============
let currentSlide = 1;
const totalSlides = 22;
let chartInstances = {};

// ============= НАВИГАЦИЯ ПО СЛАЙДАМ =============
function showSlide(n) {
    console.log('Показываем слайд:', n);
    
    // Проверка границ
    if (n < 1) n = 1;
    if (n > totalSlides) n = totalSlides;
    
    // Скрываем все слайды
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
        slide.style.display = 'none';
    });
    
    // Показываем нужный слайд
    const activeSlide = document.getElementById(`slide${n}`);
    if (activeSlide) {
        activeSlide.classList.add('active');
        activeSlide.style.display = 'flex';
        currentSlide = n;
        
        // Обновляем навигацию
        const slideNumber = document.getElementById('slide-number');
        if (slideNumber) {
            slideNumber.textContent = `${currentSlide}/${totalSlides}`;
        }
        
        const selector = document.getElementById('slide-selector');
        if (selector) {
            selector.value = currentSlide;
        }
        
        // Перерисовываем графики при необходимости
        if (n === 11) {
            setTimeout(() => renderNormalDistributionChart(), 200);
        }
        if (n === 17) {
            setTimeout(() => generateSampleChart(), 200);
        }
    } else {
        console.error('Слайд не найден:', n);
    }
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        showSlide(currentSlide - 1);
    }
}

function goToSlide(value) {
    const slideNum = parseInt(value);
    if (slideNum >= 1 && slideNum <= totalSlides) {
        showSlide(slideNum);
    }
}

// ============= ИНТЕРАКТИВНЫЕ РАСЧЕТЫ =============
// Слайд 4: Выборочная средняя
function calculateMeanInteractive() {
    const numbers = [5, 8, 3, 9, 5];
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const resultBox = document.getElementById('mean-result');
    if (resultBox) {
        resultBox.innerHTML = `
            <strong>Выборка:</strong> [${numbers.join(', ')}]<br>
            <strong>Среднее арифметическое:</strong> ${mean.toFixed(2)}<br>
            <strong>Формула:</strong> (5 + 8 + 3 + 9 + 5) / 5 = ${mean}
        `;
        resultBox.style.backgroundColor = '#d4edda';
    }
}

// Слайд 5: Медиана
function calculateMedianInteractive() {
    const numbers = [5, 8, 3, 9, 5];
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? 
        (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    
    const resultBox = document.getElementById('median-result');
    if (resultBox) {
        resultBox.innerHTML = `
            <strong>Выборка:</strong> [${numbers.join(', ')}]<br>
            <strong>Отсортированная:</strong> [${sorted.join(', ')}]<br>
            <strong>Медиана:</strong> ${median}
        `;
        resultBox.style.backgroundColor = '#d4edda';
    }
}

// Слайд 6: Мода
function calculateModeInteractive() {
    const numbers = [5, 8, 3, 9, 5, 5];
    const freq = {};
    numbers.forEach(n => freq[n] = (freq[n] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
    
    const resultBox = document.getElementById('mode-result');
    if (resultBox) {
        resultBox.innerHTML = `
            <strong>Выборка:</strong> [${numbers.join(', ')}]<br>
            <strong>Частоты:</strong> ${Object.entries(freq).map(([k, v]) => `${k}→${v}`).join(', ')}<br>
            <strong>Мода:</strong> ${modes.join(', ')} (встречается ${maxFreq} раз)
        `;
        resultBox.style.backgroundColor = '#d4edda';
    }
}

// Слайд 7: Минимум и максимум
function calculateMinMaxInteractive() {
    const numbers = [5, 8, 3, 9, 5];
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    
    const resultBox = document.getElementById('minmax-result');
    if (resultBox) {
        resultBox.innerHTML = `
            <strong>Выборка:</strong> [${numbers.join(', ')}]<br>
            <strong>Минимум:</strong> ${min}<br>
            <strong>Максимум:</strong> ${max}
        `;
        resultBox.style.backgroundColor = '#d4edda';
    }
}

// Слайд 8: Размах
function calculateRangeInteractive() {
    const numbers = [5, 8, 3, 9, 5];
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const range = max - min;
    
    const resultBox = document.getElementById('range-result');
    if (resultBox) {
        resultBox.innerHTML = `
            <strong>Выборка:</strong> [${numbers.join(', ')}]<br>
            <strong>Максимум:</strong> ${max}<br>
            <strong>Минимум:</strong> ${min}<br>
            <strong>Размах:</strong> ${max} - ${min} = ${range}
        `;
        resultBox.style.backgroundColor = '#d4edda';
    }
}

// Слайд 9: Дисперсия
function calculateVarianceInteractive() {
    const numbers = [5, 8, 3, 9, 5];
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
    
    const resultBox = document.getElementById('variance-result');
    if (resultBox) {
        resultBox.innerHTML = `
            <strong>Выборка:</strong> [${numbers.join(', ')}]<br>
            <strong>Среднее (x̄):</strong> ${mean.toFixed(2)}<br>
            <strong>Квадраты отклонений:</strong> [${squaredDiffs.map(d => d.toFixed(2)).join(', ')}]<br>
            <strong>Дисперсия:</strong> ${variance.toFixed(2)}
        `;
        resultBox.style.backgroundColor = '#d4edda';
    }
}

// ============= ИГРА С МОНЕТКОЙ =============
let coinStats = {
    heads: 0,
    tails: 0,
    total: 0
};

// Загружаем статистику при старте
function loadCoinStats() {
    try {
        const saved = localStorage.getItem('coinStats');
        if (saved) {
            coinStats = JSON.parse(saved);
            updateCoinDisplay();
        }
    } catch (e) {
        console.log('Не удалось загрузить статистику');
    }
}

// Сохраняем статистику
function saveCoinStats() {
    try {
        localStorage.setItem('coinStats', JSON.stringify(coinStats));
    } catch (e) {
        console.log('Не удалось сохранить статистику');
    }
}

function flipCoinGame() {
    const coin = document.querySelector('.coin');
    if (!coin) return;
    
    // Защита от множественных кликов
    if (coin.classList.contains('flipping')) return;
    
    coin.classList.add('flipping');
    
    // Определяем результат
    const isHeads = Math.random() < 0.5;
    
    setTimeout(() => {
        coin.classList.remove('flipping');
        
        // Обновляем статистику
        coinStats.total++;
        if (isHeads) {
            coinStats.heads++;
            coin.style.transform = 'rotateY(0deg)';
        } else {
            coinStats.tails++;
            coin.style.transform = 'rotateY(180deg)';
        }
        
        // Сохраняем и обновляем отображение
        saveCoinStats();
        updateCoinDisplay();
        
        // Показываем результат
        const lastResult = document.getElementById('last-result');
        if (lastResult) {
            lastResult.textContent = isHeads ? 'ОРЁЛ' : 'РЕШКА';
        }
        
    }, 600);
}

function updateCoinDisplay() {
    // Обновляем счетчики
    const totalEl = document.getElementById('total-flips');
    const headsEl = document.getElementById('heads-count');
    const tailsEl = document.getElementById('tails-count');
    const heads2El = document.getElementById('heads-count2');
    const total2El = document.getElementById('total-flips2');
    const probEl = document.getElementById('probability');
    
    if (totalEl) totalEl.textContent = coinStats.total;
    if (headsEl) headsEl.textContent = coinStats.heads;
    if (tailsEl) tailsEl.textContent = coinStats.tails;
    
    // Обновляем вероятности
    if (heads2El) heads2El.textContent = coinStats.heads;
    if (total2El) total2El.textContent = coinStats.total;
    
    if (probEl && coinStats.total > 0) {
        const prob = (coinStats.heads / coinStats.total * 100).toFixed(1);
        probEl.textContent = prob + '%';
    } else if (probEl) {
        probEl.textContent = '0%';
    }
}

function resetCoinStats() {
    coinStats = { heads: 0, tails: 0, total: 0 };
    saveCoinStats();
    updateCoinDisplay();
    
    const lastResult = document.getElementById('last-result');
    if (lastResult) {
        lastResult.textContent = '-';
    }
    
    const coin = document.querySelector('.coin');
    if (coin) {
        coin.style.transform = 'rotateY(0deg)';
    }
}

// ============= ГРАФИКИ =============
function renderNormalDistributionChart() {
    const canvas = document.getElementById('normal-distribution-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Генерируем данные для нормального распределения
    const data = [];
    for (let x = -3; x <= 3; x += 0.1) {
        data.push({
            x: x,
            y: (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x)
        });
    }
    
    // Уничтожаем старый график
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
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { 
                    display: true, 
                    text: 'График плотности нормального распределения',
                    font: { size: 14 }
                }
            },
            scales: {
                x: { 
                    title: { display: true, text: 'x (σ)' },
                    grid: { color: 'rgba(0,0,0,0.1)' }
                },
                y: { 
                    title: { display: true, text: 'f(x)' },
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.1)' }
                }
            }
        }
    });
}

function generateSampleChart() {
    const canvas = document.getElementById('sample-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const sampleSize = 1000;
    
    // Генерируем выборку
    const sample = [];
    for (let i = 0; i < sampleSize; i++) {
        sample.push(Math.floor(Math.random() * 100) + 1);
    }
    
    // Строим гистограмму
    const bins = Array(10).fill(0);
    sample.forEach(val => {
        const binIndex = Math.floor((val - 1) / 10);
        if (binIndex >= 0 && binIndex < 10) bins[binIndex]++;
    });
    
    const labels = ['1-10', '11-20', '21-30', '31-40', '41-50', 
                    '51-60', '61-70', '71-80', '81-90', '91-100'];
    
    // Вычисляем статистики
    const mean = sample.reduce((a, b) => a + b, 0) / sample.length;
    const sorted = [...sample].sort((a, b) => a - b);
    const median = sorted[Math.floor(sample.length / 2)];
    const variance = sample.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / sample.length;
    
    // Обновляем статистики
    const meanEl = document.getElementById('chart-mean');
    const medianEl = document.getElementById('chart-median');
    const varianceEl = document.getElementById('chart-variance');
    
    if (meanEl) meanEl.textContent = mean.toFixed(2);
    if (medianEl) medianEl.textContent = median.toFixed(2);
    if (varianceEl) varianceEl.textContent = variance.toFixed(2);
    
    // Уничтожаем старый график
    if (chartInstances.sampleChart) {
        chartInstances.sampleChart.destroy();
    }
    
    chartInstances.sampleChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Частота',
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
                legend: { display: false },
                title: { 
                    display: true, 
                    text: 'Гистограмма случайной выборки (1000 элементов)',
                    font: { size: 14 }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    title: { display: true, text: 'Количество' }
                }
            }
        }
    });
}

// ============= ФОРМУЛЫ =============
function renderMathFormulas() {
    if (typeof katex === 'undefined') {
        console.warn('KaTeX не загружен');
        setTimeout(renderMathFormulas, 500);
        return;
    }
    
    document.querySelectorAll('.formula').forEach(el => {
        const formula = el.textContent.trim();
        if (formula) {
            try {
                katex.render(formula, el, {
                    throwOnError: false,
                    displayMode: true
                });
            } catch (e) {
                console.warn('Ошибка рендеринга:', formula);
                el.innerHTML = `<code>${formula}</code>`;
            }
        }
    });
}

// ============= ИНИЦИАЛИЗАЦИЯ =============
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация презентации...');
    
    // Показываем первый слайд
    showSlide(1);
    
    // Настройка навигации
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Заполняем выпадающий список
    const selector = document.getElementById('slide-selector');
    if (selector) {
        selector.innerHTML = '';
        for (let i = 1; i <= totalSlides; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Слайд ${i}`;
            selector.appendChild(option);
        }
        selector.addEventListener('change', (e) => goToSlide(e.target.value));
    }
    
    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            prevSlide();
        }
    });
    
    // Загружаем статистику монетки
    loadCoinStats();
    updateCoinDisplay();
    
    // Добавляем last-result если его нет
    if (!document.getElementById('last-result')) {
        const coinSection = document.querySelector('.game-section');
        if (coinSection) {
            const resultDiv = document.createElement('div');
            resultDiv.id = 'last-result';
            resultDiv.className = 'probability-box';
            resultDiv.textContent = '-';
            resultDiv.style.marginTop = '10px';
            resultDiv.style.textAlign = 'center';
            resultDiv.style.fontWeight = 'bold';
            coinSection.appendChild(resultDiv);
        }
    }
    
    // Рендерим формулы через небольшую задержку
    setTimeout(renderMathFormulas, 300);
    
    // Инициализируем графики
    setTimeout(() => {
        renderNormalDistributionChart();
        generateSampleChart();
    }, 500);
    
    console.log('Инициализация завершена');
});

// Делаем функции глобальными
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
window.calculateMeanInteractive = calculateMeanInteractive;
window.calculateMedianInteractive = calculateMedianInteractive;
window.calculateModeInteractive = calculateModeInteractive;
window.calculateMinMaxInteractive = calculateMinMaxInteractive;
window.calculateRangeInteractive = calculateRangeInteractive;
window.calculateVarianceInteractive = calculateVarianceInteractive;
window.flipCoinGame = flipCoinGame;
window.resetCoinStats = resetCoinStats;
window.generateSampleChart = generateSampleChart;
