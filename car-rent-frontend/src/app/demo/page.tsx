'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  TruckIcon, 
  UserCircleIcon, 
  CogIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('features');
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        toast.success('Success! Operation completed successfully');
        break;
      case 'error':
        toast.error('Error! Something went wrong');
        break;
      case 'info':
        toast('Info: This is a demo notification');
        break;
    }
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Loading completed!');
    }, 2000);
  };

  const demoFeatures = [
    {
      icon: TruckIcon,
      title: 'Vehicle Management',
      description: 'Complete CRUD operations for vehicles with image upload',
      status: 'Frontend Ready'
    },
    {
      icon: UserCircleIcon,
      title: 'User Authentication',
      description: 'JWT-based auth with role-based access control',
      status: 'Frontend Ready'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Security',
      description: 'Input validation, CSRF protection, secure headers',
      status: 'Implemented'
    },
    {
      icon: ChartBarIcon,
      title: 'Dashboard',
      description: 'Analytics and reporting for admin users',
      status: 'UI Ready'
    }
  ];

  const techStack = [
    { name: 'Next.js 14', status: '✅', description: 'App Router, Server Components' },
    { name: 'TypeScript', status: '✅', description: 'Full type safety' },
    { name: 'Tailwind CSS', status: '✅', description: 'Modern styling' },
    { name: 'React Hook Form', status: '✅', description: 'Form validation' },
    { name: 'Axios', status: '✅', description: 'API client with interceptors' },
    { name: 'React Hot Toast', status: '✅', description: 'Notifications' },
    { name: 'Heroicons', status: '✅', description: 'Professional icons' },
    { name: 'ASP.NET Core', status: '⚠️', description: 'Backend needs fixes' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <TruckIcon className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CarBorrow Demo</h1>
                <p className="text-sm text-gray-500">Car Rental System - Frontend Showcase</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="btn-secondary">
                Back to Home
              </Link>
              <Link href="/login" className="btn-primary">
                Try Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'features', label: 'Features' },
              { id: 'tech', label: 'Tech Stack' },
              { id: 'ui', label: 'UI Components' },
              { id: 'status', label: 'Project Status' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start">
                  <feature.icon className="h-8 w-8 text-primary-600 mr-4 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{feature.description}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      feature.status === 'Implemented' || feature.status === 'Frontend Ready'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tech' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Technology Stack</h3>
            <div className="space-y-4">
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{tech.status}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{tech.name}</h4>
                      <p className="text-sm text-gray-500">{tech.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ui' && (
          <div className="space-y-8">
            {/* Buttons Demo */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Button Components</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">Primary Button</button>
                <button className="btn-secondary">Secondary Button</button>
                <button className="btn-danger">Danger Button</button>
                <button 
                  className="btn-primary" 
                  disabled={isLoading}
                  onClick={simulateLoading}
                >
                  {isLoading ? 'Loading...' : 'Test Loading'}
                </button>
              </div>
            </div>

            {/* Toast Demo */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Toast Notifications</h3>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => showToast('success')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Success Toast
                </button>
                <button 
                  onClick={() => showToast('error')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Error Toast
                </button>
                <button 
                  onClick={() => showToast('info')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Info Toast
                </button>
              </div>
            </div>

            {/* Icons Demo */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Icon Library</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {[TruckIcon, UserCircleIcon, CogIcon, ChartBarIcon, ShieldCheckIcon, ClockIcon, StarIcon, CheckCircleIcon].map((Icon, index) => (
                  <div key={index} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                    <Icon className="h-8 w-8 text-primary-600 mb-2" />
                    <span className="text-xs text-gray-500">Icon {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Project Status Overview</h3>
              
              <div className="space-y-6">
                {/* Frontend Status */}
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center mb-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                    <h4 className="text-lg font-semibold text-green-800">Frontend - Complete ✅</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>✅ Next.js 14 with App Router</li>
                    <li>✅ TypeScript integration</li>
                    <li>✅ Authentication system (UI)</li>
                    <li>✅ Responsive design</li>
                    <li>✅ Component library</li>
                    <li>✅ State management</li>
                    <li>✅ API integration ready</li>
                  </ul>
                </div>

                {/* Backend Status */}
                <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center mb-3">
                    <XCircleIcon className="h-6 w-6 text-yellow-600 mr-2" />
                    <h4 className="text-lg font-semibold text-yellow-800">Backend - Needs Fixes ⚠️</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>⚠️ Build errors (88 issues)</li>
                    <li>⚠️ AuthService implementation</li>
                    <li>⚠️ Entity model mismatches</li>
                    <li>✅ Good architecture structure</li>
                    <li>✅ All packages configured</li>
                    <li>✅ Database migrations ready</li>
                  </ul>
                </div>

                {/* Next Steps */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-3">
                    <ClockIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <h4 className="text-lg font-semibold text-blue-800">Next Steps 🚀</h4>
                  </div>
                  <ol className="space-y-1 text-sm text-blue-700 list-decimal list-inside">
                    <li>Fix backend build errors (~2-3 hours)</li>
                    <li>Test authentication flow</li>
                    <li>Implement vehicle CRUD operations</li>
                    <li>Add admin dashboard</li>
                    <li>Deploy to production</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}