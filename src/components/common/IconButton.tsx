import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'accent' | 'danger';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  active = false,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };

  const variantClasses = {
    ghost: active
      ? 'bg-cad-accent text-black font-semibold'
      : 'text-cad-textMuted hover:text-cad-text hover:bg-cad-panelLight',
    outline: active
      ? 'border border-cad-accent bg-cad-accentSoft text-cad-accent font-semibold'
      : 'border border-cad-border text-cad-textMuted hover:text-cad-text hover:bg-cad-panelLight',
    accent: 'bg-cad-accent text-black hover:bg-cad-accentHover font-medium',
    danger: 'text-red-400 hover:text-red-300 hover:bg-red-950/30',
  };

  return (
    <button
      type="button"
      className={`rounded transition-all duration-150 inline-flex items-center justify-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-cad-accent ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title={label}
      aria-label={label}
      {...props}
    >
      {icon}
      {label && <span className="text-xs">{label}</span>}
    </button>
  );
};

