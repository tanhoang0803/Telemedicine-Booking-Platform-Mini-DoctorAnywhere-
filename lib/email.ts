// lib/email.ts — Resend transactional email
import { Resend } from 'resend'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set.')
  return new Resend(key)
}

const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@mini-doctoranywhere.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

// ─── Patient booking confirmation ────────────────────────────────────────────

interface BookingEmailParams {
  to: string
  patientName: string
  doctorName: string
  specialty: string
  preferredDate: string
  language: 'en' | 'vi'
}

export async function sendBookingConfirmation(params: BookingEmailParams) {
  const { to, patientName, doctorName, specialty, preferredDate, language } = params
  const isVi = language === 'vi'
  const subject = isVi ? 'Xác nhận đặt lịch khám' : 'Appointment Booking Confirmation'

  const html = isVi
    ? `<div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px">
        <h2 style="color:#1d4ed8">Xác nhận đặt lịch khám</h2>
        <p>Kính gửi <strong>${patientName}</strong>,</p>
        <p>Yêu cầu đặt lịch của bạn đã được nhận. Chúng tôi sẽ xác nhận trong vòng 24 giờ.</p>
        ${appointmentTable({ doctorName, specialty, preferredDate }, 'vi')}
        <p style="color:#6b7280;font-size:13px">Mini-DoctorAnywhere</p>
      </div>`
    : `<div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px">
        <h2 style="color:#1d4ed8">Appointment Booking Confirmation</h2>
        <p>Dear <strong>${patientName}</strong>,</p>
        <p>Your appointment request has been received. We will confirm within 24 hours.</p>
        ${appointmentTable({ doctorName, specialty, preferredDate }, 'en')}
        <p style="color:#6b7280;font-size:13px">Mini-DoctorAnywhere</p>
      </div>`

  getResend()
    .emails.send({ from: FROM, to, subject, html })
    .catch((err) => console.error('[Resend] booking confirmation:', err))
}

// ─── Admin new booking notification ──────────────────────────────────────────

interface AdminNotificationParams {
  appointmentId: string
  patientName: string
  patientEmail: string
  doctorName: string
  specialty: string
  preferredDate: string
  notes: string
}

export async function sendAdminNotification(params: AdminNotificationParams) {
  if (!ADMIN_EMAIL) return
  const { appointmentId, patientName, patientEmail, doctorName, specialty, preferredDate, notes } = params

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
      <h2 style="color:#1d4ed8;margin-bottom:4px">🆕 New Appointment Request</h2>
      <p style="color:#6b7280;font-size:13px;margin-top:0">Mini-DoctorAnywhere Admin Alert</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">
        <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:140px">Patient</td>
            <td style="padding:8px 12px;border:1px solid #e5e7eb">${patientName}</td></tr>
        <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb">Email</td>
            <td style="padding:8px 12px;border:1px solid #e5e7eb">${patientEmail}</td></tr>
        <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb">Doctor</td>
            <td style="padding:8px 12px;border:1px solid #e5e7eb">${doctorName}</td></tr>
        <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb">Specialty</td>
            <td style="padding:8px 12px;border:1px solid #e5e7eb">${specialty}</td></tr>
        <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb">Date</td>
            <td style="padding:8px 12px;border:1px solid #e5e7eb">${preferredDate}</td></tr>
        <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb">Notes</td>
            <td style="padding:8px 12px;border:1px solid #e5e7eb">${notes || '—'}</td></tr>
        <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb">ID</td>
            <td style="padding:8px 12px;border:1px solid #e5e7eb;font-size:12px;color:#6b7280">${appointmentId}</td></tr>
      </table>
      <p style="margin-top:20px">
        <a href="${process.env.ADMIN_URL ?? process.env.NEXT_PUBLIC_APP_URL + '/en/admin'}"
           style="background:#1d4ed8;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          Open Admin Panel →
        </a>
      </p>
      <p style="color:#9ca3af;font-size:12px;margin-top:24px">Mini-DoctorAnywhere · Admin notification</p>
    </div>`

  getResend()
    .emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `New booking — ${patientName} with ${doctorName}`, html })
    .catch((err) => console.error('[Resend] admin notification:', err))
}

// ─── Patient status update (confirmed / cancelled) ───────────────────────────

interface StatusUpdateParams {
  to: string
  patientName: string
  doctorName: string
  specialty: string
  preferredDate: string
  status: 'confirmed' | 'cancelled'
  language: 'en' | 'vi'
}

export async function sendStatusUpdate(params: StatusUpdateParams) {
  const { to, patientName, doctorName, specialty, preferredDate, status, language } = params
  const isVi = language === 'vi'
  const isConfirmed = status === 'confirmed'

  const subject = isVi
    ? isConfirmed ? '✅ Lịch hẹn đã được xác nhận' : '❌ Lịch hẹn đã bị huỷ'
    : isConfirmed ? '✅ Appointment Confirmed' : '❌ Appointment Cancelled'

  const color = isConfirmed ? '#16a34a' : '#dc2626'
  const icon  = isConfirmed ? '✅' : '❌'

  const html = isVi
    ? `<div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px">
        <h2 style="color:${color}">${icon} ${isConfirmed ? 'Lịch hẹn đã được xác nhận' : 'Lịch hẹn đã bị huỷ'}</h2>
        <p>Kính gửi <strong>${patientName}</strong>,</p>
        <p>${isConfirmed ? 'Lịch hẹn của bạn đã được xác nhận.' : 'Lịch hẹn của bạn đã bị huỷ. Vui lòng liên hệ chúng tôi nếu cần hỗ trợ.'}</p>
        ${appointmentTable({ doctorName, specialty, preferredDate }, 'vi')}
        <p style="color:#6b7280;font-size:13px">Mini-DoctorAnywhere</p>
      </div>`
    : `<div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px">
        <h2 style="color:${color}">${icon} ${isConfirmed ? 'Appointment Confirmed' : 'Appointment Cancelled'}</h2>
        <p>Dear <strong>${patientName}</strong>,</p>
        <p>${isConfirmed ? 'Your appointment has been confirmed.' : 'Your appointment has been cancelled. Please contact us if you need assistance.'}</p>
        ${appointmentTable({ doctorName, specialty, preferredDate }, 'en')}
        <p style="color:#6b7280;font-size:13px">Mini-DoctorAnywhere</p>
      </div>`

  getResend()
    .emails.send({ from: FROM, to, subject, html })
    .catch((err) => console.error('[Resend] status update:', err))
}

// ─── Shared table helper ──────────────────────────────────────────────────────

function appointmentTable(
  { doctorName, specialty, preferredDate }: { doctorName: string; specialty: string; preferredDate: string },
  lang: 'en' | 'vi'
) {
  const labels = lang === 'vi'
    ? { doctor: 'Bác sĩ', specialty: 'Chuyên khoa', date: 'Ngày khám' }
    : { doctor: 'Doctor',  specialty: 'Specialty',   date: 'Date' }

  return `<table style="border-collapse:collapse;width:100%;margin:16px 0">
    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">${labels.doctor}</td>
        <td style="padding:8px;border:1px solid #e5e7eb">${doctorName}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">${labels.specialty}</td>
        <td style="padding:8px;border:1px solid #e5e7eb">${specialty}</td></tr>
    <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">${labels.date}</td>
        <td style="padding:8px;border:1px solid #e5e7eb">${preferredDate}</td></tr>
  </table>`
}
