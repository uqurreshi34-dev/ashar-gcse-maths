export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number; // index
  working: string;
  hint: string;
}

export const equationQuestions: Question[] = [
  {
    id: 1,
    question: "Rearrange to make x the subject: y = 3x + 5",
    options: ["x = (y + 5) / 3", "x = (y − 5) / 3", "x = y − 5 + 3", "x = 3y − 5"],
    correct: 1,
    working: "Start with y = 3x + 5. Subtract 5 from both sides: y − 5 = 3x. Divide both sides by 3: x = (y − 5) / 3",
    hint: "To isolate x, first get rid of the + 5 by doing the opposite operation to both sides.",
  },
  {
    id: 2,
    question: "Rearrange to make u the subject: v = u + at",
    options: ["a = (v − u) / t", "t = v − u / a", "u = v − at", "u = v + at"],
    correct: 2,
    working: "v = u + at. Subtract at from both sides: u = v − at",
    hint: "u has something added to it on the right. What operation undoes addition?",
  },
  {
    id: 3,
    question: "Rearrange to make r the subject: A = πr²",
    options: ["r = A / π", "r = √(A / π)", "r = √(Aπ)", "r = A / √π"],
    correct: 1,
    working: "A = πr². Divide both sides by π: A/π = r². Square root both sides: r = √(A / π)",
    hint: "There are two steps — first deal with the π, then deal with the square.",
  },
  {
    id: 4,
    question: "Rearrange to make x the subject: y = mx + c",
    options: ["x = (y + c) / m", "x = (y − c) / m", "x = y − mc", "x = my − c"],
    correct: 1,
    working: "y = mx + c. Subtract c from both sides: y − c = mx. Divide both sides by m: x = (y − c) / m",
    hint: "Two steps needed — remove c first, then deal with m.",
  },
  {
    id: 5,
    question: "Rearrange to make h the subject: V = lwh",
    options: ["h = V(lw)", "h = lw / V", "h = V / lw", "h = V − l − w"],
    correct: 2,
    working: "V = lwh. Divide both sides by lw: h = V / lw",
    hint: "h is being multiplied by two things. What single operation isolates it?",
  },
  {
    id: 6,
    question: "Rearrange to make t the subject: s = ½at²",
    options: ["t = √(2s / a)", "t = 2s / a", "t = √(s / 2a)", "t = s / 2a"],
    correct: 0,
    working: "s = ½at². Multiply both sides by 2: 2s = at². Divide by a: 2s/a = t². Square root: t = √(2s / a)",
    hint: "t is squared — remember you'll need a square root as your final step.",
  },
  {
    id: 7,
    question: "Rearrange to make x the subject: 4(x − 3) = 20",
    options: ["x = 2", "x = 5", "x = 8", "x = 23"],
    correct: 2,
    working: "4(x − 3) = 20. Divide both sides by 4: x − 3 = 5. Add 3 to both sides: x = 8",
    hint: "Start by dividing both sides by 4 to remove the bracket.",
  },
  {
    id: 8,
    question: "Rearrange to make r the subject: C = 2πr",
    options: ["r = 2πC", "r = C / π", "r = C / 2π", "r = 2C / π"],
    correct: 2,
    working: "C = 2πr. Divide both sides by 2π: r = C / 2π",
    hint: "r is multiplied by two things together. Divide both sides by both of them at once.",
  },
];
