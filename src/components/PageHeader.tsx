import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="subtitle" text-gray-700>{subtitle}</p>
    </div>
  );
};

export default PageHeader;
