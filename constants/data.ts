import { CategoryResponse } from "@/dto/CategoryDTO";

interface SaleInvoice {
  id: string;
  customer: string;
  createDate: Date;
  note: string;
  total: number;
  status: number;
}

interface Staff {
  id: string;
  gender: string;
  position: string;
  earning: number;
  phone: string;
  fullname: string;
  dob: Date;
  email: string;
  address: string;
  city: string;
  country: string;
  district: string;
  experience: string;
  kindOfJob: string;
  description: string;
  dow: Date;
  numberSaleInvoice: SaleInvoice[];
}

interface Import {
  id: string;
  suplier: {
    id: string;
    phoneNumber: string;
    fullname: string;
    address: string;
  };
  invoice: {
    id: string;
    productName: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    discount: number;
  }[];
  status: boolean;
  createAt: Date;
  createBy: string;
}

interface ImageInfo {
  url: string;
  fileName: string;
}
interface Sizes {
  size: string;
  stock: number;
}
interface Variant {
  material: string;
  sizes: Sizes[];
  addOn: number;
}
interface Product {
  id: string;
  image: string;
  imageInfo: ImageInfo[];
  productName: string;
  price: string;
  collection: string;
  description: string;
  vouchers: string;
  provider: string;
  category: string;
  variants: Variant[];
}

interface Voucher {
  id: string;
  name: string;
  discount: number;
  expDate: Date;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  createAt: Date;
  productNamme: string;
  size: string;
  material: string;
  comment: string;
  image: string[];
}

interface ImportInvoice {
  id: string;
  createAt: string;
  createBy: string;
  total: number;
  status: number;
}

interface Provider {
  _id: string;
  name: string;
  address: string;
  representativeName: string;
  createAt: Date;
  contact: string;
  city: string;
  country: string;
  email: string;
  numberImportInvoice: ImportInvoice[];
}

