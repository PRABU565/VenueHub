import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ArrowLeft, Calendar, Clock, Users, Sparkles, Utensils, CreditCard, CheckCircle, Loader2 } from 'lucide-react';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAuth();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  // Form State
  const [bookingDate, setBookingDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('');
  const [decoration, setDecoration] = useState(false);
  const [catering, setCatering] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');

  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await api.get(`/venues/detail/${id}`);
        setVenue(res.data.venue);
      } catch (err) {
        showAlert("Failed to load venue details", "error");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id, navigate, showAlert]);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  const calculateTotal = () => {
    let total = venue?.price || 0;
    if (decoration) total += 5000;
    if (catering) total += (guests ? parseInt(guests) * 500 : 0);
    return total;
  };

  const handlePayment = async () => {
    if (!customerName || !mobile) {
      showAlert("Please enter your name and mobile", "error");
      return;
    }
    setBookingLoading(true);
    try {
      const res = await api.post('/bookings', {
        venueId: venue._id,
        bookingDate,
        customerName,
        mobile,
        functionType: "General Booking",
      });
      const activeBooking = res.data.booking;

      // Simulate payment confirmation
      await api.post('/bookings/confirm', {
        bookingId: activeBooking._id,
        transactionId: "pay_sim_" + Math.random().toString(36).substring(7),
      });

      setPaymentSuccess(true);
    } catch (err) {
      showAlert("Booking failed. Try again.", "error");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm w-full border border-gray-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-darkText mb-2 font-display">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-6 text-sm">Your reservation at {venue?.venueName} is successful.</p>
          <div className="bg-orange-50 text-orange-600 p-3 rounded-lg text-sm font-bold mb-6">
            You earned {Math.floor(calculateTotal()/1000)*10} Reward Points!
          </div>
          <button onClick={() => navigate('/bookings')} className="btn-primary w-full py-3">View Bookings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 shadow-sm border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full text-darkText">
            <ArrowLeft size={16} />
          </button>
          <h1 className="font-bold text-darkText">Book {venue?.venueName}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {[
            { id: 1, icon: <Calendar size={14} />, label: "Date" },
            { id: 2, icon: <Users size={14} />, label: "Details" },
            { id: 3, icon: <Sparkles size={14} />, label: "Add-ons" },
            { id: 4, icon: <CreditCard size={14} />, label: "Payment" }
          ].map(s => (
            <div key={s.id} className="flex flex-col items-center gap-1 bg-gray-50">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step >= s.id ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-bold ${step >= s.id ? 'text-primary' : 'text-gray-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
          {/* STEP 1: DATE & TIME */}
          {step === 1 && (
            <div className="space-y-6 animate-slide-down">
              <h2 className="text-lg font-bold text-darkText mb-4 flex items-center gap-2"><Calendar className="text-primary"/> Select Date & Time</h2>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Available Dates</label>
                {venue?.availableDates && venue.availableDates.length > 0 ? (
                  <select value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="modern-input">
                    <option value="">-- Choose Date --</option>
                    {venue.availableDates.map(d => (
                      <option key={d} value={d}>{new Date(d).toLocaleDateString()}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 font-semibold">No dates available.</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Preferred Time</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Morning (9AM-2PM)', 'Evening (4PM-10PM)'].map(t => (
                    <div 
                      key={t}
                      onClick={() => setTime(t)}
                      className={`p-3 border rounded-xl text-center text-sm font-semibold cursor-pointer transition-colors ${time === t ? 'border-primary bg-orange-50 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <button disabled={!bookingDate || !time} onClick={handleNextStep} className="btn-primary w-full py-3 mt-4">Next Step</button>
            </div>
          )}

          {/* STEP 2: GUESTS & DETAILS */}
          {step === 2 && (
            <div className="space-y-6 animate-slide-down">
              <h2 className="text-lg font-bold text-darkText mb-4 flex items-center gap-2"><Users className="text-primary"/> Guest Details</h2>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Guest Count</label>
                <input type="number" value={guests} onChange={e => setGuests(e.target.value)} placeholder={`Max capacity: ${venue?.capacity}`} className="modern-input" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Your Name</label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Full Name" className="modern-input" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Mobile Number</label>
                <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="10-digit number" className="modern-input" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handlePrevStep} className="btn-secondary w-1/3 py-3">Back</button>
                <button disabled={!guests || !customerName || !mobile} onClick={handleNextStep} className="btn-primary w-2/3 py-3">Next Step</button>
              </div>
            </div>
          )}

          {/* STEP 3: ADD-ONS */}
          {step === 3 && (
            <div className="space-y-6 animate-slide-down">
              <h2 className="text-lg font-bold text-darkText mb-4 flex items-center gap-2"><Sparkles className="text-primary"/> Add-ons</h2>
              
              <div 
                onClick={() => setDecoration(!decoration)}
                className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer transition-colors ${decoration ? 'border-primary bg-orange-50' : 'border-gray-200'}`}
              >
                <div>
                  <h3 className="font-bold text-darkText">Decoration Package</h3>
                  <p className="text-xs text-gray-500 mt-1">Basic floral & lighting setup</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary">₹5,000</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 ml-auto ${decoration ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                    {decoration && <div className="w-2 h-2 bg-white rounded-full"/>}
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setCatering(!catering)}
                className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer transition-colors ${catering ? 'border-primary bg-orange-50' : 'border-gray-200'}`}
              >
                <div>
                  <h3 className="font-bold text-darkText">Standard Catering</h3>
                  <p className="text-xs text-gray-500 mt-1">Buffet style (₹500 / person)</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary">₹{(guests ? parseInt(guests) * 500 : 0).toLocaleString()}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 ml-auto ${catering ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                    {catering && <div className="w-2 h-2 bg-white rounded-full"/>}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handlePrevStep} className="btn-secondary w-1/3 py-3">Back</button>
                <button onClick={handleNextStep} className="btn-primary w-2/3 py-3">Review Payment</button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT */}
          {step === 4 && (
            <div className="space-y-6 animate-slide-down">
              <h2 className="text-lg font-bold text-darkText mb-4 flex items-center gap-2"><CreditCard className="text-primary"/> Review & Pay</h2>
              
              <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-600">Venue Rent</span>
                  <span className="font-bold text-darkText">₹{venue?.price.toLocaleString()}</span>
                </div>
                {decoration && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Decoration</span>
                    <span className="font-bold text-darkText">₹5,000</span>
                  </div>
                )}
                {catering && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Catering ({guests} pax)</span>
                    <span className="font-bold text-darkText">₹{(guests ? parseInt(guests) * 500 : 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg">
                  <span className="font-bold text-darkText">Total Amount</span>
                  <span className="font-extrabold text-primary">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handlePrevStep} className="btn-secondary w-1/3 py-3">Back</button>
                <button disabled={bookingLoading} onClick={handlePayment} className="btn-primary w-2/3 py-3 flex justify-center items-center gap-2">
                  {bookingLoading ? <Loader2 size={16} className="animate-spin" /> : `Pay ₹${calculateTotal().toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
