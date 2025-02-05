const projects = require("../models/projectModel");

// add projects
exports.addProjectController = async (req, res) => {
    console.log("inside addProjectController")
    const userId = req.userId
    console.log(userId)
    const { title, languages, overview, website, github } = req.body
    const projectImg = req.file.filename
    try {
        const existingProject = await projects.findOne({ github })
        if (existingProject) {
            res.status(406).json("Project already exists in our collection... Please upload another One!!!")
        } else {
            const newProject = new projects({
                title, languages, overview, github, website, projectImg, userId
            })
            await newProject.save()
            res.status(200).json(newProject)
        }
    } catch (error) {
        res.status(401).json(err)
    }
}

// get Home Projects - no need for authorization
exports.homePageProjectController = async (req, res) => {
    console.log("Inside homePageProjectController");
    try {
        const allHomeProjects = await projects.find().limit(3)
        res.status(200).json(allHomeProjects);
    } catch (error) {
        res.status(401).json(error)
    }
}

// get all Projects - need of authorization
exports.allProjectController = async (req, res) => {
    const searchkey = req.query.search
    console.log(searchkey)
    console.log("Inside allProjectController");
    const query = {
        languages: {
            $regex: searchkey, $options: 'i'
        }
    }
    try {
        const allProjects = await projects.find(query)
        res.status(200).json(allProjects);
    } catch (error) {
        res.status(401).json(error)
    }
}

// get user Projects - need of authorization
exports.userProjectController = async (req, res) => {
    console.log("Inside userProjectController");
    const userId = req.userId
    try {
        const allUserProjects = await projects.find({ userId })
        res.status(200).json(allUserProjects);
    } catch (error) {
        res.status(401).json(error)
    }
}

// edit project - need of authorization
exports.editProjectController = async (req, res) => {
    console.log("Inside editProjectController");
    const id = req.params.id
    const userId = req.userId
    const { title, languages, overview, github, website, projectImg } = req.body
    const reUploadProjectImg = req.file ? req.file.filename : projectImg
    try {
        const updateProject = await projects.findByIdAndUpdate({ _id: id }, {
            title, languages, overview, github, website, projectImg: reUploadProjectImg, userId
        }, { new: true })
        await updateProject.save()
        res.status(200).json(updateProject);
    } catch (error) {
        res.status(401).json(error)
    }
}

// delete project - need of authorization
exports.removeProjectController = async (req, res) => {
    console.log("Inside removeProjectController");
    const id = req.params.id
    try {
        const deleteProject = await projects.findByIdAndDelete({ _id: id })
        res.status(200).json(deleteProject);
    } catch (error) {
        res.status(401).json(error)
    }
}