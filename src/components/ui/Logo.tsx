import React from 'react';
const LOGO_URL = `${import.meta.env.BASE_URL}DHA-LOGO-FA-02.png`;

interface LogoProps {
  variant?: 'default' | 'light' | 'icon';
  className?: string;
}
/**
 * DHA brand logo.
 * - default: full color logo on light surfaces
 * - light:   for use on dark/red backgrounds — wraps the logo in a white pill so the
 *            black wordmark remains legible
 * - icon:    just the logo image, slightly smaller — for sidebar / compact spots
 */
export function Logo({ variant = 'default', className = '' }: LogoProps) {
  if (variant === 'light') {
    return (
      <div
        className={`inline-flex items-center bg-white rounded-md px-2.5 py-1.5 shadow-sm ${className}`}>
        
        <img
          src={LOGO_URL}
          alt="Digital Health Agency"
          className="h-7 w-auto block" />
        
      </div>);

  }
  if (variant === 'icon') {
    return (
      <img
        src={LOGO_URL}
        alt="Digital Health Agency"
        className={`h-8 w-auto block ${className}`} />);


  }
  return (
    <img
      src={LOGO_URL}
      alt="Digital Health Agency"
      className={`h-10 w-auto block ${className}`} />);


}
