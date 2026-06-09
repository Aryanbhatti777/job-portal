import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    company: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    salary: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
    },

    requirements: {
      type: [String],
      required: true,
    },

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
      default: "Full-Time",
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;