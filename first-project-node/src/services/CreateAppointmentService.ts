import Appointment from "../models/Appointment";
import { startOfHour } from "date-fns";
import AppointmentsRepository from "../repositories/AppointmentsRepository";
import { getCustomRepository } from "typeorm";


interface RequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  
  public async execute({provider_id, date}: RequestDTO): Promise<Appointment> {
    const appointmentsRepository =  getCustomRepository(AppointmentsRepository); 
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate);
  
    if(findAppointmentInSameDate){
      throw('This appointment is already booked.');
    }
  
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;