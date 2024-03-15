import { body, matchedData, validationResult } from 'express-validator';
import type { NextFunction, Request, Response } from 'express';
import { httpCodes } from '../constants/http-status-code';
const validPhoneNumber = () => {
  return  [
    body('phoneNumber')
      .trim()
      .notEmpty()
      .escape()
      .matches(/^\d{3}-\d{3}-\d{4}$/)
      .withMessage('Phone number must be in the format xxx-xxx-xxxx')];
};
const newAdmin = () => {
  const validPhoneNumberResult = validPhoneNumber();
  return [
    ...validPhoneNumberResult,
    body('email')
      .trim()
      .notEmpty()
      .escape()
      .isEmail()
      .withMessage('Must be a valid email'),
    body('firstName')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('First Name is required'),
    body('lastName')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('Last Name is required')];
};

const adminSetup = () => {
  const validPhoneNumberResult = validPhoneNumber();
  return [
    ...validPhoneNumberResult,
    body('email')
      .trim()
      .notEmpty()
      .escape()
      .isEmail()
      .withMessage('Must be a valid email'),
    body('oneTimePassword')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('One Time Password is required'),
    body('password')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('Password is required')];
};

const adminLogin = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .escape()
      .isEmail()
      .withMessage('Must be a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('Password is required')];
};
const validateErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const data = matchedData(req);
    req.body['matchedData'] = data;
    return next();
  }
  const extractedErrors: any = [];
  errors.array().map((err: any) => extractedErrors.push({ [err.param || err.path]: err.msg }));
  return res.status(httpCodes.unprocessable_entity).json({
    errors: extractedErrors
  });
};

export { validateErrors, newAdmin, adminSetup, adminLogin };