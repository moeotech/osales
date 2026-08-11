import React from 'react';
import { useParams } from 'react-router-dom';
import { Upload } from 'lucide-react';

export function Gallery() {
  const { companyId } = useParams<{ companyId: string }>();

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b bg-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
          <div className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900">Gallery</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Gallery</h2>
          
          <div className="border-2 border-dashed border-blue-200 rounded-xl bg-slate-50 p-12 flex flex-col items-center justify-center text-center mb-8">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mb-4">
              <Upload className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Drag & Drop Files Here</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium underline">
              Browse File
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {/* Example images based on screenshot */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative group cursor-pointer border border-slate-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-slate-100 flex items-center justify-center">
                  <div className="w-full h-full bg-amber-700/20 flex flex-col items-center justify-center p-4 text-amber-900 font-bold text-center">
                    <span className="text-2xl mb-1">Schär</span>
                    <span className="text-xs">Snack</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-white bg-transparent shadow-sm"></div>
                <div className="p-2 truncate text-[10px] text-slate-500 bg-white">
                  upload_1785669887266731.jpg
                </div>
              </div>
            ))}
            
            <div className="relative group cursor-pointer border border-slate-200 rounded-lg overflow-hidden">
              <div className="aspect-square bg-white flex items-center justify-center p-4">
                <span className="text-xl font-bold text-slate-600 tracking-wider">REPPRO</span>
              </div>
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-slate-300 bg-transparent shadow-sm"></div>
              <div className="p-2 truncate text-[10px] text-slate-500 bg-white">
                WhatsApp Image 2026-07-20...
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12 text-sm text-slate-400 font-medium">
            No more files to show
          </div>
        </div>
      </div>
    </div>
  );
}
