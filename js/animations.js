// 3D анимации при скролле
class ScrollAnimations {
    constructor() {
        this.cars = [];
        this.scrollSpeed = 0;
        this.lastScrollY = 0;
        this.init();
    }

    init() {
        // Ищем все элементы с изображениями машин
        this.cars = document.querySelectorAll('[data-car-3d]');
        
        if (this.cars.length === 0) {
            // Если нет специального атрибута, ищем изображения машин в картах
            this.cars = document.querySelectorAll('[data-alt*="car"], [data-alt*="Car"], [data-alt*="automobile"], img[src*="car"]');
        }

        // Добавляем слушатель скролла
        window.addEventListener('scroll', () => this.onScroll());
        console.log(`?? Инициализирована 3D анимация для ${this.cars.length} машин`);
    }

    onScroll() {
        const currentScrollY = window.scrollY;
        this.scrollSpeed = currentScrollY - this.lastScrollY;
        this.lastScrollY = currentScrollY;

        this.cars.forEach((car, index) => {
            this.animateCar(car, index);
        });
    }

    animateCar(element, index) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Вычисляем видимость элемента
        const visibility = 1 - (rect.top / windowHeight);
        
        // Z глубина - когда элемент в центре экрана, он близко
        const zDepth = (visibility - 0.5) * 200;
        
        // Масштаб - приближение/отдаление
        const scale = 1 + (visibility * 0.3);
        
        // Rotation для эффекта приближения
        const rotateX = (1 - visibility) * 15;
        const rotateY = Math.sin(visibility * Math.PI) * 10;
        
        // Opacity
        const opacity = Math.max(0.3, Math.min(1, visibility + 0.5));

        // Применяем трансформации к родителю
        let container = element.closest('.group') || element.closest('div[class*="card"]') || element;
        
        if (container) {
            container.style.transform = `
                perspective(1200px)
                translateZ(${zDepth}px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(${scale})
            `;
            container.style.opacity = opacity;
            container.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        } else {
            element.style.transform = `
                perspective(1200px)
                translateZ(${zDepth}px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(${scale})
            `;
            element.style.opacity = opacity;
        }

        // Параллакс эффект
        const parallaxOffset = visibility * 50;
        element.style.backgroundPosition = `center calc(50% + ${parallaxOffset}px)`;
    }
}

// Инициализация анимаций при загрузке
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    console.log('? Анимации при скролле активированы');
});

// Также добавляем легкую фиксированную анимацию для карточек
document.addEventListener('DOMContentLoaded', () => {
    const cardElements = document.querySelectorAll('[class*="card"], [class*="group"]');
    
    cardElements.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
});