export const StaffData: Staff[] = [
  {
    id: "1",
    gender: "male",
    position: "staff",
    earning: 1000000,
    phone: "0122222222",
    fullname: "Doh Kyung Soo",
    dob: new Date("2024-11-24"),
    email: "abc123@gmail.com",
    address: "1/111A Cau Xeo, Tan Son Nhi, Tan Phu",
    city: "Ho Chi Minh",
    country: "Viet Nam",
    district: "Q9",
    experience: "Teaching English 2 years in high school in Britain",
    kindOfJob: "Fulltime job",
    description:
      "The main teacher who directly follows to their students in the class / course",
    dow: new Date("2024-07-13"),
    numberSaleInvoice: [
      {
        id: "1",
        customer: "Oohsehun",
        createDate: new Date("2024-08-24"),
        note: "aaaaaaaaaa",
        total: 1000000,
        status: 0
      },
      {
        id: "2",
        customer: "baoazhn",
        createDate: new Date("2024-08-24"),
        note: "aaaaaaaaaa",
        total: 2000000,
        status: 1
      },
      {
        id: "3",
        customer: "chopper",
        createDate: new Date("2024-08-24"),
        note: "aaaaaaaaaa",
        total: 2500000,
        status: 2
      }
    ]
  },
  {
    id: "2",
    gender: "female",
    position: "staff",
    earning: 2000000,
    phone: "0123333333",
    fullname: "Kim Ji Won",
    dob: new Date("2024-06-15"),
    email: "kimjiwon@gmail.com",
    address: "2/222B Le Duan, Ben Thanh, District 1",
    city: "Ho Chi Minh",
    country: "Viet Nam",
    district: "Q9",
    experience: "5 years as a software engineer in Korea",
    kindOfJob: "Fulltime job",
    description: "Responsible for developing and maintaining web applications",
    dow: new Date("2024-09-10"),
    numberSaleInvoice: [
      {
        id: "1",
        customer: "Luhan",
        createDate: new Date("2024-09-20"),
        note: "good service",
        total: 1500000,
        status: 1
      },
      {
        id: "2",
        customer: "Sehun",
        createDate: new Date("2024-09-20"),
        note: "excellent product",
        total: 3000000,
        status: 0
      }
    ]
  },
  {
    id: "3",
    gender: "male",
    position: "staff",
    earning: 1500000,
    phone: "0124444444",
    fullname: "Park Seo Joon",
    dob: new Date("2024-04-30"),
    email: "parkseojun@gmail.com",
    address: "3/333C Nguyen Hue, District 1",
    city: "Ho Chi Minh",
    country: "Viet Nam",
    district: "Q9",
    experience: "3 years as a project manager in a multinational company",
    kindOfJob: "Fulltime job",
    description: "Oversees and manages projects from inception to completion",
    dow: new Date("2024-06-01"),
    numberSaleInvoice: [
      {
        id: "1",
        customer: "Baekhyun",
        createDate: new Date("2024-07-15"),
        note: "Fast delivery",
        total: 1200000,
        status: 1
      },
      {
        id: "2",
        customer: "Chanyeol",
        createDate: new Date("2024-07-16"),
        note: "Great quality",
        total: 1800000,
        status: 2
      }
    ]
  },
  {
    id: "4",
    gender: "female",
    position: "staff",
    earning: 3000000,
    phone: "0125555555",
    fullname: "Jeon Ji Hyun",
    dob: new Date("2024-01-01"),
    email: "jeonjihyun@gmail.com",
    address: "4/444D Pham Hong Thai, Tan Binh",
    city: "Ho Chi Minh",
    country: "Viet Nam",
    district: "Q9",
    experience: "8 years in sales management",
    kindOfJob: "Part-time job",
    description:
      "Managing sales strategies and optimizing customer relationships",
    dow: new Date("2024-10-20"),
    numberSaleInvoice: [
      {
        id: "1",
        customer: "Kai",
        createDate: new Date("2024-09-30"),
        note: "Happy with the service",
        total: 4000000,
        status: 0
      }
    ]
  },
  {
    id: "5",
    gender: "male",
    position: "staff",
    earning: 2500000,
    phone: "0126666666",
    fullname: "Jang Ki Yong",
    dob: new Date("2024-05-20"),
    email: "jangkiyong@gmail.com",
    address: "5/555E Le Lai, Tan Phu",
    city: "Ho Chi Minh",
    country: "Viet Nam",
    district: "Q9",
    experience: "2 years as a data analyst in Vietnam",
    kindOfJob: "Fulltime job",
    description:
      "Responsible for gathering and analyzing business data to help companies make informed decisions",
    dow: new Date("2024-08-25"),
    numberSaleInvoice: [
      {
        id: "1",
        customer: "Suho",
        createDate: new Date("2024-09-05"),
        note: "Very satisfied",
        total: 2200000,
        status: 1
      },
      {
        id: "2",
        customer: "D.O",
        createDate: new Date("2024-09-06"),
        note: "Good experience",
        total: 2000000,
        status: 2
      }
    ]
  },
  {
    id: "6",
    gender: "female",
    position: "staff",
    earning: 1200000,
    phone: "0127777777",
    fullname: "Bae Suzy",
    dob: new Date("2024-02-18"),
    email: "baesuzy@gmail.com",
    address: "6/666F Cong Hoa, Tan Binh",
    city: "Ho Chi Minh",
    country: "Viet Nam",
    district: "Q9",
    experience: "1 year as a content writer",
    kindOfJob: "Fulltime job",
    description:
      "Writes engaging and informative content for websites and social media",
    dow: new Date("2024-09-13"),
    numberSaleInvoice: [
      {
        id: "1",
        customer: "Taeyang",
        createDate: new Date("2024-09-25"),
        note: "Good product",
        total: 1000000,
        status: 0
      }
    ]
  },
  {
    id: "7",
    gender: "male",
    position: "staff",
    earning: 5000000,
    phone: "0128888888",
    fullname: "Lee Min Ho",
    dob: new Date("2024-08-10"),
    email: "leeminho@gmail.com",
    address: "7/777G Hai Ba Trung, District 3",
    city: "Ho Chi Minh",
    country: "Viet Nam",
    district: "Q9",
    experience: "10 years in IT consulting",
    kindOfJob: "Fulltime job",
    description:
      "Provides consultation and solutions to businesses on IT infrastructure",
    dow: new Date("2024-05-30"),
    numberSaleInvoice: [
      {
        id: "1",
        customer: "G-Dragon",
        createDate: new Date("2024-07-01"),
        note: "Excellent service",
        total: 6000000,
        status: 0
      }
    ]
  },
  {
    id: "8",
    gender: "female",
    position: "staff",
    earning: 1300000,
    phone: "0129999999",
    fullname: "Song Hye Kyo",
    dob: new Date("2024-03-12"),
    email: "songhyekyo@gmail.com",
    address: "8/888H Tran Hung Dao, District 5",
    city: "Ho Chi Minh",
    country: "Viet Nam",
    district: "Q9",
    experience: "4 years as a marketing coordinator",
    kindOfJob: "Part-time job",
    description: "Coordinates marketing campaigns and strategies",
    dow: new Date("2024-06-10"),
    numberSaleInvoice: [
      {
        id: "1",
        customer: "Jisoo",
        createDate: new Date("2024-07-10"),
        note: "Very helpful",
        total: 1100000,
        status: 1
      }
    ]
  },
  {
    id: "9",
    gender: "male",
    position: "staff",
    earning: 3000000,
    phone: "0130000000",
    fullname: "Kang Ha Neul",
    dob: new Date("2024-07-25"),
    email: "kanghaneul@gmail.com",
    address: "9/999I Duong Quang Ham, Tan Binh",
    city: "Ho Chi Minh",
    country: "Viet Nam",
    district: "Q9",
    experience: "6 years as an accountant",
    kindOfJob: "Fulltime job",
    description:
      "Handles financial reporting and accounting tasks for the company",
    dow: new Date("2024-06-15"),
    numberSaleInvoice: [
      {
        id: "1",
        customer: "Jungkook",
        createDate: new Date("2024-08-15"),
        note: "Good product quality",
        total: 3500000,
        status: 1
      },
      {
        id: "2",
        customer: "V",
        createDate: new Date("2024-08-16"),
        note: "Great support",
        total: 4000000,
        status: 2
      }
    ]
  }
];

