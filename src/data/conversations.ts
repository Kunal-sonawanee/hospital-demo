import type { DemoIntent } from '@/lib/types';

/**
 * Scripted calls for the receptionist simulation. Every line is mock content —
 * nothing here reaches a real telephony provider or a real patient.
 */
export const INTENTS: DemoIntent[] = [
  {
    id: 'book',
    label: 'Book Appointment',
    hint: 'Full booking flow → WhatsApp confirmation',
    category: 'Appointment',
    outcome: 'ai-handled',
    booking: {
      patient: 'Rahul Patil',
      mobile: '+91 98XXXXXX42',
      doctorId: 'deshmukh',
      time: '5:30 PM',
      dayOffset: 1,
      reason: 'General consultation',
    },
    turns: [
      { speaker: 'ai', text: 'Namaste, welcome to Uma Hospital. How can I help you today?', duration: 2600 },
      { speaker: 'patient', text: 'I want to book an appointment with Dr. Deshmukh.', duration: 2200 },
      { speaker: 'ai', text: 'Certainly. What day would you prefer?', duration: 1700 },
      { speaker: 'patient', text: 'Tomorrow evening.', duration: 1300 },
      { speaker: 'ai', text: 'Dr. Deshmukh has availability at 5:30 PM and 6:15 PM. Which would you prefer?', duration: 3000 },
      { speaker: 'patient', text: '5:30.', duration: 1100 },
      { speaker: 'ai', text: 'Your appointment is confirmed for tomorrow at 5:30 PM. May I have your name?', duration: 3000 },
      { speaker: 'patient', text: 'Rahul Patil.', duration: 1400 },
      { speaker: 'ai', text: "Thank you, Rahul. I'll send the confirmation to your WhatsApp number.", duration: 2800 },
      { speaker: 'system', text: 'Appointment written to hospital calendar · WhatsApp confirmation queued', duration: 1500 },
    ],
  },
  {
    id: 'availability',
    label: 'Doctor Availability',
    hint: 'Answers OPD availability without staff involvement',
    category: 'Doctor availability',
    outcome: 'ai-handled',
    turns: [
      { speaker: 'ai', text: 'Namaste, welcome to Uma Hospital. How can I help you today?', duration: 2600 },
      { speaker: 'patient', text: 'Is Dr. Kulkarni available today?', duration: 1900 },
      { speaker: 'ai', text: 'Dr. Kulkarni, Orthopaedics, consults today in the evening OPD. Open slots are 6:15 PM, 7:00 PM and 7:45 PM.', duration: 3800 },
      { speaker: 'patient', text: 'And what about Dr. Shaikh?', duration: 1600 },
      { speaker: 'ai', text: 'Dr. Shaikh, Cardiology, is available from 5:00 PM today. Shall I hold a slot for you?', duration: 3200 },
      { speaker: 'patient', text: 'Not right now, I will call back.', duration: 1800 },
      { speaker: 'ai', text: 'Of course. The OPD schedule is also on WhatsApp if you message this number. Thank you for calling Uma Hospital.', duration: 3600 },
    ],
  },
  {
    id: 'timings',
    label: 'Hospital Timings',
    hint: 'The most repetitive call at the front desk',
    category: 'Hospital timings',
    outcome: 'ai-handled',
    turns: [
      { speaker: 'ai', text: 'Namaste, welcome to Uma Hospital. How can I help you today?', duration: 2600 },
      { speaker: 'patient', text: 'What are your OPD timings?', duration: 1600 },
      { speaker: 'ai', text: 'OPD runs 9:00 AM to 1:00 PM and 4:00 PM to 8:00 PM, Monday to Saturday. Emergency care is available 24 hours.', duration: 4000 },
      { speaker: 'patient', text: 'Is Sunday open?', duration: 1300 },
      { speaker: 'ai', text: 'On Sunday only the emergency department and admitted-patient care are open. Would you like me to book an OPD appointment for Monday?', duration: 4000 },
      { speaker: 'patient', text: 'No, thank you.', duration: 1200 },
      { speaker: 'ai', text: 'Thank you for calling Uma Hospital. Take care.', duration: 2000 },
    ],
  },
  {
    id: 'location',
    label: 'Location',
    hint: 'Directions + a map link over WhatsApp',
    category: 'Location',
    outcome: 'ai-handled',
    turns: [
      { speaker: 'ai', text: 'Namaste, welcome to Uma Hospital. How can I help you today?', duration: 2600 },
      { speaker: 'patient', text: 'Where exactly is the hospital?', duration: 1700 },
      { speaker: 'ai', text: 'Uma Hospital is at Trimurti Chowk, Nashik — the entrance is on the main chowk road, with parking behind the building.', duration: 4200 },
      { speaker: 'patient', text: 'Can you send me the location?', duration: 1700 },
      { speaker: 'ai', text: "Yes, I'll send the map link to your WhatsApp number right away.", duration: 2600 },
      { speaker: 'system', text: 'Location card queued for WhatsApp delivery', duration: 1400 },
    ],
  },
  {
    id: 'reschedule',
    label: 'Reschedule Appointment',
    hint: 'Moves an existing booking and re-sends confirmation',
    category: 'Appointment',
    outcome: 'ai-handled',
    booking: {
      patient: 'Sneha Wagh',
      mobile: '+91 99XXXXXX17',
      doctorId: 'joshi',
      time: '6:00 PM',
      dayOffset: 1,
      reason: 'Rescheduled from today',
    },
    turns: [
      { speaker: 'ai', text: 'Namaste, welcome to Uma Hospital. How can I help you today?', duration: 2600 },
      { speaker: 'patient', text: 'I have an appointment with Dr. Joshi today, I need to move it.', duration: 2600 },
      { speaker: 'ai', text: 'I can help with that. May I have the mobile number used for the booking?', duration: 2800 },
      { speaker: 'patient', text: 'Nine nine, double one seven at the end.', duration: 2200 },
      { speaker: 'ai', text: 'Thank you. I can see Sneha Wagh with Dr. Joshi at 5:15 PM today. Would tomorrow evening suit you better?', duration: 4000 },
      { speaker: 'patient', text: 'Yes, tomorrow after six.', duration: 1600 },
      { speaker: 'ai', text: 'Dr. Joshi has 6:00 PM open tomorrow. I have moved your appointment and cancelled the earlier slot.', duration: 3800 },
      { speaker: 'patient', text: 'Thank you.', duration: 1100 },
      { speaker: 'ai', text: 'The updated confirmation is on its way to your WhatsApp. Thank you for calling Uma Hospital.', duration: 3200 },
      { speaker: 'system', text: 'Slot released · Updated confirmation queued', duration: 1500 },
    ],
  },
  {
    id: 'staff',
    label: 'Talk to Staff',
    hint: 'Clean hand-off — the AI never blocks a human',
    category: 'Other',
    outcome: 'transferred',
    turns: [
      { speaker: 'ai', text: 'Namaste, welcome to Uma Hospital. How can I help you today?', duration: 2600 },
      { speaker: 'patient', text: 'I need to ask about my father’s admission and the billing.', duration: 2600 },
      { speaker: 'ai', text: 'Admission and billing queries are handled by our front desk. I will connect you to the staff now.', duration: 3400 },
      { speaker: 'patient', text: 'Okay.', duration: 900 },
      { speaker: 'system', text: 'Transferring to hospital front desk · Ring group: Reception (2 handsets)', duration: 2000 },
      { speaker: 'ai', text: 'Connecting you to Uma Hospital reception. Please stay on the line.', duration: 2600 },
    ],
  },
  {
    id: 'medical',
    label: 'Medical Question',
    hint: 'Safety guardrail — no medical advice, ever',
    category: 'Other',
    outcome: 'transferred',
    turns: [
      { speaker: 'ai', text: 'Namaste, welcome to Uma Hospital. How can I help you today?', duration: 2600 },
      { speaker: 'patient', text: 'My son has fever since morning. Which medicine should I give him?', duration: 3000 },
      { speaker: 'ai', text: "I can help with appointments and hospital information. For medical advice, I'll connect you with hospital staff.", duration: 4000 },
      { speaker: 'system', text: 'Guardrail triggered: clinical query → human hand-off', duration: 1800 },
      { speaker: 'ai', text: 'Dr. Joshi, Paediatrics, also has a 5:15 PM slot today if you would like me to hold it while I transfer you.', duration: 4000 },
      { speaker: 'patient', text: 'Yes please, transfer me.', duration: 1600 },
      { speaker: 'system', text: 'Transferring to hospital front desk', duration: 1600 },
    ],
  },
];

export function intentById(id: string): DemoIntent {
  return INTENTS.find((i) => i.id === id) ?? INTENTS[0];
}
