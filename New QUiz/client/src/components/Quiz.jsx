import React, { useState } from 'react';
import Question from './Question';
import ProgressBar from './ProgressBar';
import MetadataForm from './MetadataForm';
import LoadingSpinner from './LoadingSpinner';
import questions from '../data/questions';
import { submitQuiz } from '../utils/api';

const Quiz = ({ onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    websiteUrl: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = (optionId) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionId;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    // If we're on the last question and have an answer, show the metadata form
    if (currentQuestionIndex === questions.length - 1) {
      setShowMetadataForm(true);
    } else {
      // Otherwise, go to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (showMetadataForm) {
      setShowMetadataForm(false);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    if (!formData.websiteUrl.trim()) {
      errors.websiteUrl = 'Website URL is required';
    } else if (!/^https?:\/\/.+\..+/.test(formData.websiteUrl)) {
      errors.websiteUrl = 'Please enter a valid URL (e.g., https://example.com)';
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare quiz data with answers mapped to their corresponding questions
      const quizData = {
        metadata: formData,
        answers: answers.map((answer, index) => ({
          questionId: questions[index].id,
          questionText: questions[index].text,
          selectedOption: answer,
          selectedOptionText: questions[index].options.find(opt => opt.value === answer)?.text || ''
        }))
      };
      
      console.log('Submitting quiz data:', quizData); // Debug log
      
      // Submit quiz data to the server
      const response = await submitQuiz(quizData);
      
      console.log('Server response:', response); // Debug log
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to process quiz results');
      }
      
      // Call the completion handler with the response
      onSubmit({
        ...formData,
        result: response.result
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
      alert(error.message || 'There was an error submitting your quiz. Please try again.');
    }
  };

  // If currently submitting, show loading spinner
  if (isSubmitting) {
    return (
      <LoadingSpinner message="Generating your personalized brand report..." />
    );
  }

  // If showing metadata form
  if (showMetadataForm) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <ProgressBar currentQuestion={questions.length} totalQuestions={questions.length} />
        
        <MetadataForm 
          formData={formData} 
          onChange={handleFormChange} 
          errors={formErrors} 
        />
        
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            Back
          </button>
          
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  // Otherwise, show the current question
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <ProgressBar 
        currentQuestion={currentQuestionIndex + 1} 
        totalQuestions={questions.length} 
      />
      
      <Question
        question={currentQuestion}
        selectedOption={currentAnswer}
        onOptionSelect={handleOptionSelect}
      />
      
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
        >
          Back
        </button>
        
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!currentAnswer}
        >
          {isLastQuestion ? 'Next' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Quiz; 