export const ImportData: Import[] = [
  {
    id: "1",
    suplier: {
      id: "SUP001",
      phoneNumber: "  +84 348775966",
      fullname: "Kim Hyuk-kyu",
      address: "123 Main Street, New York, USA"
    },
    invoice: [
      {
        id: "INV001",
        productName: "Laptop",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 1000,
        quantity: 5,
        discount: 10
      },
      {
        id: "INV002",
        productName: "Laptop",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 1000,
        quantity: 5,
        discount: 10
      },
      {
        id: "INV003",
        productName: "Laptop",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 1000,
        quantity: 5,
        discount: 10
      }
    ],
    status: true,
    createAt: new Date("2024-12-01"),
    createBy: "Admin001"
  },
  {
    id: "2",
    suplier: {
      id: "SUP002",
      phoneNumber: "  +84 348775966",
      fullname: "DEFT VIPPRO",
      address: "456 Oak Avenue, London, UK"
    },
    invoice: [
      {
        id: "INV002",
        productName: "Smartphone",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 500,
        quantity: 10,
        discount: 5
      }
    ],
    status: false,
    createAt: new Date("2024-12-02"),
    createBy: "Admin002"
  },
  {
    id: "3",
    suplier: {
      id: "SUP003",
      phoneNumber: "  +84 348775966",
      fullname: "8386 MÃI ĐỈNH MÃI ĐỈNH ĐỈNH",
      address: "789 Pine Street, Sydney, Australia"
    },
    invoice: [
      {
        id: "INV003",
        productName: "Keyboard",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 50,
        quantity: 20,
        discount: 0
      }
    ],
    status: true,
    createAt: new Date("2024-12-03"),
    createBy: "Admin003"
  },
  {
    id: "4",
    suplier: {
      id: "SUP004",
      phoneNumber: "  +84 348775966",
      fullname: "TONY TONY CHOPPER",
      address: "234 Elm Road, Berlin, Germany"
    },
    invoice: [
      {
        id: "INV004",
        productName: "Monitor",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 150,
        quantity: 8,
        discount: 15
      }
    ],
    status: true,
    createAt: new Date("2024-12-04"),
    createBy: "Admin004"
  },
  {
    id: "5",
    suplier: {
      id: "SUP005",
      phoneNumber: "  +84 348775966",
      fullname: "Global Gadgets",
      address: "567 Maple Boulevard, Toronto, Canada"
    },
    invoice: [
      {
        id: "INV005",
        productName: "Mouse",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 25,
        quantity: 50,
        discount: 5
      }
    ],
    status: false,
    createAt: new Date("2024-12-05"),
    createBy: "Admin005"
  },
  {
    id: "6",
    suplier: {
      id: "SUP006",
      phoneNumber: "  +84 348775966",
      fullname: "Gadget Store",
      address: "901 Birch Lane, Paris, France"
    },
    invoice: [
      {
        id: "INV006",
        productName: "Tablet",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 300,
        quantity: 12,
        discount: 8
      }
    ],
    status: true,
    createAt: new Date("2024-12-06"),
    createBy: "Admin006"
  },
  {
    id: "7",
    suplier: {
      id: "SUP007",
      phoneNumber: "  +84 348775966",
      fullname: "Mega Distributors",
      address: "321 Aspen Road, Dubai, UAE"
    },
    invoice: [
      {
        id: "INV007",
        productName: "Headphones",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 75,
        quantity: 30,
        discount: 10
      }
    ],
    status: false,
    createAt: new Date("2024-12-07"),
    createBy: "Admin007"
  },
  {
    id: "8",
    suplier: {
      id: "SUP008",
      phoneNumber: "  +84 348775966",
      fullname: "Tech World",
      address: "876 Spruce Avenue, Tokyo, Japan"
    },
    invoice: [
      {
        id: "INV008",
        productName: "Webcam",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 40,
        quantity: 25,
        discount: 0
      }
    ],
    status: true,
    createAt: new Date("2024-12-08"),
    createBy: "Admin008"
  },
  {
    id: "9",
    suplier: {
      id: "SUP009",
      phoneNumber: "  +84 348775966",
      fullname: "Electronic Mart",
      address: "654 Cedar Street, Mexico City, Mexico"
    },
    invoice: [
      {
        id: "INV009",
        productName: "Speaker",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 60,
        quantity: 15,
        discount: 5
      }
    ],
    status: false,
    createAt: new Date("2024-12-09"),
    createBy: "Admin009"
  },
  {
    id: "10",
    suplier: {
      id: "SUP010",
      phoneNumber: "  +84 348775966",
      fullname: "Alpha Electronics",
      address: "345 Willow Drive, Moscow, Russia"
    },
    invoice: [
      {
        id: "INV010",
        productName: "Power Bank",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 30,
        quantity: 40,
        discount: 7
      }
    ],
    status: true,
    createAt: new Date("2024-12-10"),
    createBy: "Admin010"
  },
  {
    id: "11",
    suplier: {
      id: "SUP011",
      phoneNumber: "  +84 348775966",
      fullname: "Techie Supplies",
      address: "678 Poplar Lane, Singapore"
    },
    invoice: [
      {
        id: "INV011",
        productName: "USB Drive",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 15,
        quantity: 100,
        discount: 0
      }
    ],
    status: true,
    createAt: new Date("2024-12-11"),
    createBy: "Admin011"
  },
  {
    id: "12",
    suplier: {
      id: "SUP012",
      phoneNumber: "  +84 348775966",
      fullname: "Smart Solutions",
      address: "987 Chestnut Road, Seoul, South Korea"
    },
    invoice: [
      {
        id: "INV012",
        productName: "Charger",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 20,
        quantity: 60,
        discount: 5
      }
    ],
    status: false,
    createAt: new Date("2024-12-12"),
    createBy: "Admin012"
  },
  {
    id: "13",
    suplier: {
      id: "SUP013",
      phoneNumber: "  +84 348775966",
      fullname: "NextGen Supplies",
      address: "432 Pineapple Street, Cape Town, South Africa"
    },
    invoice: [
      {
        id: "INV013",
        productName: "Hard Drive",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 120,
        quantity: 10,
        discount: 12
      }
    ],
    status: true,
    createAt: new Date("2024-12-13"),
    createBy: "Admin013"
  },
  {
    id: "14",
    suplier: {
      id: "SUP014",
      phoneNumber: "  +84 348775966",
      fullname: "Global Tech",
      address: "210 Banana Avenue, Rio de Janeiro, Brazil"
    },
    invoice: [
      {
        id: "INV014",
        productName: "Memory Card",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 10,
        quantity: 200,
        discount: 2
      }
    ],
    status: true,
    createAt: new Date("2024-12-14"),
    createBy: "Admin014"
  },
  {
    id: "15",
    suplier: {
      id: "SUP015",
      phoneNumber: "  +84 348775966",
      fullname: "Prime Tech",
      address: "765 Orange Blvd, Rome, Italy"
    },
    invoice: [
      {
        id: "INV015",
        productName: "Projector",
        productImage:
          "https://i.pinimg.com/736x/78/66/0b/78660b9da6a2a705a19167c698022af9.jpg",

        unitPrice: 500,
        quantity: 2,
        discount: 20
      }
    ],
    status: false,
    createAt: new Date("2024-12-15"),
    createBy: "Admin015"
  }
];

