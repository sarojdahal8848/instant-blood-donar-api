import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { EventDto } from "../dto";
import { Event } from "../models";
import { API_URL } from "../config";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { isValidImage } from "../../validator";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send(errors.array());
    }
    if (!isValidImage(req.file, next)) return false;
    const { title, description, venue, date, time, isActive } = <EventDto>(
      req.body
    );
    const imageName = req.file?.filename || "";
    const filePath = req.file?.path || "";
    const resizedImageName = `resized-${imageName}`;

    await sharp(filePath)
      .resize(500)
      .jpeg({ quality: 90 })
      .toFile(path.resolve("uploads", resizedImageName));
    fs.unlinkSync(filePath);

    const imageUrl = `${API_URL}/${resizedImageName}`;
    const event = await Event.create({
      title,
      description,
      venue,
      date,
      time,
      isActive,
      image: resizedImageName,
      imageUrl,
    });

    return res.status(201).send(event);
  } catch (error) {
    console.log({ error });
    return next(
      new createHttpError.InternalServerError("Something Went Wrong")
    );
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Events = await Event.find();
    return res.status(200).send(Events);
  } catch (error) {
    return next(
      new createHttpError.InternalServerError("Something Went Wrong")
    );
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send(errors.array());
    }
    const event = await Event.findOne({ _id: id });
    if (!event)
      return next(new createHttpError.NotFound("Event doesn't exist"));
    return res.status(200).send(event);
  } catch (error) {
    console.log(error);
    return next(
      new createHttpError.InternalServerError("Something Went Wrong")
    );
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send(errors.array());
    }
    const checkEvent = await Event.findOne({ _id: id });
    if (!checkEvent)
      return next(new createHttpError.NotFound("Event doesn't exist"));

    let imageUrl;
    let resizedImageName;
    if (req.file) {
      if (!isValidImage(req.file, next)) return false;
      const imageName = req.file?.filename || "";
      const filePath = req.file?.path || "";
      resizedImageName = `resized-${imageName}`;

      await sharp(filePath)
        .resize(500)
        .jpeg({ quality: 90 })
        .toFile(path.resolve("uploads", resizedImageName));
      fs.unlinkSync(filePath);

      imageUrl = `${API_URL}/${resizedImageName}`;
      fs.unlinkSync(path.resolve("uploads", checkEvent.image));
    } else {
      resizedImageName = checkEvent.image;
      imageUrl = checkEvent.imageUrl;
    }
    const { title, description, venue, date, time, isActive } = <EventDto>(
      req.body
    );

    const event = await Event.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
        venue,
        date,
        time,
        isActive,
        image: resizedImageName,
        imageUrl,
      },
      { new: true }
    );

    return res.status(201).send(event);
  } catch (error) {
    console.log({ error });
    return next(
      new createHttpError.InternalServerError("Something Went Wrong")
    );
  }
};

export const deleteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send(errors.array());
    }
    const checkEvent = await Event.findOne({ _id: id });
    if (!checkEvent)
      return next(new createHttpError.NotFound("event doesn't exist"));
    const imageName = checkEvent?.image;
    await Event.deleteOne({ _id: id });
    fs.unlinkSync(path.resolve("uploads", imageName));
    return res.status(200).send({ msg: "deleted successfully" });
  } catch (error) {
    return next(
      new createHttpError.InternalServerError("Something Went Wrong")
    );
  }
};

const eventController = {
  create,
  list,
  getById,
  update,
  deleteById,
};

export default eventController;
