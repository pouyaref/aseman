import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from '@tofandel/react-datepicker-jalali';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiCalendar, FiInfo } from 'react-icons/fi';
import 'react-datepicker2/dist/react-datepicker2.css';

const SkyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const jalaliDate = new Date(date);
        jalaliDate.setFullYear(date.getFullYear() - 621);
        const year = jalaliDate.getFullYear();
        const month = date.getMonth() + 1;
        
        const response = await axios.get(`https://holidayapi.ir/jalali/${year}/${month}/1`);
        setHolidays(response.data.holidays || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching holidays:', error);
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [date]);

  const isHoliday = (day) => {
    return holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getDate() === day.getDate() &&
        holidayDate.getMonth() === day.getMonth() &&
        holidayDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const getHolidayInfo = (day) => {
    return holidays.find(holiday => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getDate() === day.getDate() &&
        holidayDate.getMonth() === day.getMonth() &&
        holidayDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const customRenderDay = (day) => {
    const dayDate = new Date(day);
    const isToday = new Date().toDateString() === dayDate.toDateString();
    const holiday = isHoliday(dayDate);

    return (
      <div 
        className={`relative w-8 h-8 flex items-center justify-center rounded-full 
          ${isToday ? 'bg-blue-500 text-white' : ''}
          ${holiday ? 'bg-red-100 text-red-600' : ''}
          ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
        `}
        onClick={() => {
          if (holiday) {
            setSelectedHoliday(getHolidayInfo(dayDate));
          }
        }}
      >
        {dayDate.getDate()}
        {holiday && (
          <div className="absolute top-0 right-0 w-1 h-1 bg-red-500 rounded-full"></div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`max-w-3xl mx-auto rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-blue-600'} text-white`}>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold flex items-center">
                <FiCalendar className="mr-2" /> تقویم جلالی آسمان
              </h1>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-blue-500 hover:bg-blue-400'}`}
              >
                {darkMode ? <FiSun /> : <FiMoon />}
              </button>
            </div>
            <p className="mt-2 opacity-90">تقویم رسمی ایران با نمایش تعطیلات</p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <DatePicker
                isGregorian={false}
                value={date}
                onChange={setDate}
                timePicker={false}
                className="w-full"
                renderDay={customRenderDay}
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {selectedHoliday && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-red-500`}
                  >
                    <div className="flex items-start">
                      <FiInfo className="mt-1 mr-2 text-red-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-lg">{selectedHoliday.title}</h3>
                        <p className="opacity-80">{selectedHoliday.description}</p>
                        <p className="text-sm mt-2 opacity-70">
                          {new Date(selectedHoliday.date).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
                  <h2 className={`p-4 font-bold border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    تعطیلات این ماه
                  </h2>
                  {holidays.length > 0 ? (
                    <ul>
                      {holidays.map((holiday, index) => (
                        <li 
                          key={index}
                          className={`p-4 border-b ${darkMode ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-200 hover:bg-blue-50'} cursor-pointer transition-colors`}
                          onClick={() => setSelectedHoliday(holiday)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{holiday.title}</h3>
                              <p className="text-sm opacity-70">{holiday.description}</p>
                            </div>
                            <span className="text-sm">
                              {new Date(holiday.date).toLocaleDateString('fa-IR')}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-8 text-center opacity-70">
                      تعطیلات رسمی در این ماه وجود ندارد
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className={`p-4 text-center text-sm ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            تقویم جلالی آسمان - استفاده از API holidayapi.ir
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkyCalendar;