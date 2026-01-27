import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Check, Clock, Settings, Award, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';

interface CategoryInfo {
  overview: string[];
  whyChoose: { icon: 'check' | 'clock' | 'settings' | 'award'; title: string }[];
  features: string[];
  benefits: string[];
  useCases: string[];
}

const categoryDetails: Record<string, CategoryInfo> = {
  'manual-hospital-beds': {
    overview: [
      'Manual hospital beds are the foundation of patient care, offering reliable and cost-effective solutions for healthcare facilities of all sizes. These traditional beds feature hand-crank mechanisms for adjusting bed height, head elevation, and foot positioning, ensuring patients receive comfortable care without dependency on electrical systems.',
      'Our manual hospital beds are constructed with high-grade steel frames and premium materials, designed to withstand years of intensive use while maintaining optimal patient comfort and safety standards.'
    ],
    whyChoose: [
      { icon: 'check', title: 'ISO Certified Quality' },
      { icon: 'clock', title: 'Quick Turnaround Time' },
      { icon: 'settings', title: 'Easy Maintenance' },
      { icon: 'award', title: 'Industry-Leading Warranty' }
    ],
    features: ['Hand-crank height adjustment', 'Manual head and foot positioning', 'Durable steel frame construction', 'Locking caster wheels', 'Side rail compatibility'],
    benefits: ['Cost-effective solution', 'No electricity required', 'Simple operation', 'Low maintenance', 'Reliable performance'],
    useCases: ['Long-term care facilities', 'Rural healthcare settings', 'Backup beds for power outages', 'Budget-conscious facilities']
  },
  'semi-electric-hospital-beds': {
    overview: [
      'Semi-electric hospital beds combine the convenience of electric controls with manual reliability. These beds feature motorized head and foot adjustments controlled by a handheld pendant, while maintaining manual crank operation for height adjustment, providing an ideal balance of functionality and cost-efficiency.',
      'Perfect for facilities seeking to upgrade from fully manual beds, semi-electric models offer patients greater independence in adjusting their comfort positions while keeping equipment costs manageable.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Balanced Cost & Features' },
      { icon: 'clock', title: 'Patient-Controlled Comfort' },
      { icon: 'settings', title: 'Reduced Caregiver Strain' },
      { icon: 'award', title: 'Energy Efficient Design' }
    ],
    features: ['Electric head and foot controls', 'Manual crank height adjustment', 'Pendant controller', 'Battery backup option', 'Quiet motor operation'],
    benefits: ['Balance of cost and convenience', 'Patient-controlled positioning', 'Reduced caregiver strain', 'Energy efficient'],
    useCases: ['Nursing homes', 'Rehabilitation centers', 'Home healthcare', 'Assisted living facilities']
  },
  'fully-electric-hospital-beds': {
    overview: [
      'Fully electric hospital beds represent the pinnacle of patient care technology, offering complete motorized control over all bed positions. With the touch of a button, caregivers and patients can adjust height, head, foot, and Trendelenburg positions, maximizing comfort and minimizing physical strain.',
      'Our fully electric beds feature advanced safety systems, programmable positions, and optional integrated scales, making them ideal for acute care environments where precision and efficiency are paramount.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Maximum Convenience' },
      { icon: 'clock', title: 'Quick Position Changes' },
      { icon: 'settings', title: 'Advanced Safety Features' },
      { icon: 'award', title: 'Premium Construction' }
    ],
    features: ['Full electric controls', 'Programmable positions', 'Trendelenburg capability', 'Low height function', 'Integrated scale option'],
    benefits: ['Maximum convenience', 'Reduced injury risk', 'Patient independence', 'Precise positioning'],
    useCases: ['Acute care hospitals', 'ICU settings', 'Post-surgical care', 'Specialty clinics']
  },
  'icu-critical-care-beds': {
    overview: [
      'ICU and Critical Care beds are engineered for the most demanding healthcare environments. These specialized beds provide 360-degree patient access, integrated monitoring capabilities, and advanced therapeutic features essential for intensive care settings.',
      'Designed to support life-saving interventions, our ICU beds feature CPR functions, X-ray translucent decks, and lateral rotation therapy to optimize patient outcomes in critical situations.'
    ],
    whyChoose: [
      { icon: 'check', title: '360° Patient Access' },
      { icon: 'clock', title: 'Rapid Response Features' },
      { icon: 'settings', title: 'Integrated Monitoring' },
      { icon: 'award', title: 'Clinical Excellence' }
    ],
    features: ['360° patient access', 'Integrated monitoring', 'CPR function', 'X-ray translucent deck', 'Lateral rotation therapy'],
    benefits: ['Enhanced patient care', 'Improved clinical outcomes', 'Caregiver efficiency', 'Infection control features'],
    useCases: ['Intensive Care Units', 'Cardiac Care Units', 'Trauma centers', 'Emergency departments']
  },
  'low-beds-fall-prevention': {
    overview: [
      'Low beds are specifically designed to minimize fall-related injuries for high-risk patients. With deck heights that can reach as low as 7-8 inches from the floor, these beds significantly reduce the impact distance if a patient does fall, protecting vulnerable individuals.',
      'Equipped with built-in alarm systems and high-visibility side rails, our low beds provide comprehensive fall prevention solutions while maintaining the full range of positioning capabilities needed for quality patient care.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Ultra-Low Height Design' },
      { icon: 'clock', title: 'Rapid Alert Systems' },
      { icon: 'settings', title: 'Safety-First Engineering' },
      { icon: 'award', title: 'Regulatory Compliant' }
    ],
    features: ['Ultra-low deck height (7-8 inches)', 'Floor-level capability', 'Built-in alarm systems', 'Soft-touch bumpers', 'High-visibility side rails'],
    benefits: ['Reduced fall injuries', 'Patient safety', 'Peace of mind for caregivers', 'Regulatory compliance'],
    useCases: ['Dementia care units', 'Fall-risk patients', 'Psychiatric facilities', 'Senior care homes']
  },
  'bariatric-hospital-beds': {
    overview: [
      'Bariatric hospital beds are engineered to safely and comfortably accommodate larger patients with weight capacities ranging from 600 to 1000+ pounds. These heavy-duty beds feature reinforced frames, extra-wide sleep surfaces, and specialized motors designed for extended durability.',
      'Our bariatric beds prioritize patient dignity and caregiver safety, with ergonomic designs that facilitate safe patient handling while providing the same comfort and positioning options as standard hospital beds.'
    ],
    whyChoose: [
      { icon: 'check', title: 'High Weight Capacity' },
      { icon: 'clock', title: 'Patient Dignity Focus' },
      { icon: 'settings', title: 'Heavy-Duty Construction' },
      { icon: 'award', title: 'Caregiver Safety Design' }
    ],
    features: ['High weight capacity (600-1000 lbs)', 'Extra-wide sleep surface', 'Reinforced frame', 'Heavy-duty motors', 'Specialized mattress compatibility'],
    benefits: ['Patient dignity', 'Caregiver safety', 'Durability', 'Proper weight distribution'],
    useCases: ['Bariatric care units', 'General hospitals', 'Long-term care', 'Home healthcare']
  },
  'pediatric-hospital-beds': {
    overview: [
      'Pediatric hospital beds are thoughtfully designed to create a safe, comfortable, and child-friendly healing environment. These specialized beds feature enclosed sides, colorful aesthetics, and size-appropriate dimensions that help reduce anxiety and promote recovery in young patients.',
      'Our pediatric beds include parent accommodation features and growth-adaptable sizing, recognizing that family involvement is crucial to a child\'s healing journey while maintaining the highest safety standards.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Child-Safe Design' },
      { icon: 'clock', title: 'Age-Appropriate Features' },
      { icon: 'settings', title: 'Parent-Friendly Access' },
      { icon: 'award', title: 'Therapeutic Environment' }
    ],
    features: ['Child-safe design', 'Colorful aesthetics', 'Enclosed sides', 'Parent accommodation', 'Growth-adaptable sizing'],
    benefits: ['Child-friendly environment', 'Parent peace of mind', 'Safety compliance', 'Therapeutic atmosphere'],
    useCases: ['Pediatric hospitals', 'Children\'s wards', 'Pediatric ICU', 'Specialty clinics']
  },
  'maternity-ob-gyn-beds': {
    overview: [
      'Maternity and OB-GYN beds are specifically engineered for labor, delivery, and postpartum care. These versatile beds feature quick-positioning capabilities, stirrup attachments, and removable sections to accommodate all stages of childbirth and gynecological procedures.',
      'Designed for both patient comfort and clinical efficiency, our maternity beds provide easy-cleaning surfaces and optimal positioning options that support natural birthing processes while enabling medical interventions when needed.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Versatile Positioning' },
      { icon: 'clock', title: 'Quick Configuration' },
      { icon: 'settings', title: 'Easy Maintenance' },
      { icon: 'award', title: 'Patient Comfort Focus' }
    ],
    features: ['Stirrup attachments', 'Quick positioning', 'Removable sections', 'Trendelenburg position', 'Easy cleaning surfaces'],
    benefits: ['Versatile positioning', 'Patient comfort', 'Efficient delivery support', 'Infection control'],
    useCases: ['Labor and delivery rooms', 'OB-GYN clinics', 'Birthing centers', 'Women\'s health facilities']
  },
  'fowler-beds': {
    overview: [
      'Fowler beds are designed for patients who benefit from semi-upright positioning, particularly those with respiratory or cardiac conditions. Named after the Fowler\'s position, these beds provide adjustable backrest angles that help improve breathing, reduce aspiration risk, and enhance overall patient comfort.',
      'Our Fowler beds feature smooth adjustment mechanisms and cardiac chair positioning options, making them ideal for patients requiring extended periods of elevated upper body positioning during their care and recovery.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Respiratory Support' },
      { icon: 'clock', title: 'Smooth Adjustments' },
      { icon: 'settings', title: 'Cardiac Chair Mode' },
      { icon: 'award', title: 'Enhanced Recovery' }
    ],
    features: ['Semi-upright positioning', 'Adjustable backrest angles', 'Knee gatch function', 'Cardiac chair position', 'Easy operation'],
    benefits: ['Respiratory support', 'Patient comfort', 'Reduced aspiration risk', 'Post-operative care'],
    useCases: ['Cardiac care', 'Respiratory therapy', 'Post-surgical recovery', 'General medical care']
  },
  'orthopedic-hospital-beds': {
    overview: [
      'Orthopedic hospital beds are specialized for patients recovering from bone fractures, joint replacements, and other musculoskeletal conditions. These beds feature traction frame compatibility, overhead trapeze bars, and firm mattress platforms that support proper skeletal alignment during healing.',
      'Our orthopedic beds are designed with split frame options and weight-bearing support features that facilitate physical therapy exercises and help patients regain mobility while ensuring proper positioning for optimal recovery.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Traction Compatible' },
      { icon: 'clock', title: 'Mobility Support' },
      { icon: 'settings', title: 'Alignment Features' },
      { icon: 'award', title: 'Recovery Focused' }
    ],
    features: ['Traction frame compatibility', 'Overhead trapeze bar', 'Firm mattress platform', 'Split frame design', 'Weight-bearing support'],
    benefits: ['Proper alignment', 'Mobility assistance', 'Healing support', 'Patient independence'],
    useCases: ['Orthopedic surgery recovery', 'Fracture care', 'Joint replacement recovery', 'Physical therapy']
  },
  'adjustable-hospital-beds': {
    overview: [
      'Adjustable hospital beds offer the ultimate in personalized patient comfort with multiple position presets, memory settings, and modern amenities. These beds cater to facilities focused on enhancing patient experience without compromising on clinical functionality.',
      'Featuring options like massage functions, USB charging ports, and under-bed lighting, our adjustable beds are perfect for private rooms, VIP suites, and long-term care settings where patient comfort significantly impacts recovery outcomes.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Personalized Comfort' },
      { icon: 'clock', title: 'Memory Positions' },
      { icon: 'settings', title: 'Modern Amenities' },
      { icon: 'award', title: 'Premium Experience' }
    ],
    features: ['Multiple position presets', 'Memory settings', 'Massage function options', 'USB charging ports', 'Under-bed lighting'],
    benefits: ['Personalized comfort', 'Enhanced patient experience', 'Modern amenities', 'Flexibility'],
    useCases: ['Private rooms', 'VIP suites', 'Long-term stays', 'Rehabilitation']
  },
  'air-therapy-beds': {
    overview: [
      'Air therapy beds utilize advanced air technology to provide pressure relief and wound healing support for patients at risk of or recovering from pressure ulcers. These specialized beds feature alternating pressure systems and low air loss technology that maintain optimal skin microclimate.',
      'Our air therapy beds offer zone control and automatic adjustment capabilities, reducing the need for manual patient turning while providing superior pressure redistribution essential for wound care and burn recovery patients.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Pressure Prevention' },
      { icon: 'clock', title: 'Automatic Adjustment' },
      { icon: 'settings', title: 'Zone Control' },
      { icon: 'award', title: 'Wound Healing Support' }
    ],
    features: ['Alternating pressure system', 'Low air loss technology', 'Microclimate management', 'Zone control', 'Automatic adjustment'],
    benefits: ['Pressure ulcer prevention', 'Wound healing support', 'Patient comfort', 'Reduced turning needs'],
    useCases: ['Wound care units', 'Burn care', 'Long-term care', 'ICU settings']
  },
  'specialty-therapy-beds': {
    overview: [
      'Specialty therapy beds are designed for patients with specific medical conditions requiring targeted therapeutic interventions. These advanced beds offer specialized therapy modes including pulmonary support, percussion therapy, and rotation therapy to address complex care needs.',
      'Our specialty beds feature customizable configurations that can be tailored to individual patient requirements, supporting improved outcomes for patients with neurological conditions, spinal cord injuries, and critical respiratory needs.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Targeted Therapy' },
      { icon: 'clock', title: 'Multiple Therapy Modes' },
      { icon: 'settings', title: 'Custom Configuration' },
      { icon: 'award', title: 'Improved Outcomes' }
    ],
    features: ['Specialized therapy modes', 'Pulmonary support', 'Percussion therapy', 'Rotation therapy', 'Custom configurations'],
    benefits: ['Targeted treatment', 'Improved outcomes', 'Reduced complications', 'Specialized care'],
    useCases: ['Pulmonary care', 'Neurological units', 'Spinal cord injury', 'Critical care']
  },
  'examination-beds': {
    overview: [
      'Examination beds are essential equipment for medical offices, clinics, and outpatient facilities where patient examinations and minor procedures are performed. These beds feature easy-cleaning surfaces, height adjustment, and practical storage solutions for examination accessories.',
      'Our examination beds are built for durability and hygiene, with paper roll holders, step stool storage, and sturdy construction that supports the high-volume patient flow typical of busy medical practices.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Hygienic Design' },
      { icon: 'clock', title: 'Quick Patient Turnover' },
      { icon: 'settings', title: 'Practical Storage' },
      { icon: 'award', title: 'Durable Construction' }
    ],
    features: ['Paper roll holder', 'Step stool storage', 'Easy cleaning surface', 'Height adjustment', 'Sturdy construction'],
    benefits: ['Efficient examinations', 'Patient accessibility', 'Hygienic design', 'Versatile use'],
    useCases: ['Doctor offices', 'Outpatient clinics', 'Urgent care', 'Physical therapy']
  },
  'recovery-beds': {
    overview: [
      'Recovery beds are designed for post-operative and post-anesthesia care units where patient monitoring and quick access are essential. These beds feature easy-to-reach controls, drainage bag hooks, and IV pole mounts that support the immediate needs of recovering patients.',
      'Our recovery beds prioritize caregiver accessibility and patient safety, with side rail controls and quick positioning features that enable efficient care delivery during the critical post-procedure recovery period.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Post-Op Optimized' },
      { icon: 'clock', title: 'Quick Access Design' },
      { icon: 'settings', title: 'Monitoring Support' },
      { icon: 'award', title: 'Patient Safety Focus' }
    ],
    features: ['Easy patient monitoring', 'Quick positioning', 'Side rail controls', 'Drainage bag hooks', 'IV pole mounts'],
    benefits: ['Safe recovery environment', 'Caregiver accessibility', 'Patient comfort', 'Efficient care'],
    useCases: ['Post-anesthesia care', 'Same-day surgery', 'Recovery rooms', 'Observation units']
  },
  'stretchers-trolleys': {
    overview: [
      'Stretchers and trolleys are essential for safe and efficient patient transport throughout healthcare facilities. Our bed-type stretchers combine the functionality of a patient transport system with the comfort features of a hospital bed.',
      'Designed for emergency readiness and easy maneuverability, these stretchers feature radiolucent tops for imaging, quick-release rails, and compact storage capabilities that make them indispensable in emergency departments and operating rooms.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Easy Maneuverability' },
      { icon: 'clock', title: 'Emergency Ready' },
      { icon: 'settings', title: 'Radiolucent Design' },
      { icon: 'award', title: 'Versatile Transport' }
    ],
    features: ['Easy maneuverability', 'Emergency features', 'Compact storage', 'Quick-release rails', 'Radiolucent top'],
    benefits: ['Rapid patient transport', 'Emergency readiness', 'Space efficiency', 'Versatile use'],
    useCases: ['Emergency departments', 'Operating rooms', 'Radiology', 'Patient transport']
  },
  'homecare-hospital-beds': {
    overview: [
      'Homecare hospital beds bring hospital-quality care into the home environment without sacrificing comfort or aesthetics. These beds feature home-friendly designs with wood grain finishes, quiet operation, and compact footprints that blend seamlessly with residential settings.',
      'Our homecare beds are designed for easy assembly and operation by family caregivers, supporting patients who prefer to receive care at home while maintaining the clinical functionality needed for effective treatment and recovery.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Home-Friendly Design' },
      { icon: 'clock', title: 'Easy Setup' },
      { icon: 'settings', title: 'Quiet Operation' },
      { icon: 'award', title: 'Caregiver Support' }
    ],
    features: ['Home-friendly design', 'Quiet operation', 'Wood grain aesthetics', 'Compact footprint', 'Easy assembly'],
    benefits: ['Home comfort', 'Independence', 'Caregiver support', 'Quality of life'],
    useCases: ['Home healthcare', 'Hospice care', 'Chronic illness management', 'Aging in place']
  },
  'isolation-beds': {
    overview: [
      'Isolation beds are specifically designed for patients with infectious diseases or those requiring protective isolation. These beds feature sealed surfaces, easy decontamination properties, and compatibility with negative pressure room systems.',
      'Our isolation beds incorporate infection control best practices with disposable components and materials that can withstand rigorous cleaning protocols, protecting both patients and healthcare workers in high-risk situations.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Infection Prevention' },
      { icon: 'clock', title: 'Quick Decontamination' },
      { icon: 'settings', title: 'Sealed Surfaces' },
      { icon: 'award', title: 'Staff Protection' }
    ],
    features: ['Negative pressure compatibility', 'Easy decontamination', 'Sealed surfaces', 'Disposable components', 'Infection control features'],
    benefits: ['Infection prevention', 'Staff protection', 'Patient isolation', 'Regulatory compliance'],
    useCases: ['Infectious disease units', 'Quarantine rooms', 'Immunocompromised patients', 'Pandemic response']
  },
  'psychiatric-beds': {
    overview: [
      'Psychiatric beds are engineered with patient safety as the paramount concern, featuring tamper-resistant designs, no ligature points, and weighted construction to prevent tipping or misuse. These beds create a safe therapeutic environment for mental health patients.',
      'Our psychiatric beds balance safety requirements with patient dignity, featuring soft edges and integrated safety features that reduce self-harm risks while maintaining a non-institutional appearance that supports the healing process.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Ligature-Free Design' },
      { icon: 'clock', title: 'Rapid Assessment Access' },
      { icon: 'settings', title: 'Tamper Resistant' },
      { icon: 'award', title: 'Patient Safety First' }
    ],
    features: ['Tamper-resistant design', 'No ligature points', 'Soft edges', 'Weighted construction', 'Integrated safety features'],
    benefits: ['Patient safety', 'Self-harm prevention', 'Durable construction', 'Therapeutic environment'],
    useCases: ['Psychiatric hospitals', 'Mental health units', 'Crisis stabilization', 'Behavioral health']
  },
  'convertible-chair-beds': {
    overview: [
      'Convertible chair beds offer multi-functional versatility, transforming from traditional bed positions to full chair configurations. These innovative beds are ideal for patients who benefit from extended periods of sitting, such as those undergoing dialysis or cardiac care.',
      'Our convertible beds feature smooth transitions between positions, cardiac chair mode, and space-efficient designs that maximize room utility while providing comfortable seating options that support patient mobility and respiratory function.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Multi-Functional Design' },
      { icon: 'clock', title: 'Smooth Transitions' },
      { icon: 'settings', title: 'Space Efficient' },
      { icon: 'award', title: 'Patient Mobility' }
    ],
    features: ['Chair position capability', 'Cardiac chair mode', 'Easy transitions', 'Reclining options', 'Compact design'],
    benefits: ['Versatility', 'Patient mobility', 'Space efficiency', 'Respiratory support'],
    useCases: ['Dialysis centers', 'Outpatient procedures', 'Cardiac care', 'Rehabilitation']
  },
  // New categories for Services Cards
  'fully-electric-bed': {
    overview: [
      'Fully electric hospital beds represent the pinnacle of patient care technology, offering complete motorized control over all bed positions.',
      'With the touch of a button, caregivers and patients can adjust height, head, foot, and Trendelenburg positions.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Maximum Convenience' },
      { icon: 'clock', title: 'Quick Position Changes' },
      { icon: 'settings', title: 'Advanced Safety Features' },
      { icon: 'award', title: 'Premium Construction' }
    ],
    features: ['Full electric controls', 'Programmable positions', 'Trendelenburg capability', 'Low height function'],
    benefits: ['Maximum convenience', 'Reduced injury risk', 'Patient independence'],
    useCases: ['Acute care hospitals', 'ICU settings', 'Post-surgical care']
  },
  'semi-electric-bed': {
    overview: [
      'Semi-electric hospital beds combine the convenience of electric controls with manual reliability.',
      'Perfect for facilities seeking to upgrade from fully manual beds with balanced functionality and cost.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Balanced Cost & Features' },
      { icon: 'clock', title: 'Patient-Controlled Comfort' },
      { icon: 'settings', title: 'Reduced Caregiver Strain' },
      { icon: 'award', title: 'Energy Efficient Design' }
    ],
    features: ['Electric head and foot controls', 'Manual crank height adjustment', 'Pendant controller'],
    benefits: ['Balance of cost and convenience', 'Patient-controlled positioning'],
    useCases: ['Nursing homes', 'Rehabilitation centers', 'Home healthcare']
  },
  'bariatric-bed': {
    overview: [
      'Bariatric hospital beds are engineered to safely accommodate larger patients with weight capacities ranging from 600 to 1000+ pounds.',
      'These heavy-duty beds feature reinforced frames and specialized motors designed for extended durability.'
    ],
    whyChoose: [
      { icon: 'check', title: 'High Weight Capacity' },
      { icon: 'clock', title: 'Patient Dignity Focus' },
      { icon: 'settings', title: 'Heavy-Duty Construction' },
      { icon: 'award', title: 'Caregiver Safety Design' }
    ],
    features: ['High weight capacity (600-1000 lbs)', 'Extra-wide sleep surface', 'Reinforced frame'],
    benefits: ['Patient dignity', 'Caregiver safety', 'Durability'],
    useCases: ['Bariatric care units', 'General hospitals', 'Long-term care']
  },
  'burn-bed': {
    overview: [
      'Specialized burn care beds designed for patients with severe burns requiring specialized therapeutic surfaces.',
      'Features advanced air therapy and pressure relief technology for optimal wound healing.'
    ],
    whyChoose: [
      { icon: 'check', title: 'Burn Care Specialized' },
      { icon: 'clock', title: 'Rapid Healing Support' },
      { icon: 'settings', title: 'Air Therapy Technology' },
      { icon: 'award', title: 'Clinical Excellence' }
    ],
    features: ['Air therapy surface', 'Temperature control', 'Low friction design', 'Easy patient access'],
    benefits: ['Optimal wound healing', 'Reduced pressure points', 'Temperature regulation'],
    useCases: ['Burn units', 'Trauma centers', 'Wound care facilities']
  },
  'ems-stretcher': {
    overview: ['Professional EMS stretchers designed for emergency medical services and ambulance transport.'],
    whyChoose: [{ icon: 'check', title: 'Emergency Ready' }, { icon: 'clock', title: 'Quick Deploy' }, { icon: 'settings', title: 'Lightweight' }, { icon: 'award', title: 'Durable' }],
    features: ['Lightweight aluminum', 'Quick-fold mechanism', 'Ambulance compatible'],
    benefits: ['Rapid deployment', 'Easy handling', 'Patient safety'],
    useCases: ['Ambulances', 'Emergency response', 'Field operations']
  },
  'er-stretcher': {
    overview: ['Emergency room stretchers built for high-volume hospital emergency departments.'],
    whyChoose: [{ icon: 'check', title: 'ER Optimized' }, { icon: 'clock', title: 'Quick Access' }, { icon: 'settings', title: 'Easy Clean' }, { icon: 'award', title: 'Durable' }],
    features: ['IV pole mounts', 'O2 tank holder', 'Side rail controls'],
    benefits: ['Fast patient care', 'Multi-functional', 'Easy maintenance'],
    useCases: ['Emergency departments', 'Urgent care', 'Trauma centers']
  },
  'surgery-stretcher': {
    overview: ['Surgical stretchers designed for operating room patient transport and pre/post-op care.'],
    whyChoose: [{ icon: 'check', title: 'Surgical Grade' }, { icon: 'clock', title: 'OR Compatible' }, { icon: 'settings', title: 'Sterile Design' }, { icon: 'award', title: 'Precision' }],
    features: ['X-ray translucent', 'Easy transfer', 'Sterile surfaces'],
    benefits: ['OR compatibility', 'Safe transfers', 'Infection control'],
    useCases: ['Operating rooms', 'Pre-op', 'Post-op recovery']
  },
  'bariatric-stretcher': {
    overview: ['Heavy-duty stretchers for larger patients with high weight capacity and reinforced construction.'],
    whyChoose: [{ icon: 'check', title: 'High Capacity' }, { icon: 'clock', title: 'Safe Handling' }, { icon: 'settings', title: 'Reinforced' }, { icon: 'award', title: 'Dignified Care' }],
    features: ['1000+ lb capacity', 'Extra-wide platform', 'Heavy-duty wheels'],
    benefits: ['Patient safety', 'Caregiver safety', 'Durability'],
    useCases: ['Bariatric care', 'Emergency transport', 'Hospital transfers']
  },
  'evac-stretcher': {
    overview: ['Emergency evacuation stretchers for rapid patient evacuation during emergencies.'],
    whyChoose: [{ icon: 'check', title: 'Rapid Evac' }, { icon: 'clock', title: 'Quick Deploy' }, { icon: 'settings', title: 'Compact Storage' }, { icon: 'award', title: 'Safety Certified' }],
    features: ['Compact fold', 'Stair-capable', 'Multiple handles'],
    benefits: ['Emergency ready', 'Easy storage', 'Versatile use'],
    useCases: ['Emergency evacuation', 'Disaster response', 'Building safety']
  },
  'bedside-table': {
    overview: ['Hospital bedside tables for patient convenience and comfort during their stay.'],
    whyChoose: [{ icon: 'check', title: 'Patient Comfort' }, { icon: 'clock', title: 'Easy Access' }, { icon: 'settings', title: 'Adjustable' }, { icon: 'award', title: 'Durable' }],
    features: ['Height adjustable', 'Tilt top', 'Lockable wheels'],
    benefits: ['Patient independence', 'Easy meals', 'Organized space'],
    useCases: ['Patient rooms', 'Long-term care', 'Home healthcare']
  },
  'bed-over-table': {
    overview: ['Overbed tables that position over the bed for eating, reading, and activities.'],
    whyChoose: [{ icon: 'check', title: 'Versatile Use' }, { icon: 'clock', title: 'Easy Adjust' }, { icon: 'settings', title: 'Stable Design' }, { icon: 'award', title: 'Quality Built' }],
    features: ['Height adjustable', 'Tilting surface', 'Easy clean top'],
    benefits: ['Meal support', 'Activity surface', 'Patient comfort'],
    useCases: ['Hospitals', 'Nursing homes', 'Home care']
  },
  'wheelchair': {
    overview: ['Medical wheelchairs for patient mobility and transport within healthcare facilities.'],
    whyChoose: [{ icon: 'check', title: 'Mobility Support' }, { icon: 'clock', title: 'Easy Transport' }, { icon: 'settings', title: 'Comfortable' }, { icon: 'award', title: 'Durable' }],
    features: ['Foldable frame', 'Padded armrests', 'Footrests included'],
    benefits: ['Patient mobility', 'Easy storage', 'Comfortable transport'],
    useCases: ['Hospitals', 'Clinics', 'Home care', 'Rehabilitation']
  },
  'patient-recliner': {
    overview: ['Medical recliners for patient comfort during treatments, recovery, and extended stays.'],
    whyChoose: [{ icon: 'check', title: 'Comfort Focused' }, { icon: 'clock', title: 'Multiple Positions' }, { icon: 'settings', title: 'Easy Clean' }, { icon: 'award', title: 'Durable Fabric' }],
    features: ['Multiple recline positions', 'Padded comfort', 'Easy-clean vinyl'],
    benefits: ['Patient comfort', 'Treatment support', 'Versatile use'],
    useCases: ['Infusion centers', 'Dialysis', 'Recovery rooms', 'Patient rooms']
  },
};

