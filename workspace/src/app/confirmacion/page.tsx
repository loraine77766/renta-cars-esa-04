import { redirect } from 'next/navigation';
import { isValid, parseISO } from 'date-fns';
import type { Metadata } from 'next';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cars } from '@/lib/cars';
import ConfirmationDetails from '@/app/confirmacion/ConfirmationDetails';
import { calculateReservationDetails } from '@/lib/utils';
import type { ReservationDetails as ReservationDetailsType } from '@/lib/types';

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const carId = Array.isArray(searchParams.carId) ? searchParams.carId[0] : searchParams.carId;
  const from = Array.isArray(searchParams.from) ? searchParams.from[0] : searchParams.from;
  const to = Array.isArray(searchParams.to) ? searchParams.to[0] : searchParams.to;
  const pickupLocation = Array.isArray(searchParams.pickupLocation) ? searchParams.pickupLocation[0] : searchParams.pickupLocation;
  const dropoffLocation = Array.isArray(searchParams.dropoffLocation) ? searchParams.dropoffLocation[0] : searchParams.dropoffLocation;
  const pickupTime = Array.isArray(searchParams.pickupTime) ? searchParams.pickupTime[0] : searchParams.pickupTime;
  const dropoffTime = Array.isArray(searchParams.dropoffTime) ? searchParams.dropoffTime[0] : searchParams.dropoffTime;

  if (
    !carId || 
    !from || 
    !to || 
    !pickupLocation || 
    !dropoffLocation || 
    !pickupTime || 
    !dropoffTime
  ) {
    redirect('/');
  }

  const car = cars.find(c => c.id === parseInt(carId, 10));
  if (!car) {
    redirect('/');
  }

  const startDate = parseISO(from);
  const endDate = parseISO(to);

  if (!isValid(startDate) || !isValid(endDate)) {
    redirect('/');
  }
  
  const reservationDetails: ReservationDetailsType | null = calculateReservationDetails(startDate, endDate, car.pricePerDay);

  if (!reservationDetails) {
     redirect('/');
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ConfirmationDetails 
          car={car}
          startDate={startDate}
          endDate={endDate}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          pickupTime={pickupTime}
          dropoffTime={dropoffTime}
          reservationDetails={reservationDetails}
        />
      </main>
      <Footer />
    </div>
  );
}
