import Job from "../models/Job.js";


export const AddJob = async (req,res) => {

    try {
        const {title, company, location, salary, description, requirements, jobType} = req.body;

    if(!title || !company || !location || !salary || !description || !requirements || !jobType){
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
        createdBy : req.user.id
    })

    return res.status(201).json({
        message: "Job successfully created",
        newJob
    })
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        })
    }
}