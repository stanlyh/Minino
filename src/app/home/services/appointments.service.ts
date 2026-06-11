import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../../auth/services/database.service';

export interface VetAppointment {
  id: number;
  cat_name: string;
  vet_name: string;
  clinic: string;
  appointment_date: string;
  reason: string;
  status: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private readonly db = inject(DatabaseService);

  addAppointment(
    catName: string,
    vetName: string,
    clinic: string,
    appointmentDate: string,
    reason: string
  ): void {
    this.db.run(
      'INSERT INTO vet_appointments (cat_name, vet_name, clinic, appointment_date, reason) VALUES (?, ?, ?, ?, ?)',
      [catName, vetName, clinic, appointmentDate, reason]
    );
  }

  getAppointments(): VetAppointment[] {
    return this.db.getAll(
      'SELECT * FROM vet_appointments ORDER BY appointment_date ASC'
    );
  }
}
