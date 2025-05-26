// src/utils/displayFormatters.ts
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  try {
    // Check if the dateString is already a Date object
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    // Check if the date is valid after parsing
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    return date.toLocaleDateString();
  } catch (e) {
    // This catch block might be redundant if the getTime check is robust
    return 'Invalid Date';
  }
};

export const truncateUserId = (userId: string, length = 15): string => {
  if (!userId) return '';
  return userId.length > length ? userId.substring(0, length) + '...' : userId;
};
