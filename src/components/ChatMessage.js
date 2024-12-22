import React from 'react';
//import './DailyInsights.css';

const DailyInsights = () => {
  const insights = [
    'This medication might cause drowsiness.',
    'Remember to eat before you take this med!',
    'This med does not interact well with B12!',
  ];

  return (
    <div className="daily-insights">
      <h2>Daily Insights & Reminders</h2>
      <ul>
        {insights.map((insight, index) => (
          <li key={index}>{insight}</li>
        ))}
      </ul>
    </div>
  );
};

export default DailyInsights;