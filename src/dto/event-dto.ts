export interface EventDto {
  _id?: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  image: string;
  description: string;
  isActive?: boolean;
}
