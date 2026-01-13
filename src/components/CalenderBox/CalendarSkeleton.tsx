const CalendarSkeleton: React.FC = () => {
  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-20 rounded bg-gray-200 dark:bg-dark-3"></div>
          <div className="h-9 w-20 rounded bg-gray-200 dark:bg-dark-3"></div>
          <div className="h-9 w-24 rounded bg-gray-200 dark:bg-dark-3"></div>
        </div>
        <div className="h-9 w-48 rounded bg-gray-200 dark:bg-dark-3"></div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-16 rounded bg-gray-200 dark:bg-dark-3"></div>
          <div className="h-9 w-20 rounded bg-gray-200 dark:bg-dark-3"></div>
          <div className="h-9 w-14 rounded bg-gray-200 dark:bg-dark-3"></div>
        </div>
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="space-y-2">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="h-8 rounded bg-gray-200 dark:bg-dark-3"
            ></div>
          ))}
        </div>

        {/* Calendar days */}
        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-24 rounded bg-gray-200 dark:bg-dark-3"
              ></div>
            ))}
          </div>
        ))}
      </div>

      {/* Loading text */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Carregando agenda...
        </p>
      </div>
    </div>
  );
};

export default CalendarSkeleton;
