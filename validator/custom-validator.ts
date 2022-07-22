import { NextFunction } from "express";
import createHttpError from "http-errors";

export const isValidImage = (file: any, next: NextFunction) => {
  if (!file) {
    next(new createHttpError.UnprocessableEntity("image is required"));
    return false;
  }
  //   const extension = file.filename.split(".")[1];
  //   console.log("====", extension);
  //   if (extension !== ("jpg" || "jpeg" || "png")) {
  //     next(
  //       new createHttpError.UnprocessableEntity(
  //         "jpg, jpeg, png formats are accepted"
  //       )
  //     );
  //     return false;
  //   }

  return true;
};
