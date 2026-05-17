export function formatLocalDate(dateInput: string | Date | null): string {
  if (!dateInput) return ''
  
  let dateString = ''
  if (dateInput instanceof Date) {
    dateString = dateInput.toISOString().split('T')[0]
  } else {
    dateString = dateInput.split('T')[0]
  }
  
  const parts = dateString.split('-')
  if (parts.length !== 3) return dateInput.toString() // Fallback if not standard YYYY-MM-DD
  
  const [year, month, day] = parts.map(Number)
  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateInput.toString()
  
  // Construct in user's local timezone
  const localDate = new Date(year, month - 1, day)
  
  return localDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
