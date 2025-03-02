import { useState } from 'react';
import Quiz from './components/Quiz';
import MetadataForm from './components/MetadataForm';
import LoadingSpinner from './components/LoadingSpinner';
import SuccessMessage from './components/SuccessMessage';
import { submitQuiz } from './utils/api';

function App() {
  const [step, setStep] = useState('metadata'); // metadata, quiz, loading, success
  const [metadata, setMetadata] = useState({
    name: '',
    email: '',
    companyName: '',
    websiteUrl: '', // Changed from website to websiteUrl to match MetadataForm
  });
  const [quizResults, setQuizResults] = useState(null);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleMetadataSubmit = (data) => {
    setMetadata(data);
    setStep('quiz');
  };

  const handleQuizSubmit = async (results) => {
    setQuizResults(results);
    setStep('loading');
    
    try {
      // Submit both metadata and quiz results to the API using our utility
      await submitQuiz(metadata, results);
      setStep('success');
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message);
      setStep('quiz'); // Go back to quiz on error
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Brand Archetype Quiz</h1>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
              <button 
                className="float-right font-bold"
                onClick={() => setError(null)}
              >
                &times;
              </button>
            </div>
          )}
          
          <div className="px-4 py-6 sm:px-0">
            {step === 'metadata' && (
              <MetadataForm 
                formData={metadata}
                onChange={handleMetadataChange}
                errors={formErrors}
                onSubmit={handleMetadataSubmit}
              />
            )}
            
            {step === 'quiz' && (
              <Quiz onSubmit={handleQuizSubmit} />
            )}
            
            {step === 'loading' && (
              <LoadingSpinner message="Analyzing your responses and generating your brand archetype report..." />
            )}
            
            {step === 'success' && (
              <SuccessMessage email={metadata.email} />
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; {new Date().getFullYear()} Brand Archetype Quiz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App; 