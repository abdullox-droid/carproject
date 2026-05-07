// Обработка форм и система бронирования

// Валидация телефона
function validatePhone(phone) {
    const phoneRegex = /^\+?998\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Валидация email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Добавление виджета чата
function initChat() {
    const chatHTML = `
        <div id="chatWidget" class="fixed bottom-8 right-8 z-[100] transition-all duration-500 transform translate-y-20 opacity-0">
            <button onclick="toggleChat()" class="w-16 h-16 bg-primary rounded-full shadow-[0_10px_40px_rgba(198,198,199,0.4)] flex items-center justify-center text-black hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-3xl font-black">forum</span>
            </button>
            <div id="chatBox" class="absolute bottom-20 right-0 w-80 bg-surface-container-low border border-white/10 rounded-3xl shadow-2xl overflow-hidden hidden">
                <div class="bg-primary p-4 text-black flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-green-900 animate-pulse"></div>
                        <span class="font-black text-xs uppercase tracking-widest">Поддержка 24/7</span>
                    </div>
                    <button onclick="toggleChat()" class="material-symbols-outlined text-sm">close</button>
                </div>
                <div class="p-4 h-64 overflow-y-auto space-y-4 text-xs" id="chatMessages">
                    <div class="bg-white/5 p-3 rounded-2xl rounded-bl-none max-w-[80%]">Здравствуйте! Чем я могу вам помочь сегодня? 😊</div>
                </div>
                <div class="p-4 border-t border-white/5 flex gap-2">
                    <input type="text" id="chatInput" placeholder="Ваше сообщение..." class="flex-1 bg-surface-variant border-none rounded-xl text-[10px] p-3 focus:ring-primary"/>
                    <button onclick="sendMessage()" class="material-symbols-outlined text-primary">send</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    setTimeout(() => {
        const widget = document.getElementById('chatWidget');
        widget.classList.remove('translate-y-20', 'opacity-0');
    }, 1000);
}

window.toggleChat = function() {
    const box = document.getElementById('chatBox');
    box.classList.toggle('hidden');
}

window.sendMessage = function() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    
    const messages = document.getElementById('chatMessages');
    messages.innerHTML += `
        <div class="bg-primary/20 p-3 rounded-2xl rounded-br-none max-w-[80%] ml-auto text-on-surface">${msg}</div>
    `;
    input.value = '';

    // Save support message to localStorage for admin panel
    const user = JSON.parse(localStorage.getItem('carlink_user') || '{}');
    const supportMessages = JSON.parse(localStorage.getItem('carlink_support_messages') || '[]');
    supportMessages.push({
        id: Date.now(),
        user: user.username || 'Гость',
        message: msg,
        timestamp: new Date().toISOString(),
        status: 'new',
        page: window.location.pathname
    });
    localStorage.setItem('carlink_support_messages', JSON.stringify(supportMessages));
    
    setTimeout(() => {
        messages.innerHTML += `
            <div class="bg-white/5 p-3 rounded-2xl rounded-bl-none max-w-[80%]">Ваш запрос принят! Оператор ответит в ближайшее время.</div>
        `;
        document.getElementById('chatMessages').scrollTop = 9999;
    }, 1000);
}

// Мок "Наличие в реальном времени"
function initAvailabilityMock() {
    setInterval(() => {
        const badges = document.querySelectorAll('[class*="bg-green-500/10"], [class*="bg-red-500/10"]');
        if (badges.length > 0 && Math.random() > 0.95) {
            const randomBadge = badges[Math.floor(Math.random() * badges.length)];
            const isAvailable = randomBadge.textContent.includes('наличии');
            if (isAvailable) {
                randomBadge.textContent = 'Забронировано';
                randomBadge.classList.replace('bg-green-500/10', 'bg-red-500/10');
                randomBadge.classList.replace('text-green-400', 'text-red-400');
            } else {
                randomBadge.textContent = 'В наличии';
                randomBadge.classList.replace('bg-red-500/10', 'bg-green-500/10');
                randomBadge.classList.replace('text-red-400', 'text-green-400');
            }
        }
    }, 5000);
}

// Обработка формы входа
document.addEventListener('DOMContentLoaded', () => {
    initChat();
    initAvailabilityMock();

    const loginForm = document.querySelector('form');
    if (loginForm && window.location.pathname.includes('login')) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const phoneInput = loginForm.querySelector('input[type="tel"]');
            const phone = '+998' + phoneInput.value.replace(/\D/g, '').slice(-9);
            
            if (validatePhone(phone)) {
                const message = `
<b>📞 ПОПЫТКА ВХОДА</b>

<b>Телефон:</b> ${phone}
<b>Время:</b> ${new Date().toLocaleString('ru-RU')}
                `.trim();
                
                await sendToTelegram(message);
                alert('✅ Номер принят! Проверьте SMS с кодом подтверждения.');
                console.log('📱 Телефон отправлен в Telegram:', phone);
            } else {
                alert('❌ Пожалуйста, введите корректный номер телефона');
            }
        });
    }

    // Обработчики кнопок добавления в корзину
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const isAddButton = button.classList.contains('reserve-btn') || 
                           button.getAttribute('data-icon') === 'add_circle' ||
                           button.textContent.includes('add_circle');

        if (isAddButton) {
            const carName = button.getAttribute('data-car');
            const price = button.getAttribute('data-price');
            
            if (carName && price) {
                cart.add(carName, price, 1);
            }
        }
    });
});

// Обработка всех кнопок бронирования
document.addEventListener('click', async (e) => {
    const button = e.target.closest('button');
    
    if (!button) return;
    
    const buttonText = button.textContent.toLowerCase();
    const isReserveButton = buttonText.includes('забронировать') || 
                            buttonText.includes('reserve') || 
                            buttonText.includes('book');
    
    if (button.classList.contains('reserve-btn') || button.getAttribute('data-icon') === 'add_circle') {
        return;
    }
    
    if (isReserveButton && e.target.closest('[class*="group"], [class*="card"]')) {
        e.preventDefault();
        
        const cardElement = e.target.closest('[class*="group"], [class*="card"], div[class*="rounded"]');
        const carName = cardElement?.querySelector('h3')?.textContent || 'Неизвестное авто';
        const priceText = cardElement?.querySelector('[class*="font-headline"][class*="text-xl"], [class*="font-headline"][class*="text-2xl"]')?.textContent || '0';
        const price = priceText.match(/\d+[,\s\d]*/)?.[0] || 'Не указана';
        
        showBookingModal({
            car: carName,
            price: price
        });
    }
});

// Модальное окно бронирования
function showBookingModal(carData) {
    const modalHTML = `
    <div id="bookingModal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    ">
        <div style="
            background: #0e0e0e;
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            border: 1px solid #252626;
            color: #e7e5e4;
        ">
            <h2 style="margin-top: 0; margin-bottom: 20px; font-size: 24px; font-weight: bold;">
                🚗 Бронирование: ${carData.car}
            </h2>
            
            <div style="background: #252626; padding: 16px; border-radius: 10px; margin-bottom: 20px; border-left: 3px solid #c6c6c7;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #acabaa;">Цена в день:</span>
                    <span style="font-weight: bold; font-size: 18px; color: #c6c6c7;">${carData.price} UZS</span>
                </div>
            </div>
            
            <form id="bookingForm" style="display: flex; flex-direction: column; gap: 12px;">
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Полное имя" 
                    required 
                    style="
                        padding: 12px;
                        background: #252626;
                        border: 1px solid #454747;
                        border-radius: 8px;
                        color: #e7e5e4;
                        font-size: 14px;
                    "
                />
                
                <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Телефон: +998 XX XXX XX XX" 
                    required 
                    style="
                        padding: 12px;
                        background: #252626;
                        border: 1px solid #454747;
                        border-radius: 8px;
                        color: #e7e5e4;
                        font-size: 14px;
                    "
                />
                
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Электронная почта" 
                    required 
                    style="
                        padding: 12px;
                        background: #252626;
                        border: 1px solid #454747;
                        border-radius: 8px;
                        color: #e7e5e4;
                        font-size: 14px;
                    "
                />
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <input 
                        type="date" 
                        name="startDate" 
                        required 
                        style="
                            padding: 12px;
                            background: #252626;
                            border: 1px solid #454747;
                            border-radius: 8px;
                            color: #e7e5e4;
                            font-size: 14px;
                        "
                    />
                    <input 
                        type="date" 
                        name="endDate" 
                        required 
                        style="
                            padding: 12px;
                            background: #252626;
                            border: 1px solid #454747;
                            border-radius: 8px;
                            color: #e7e5e4;
                            font-size: 14px;
                        "
                    />
                </div>
                
                <select 
                    name="location" 
                    required 
                    style="
                        padding: 12px;
                        background: #252626;
                        border: 1px solid #454747;
                        border-radius: 8px;
                        color: #e7e5e4;
                        font-size: 14px;
                    "
                >
                    <option value="">Выберите место встречи</option>
                    <option value="Центр Ташкента">Центр Ташкента</option>
                    <option value="Аэропорт">Терминал Аэропорта</option>
                    <option value="Доставка в отель">Доставка в отель</option>
                    <option value="Ж/Д Вокзал">Ж/Д Вокзал</option>
                    <option value="Другое">Другое место</option>
                </select>
                
                <button type="submit" style="
                    width: 100%;
                    padding: 14px;
                    background: #c6c6c7;
                    color: #3f4041;
                    border: none;
                    border-radius: 10px;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                    text-transform: uppercase;
                    margin-top: 10px;
                    transition: all 0.3s ease;
                ">✅ Подтвердить бронь</button>
            </form>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            car: carData.car,
            price: carData.price,
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            location: formData.get('location')
        };
        
        if (!validatePhone(data.phone)) {
            alert('❌ Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        if (!validateEmail(data.email)) {
            alert('❌ Пожалуйста, введите корректный email');
            return;
        }
        
        const message = formatOrderMessage(data);
        const success = await sendToTelegram(message);
        
        if (success) {
            saveOrderData(data);
            document.getElementById('bookingModal').remove();
            
            const successModal = document.createElement('div');
            successModal.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #0e0e0e;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                border: 2px solid #c6c6c7;
                z-index: 10000;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            ">
                <h2 style="color: #c6c6c7; margin-bottom: 10px; font-size: 28px;">✅ Успешно!</h2>
                <p style="color: #acabaa; margin-bottom: 20px; font-size: 16px;">Бронирование подтверждено! Мы скоро с вами свяжемся.</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    padding: 12px 30px;
                    background: #c6c6c7;
                    color: #3f4041;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                ">Закрыть</button>
            </div>
            `;
            document.body.appendChild(successModal);
            
            setTimeout(() => {
                successModal.remove();
            }, 3000);
        } else {
            alert('❌ Ошибка при отправке. Попробуйте еще раз.');
        }
    });
    
    document.getElementById('bookingModal').addEventListener('click', (e) => {
        if (e.target.id === 'bookingModal') {
            e.target.remove();
        }
    });
}
