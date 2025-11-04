// src/pages/client/Feedback.jsx - UPDATED WITH LIGHT THEME
import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import api from '../../services/api';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/feedback', { rating, comment });
      alert('Feedback submitted successfully');
      setRating(0);
      setComment('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Feedback</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>Share your experience with our service</p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div 
            className="rounded-lg shadow-md p-4 flex items-center space-x-3"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', borderLeftWidth: '4px', borderLeftColor: '#10b981' }}
          >
            <div style={{ color: '#10b981' }}>✓</div>
            <p style={{ color: '#10b981' }} className="font-medium">Thank you! Your feedback has been received.</p>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: '#f5f1ed' }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating Section */}
            <div>
              <label className="block text-sm font-semibold mb-4" style={{ color: '#1f2937' }}>
                Rate your experience
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className="h-10 w-10 transition-all"
                      style={{
                        fill: star <= rating ? '#867969' : 'none',
                        color: star <= rating ? '#867969' : '#d1d5db'
                      }}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
                  You rated: <span className="font-semibold" style={{ color: '#867969' }}>{rating} out of 5 stars</span>
                </p>
              )}
            </div>

            {/* Comments Section */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: '#1f2937' }}>
                Your Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows="6"
                className="w-full px-4 py-3 rounded-lg outline-none resize-none"
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)',
                  color: '#1f2937'
                }}
                placeholder="Tell us about your experience..."
              />
              <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>
                {comment.length} / 500 characters
              </p>
            </div>

            {/* Rating Guide */}
            {rating > 0 && (
              <div 
                className="rounded-lg p-4"
                style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}
              >
                <p className="text-sm font-medium mb-2" style={{ color: '#1f2937' }}>Your Rating:</p>
                <p style={{ color: '#6b7280' }}>
                  {rating === 1 && "Poor - There's room for improvement"}
                  {rating === 2 && "Fair - We can do better"}
                  {rating === 3 && "Good - Meets expectations"}
                  {rating === 4 && "Very Good - Really satisfied"}
                  {rating === 5 && "Excellent - Outstanding service!"}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || rating === 0 || comment.trim() === ''}
              className="w-full text-white py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold"
              style={{
                background: rating === 0 || comment.trim() === '' 
                  ? 'rgba(134, 121, 105, 0.5)' 
                  : 'linear-gradient(135deg, #867969 0%, #a89983 100%)'
              }}
            >
              <Send className="h-5 w-5" />
              <span>{loading ? 'Submitting...' : 'Submit Feedback'}</span>
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div 
          className="rounded-lg shadow-md p-6"
          style={{ backgroundColor: '#f5f1ed', borderLeftWidth: '4px', borderLeftColor: '#867969' }}
        >
          <h3 className="font-semibold mb-2" style={{ color: '#1f2937' }}>Your feedback matters!</h3>
          <p style={{ color: '#6b7280' }} className="text-sm">
            We use your feedback to improve our service and provide you with the best legal case management experience possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
