import React, { useEffect, useRef, useState } from 'react';
import styles from './ForgotPasswordForm.module.css';

interface ForgotPasswordFormProps {
  onBackToLogin?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className={styles.card} ref={cardRef}>
      {/* Icon */}
      <div className={styles.iconContainer}>
        <span className="material-symbols-outlined">lock_reset</span>
      </div>

      {/* Header */}
      <div className={styles.cardHeader}>
        <h1 className={styles.heading}>Reset Your Password</h1>
        <p className={styles.subheading}>
          {isSuccess
            ? "We've sent a reset link to your email."
            : "Enter the email address associated with your account and we'll send you a link to reset your password."}
        </p>
      </div>

      {!isSuccess ? (
        /* Form */
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldGroup}>
            <label htmlFor="forgotEmail" className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="forgotEmail"
                type="email"
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                autoComplete="email"
              />
              <div className={styles.focusUnderline} />
            </div>
            {error && <span className={styles.errorMsg}>{error}</span>}
          </div>

          <button
            type="submit"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting && <span className={styles.spinner} aria-hidden="true" />}
            {isSubmitting ? 'Sending Link…' : 'Send Reset Link'}
          </button>
        </form>
      ) : (
        /* Success Actions */
        <div className={styles.successActions}>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={onBackToLogin}
          >
            Return to Login
          </button>
        </div>
      )}

      {/* Back to Login Link */}
      {!isSuccess && (
        <div className={styles.backContainer}>
          <button type="button" className={styles.backLink} onClick={onBackToLogin}>
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
