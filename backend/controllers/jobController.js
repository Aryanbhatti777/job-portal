import Job from "../models/Job.js";
import showError from "../middleware/errorMiddleware.js";


export const AddJob = async (req, res) => {

    try {
        const { title, company, location, salary, description, requirements, jobType } = req.body;

        if (!title || !company || !location || !salary || !description || !requirements || !jobType) {
            return res.status(400).json({
                message: "All fields are mandatory"
            })
        }

        const newJob = await Job.create({
            title,
            company,
            location,
            salary,
            description,
            requirements,
            jobType,
            createdBy: req.user.id
        })

        return res.status(201).json({
            message: "Job successfully created",
            newJob
        })
    } catch (error) {
        return showError(res);
    }
}

export const getJobs = async (req, res) => {

    try {

        const jobs = await Job.find().sort({ createdAt: -1 });

        return res.status(200).json({
            jobs
        })

    } catch (error) {
        return showError(res);
    }
}

export const getJobById = async (req, res) => {

    try {
        let id = req.params.id;

        let job = await Job.findById(id)

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            })
        }

        return res.status(200).json({
            job
        })
    } catch (error) {
        return showError(res);
    }
}

export const updateJob = async (req,res) => {

    try {
        
    const id = req.params.id;

    const { title, company, location, salary, description, requirements, jobType } = req.body;

    if (!title || !company || !location || !salary || !description || !requirements || !jobType) {
        return res.status(400).json({
            message: "All fields are mandatory"
        })
    }

    const updatedJob = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        salary: req.body.salary,
        description: req.body.description,
        requirements: req.body.requirements,
        jobType: req.body.jobType,
        status: req.body.status
    };

    const job = await Job.findByIdAndUpdate(id, updatedJob, {
        new : true
    })

    if(!job){
        return res.status(404).json({
            message: "job not found"
        })
    }

    return res.status(200).json({
        job
    })

    } catch (error) {
        showError(res)
    }
}

