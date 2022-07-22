import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { BlogDto, ErrorDto } from "../dto";
import { Blog } from "../models";
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
    const { title, description, isActive } = <BlogDto>req.body;
    const imageName = req.file?.filename || "";
    const filePath = req.file?.path || "";
    const resizedImageName = `resized-${imageName}`;

    await sharp(filePath)
      .resize(500)
      .jpeg({ quality: 90 })
      .toFile(path.resolve("uploads", resizedImageName));
    fs.unlinkSync(filePath);

    const imageUrl = `${API_URL}/${resizedImageName}`;
    const blog = await Blog.create({
      title,
      description,
      isActive,
      image: resizedImageName,
      imageUrl,
    });

    return res.status(201).send(blog);
  } catch (error) {
    console.log({ error });
    return next(
      new createHttpError.InternalServerError("Something Went Wrong")
    );
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await Blog.find();
    return res.status(200).send(blogs);
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
    const blog = await Blog.findOne({ _id: id });
    if (!blog) return next(new createHttpError.NotFound("blog doesn't exist"));
    return res.status(200).send(blog);
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
    const checkBlog = await Blog.findOne({ _id: id });
    if (!checkBlog)
      return next(new createHttpError.NotFound("blog doesn't exist"));

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
      fs.unlinkSync(path.resolve("uploads", checkBlog.image));
    } else {
      resizedImageName = checkBlog.image;
      imageUrl = checkBlog.imageUrl;
    }
    const { title, description, isActive } = <BlogDto>req.body;

    const blog = await Blog.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
        isActive,
        image: resizedImageName,
        imageUrl,
      },
      { new: true }
    );

    return res.status(201).send(blog);
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
    const checkBlog = await Blog.findOne({ _id: id });
    if (!checkBlog)
      return next(new createHttpError.NotFound("blog doesn't exist"));
    const imageName = checkBlog?.image;
    await Blog.deleteOne({ _id: id });
    fs.unlinkSync(path.resolve("uploads", imageName));
    return res.status(200).send({ msg: "deleted successfully" });
  } catch (error) {
    return next(
      new createHttpError.InternalServerError("Something Went Wrong")
    );
  }
};

const blogController = {
  create,
  list,
  getById,
  update,
  deleteById,
};

export default blogController;