export const ProductsData: Product[] = [
  {
    id: "1",
    image:
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg",
    imageInfo: [
      {
        url: "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg",
        fileName: "gold_ring_main.jpg"
      },
      {
        url: "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg",
        fileName: "gold_ring_1.jpg"
      },
      {
        url: "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg",
        fileName: "gold_ring_2.jpg"
      }
    ],
    productName: "Gold Ring",
    price: "$120.99",
    collection: "",
    description: "Luxurious gold ring for all occasions.",
    vouchers: "5%",
    provider: "1",
    category: "Jewelry",
    variants: [
      {
        material: "Gold",
        sizes: [
          { size: "X", stock: 10 },
          { size: "M", stock: 5 },
          { size: "L", stock: 8 }
        ],
        addOn: 1000000
      },
      {
        material: "Bronze",
        sizes: [
          { size: "X", stock: 12 },
          { size: "M", stock: 7 },
          { size: "L", stock: 10 }
        ],
        addOn: 1000000
      },
      {
        material: "Silver",
        sizes: [
          { size: "X", stock: 15 },
          { size: "M", stock: 10 },
          { size: "L", stock: 20 }
        ],
        addOn: 0
      }
    ]
  },
  {
    id: "2",
    image:
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg",
    imageInfo: [
      {
        url: "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg",
        fileName: "bronze_necklace_main.jpg"
      },
      {
        url: "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg",
        fileName: "bronze_necklace_1.jpg"
      },
      {
        url: "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg",
        fileName: "bronze_necklace_2.jpg"
      }
    ],
    productName: "Bronze Necklace",
    price: "$75.50",
    collection: "",
    description: "Elegant bronze necklace for stylish looks.",
    vouchers: "10%",
    provider: "2",
    category: "Jewelry",
    variants: [
      {
        material: "Gold",
        sizes: [
          { size: "X", stock: 5 },
          { size: "M", stock: 8 },
          { size: "L", stock: 10 }
        ],
        addOn: 1000000
      },
      {
        material: "Bronze",
        sizes: [
          { size: "X", stock: 10 },
          { size: "M", stock: 15 },
          { size: "L", stock: 12 }
        ],
        addOn: 1000000
      },
      {
        material: "Silver",
        sizes: [
          { size: "X", stock: 20 },
          { size: "M", stock: 10 },
          { size: "L", stock: 15 }
        ],
        addOn: 0
      }
    ]
  }
];

