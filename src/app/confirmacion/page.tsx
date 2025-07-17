import { redirect } from 'next/navigation';
import { differenceInCalendarDays, parseISO } from 'date-fns';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cars } from '@/lib/cars';
import ConfirmationDetails from './ConfirmationDetails';

type ConfirmationPageProps = {
  searchParams: {
    carId?: string;
    from?: string;
    to?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    pickupTime?: string;
    dropoffTime?: string;
  };
};

export default function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { carId, from, to, pickupLocation, dropoffLocation, pickupTime, dropoffTime } = searchParams;

  if (!carId || !from || !to || !pickupLocation || !dropoffLocation || !pickupTime || !dropoffTime) {
    redirect('/');
  }

  const car = cars.find(c => c.id === parseInt(carId, 10));

  if (!car) {
    redirect('/');
  }

  const startDate = parseISO(from);
  const endDate = parseISO(to);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    redirect('/');
  }
  
  const rentalDays = differenceInCalendarDays(endDate, startDate) + 1;
  
  const INSURANCE_PER_DAY = 25;
  const FUEL_COST = 59;
  const totalPrice = (rentalDays * car.pricePerDay) + (rentalDays * INSURANCE_PER_DAY) + FUEL_COST;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ConfirmationDetails 
          car={car}
          startDate={startDate}
          endDate={endDate}
          rentalDays={rentalDays}
          totalPrice={totalPrice}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          pickupTime={pickupTime}
          dropoffTime={dropoffTime}
        />
      </main>
      <Footer />
    </div>
  );
}

    