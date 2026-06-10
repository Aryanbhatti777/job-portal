import Application from "../models/Application.js"
import Job from "../models/Job.js";


export const showApplications = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const apps = await Application.find({
            job: req.params.id
        }).populate(
            "user",
            "name email"
        );

        if (apps.length === 0) {
            return res.status(404).json({
                message: "No applications found"
            });
        }

        return res.status(200).json({
            applications: apps
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const changeStatus = async (req, res) => {
    try {

        const app = await Application.findById(req.params.id);

        if (!app) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        const status = req.body.status;

        const allowed = ["approved", "rejected"];

        if (!allowed.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        app.status = status;
        await app.save();

        return res.status(200).json({
            message: "Status updated successfully",
            application: app
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const getMyJobs = async (req, res) => {
    try {

        const jobs = await Job.find({
            createdBy: req.user.id
        });

        return res.status(200).json({
            jobs
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};