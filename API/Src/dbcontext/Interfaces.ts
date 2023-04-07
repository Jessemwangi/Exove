export interface IApprovals{
    _id: String,
    createdOn: Date,
    createdBy: String, // from which user, automatically selects current user
    applicationId: String, // will get the primary key of the activity awaiting approval
    entityname: String, // this will come from entitynamemodel, so as to identify what activity this approval belong to
    ApprovalStatus: Boolean,
    approvedBy: String,
    ApprovedOn: Date,
    sendNotification: Boolean,
}
export interface IEntityName{
    _id:String,
    name:String, // the name here represent the model name, eg for Uses, Roles etc
description: String, // describes  the entity, eg selected five person to get feed, approve selected feedback, report generated, etc
approverRole:String,
}

export interface IFeedBacks{

}
export interface ILogs{

}

export interface INotifications{

}

export interface INotificationsSettings{
    
}
export interface questionCats{

}

export interface IQuestions{

}

export interface RequestPicks{

}

export interface Roles{

}

export interface ITemplates{

}
export interface IUserRoles{

}

export interface IUser{

}
