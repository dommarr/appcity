export default function GridContainer({children}){
    return (
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {children}
      </ul>
  );
}