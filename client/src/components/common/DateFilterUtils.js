// Calculates start and end dates based on filter selection and optional custom date values
export function getDateRange(range, customDateValue = null) {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  let startDate = null;
  let endDate = now;

  switch (range) {
    case "all":
      return { startDate: null, endDate: null };
    
    case "today":
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "last7days":
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "week":
      startDate = new Date(now);
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "last3months":
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 3);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "last4months":
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 4);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case "custom":
      if (customDateValue) {
        const [year, month, day] = customDateValue.split('-').map(Number);
        startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
        endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
      }
      break;
    
    case "daterange":
      if (customDateValue && customDateValue.startDate && customDateValue.endDate) {
        const [startYear, startMonth, startDay] = customDateValue.startDate.split('-').map(Number);
        const [endYear, endMonth, endDay] = customDateValue.endDate.split('-').map(Number);
        startDate = new Date(startYear, startMonth - 1, startDay, 0, 0, 0, 0);
        endDate = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);
      } else if (customDateValue && customDateValue.startDate) {
        const [year, month, day] = customDateValue.startDate.split('-').map(Number);
        startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
      } else if (customDateValue && customDateValue.endDate) {
        const [year, month, day] = customDateValue.endDate.split('-').map(Number);
        endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
      }
      break;
    
    default:
      return { startDate: null, endDate: null };
  }

  return { startDate, endDate };
}
