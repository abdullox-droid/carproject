// Общая база данных автомобилей CarLink
// Используется на всех страницах: home, catalog, car-details, map

const CARS_DB = [
    {
        id: 1,
        name: "Tesla Model 3",
        type: "Electric",
        typeRu: "Электро",
        price: 1500000,
        priceHour: 150000,
        transmission: "Automatic",
        image: "https://cdn.pixabay.com/photo/2021/01/15/16/49/tesla-5919764_1280.jpg",
        gallery: [
            "https://cdn.pixabay.com/photo/2021/01/15/16/49/tesla-5919764_1280.jpg",
            "https://cdn.pixabay.com/photo/2018/02/21/03/15/tesla-model-x-3169357_1280.jpg",
            "https://cdn.pixabay.com/photo/2019/10/30/03/33/tesla-4588894_1280.jpg"
        ],
        status: "В наличии",
        statusEn: "available",
        rating: 4.9,
        reviews: 128,
        city: "Tashkent",
        cityRu: "Ташкент",
        year: 2023,
        hp: "450 л.с.",
        fuel: "Электро",
        deposit: 3000000,
        description: "Полностью электрический седан с автопилотом. Разгон 0-100 за 3.1 секунды. Запас хода 600 км.",
        owner: { name: "Тимур А.", rating: 4.95, reviews: 89, responseTime: "10 мин", verified: true },
        lat: 41.311081,
        lng: 69.240562
    },
    {
        id: 2,
        name: "Mercedes C-Class AMG",
        type: "Sedan",
        typeRu: "Седан",
        price: 2200000,
        priceHour: 220000,
        transmission: "Automatic",
        image: "https://cdn.pixabay.com/photo/2016/12/03/18/57/car-1880381_1280.jpg",
        gallery: [
            "https://cdn.pixabay.com/photo/2016/12/03/18/57/car-1880381_1280.jpg",
            "https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2178220_1280.jpg",
            "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg"
        ],
        status: "В наличии",
        statusEn: "available",
        rating: 5.0,
        reviews: 215,
        city: "Tashkent",
        cityRu: "Ташкент",
        year: 2023,
        hp: "421 л.с.",
        fuel: "Бензин",
        deposit: 5000000,
        description: "Спортивный седан AMG с двойным турбонаддувом. Максимальный комфорт и динамика.",
        owner: { name: "Джамшид К.", rating: 4.98, reviews: 215, responseTime: "5 мин", verified: true },
        lat: 41.315081,
        lng: 69.245562
    },
    {
        id: 3,
        name: "BMW M5 Competition",
        type: "Sport",
        typeRu: "Спорт",
        price: 4500000,
        priceHour: 450000,
        transmission: "Automatic",
        image: "https://cdn.pixabay.com/photo/2016/09/01/15/06/car-1636013_1280.jpg",
        gallery: [
            "https://cdn.pixabay.com/photo/2016/09/01/15/06/car-1636013_1280.jpg",
            "https://cdn.pixabay.com/photo/2015/09/02/12/25/bmw-918408_1280.jpg",
            "https://cdn.pixabay.com/photo/2017/12/14/21/20/bmw-3018770_1280.jpg"
        ],
        status: "В наличии",
        statusEn: "available",
        rating: 5.0,
        reviews: 93,
        city: "Tashkent",
        cityRu: "Ташкент",
        year: 2024,
        hp: "625 л.с.",
        fuel: "Бензин",
        deposit: 8000000,
        description: "Самый мощный седан BMW. Гоночные технологии в повседневном использовании.",
        owner: { name: "Рустам В.", rating: 4.92, reviews: 67, responseTime: "15 мин", verified: true },
        lat: 41.305081,
        lng: 69.235562
    },
    {
        id: 4,
        name: "Audi Q8 S-Line",
        type: "SUV",
        typeRu: "Внедорожник",
        price: 3100000,
        priceHour: 310000,
        transmission: "Automatic",
        image: "https://cdn.pixabay.com/photo/2019/04/21/15/14/audi-4145038_1280.jpg",
        gallery: [
            "https://cdn.pixabay.com/photo/2019/04/21/15/14/audi-4145038_1280.jpg",
            "https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2178220_1280.jpg",
            "https://cdn.pixabay.com/photo/2016/11/22/23/38/black-1851122_1280.jpg"
        ],
        status: "В наличии",
        statusEn: "available",
        rating: 4.8,
        reviews: 54,
        city: "Bukhara",
        cityRu: "Бухара",
        year: 2023,
        hp: "340 л.с.",
        fuel: "Дизель",
        deposit: 6000000,
        description: "Премиальный кроссовер с полным приводом Quattro. Идеален для поездок по горным дорогам.",
        owner: { name: "Камила Р.", rating: 4.87, reviews: 41, responseTime: "20 мин", verified: true },
        lat: 41.321081,
        lng: 69.250562
    },
    {
        id: 5,
        name: "Porsche Taycan Turbo S",
        type: "Electric",
        typeRu: "Электро",
        price: 4500000,
        priceHour: 450000,
        transmission: "Automatic",
        image: "https://cdn.pixabay.com/photo/2020/09/06/07/37/car-5548242_1280.jpg",
        gallery: [
            "https://cdn.pixabay.com/photo/2020/09/06/07/37/car-5548242_1280.jpg",
            "https://cdn.pixabay.com/photo/2019/07/07/14/03/fiat-4322521_1280.jpg",
            "https://cdn.pixabay.com/photo/2016/11/22/23/38/black-1851122_1280.jpg"
        ],
        status: "В наличии",
        statusEn: "available",
        rating: 4.9,
        reviews: 178,
        city: "Tashkent",
        cityRu: "Ташкент",
        year: 2024,
        hp: "750 л.с.",
        fuel: "Электро",
        deposit: 10000000,
        description: "Идеальное состояние, полная зарядка перед подачей. Спортивная подвеска и премиальная акустика Burmester.",
        owner: { name: "Джамшид К.", rating: 4.98, reviews: 215, responseTime: "5 мин", verified: true },
        lat: 41.318081,
        lng: 69.248562
    },
    {
        id: 6,
        name: "Toyota Corolla GR",
        type: "Sedan",
        typeRu: "Седан",
        price: 800000,
        priceHour: 80000,
        transmission: "Manual",
        image: "https://cdn.pixabay.com/photo/2012/11/02/13/02/car-63930_1280.jpg",
        gallery: [
            "https://cdn.pixabay.com/photo/2012/11/02/13/02/car-63930_1280.jpg",
            "https://cdn.pixabay.com/photo/2016/11/22/23/38/black-1851122_1280.jpg",
            "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg"
        ],
        status: "В наличии",
        statusEn: "available",
        rating: 4.6,
        reviews: 312,
        city: "Samarkand",
        cityRu: "Самарканд",
        year: 2021,
        hp: "300 л.с.",
        fuel: "Бензин",
        deposit: 2000000,
        description: "Спортивная версия надежной Toyota. Отлично подходит для города и междугородних поездок.",
        owner: { name: "Бобур М.", rating: 4.75, reviews: 156, responseTime: "30 мин", verified: true },
        lat: 39.654587,
        lng: 66.959822
    },
    {
        id: 7,
        name: "Range Rover Sport",
        type: "SUV",
        typeRu: "Внедорожник",
        price: 3500000,
        priceHour: 350000,
        transmission: "Automatic",
        image: "https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2178220_1280.jpg",
        gallery: [
            "https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2178220_1280.jpg",
            "https://cdn.pixabay.com/photo/2016/11/22/23/38/black-1851122_1280.jpg",
            "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg"
        ],
        status: "Забронировано",
        statusEn: "booked",
        rating: 4.7,
        reviews: 88,
        city: "Samarkand",
        cityRu: "Самарканд",
        year: 2022,
        hp: "395 л.с.",
        fuel: "Дизель",
        deposit: 7000000,
        description: "Роскошный внедорожник для любых дорог. Полный привод и воздушная подвеска.",
        owner: { name: "Нодир Х.", rating: 4.88, reviews: 73, responseTime: "8 мин", verified: true },
        lat: 39.660000,
        lng: 66.970000
    },
    {
        id: 8,
        name: "Lamborghini Urus",
        type: "Sport",
        typeRu: "Спорт",
        price: 8000000,
        priceHour: 800000,
        transmission: "Automatic",
        image: "https://cdn.pixabay.com/photo/2019/04/21/15/14/audi-4145038_1280.jpg",
        gallery: [
            "https://cdn.pixabay.com/photo/2019/04/21/15/14/audi-4145038_1280.jpg",
            "https://cdn.pixabay.com/photo/2016/09/01/15/06/car-1636013_1280.jpg",
            "https://cdn.pixabay.com/photo/2020/09/06/07/37/car-5548242_1280.jpg"
        ],
        status: "В наличии",
        statusEn: "available",
        rating: 5.0,
        reviews: 42,
        city: "Tashkent",
        cityRu: "Ташкент",
        year: 2024,
        hp: "650 л.с.",
        fuel: "Бензин",
        deposit: 15000000,
        description: "Суперкар в формате SUV. Непревзойденная динамика и роскошь итальянского производства.",
        owner: { name: "Алишер К.", rating: 5.0, reviews: 42, responseTime: "3 мин", verified: true },
        lat: 41.312081,
        lng: 69.242562
    }
];

// Популярные авто для главной страницы (первые 3)
const FEATURED_CARS = CARS_DB.filter(c => [1, 2, 3].includes(c.id));

// Получить авто по ID
function getCarById(id) {
    return CARS_DB.find(car => car.id === parseInt(id));
}

// Получить авто по городу
function getCarsByCity(city) {
    if (city === 'all') return CARS_DB;
    return CARS_DB.filter(car => car.city === city);
}
