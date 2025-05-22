import { useState } from 'react';
import { Notyf } from 'notyf'; // Import Notyf
import 'notyf/notyf.min.css'; // Import Notyf CSS
import questions from './questions'; // Import questions from the new file
import '../index.css';

const SurveyForm = () => {
  const [answers, setAnswers] = useState(() => {
    const initialAnswers = {};
    Object.keys(questions).forEach((qId) => {
      initialAnswers[qId] = null;
    });
    return initialAnswers;
  });

  const notyf = new Notyf(); // Initialize Notyf

  const handleOptionClick = (qId, item) => {
    setAnswers({ ...answers, [qId]: item });
  };

  const handleSubmit = async () => {
    const invalidAnswers = Object.entries(answers).filter(
      ([_, value]) => value === null
    );
    if (invalidAnswers.length > 0) {
      notyf.error('Please answer all questions before submitting.');
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(answers).map(([key, value]) => [String(key), String(value)])
    );

    console.log('ANSWERS:', JSON.stringify(payload));

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/surveys/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Reset answers after successful submission
      setAnswers(() => {
        const initialAnswers = {};
        Object.keys(questions).forEach((qId) => {
          initialAnswers[qId] = null;
        });
        return initialAnswers;
      });

      notyf.success('Survey submitted successfully!');
    } catch (error) {
      console.error('Error submitting survey:', error);
      notyf.error('Failed to submit survey. Please try again.');
    }
  };

  return (
    <div className="survey-container">
      <h1>Programming Test 1</h1>
      {Object.entries(questions).map(([qId, text], index) => (
        <div key={qId} className="question">
          <p>{`${index + 1}. ${text}`}</p>
          <div className="options-container">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className={`option-label ${answers[qId] === item ? 'selected' : ''}`}
                onClick={() => handleOptionClick(qId, item)}
              >
                {['Very Inaccurate', 'Moderately Inaccurate', 'Neither Accurate Nor Inaccurate', 'Moderately Accurate', 'Very Accurate'][item - 1]}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SurveyForm;