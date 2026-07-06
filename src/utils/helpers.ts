export const calculateAge = (dob?: string) => {
  if (!dob) return 25;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};
