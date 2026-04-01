
export const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const ACCESS_TOKEN_EXPIRATION = '20h'; 
export const MULTI_STEP_REGISTRATION_TOKEN_EXPIRATION = '20h';
export const REFRESH_TOKEN_EXPIRATION = {
  value: 30,
  unit: 'days'
};

// Helper function to add time based on unit
export const addRefreshTokenTime = (date: Date) => {
  const { addMinutes, addDays } = require('date-fns');
  return REFRESH_TOKEN_EXPIRATION.unit === 'days' 
    ? addDays(date, REFRESH_TOKEN_EXPIRATION.value)
    : addMinutes(date, REFRESH_TOKEN_EXPIRATION.value);
}; 
export const PASSWORD_RESET_TOKEN_EXPIRATION = '20h';
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REQUIREMENTS = [
  /[a-z]/, // lowercase
  /[A-Z]/, // uppercase
  /\d/, // digit 
];
export const PASSWORD_REQUIREMENTS_MESSAGE =
  'Password must be at least 8 characters long and include lowercase letters, uppercase letters, and numbers.';