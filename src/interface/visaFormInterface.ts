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
    visitingCard: IFileUpload;
    hotelBooking: IFileUpload;
    airTicket: IFileUpload;
  }
  
  export interface IBusinessDocuments {
    tradeLicense?: IFileUpload;
    notarizedId?: IFileUpload;
    memorandum?: IFileUpload;
    officePad?: IFileUpload;
  }
  
  export interface IStudentDocuments {
    studentId?: IFileUpload;
    travelLetter?: IFileUpload;
    birthCertificate?: IFileUpload;
  }
  
  export interface IJobHolderDocuments {
    nocCertificate?: IFileUpload;
    officialId?: IFileUpload;
    bmdcCertificate?: IFileUpload;
    barCouncilCertificate?: IFileUpload;
    retirementCertificate?: IFileUpload;
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
    generalDocuments?: Record<string, IFileUpload>;
    businessDocuments?: IBusinessDocuments;
    studentDocuments?: IStudentDocuments;
    jobHolderDocuments?: IJobHolderDocuments;
    // otherDocuments?: IOtherDocuments;
  }
  