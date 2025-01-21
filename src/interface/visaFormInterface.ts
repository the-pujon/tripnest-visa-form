export interface IFileUpload{
    file: File | null;
    name: string;
    uploaded: boolean;
    uploadTime?: Date | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    size?: any;
}


export interface IGeneralDocuments{
    passportCopy: IFileUpload
    passportPhoto: IFileUpload
    bankStatement: IFileUpload
    bankSolvency: IFileUpload
    visitingCard: IFileUpload
    hotelBooking: IFileUpload
    airTicket: IFileUpload
}


export interface IBuisnessDocuments{
    tradeLicense: IFileUpload
    notarizedId: IFileUpload
    memorandum: IFileUpload
    officePad: IFileUpload
}

export interface IVisaForm{
    givenName: string
    surname: string
    phone: string
    email: string
    address: string
    notes: string
    visaType: string
    generalDocuments: IGeneralDocuments
    businessDocuments?: IBuisnessDocuments
}
