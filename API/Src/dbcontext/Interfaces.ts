export interface IQCategory {
  _id: string,
  categoryName: string,
  description?:string,
  questions?: string[];
  createdOn: Date,
  createdBy: string,
  categoryStatus?:Boolean,
}

export interface IQuestion {
  _id: string;
  category: string,
  createdBy: string,
  createdOn: Date;
  active: Boolean,
  type: string,
  question: IQuestionLang[];// hold an array of questions
}

interface IQuestionLang{
  _id:string,
  type: string,
  question: string,
  answer: string
  answeredOn:Date,
}

// questions ends 

export interface IApprovals {
  _id: string,
  createdOn: Date,
  createdBy: string, // from which user, automatically selects current user
  applicationId: string, // will get the primary key of the activity awaiting approval
  entityname: string, // this will come from entitynamemodel, so as to identify what activity this approval belong to
  approverLevel:Number,
  ApprovalStatus: Boolean,
  approvedBy: string,
  ApprovedOn: Date | null,
  sendNotification: Boolean,
}

// Approval interfance ends ...

export interface IEntityName {
  _id: string;
  name: string; // the name here represent the model name, eg for Uses, Roles etc
  description: string; // describes  the entity, eg selected five person to get feed, approve selected feedback, report generated, etc
  approverRoleLevel: number;
  transacteOn?: Date;
  createdBy: string;
}

//EntityName interface ends ...

// feedback interface
export interface IFeedBacks {
  _id: string;
  template: string;
  userId: string; // session logged in user
  requestpicksId: string; // feedback to from the dashboard
  roleLevel:Number,
  feedbackTo:string,
  progress: string;
  responseByDate?: string;
  responseDateLog: Date[]; // any time and update is made the date will be logged here
  categories: IFCategory[];
  createdOn: Date;
  submitted: Boolean;
  submittedOn?: Date;
}
export interface IFCategory{
  category: string;
  questions:IQuestionLang[],

}
          
export interface IFCategories{
  category: string;
  questions:IQuestionLang,

}

// fed back interface ends ...

export interface ILogs {
  _id: string;
  userId: string;
  activity: string;
  transacteOn: Date;
}

//Logs interface ends

//Notification interface start
export interface INotificationsSetting {
  _id: string;
  userid: string;
  entityname: string[]; // this will get model name eg, question, category etc so that to enable or disable notification from this entity
  notisettingstatus: Boolean; //enable or disable notification from this entity
  email: string; // this will be used as alternative email if the found
  enableReminder: Boolean; // if set to true automatic reminder will be send
}

export interface INotifier {
  _id: string;
  applicationid: string; // primary key from the model
  entityname: string; // this will get model name eg, question, category etc and from it get the notification message and activity namee
  messageBody: string;
  link: string;
  from: string; // from
  to: string[], // notification will be send to user, and this user must have enabled notification in 'notisetting'
  notifierstatus: Boolean,
  sendOn:Date | null,
  transacteOn?: Date;
  createdBy: string;
}

// Notification interface ends ..


// RequestPicks interface  start
export interface IRequestPicks {
  _id: string,
  template:string,
  requestedTo: string, // the person who will recieve and select five individual to give  him /her feedback.
  requestedBy: string, // user in the role of Hr or higher level
  requestedOn: Date,
  SelectedList: ISelectedList[], // an array of user select to give feedback, Hr can increase this number endless,
  submitted: Boolean,
  submittedOn: Date | null,
}

export interface ISelectedList {
  userId: string;
  roleLevel:Number,
  selectionStatus: Boolean; // allow the HR to approve or disapprove,
  selectedBy: string;
  feedBackSubmitted:Boolean,
}

// RequestPicks interface ends

export interface IRoles {
  _id: string;
  roleName: string;
  roleLevel: Number;
  roleStatus: Boolean;
  createBy: string;
  users?:string[];
  createdOn: Date;
}


// roles interface ends ..

export interface ITemplates {
  _id: string;
  templateTitle: string;
  instructions:string,
  createdOn: Date,
  createdBy:string
  categories: ICat_Quest[];
  active: Boolean;
}

export interface ICat_Quest{
  category: string,
  questions:string[],
}
// templates inteface ends ..

export interface IUserRoles {
  _id: string;
  userId: string;
  roleId: string;
}

// userroles interface ends ..

export interface IUser {
  _id: string;
  firstName: { type: string; required: true };
  surname: { type: string; required: true };
  ldapUid: { type: string; required: true };
  rolesId:string,
  email: {
    type: string;
    required: true;
  };
  displayName: string;
    imageUrl?:string,
  //   personal:  { type: string, required: true },
  //   about: [{ type: mongoose.Schema.Types.ObjectId, ref: "About" }],
  workId: IWorksReport[];
  title?: string;
  department?: string;
  site?: string;
  startDate?: Date | null;
  phone?: string;
  userStatus: Boolean;
}

export interface IWorksReport {
  reportsTo: string;
  workReportStatus: Boolean;
  createdOn: Date | null;
  deactivatedOn?: Date | null;
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
  _id?: string,
  ldapUid?:string,
}

export interface IVerifyFeedRole{
  requestpicksId: string,
  feedbackTo: string,
  userId: string,
  roleLevel:Number
}

export interface IReports{
  _id:string,
  feedbacks:string[],
  template:string,
  createdBy?:string,
  userId: string,
  requestPicks: string,
  createdOn?: Date,
}

//// Reportting interfaces

export interface ReportWithDetails extends IReports {

  requestPicksSelectedList: ISelectedList[];
  totalCategories: Number;
  totalQuestions: Number;
  categories: {
    _id: string;
    categoryName: string;
    totalQuestions: Number;
    questions: IQuestion[];
  }[];
  feedbacks: string[];
  totalSelectedList: number;
}
