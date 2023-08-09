import { signInWithGithub, singInPost } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signInSchema } from "@/schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter
.post("/sign-in", validateBody(signInSchema), singInPost)
.post("/sign-in/github", signInWithGithub)

export { authenticationRouter };
