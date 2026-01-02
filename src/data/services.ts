import { 
  ClipboardCheck, 
  Wrench, 
  Gauge, 
  Calendar, 
  RefreshCw, 
  ShoppingCart, 
  Package, 
  Trash2, 
  FileText,
  LucideIcon
} from 'lucide-react';

export interface ServiceFeature {
  text: string;
}

export interface Service {
  id: string;
  slug: string;
  icon: LucideIcon;
  title: string;
  shortDesc: string;
  heroTitle: string;
  overview: string[];
  whyChooseTitle: string;
  features: ServiceFeature[];
}

export const services: Service[] = [
  {
    id: '1',
    slug: 'biomedical-equipment-inspection',
    icon: ClipboardCheck,
    title: 'Biomedical Equipment Inspection',
    shortDesc: 'Comprehensive safety, functionality, and performance inspections to ensure compliance with medical standards.',
    heroTitle: 'Comprehensive Biomedical Equipment Inspection',
    overview: [
      'Our biomedical equipment inspection services ensure that all your medical devices meet the highest safety and performance standards. We conduct thorough evaluations covering electrical safety, mechanical integrity, and functional performance to help you maintain compliance with healthcare regulations.',
      'Our certified technicians use state-of-the-art testing equipment to identify potential issues before they become critical problems, helping you avoid costly downtime and ensuring patient safety at all times.'
    ],
    whyChooseTitle: 'Why Choose Our Inspection Services?',
    features: [
      { text: 'FDA & Joint Commission Compliant' },
      { text: 'Quick Turnaround Time' },
      { text: 'Certified Biomedical Technicians' },
      { text: 'Detailed Inspection Reports' },
      { text: 'On-Site & In-House Services' },
      { text: 'Cost-Effective Solutions' }
    ]
  },
  {
    id: '2',
    slug: 'medical-equipment-repair-maintenance',
    icon: Wrench,
    title: 'Medical Equipment Repair & Maintenance',
    shortDesc: 'Reliable on-site and in-house repair and maintenance services to keep equipment operating efficiently.',
    heroTitle: 'Professional Medical Equipment Repair & Maintenance',
    overview: [
      'Our expert repair and maintenance services are designed to keep your medical equipment running at peak performance. Whether you need emergency repairs or routine maintenance, our team of certified technicians is ready to help minimize downtime and extend the life of your equipment.',
      'We service all major brands and types of medical equipment, from diagnostic devices to life-support systems. Our comprehensive approach ensures that your equipment is always ready when you need it most.'
    ],
    whyChooseTitle: 'Why Choose Our Repair Services?',
    features: [
      { text: 'Fast Emergency Response' },
      { text: '24/7 Technical Support' },
      { text: 'OEM & Quality Parts' },
      { text: 'Multi-Vendor Expertise' },
      { text: 'Warranty on All Repairs' },
      { text: 'Flexible Service Options' }
    ]
  },
  {
    id: '3',
    slug: 'calibration-services',
    icon: Gauge,
    title: 'Calibration Services',
    shortDesc: 'Precise calibration services to maintain accuracy and meet regulatory requirements.',
    heroTitle: 'Comprehensive Biomedical Equipment Calibration',
    overview: [
      'Accurate calibration is essential for reliable medical equipment performance. Our calibration services ensure that your devices provide precise measurements and readings, which is critical for patient diagnosis and treatment outcomes.',
      'We follow strict protocols and use NIST-traceable standards to calibrate a wide range of medical equipment. Our detailed calibration certificates provide the documentation you need for regulatory compliance and quality assurance.'
    ],
    whyChooseTitle: 'Why Choose Our Calibration?',
    features: [
      { text: 'ISO Certified Process' },
      { text: 'Quick Turnaround Time' },
      { text: 'Expert Certified Technicians' },
      { text: 'Depesting Standards' },
      { text: 'Calibration Record Service' },
      { text: 'NIST-Traceable Standards' }
    ]
  },
  {
    id: '4',
    slug: 'preventive-maintenance',
    icon: Calendar,
    title: 'Preventive Maintenance (PM Services)',
    shortDesc: 'Scheduled maintenance programs designed to prevent equipment failure and reduce downtime.',
    heroTitle: 'Preventive Maintenance Programs',
    overview: [
      'Our preventive maintenance programs are designed to keep your medical equipment in optimal condition, reducing unexpected breakdowns and extending equipment lifespan. We create customized PM schedules based on manufacturer recommendations and your facility\'s specific needs.',
      'Regular preventive maintenance not only ensures equipment reliability but also helps maintain compliance with healthcare regulations and accreditation standards. Our comprehensive PM services include inspection, cleaning, lubrication, and component replacement as needed.'
    ],
    whyChooseTitle: 'Why Choose Our PM Services?',
    features: [
      { text: 'Customized PM Schedules' },
      { text: 'Reduced Equipment Downtime' },
      { text: 'Extended Equipment Life' },
      { text: 'Compliance Documentation' },
      { text: 'Cost Savings' },
      { text: 'Priority Response Times' }
    ]
  },
  {
    id: '5',
    slug: 'refurbishing-services',
    icon: RefreshCw,
    title: 'Refurbishing Services',
    shortDesc: 'Restoration of used medical equipment to like-new condition through thorough testing and servicing.',
    heroTitle: 'Medical Equipment Refurbishing Services',
    overview: [
      'Our refurbishing services restore used medical equipment to like-new condition, providing a cost-effective alternative to purchasing new equipment. Each refurbished unit undergoes rigorous testing and quality checks to ensure it meets original manufacturer specifications.',
      'We refurbish a wide range of medical equipment including hospital beds, stretchers, patient monitors, and diagnostic devices. Our refurbishing process includes complete disassembly, cleaning, parts replacement, cosmetic restoration, and comprehensive functional testing.'
    ],
    whyChooseTitle: 'Why Choose Our Refurbishing?',
    features: [
      { text: 'Like-New Quality' },
      { text: 'Significant Cost Savings' },
      { text: 'Warranty Included' },
      { text: 'Environmentally Friendly' },
      { text: 'Quick Delivery' },
      { text: 'Custom Configurations' }
    ]
  },
  {
    id: '6',
    slug: 'equipment-sales',
    icon: ShoppingCart,
    title: 'New & Pre-Owned Medical Equipment Sales',
    shortDesc: 'Supply of high-quality new and certified pre-owned medical equipment.',
    heroTitle: 'New & Pre-Owned Medical Equipment Sales',
    overview: [
      'We offer a comprehensive selection of new and certified pre-owned medical equipment to meet every healthcare facility\'s needs and budget. Our inventory includes hospital beds, stretchers, patient monitors, diagnostic equipment, and much more.',
      'All pre-owned equipment undergoes thorough inspection, refurbishment, and testing before sale. We work with leading manufacturers to provide competitive pricing on new equipment while offering significant savings on quality pre-owned alternatives.'
    ],
    whyChooseTitle: 'Why Choose Our Equipment Sales?',
    features: [
      { text: 'Wide Selection Available' },
      { text: 'Competitive Pricing' },
      { text: 'Quality Guaranteed' },
      { text: 'Financing Options' },
      { text: 'Installation Services' },
      { text: 'Ongoing Support' }
    ]
  },
  {
    id: '7',
    slug: 'equipment-rental',
    icon: Package,
    title: 'Medical Equipment Rental',
    shortDesc: 'Flexible short-term and long-term rental solutions for healthcare facilities.',
    heroTitle: 'Flexible Medical Equipment Rental',
    overview: [
      'Our medical equipment rental program provides flexible solutions for healthcare facilities needing temporary equipment. Whether you need equipment for a few days or several months, we have rental options to fit your needs and budget.',
      'Rental equipment is ideal for handling patient surges, covering equipment during repairs, or evaluating new technology before purchase. All rental equipment is thoroughly inspected, tested, and sanitized before delivery.'
    ],
    whyChooseTitle: 'Why Choose Our Rental Services?',
    features: [
      { text: 'Flexible Rental Terms' },
      { text: 'Well-Maintained Equipment' },
      { text: 'Quick Delivery' },
      { text: 'Technical Support Included' },
      { text: 'Rent-to-Own Options' },
      { text: 'No Long-Term Commitment' }
    ]
  },
  {
    id: '8',
    slug: 'disposition-asset-management',
    icon: Trash2,
    title: 'Disposition & Asset Management',
    shortDesc: 'Compliant disposal and effective management of outdated or unused medical equipment assets.',
    heroTitle: 'Equipment Disposition & Asset Management',
    overview: [
      'Our disposition and asset management services help healthcare facilities properly manage and dispose of outdated, unused, or end-of-life medical equipment. We ensure all disposals comply with environmental regulations and industry standards.',
      'We offer comprehensive asset management solutions including equipment tracking, lifecycle analysis, and strategic planning for equipment replacement. Our services help you maximize the value of your equipment investments while maintaining regulatory compliance.'
    ],
    whyChooseTitle: 'Why Choose Our Asset Management?',
    features: [
      { text: 'Compliant Disposal' },
      { text: 'Data Sanitization' },
      { text: 'Environmental Responsibility' },
      { text: 'Asset Recovery Value' },
      { text: 'Complete Documentation' },
      { text: 'Pickup Services' }
    ]
  },
  {
    id: '9',
    slug: 'service-contracts',
    icon: FileText,
    title: 'Service Contracts (AMC / CMC)',
    shortDesc: 'Annual and comprehensive maintenance contracts for complete equipment support.',
    heroTitle: 'Service Contracts (AMC / CMC)',
    overview: [
      'Our service contracts provide comprehensive coverage for all your medical equipment maintenance needs. Choose from Annual Maintenance Contracts (AMC) for planned maintenance or Comprehensive Maintenance Contracts (CMC) that include parts and repairs.',
      'Service contracts offer predictable budgeting, priority response times, and peace of mind knowing your equipment is covered. Our dedicated team ensures your equipment receives regular maintenance and prompt repairs when needed.'
    ],
    whyChooseTitle: 'Why Choose Our Service Contracts?',
    features: [
      { text: 'Predictable Costs' },
      { text: 'Priority Response' },
      { text: 'Scheduled Maintenance' },
      { text: 'Parts Coverage (CMC)' },
      { text: 'Dedicated Support Team' },
      { text: 'Customizable Plans' }
    ]
  }
];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(service => service.slug === slug);
};
