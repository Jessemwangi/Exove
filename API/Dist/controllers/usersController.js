import { Roles, Users, WorksReports } from "../dbcontext/dbContext.js";
const getUser = async (req, res) => {
    Users.find({})
        .populate({
        path: 'workId',
        model: WorksReports,
        populate: {
            path: 'userId',
            model: Users,
            populate: {
                path: 'roleId',
                model: Roles
            }
        }
    })
        .exec((err, users) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(users);
    });
};
//# sourceMappingURL=usersController.js.map