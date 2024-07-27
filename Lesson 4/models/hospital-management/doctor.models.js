import mongoose from 'mongoose';


// in which hospital how many hours the particular doctor serve

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    experienceInYears: {
        type: Number,
        default: 0
    },
    worksInHospitals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hospital'
        }
    ]
},{timestamps:true});

export const Doctor = mongoose.model('Doctor',doctorSchema);