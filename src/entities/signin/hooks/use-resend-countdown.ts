import { useCallback, useEffect, useState } from 'react';

const RESEND_COUNTDOWN_SECONDS = 60;

export function useResendCountdown(active: boolean) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COUNTDOWN_SECONDS);
  const canResend = secondsLeft === 0;

  const restart = useCallback(() => {
    setSecondsLeft(RESEND_COUNTDOWN_SECONDS);
  }, []);

  useEffect(() => {
    if (!active) {
      return;
    }

    restart();
  }, [active, restart]);

  useEffect(() => {
    if (!active || canResend) {
      return;
    }

    const timerId = setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [active, canResend]);

  return {
    secondsLeft,
    canResend,
    restart,
  };
}