export const Vouchers: Voucher[] = [
  {
    id: "1",
    name: "Discount 10%",
    discount: 10,
    expDate: new Date("2025-01-01")
  },
  {
    id: "2",
    name: "Flash Sale 20%",
    discount: 20,
    expDate: new Date("2025-01-02")
  },
  {
    id: "3",
    name: "Holiday Special 15%",
    discount: 15,
    expDate: new Date("2025-02-14")
  },
  {
    id: "4",
    name: "Free Shipping",
    discount: 10,
    expDate: new Date("2025-03-01")
  },
  {
    id: "5",
    name: "Black Friday 25%",
    discount: 25,
    expDate: new Date("2025-11-29")
  },
  {
    id: "6",
    name: "Cyber Monday 30%",
    discount: 30,
    expDate: new Date("2025-12-02")
  },
  {
    id: "7",
    name: "New Year 20%",
    discount: 20,
    expDate: new Date("2025-01-01")
  },
  {
    id: "8",
    name: "Valentine's Day 15%",
    discount: 15,
    expDate: new Date("2025-02-14")
  },
  {
    id: "9",
    name: "Summer Sale 10%",
    discount: 10,
    expDate: new Date("2025-07-01")
  },
  {
    id: "10",
    name: "Spring Special 12%",
    discount: 12,
    expDate: new Date("2025-04-01")
  },
  {
    id: "11",
    name: "Easter Special 18%",
    discount: 18,
    expDate: new Date("2025-04-20")
  },
  {
    id: "12",
    name: "Back to School 5%",
    discount: 5,
    expDate: new Date("2025-08-15")
  },
  {
    id: "13",
    name: "Birthday Bash 25%",
    discount: 25,
    expDate: new Date("2025-09-01")
  },
  {
    id: "14",
    name: "Shopping Festival 35%",
    discount: 35,
    expDate: new Date("2025-10-15")
  },
  {
    id: "15",
    name: "Anniversary 50%",
    discount: 50,
    expDate: new Date("2025-12-01")
  },
  {
    id: "16",
    name: "Lucky Day 22%",
    discount: 22,
    expDate: new Date("2025-05-13")
  },
  {
    id: "17",
    name: "Weekend Special 11%",
    discount: 11,
    expDate: new Date("2025-06-07")
  },
  {
    id: "18",
    name: "Winter Warm-Up 14%",
    discount: 14,
    expDate: new Date("2025-12-15")
  },
  {
    id: "19",
    name: "Festival of Lights 20%",
    discount: 20,
    expDate: new Date("2025-11-10")
  },
  {
    id: "20",
    name: "Year-End Clearance 40%",
    discount: 40,
    expDate: new Date("2025-12-31")
  }
];

