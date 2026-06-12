
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

        console.log("========== RESUME UPLOAD START ==========");
        console.log("User ID:", userId);
        console.log("File:", req.file);

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a file"
            });
        }

        const user = await User.findById(userId);

        console.log("User found:", !!user);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        console.log("Starting Cloudinary upload...");

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "resumes",
                    resource_type: "raw",
                    public_id: `resume_${userId}`,
                    overwrite: true,
                    invalidate: true
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(req.file.buffer);
        });

        console.log("Result secure_url:", result.secure_url);
        console.log("Result public_id:", result.public_id);

        

        user.resume = {
            url: result.secure_url,
            public_id: result.public_id,
            originalName: req.file.originalname,
            uploadedAt: new Date()
        };

        await user.save();

        console.log("Saving user...");

        await user.save();

        console.log("User saved");

        const updatedUser = await User.findById(userId);

        console.log(
            "Resume in DB:",
            updatedUser.resume
        );

        console.log("========== RESUME UPLOAD END ==========");

        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resume: updatedUser.resume
        });

    } catch (error) {
        console.error("UPLOAD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
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