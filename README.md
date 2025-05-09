<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بررسی تعطیلات رسمی ایران | Persian Holiday Checker</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .holiday-card {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .language-switcher {
            transition: all 0.3s ease;
        }
    </style>
</head>
<body class="bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <header class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">بررسی تعطیلات رسمی ایران</h1>
            <h2 class="text-xl text-gray-600 mb-4">Persian Holiday Checker</h2>
            <div class="flex justify-center space-x-4">
                <button id="lang-fa" class="language-switcher px-4 py-2 bg-blue-600 text-white rounded-full shadow-md">فارسی</button>
                <button id="lang-en" class="language-switcher px-4 py-2 bg-gray-200 text-gray-700 rounded-full">English</button>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
            <!-- Date Selector -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-700 mb-3 lang-fa">انتخاب تاریخ</h3>
                <h3 class="text-lg font-semibold text-gray-700 mb-3 lang-en hidden">Select Date</h3>
                
                <div class="grid grid-cols-3 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 lang-fa">سال</label>
                        <label class="block text-sm font-medium text-gray-700 mb-1 lang-en hidden">Year</label>
                        <input type="number" id="year" min="1300" max="1500" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                               value="1403">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 lang-fa">ماه</label>
                        <label class="block text-sm font-medium text-gray-700 mb-1 lang-en hidden">Month</label>
                        <input type="number" id="month" min="1" max="12" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                               value="7">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 lang-fa">روز</label>
                        <label class="block text-sm font-medium text-gray-700 mb-1 lang-en hidden">Day</label>
                        <input type="number" id="day" min="1" max="31" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                               value="12">
                    </div>
                </div>
            </div>

            <!-- Check Button -->
            <button id="check-btn" 
                    class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-md shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300 mb-6 lang-fa">
                بررسی تعطیلی
            </button>
            <button id="check-btn-en" 
                    class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-md shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300 mb-6 lang-en hidden">
                Check Holiday
            </button>

            <!-- Results -->
            <div id="results" class="hidden">
                <div class="border-t pt-4">
                    <h4 class="text-lg font-semibold text-gray-800 mb-2 lang-fa">نتایج بررسی</h4>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2 lang-en hidden">Results</h4>
                    
                    <div id="holiday-status" class="mb-4">
                        <p class="lang-fa">تاریخ <span id="display-date" class="font-medium"></span>:</p>
                        <p class="lang-en hidden">Date <span id="display-date-en" class="font-medium"></span>:</p>
                        <span id="is-holiday" class="text-xl font-bold"></span>
                    </div>

                    <div id="events-container" class="space-y-3 hidden">
                        <h5 class="font-medium text-gray-700 lang-fa">مناسبت‌ها:</h5>
                        <h5 class="font-medium text-gray-700 lang-en hidden">Events:</h5>
                        <div id="events-list" class="space-y-2"></div>
                    </div>
                </div>
            </div>

            <!-- Loading -->
            <div id="loading" class="hidden text-center py-4">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p class="mt-2 text-gray-600 lang-fa">در حال بررسی...</p>
                <p class="mt-2 text-gray-600 lang-en hidden">Checking...</p>
            </div>

            <!-- Error -->
            <div id="error" class="hidden p-3 bg-red-100 border-l-4 border-red-500 text-red-700 mb-4 rounded">
                <p id="error-message"></p>
            </div>
        </main>

        <!-- Footer -->
        <footer class="mt-8 text-center text-gray-600 text-sm">
            <p class="lang-fa">این پروژه از API عمومی <a href="https://holidayapi.ir" class="text-blue-600 hover:underline">HolidayAPI.ir</a> استفاده می‌کند</p>
            <p class="lang-en hidden">This project uses public API from <a href="https://holidayapi.ir" class="text-blue-600 hover:underline">HolidayAPI.ir</a></p>
            <p class="mt-2">© 2023 - توسعه داده شده با ❤️</p>
        </footer>
    </div>

    <script>
        // Language Switching
        document.getElementById('lang-fa').addEventListener('click', () => {
            document.querySelectorAll('.lang-fa').forEach(el => el.classList.remove('hidden'));
            document.querySelectorAll('.lang-en').forEach(el => el.classList.add('hidden'));
            document.getElementById('lang-fa').classList.add('bg-blue-600', 'text-white');
            document.getElementById('lang-fa').classList.remove('bg-gray-200', 'text-gray-700');
            document.getElementById('lang-en').classList.add('bg-gray-200', 'text-gray-700');
            document.getElementById('lang-en').classList.remove('bg-blue-600', 'text-white');
        });

        document.getElementById('lang-en').addEventListener('click', () => {
            document.querySelectorAll('.lang-en').forEach(el => el.classList.remove('hidden'));
            document.querySelectorAll('.lang-fa').forEach(el => el.classList.add('hidden'));
            document.getElementById('lang-en').classList.add('bg-blue-600', 'text-white');
            document.getElementById('lang-en').classList.remove('bg-gray-200', 'text-gray-700');
            document.getElementById('lang-fa').classList.add('bg-gray-200', 'text-gray-700');
            document.getElementById('lang-fa').classList.remove('bg-blue-600', 'text-white');
        });

        // Holiday Check Function
        async function checkHoliday() {
            const year = document.getElementById('year').value;
            const month = document.getElementById('month').value;
            const day = document.getElementById('day').value;
            
            // Validate input
            if (!year || !month || !day) {
                showError('لطفا تمام فیلدها را پر کنید', 'Please fill all fields');
                return;
            }

            // Show loading
            document.getElementById('loading').classList.remove('hidden');
            document.getElementById('results').classList.add('hidden');
            document.getElementById('error').classList.add('hidden');

            try {
                // Use CORS proxy if needed
                const apiUrl = `https://holidayapi.ir/jalali/${year}/${month}/${day}`;
                // Alternative with proxy: 
                // const apiUrl = `https://cors-anywhere.herokuapp.com/https://holidayapi.ir/jalali/${year}/${month}/${day}`;
                
                const response = await fetch(apiUrl, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('خطا در دریافت اطلاعات از سرور | Server error');
                }

                const data = await response.json();
                displayResults(data, year, month, day);
            } catch (error) {
                showError(error.message, error.message);
                // Fallback mock data
                const mockData = {
                    is_holiday: Math.random() > 0.7,
                    events: [
                        {
                            description: "نمونه رویداد تستی (داده واقعی دریافت نشد) | Sample event (real data not received)",
                            additional_description: new Date().toLocaleDateString('en-US'),
                            is_holiday: false,
                            is_religious: false
                        }
                    ]
                };
                displayResults(mockData, year, month, day);
            } finally {
                document.getElementById('loading').classList.add('hidden');
            }
        }

        function displayResults(data, year, month, day) {
            // Display date
            document.getElementById('display-date').textContent = `${year}/${month}/${day}`;
            document.getElementById('display-date-en').textContent = `${year}/${month}/${day}`;
            
            // Display holiday status
            const holidayStatus = document.getElementById('is-holiday');
            if (data.is_holiday) {
                holidayStatus.textContent = 'تعطیل رسمی است | Official Holiday';
                holidayStatus.className = 'text-xl font-bold text-green-600';
            } else {
                holidayStatus.textContent = 'تعطیل نیست | Not Holiday';
                holidayStatus.className = 'text-xl font-bold text-gray-600';
            }
            
            // Display events if available
            const eventsContainer = document.getElementById('events-container');
            const eventsList = document.getElementById('events-list');
            eventsList.innerHTML = '';
            
            if (data.events && data.events.length > 0) {
                data.events.forEach(event => {
                    const eventElement = document.createElement('div');
                    eventElement.className = 'p-3 bg-gray-50 rounded-md border border-gray-200 holiday-card';
                    
                    const descElement = document.createElement('p');
                    descElement.textContent = event.description;
                    eventElement.appendChild(descElement);
                    
                    if (event.additional_description) {
                        const dateElement = document.createElement('p');
                        dateElement.className = 'text-sm text-gray-500 mt-1';
                        dateElement.textContent = event.additional_description;
                        eventElement.appendChild(dateElement);
                    }
                    
                    eventsList.appendChild(eventElement);
                });
                eventsContainer.classList.remove('hidden');
            } else {
                eventsContainer.classList.add('hidden');
            }
            
            document.getElementById('results').classList.remove('hidden');
        }

        function showError(faMessage, enMessage) {
            document.getElementById('error-message').innerHTML = `
                <span class="lang-fa">${faMessage}</span>
                <span class="lang-en hidden">${enMessage}</span>
            `;
            document.getElementById('error').classList.remove('hidden');
        }

        // Event Listeners
        document.getElementById('check-btn').addEventListener('click', checkHoliday);
        document.getElementById('check-btn-en').addEventListener('click', checkHoliday);
    </script>
</body>
</html>
