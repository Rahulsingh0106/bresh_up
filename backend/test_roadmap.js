const mongoose = require('mongoose');
const RoadmapProgress = require('./models/RoadmapProgress');
async function test() {
    await mongoose.connect('mongodb+srv://bresh_up_new:cZ6p6A8c8bB9nS7u@cluster0.a4pwt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    const all = await RoadmapProgress.find();
    console.log(all);
    process.exit();
}
test();
