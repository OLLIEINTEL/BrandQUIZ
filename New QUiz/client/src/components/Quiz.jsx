import React, { useState, useCallback } from 'react';
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
  const [submitError, setSubmitError] = useState(null);

  const handleOptionSelect = useCallback((optionId) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = optionId;
      return newAnswers;
    });
    // Clear any previous submit error when user makes a selection
    setSubmitError(null);
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex === questions.length - 1) {
      const unansweredIndex = answers.findIndex(answer => answer === null);
      if (unansweredIndex !== -1) {
        setCurrentQuestionIndex(unansweredIndex);
        setSubmitError(`Please answer question ${unansweredIndex + 1} before proceeding.`);
        return;
      }
      setShowMetadataForm(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, answers]);

  const handleBack = useCallback(() => {
    setSubmitError(null); // Clear any error when going back
    if (showMetadataForm) {
      setShowMetadataForm(false);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [showMetadataForm, currentQuestionIndex]);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim(),
    }));
    // Clear related error
    setFormErrors(prev => ({
      ...prev,
      [name]: null,
    }));
    setSubmitError(null);
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const urlRegex = /^https?:\/\/.+\..+/;
    
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!formData.companyName) {
      errors.companyName = 'Company name is required';
    }
    
    if (!formData.websiteUrl) {
      errors.websiteUrl = 'Website URL is required';
    } else if (!urlRegex.test(formData.websiteUrl)) {
      errors.websiteUrl = 'Please enter a valid URL (e.g., https://example.com)';
    }
    
    return errors;
  }, [formData]);

  const prepareQuizData = useCallback(() => {
    // Validate all questions are answered
    const unansweredIndex = answers.findIndex(answer => answer === null);
    if (unansweredIndex !== -1) {
      throw new Error(`Please answer question ${unansweredIndex + 1} before submitting.`);
    }

    const metadata = {
      name: formData.name,
      email: formData.email,
      companyName: formData.companyName,
      websiteUrl: formData.websiteUrl
    };

    const quizAnswers = questions.map((question, index) => {
      const selectedOption = question.options.find(opt => opt.value === answers[index]);
      if (!selectedOption) {
        throw new Error(`Invalid answer for question: ${question.text}`);
      }
      return {
        id: question.id,
        question: question.text,
        answer: selectedOption.value,
        answerText: selectedOption.text,
        description: selectedOption.description || ''
      };
    });

    return { metadata, answers: quizAnswers };
  }, [formData, answers]);

  const handleSubmit = async () => {
    try {
      setSubmitError(null);
      setFormErrors({});
      
      // Validate form data
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      
      // Prepare and validate quiz data
      const quizData = prepareQuizData();
      console.log('Debug - Submitting quiz data:', JSON.stringify(quizData, null, 2));
      
      const response = await submitQuiz(quizData);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to process quiz results');
      }
      
      // Call the parent's onSubmit with the complete data
      onSubmit({
        metadata: quizData.metadata,
        result: response.result
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setSubmitError(error.message);
      
      // If it's a missing answer error, go back to the questions
      if (error.message.includes('Please answer question')) {
        setShowMetadataForm(false);
        const questionNum = parseInt(error.message.match(/question (\d+)/)?.[1] || '1');
        setCurrentQuestionIndex(questionNum - 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingSpinner message="Analyzing your brand archetype..." />;
  }

  if (showMetadataForm) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <ProgressBar currentQuestion={questions.length} totalQuestions={questions.length} />
        
        <MetadataForm 
          formData={formData} 
          onChange={handleFormChange} 
          errors={formErrors}
          submitError={submitError}
        />
        
        <div className="mt-8 flex justify-between items-center">
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <ProgressBar 
        currentQuestion={currentQuestionIndex + 1} 
        totalQuestions={questions.length} 
      />
      
      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}
      
      <Question
        question={currentQuestion}
        selectedOption={currentAnswer}
        onOptionSelect={handleOptionSelect}
      />
      
      <div className="mt-8 flex justify-between items-center">
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
          {currentQuestionIndex === questions.length - 1 ? 'Next' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Quiz; 