export const Comments: Comment[] = [
  {
    id: "1",
    userId: "user01",
    userName: "Alice",
    productId: "1",
    rating: 5,
    createAt: new Date("2024-12-20T12:30:00"),
    productNamme: "Gold Necklace",
    size: "M",
    material: "Gold",
    comment: "Absolutely stunning piece! Highly recommend.",
    image: [
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg",
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg"
    ]
  },
  {
    id: "2",
    userId: "user02",
    userName: "Bob",
    productId: "1",
    rating: 4,
    createAt: new Date("2024-12-21T14:00:00"),
    productNamme: "Silver Bracelet",
    size: "L",
    material: "Silver",
    comment: "Great quality, but delivery was a bit late.",
    image: [
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg"
    ]
  },
  {
    id: "3",
    userId: "user03",
    userName: "Charlie",
    productId: "1",
    rating: 3,
    createAt: new Date("2024-12-18T16:00:00"),
    productNamme: "Diamond Ring",
    size: "S",
    material: "Gold",
    comment: "Looks good but smaller than expected.",
    image: []
  },
  {
    id: "4",
    userId: "user04",
    userName: "Diana",
    productId: "1",
    rating: 5,
    createAt: new Date("2024-12-15T10:30:00"),
    productNamme: "Pearl Earrings",
    size: "M",
    material: "Silver",
    comment: "Beautiful and well-made. Perfect gift!",
    image: [
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg",
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg"
    ]
  },
  {
    id: "5",
    userId: "user05",
    userName: "Eve",
    productId: "1",
    rating: 2,
    createAt: new Date("2024-12-14T08:45:00"),
    productNamme: "Platinum Ring",
    size: "L",
    material: "Platinum",
    comment: "Too expensive for the quality provided.",
    image: []
  },
  {
    id: "6",
    userId: "user06",
    userName: "Frank",
    productId: "1",
    rating: 4,
    createAt: new Date("2024-12-22T11:20:00"),
    productNamme: "Titanium Watch",
    size: "M",
    material: "Titanium",
    comment: "Looks stylish and durable.",
    image: [
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg"
    ]
  },
  {
    id: "7",
    userId: "user07",
    userName: "Grace",
    productId: "1",
    rating: 5,
    createAt: new Date("2024-12-19T09:15:00"),
    productNamme: "Gold Chain",
    size: "S",
    material: "Gold",
    comment: "Exactly what I was looking for. Perfect size!",
    image: [
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg"
    ]
  },
  {
    id: "8",
    userId: "user08",
    userName: "Hank",
    productId: "1",
    rating: 3,
    createAt: new Date("2024-12-17T14:10:00"),
    productNamme: "Ruby Pendant",
    size: "M",
    material: "Silver",
    comment: "Color not as vibrant as in the pictures.",
    image: []
  },
  {
    id: "9",
    userId: "user09",
    userName: "Ivy",
    productId: "1",
    rating: 5,
    createAt: new Date("2024-12-23T12:00:00"),
    productNamme: "Emerald Necklace",
    size: "L",
    material: "Gold",
    comment: "Very elegant. Got many compliments!",
    image: [
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg",
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg"
    ]
  },
  {
    id: "10",
    userId: "user10",
    userName: "Jack",
    productId: "1",
    rating: 4,
    createAt: new Date("2024-12-16T13:50:00"),
    productNamme: "Silver Ring",
    size: "M",
    material: "Silver",
    comment: "Simple and classy. Good for daily wear.",
    image: [
      "https://i.pinimg.com/736x/40/64/d4/4064d49b6a79f57ee49f452655c895d3.jpg"
    ]
  }
];

