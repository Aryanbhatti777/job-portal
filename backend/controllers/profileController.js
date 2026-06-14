
import fs from 'fs';
import User from "../models/User.js";
import cloudinary from '../config/cloudinary.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';


export const getMe = async (req, res) => {

    try {
        if (!req.user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                resume: req.user.resume || null
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
}

import multer from "multer";

// Don't use diskStorage - use memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadResume = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "resumes",
                    resource_type: "auto",
                    public_id: `resume_${userId}`,
                    overwrite: true,
                    invalidate: true,
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(req.file.buffer);
        });

        const cloudinaryUrl = result.secure_url;

        const downloadUrl = cloudinary.url(result.public_id, {
            resource_type: result.resource_type,
            flags: "attachment",
            secure: true,
        });

        user.resume = {
            url: cloudinaryUrl,
            downloadUrl,
            public_id: result.public_id,
            originalName: req.file.originalname,
            uploadedAt: new Date(),
        };

        await user.save();
        console.log(result);
        console.log(result.resource_type);
        console.log(result.type);
        console.log(result.secure_url);

        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resume: user.resume,
        });
    } catch (error) {
        console.error("Resume upload error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to upload resume",
        });
    }
};

export const getApplications = async (req, res) => {
    try {

        const applications = await Application.find({
            user: req.user.id
        }).populate(
            "job",
            "title salary location"
        );

        if (applications.length === 0) {
            return res.status(404).json({
                message: "No applications found"
            });
        }

        return res.status(200).json({
            applications
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};