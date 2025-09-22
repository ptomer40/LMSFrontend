"use client"

import { Calendar, Timer, FileQuestion, Code, ArrowLeft, Play, BookOpenCheck } from "lucide-react"
import { Link,useNavigate } from "react-router-dom"
import { useEffect } from "react"


const TestInstruction = ({ test, admissionNumber, onBack, onStartSection }) => {

    // maintaining session
  const navigate=useNavigate();
useEffect(() => {
  
    if (!admissionNumber || admissionNumber.trim() === "") {
      navigate("/logout");
    
  }
}, [admissionNumber, navigate]);


    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-4">
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                </button>
            </div>

            {/* Test Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                    <BookOpenCheck className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">{test.title}: {admissionNumber}</h1>
                </div>

                <p className="text-gray-600 text-lg mb-6">{test.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Due Date</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{test.dueDate}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Timer className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Duration</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{test.duration}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <FileQuestion className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">MCQ Questions</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{test.mcqCount}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Code className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Coding Problems</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{test.codingCount}</p>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Instructions</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Read all questions carefully before attempting to answer.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>You can attempt MCQ questions and coding problems in any order.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Make sure to save your progress regularly during coding problems.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Once you submit the test, you cannot make any changes.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Ensure stable internet connection throughout the test duration.</span>
                        </li>
                    </ul>
                </div>

                {/* Test Sections */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FileQuestion className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">MCQ Questions</h3>
                                <p className="text-sm text-gray-500">{test.mcqCount} Multiple Choice Questions</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Test your theoretical knowledge with multiple choice questions covering key concepts and fundamentals.
                        </p>
                        <button
                            onClick={() => onStartSection("mcq")}
                            className="w-full flecflex-col items-center justify-center space-x-2 bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            {/* //sending test to next component */}
                            <Link to="/mcq-test" state={{test,admissionNumber}} className="w-full flex items-center justify-center space-x-2">   
                                <Play className="w-5 h-5" />
                                <span>Start MCQ Section</span>
                            </Link>
                        </button>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Code className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Coding Problems</h3>
                                <p className="text-sm text-gray-500">{test.codingCount} Programming Challenges</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Apply your programming skills to solve real-world problems and demonstrate your coding abilities.
                        </p>
                        <button
                            onClick={() => onStartSection("coding")}
                            className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                        > <Link to="/coding-test" state={{test,admissionNumber}} className="w-full flex items-center justify-center space-x-2">  
                             {/* sending test to next component */}
                                <Play className="w-5 h-5" />
                                <span>Start Coding Section</span>
                            </Link>
                            
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestInstruction
