import React, { useEffect, useRef, useState } from 'react';
import styles from './SignUpForm.module.css';

/* ── Google SVG icon ── */
const GoogleIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
  </svg>
);

/* ── Apple SVG icon ── */
const AppleIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05 1.78-3.15 1.76-1.09-.02-1.44-.69-2.7-.69-1.25 0-1.65.67-2.67.69-1.03.02-1.99-.71-2.97-1.66-2.02-1.93-3.56-5.46-1.5-9.04 1.02-1.78 2.85-2.91 4.83-2.94 1.5-.02 2.92 1.02 3.83 1.02.9 0 2.65-1.25 4.45-1.06 1.79.08 3.16.81 4.14 2.13-3.08 1.84-2.58 5.48.51 6.74-.83 2.05-1.79 3.1-2.77 4.05zM12.03 7.25c-.02-2.23 1.83-4.04 4.06-4.06.02 2.23-1.83 4.04-4.06 4.06z" fill="currentColor" />
  </svg>
);

interface SignUpFormProps {
  onLogIn?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onLogIn }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});
  const cardRef = useRef<HTMLDivElement>(null);

  /* ── Mouse-tracking spotlight ── */
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /* ── Floating cinema particles ── */
  useEffect(() => {
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.className = styles.particle;
      const size = Math.random() * 4 + 2;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = `${Math.random() * 100}vh`;
      el.animate(
        [
          { transform: 'translate(0,0)', opacity: 0.1 },
          {
            transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`,
            opacity: 0.3,
          },
          { transform: 'translate(0,0)', opacity: 0.1 },
        ],
        { duration: 5000 + Math.random() * 5000, iterations: Infinity, easing: 'ease-in-out' }
      );
      document.body.appendChild(el);
      particles.push(el);
    }
    return () => particles.forEach((p) => p.remove());
  }, []);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Please enter a valid email.';
    if (password.length < 8)
      newErrors.password = 'Password must be at least 8 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // TODO: wire up real auth
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
  };

  return (
    <div className={styles.card} ref={cardRef}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <h1 className={styles.heading}>Join KiteCine</h1>
        <p className={styles.subheading}>Experience the future of cinema.</p>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>

        {/* Full Name */}
        <div className={styles.fieldGroup}>
          <label htmlFor="fullName" className={styles.label}>Full Name</label>
          <input
            id="fullName"
            type="text"
            className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: undefined })); }}
            autoComplete="name"
          />
          {errors.fullName && <span className={styles.errorMsg}>{errors.fullName}</span>}
        </div>

        {/* Email */}
        <div className={styles.fieldGroup}>
          <label htmlFor="signupEmail" className={styles.label}>Email Address</label>
          <input
            id="signupEmail"
            type="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            placeholder="name@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
            autoComplete="email"
          />
          {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
        </div>

        {/* Password */}
        <div className={styles.fieldGroup}>
          <label htmlFor="signupPassword" className={styles.label}>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              id="signupPassword"
              type={showPassword ? 'text' : 'password'}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
            >
              <span className="material-symbols-outlined">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {/* Password strength bar */}
          {password.length > 0 && (
            <div className={styles.strengthBar}>
              <div
                className={`${styles.strengthFill} ${
                  password.length < 6
                    ? styles.strengthWeak
                    : password.length < 10
                    ? styles.strengthFair
                    : styles.strengthStrong
                }`}
              />
              <span className={styles.strengthLabel}>
                {password.length < 6 ? 'Weak' : password.length < 10 ? 'Fair' : 'Strong'}
              </span>
            </div>
          )}
          {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
        </div>

        {/* Terms */}
        <p className={styles.terms}>
          By creating an account you agree to our{' '}
          <button type="button" className={styles.termsLink}>Terms of Service</button>
          {' '}and{' '}
          <button type="button" className={styles.termsLink}>Privacy Policy</button>.
        </p>

        {/* Submit */}
        <button
          type="submit"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting && <span className={styles.spinner} aria-hidden="true" />}
          {isSubmitting ? 'Creating Account…' : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerLabel}>OR REGISTER WITH</span>
        <span className={styles.dividerLine} />
      </div>

      {/* SSO */}
      <div className={styles.ssoGrid}>
        <button className={styles.ssoBtn} type="button" aria-label="Continue with Google">
          <GoogleIcon />
          <span>Google</span>
        </button>
        <button className={styles.ssoBtn} type="button" aria-label="Continue with Apple">
          <AppleIcon />
          <span>Apple</span>
        </button>
      </div>

      {/* Log in link */}
      <p className={styles.loginText}>
        Already have an account?{' '}
        <button type="button" className={styles.loginLink} onClick={onLogIn}>
          Log In
        </button>
      </p>
    </div>
  );
};

export default SignUpForm;
