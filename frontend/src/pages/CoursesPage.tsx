import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: number;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  progress: number;
}

const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Introducción a la Inversión',
      description: 'Aprende los conceptos básicos de inversión en bolsa',
      modules: 5,
      difficulty: 'Básico',
      progress: 60,
    },
    {
      id: '2',
      title: 'Análisis Técnico',
      description: 'Domina el análisis técnico de acciones',
      modules: 8,
      difficulty: 'Intermedio',
      progress: 30,
    },
    {
      id: '3',
      title: 'Gestión de Portafolios',
      description: 'Estrategias avanzadas de gestión de inversiones',
      modules: 10,
      difficulty: 'Avanzado',
      progress: 0,
    },
  ]);

  const handleCourseClick = (courseId: string) => {
    navigate(`/dashboard/course/${courseId}`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Cursos Educativos</h2>
        <p className="text-gray-600">Amplía tus conocimientos sobre inversión y finanzas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => handleCourseClick(course.id)}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                course.difficulty === 'Básico' ? 'bg-green-100 text-green-800' :
                course.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {course.difficulty}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4">{course.description}</p>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{course.modules} módulos</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors">
              {course.progress === 0 ? 'Comenzar' : 'Continuar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
