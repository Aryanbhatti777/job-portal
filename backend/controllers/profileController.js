
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
        console.log("=== Upload Resume Started ===");
        console.log("User ID:", userId);
 
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized - No user ID"
            });
        }
 
        if (!req.file) {
            console.log("No file received");
            return res.status(400).json({
                message: "Please upload a file"
            });
        }
 
        console.log("File received:", req.file.originalname, req.file.size);
 
        const user = await User.findById(userId);
 
        if (!user) {
            console.log("User not found in database");
            return res.status(404).json({
                message: "User not found"
            });
        }
 
        console.log("Starting Cloudinary upload...");
 
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "resumes",
                    resource_type: "auto",  // ✅ Auto-detect file type
                    public_id: `resume_${userId}`,
                    overwrite: true,
                    invalidate: true
                },
                (error, result) => {
                    if (error) {
                        console.error("❌ Cloudinary error:", error);
                        reject(error);
                    } else {
                        console.log("✅ Cloudinary upload success");
                        console.log("Secure URL:", result.secure_url);
                        resolve(result);
                    }
                }
            );
 
            uploadStream.on('error', (err) => {
                console.error("Upload stream error:", err);
                reject(err);
            });
 
            uploadStream.end(req.file.buffer);
        });
 
        // ✅ Create URLs for display and download
        const cloudinaryUrl = result.secure_url;  // Original Cloudinary URL
        const viewableUrl = cloudinaryUrl + "?fl_inline";  // Add ?fl_inline for inline display
 
        console.log("Cloudinary URL:", cloudinaryUrl);
        console.log("Viewable URL:", viewableUrl);
 
        // ✅ Store BOTH URLs in database
        user.resume = {
            url: viewableUrl,  // For viewing (with ?fl_inline)
            cloudinaryUrl: cloudinaryUrl,  // For downloading (original)
            public_id: result.public_id,
            originalName: req.file.originalname,
            uploadedAt: new Date()
        };
 
        await user.save();
        console.log("✅ Resume saved to database");
 
        const updatedUser = await User.findById(userId);
 
        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resume: updatedUser.resume  // ✅ Return both URLs
        });
 
    } catch (error) {
        console.error("❌ Resume upload error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to upload resume"
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