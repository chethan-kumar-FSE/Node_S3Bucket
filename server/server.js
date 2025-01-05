import e from "express";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import sharp from "sharp";
import mongoose from "mongoose";
import { bucket } from "./models/imageModel.js";
import crypto from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const app = e();
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const bucketName = process.env.BUCKET_NAME;
const region = process.env.REGION;
const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

app.use(cors());

app.post("/api/v1/post", upload.single("image"), async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer();
  const token = crypto.randomBytes(32).toString("hex");
  try {
    const params = {
      Bucket: bucketName,
      Key: token,
      Body: buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);

    const s3Image = await bucket.create({
      imageUrl: token,
      caption: req.body.caption,
    });
    res.status(200).json({
      message: "success",
      data: s3Image,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/v1/get", async (req, res) => {
  try {
    const images = await bucket.find();
    console.log(images);

    const updatedImages = await Promise.all(
      images.map(async (img) => {
        const params = {
          Bucket: bucketName,
          Key: img.imageUrl,
        };
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return { ...img._doc, postUrl: url };
      })
    );

    res.status(200).json({
      message: "success",
      data: updatedImages,
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/v1/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const record = await bucket.findOneAndDelete({ imageUrl: id });

  if (id === undefined || !record) {
    return res.status(409).json({
      message: "Invalid parameters",
    });
  }
  const params = {
    Bucket: bucketName,
    Key: id,
  };

  const command = new DeleteObjectCommand(params);
  await s3.send(command);

  res.status(200).json({
    message: "image is succesfully deleted",
  });
});
app.listen(8080, () => {
  mongoose
    .connect(
      "mongodb+srv://dbUser:vnIlzcm0ZyuI44sn@cluster0.lbx3y.mongodb.net/test"
    )
    .then(() => {
      console.log("connected to DB");
    });

  console.log("server connected to port 8080");
});
