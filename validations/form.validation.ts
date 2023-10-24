import * as z from 'zod'


const answerSchemaWithPoints = z.object({
  content: z.string().min(5, {
    message: "Fill this input, min. 5 chars",
  }),
  points: z
    .string()
    .min(1, {
      message: "This field is required",
    })
});

// Define a schema for the answer object without points
const answerSchema = z.object({
  content: z.string().min(5, {
    message: "Fill this input, min. 5 chars",
  }),
});

// Define the main schema
export const mainScreenSchema = z.object({
  title: z.string().min(5, {
    message: "Fill this input, min. 5 chars",
  }),
  description: z.string().min(5, {
    message: "Fill this input, min. 5 chars",
  }),
  answers: z.array(answerSchema),
  correct_answers: z.array(z.string()).min(1, {
    message: "Please select",
  }),
});

// Define the schema for when `isScorePointsEnabled` is true
export const mainScreenPointsSchema = z.object({
  title: z.string().min(5, {
    message: "Fill this input, min. 5 chars",
  }),
  description: z.string().min(5, {
    message: "Fill this input, min. 5 chars",
  }),
  answers: z.array(answerSchemaWithPoints),
  correct_answers: z.array(z.string()).min(1, {
    message: "Please select",
  }),
});

export const mainScreenTextboxSchema = z.object({
  title: z.string().min(5, {
    message: "Fill this input, min. 5 chars",
  }),
  description: z.string().min(5, {
    message: "Fill this input, min. 5 chars",
  }),
});

export const finalScreenSchema = z.object({
  title: z.string().min(5, {
    message: "Fill this input, min. 5 chars",
  }),
  description: z.string().min(5, {
    message: "Fill this input, min. 5 chars",
  }),
  points: z.string().min(1, {
    message: "This field is required",
  })
});
