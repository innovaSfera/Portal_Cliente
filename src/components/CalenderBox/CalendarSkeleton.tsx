const CalendarSkeleton: React.FC = () => {
  return (
    <div className="w-full rounded-lg bg-white p-2 sm:p-4 shadow-1 dark:bg-gray-dark dark:shadow-card animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center">
          <div className="h-8 sm:h-9 w-16 sm:w-20 rounded bg-gray-200 dark:bg-dark-3"></div>
          <div className="h-8 sm:h-9 w-16 sm:w-20 rounded bg-gray-200 dark:bg-dark-3"></div>
          <div className="h-8 sm:h-9 w-20 sm:w-24 rounded bg-gray-200 dark:bg-dark-3"></div>
        </div>
        <div className="h-8 sm:h-9 w-40 sm:w-48 rounded bg-gray-200 dark:bg-dark-3"></div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-9 w-16 rounded bg-gray-200 dark:bg-dark-3"></div>
          <div className="h-9 w-20 rounded bg-gray-200 dark:bg-dark-3"></div>
          <div className="h-9 w-14 rounded bg-gray-200 dark:bg-dark-3"></div>
        </div>
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="space-y-1 sm:space-y-2">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="h-6 sm:h-8 rounded bg-gray-200 dark:bg-dark-3"
            ></div>
          ))}
        </div>

        {/* Calendar days - Mobile: 4 rows, Desktop: 5 rows */}
        {[...Array(4)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 gap-1 sm:gap-2">
            {[...Array(7)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-12 sm:h-20 md:h-24 rounded bg-gray-200 dark:bg-dark-3"
              ></div>
            ))}
          </div>
        ))}
        
        {/* Extra row only on desktop */}
        <div className="hidden sm:grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-20 md:h-24 rounded bg-gray-200 dark:bg-dark-3"
            ></div>
          ))}
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-3 sm:mt-4 text-center">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Carregando agenda...
        </p>
      </div>
    </div>
  );
};

export default CalendarSkeleton;
