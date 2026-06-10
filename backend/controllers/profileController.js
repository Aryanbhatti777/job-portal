
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
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
}

export const uploadResume = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a file"
            });
        }

        const user = await User.findById(userId);


        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "resumes",
            resource_type: "raw"
        });

        console.log("Before delete:", req.file.path);

        fs.unlinkSync(req.file.path);
console.log("File deleted");

        user.resume = {
            url: result.secure_url,
            public_id: result.public_id
        };

        await user.save();

        return res.status(200).json({
            message: "Resume uploaded successfully",
            resume: user.resume
        });

    } catch (error) {
        return res.status(500).json({
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