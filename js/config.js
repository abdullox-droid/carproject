// Telegram Config
const TELEGRAM_CONFIG = {
    BOT_TOKEN: '8501123931:AAG-vK2XIBodDtnQHdhaHv2zTRE4o3uzdTU',
    CHAT_ID: '7107217461',
    API_URL: 'https://api.telegram.org/bot'
};

// Send message to Telegram
async function sendToTelegram(message) {
    try {
        const url = `${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        if (response.ok) {
            console.log('✅ Message sent to Telegram');
            return true;
        } else {
            console.error('❌ Send error:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('❌ Connection error:', error);
        return false;
    }
}

// Format order message
function formatOrderMessage(orderData) {
    const timestamp = new Date().toLocaleString('en-US');
    return `
<b>🚗 NEW BOOKING REQUEST 🚗</b>

<b>Vehicle:</b> ${orderData.car || 'Not specified'}
<b>Price:</b> ${orderData.price || 'Not specified'} UZS
<b>Start Date:</b> ${orderData.startDate || 'Not specified'}
<b>End Date:</b> ${orderData.endDate || 'Not specified'}
<b>Location:</b> ${orderData.location || 'Not specified'}

<b>Customer Info:</b>
<b>Name:</b> ${orderData.name || 'Not specified'}
<b>Phone:</b> ${orderData.phone || 'Not specified'}
<b>Email:</b> ${orderData.email || 'Not specified'}

<b>Status:</b> ✅ Pending confirmation
<b>Time Submitted:</b> ${timestamp}
    `.trim();
}

// Save order data to localStorage
function saveOrderData(data) {
    const orders = JSON.parse(localStorage.getItem('carlink_orders') || '[]');
    orders.push({
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('carlink_orders', JSON.stringify(orders));
    
    // Also save to rentals for the profile page
    const rentals = JSON.parse(localStorage.getItem('carlink_rentals') || '[]');
    rentals.push({
        car: data.car,
        price: data.price,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location || 'Место по договоренности',
        id: Date.now()
    });
    localStorage.setItem('carlink_rentals', JSON.stringify(rentals));
    
    console.log('💾 Order saved locally');
}

// Shopping Cart Management System
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('carlink_cart') || '[]');
        this.initUI();
        console.log('🛒 Shopping Cart initialized');
    }

    add(car, price, days = 1) {
        const cleanPrice = parseInt(price.toString().replace(/\D/g, ''));
        const existingItem = this.items.find(item => item.car === car);
        
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.days = days;
        } else {
            this.items.push({
                id: Date.now(),
                car,
                price: cleanPrice,
                quantity: 1,
                days: days,
                addedAt: new Date().toISOString()
            });
        }
        
        this.save();
        this.updateUI();
        this.showNotification(`${car} добавлен в корзину`, 'success');
    }

    remove(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
        this.updateUI();
        this.showNotification('Автомобиль удалён из корзины', 'remove');
    }

    clear() {
        this.items = [];
        this.save();
        this.updateUI();
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity * item.days), 0);
    }

    save() {
        localStorage.setItem('carlink_cart', JSON.stringify(this.items));
    }

    initUI() {
        if (!document.getElementById('cartButton')) {
            const cartHTML = `
                <div id="cartContainer" style="position: fixed; top: 100px; right: 20px; z-index: 100;">
                    <button id="cartButton" style="
                        background: #c6c6c7;
                        color: #0e0e0e;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 10px;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(198, 198, 199, 0.2);
                    ">
                        🛒 Cart <span id="cartCount" style="background: #ec7c8a; color: white; padding: 2px 8px; border-radius: 50%; font-size: 12px; min-width: 20px; text-align: center;">0</span>
                    </button>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', cartHTML);
            document.getElementById('cartButton').addEventListener('click', () => this.showCartModal());
        }
    }

    updateUI() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.items.length;
        }
    }

    showCartModal() {
        const total = this.getTotal();
        const itemsHTML = this.items.map(item => `
            <div style="
                background: #252626;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-left: 3px solid #c6c6c7;
            ">
                <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 4px;">${item.car}</div>
                    <div style="font-size: 12px; color: #acabaa;">
                        ${item.price.toLocaleString()} UZS × ${item.quantity} × ${item.days} days = ${(item.price * item.quantity * item.days).toLocaleString()} UZS
                    </div>
                </div>
                <button onclick="cart.remove(${item.id})" style="
                    background: #ec7c8a;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-left: 10px;
                    transition: all 0.3s ease;
                ">✕ Remove</button>
            </div>
        `).join('');

        const modalHTML = `
            <div id="cartModal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
                animation: fadeIn 0.3s ease;
            ">
                <div style="
                    background: #0e0e0e;
                    padding: 30px;
                    border-radius: 20px;
                    max-width: 600px;
                    width: 90%;
                    border: 2px solid #c6c6c7;
                    color: #e7e5e4;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: bold;">🛒 Shopping Cart</h2>
                        <button onclick="document.getElementById('cartModal').remove()" style="
                            background: none;
                            border: none;
                            color: #e7e5e4;
                            font-size: 24px;
                            cursor: pointer;
                            padding: 0;
                            width: 30px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">✕</button>
                    </div>
                    
                    ${this.items.length === 0 ? `
                        <div style="text-align: center; padding: 40px 0; color: #acabaa;">
                            <div style="font-size: 48px; margin-bottom: 16px;">🚗</div>
                            <p style="font-size: 16px;">Your cart is empty</p>
                            <p style="font-size: 12px;">Add some amazing cars to get started!</p>
                        </div>
                    ` : `
                        <div style="margin-bottom: 20px;">
                            ${itemsHTML}
                        </div>
                        <div style="
                            background: #252626;
                            padding: 16px;
                            border-radius: 10px;
                            margin-bottom: 20px;
                            text-align: right;
                            border: 1px solid #454747;
                        ">
                            <div style="font-size: 14px; color: #acabaa; margin-bottom: 8px;">Total Cost:</div>
                            <div style="font-size: 28px; font-weight: bold; color: #c6c6c7;">
                                ${total.toLocaleString()} UZS
                            </div>
                        </div>
                        <button onclick="cart.checkout()" style="
                            width: 100%;
                            background: #c6c6c7;
                            color: #0e0e0e;
                            border: none;
                            padding: 14px;
                            border-radius: 10px;
                            font-weight: bold;
                            font-size: 16px;
                            cursor: pointer;
                            margin-bottom: 10px;
                            transition: all 0.3s ease;
                        ">
                            💳 Checkout
                        </button>
                        <button onclick="cart.clear(); document.getElementById('cartModal').remove();" style="
                            width: 100%;
                            background: transparent;
                            color: #e7e5e4;
                            border: 1px solid #252626;
                            padding: 14px;
                            border-radius: 10px;
                            font-weight: bold;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">
                            🗑️ Clear Cart
                        </button>
                    `}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    async checkout() {
        if (this.items.length === 0) {
            alert('❌ Cart is empty!');
            return;
        }

        const total = this.getTotal();
        const itemsList = this.items.map(item => 
            `• ${item.car} × ${item.quantity} for ${item.days} day(s) = ${(item.price * item.quantity * item.days).toLocaleString()} UZS`
        ).join('\n');

        const message = `
<b>🛒 CHECKOUT REQUEST - MULTIPLE ITEMS</b>

<b>📋 Order Items:</b>
${this.items.map(item => `• <b>${item.car}</b> × ${item.quantity} (${item.days} day${item.days > 1 ? 's' : ''}) = <b>${(item.price * item.quantity * item.days).toLocaleString()} UZS</b>`).join('\n')}

<b>💰 Total Amount:</b> <b>${total.toLocaleString()} UZS</b>
<b>⏰ Order Time:</b> ${new Date().toLocaleString('en-US')}

<b>Status:</b> ✅ Pending confirmation
        `.trim();

        const sent = await sendToTelegram(message);
        if (sent) {
            alert('✅ Order sent successfully! Check your Telegram for confirmation.');
            document.getElementById('cartModal')?.remove();
            this.clear();
        } else {
            alert('❌ Failed to send order. Please try again.');
        }
    }

    showNotification(message, type = 'success') {
        // Inject styles once
        if (!document.getElementById('cl-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'cl-toast-styles';
            style.textContent = `
                #cl-toast-container {
                    position: fixed;
                    bottom: 28px;
                    right: 28px;
                    z-index: 99999;
                    display: flex;
                    flex-direction: column-reverse;
                    gap: 10px;
                    pointer-events: none;
                }
                .cl-toast {
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 260px;
                    max-width: 360px;
                    padding: 14px 18px;
                    border-radius: 14px;
                    background: rgba(22, 22, 22, 0.95);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3);
                    font-family: 'Inter', sans-serif;
                    font-size: 13.5px;
                    font-weight: 500;
                    color: #f1f0ff;
                    line-height: 1.4;
                    transform: translateY(24px);
                    opacity: 0;
                    transition:
                        transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
                        opacity   0.38s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .cl-toast.show {
                    transform: translateY(0);
                    opacity: 1;
                }
                .cl-toast.hide {
                    transform: translateY(16px);
                    opacity: 0;
                    transition:
                        transform 0.3s cubic-bezier(0.4, 0, 1, 1),
                        opacity   0.28s ease;
                }
                .cl-toast-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .cl-toast-icon svg {
                    width: 16px;
                    height: 16px;
                }
                .cl-toast.success .cl-toast-icon {
                    background: rgba(255,255,255,0.08);
                }
                .cl-toast.remove .cl-toast-icon {
                    background: rgba(248,113,113,0.12);
                }
                .cl-toast-body { flex: 1; }
                .cl-toast-label {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    margin-bottom: 2px;
                    opacity: 0.45;
                }
                .cl-toast.success .cl-toast-label { color: #a5f3c0; }
                .cl-toast.remove  .cl-toast-label { color: #f87171; }
                .cl-toast-msg { color: #f1f0ff; }
                .cl-toast-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 2px;
                    border-radius: 0 0 14px 14px;
                    animation: cl-progress 3s linear forwards;
                }
                .cl-toast.success .cl-toast-progress { background: rgba(255,255,255,0.35); }
                .cl-toast.remove  .cl-toast-progress { background: rgba(248,113,113,0.5); }
                @keyframes cl-progress {
                    from { width: 100%; }
                    to   { width: 0%; }
                }
            `;
            document.head.appendChild(style);
        }

        // Container
        let container = document.getElementById('cl-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'cl-toast-container';
            document.body.appendChild(container);
        }

        // Icons
        const icons = {
            success: `<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
            remove:  `<svg viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        };

        const labels = { success: 'Добавлено', remove: 'Удалено' };

        // Build toast
        const toast = document.createElement('div');
        toast.className = `cl-toast ${type}`;
        toast.style.position = 'relative';
        toast.innerHTML = `
            <div class="cl-toast-icon">${icons[type] || icons.success}</div>
            <div class="cl-toast-body">
                <div class="cl-toast-label">${labels[type] || 'Уведомление'}</div>
                <div class="cl-toast-msg">${message}</div>
            </div>
            <div class="cl-toast-progress"></div>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('show'));
        });

        // Animate out and remove
        const DURATION = 3200;
        const timer = setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 350);
        }, DURATION);

        // Click to dismiss early
        toast.addEventListener('click', () => {
            clearTimeout(timer);
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 350);
        });
    }
}

// Global cart instance
const cart = new ShoppingCart();

// Check functionality status
function checkFunctionalityStatus() {
    const status = {
        telegram: true,
        localStorage: typeof(Storage) !== "undefined",
        scrollAnimation: true,
        shoppingCart: cart !== undefined,
        forms: [],
        timestamp: new Date().toISOString()
    };
    
    // Check forms
    const forms = document.querySelectorAll('form, button[type="submit"]');
    forms.forEach(form => {
        status.forms.push({
            id: form.id || form.className,
            exists: true,
            hasHandler: !!form.onsubmit || form.hasAttribute('onclick')
        });
    });
    
    console.log('✅ FUNCTIONALITY STATUS:', status);
    return status;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Config.js loaded and initialized');
    checkFunctionalityStatus();
});
