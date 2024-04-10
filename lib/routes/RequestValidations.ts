import { body, matchedData, param, validationResult } from 'express-validator';
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

const updateAdmin = () => {
  return [
    body('adminId')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('Admin ID is required'),
    body('email')
      .trim()
      .optional()
      .escape()
      .isEmail()
      .withMessage('Must be a valid email'),
    body('phoneNumber')
      .trim()
      .optional()
      .escape()
      .matches(/^\d{3}-\d{3}-\d{4}$/)
      .withMessage('Phone number must be in the format xxx-xxx-xxxx'),
    body('password')
      .trim()
      .optional()
      .escape()
      .isString(),
    body('firstName')
      .trim()
      .optional()
      .escape()
      .isString(),
    body('lastName')
      .trim()
      .optional()
      .escape()
      .isString()];
};

const blockDeleteAdmin = () => {
  return [
    body('adminId')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('Admin ID is required')];
};

const blockUser = () => {
  return [
    body('userId')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('User ID is required')];
};

const updateUserPoints = () => {
  return [
    body('points')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('Points is required')];
};

const blockPost = () => {
  return [
    body('postId')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('Post ID is required')];
};

const updatePost = () => {
  return [
    body('postId')
      .trim()
      .notEmpty()
      .escape()
      .isString()
      .withMessage('Post ID is required'),
    body('productName')
      .trim()
      .optional()
      .escape()
      .isString()
      .withMessage('Product Name is required'),
    body('oldPrice')
      .trim()
      .escape()
      .optional()
      .isNumeric()
      .withMessage('Old price is required'),
    body('newPrice')
      .trim()
      .escape()
      .optional()
      .isNumeric()
      .withMessage('New price is required'),
    body('oldQuantity')
      .trim()
      .escape()
      .isNumeric()
      .optional()
      .withMessage('Old quantity is required'),
    body('newQuantity')
      .trim()
      .escape()
      .isNumeric()
      .optional()
      .withMessage('New quantity is required'),
    body('productDescription')
      .trim()
      .optional()
      .escape()
      .isString()
      .withMessage('Description must be valid'),
    body('storePlaceId')
      .trim()
      .optional()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('Store PlaceId(Google maps Place Id) must be valid')];
};

const postId = () => {
  return [
    param('postId')
      .trim()
      .notEmpty()
      .escape()
      .isMongoId()
      .withMessage('Post Id is required'),
  ];
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


export { validateErrors, newAdmin, adminSetup, adminLogin, updateAdmin, blockDeleteAdmin, blockUser, blockPost, updatePost, postId, updateUserPoints };
