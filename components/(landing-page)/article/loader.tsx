import type React from "react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2957A4]"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>

        {/* Skeleton loading cards */}
        <div className="grid max-w-2xl grid-cols-1 mx-auto gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 rounded-lg h-64 w-full mb-4"></div>
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-gray-300 rounded-full h-6 w-20"></div>
                  <div className="bg-gray-300 rounded h-4 w-16"></div>
                </div>
                <div className="bg-gray-300 rounded h-6 w-full mb-2"></div>
                <div className="bg-gray-300 rounded h-6 w-3/4 mb-4"></div>
                <div className="bg-gray-300 rounded h-4 w-full mb-2"></div>
                <div className="bg-gray-300 rounded h-4 w-2/3 mb-4"></div>
                <div className="bg-gray-300 rounded-full h-10 w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
