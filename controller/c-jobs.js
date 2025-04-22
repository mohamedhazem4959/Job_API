const Jobs = require('../models/jobs-Schema')
const { StatusCodes } = require('http-status-codes')
const BadReq = require('../errors/BadReq')
const notFound = require('../errors/notFound')
const jobsSchema = require('../models/jobs-Schema')

// get all jobs of a specific user
const getAllJobs = async (req, res) => {
    const jobs = await Jobs.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req

    const job = await Jobs.findOne({
        _id: jobId, createdBy: userId
    })
    if (!job) {
        throw new notFound(`No job with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}


// create job for a specific user
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Jobs.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

//update job for a specific user
const updateJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId }
    } = req

    if (company === '' || position === '') {
        throw new BadReq('company or position fields cannot be empty')
    }
    const job = await Jobs.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true , runValidators: true })

    if (!job) {
        throw new notFound('this job is not found')
    }
    res.status(StatusCodes.OK).json({ job })
}
//delete job for a specific user
const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId }
    } = req

    const job = await Jobs.findOneAndDelete({ _id: jobId , createdBy: userId })
    
    if (!job) {
        throw new notFound('this job is not found')
    }
    res.status(StatusCodes.OK).json({ job })
}


module.exports =
{
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}