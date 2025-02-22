import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export function catchAsync(
  fn: (
    arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    arg1: Response<any, Record<string, any>>,
    arg2: NextFunction
  ) => Promise<any>
) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch((e: any) => next(e));
  };
}
