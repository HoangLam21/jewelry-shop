export interface FileContent {
  _id: string;
  fileName: string;
  url: string;
  publicId: string;
  bytes: string;
  width: string;
  height: string;
  format: string;
  type: string;
}

export interface Staff {
  _id: string;
  fullName: string;
  position: string;
  phoneNumber: string;
  email: string;
  address: string;
  avatar: string;
  salary: string;
  enrolledDate: Date;
  createdAt: Date;
  province: string;
  district: string;
  experience: string;
  kindOfJob: string;
  description: string;
  birthday: Date;
  gender: string;
  createAt: Date;
}

export interface CreateStaff {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  avatar: string;
  gender: string;
  birthday: Date;
  enrolledDate: Date;
  salary: string;
  position: string;
  province: string;
  district: string;
  experience: string;
  kindOfJob: string;
  description: string;
}

export interface uploadAvatar {
  _id: string;
  avatar: FileContent;
}