export const Providers: Provider[] = [
  {
    _id: "1",
    name: "Fresh Produce Ltd.",
    address: "123 Green Road",
    representativeName: "John Smith",
    createAt: new Date("2023-01-15"),
    contact: "0123456789",
    city: "New York",
    country: "USA",
    email: "info@freshproduce.com",
    numberImportInvoice: [
      {
        id: "i1",
        createAt: "2023-03-01",
        createBy: "John Doe",
        total: 5000,
        status: 1
      },
      {
        id: "i2",
        createAt: "2023-04-10",
        createBy: "Alice Johnson",
        total: 3000,
        status: 0
      }
    ]
  },
  {
    _id: "2",
    name: "Tech Supplies Inc.",
    address: "456 Tech Avenue",
    representativeName: "Alice Brown",
    createAt: new Date("2023-02-20"),
    contact: "0987654321",
    city: "San Francisco",
    country: "USA",
    email: "support@techsupplies.com",
    numberImportInvoice: [
      {
        id: "i3",
        createAt: "2023-05-05",
        createBy: "Bob Carter",
        total: 12000,
        status: 1
      }
    ]
  },
  {
    _id: "3",
    name: "Global Textiles Co.",
    address: "789 Fashion Blvd",
    representativeName: "Maria Gonzalez",
    createAt: new Date("2023-03-30"),
    contact: "0111222333",
    city: "London",
    country: "UK",
    email: "contact@globaltextiles.com",
    numberImportInvoice: [
      {
        id: "i4",
        createAt: "2023-06-15",
        createBy: "Sophia Lewis",
        total: 8000,
        status: 1
      }
    ]
  },
  {
    _id: "4",
    name: "Organic Goods",
    address: "654 Health Street",
    representativeName: "Emma Wilson",
    createAt: new Date("2023-04-10"),
    contact: "0223344556",
    city: "Berlin",
    country: "Germany",
    email: "hello@organicgoods.de",
    numberImportInvoice: []
  },
  {
    _id: "5",
    name: "Asia Electronics",
    address: "12 Circuit Lane",
    representativeName: "Chen Wei",
    createAt: new Date("2023-05-20"),
    contact: "0334455667",
    city: "Beijing",
    country: "China",
    email: "sales@asiaelectronics.cn",
    numberImportInvoice: [
      {
        id: "i5",
        createAt: "2023-07-10",
        createBy: "Lin Zhang",
        total: 20000,
        status: 1
      },
      {
        id: "i6",
        createAt: "2023-07-20",
        createBy: "Huang Li",
        total: 18000,
        status: 0
      }
    ]
  },
  {
    _id: "6",
    name: "Euro Machinery",
    address: "77 Industrial Park",
    representativeName: "Peter Muller",
    createAt: new Date("2023-06-15"),
    contact: "0445566778",
    city: "Paris",
    country: "France",
    email: "info@euromachinery.fr",
    numberImportInvoice: [
      {
        id: "i7",
        createAt: "2023-08-01",
        createBy: "Claire Dubois",
        total: 30000,
        status: 1
      }
    ]
  },
  {
    _id: "7",
    name: "South America Coffee",
    address: "89 Coffee Avenue",
    representativeName: "Carlos Mendoza",
    createAt: new Date("2023-07-10"),
    contact: "0556677889",
    city: "Rio de Janeiro",
    country: "Brazil",
    email: "info@sacoffee.com.br",
    numberImportInvoice: []
  },
  {
    _id: "8",
    name: "North Supplies",
    address: "101 Logistic Way",
    representativeName: "James Anderson",
    createAt: new Date("2023-08-01"),
    contact: "0667788990",
    city: "Toronto",
    country: "Canada",
    email: "contact@northsupplies.ca",
    numberImportInvoice: [
      {
        id: "i8",
        createAt: "2023-09-10",
        createBy: "Sarah Thompson",
        total: 7000,
        status: 1
      }
    ]
  },
  {
    _id: "9",
    name: "Australian Farming",
    address: "333 Ranch Road",
    representativeName: "Olivia Taylor",
    createAt: new Date("2023-09-15"),
    contact: "0778899001",
    city: "Sydney",
    country: "Australia",
    email: "info@aussiefarm.com.au",
    numberImportInvoice: [
      {
        id: "i9",
        createAt: "2023-10-05",
        createBy: "Michael Brown",
        total: 2500,
        status: 0
      }
    ]
  },
  {
    _id: "10",
    name: "Modern Furniture",
    address: "22 Designer Street",
    representativeName: "Sophia Roberts",
    createAt: new Date("2023-10-01"),
    contact: "0889900112",
    city: "Los Angeles",
    country: "USA",
    email: "sales@modernfurniture.com",
    numberImportInvoice: [
      {
        id: "i10",
        createAt: "2023-11-01",
        createBy: "Emily Davis",
        total: 15000,
        status: 1
      }
    ]
  }
];

