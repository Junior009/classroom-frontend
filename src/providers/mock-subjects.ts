import {Subject} from "@/types"

export const mockSubjects: Subject[] = [
  {
    id: 1,
    name: 'Introduction to Computer Science',
    code: 'CS101',
    department: 'Computer Science',
    description: 'Fundamental concepts of programming, algorithms, and computer systems.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Calculus II',
    code: 'MATH201',
    department: 'Mathematics',
    description: 'Techniques of integration, sequences and series, and applications to physical problems.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'World History: Antiquity to Early Modern',
    code: 'HIST150',
    department: 'History',
    description: 'An overview of major civilizations and global interactions from antiquity through the early modern era.',
    createdAt: new Date().toISOString(),
  },
];

export default mockSubjects;
