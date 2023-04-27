import mongoose from "mongoose";
export const usersSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    ldapUid: { type: String, required: true },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    displayName: String,
    imageUrl: String,
    rolesId: { type: mongoose.Schema.Types.String, ref: "Roles", required: true },
    workId: [
        {
            reportsTo: { type: mongoose.Schema.Types.String },
            workReportStatus: Boolean,
            createdOn: Date,
            deactivatedOn: Date,
        },
    ],
    title: String,
    department: String,
    site: String,
    startDate: Date,
    phone: String,
    userStatus: Boolean,
});
//# sourceMappingURL=usersModel.js.map