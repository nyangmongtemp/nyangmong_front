import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerInput = ({
  selectDate,
  onSelectedDateChange,
  className = "",
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const datePickerRef = useRef(null);

  const handleImageClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  useEffect(() => {
    setSelectedDate(selectDate);
  }, [selectDate]);

  return (
    <div className={`relative ${className}`}>
      <DatePicker
        ref={datePickerRef}
        dateFormat="yy/MM/dd"
        selected={selectDate || selectedDate}
        onChange={(date) => {
          onSelectedDateChange(date);
          setSelectedDate(date);
        }}
        minDate={new Date()}
        placeholderText="날짜 선택"
        className="w-[180px] h-[40px] px-4 py-2 border border-orange-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        popperClassName="bg-white text-black border border-gray-200 rounded-lg shadow-md z-50"
      />
      <img
        className="absolute left-[150px] top-2 cursor-pointer"
        alt="달력아이콘"
        src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
        width={24}
        height={24}
        onClick={handleImageClick}
      />
    </div>
  );
};

export default DatePickerInput;
