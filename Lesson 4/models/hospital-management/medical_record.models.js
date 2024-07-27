import mongoose from 'mongoose';

const dailyUseSchema = new mongoose.Schema({
    timeOfDay: {
        type: String,
        enum: ['Morning', 'Day', 'Night'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dailyUse: [dailyUseSchema]

});

const medicalRecordSchema = new mongoose.Schema({
    patientName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    medicines: [
        {
            medicine: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Medicine',
                required: true
            },
            dailyUse: [dailyUseSchema]
        }
    ],
    diagnosedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }
},{timestamps:true});

export const MedicalRecord = mongoose.model('MedicalRecord',medicalRecordSchema);