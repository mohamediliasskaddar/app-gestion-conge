import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CongeService } from '../../services/conge.service';
import { Conge } from '../../utils/types';

@Component({
  selector: 'app-conge-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule,],
  templateUrl: './conge-calendar.component.html',
  styleUrls: ['./conge-calendar.component.css'],
  providers: [CongeService]
})
export class CongeCalendarComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    locale: 'fr',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(private congeService: CongeService) {
   this.congeService.getCongesByStatus('Approuvé').subscribe((list: Conge[]) => {
  console.log('✅ Congés reçus :', list);

  this.calendarOptions.events = list.map((c: Conge) => {
    const start = (c.dateDebut as any).seconds
      ? new Date((c.dateDebut as any).seconds * 1000)
      : new Date(c.dateDebut);

    const end = (c.dateFin as any).seconds
      ? new Date((c.dateFin as any).seconds * 1000)
      : new Date(c.dateFin);

    return {
      title: `${c.nom} (${c.type})`,
      start,
      end,
      allDay: true,
      extendedProps: c
    };
  });
});

  }

 handleEventClick(arg: any): void {
  const c: Conge = arg.event.extendedProps;

  // Convert Firestore timestamps to Date if needed
  const dateDebut = (c.dateDebut as any).seconds
    ? new Date((c.dateDebut as any).seconds * 1000)
    : new Date(c.dateDebut);

  const dateFin = (c.dateFin as any).seconds
    ? new Date((c.dateFin as any).seconds * 1000)
    : new Date(c.dateFin);

  const formattedStart = dateDebut.toLocaleDateString('fr-FR');
  const formattedEnd = dateFin.toLocaleDateString('fr-FR');

  alert(
    `Détails du congé de ${c.nom}\n\n` +
    `Type : ${c.type}\n` +
    `Période : ${formattedStart} → ${formattedEnd}\n` +
    `Statut : ${c.statut}`
  );
}

}
