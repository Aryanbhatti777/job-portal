import Application from "../models/Application.js"
import Job from "../models/Job.js";


export const showApplications = async (req,res) => {
    try {

        const job = await Job.findById(req.params.id);

        if(!job){
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

        if(apps.length === 0){
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