import { Router } from "express";
import { login, logOut, refresh, register } from "../controllers/authController.js";
import { celebrate } from "celebrate";
import { loginUserSchema, registerUserSchema } from "../validations/authValidation.js";

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), register);

router.post('/auth/login', celebrate(loginUserSchema), login);

router.post('/auth/refresh', refresh);

router.post('/auth/logout', logOut);