const defaultDetails: CategoryInfo = {
  overview: [
    'BEDMED offers premium quality hospital beds designed to meet the highest standards of patient care. Our beds are built with durable materials and advanced features to ensure optimal comfort and safety for patients in any healthcare setting.',
    'Each bed in our collection undergoes rigorous quality testing and is backed by our industry-leading warranty and dedicated customer support team.'
  ],
  whyChoose: [
    { icon: 'check', title: 'Premium Quality Materials' },
    { icon: 'clock', title: 'Quick Turnaround Time' },
    { icon: 'settings', title: 'Expert Technical Support' },
    { icon: 'award', title: 'Industry-Leading Warranty' }
  ],
  features: ['Premium quality materials', 'Advanced safety features', 'Easy maintenance', 'Long-lasting durability'],
  benefits: ['Enhanced patient care', 'Improved comfort', 'Reliable performance', 'Cost-effective solution'],
  useCases: ['Hospitals', 'Clinics', 'Healthcare facilities', 'Home care']
};

const iconMap = {
  check: Check,
  clock: Clock,
  settings: Settings,
  award: Award,
};

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  // Fetch category info from database
  const { data: categoryData } = useQuery({
    queryKey: ['category-item', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_service_card_items')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const category = categoryData ? { name: categoryData.name, slug: categoryData.slug } : null;

  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', slug, category?.name],
    queryFn: async () => {
      const categoryName = category?.name || '';
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoryName)
        .eq('in_stock', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!category,
  });

  if (!slug) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!category && !categoryData) {
    // Show loading or use slug-based fallback for static category pages
    const formattedName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    // Allow static category pages to still work
  }

  // Create a display category with fallback to slug-formatted name
  const displayName = category?.name || slug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Category';
  
  const details = categoryDetails[slug || ''] || defaultDetails;

  return (
    <Layout>
      <SEOHead 
        title={`${displayName} | BEDMED Hospital Beds`}
        description={details.overview[0]}
        keywords={`${displayName}, hospital beds, medical beds, healthcare equipment`}
      />
      
      {/* Hero Section with Background Image */}
      <section className="relative bg-primary/90 text-primary-foreground py-16 md:py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1920)' }}
        />
        <div className="container relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold max-w-3xl">
            {displayName}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Content - Overview */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <div className="space-y-4 text-muted-foreground">
                  {details.overview.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Why Choose Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Why Choose Our {displayName}?</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {details.whyChoose.map((item, index) => {
                    const IconComponent = iconMap[item.icon];
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {details.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Benefits</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {details.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ideal For */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Ideal For</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {details.useCases.map((useCase, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Sidebar - Service Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Service Summary</h3>
                  
                  <Button asChild className="w-full mb-4" size="lg">
                    <Link to="/contact">Request a Quote</Link>
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a href="tel:1-800-BEDMED-1" className="hover:text-primary transition-colors font-medium">
                      (900) 234-5588
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Products in this Category */}
      {(isLoading || (products && products.length > 0)) && (
        <section className="py-12 md:py-16 bg-accent/30">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Products in {displayName}</h2>
            
            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-48 bg-muted rounded-lg mb-4" />
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {product.image_url && (
                        <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-muted perspective-1000">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-contain p-4 rotate-360-hover preserve-3d"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          ${product.price.toLocaleString()}
                        </span>
                        <Button 
                          size="sm"
                          onClick={() => {
                            const cartProduct: Product = {
                              id: product.id,
                              name: product.name,
                              description: product.description || '',
                              price: product.price,
                              image: product.image_url || '',
                              category: product.category,
                              features: product.features || [],
                              inStock: product.in_stock,
                              rating: 4.5,
                              reviews: 0
                            };
                            addToCart(cartProduct);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-primary-foreground/80">
            Our healthcare equipment specialists are ready to help you find the perfect {displayName.toLowerCase()} for your facility.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Contact Our Experts</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="tel:1-800-BEDMED-1">Call 1-800-BEDMED-1</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}