// lib/email.ts — Resend transactional email (Phase 2)
import { Resend } from 'resend'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set.')
  return new Resend(key)
}

const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@mini-doctoranywhere.com'

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
    ? `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px">
        <h2 style="color:#1d4ed8">Xác nhận đặt lịch khám</h2>
        <p>Kính gửi <strong>${patientName}</strong>,</p>
        <p>Yêu cầu đặt lịch của bạn đã được nhận thành công.</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0">
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">Bác sĩ</td>
              <td style="padding:8px;border:1px solid #e5e7eb">${doctorName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">Chuyên khoa</td>
              <td style="padding:8px;border:1px solid #e5e7eb">${specialty}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">Ngày khám</td>
              <td style="padding:8px;border:1px solid #e5e7eb">${preferredDate}</td></tr>
        </table>
        <p>Chúng tôi sẽ xác nhận lịch hẹn trong vòng 24 giờ.</p>
        <p style="color:#6b7280;font-size:13px">Mini-DoctorAnywhere</p>
      </div>`
    : `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px">
        <h2 style="color:#1d4ed8">Appointment Booking Confirmation</h2>
        <p>Dear <strong>${patientName}</strong>,</p>
        <p>Your appointment request has been received successfully.</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0">
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">Doctor</td>
              <td style="padding:8px;border:1px solid #e5e7eb">${doctorName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">Specialty</td>
              <td style="padding:8px;border:1px solid #e5e7eb">${specialty}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">Date</td>
              <td style="padding:8px;border:1px solid #e5e7eb">${preferredDate}</td></tr>
        </table>
        <p>We will confirm your appointment within 24 hours.</p>
        <p style="color:#6b7280;font-size:13px">Mini-DoctorAnywhere</p>
      </div>`

  // Fire-and-forget — don't let email failure block the HTTP response
  getResend()
    .emails.send({ from: FROM, to, subject, html })
    .catch((err) => console.error('[Resend]', err))
}
