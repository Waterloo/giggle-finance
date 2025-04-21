export interface StaffDetails {
    status: string
    lastPingedAt: string
    avatarUrl: string
    id: number
    name: string
    nric: string
    gender: string
  }

  export interface RequisitionResponse {
    totalCount:          number;
    page:                number;
    limit:               number;
    requisitionForLists: Requisition[];
    success:             boolean;
    message:             string;
  }
  
  export interface Requisition {
    id:             number;
    eventDate:      Date;
    jobType:        string;
    startTime:      Date;
    endTime:        Date;
    staffRequired:  number;
    acceptedStaffs: Staff[];
  }
  
  export interface Staff {
    status:       string;
    lastPingedAt: Date;
    avatarUrl:    string;
    id:           number;
    name:         string;
    nric:         string;
    gender:       string;
  }
  