// src/app/services/email.service.ts
import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private serviceID = 'service_y71xfdy';     // ton ID de service
  private templateID = 'template_owycc6o';    // remplace par ton ID de template
  private publicKey = '52er7M8GwEGB9nUI6';   // ta clé publique

  constructor() {}

  sendApprovalEmail(toEmail: string, toName: string, dateDebut: string, dateFin: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_email: toEmail,
      to_name: toName,
      date_debut: dateDebut,
      date_fin: dateFin,
    };

     console.log('EmailJS params:', templateParams); 

    return emailjs.send(this.serviceID, this.templateID, templateParams, this.publicKey);
  }
}
