import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  backgroundColor?: 'white' | 'gray' | 'blue' | 'secondary';
  padding?: 'xm'|'sm' | 'md' | 'lg' | 'xl';
  id?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  backgroundColor = 'white',
  padding = 'lg',
  id
}) => {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    blue: 'bg-gradient-to-r from-primary-600 to-accent-600',
    secondary: 'bg-primary-400'
  };
  
  const paddingClasses = {
    xm:'py-5',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  };
  
  return (
    <section id={id} className={`${bgClasses[backgroundColor]} ${paddingClasses[padding]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default Section;