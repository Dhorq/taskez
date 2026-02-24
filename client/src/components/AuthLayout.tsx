import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  type: "login" | "signup";
  onToggle: () => void;
  footerText: string;
  footerLinkText: string;
  onFooterLinkClick: () => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  type,
  onToggle,
  footerText,
  footerLinkText,
  onFooterLinkClick,
}) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] overflow-hidden font-sans py-10">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="relative z-10 w-full max-w-[440px] px-4">
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="p-8 pb-6">
            {/* Tab Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-50 p-1 rounded-xl flex gap-1">
                <button
                  onClick={() => type !== "login" && onToggle()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    type === "login"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </button>
                <button
                  onClick={() => type !== "signup" && onToggle()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    type === "signup"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 10a7 7 0 1014 0 7 7 0 00-14 0z" />
                  </svg>
                  Sign Up
                </button>
              </div>
            </div>

            {title && (
              <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-1">{title}</h1>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
              </div>
            )}

            {children}
          </div>

          <div className="bg-gray-50/50 py-4 px-8 text-center border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              {footerText}{" "}
              <button
                onClick={onFooterLinkClick}
                className="text-gray-900 font-semibold hover:underline"
              >
                {footerLinkText}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
