import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InfoTooltip from '../components/InfoTooltip';
import api from '../services/api';

interface Question {
  id: number;
  text: string;
  question_type: string;
  options: string[];
  explanation?: string;
  order: number;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  min_score_percent: number;
  questions: Question[];
}

interface QuestionResponse {
  question_id: number;
  is_correct: boolean;
  explanation: string;
}

interface QuizResult {
  score_percent: number;
  passed: boolean;
  min_score_required: number;
  responses: QuestionResponse[];
}

const QuizComponent: React.FC = () => {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    loadQuiz();
  }, [courseId, moduleId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/courses/${courseId}/modules/${moduleId}/quiz`);
      const data = response.data;
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (!submitted) {
      setAnswers({
        ...answers,
        [quiz!.questions[currentQuestion].id]: optionIndex
      });
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    try {
      const response = await api.post(`/courses/${courseId}/modules/${moduleId}/quiz/submit`, {
        answers: answers
      });
      
      const data = response.data;
      setResult(data);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error submitting quiz');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cuestionario...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Cuestionario no encontrado'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    const passed = result.passed;
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Result card */}
          <div className={`rounded-lg shadow-lg border-2 p-8 text-center ${
            passed
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}>
            {/* Score circle */}
            <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl font-bold ${
              passed ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
            }`}>
              {Math.round(result.score_percent)}%
            </div>

            {/* Status message */}
            <h2 className={`text-4xl font-bold mb-4 ${
              passed ? 'text-green-700' : 'text-red-700'
            }`}>
              {passed ? '¡Excelente!' : 'Intenta de nuevo'}
            </h2>

            <p className="text-gray-700 text-lg mb-6">
              {passed
                ? `¡Completaste el cuestionario con ${Math.round(result.score_percent)}%!`
                : `Score: ${Math.round(result.score_percent)}% - Necesitas ${result.min_score_required}% para pasar`
              }
            </p>

            {/* Detailed feedback */}
            <div className="mb-8 text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Respuestas:</h3>
              <div className="space-y-3">
                {result.responses.map((response, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      response.is_correct
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <i className={`fas ${response.is_correct ? 'fa-check' : 'fa-times'} text-2xl ${
                        response.is_correct ? 'text-green-600' : 'text-red-600'
                      }`}></i>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          response.is_correct ? 'text-green-700' : 'text-red-700'
                        }`}>
                          Pregunta {index + 1}: {response.is_correct ? 'Correcta' : 'Incorrecta'}
                        </p>
                        {response.explanation && (
                          <p className="text-gray-700 text-sm mt-2">{response.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!passed && (
                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setAnswers({});
                    setSubmitted(false);
                    setResult(null);
                    loadQuiz();
                  }}
                  className="px-8 py-3 rounded-lg font-semibold bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <i className="fas fa-redo mr-2"></i> Reintentar
                </button>
              )}

              {passed && (
                <button
                  onClick={() => navigate(`/dashboard/course/${courseId}`)}
                  className="px-8 py-3 rounded-lg font-semibold bg-blue-900 hover:bg-blue-800 text-white"
                >
                  <i className="fas fa-arrow-right mr-2"></i> Continuar Curso
                </button>
              )}

              <button
                onClick={() => navigate(-1)}
                className="px-8 py-3 rounded-lg font-semibold bg-gray-400 hover:bg-gray-500 text-white"
              >
                Volver
              </button>
            </div>

            {passed && (
              <div className="mt-8 pt-8 border-t-2 border-green-300">
                <p className="text-green-700 font-semibold text-lg">
                  ✓ Módulo completado. ¡Sigue adelante!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const answered = answers[question.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 mb-3 font-semibold flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> Volver
          </button>
          <h1 className="text-3xl font-bold text-blue-900">{quiz.title}</h1>
          <p className="text-gray-600 mt-1">{quiz.description}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-700">
              Pregunta {currentQuestion + 1} de {quiz.questions.length}
            </p>
            <p className="text-gray-600 text-sm">
              Puntuación mínima requerida: {quiz.min_score_percent}%
            </p>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-6">
          {/* Question text */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                {currentQuestion + 1}
              </span>
              {question.text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={submitted}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[question.id] === index
                    ? 'bg-blue-50 border-blue-600'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                } ${submitted ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[question.id] === index
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-400'
                  }`}>
                    {answers[question.id] === index && (
                      <i className="fas fa-check text-white text-sm"></i>
                    )}
                  </div>
                  <span className="text-gray-900 font-semibold">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0 || submitted}
              className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-arrow-left mr-2"></i> Anterior
            </button>

            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(Math.min(currentQuestion + 1, quiz.questions.length - 1))}
                disabled={submitted}
                className="px-6 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                Siguiente <i className="fas fa-arrow-right ml-2"></i>
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitted || !answered}
                className="px-6 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar Cuestionario <i className="fas fa-check ml-2"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
