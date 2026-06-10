import Application from "../models/Application.js";
import Job from "../models/Job.js";



export const applyJob = async (req, res) => { 
    try {

        const userId = req.user.id;
        const jobId = req.params.jobId;
        const resume = req.body.resume
        

        // 1. check job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // 2. check duplicate
        const applied = await Application.findOne({
            user: userId,
            job: jobId
        });

        if (applied) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }

        // 3. check resume exists
        if (!resume) {
            return res.status(400).json({
                message: "Resume required to apply"
            });
        }

        // 4. create application
        await Application.create({
            user: userId,
            job: jobId,
            resume: req.body.resume,
            status: "pending"
        });

        return res.status(201).json({
            message: "Applied successfully"
        });
        

    }catch(error){
        return res.status(500).json({
        message: error.message,
      })
    }
}