export type VisaType = 'business' | 'student' | 'jobHolder'| '';

export interface IFileUpload {
    file: File | null;
    name: string;
    uploaded: boolean;
    uploadTime?: string;
    size?: {
      current: number;
      total: number;
    };
  }
  
  export interface IGeneralDocuments {
    passportCopy: IFileUpload;
    passportPhoto: IFileUpload;
    bankStatement: IFileUpload;
    bankSolvency: IFileUpload;
    hotelBooking?: IFileUpload;
    airTicket?: IFileUpload;
    previousVisa?: IFileUpload;
    marriageCertificate?: IFileUpload;
  }
  
  export interface IBusinessDocuments {
    tradeLicense?: IFileUpload;
    memorandum?: IFileUpload;
    visitingCard?: IFileUpload;
    companyPad?: IFileUpload;
  }
  
  export interface IStudentDocuments {
    studentId?: IFileUpload;
    leaveLetter?: IFileUpload;
    birthCertificate?: IFileUpload;
  }
  
  export interface IJobHolderDocuments {
    nocCertificate?: IFileUpload;
    officialId?: IFileUpload;
    bmdcCertificate?: IFileUpload;
    barCouncilCertificate?: IFileUpload;
    retirementCertificate?: IFileUpload;
    salaryCertificate?: IFileUpload;
    notarizedId?: IFileUpload;
  }
  
  
  export interface IVisaForm {
    _id?: string;
    givenName: string;
    surname: string;
    phone1: string;
    phone2?: string;
    email: string;
    address: string;
    notes?: string;
    visaType: VisaType;
    generalDocuments?: IGeneralDocuments;
    businessDocuments?: IBusinessDocuments;
    studentDocuments?: IStudentDocuments;
    jobHolderDocuments?: IJobHolderDocuments;
    // otherDocuments?: IOtherDocuments;
  }
  