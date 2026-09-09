import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col justify-center items-center p-4 sm:p-6 antialiased">
      {/* Container Card */}
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-surface-container-high/80 shadow-xl flex flex-col gap-6">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-md ring-4 ring-primary/10">
            <Building2 className="w-8 h-8 text-primary-fixed" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
              Servicio &amp; Registro
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
              Portal Teocrático Congregacional
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 p-3 rounded-xl bg-error-container/40 border border-error-container text-xs text-error font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField id="email-input" label="Correo Electrónico">
            <div className="relative">
              <Input
                id="email-input"
                type="email"
                placeholder="ejemplo@congregacion.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="pl-9"
              />
              <Mail className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </FormField>

          <FormField id="password-input" label="Contraseña">
            <div className="relative">
              <Input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pl-9 pr-10"
              />
              <Lock className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors p-1"
                aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading || !email.trim() || !password.trim()}
            className="w-full mt-2 font-semibold flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-surface-container-high w-full"></div>
          <span className="bg-surface-container-lowest px-3 text-[11px] font-semibold text-outline uppercase tracking-wider whitespace-nowrap">
            Acceso Rápido de Prueba
          </span>
        </div>

        {/* Quick Demo Access Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => loginAsDemo('secretario')}
            className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all border border-surface-container-high/60 text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                  David Morales
                </span>
                <span className="text-[10px] text-secondary font-semibold">
                  Secretario / Anciano
                </span>
              </div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-outline group-hover:text-primary transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => loginAsDemo('publicador')}
            className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all border border-surface-container-high/60 text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface group-hover:text-secondary transition-colors">
                  Mateo González
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">
                  Publicador de Congregación
                </span>
              </div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-outline group-hover:text-secondary transition-colors" />
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-2 border-t border-surface-container-high/40">
          <p className="text-[11px] text-outline">
            Información confidencial para uso exclusivo de la congregación local.
          </p>
        </div>
      </div>
    </div>
  );
};
