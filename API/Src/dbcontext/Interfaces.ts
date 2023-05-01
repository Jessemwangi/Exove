export interface IQCategory {
  _id: String,
  categoryName: String,
  description?:String,
  questions?: String[];
  createdOn: Date,
  createdBy: String,
  categoryStatus:Boolean,
}

export interface IQuestion {
  _id: String;
  category: String,
  createdBy: String,
  createdOn: Date;
  active: Boolean,
  type: String,
  question: IQuestionLang[];// hold an array of questions
}

interface IQuestionLang{
  _id:String,
  lang: String,
  question?: String,
  answer?: String
  answeredOn?:Date,
}

// questions ends 

export interface IApprovals {
  _id: String,
  createdOn: Date,
  createdBy: String, // from which user, automatically selects current user
  applicationId: String, // will get the primary key of the activity awaiting approval
  entityname: String, // this will come from entitynamemodel, so as to identify what activity this approval belong to
  approverLevel:Number,
  ApprovalStatus: Boolean,
  approvedBy: String,
  ApprovedOn: Date | null,
  sendNotification: Boolean,
}

// Approval interfance ends ...

export interface IEntityName {
  _id: String;
  name: String; // the name here represent the model name, eg for Uses, Roles etc
  description: String; // describes  the entity, eg selected five person to get feed, approve selected feedback, report generated, etc
  approverRole: String;
  transacteOn:Date,
}

//EntityName interface ends ...

// feedback interface
export interface IFeedBacks {
  _id: String;
  template: String;
  userId: String; // session logged in user
  requestpicksId: String; // feedback to from the dashboard
  roleLevel:Number,
  feedbackTo:String,
  progress: String;
  responseByDate?: String;
  responseDateLog: Date[]; // any time and update is made the date will be logged here
  categories: IFCategory[];
  createdOn: Date;
  submitted: Boolean;
  submittedOn?: Date;
}
export interface IFCategory{
  category: String;
  questions:IQuestionLang,

}

// fed back interface ends ...

export interface ILogs {
  _id: String;
  userId: String;
  activity: String;
  transacteOn: Date;
}

//Logs interface ends

//Notification interface start
export interface INotificationsSetting {
  _id: String;
  userid: String;
  entityname: String[]; // this will get model name eg, question, category etc so that to enable or disable notification from this entity
  notisettingstatus: Boolean; //enable or disable notification from this entity
  email: String; // this will be used as alternative email if the found
  enableReminder: Boolean; // if set to true automatic reminder will be send
}

export interface INotifier {
  _id: String;
  applicationid: String; // primary key from the model
  entityname: String; // this will get model name eg, question, category etc and from it get the notification message and activity namee
  message: String;
  link: String;
  from: String; // from
  to: String[], // notification will be send to user, and this user must have enabled notification in 'notisetting'
  notifierstatus: Boolean,
  sendOn:Date | null,
  transacteOn: Date;
}

// Notification interface ends ..


// RequestPicks interface  start
export interface IRequestPicks {
  _id: String,
  requestedTo: String, // the person who will recieve and select five individual to give  him /her feedback.
  requestedBy: String, // user in the role of Hr or higher level
  requestedOn: Date,
  SelectedList: ISelectedList[], // an array of user select to give feedback, Hr can increase this number endless,
  submitted: Boolean,
  submittedOn: Date | null,
}

export interface ISelectedList {
  userId: String;
  roleLevel:Number,
  selectionStatus: Boolean; // allow the HR to approve or disapprove,
  selectedBy: String;
  feedBackSubmitted:Boolean,
}

// RequestPicks interface ends

export interface IRoles {
  _id: String;
  roleName: String;
  roleLevel: Number;
  roleStatus: Boolean;
  createBy: String;
  users?:String[];
  createdOn: Date;
}


// roles interface ends ..

export interface ITemplates {
  _id: String;
  templateTitle: String;
  instructions:String,
  createdOn: Date,
  createdBy:String
  categories: ICat_Quest[];
  active: Boolean;
}

export interface ICat_Quest{
  category: String,
  questions:String[],
}
// templates inteface ends ..

export interface IUserRoles {
  _id: String;
  userId: String;
  roleId: String;
}

// userroles interface ends ..

export interface IUser {
  _id: String;
  firstName: { type: String; required: true };
  surname: { type: String; required: true };
  ldapUid: { type: String; required: true };
  rolesId:String,
  email: {
    type: String;
    required: true;
  };
  displayName: String;
    imageUrl?:String,
  //   personal:  { type: String, required: true },
  //   about: [{ type: mongoose.Schema.Types.ObjectId, ref: "About" }],
  workId: IWorksReport[];
  title?: String;
  department?: String;
  site?: String;
  startDate?: Date | null;
  phone?: String;
  userStatus: Boolean;
}

export interface IWorksReport {
  reportsTo: String;
  workReportStatus: Boolean;
  createdOn: Date | null;
  deactivatedOn: Date | null;
}

export interface ILdapAuth {

  dn: string,
  uid: string,
  sn:string,
  controls: string[],
  objectClass:string[],
  mail:string,
  cn: string,
  
}

export interface userSearch{
  _id?: String,
  ldapUid?:string,
}