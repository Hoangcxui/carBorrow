import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      );
    }

    // Fetch from backend API
    const response = await fetch(
      `http://carborrow-backend:5000/api/booking/customer/${encodeURIComponent(email)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Save to backend API
    const response = await fetch('http://carborrow-backend:5000/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicleId: body.vehicleId || 1,
        customerInfo: {
          fullName: body.customerInfo?.fullName || '',
          email: body.customerInfo?.email || '',
          phone: body.customerInfo?.phone || '',
          address: body.customerInfo?.address || ''
        },
        pickupDate: body.pickupDate || new Date().toISOString().split('T')[0],
        dropoffDate: body.dropoffDate || new Date().toISOString().split('T')[0],
        pickupTime: body.pickupTime || '10:00',
        dropoffTime: body.dropoffTime || '10:00',
        pickupLocation: body.pickupLocation || 'Main Office',
        dropoffLocation: body.dropoffLocation || 'Main Office',
        totalAmount: parseFloat(body.totalAmount) || 0,
        paymentMethod: body.paymentMethod || 'qr',
        specialRequests: body.specialRequests || ''
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend error:', errorData);
      throw new Error(`Backend returned ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create booking' },
      { status: 500 }
    );
  }
}
