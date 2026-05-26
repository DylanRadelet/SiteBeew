// src/app/api/contact/route.ts
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
    const body = await req.json()
    const { prenom, nom, email, telephone, service, budget, website, message } = body

    try {
        await resend.emails.send({
            from: 'contact@beew.agency',       // domaine vérifié sur Resend
            to: 'dra@beew.agency',
            replyTo: email,
            subject: `[Beew] Nouveau message de ${prenom} ${nom} — ${service || 'Sans service'}`,
            html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0A0A0A;color:#F5F4F0;padding:32px;border-radius:8px">
          <h2 style="color:#0066FF;margin-bottom:24px">Nouveau message via beew.agency</h2>
          <table style="width:100%;border-collapse:collapse">
            ${[
                    ['Prénom', prenom],
                    ['Nom', nom],
                    ['Email', email],
                    ['Téléphone', telephone || '—'],
                    ['Service', service || '—'],
                    ['Budget', budget || '—'],
                    ['Site web', website || '—'],
                ].map(([k, v]) => `
              <tr>
                <td style="padding:10px 0;color:#9999AA;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;width:130px">${k}</td>
                <td style="padding:10px 0;color:#F5F4F0;font-size:14px">${v}</td>
              </tr>
            `).join('')}
          </table>
          <div style="margin-top:24px;padding:20px;background:#1a1a1a;border-radius:6px;border-left:3px solid #0066FF">
            <p style="color:#9999AA;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px">Message</p>
            <p style="color:#F5F4F0;font-size:14px;line-height:1.6;white-space:pre-wrap">${message}</p>
          </div>
          <p style="margin-top:24px;color:#333340;font-size:12px">Répondre directement à cet email pour contacter ${prenom}.</p>
        </div>
      `,
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 })
    }
}