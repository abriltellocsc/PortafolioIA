import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Module {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  hasQuiz: boolean;
}

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [modules] = useState<Module[]>([
    {
      id: '1',
      title: 'Conceptos Básicos de Inversión',
      duration: '15 min',
      completed: true,
      hasQuiz: true,
    },
    {
      id: '2',
      title: 'Tipos de Inversión',
      duration: '20 min',
      completed: true,
      hasQuiz: true,
    },
    {
      id: '3',
      title: 'Riesgo y Rendimiento',
      duration: '25 min',
      completed: false,
      hasQuiz: true,
    },
    {
      id: '4',
      title: 'Diversificación de Portafolio',
      duration: '30 min',
      completed: false,
      hasQuiz: true,
    },
  ]);

  const handleModuleClick = (moduleId: string, hasQuiz: boolean) => {
    if (hasQuiz) {
      navigate(`/dashboard/course/${courseId}/module/${moduleId}/quiz`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('/dashboard/education')}
            className="text-blue-500 hover:text-blue-700 text-sm font-semibold mb-2"
          >
            ← Volver a Cursos
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Curso #{courseId}</h1>
          <p className="text-gray-600 mt-2">Contenido y módulos del curso</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos del Curso</h2>

        <div className="space-y-4">
          {modules.map((module, index) => (
            <div
              key={module.id}
              onClick={() => handleModuleClick(module.id, module.hasQuiz)}
              className={`p-4 rounded-lg border-2 transition-all ${
                module.completed
                  ? 'bg-green-50 border-green-200 cursor-pointer hover:border-green-400'
                  : 'bg-gray-50 border-gray-200 cursor-pointer hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    module.completed ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {module.completed ? '✓' : index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.duration}</p>
                  </div>
                </div>
                {module.hasQuiz && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    Quiz
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Sobre este curso</h3>
        <p className="text-gray-700 text-sm">
          Este curso te proporciona las bases necesarias para comenzar tu viaje en el mundo de las inversiones.
          Completarás todos los módulos y realizarás quizzes para evaluar tu comprensión.
        </p>
      </div>
    </div>
  );
};

export default CourseDetail;
