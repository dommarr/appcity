export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="h-20 w-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="text-purple animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
    </div>
  );
}
