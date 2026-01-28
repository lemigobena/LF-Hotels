import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles which we override in index.css

const CalendarComponent = ({ value, onChange, tileDisabled }) => {
    return (
        <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)' }}>
            <Calendar
                onChange={onChange}
                value={value}
                className="react-calendar"
                tileDisabled={tileDisabled}
                minDate={new Date()}
            />
        </div>
    );
};

export default CalendarComponent;