export const categoryData: CategoryResponse[] = [
  // {
  //   _id: "1",
  //   name: "Rings",
  //   hot: true,
  //   products: [
  //     { _id: "1", fullName: "Gold Ring", cost: 100 },
  //     { _id: "2", fullName: "Silver Ring", cost: 50 }
  //   ],
  //   description: "",
  //   createAt: "2025-01-01T08:00:00Z"
  // },
  // {
  //   _id: "2",
  //   name: "Necklaces",
  //   hot: true,
  //   products: [
  //     { _id: "1", fullName: "Diamond Necklace", cost: 500 },
  //     { _id: "2", fullName: "Pearl Necklace", cost: 200 }
  //   ],
  //   description: "",
  //   createAt: "2025-01-02T09:00:00Z"
  // },
  // {
  //   _id: "3",
  //   name: "Bracelets",
  //   description: "",
  //   hot: false,
  //   products: [
  //     { _id: "1", fullName: "Leather Bracelet", cost: 30 },
  //     { _id: "2", fullName: "Gold Bracelet", cost: 150 }
  //   ],
  //   createAt: "2025-01-03T10:00:00Z"
  // },
  // {
  //   _id: "4",
  //   description: "",
  //   name: "Earrings",
  //   hot: true,
  //   products: [
  //     { _id: "1", fullName: "Stud Earrings", cost: 40 },
  //     { _id: "2", fullName: "Hoop Earrings", cost: 60 }
  //   ],
  //   createAt: "2025-01-04T11:00:00Z"
  // },
  // {
  //   _id: "5",
  //   description: "",
  //   name: "Watches",
  //   hot: false,
  //   products: [
  //     { _id: "1", fullName: "Analog Watch", cost: 120 },
  //     { _id: "2", fullName: "Digital Watch", cost: 80 }
  //   ],
  //   createAt: "2025-01-05T12:00:00Z"
  // },
  // {
  //   _id: "6",
  //   description: "",
  //   name: "Brooches",
  //   hot: true,
  //   products: [
  //     { _id: "1", fullName: "Vintage Brooch", cost: 90 },
  //     { _id: "2", fullName: "Floral Brooch", cost: 110 }
  //   ],
  //   createAt: "2025-01-06T13:00:00Z"
  // },
  // {
  //   _id: "7",
  //   description: "",
  //   name: "Pendants",
  //   hot: false,
  //   products: [
  //     { _id: "1", fullName: "Gold Pendant", cost: 140 },
  //     { _id: "2", fullName: "Silver Pendant", cost: 100 }
  //   ],
  //   createAt: "2025-01-07T14:00:00Z"
  // },
  // {
  //   _id: "8",
  //   description: "",
  //   name: "Cufflinks",
  //   hot: true,
  //   products: [
  //     { _id: "1", fullName: "Silver Cufflinks", cost: 70 },
  //     { _id: "2", fullName: "Gold Cufflinks", cost: 130 }
  //   ],
  //   createAt: "2025-01-08T15:00:00Z"
  // },
  // {
  //   _id: "9",
  //   description: "",
  //   name: "Charms",
  //   hot: false,
  //   products: [
  //     { _id: "1", fullName: "Heart Charm", cost: 25 },
  //     { _id: "2", fullName: "Star Charm", cost: 35 }
  //   ],
  //   createAt: "2025-01-09T16:00:00Z"
  // },
  // {
  //   _id: "10",
  //   description: "",
  //   name: "Anklets",
  //   hot: true,
  //   products: [
  //     { _id: "1", fullName: "Gold Anklet", cost: 60 },
  //     { _id: "2", fullName: "Silver Anklet", cost: 40 }
  //   ],
  //   createAt: "2025-01-10T17:00:00Z"
  // }
];