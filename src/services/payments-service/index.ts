import { notFoundError, unauthorizedError } from '@/errors';
import paymentRepository, { PaymentParams } from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import sendEmail from '@/utils/send-email';

async function verifyTicketAndEnrollment(ticketId: number, userId: number) {
  const ticket = await ticketRepository.findTickeyById(ticketId);

  if (!ticket) {
    throw notFoundError();
  }
  const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);

  if (enrollment.userId !== userId) {
    throw unauthorizedError();
  }
}

async function getPaymentByTicketId(userId: number, ticketId: number) {
  await verifyTicketAndEnrollment(ticketId, userId);

  const payment = await paymentRepository.findPaymentByTicketId(ticketId);

  if (!payment) {
    throw notFoundError();
  }
  return payment;
}

async function paymentProcess(ticketId: number, userId: number, cardData: CardPaymentParams) {
  await verifyTicketAndEnrollment(ticketId, userId);

  const ticket = await ticketRepository.findTickeWithTypeById(ticketId);

  const paymentData = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().slice(-4),
  };

  const payment = await paymentRepository.createPayment(ticketId, paymentData);

  await ticketRepository.ticketProcessPayment(ticketId);

  const emailData = await ticketRepository.getEmailInfo(ticketId);

  let ticketType;

  if (emailData) {
    if (emailData.TicketType.isRemote === true) {
      ticketType = 'Online';
    } else if (emailData.TicketType.isRemote === false) {
      ticketType = 'Presencial';
      if (emailData.TicketType.includesHotel === false) {
        ticketType += ' + Sem hotel';
      } else if (emailData.TicketType.includesHotel === true) {
        ticketType += ' + Com hotel';
      }
    }

    const mailInfo = {
      userEmail: emailData.Enrollment.User.email,
      userName: emailData.Enrollment.name,
      ticketType,
      price: emailData.TicketType.price
    };

      sendEmail(mailInfo);
  }


  return payment;
}

export type CardPaymentParams = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

const paymentService = {
  getPaymentByTicketId,
  paymentProcess,
};

export default paymentService;
