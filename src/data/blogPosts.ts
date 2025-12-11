export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "choosing-right-hospital-stretcher",
    title: "How to Choose the Right Hospital Stretcher for Your Facility",
    excerpt: "A comprehensive guide to selecting the perfect stretcher based on your hospital's specific needs, patient volume, and budget considerations.",
    content: `Choosing the right hospital stretcher is crucial for patient safety and staff efficiency. Here are the key factors to consider:

## Patient Capacity and Weight Limits
Different stretchers have varying weight capacities. Ensure you select one that accommodates your patient demographics. Our premium stretchers support up to 500 lbs.

## Mobility and Maneuverability
Consider the layout of your facility. Narrow corridors may require stretchers with better turning radius. Look for models with swivel wheels and brake systems.

## Adjustability Features
Height-adjustable stretchers reduce strain on medical staff and improve patient transfer safety. Look for models with easy-to-use hydraulic or electric adjustment systems.

## Durability and Maintenance
Hospital equipment sees heavy daily use. Choose stretchers made from durable materials like stainless steel frames and high-density foam mattresses.

## Infection Control
Easy-to-clean surfaces and antimicrobial coatings help maintain hygiene standards. Look for stretchers with seamless designs that prevent bacterial buildup.`,
    author: "Dr. Sarah Mitchell",
    date: "2024-01-15",
    category: "Buying Guides",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    readTime: "5 min read"
  },
  {
    id: "stretcher-maintenance-tips",
    title: "Essential Maintenance Tips for Medical Stretchers",
    excerpt: "Keep your medical equipment in top condition with these proven maintenance strategies that extend lifespan and ensure patient safety.",
    content: `Regular maintenance of hospital stretchers is essential for safety and longevity. Follow these guidelines:

## Daily Inspections
- Check wheel functionality and brakes
- Inspect mattress for tears or contamination
- Verify all locking mechanisms work properly

## Weekly Cleaning Protocol
- Deep clean all surfaces with hospital-grade disinfectant
- Lubricate moving parts as needed
- Check hydraulic systems for leaks

## Monthly Maintenance
- Inspect frame for cracks or stress points
- Test weight capacity with calibrated weights
- Review and replace worn components

## Annual Professional Service
Schedule annual professional inspections to catch issues before they become safety hazards.`,
    author: "James Rodriguez",
    date: "2024-01-10",
    category: "Maintenance",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800",
    readTime: "4 min read"
  },
  {
    id: "emergency-transport-best-practices",
    title: "Best Practices for Emergency Patient Transport",
    excerpt: "Learn the protocols and equipment requirements for safe and efficient emergency patient transport in critical care situations.",
    content: `Emergency transport requires specialized equipment and trained personnel. Here's what you need to know:

## Equipment Readiness
Always ensure stretchers are fully stocked with emergency supplies including oxygen, IV poles, and monitoring equipment mounts.

## Staff Training
Regular drills ensure staff can quickly and safely transfer patients during emergencies. Practice different scenarios including narrow spaces and stairwells.

## Communication Protocols
Clear communication between transport teams and receiving units reduces errors and improves patient outcomes.

## Documentation
Maintain detailed logs of all emergency transports for quality improvement and regulatory compliance.`,
    author: "Dr. Michael Chen",
    date: "2024-01-05",
    category: "Best Practices",
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800",
    readTime: "6 min read"
  },
  {
    id: "innovations-medical-stretcher-design",
    title: "Latest Innovations in Medical Stretcher Design",
    excerpt: "Discover the cutting-edge technologies transforming patient transport, from smart sensors to ergonomic improvements.",
    content: `The medical equipment industry continues to evolve with innovative stretcher designs:

## Smart Stretchers
New models feature integrated sensors that monitor patient vitals during transport, alerting staff to any changes in condition.

## Ergonomic Improvements
Modern stretchers prioritize staff safety with features like powered lift assist and improved handle positioning to reduce back injuries.

## Lightweight Materials
Advanced composites and aluminum alloys reduce stretcher weight without sacrificing durability or weight capacity.

## Modular Accessories
Quick-attach systems allow rapid configuration changes for different patient needs and transport scenarios.`,
    author: "Emily Watson",
    date: "2023-12-28",
    category: "Industry News",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
    readTime: "5 min read"
  },
  {
    id: "infection-control-patient-transport",
    title: "Infection Control During Patient Transport",
    excerpt: "Critical guidelines for preventing cross-contamination and maintaining sterile conditions during patient transfers.",
    content: `Infection control during patient transport is critical for hospital safety:

## Pre-Transport Preparation
- Ensure stretcher is properly sanitized
- Use clean linens for each patient
- Have PPE readily available

## During Transport
- Minimize contact with environmental surfaces
- Use designated transport routes when possible
- Maintain proper hand hygiene

## Post-Transport Protocols
- Immediately clean and disinfect stretcher
- Properly dispose of single-use items
- Document any infection control concerns

## Staff Education
Regular training updates keep staff informed about the latest infection control protocols and emerging pathogen concerns.`,
    author: "Dr. Lisa Park",
    date: "2023-12-20",
    category: "Safety",
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800",
    readTime: "4 min read"
  }
];
