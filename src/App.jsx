import { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import moment from "jalali-moment";
import axios from "axios";

function PersianCalendar({ initialDate = moment(), defaultTheme = "indigo" }) {
  const [date, setDate] = useState(initialDate);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("monthly");
  const [themeColor, setThemeColor] = useState(defaultTheme);

  // Available themes with their color codes
  const themes = {
    indigo: {
      bg: "bg-indigo-600",
      text: "text-indigo-600",
      light: "bg-indigo-100",
    },
    rose: { bg: "bg-rose-600", text: "text-rose-600", light: "bg-rose-100" },
    emerald: {
      bg: "bg-emerald-600",
      text: "text-emerald-600",
      light: "bg-emerald-100",
    },
    amber: {
      bg: "bg-amber-600",
      text: "text-amber-600",
      light: "bg-amber-100",
    },
    violet: {
      bg: "bg-violet-600",
      text: "text-violet-600",
      light: "bg-violet-100",
    },
  };

  // Fetch holidays with proper error handling and caching
  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const jalaliDate = date.format("jYYYY/jM/jD").split("/");
      const apiUrl = `/api/holidays/jalali/${jalaliDate[0]}/${jalaliDate[1]}/${jalaliDate[2]}`;

      console.log(jalaliDate);
      const response = await axios.get(apiUrl);
      console.log(response);
      if (response.data?.events) {
        setHolidays(
          Array.isArray(response.data.events) ? response.data.events : []
        );
      } else {
        setHolidays([]);
      }
    } catch (err) {
      console.error("Error fetching holidays:", err);
      setError(
        err.response?.data?.message || "مشکلی در دریافت مناسبت‌ها پیش آمده است"
      );
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchHolidays();
  }, [date, fetchHolidays]);

  const handleDateChange = useCallback((newDate) => {
    setDate(newDate.clone().startOf("day"));
  }, []);

  const changeMonth = useCallback(
    (amount) => {
      setDate((prev) =>
        prev.clone().add(amount, viewMode === "monthly" ? "jMonth" : "jYear")
      );
    },
    [viewMode]
  );

  const renderHeader = () => (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">تقویم جلالی</h1>
      <p className="text-gray-600">مناسبت‌های رسمی ایران</p>

      <div className="flex justify-center mt-4 space-x-2">
        {Object.keys(themes).map((color) => (
          <button
            key={color}
            onClick={() => setThemeColor(color)}
            className={`w-6 h-6 rounded-full ${themes[color].bg} ${
              themeColor === color ? "ring-2 ring-offset-2 ring-gray-400" : ""
            }`}
            aria-label={`تغییر تم به ${color}`}
          />
        ))}
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => changeMonth(-1)}
          className={`p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors`}
          aria-label={viewMode === "monthly" ? "ماه قبل" : "سال قبل"}
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        <button
          onClick={() => setDate(moment())}
          className={`p-2 rounded-lg ${themes[themeColor].bg} text-white hover:opacity-90 transition-opacity`}
          aria-label="برو به امروز"
        >
          امروز
        </button>

        <button
          onClick={() => changeMonth(1)}
          className={`p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors`}
          aria-label={viewMode === "monthly" ? "ماه بعد" : "سال بعد"}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <span className="text-lg font-bold text-gray-700 mx-2 min-w-[120px] text-center">
          {viewMode === "monthly"
            ? date.format("jMMMM jYYYY")
            : date.format("jYYYY")}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("monthly")}
          className={`px-4 py-2 rounded-lg ${
            viewMode === "monthly"
              ? `${themes[themeColor].bg} text-white`
              : "bg-gray-100 text-gray-700"
          } transition-colors`}
        >
          ماهانه
        </button>
        <button
          onClick={() => setViewMode("yearly")}
          className={`px-4 py-2 rounded-lg ${
            viewMode === "yearly"
              ? `${themes[themeColor].bg} text-white`
              : "bg-gray-100 text-gray-700"
          } transition-colors`}
        >
          سالانه
        </button>
      </div>
    </div>
  );

  const renderMonthlyCalendar = useMemo(() => {
    const startOfMonth = date.clone().startOf("jMonth");
    const endOfMonth = date.clone().endOf("jMonth");
    const startDay = startOfMonth.jDay();
    const daysInMonth = endOfMonth.jDate();

    const weeks = [];
    let days = [];

    // Empty days at start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 p-1"></div>);
    }

    // Month days
    for (let d = 1; d <= daysInMonth; d++) {
      const currentDate = date.clone().jDate(d);
      const isToday = currentDate.isSame(moment(), "day");
      const isSelected = currentDate.isSame(date, "day");
      const isWeekend = currentDate.jDay() === 6; // Friday in Jalali
      const dayHolidays = holidays.filter((h) =>
        moment(h.date, "jYYYY/jM/jD").isSame(currentDate, "day")
      );

      days.push(
        <div
          key={`day-${d}`}
          onClick={() => handleDateChange(currentDate)}
          className={`h-12 p-1 border border-gray-200 flex flex-col items-center justify-center cursor-pointer transition-all
            ${isToday ? "ring-2 ring-yellow-400 z-10 relative" : ""}
            ${
              isSelected
                ? `${themes[themeColor].bg} text-white`
                : "hover:bg-gray-50"
            }
            ${isWeekend ? "bg-gray-50" : ""}
          `}
        >
          <span className="text-sm font-medium">{d}</span>
          {dayHolidays.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-yellow-400 mt-1"></span>
          )}
        </div>
      );

      if (days.length === 7 || d === daysInMonth) {
        weeks.push(
          <div key={`week-${d}`} className="grid grid-cols-7 gap-0">
            {days}
          </div>
        );
        days = [];
      }
    }

    return (
      <>
        <div className="grid grid-cols-7 gap-0 text-center mb-2">
          {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day, index) => (
            <div
              key={day}
              className={`p-2 font-bold ${
                index === 6 ? themes[themeColor].text : "text-gray-600"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        {weeks}
      </>
    );
  }, [date, holidays, themeColor, handleDateChange]);

  const renderYearlyCalendar = useMemo(
    () => (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 12 }, (_, i) => {
          const monthDate = date.clone().jMonth(i);
          const isCurrentMonth = monthDate.isSame(moment(), "jMonth");

          return (
            <div
              key={i}
              onClick={() => {
                setDate(monthDate);
                setViewMode("monthly");
              }}
              className={`p-4 rounded-lg text-center cursor-pointer transition-all hover:scale-105
              ${
                date.jMonth() === i
                  ? `${themes[themeColor].bg} text-white`
                  : "bg-white shadow-sm"
              }
              ${isCurrentMonth ? "ring-2 ring-offset-2 ring-yellow-400" : ""}
            `}
            >
              <div className="text-sm">{monthDate.format("jMMMM")}</div>
            </div>
          );
        })}
      </div>
    ),
    [date, themeColor]
  );

  const renderHolidays = () => {
    if (loading) {
      return (
        <div className="space-y-4 py-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center">
              <div
                className={`h-4 w-4 rounded-full ${themes[themeColor].light} mr-2`}
              ></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-6">
          <div className="text-red-500 mb-3">
            <i className="fas fa-exclamation-circle text-xl"></i>
            <p className="mt-2">{error}</p>
          </div>
          <button
            onClick={fetchHolidays}
            className={`mt-2 px-4 py-2 rounded-lg ${themes[themeColor].bg} text-white hover:opacity-90 transition-opacity`}
          >
            <i className="fas fa-sync-alt ml-2"></i>
            تلاش مجدد
          </button>
        </div>
      );
    }

    if (holidays.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          <i className="far fa-calendar-minus text-2xl mb-2"></i>
          <p>مناسبت رسمی برای این روز ثبت نشده است</p>
        </div>
      );
    }

    return (
      <ul className="space-y-3">
        {holidays.map((event, index) => (
          <li key={index} className="flex items-start group">
            <span
              className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${themes[themeColor].bg} mr-2`}
            ></span>
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
              {event.description || event}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {renderHeader()}

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 transition-all duration-300 hover:shadow-xl">
          {renderControls()}
          <div className="mb-4 overflow-hidden">
            {viewMode === "monthly"
              ? renderMonthlyCalendar
              : renderYearlyCalendar}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-xl font-bold text-gray-800">
              {date.format("jD jMMMM jYYYY")}
            </h3>
            <span
              className={`px-3 py-1 rounded-full ${themes[themeColor].light} ${themes[themeColor].text} text-sm`}
            >
              {date.format("dddd")}
              {date.isSame(moment(), "day") && (
                <span className="mr-2">• امروز</span>
              )}
            </span>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
              <i
                className={`fas fa-calendar-day ${themes[themeColor].text} ml-2`}
              ></i>
              مناسبت‌های این روز
            </h4>
            {renderHolidays()}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-8">
          <p>تقویم رسمی ایران - داده‌های مناسبت‌ها از holidayapi.ir</p>
        </div>
      </div>
    </div>
  );
}

PersianCalendar.propTypes = {
  initialDate: PropTypes.object,
  defaultTheme: PropTypes.oneOf([
    "indigo",
    "rose",
    "emerald",
    "amber",
    "violet",
  ]),
};

export default PersianCalendar;
