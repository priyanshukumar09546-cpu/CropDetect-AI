import React from 'react';
import { Sprout, BookOpen, GraduationCap } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const handleNavClick = (id: string) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#DDE8DF] text-gray-600 mt-10 sm:mt-16 lg:mt-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-[#15803D]">
                <Sprout className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg text-[#17201A]">CropDetect</span>
                <span className="font-extrabold text-lg text-[#15803D]">AI</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
              AI-powered crop disease detection using convolutional neural networks. An academic deep learning system designed for leaf pathology classification and agricultural decision support.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Machine Learning Project</span>
            </div>
            <p className="text-xs text-gray-500 italic">“Detect. Understand. Protect.”</p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17201A] mb-4">
              Project Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNavClick('home')}
                  className="hover:text-[#15803D] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('detect')}
                  className="hover:text-[#15803D] transition-colors cursor-pointer"
                >
                  Detect Disease
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('dataset')}
                  className="hover:text-[#15803D] transition-colors cursor-pointer"
                >
                  Dataset (PlantVillage)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('model')}
                  className="hover:text-[#15803D] transition-colors cursor-pointer"
                >
                  CNN Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="hover:text-[#15803D] transition-colors cursor-pointer"
                >
                  About the Research
                </button>
              </li>
            </ul>
          </div>

          {/* Research & Methodology */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17201A] mb-4">
              Methodology
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#15803D]" />
                PlantVillage Benchmark (54k images)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                4-Block Deep CNN Pipeline
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                Categorical Crossentropy Softmax
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                Google Colab GPU Integration
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#DDE8DF] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} CropDetect AI. Final Year Academic & Viva Showcase.</p>
          <p className="flex items-center gap-2">
            <span>Powered by TensorFlow / Keras & FastAPI</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
