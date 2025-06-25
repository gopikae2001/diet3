import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="page-header">
      {icon && <span className="page-header-icon">{icon}</span>}
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="subtitle text-gray-700">{subtitle}</p>
    </div>
  );
};

export default PageHeader;
