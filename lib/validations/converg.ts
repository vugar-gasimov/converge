import * as z from "zod";

export const ConvergValidation = z.object({
  converg: z
    .string()
    .nonempty()
    .min(3, { message: "Minimum length 3 characters." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  converg: z
    .string()
    .nonempty()
    .min(3, { message: "Minimum length 3 characters." }),
});
