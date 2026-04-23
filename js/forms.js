// Form handling and booking system

// Phone validation
function validatePhone(phone) {
    const phoneRegex = /^\+?998\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle login form
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    if (loginForm && window.location.pathname.includes('login')) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const phoneInput = loginForm.querySelector('input[type="tel"]');
            const phone = '+998' + phoneInput.value.replace(/\D/g, '').slice(-9);
            
            if (validatePhone(phone)) {
                const message = `
<b>📞 LOGIN ATTEMPT</b>

<b>Phone:</b> ${phone}
<b>Time:</b> ${new Date().toLocaleString('en-US')}
                `.trim();
                
                await sendToTelegram(message);
                alert('✅ Number accepted! Check SMS for verification code.');
                console.log('📱 Phone sent to Telegram:', phone);
            } else {
                alert('❌ Please enter a valid phone number');
            }
        });
    }

    // Add to cart button handlers
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        // Check if it's an "add to cart" button (add_circle icon or similar)
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

// Handle all reserve/booking buttons
document.addEventListener('click', async (e) => {
    const button = e.target.closest('button');
    
    if (!button) return;
    
    const buttonText = button.textContent.toLowerCase();
    const isReserveButton = buttonText.includes('reserve') || 
                            buttonText.includes('book') ||
                            buttonText.includes('view');
    
    // Skip if it's an add-to-cart button
    if (button.classList.contains('reserve-btn') || button.getAttribute('data-icon') === 'add_circle') {
        return;
    }
    
    if (isReserveButton && e.target.closest('[class*="group"], [class*="card"]')) {
        e.preventDefault();
        
        // Get car info from card
        const cardElement = e.target.closest('[class*="group"], [class*="card"], div[class*="rounded"]');
        const carName = cardElement?.querySelector('h3')?.textContent || 'Unknown car';
        const priceText = cardElement?.querySelector('[class*="font-headline"][class*="text-xl"], [class*="font-headline"][class*="text-2xl"]')?.textContent || '0';
        const price = priceText.match(/\d+[,\s\d]*/)?.[0] || 'Not specified';
        
        // Show booking modal
        showBookingModal({
            car: carName,
            price: price
        });
    }
});

// Booking Modal
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
                🚗 Book: ${carData.car}
            </h2>
            
            <div style="background: #252626; padding: 16px; border-radius: 10px; margin-bottom: 20px; border-left: 3px solid #c6c6c7;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #acabaa;">Daily Rate:</span>
                    <span style="font-weight: bold; font-size: 18px; color: #c6c6c7;">${carData.price} UZS</span>
                </div>
            </div>
            
            <form id="bookingForm" style="display: flex; flex-direction: column; gap: 12px;">
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Full Name" 
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
                    placeholder="Phone: +998 XX XXX XX XX" 
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
                    placeholder="Email Address" 
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
                    <option value="">Select Pickup Location</option>
                    <option value="Tashkent Center">Tashkent Center</option>
                    <option value="Airport">Airport Terminal</option>
                    <option value="Hotel">Hotel Delivery</option>
                    <option value="Railway Station">Railway Station</option>
                    <option value="Other">Other Location</option>
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
                ">✅ Confirm Booking</button>
            </form>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Handle booking form submission
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
        
        // Validation
        if (!validatePhone(data.phone)) {
            alert('❌ Please enter a valid phone number');
            return;
        }
        
        if (!validateEmail(data.email)) {
            alert('❌ Please enter a valid email');
            return;
        }
        
        // Send to Telegram
        const message = formatOrderMessage(data);
        const success = await sendToTelegram(message);
        
        if (success) {
            // Save locally
            saveOrderData(data);
            
            // Close modal
            document.getElementById('bookingModal').remove();
            
            // Show success
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
                <h2 style="color: #c6c6c7; margin-bottom: 10px; font-size: 28px;">✅ Success!</h2>
                <p style="color: #acabaa; margin-bottom: 20px; font-size: 16px;">Booking confirmed! We'll contact you soon.</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    padding: 12px 30px;
                    background: #c6c6c7;
                    color: #3f4041;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                ">Close</button>
            </div>
            `;
            document.body.appendChild(successModal);
            
            setTimeout(() => {
                successModal.remove();
            }, 3000);
        } else {
            alert('❌ Error sending booking. Please try again.');
        }
    });
    
    // Close on background click
    document.getElementById('bookingModal').addEventListener('click', (e) => {
        if (e.target.id === 'bookingModal') {
            e.target.remove();
        }
    });
}
