export interface MoodLog {
  id?: string;
  userId?: string;
  entryDate: string;     // "2026-06-27" 格式
  mood: 'bad' | 'mid' | 'good';   // 如果 mood 有固定值，建議用 Union Type
  content: string;
}